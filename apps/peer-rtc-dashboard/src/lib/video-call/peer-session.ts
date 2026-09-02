import type { DataConnection, Peer, PeerErrorType } from 'peerjs';

import type { CallRole } from './types';

const whenPeerOpen = (peer: Peer) => {
  if (peer.open) {
    return Promise.resolve(peer.id);
  }

  return new Promise<string>((resolve, reject) => {
    const onOpen = (id: string) => {
      peer.off('error', onError);
      resolve(id);
    };
    const onError = (error: unknown) => {
      peer.off('open', onOpen);
      reject(error);
    };

    peer.once('open', onOpen);
    peer.once('error', onError);
  });
};

const whenDataConnectionOpen = (connection: DataConnection) => {
  if (connection.open) {
    return Promise.resolve();
  }

  return new Promise<void>((resolve, reject) => {
    const onOpen = () => {
      connection.off('error', onError);
      resolve();
    };
    const onError = (error: unknown) => {
      connection.off('open', onOpen);
      reject(error);
    };

    connection.once('open', onOpen);
    connection.once('error', onError);
  });
};

const isUnavailableIdError = (error: unknown, unavailableId: PeerErrorType) => {
  return typeof error === 'object' && error !== null && 'type' in error && error.type === unavailableId;
};

export interface PeerSession {
  peer: Peer;
  role: CallRole;
}

/**
 * Claims `roomId` as a Peer id if free (host); otherwise falls back to a
 * random id and opens a data connection to the room's host (guest).
 */
export const joinPeerSession = async (roomId: string): Promise<PeerSession> => {
  const { Peer, PeerErrorType } = await import('peerjs');

  const hostPeer = new Peer(roomId);

  try {
    await whenPeerOpen(hostPeer);
    return { peer: hostPeer, role: 'host' };
  } catch (error: unknown) {
    hostPeer.destroy();
    if (!isUnavailableIdError(error, PeerErrorType.UnavailableID)) {
      throw error;
    }
  }

  const guestPeer = new Peer();

  try {
    await whenPeerOpen(guestPeer);
    await whenDataConnectionOpen(guestPeer.connect(roomId, { reliable: true }));
  } catch (error: unknown) {
    guestPeer.destroy();
    throw error;
  }

  return { peer: guestPeer, role: 'guest' };
};
