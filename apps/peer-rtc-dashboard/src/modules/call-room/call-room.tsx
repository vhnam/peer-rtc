import { DragDropProvider } from '@dnd-kit/react';
import { useEffect, useState } from 'react';

import { authClient } from '#/lib/auth-client';
import { useVideoCall } from '#/lib/video-call';
import type { ConsultRequest } from '#/modules/consult-requests/consult-requests.types';
import { getAvatarInitials } from '#/utils/avatar';

import { CallRoomConsumerInfo } from './call-room-consumer-info';
import { CallRoomFooter } from './call-room-footer';
import { CallRoomStage } from './call-room-stage';

interface CallRoomProps {
  consultRequest: ConsultRequest;
}

export const CallRoom = ({ consultRequest }: CallRoomProps) => {
  const [isStartedCall, setIsStartedCall] = useState(false);

  const { data: session } = authClient.useSession();
  const user = session?.user;
  const displayName = user?.name || 'Staff';

  const {
    localStream,
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

  useEffect(() => {
    void startCamera().catch((error: unknown) => {
      console.error(error);
    });
    void startMicrophone().catch((error: unknown) => {
      console.error(error);
    });
  }, [startCamera, startMicrophone]);

  const handleStartCall = () => {
    setIsStartedCall(true);
    void join(consultRequest.requestId).catch((error: unknown) => {
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
            isCameraEnabled={isCameraEnabled}
            placeholder={getAvatarInitials(displayName)}
          />
        </DragDropProvider>
        <CallRoomConsumerInfo consultRequest={consultRequest} />
      </div>

      <CallRoomFooter
        isStartedCall={isStartedCall}
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
