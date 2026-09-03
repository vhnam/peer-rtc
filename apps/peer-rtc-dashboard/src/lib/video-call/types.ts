import type { VirtualBackgroundType } from './virtual-background';

export type CallRole = 'host' | 'guest';

export type CallStatus = 'idle' | 'joining' | 'waiting' | 'connected' | 'left' | 'error';

export type { VirtualBackgroundType };

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
  selectedMicrophoneDeviceId: string | null;
  selectedCameraDeviceId: string | null;
  isVirtualBackgroundEnabled: boolean;
  virtualBackgroundType: VirtualBackgroundType;
  error: Error | null;
}
