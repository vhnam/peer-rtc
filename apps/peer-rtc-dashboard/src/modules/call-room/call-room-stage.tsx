import { useDragDropMonitor, useDraggable, useDroppable, type DragEndEvent } from '@dnd-kit/react';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';

import { Avatar, AvatarFallback } from '@peer-rtc/ui/components/avatar';
import { cn } from '@peer-rtc/ui/lib/utils';

type BindVideoProps = {
  video: HTMLVideoElement | null;
  stream: MediaStream | null;
};

const bindVideo = ({ video, stream }: BindVideoProps) => {
  if (!video) {
    return;
  }

  video.srcObject = stream;
  if (stream) {
    void video.play().catch(() => {});
  }
};

const LOCAL_MEDIA_WIDTH = 240;
const LOCAL_MEDIA_HEIGHT = (LOCAL_MEDIA_WIDTH * 9) / 16;

type Position = {
  x: number;
  y: number;
};

const getDefaultPosition = (container: HTMLElement): Position => ({
  x: Math.max(0, container.clientWidth - LOCAL_MEDIA_WIDTH),
  y: Math.max(0, container.clientHeight - LOCAL_MEDIA_HEIGHT - 16),
});

const clampPosition = (position: Position, container: HTMLElement): Position => ({
  x: Math.min(Math.max(0, position.x), Math.max(0, container.clientWidth - LOCAL_MEDIA_WIDTH)),
  y: Math.min(Math.max(0, position.y), Math.max(0, container.clientHeight - LOCAL_MEDIA_HEIGHT)),
});

export const CallRoomStage = ({
  localStream,
  isCameraEnabled,
  placeholder,
}: {
  localStream: MediaStream | null;
  isCameraEnabled: boolean;
  placeholder: string;
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
  const { ref: droppableRef } = useDroppable({ id: 'draggable-container' });

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    setPosition(getDefaultPosition(container));
  }, []);

  useDragDropMonitor({
    onDragEnd: (event: DragEndEvent) => {
      if (event.canceled) {
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
      id="draggable-container"
      ref={(node) => {
        containerRef.current = node;
        droppableRef(node);
      }}
      className="relative flex size-full items-center overflow-hidden pb-4"
    >
      <div className="flex aspect-video w-full items-center justify-center bg-blue-500">Remote Media</div>
      <LocalMediaPreview
        position={position}
        localStream={localStream}
        isCameraEnabled={isCameraEnabled}
        placeholder={placeholder}
      />
    </div>
  );
};

interface LocalMediaPreviewProps {
  position: Position;
  localStream: MediaStream | null;
  isCameraEnabled: boolean;
  placeholder: string;
}

const LocalMediaPreview = ({ position, localStream, isCameraEnabled, placeholder }: LocalMediaPreviewProps) => {
  const { ref, isDragging } = useDraggable({ id: 'local-media' });
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    bindVideo({ video: videoRef.current, stream: localStream });
  }, [localStream]);

  return (
    <div
      ref={ref}
      className={cn(
        'absolute z-10 cursor-grab touch-none overflow-hidden bg-muted select-none',
        isDragging && 'z-20 cursor-grabbing opacity-80',
      )}
      style={{
        width: LOCAL_MEDIA_WIDTH,
        height: LOCAL_MEDIA_HEIGHT,
        left: position.x,
        top: position.y,
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
    </div>
  );
};
