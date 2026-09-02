export type CallRole = 'host' | 'guest';

export type CallStatus = 'idle' | 'joining' | 'waiting' | 'connected' | 'left' | 'error';

export interface VideoCallOptions {
  /** Start the microphone automatically on join. Defaults to true. */
  audio?: boolean;
  /** Start the camera automatically on join. Defaults to true. */
  video?: boolean;
}

export interface VideoCallState {
  status: CallStatus;
  role: CallRole | null;
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  isRemoteConnected: boolean;
  isCameraEnabled: boolean;
  isMicrophoneEnabled: boolean;
  isVirtualBackgroundEnabled: boolean;
  error: Error | null;
}
