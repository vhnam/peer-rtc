import { useRouter } from '@tanstack/react-router';
import { useEffect, useRef, useState } from 'react';

import { toast } from '@peer-rtc/ui/components/toast';

import { authClient } from '#/lib/auth-client';
import { socket, useProviderEnded } from '#/lib/socket-client';
import { useVideoCall } from '#/lib/video-call';

import { RoomConfirmEndCallDialog } from './room-confirm-end-call-dialog';
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
  const { data: session } = authClient.useSession();

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  const [openInfoSheet, setOpenInfoSheet] = useState(false);
  const [openConfirmEndCallDialog, setOpenConfirmEndCallDialog] = useState(false);

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

  useProviderEnded(roomId, () => {
    leave();
    void toast.add({
      title: 'Call ended',
      description: 'The provider ended the call',
      type: 'info',
    });
    void router.navigate({ to: '/', replace: true });
  });

  const handleConfirmEndCall = () => {
    socket.emit('consumer_ended', {
      consultRequestId: roomId,
      consumerId: session?.user.id,
    });
    leave();
    void router.navigate({ to: '/', replace: true });
  };

  const handleEndCall = () => {
    setOpenConfirmEndCallDialog(true);
  };

  useEffect(() => {
    void join(roomId).catch((error: unknown) => {
      console.error(error);
    });

    return () => {
      leave();
    };
  }, [join, leave, roomId]);

  useEffect(() => {
    bindVideo(localVideoRef.current, localStream);
  }, [localStream]);

  useEffect(() => {
    bindVideo(remoteVideoRef.current, remoteStream);
  }, [remoteStream]);

  return (
    <div className="flex h-dvh flex-col">
      <RoomHeader roomId={roomId} setOpenInfoSheet={setOpenInfoSheet} />

      <div className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden px-4 lg:px-6">
        <div className="aspect-video max-h-full w-full max-w-[min(100%,calc((100dvh-8rem)*16/9))] overflow-hidden bg-muted">
          <video ref={remoteVideoRef} className="size-full object-cover" autoPlay playsInline disablePictureInPicture />
        </div>

        <div className="absolute right-6 bottom-6 aspect-video w-32 overflow-hidden shadow-lg sm:w-48">
          <video
            ref={localVideoRef}
            className="size-full object-cover"
            autoPlay
            playsInline
            muted
            disablePictureInPicture
          />
        </div>
      </div>

      <RoomFooter
        isMicrophoneEnabled={isMicrophoneEnabled}
        isCameraEnabled={isCameraEnabled}
        toggleMicrophone={() => {
          void toggleMicrophone().catch((error: unknown) => {
            console.error(error);
          });
        }}
        toggleCamera={() => {
          void toggleCamera().catch((error: unknown) => {
            console.error(error);
          });
        }}
        endCall={handleEndCall}
      />

      <RoomSheetDetails roomId={roomId} openInfoSheet={openInfoSheet} setOpenInfoSheet={setOpenInfoSheet} />

      <RoomConfirmEndCallDialog
        open={openConfirmEndCallDialog}
        setOpen={setOpenConfirmEndCallDialog}
        onConfirm={handleConfirmEndCall}
      />
    </div>
  );
};

export default Room;
