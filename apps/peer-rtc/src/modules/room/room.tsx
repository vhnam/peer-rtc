import { useRouter } from '@tanstack/react-router';
import { useEffect, useRef, useState } from 'react';

import { Button } from '@peer-rtc/ui/components/button';

import { useVideoCall } from '#/lib/video-call';

import { RoomFooter } from './room-footer';
import RoomHeader from './room-header';
import RoomSheetDetails from './room-sheet-details';

interface RoomProps {
  roomId: string;
}

const bindVideo = (video: HTMLVideoElement | null, stream: MediaStream | null) => {
  if (!video) {
    return;
  }

  video.srcObject = stream;
  if (stream) {
    void video.play().catch(() => {});
  }
};

const Room = ({ roomId }: RoomProps) => {
  const router = useRouter();

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  const [openInfoSheet, setOpenInfoSheet] = useState(false);
  const [inRoom, setInRoom] = useState(true);

  const {
    localStream,
    remoteStream,
    isMicrophoneEnabled,
    isCameraEnabled,
    join,
    leave,
    toggleMicrophone,
    toggleCamera,
  } = useVideoCall();

  const handleLeaveRoom = () => {
    leave();
    setInRoom(false);
  };

  const handleRejoinRoom = () => {
    setInRoom(true);
  };

  const handleBackToHome = () => {
    void router.navigate({ to: '/', replace: true });
  };

  useEffect(() => {
    if (!inRoom) {
      return;
    }

    void join(roomId).catch((error: unknown) => {
      console.error(error);
    });
  }, [inRoom, join, roomId]);

  useEffect(() => {
    bindVideo(localVideoRef.current, localStream);
  }, [localStream]);

  useEffect(() => {
    bindVideo(remoteVideoRef.current, remoteStream);
  }, [remoteStream]);

  if (!inRoom) {
    return (
      <div className="flex h-dvh flex-col items-center justify-center">
        <div className="flex gap-4">
          <Button variant="outline" onClick={handleRejoinRoom}>
            Rejoin
          </Button>
          <Button onClick={handleBackToHome}>Back to home</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-dvh flex-col">
      <RoomHeader roomId={roomId} setOpenInfoSheet={setOpenInfoSheet} />

      <div className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden px-4 lg:px-6">
        <div className="aspect-video max-h-full w-full max-w-[min(100%,calc((100dvh-8rem)*16/9))] overflow-hidden bg-muted">
          <video ref={remoteVideoRef} className="size-full object-cover" autoPlay playsInline />
        </div>

        <div className="absolute right-6 bottom-6 aspect-video w-32 overflow-hidden rounded-md shadow-lg sm:w-48">
          <video ref={localVideoRef} className="size-full object-cover" autoPlay playsInline muted />
        </div>
      </div>

      <RoomFooter
        isMicrophoneEnabled={isMicrophoneEnabled}
        isCameraEnabled={isCameraEnabled}
        toggleMicrophone={toggleMicrophone}
        toggleCamera={toggleCamera}
        leaveRoom={handleLeaveRoom}
      />

      <RoomSheetDetails roomId={roomId} openInfoSheet={openInfoSheet} setOpenInfoSheet={setOpenInfoSheet} />
    </div>
  );
};

export default Room;
