import { useNavigate } from '@tanstack/react-router';
import { useEffect, useRef, useState } from 'react';
import { io, type Socket } from 'socket.io-client';

import { env } from '#/env';

import { authClient } from './auth-client';

export type ConsultRequestSocketPayload = {
  consultRequestId: string;
  consumerId?: string;
};

export type ProviderJoinedPayload = ConsultRequestSocketPayload;

export type ProviderEndedPayload = ConsultRequestSocketPayload;

export type ConsumerNotPickupPayload = ConsultRequestSocketPayload;

export interface ServerToClientEvents {
  provider_joined: (payload: ProviderJoinedPayload) => void;
  provider_ended: (payload: ProviderEndedPayload) => void;
  consumer_not_pickup: (payload: ConsumerNotPickupPayload) => void;
}

export interface ClientToServerEvents {
  consumer_accepted: (payload: ConsultRequestSocketPayload) => void;
  consumer_declined: (payload: ConsultRequestSocketPayload) => void;
  consumer_ended: (payload: ConsultRequestSocketPayload) => void;
}

export type PeerSocket = Socket<ServerToClientEvents, ClientToServerEvents>;

export const socket: PeerSocket = io(env.VITE_PUBLIC_AUTH_URL, {
  withCredentials: true,
  autoConnect: false,
});

export const useSocketConnection = (enabled = true) => {
  const { data: session } = authClient.useSession();
  const shouldConnect = enabled && Boolean(session?.user);

  useEffect(() => {
    if (!shouldConnect) {
      socket.disconnect();
      return;
    }

    const onConnect = () => {
      console.log('connected', socket.id);
    };

    const onConnectError = (error: Error) => {
      console.error(error.message);
    };

    socket.on('connect', onConnect);
    socket.on('connect_error', onConnectError);
    socket.connect();

    return () => {
      socket.off('connect', onConnect);
      socket.off('connect_error', onConnectError);
      socket.disconnect();
    };
  }, [shouldConnect]);

  return socket;
};

export const useProviderJoinedPrompt = (enabled = true) => {
  const navigate = useNavigate();
  const { data: session } = authClient.useSession();
  const [invitation, setInvitation] = useState<ProviderJoinedPayload | null>(null);
  const [missedCall, setMissedCall] = useState<ConsumerNotPickupPayload | null>(null);
  const [isResponding, setIsResponding] = useState(false);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const onProviderJoined = (payload: ProviderJoinedPayload) => {
      if (!payload.consultRequestId) {
        return;
      }

      setMissedCall(null);
      setInvitation(payload);
    };

    const onConsumerNotPickup = (payload: ConsumerNotPickupPayload) => {
      if (!payload.consultRequestId) {
        return;
      }

      setInvitation((current) => {
        if (current?.consultRequestId === payload.consultRequestId) {
          return null;
        }

        return current;
      });
      setMissedCall(payload);
    };

    socket.on('provider_joined', onProviderJoined);
    socket.on('consumer_not_pickup', onConsumerNotPickup);

    return () => {
      socket.off('provider_joined', onProviderJoined);
      socket.off('consumer_not_pickup', onConsumerNotPickup);
    };
  }, [enabled]);

  const close = () => {
    setInvitation(null);
  };

  const accept = async () => {
    if (!invitation) {
      return;
    }

    const roomId = invitation.consultRequestId;
    const payload: ConsultRequestSocketPayload = {
      consultRequestId: roomId,
      consumerId: invitation.consumerId ?? session?.user.id,
    };

    setIsResponding(true);
    socket.emit('consumer_accepted', payload);
    close();
    await navigate({ to: '/$roomId', params: { roomId } });
    setIsResponding(false);
  };

  const decline = () => {
    if (!invitation) {
      return;
    }

    const payload: ConsultRequestSocketPayload = {
      consultRequestId: invitation.consultRequestId,
      consumerId: invitation.consumerId ?? session?.user.id,
    };

    socket.emit('consumer_declined', payload);
    close();
  };

  const dismissMissedCall = () => {
    setMissedCall(null);
  };

  return {
    invitation,
    isOpen: invitation !== null,
    missedCall,
    isMissedCallOpen: missedCall !== null,
    isResponding,
    accept,
    decline,
    dismissMissedCall,
  };
};

export const useProviderEnded = (roomId: string, onEnded: (payload: ProviderEndedPayload) => void, enabled = true) => {
  const onEndedRef = useRef(onEnded);
  onEndedRef.current = onEnded;

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const onProviderEnded = (payload: ProviderEndedPayload) => {
      if (!payload.consultRequestId || payload.consultRequestId !== roomId) {
        return;
      }

      onEndedRef.current(payload);
    };

    socket.on('provider_ended', onProviderEnded);

    return () => {
      socket.off('provider_ended', onProviderEnded);
    };
  }, [enabled, roomId]);
};
