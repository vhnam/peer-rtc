import { useEffect } from 'react';
import { io, type Socket } from 'socket.io-client';

import { env } from '#/env';

import { authClient } from './auth-client';

export interface ServerToClientEvents {}

export type ProviderJoinedPayload = {
  consultRequestId: string;
  consumerId: string;
};

export interface ClientToServerEvents {
  provider_joined: (payload: ProviderJoinedPayload, ack: (response: unknown) => void) => void;
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
