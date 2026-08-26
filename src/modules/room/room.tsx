import { useRouter } from '@tanstack/react-router';
import { useEffect, useRef, useState } from 'react';

import { Button } from '#/components/ui/button';

import { RoomFooter } from './room-footer';
import RoomHeader from './room-header';
import RoomSheetDetails from './room-sheet-details';
import { useRoomActions } from './room.actions';

interface RoomProps {
  roomId: string;
}

const Room = ({ roomId }: RoomProps) => {
  const router = useRouter();

  const localVideoRef = useRef<HTMLVideoElement>(null);

  const [openInfoSheet, setOpenInfoSheet] = useState(false);
  const [inRoom, setInRoom] = useState(true);

  const {
    isMicrophoneEnabled,
    isCameraEnabled,
    startLocalVideo,
    startLocalAudio,
    toggleMicrophone,
    toggleCamera,
    leaveRoom,
    rejoinRoom,
    joinRoom,
  } = useRoomActions();

  const handleLeaveRoom = () => {
    leaveRoom();
    setInRoom(false);
  };

  const handleRejoinRoom = () => {
    rejoinRoom();
    setInRoom(true);
  };

  const handleBackToHome = () => {
    void router.navigate({ to: '/', replace: true });
  };

  useEffect(() => {
    if (!inRoom) {
      return;
    }

    const localVideo = localVideoRef.current;
    if (!localVideo) {
      return;
    }

    let cancelled = false;

    void (async () => {
      let cameraStarted = false;
      let microphoneStarted = false;

      try {
        cameraStarted = await startLocalVideo(localVideo);
      } catch (error: unknown) {
        console.error(error);
      }

      if (cancelled) {
        return;
      }

      try {
        microphoneStarted = await startLocalAudio();
      } catch (error: unknown) {
        console.error(error);
      }

      if (cancelled || (!cameraStarted && !microphoneStarted)) {
        return;
      }

      try {
        await joinRoom(roomId);
      } catch (error: unknown) {
        console.error(error);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [inRoom, joinRoom, roomId, startLocalAudio, startLocalVideo]);

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

      <div className="flex min-h-0 flex-1 items-center justify-center overflow-hidden px-4 lg:px-6">
        <div className="aspect-video max-h-full w-full max-w-[min(100%,calc((100dvh-8rem)*16/9))] overflow-hidden">
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
