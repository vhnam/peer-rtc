import { useDraggable } from '@dnd-kit/react';
import { useEffect, useRef } from 'react';

import { Avatar, AvatarFallback } from '@peer-rtc/ui/components/avatar';
import { Badge } from '@peer-rtc/ui/components/badge';
import { cn } from '@peer-rtc/ui/lib/utils';

import {
  CALL_ROOM_LOCAL_MEDIA_DRAGGABLE_ID,
  LOCAL_MEDIA_HEIGHT,
  LOCAL_MEDIA_WIDTH,
} from '#/constants/call-room.constants';

import type { BindVideoProps, CallRoomLocalMediaProps } from './call-room.types';

const bindVideo = ({ video, stream }: BindVideoProps) => {
  if (!video) {
    return;
  }

  video.srcObject = stream;
  if (stream) {
    void video.play().catch(() => {});
  }
};

export const CallRoomLocalMedia = ({
  isStartedCall,
  isWaitingForConsumer,
  position,
  localStream,
  isCameraEnabled,
  placeholder,
}: CallRoomLocalMediaProps) => {
  const { ref, isDragging } = useDraggable({
    id: CALL_ROOM_LOCAL_MEDIA_DRAGGABLE_ID,
    disabled: isWaitingForConsumer,
  });
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const isPreviewCentered = isWaitingForConsumer && !isStartedCall;
  const isWaitingPip = isWaitingForConsumer && isStartedCall;

  useEffect(() => {
    bindVideo({ video: videoRef.current, stream: localStream });
  }, [localStream]);

  return (
    <div
      ref={ref}
      className={cn(
        'absolute z-10 overflow-hidden bg-muted select-none',
        'border-2 border-accent',
        'transition-[width,height] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none',
        isPreviewCentered && 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
        isWaitingPip && 'top-auto left-auto right-0 bottom-4',
        !isWaitingForConsumer && 'cursor-grab touch-none',
        !isWaitingForConsumer && isDragging && 'z-20 cursor-grabbing opacity-80',
      )}
      style={{
        width: isPreviewCentered ? LOCAL_MEDIA_WIDTH * 2 : LOCAL_MEDIA_WIDTH,
        height: isPreviewCentered ? LOCAL_MEDIA_HEIGHT * 2 : LOCAL_MEDIA_HEIGHT,
        ...(!isWaitingForConsumer ? { left: position.x, top: position.y } : undefined),
      }}
    >
      {!isCameraEnabled && (
        <div className="absolute inset-0 z-10 flex items-center justify-center">
          <Avatar size="lg">
            <AvatarFallback>{placeholder}</AvatarFallback>
          </Avatar>
        </div>
      )}
      <video
        ref={(video) => {
          videoRef.current = video;
          bindVideo({ video, stream: localStream });
        }}
        className={cn('size-full object-cover', !isCameraEnabled && 'invisible')}
        autoPlay
        playsInline
        muted
        disablePictureInPicture
      />
      <div className="absolute bottom-2 left-2">
        <Badge variant="secondary">You</Badge>
      </div>
    </div>
  );
};
