import { useNavigate } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { io, type Socket } from 'socket.io-client';

import { env } from '#/env';

import { authClient } from './auth-client';

export type ConsultRequestSocketPayload = {
  consultRequestId: string;
  consumerId?: string;
};

export type ProviderJoinedPayload = ConsultRequestSocketPayload;

export interface ServerToClientEvents {
  provider_joined: (payload: ProviderJoinedPayload) => void;
}

export interface ClientToServerEvents {
  consumer_accepted: (payload: ConsultRequestSocketPayload) => void;
  consumer_declined: (payload: ConsultRequestSocketPayload) => void;
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
  const [isResponding, setIsResponding] = useState(false);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const onProviderJoined = (payload: ProviderJoinedPayload) => {
      if (!payload.consultRequestId) {
        return;
      }

      setInvitation(payload);
    };

    socket.on('provider_joined', onProviderJoined);

    return () => {
      socket.off('provider_joined', onProviderJoined);
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

  return {
    invitation,
    isOpen: invitation !== null,
    isResponding,
    accept,
    decline,
  };
};
