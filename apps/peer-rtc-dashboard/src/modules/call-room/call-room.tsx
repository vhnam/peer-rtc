import { DragDropProvider } from '@dnd-kit/react';
import { useEffect, useState } from 'react';

import { DEFAULT_STAFF_DISPLAY_NAME } from '#/constants/call-room.constants';
import { authClient } from '#/lib/auth-client';
import { socket } from '#/lib/socket-client';
import { useVideoCall } from '#/lib/video-call';
import { getAvatarInitials } from '#/utils/avatar';

import { CallRoomConsumerInfo } from './call-room-consumer-info';
import { CallRoomFooter } from './call-room-footer';
import { CallRoomStage } from './call-room-stage';
import type { CallRoomProps } from './call-room.types';

export const CallRoom = ({ consultRequest }: CallRoomProps) => {
  const [isStartedCall, setIsStartedCall] = useState(false);

  const { data: session } = authClient.useSession();
  const user = session?.user;
  const displayName = user?.name || DEFAULT_STAFF_DISPLAY_NAME;

  const {
    isRemoteConnected,
    localStream,
    remoteStream,
    isCameraEnabled,
    isMicrophoneEnabled,
    isVirtualBackgroundEnabled,
    join,
    leave,
    startCamera,
    startMicrophone,
    toggleCamera,
    toggleMicrophone,
    toggleVirtualBackground,
  } = useVideoCall();

  const isWaitingForConsumer = !isRemoteConnected;
  const canStartCall = consultRequest.status === 'pending' || consultRequest.status === 'accepted';

  useEffect(() => {
    void startCamera().catch((error: unknown) => {
      console.error(error);
    });
    void startMicrophone().catch((error: unknown) => {
      console.error(error);
    });
  }, [startCamera, startMicrophone]);

  const handleStartCall = () => {
    if (!canStartCall) {
      return;
    }

    setIsStartedCall(true);

    void join(consultRequest.id)
      .then(
        () =>
          void socket.emitWithAck('provider_joined', {
            consultRequestId: consultRequest.id,
            consumerId: consultRequest.consumer.id,
          }),
      )
      .catch((error: unknown) => {
        setIsStartedCall(false);
        console.error(error);
      });
  };

  const handleEndCall = () => {
    leave();
    setIsStartedCall(false);
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-full w-full gap-4">
        <DragDropProvider>
          <CallRoomStage
            localStream={localStream}
            remoteStream={remoteStream}
            isCameraEnabled={isCameraEnabled}
            isWaitingForConsumer={isWaitingForConsumer}
            isStartedCall={isStartedCall}
            placeholder={getAvatarInitials(displayName)}
            consumerName={consultRequest.consumer.name}
          />
        </DragDropProvider>
        <CallRoomConsumerInfo consultRequest={consultRequest} />
      </div>

      <CallRoomFooter
        isStartedCall={isStartedCall}
        canStartCall={canStartCall}
        isCameraEnabled={isCameraEnabled}
        isMicrophoneEnabled={isMicrophoneEnabled}
        isVirtualBackgroundEnabled={isVirtualBackgroundEnabled}
        onStartCall={handleStartCall}
        onEndCall={handleEndCall}
        onToggleMicrophone={() => {
          void toggleMicrophone().catch((error: unknown) => {
            console.error(error);
          });
        }}
        onToggleCamera={() => {
          void toggleCamera().catch((error: unknown) => {
            console.error(error);
          });
        }}
        onToggleVirtualBackground={() => {
          void toggleVirtualBackground().catch((error: unknown) => {
            console.error(error);
          });
        }}
      />
    </div>
  );
};
