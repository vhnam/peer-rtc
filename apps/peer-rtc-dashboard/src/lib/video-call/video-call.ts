import type { MediaConnection, Peer } from 'peerjs';

import { LocalMedia } from './local-media';
import { joinPeerSession } from './peer-session';
import type { CallRole, VideoCallOptions, VideoCallState } from './types';

const createInitialState = (): VideoCallState => ({
  status: 'idle',
  role: null,
  localStream: null,
  remoteStream: null,
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
  private readonly options: VideoCallOptions;

  private state: VideoCallState = createInitialState();
  private peer: Peer | null = null;
  private activeCall: MediaConnection | null = null;
  private joinGeneration = 0;
  private disposed = false;

  constructor(options: VideoCallOptions = {}) {
    this.options = options;
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
      return;
    }

    const generation = ++this.joinGeneration;
    this.destroyActiveCall();
    this.destroyPeer();
    this.setState({ status: 'joining', error: null });

    let cameraOk = false;
    let micOk = false;

    if (this.options.video !== false) {
      try {
        cameraOk = await this.localMedia.startCamera();
      } catch (error: unknown) {
        this.setState({ error: error as Error });
      }
    }

    if (this.disposed || generation !== this.joinGeneration) {
      return;
    }

    if (this.options.audio !== false) {
      try {
        micOk = await this.localMedia.startMicrophone();
      } catch (error: unknown) {
        this.setState({ error: error as Error });
      }
    }

    if (this.disposed || generation !== this.joinGeneration) {
      return;
    }

    if (!cameraOk && !micOk) {
      this.setState({ status: 'error' });
      return;
    }

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
    }
  };

  leave = (): void => {
    this.joinGeneration += 1;
    this.destroyActiveCall();
    this.destroyPeer();
    this.localMedia.stopAll();
    this.setState({ ...createInitialState(), status: 'left' });
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
      this.setState({ remoteStream, status: 'connected' });
    });

    call.on('close', () => this.handleCallEnded(call));
    call.on('error', () => this.handleCallEnded(call));
  }

  private handleCallEnded(call: MediaConnection) {
    if (this.activeCall !== call) {
      return;
    }

    this.activeCall = null;
    this.setState({ remoteStream: null, status: this.peer ? 'waiting' : this.state.status });
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
