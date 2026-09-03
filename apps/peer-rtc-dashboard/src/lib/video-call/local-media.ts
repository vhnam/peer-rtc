import type { VirtualBackground, VirtualBackgroundType } from './virtual-background';

const stopStreamTracks = (stream: MediaStream | null | undefined) => {
  stream?.getTracks().forEach((track) => {
    track.stop();
  });
};

type TrackKind = 'audio' | 'video';

interface LocalMediaCallbacks {
  onChange: () => void;
  onTrackReplaced: (kind: TrackKind, track: MediaStreamTrack | null) => void;
}

/** Owns a single outgoing MediaStream and the raw device streams that feed it. */
export class LocalMedia {
  private stream: MediaStream | null = null;
  private videoDeviceStream: MediaStream | null = null;
  private audioDeviceStream: MediaStream | null = null;
  private processedVideoStream: MediaStream | null = null;
  private virtualBackground: VirtualBackground | null = null;
  private virtualBackgroundEnabled = false;
  private virtualBackgroundType: VirtualBackgroundType = 'blur';
  private publishGeneration = 0;
  private disposed = false;

  constructor(private readonly callbacks: LocalMediaCallbacks) {}

  getStream() {
    return this.stream;
  }

  isCameraEnabled() {
    return this.videoDeviceStream?.getVideoTracks().some((track) => track.readyState === 'live') ?? false;
  }

  isMicrophoneEnabled() {
    return this.audioDeviceStream?.getAudioTracks().some((track) => track.readyState === 'live') ?? false;
  }

  isVirtualBackgroundEnabled() {
    return this.virtualBackgroundEnabled;
  }

  getVirtualBackgroundType() {
    return this.virtualBackgroundType;
  }

  async startCamera() {
    if (this.disposed) {
      return false;
    }

    const nextStream = await navigator.mediaDevices.getUserMedia({ video: true });
    if (this.disposed) {
      stopStreamTracks(nextStream);
      return false;
    }

    stopStreamTracks(this.videoDeviceStream);
    this.videoDeviceStream = nextStream;
    await this.publishCamera();
    return this.isCameraEnabled();
  }

  async startMicrophone() {
    if (this.disposed) {
      return false;
    }

    const nextStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    if (this.disposed) {
      stopStreamTracks(nextStream);
      return false;
    }

    stopStreamTracks(this.audioDeviceStream);
    this.audioDeviceStream = nextStream;
    this.replaceOutgoingTracks('audio', nextStream);
    return this.isMicrophoneEnabled();
  }

  stopCamera() {
    this.stopVirtualBackgroundProcessor();
    stopStreamTracks(this.videoDeviceStream);
    this.videoDeviceStream = null;
    this.removeOutgoingTracks('video');
  }

  stopMicrophone() {
    stopStreamTracks(this.audioDeviceStream);
    this.audioDeviceStream = null;
    this.removeOutgoingTracks('audio');
  }

  stopAll() {
    this.stopCamera();
    this.stopMicrophone();
  }

  async toggleCamera() {
    if (this.isCameraEnabled()) {
      this.stopCamera();
      return;
    }

    await this.startCamera();
  }

  async toggleMicrophone() {
    if (this.isMicrophoneEnabled()) {
      this.stopMicrophone();
      return;
    }

    await this.startMicrophone();
  }

  async setVirtualBackgroundEnabled(enabled: boolean) {
    if (this.disposed) {
      return false;
    }

    this.virtualBackgroundEnabled = enabled;
    this.callbacks.onChange();

    if (!this.videoDeviceStream) {
      return this.virtualBackgroundEnabled;
    }

    await this.publishCamera();
    return this.virtualBackgroundEnabled;
  }

  async setVirtualBackgroundType(type: VirtualBackgroundType) {
    if (this.disposed) {
      return this.virtualBackgroundType;
    }

    const previousType = this.virtualBackgroundType;
    this.virtualBackgroundType = type;
    this.callbacks.onChange();

    if (this.virtualBackgroundEnabled && this.virtualBackground) {
      try {
        await this.virtualBackground.setBackgroundType(type);
      } catch (error: unknown) {
        this.virtualBackgroundType = previousType;
        this.callbacks.onChange();
        throw error;
      }
    }

    return this.virtualBackgroundType;
  }

