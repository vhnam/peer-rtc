import { useCallback, useEffect, useRef, useState } from 'react';

const stopStreamTracks = (stream: MediaStream | null | undefined) => {
  stream?.getTracks().forEach((track) => {
    track.stop();
  });
};

export const useRoomActions = () => {
  const hasLeftRef = useRef(false);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const videoElementRef = useRef<HTMLVideoElement | null>(null);
  const localVideoStreamRef = useRef<MediaStream | null>(null);
  const localAudioStreamRef = useRef<MediaStream | null>(null);

  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [isMicrophoneEnabled, setIsMicrophoneEnabled] = useState(false);
  const [isCameraEnabled, setIsCameraEnabled] = useState(false);

  const replaceTracks = useCallback((kind: 'audio' | 'video', nextStream: MediaStream) => {
    const stream = mediaStreamRef.current ?? new MediaStream();
    mediaStreamRef.current = stream;

    stream
      .getTracks()
      .filter((track) => track.kind === kind)
      .forEach((track) => {
        stream.removeTrack(track);
        track.stop();
      });

    nextStream.getTracks().forEach((track) => {
      stream.addTrack(track);
    });

    setMediaStream(stream);
    return stream;
  }, []);

  const stopTracks = useCallback((kind: 'audio' | 'video') => {
    const stream = mediaStreamRef.current;
    if (!stream) {
      return;
    }

    stream
      .getTracks()
      .filter((track) => track.kind === kind)
      .forEach((track) => {
        stream.removeTrack(track);
        track.stop();
      });

    setMediaStream(stream.getTracks().length > 0 ? stream : null);
  }, []);

  const startLocalVideo = useCallback(
    async (video: HTMLVideoElement) => {
      videoElementRef.current = video;

      if (hasLeftRef.current) {
        return;
      }

      setIsCameraEnabled(false);

      const nextStream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (hasLeftRef.current) {
        stopStreamTracks(nextStream);
        return;
      }

      stopStreamTracks(localVideoStreamRef.current);
      localVideoStreamRef.current = nextStream;
      replaceTracks('video', nextStream);

      video.srcObject = nextStream;
      await video.play();

      if (hasLeftRef.current) {
        stopStreamTracks(nextStream);
        video.srcObject = null;
        return;
      }

      setIsCameraEnabled(nextStream.getVideoTracks().some((track) => track.readyState === 'live'));
    },
    [replaceTracks],
  );

  const startLocalAudio = useCallback(async () => {
    if (hasLeftRef.current) {
      return;
    }

    setIsMicrophoneEnabled(false);

    const nextStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    if (hasLeftRef.current) {
      stopStreamTracks(nextStream);
      return;
    }

    stopStreamTracks(localAudioStreamRef.current);
    localAudioStreamRef.current = nextStream;
    replaceTracks('audio', nextStream);

    setIsMicrophoneEnabled(nextStream.getAudioTracks().some((track) => track.readyState === 'live'));
  }, [replaceTracks]);

  const toggleMicrophone = useCallback(async () => {
    if (isMicrophoneEnabled) {
      stopStreamTracks(localAudioStreamRef.current);
      localAudioStreamRef.current = null;
      stopTracks('audio');
      setIsMicrophoneEnabled(false);
      return;
    }

    await startLocalAudio();
  }, [isMicrophoneEnabled, startLocalAudio, stopTracks]);

  const toggleCamera = useCallback(async () => {
    const video = videoElementRef.current;
    if (!video) {
      return;
    }

    if (isCameraEnabled) {
      stopStreamTracks(localVideoStreamRef.current);
      localVideoStreamRef.current = null;
      stopTracks('video');
      video.srcObject = null;
      setIsCameraEnabled(false);
      return;
    }

    await startLocalVideo(video);
  }, [isCameraEnabled, startLocalVideo, stopTracks]);

  const rejoinRoom = useCallback(() => {
    hasLeftRef.current = false;
  }, []);

  const leaveRoom = useCallback(() => {
    hasLeftRef.current = true;

    stopStreamTracks(localVideoStreamRef.current);
    stopStreamTracks(localAudioStreamRef.current);
    stopStreamTracks(mediaStreamRef.current);

    localVideoStreamRef.current = null;
    localAudioStreamRef.current = null;
    mediaStreamRef.current = null;

    const video = videoElementRef.current;
    if (video?.srcObject instanceof MediaStream) {
      stopStreamTracks(video.srcObject);
      video.srcObject = null;
    }

    setMediaStream(null);
    setIsMicrophoneEnabled(false);
    setIsCameraEnabled(false);
  }, []);

  useEffect(() => {
    hasLeftRef.current = false;

    return () => {
      stopStreamTracks(localVideoStreamRef.current);
      stopStreamTracks(localAudioStreamRef.current);
      stopStreamTracks(mediaStreamRef.current);
    };
  }, []);

  return {
    mediaStream,
    isMicrophoneEnabled,
    isCameraEnabled,
    leaveRoom,
    rejoinRoom,
    startLocalVideo,
    startLocalAudio,
    toggleMicrophone,
    toggleCamera,
  };
};
