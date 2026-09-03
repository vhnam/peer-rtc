import { DragDropProvider } from '@dnd-kit/react';
import { useEffect, useRef, useState } from 'react';

import { DEFAULT_STAFF_DISPLAY_NAME } from '#/constants/call-room.constants';
import { authClient } from '#/lib/auth-client';
import {
  socket,
  type ConsumerAcceptedPayload,
  type ConsumerDeclinedPayload,
  type ConsumerEndedPayload,
} from '#/lib/socket-client';
import { useVideoCall } from '#/lib/video-call';
import { getAvatarInitials } from '#/utils/avatar';

import { CallRoomConsumerInfo } from './call-room-consumer-info';
import { CallRoomFooter } from './call-room-footer';
import { CallRoomStage } from './call-room-stage';
import type { CallRoomProps } from './call-room.types';

export const CallRoom = ({ consultRequest }: CallRoomProps) => {
  const [isStartedCall, setIsStartedCall] = useState(false);
  const [isDeclined, setIsDeclined] = useState(false);
  const [isEnded, setIsEnded] = useState(false);
  const [hasConsumerAccepted, setHasConsumerAccepted] = useState(false);
  const isAwaitingConsumerRef = useRef(false);

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

  const isWaitingForConsumer = !hasConsumerAccepted || !isRemoteConnected;
  const canStartCall = consultRequest.status === 'pending' || consultRequest.status === 'accepted';

  useEffect(() => {
    void startCamera().catch((error: unknown) => {
      console.error(error);
    });
    void startMicrophone().catch((error: unknown) => {
      console.error(error);
    });
  }, [startCamera, startMicrophone]);

  useEffect(() => {
    const onConsumerAccepted = (payload: ConsumerAcceptedPayload) => {
      if (payload.consultRequestId !== consultRequest.id || !isAwaitingConsumerRef.current) {
        return;
      }

      isAwaitingConsumerRef.current = false;
      setIsDeclined(false);
      setIsEnded(false);
      setHasConsumerAccepted(true);

      void join(consultRequest.id).catch((error: unknown) => {
        setIsStartedCall(false);
        setHasConsumerAccepted(false);
        console.error(error);
      });
    };

    const onConsumerDeclined = (payload: ConsumerDeclinedPayload) => {
      if (payload.consultRequestId !== consultRequest.id || !isAwaitingConsumerRef.current) {
        return;
      }

      isAwaitingConsumerRef.current = false;
      setHasConsumerAccepted(false);
      setIsEnded(false);
      setIsDeclined(true);
      leave();
    };

    const onConsumerEnded = (payload: ConsumerEndedPayload) => {
      if (payload.consultRequestId !== consultRequest.id) {
        return;
      }

      isAwaitingConsumerRef.current = false;
      setHasConsumerAccepted(false);
      setIsDeclined(false);
      setIsEnded(true);
      leave();
    };

    socket.on('consumer_accepted', onConsumerAccepted);
    socket.on('consumer_declined', onConsumerDeclined);
    socket.on('consumer_ended', onConsumerEnded);

    return () => {
      socket.off('consumer_accepted', onConsumerAccepted);
      socket.off('consumer_declined', onConsumerDeclined);
      socket.off('consumer_ended', onConsumerEnded);
    };
  }, [consultRequest.id, join, leave]);

  const handleStartCall = () => {
    if (!canStartCall) {
      return;
    }

    isAwaitingConsumerRef.current = true;
    setIsDeclined(false);
    setIsEnded(false);
    setHasConsumerAccepted(false);
    setIsStartedCall(true);

    void socket
      .emitWithAck('provider_joined', {
        consultRequestId: consultRequest.id,
        consumerId: consultRequest.consumer.id,
      })
      .catch((error: unknown) => {
        isAwaitingConsumerRef.current = false;
        setIsStartedCall(false);
        console.error(error);
      });
  };

  const handleEndCall = () => {
    isAwaitingConsumerRef.current = false;
    setHasConsumerAccepted(false);
    setIsDeclined(false);
    setIsEnded(false);
    setIsStartedCall(false);
    leave();

    socket.emit('provider_ended', {
      consultRequestId: consultRequest.id,
      consumerId: consultRequest.consumer.id,
    });
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
            isDeclined={isDeclined}
            isEnded={isEnded}
            placeholder={getAvatarInitials(displayName)}
            consumerName={consultRequest.consumer.name}
          />
        </DragDropProvider>
        <CallRoomConsumerInfo consultRequest={consultRequest} />
      </div>

      <CallRoomFooter
        isStartedCall={isStartedCall && !isDeclined && !isEnded}
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