  async toggleVirtualBackground() {
    return this.setVirtualBackgroundEnabled(!this.virtualBackgroundEnabled);
  }

  dispose() {
    this.disposed = true;
    this.stopVirtualBackgroundProcessor();
    this.virtualBackground?.dispose();
    this.virtualBackground = null;
    stopStreamTracks(this.videoDeviceStream);
    stopStreamTracks(this.audioDeviceStream);
    stopStreamTracks(this.stream);
    this.videoDeviceStream = null;
    this.audioDeviceStream = null;
    this.stream = null;
  }

  private async publishCamera() {
    const generation = ++this.publishGeneration;

    if (!this.videoDeviceStream) {
      this.removeOutgoingTracks('video');
      return;
    }

    if (!this.virtualBackgroundEnabled) {
      this.stopVirtualBackgroundProcessor();
      this.replaceOutgoingTracks('video', this.videoDeviceStream);
      return;
    }

    try {
      const { VirtualBackground } = await import('./virtual-background');
      if (this.disposed || generation !== this.publishGeneration) {
        return;
      }

      this.virtualBackground ??= new VirtualBackground();
      this.processedVideoStream = await this.virtualBackground.start(
        this.videoDeviceStream,
        this.virtualBackgroundType,
      );
      if (this.disposed || generation !== this.publishGeneration || !this.virtualBackgroundEnabled) {
        if (generation === this.publishGeneration) {
          this.stopVirtualBackgroundProcessor();
          if (this.videoDeviceStream) {
            this.replaceOutgoingTracks('video', this.videoDeviceStream);
          }
        }
        return;
      }
      this.replaceOutgoingTracks('video', this.processedVideoStream);
    } catch (error: unknown) {
      if (generation !== this.publishGeneration) {
        return;
      }
      this.virtualBackgroundEnabled = false;
      this.stopVirtualBackgroundProcessor();
      if (this.videoDeviceStream) {
        this.replaceOutgoingTracks('video', this.videoDeviceStream);
      }
      throw error;
    }
  }

  private stopVirtualBackgroundProcessor() {
    this.virtualBackground?.stop();
    this.processedVideoStream = null;
  }

  private deviceTracks(kind: TrackKind) {
    const deviceStream = kind === 'video' ? this.videoDeviceStream : this.audioDeviceStream;
    return new Set(deviceStream?.getTracks() ?? []);
  }

  private replaceOutgoingTracks(kind: TrackKind, nextStream: MediaStream) {
    const stream = this.stream ?? new MediaStream();
    this.stream = stream;
    const keep = this.deviceTracks(kind);
    const nextTracks = nextStream.getTracks().filter((track) => track.kind === kind);
    const nextTrackSet = new Set(nextTracks);

    stream
      .getTracks()
      .filter((track) => track.kind === kind)
      .forEach((track) => {
        stream.removeTrack(track);
        if (!keep.has(track) && !nextTrackSet.has(track)) {
          track.stop();
        }
      });

    nextTracks.forEach((track) => {
      stream.addTrack(track);
    });

    const [track] = stream.getTracks().filter((outgoing) => outgoing.kind === kind);
    this.callbacks.onTrackReplaced(kind, track ?? null);
    this.callbacks.onChange();
  }

  private removeOutgoingTracks(kind: TrackKind) {
    const stream = this.stream;
    if (!stream) {
      return;
    }

    const keep = this.deviceTracks(kind);

    stream
      .getTracks()
      .filter((track) => track.kind === kind)
      .forEach((track) => {
        stream.removeTrack(track);
        if (!keep.has(track)) {
          track.stop();
        }
      });

    if (stream.getTracks().length === 0) {
      this.stream = null;
    }

    this.callbacks.onTrackReplaced(kind, null);
    this.callbacks.onChange();
  }
}
