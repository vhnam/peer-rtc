import type { VirtualBackgroundType } from '#/lib/video-call';
import type { ConsultRequest } from '#/modules/consult-requests/consult-requests.types';

export type Position = {
  x: number;
  y: number;
};

export type BindVideoProps = {
  video: HTMLVideoElement | null;
  stream: MediaStream | null;
};

export type CallRoomProps = {
  consultRequest: ConsultRequest;
};

export type CallRoomStageProps = {
  isStartedCall: boolean;
  isDeclined: boolean;
  isEnded: boolean;
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  isCameraEnabled: boolean;
  isWaitingForConsumer: boolean;
  placeholder: string;
  consumerName: string;
};

export type CallRoomWaitingProps = {
  consumerName: string;
  isDeclined?: boolean;
  isEnded?: boolean;
};

export type CallRoomLocalMediaProps = {
  isStartedCall: boolean;
  isWaitingForConsumer: boolean;
  position: Position;
  localStream: MediaStream | null;
  isCameraEnabled: boolean;
  placeholder: string;
};

export type CallRoomConsumerInfoProps = {
  consultRequest: ConsultRequest;
};

export type CallRoomFooterProps = {
  isStartedCall: boolean;
  canStartCall: boolean;
  isCameraEnabled: boolean;
  isMicrophoneEnabled: boolean;
  isVirtualBackgroundEnabled: boolean;
  virtualBackgroundType: VirtualBackgroundType;
  onStartCall: () => void;
  onEndCall: () => void;
  onToggleCamera: () => void;
  onToggleMicrophone: () => void;
  onToggleVirtualBackground: () => void;
  onVirtualBackgroundTypeChange: (type: VirtualBackgroundType) => void;
};
