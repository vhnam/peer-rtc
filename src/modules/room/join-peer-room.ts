import type { DataConnection, Peer, PeerErrorType } from 'peerjs';

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

const attachMedia = (peer: Peer, roomId: string, getLocalStream?: () => MediaStream | null) => {
  peer.on('call', (call) => {
    call.answer(getLocalStream?.() ?? undefined);
  });

  if (peer.id === roomId) {
    return;
  }

  const stream = getLocalStream?.();
  if (!stream || stream.getTracks().length === 0) {
    return;
  }

  peer.call(roomId, stream);
};

export const joinPeerRoom = async (roomId: string, getLocalStream?: () => MediaStream | null) => {
  const { Peer, PeerErrorType } = await import('peerjs');

  const hostPeer = new Peer(roomId);

  try {
    await whenPeerOpen(hostPeer);
    attachMedia(hostPeer, roomId, getLocalStream);
    return hostPeer;
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

  attachMedia(guestPeer, roomId, getLocalStream);
  return guestPeer;
};
