import type { MediaConnection, Peer } from 'peerjs';

import { LocalMedia } from './local-media';
import { joinPeerSession } from './peer-session';
import type { CallRole, VideoCallOptions, VideoCallState } from './types';

const createInitialState = (): VideoCallState => ({
  status: 'idle',
  role: null,
  localStream: null,
  remoteStream: null,
  isRemoteConnected: false,
  isCameraEnabled: false,
  isMicrophoneEnabled: false,
  isVirtualBackgroundEnabled: false,
  error: null,
});

/**
 * A single 1-1 video call: one Peer, at most one active MediaConnection.
 * Framework- and DOM-agnostic — consumers read `localStream`/`remoteStream`
 * off state and attach them to their own <video> elements.
 */
export class VideoCall {
  private readonly localMedia: LocalMedia;
  private readonly listeners = new Set<() => void>();

  private state: VideoCallState = createInitialState();
  private peer: Peer | null = null;
  private activeCall: MediaConnection | null = null;
  private readonly watchedPeerConnections = new WeakSet<RTCPeerConnection>();
  private joinGeneration = 0;
  private disposed = false;

  constructor(_options: VideoCallOptions = {}) {
    this.localMedia = new LocalMedia({
      onChange: this.handleLocalMediaChange,
      onTrackReplaced: this.handleTrackReplaced,
    });
  }

  getState = (): VideoCallState => this.state;

  subscribe = (listener: () => void): (() => void) => {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  };

  join = async (roomId: string): Promise<void> => {
    if (this.disposed) {
      throw new Error('Video call is disposed');
    }

    const generation = ++this.joinGeneration;
    this.destroyActiveCall();
    this.destroyPeer();
    this.setState({ status: 'joining', error: null });

    try {
      const { peer, role } = await joinPeerSession(roomId);

      if (this.disposed || generation !== this.joinGeneration) {
        peer.destroy();
        return;
      }

      this.peer = peer;
      this.attachPeerHandlers(peer);
      this.setState({ role, status: 'waiting' });

      if (role === 'guest') {
        this.callPeer(roomId);
      }
    } catch (error: unknown) {
      if (this.disposed || generation !== this.joinGeneration) {
        return;
      }
      this.setState({ status: 'error', error: error as Error });
      throw error;
    }
  };

  leave = (): void => {
    this.joinGeneration += 1;
    this.destroyActiveCall();
    this.destroyPeer();
    // Keep local devices as-is for the lobby preview (e.g. camera stays on if it was on).
    this.setState({
      status: 'left',
      role: null,
      remoteStream: null,
      isRemoteConnected: false,
      error: null,
      localStream: this.localMedia.getStream(),
      isCameraEnabled: this.localMedia.isCameraEnabled(),
      isMicrophoneEnabled: this.localMedia.isMicrophoneEnabled(),
      isVirtualBackgroundEnabled: this.localMedia.isVirtualBackgroundEnabled(),
    });
  };

  dispose = (): void => {
    if (this.disposed) {
      return;
    }

    this.disposed = true;
    this.joinGeneration += 1;
    this.destroyActiveCall();
    this.destroyPeer();
    this.localMedia.dispose();
    this.listeners.clear();
  };

  startCamera = async (): Promise<void> => {
    try {
      await this.localMedia.startCamera();
    } catch (error: unknown) {
      this.setState({ error: error as Error });
      throw error;
    }
  };

  startMicrophone = async (): Promise<void> => {
    await this.localMedia.startMicrophone();
  };

  toggleCamera = async (): Promise<void> => {
    await this.localMedia.toggleCamera();
  };

  toggleMicrophone = async (): Promise<void> => {
    await this.localMedia.toggleMicrophone();
  };

  toggleVirtualBackground = async (): Promise<void> => {
    try {
      await this.localMedia.toggleVirtualBackground();
    } catch (error: unknown) {
      this.setState({ error: error as Error });
    }
  };

  private attachPeerHandlers(peer: Peer) {
    peer.on('call', (call) => {
      if (this.activeCall) {
        call.close();
        return;
      }

      call.answer(this.localMedia.getStream() ?? undefined);
      this.bindActiveCall(call);
    });
  }

  private callPeer(roomId: string) {
    if (!this.peer) {
      return;
    }

    const call = this.peer.call(roomId, this.localMedia.getStream() ?? new MediaStream());
    this.bindActiveCall(call);
  }

  private bindActiveCall(call: MediaConnection) {
    this.activeCall = call;

    call.on('stream', (remoteStream) => {
      if (this.activeCall !== call) {
        return;
      }

      this.watchPeerConnection(call);
      this.watchRemoteStreamEnded(call, remoteStream);
      this.setState({ remoteStream, isRemoteConnected: true, status: 'connected' });
    });

    call.on('close', () => this.handleCallEnded(call));
    call.on('error', () => this.handleCallEnded(call));
    this.watchPeerConnection(call);
  }

  private watchPeerConnection(call: MediaConnection) {
    const peerConnection = call.peerConnection;
    if (!peerConnection || this.watchedPeerConnections.has(peerConnection)) {
      return;
    }

    this.watchedPeerConnections.add(peerConnection);

    peerConnection.addEventListener('connectionstatechange', () => {
      if (this.activeCall !== call) {
        return;
      }

      if (
        peerConnection.connectionState === 'disconnected' ||
        peerConnection.connectionState === 'failed' ||
        peerConnection.connectionState === 'closed'
      ) {
        this.handleCallEnded(call);
      }
    });
  }

  private watchRemoteStreamEnded(call: MediaConnection, remoteStream: MediaStream) {
    const onTrackEnded = () => {
      if (this.activeCall !== call) {
        return;
      }

      if (remoteStream.getTracks().every((track) => track.readyState === 'ended')) {
        this.handleCallEnded(call);
      }
    };

    remoteStream.getTracks().forEach((track) => {
      track.addEventListener('ended', onTrackEnded);
    });
  }

  private handleCallEnded(call: MediaConnection) {
    if (this.activeCall !== call) {
      return;
    }

    this.activeCall = null;
    this.setState({
      remoteStream: null,
      isRemoteConnected: false,
      status: this.peer ? 'waiting' : this.state.status,
    });
  }

  private destroyActiveCall() {
    this.activeCall?.close();
    this.activeCall = null;
  }

  private destroyPeer() {
    this.peer?.destroy();
    this.peer = null;
  }

  private handleLocalMediaChange = () => {
    this.setState({
      localStream: this.localMedia.getStream(),
      isCameraEnabled: this.localMedia.isCameraEnabled(),
      isMicrophoneEnabled: this.localMedia.isMicrophoneEnabled(),
      isVirtualBackgroundEnabled: this.localMedia.isVirtualBackgroundEnabled(),
    });
  };

  private handleTrackReplaced = (kind: 'audio' | 'video', track: MediaStreamTrack | null) => {
    const senders = this.activeCall?.peerConnection?.getSenders();
    const sender = senders?.find((s) => s.track?.kind === kind);
    void sender?.replaceTrack(track);
  };

  private setState(patch: Partial<VideoCallState>) {
    this.state = { ...this.state, ...patch };
    this.listeners.forEach((listener) => {
      listener();
    });
  }
}

export type { CallRole };
