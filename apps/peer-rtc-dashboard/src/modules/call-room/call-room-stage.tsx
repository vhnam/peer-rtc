import { useDragDropMonitor, useDroppable, type DragEndEvent } from '@dnd-kit/react';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';

import {
  CALL_ROOM_STAGE_DROPPABLE_ID,
  LOCAL_MEDIA_HEIGHT,
  LOCAL_MEDIA_INSET,
  LOCAL_MEDIA_WIDTH,
} from '#/constants/call-room.constants';

import { CallRoomLocalMedia } from './call-room-local-media';
import { CallRoomWaiting } from './call-room-waiting';
import type { BindVideoProps, CallRoomStageProps, Position } from './call-room.types';

const bindVideo = ({ video, stream }: BindVideoProps) => {
  if (!video) {
    return;
  }

  video.srcObject = stream;
  if (stream) {
    void video.play().catch(() => {});
  }
};

const getCornerPosition = (container: HTMLElement): Position => ({
  x: Math.max(0, container.clientWidth - LOCAL_MEDIA_WIDTH - LOCAL_MEDIA_INSET),
  y: Math.max(0, container.clientHeight - LOCAL_MEDIA_HEIGHT - LOCAL_MEDIA_INSET),
});

const clampPosition = (position: Position, container: HTMLElement): Position => ({
  x: Math.min(Math.max(0, position.x), Math.max(0, container.clientWidth - LOCAL_MEDIA_WIDTH)),
  y: Math.min(Math.max(0, position.y), Math.max(0, container.clientHeight - LOCAL_MEDIA_HEIGHT)),
});

export const CallRoomStage = ({
  isStartedCall,
  localStream,
  remoteStream,
  isCameraEnabled,
  isWaitingForConsumer,
  placeholder,
  consumerName,
}: CallRoomStageProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
  const { ref: droppableRef } = useDroppable({ id: CALL_ROOM_STAGE_DROPPABLE_ID });

  const isWaitingForConsumerAfterStart = isWaitingForConsumer && isStartedCall;

  useEffect(() => {
    bindVideo({ video: remoteVideoRef.current, stream: remoteStream });
  }, [remoteStream]);

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    const syncCornerPosition = () => {
      if (container.clientWidth === 0 || container.clientHeight === 0) {
        return;
      }

      // Pin to bottom-right of the stage while previewing / waiting. Do not
      // overwrite a user drag once the consumer has joined.
      if (!isStartedCall || isWaitingForConsumer) {
        setPosition(getCornerPosition(container));
      }
    };

    syncCornerPosition();

    const observer = new ResizeObserver(syncCornerPosition);
    observer.observe(container);
    return () => observer.disconnect();
  }, [isWaitingForConsumer, isStartedCall]);

  useDragDropMonitor({
    onDragEnd: (event: DragEndEvent) => {
      if (isWaitingForConsumer || event.canceled) {
        return;
      }

      const container = containerRef.current;
      if (!container) {
        return;
      }

      const { x, y } = event.operation.transform;
      setPosition((current) => clampPosition({ x: current.x + x, y: current.y + y }, container));
    },
  });

  return (
    <div
      id={CALL_ROOM_STAGE_DROPPABLE_ID}
      ref={(node) => {
        containerRef.current = node;
        droppableRef(node);
      }}
      className="relative flex size-full items-center overflow-hidden pb-4"
    >
      <div className="relative flex aspect-video w-full items-center justify-center overflow-hidden">
        {isWaitingForConsumerAfterStart && <CallRoomWaiting consumerName={consumerName} />}

        {!isWaitingForConsumer && (
          <video
            ref={(video) => {
              remoteVideoRef.current = video;
              bindVideo({ video, stream: remoteStream });
            }}
            className="size-full object-cover border-2 border-border bg-grey-500"
            autoPlay
            playsInline
            disablePictureInPicture
          />
        )}
      </div>

      <CallRoomLocalMedia
        isStartedCall={isStartedCall}
        isWaitingForConsumer={isWaitingForConsumer}
        position={position}
        localStream={localStream}
        isCameraEnabled={isCameraEnabled}
        placeholder={placeholder}
      />
    </div>
  );
};
