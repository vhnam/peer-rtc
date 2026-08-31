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
  private disposed = false;

  constructor(private readonly callbacks: LocalMediaCallbacks) {}

  getStream() {
    return this.stream;
  }

  isCameraEnabled() {
    return this.stream?.getVideoTracks().some((track) => track.readyState === 'live') ?? false;
  }

  isMicrophoneEnabled() {
    return this.stream?.getAudioTracks().some((track) => track.readyState === 'live') ?? false;
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
    this.replaceTracks('video', nextStream);
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
    this.replaceTracks('audio', nextStream);
    return this.isMicrophoneEnabled();
  }

  stopCamera() {
    stopStreamTracks(this.videoDeviceStream);
    this.videoDeviceStream = null;
    this.stopTracks('video');
  }

  stopMicrophone() {
    stopStreamTracks(this.audioDeviceStream);
    this.audioDeviceStream = null;
    this.stopTracks('audio');
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

  dispose() {
    this.disposed = true;
    stopStreamTracks(this.videoDeviceStream);
    stopStreamTracks(this.audioDeviceStream);
    stopStreamTracks(this.stream);
    this.videoDeviceStream = null;
    this.audioDeviceStream = null;
    this.stream = null;
  }

  private replaceTracks(kind: TrackKind, nextStream: MediaStream) {
    const stream = this.stream ?? new MediaStream();
    this.stream = stream;

    stream
      .getTracks()
      .filter((track) => track.kind === kind)
      .forEach((track) => {
        stream.removeTrack(track);
        track.stop();
      });

    nextStream.getTracks().forEach((track) => {
      stream.addTrack(track);
    });

    const [track] = stream.getTracks().filter((t) => t.kind === kind);
    this.callbacks.onTrackReplaced(kind, track ?? null);
    this.callbacks.onChange();
  }

  private stopTracks(kind: TrackKind) {
    const stream = this.stream;
    if (!stream) {
      return;
    }

    stream
      .getTracks()
      .filter((track) => track.kind === kind)
      .forEach((track) => {
        stream.removeTrack(track);
        track.stop();
      });

    if (stream.getTracks().length === 0) {
      this.stream = null;
    }

    this.callbacks.onTrackReplaced(kind, null);
    this.callbacks.onChange();
  }
}
