import type { Peer } from 'peerjs';

import { useCallback, useEffect, useRef, useState } from 'react';

import { joinPeerRoom } from './join-peer-room';

const stopStreamTracks = (stream: MediaStream | null | undefined) => {
  stream?.getTracks().forEach((track) => {
    track.stop();
  });
};

export const useRoomActions = () => {
  const hasLeftRef = useRef(false);
  const joinGenerationRef = useRef(0);
  const peerRef = useRef<Peer | null>(null);
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
        return false;
      }

      setIsCameraEnabled(false);

      const nextStream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (hasLeftRef.current) {
        stopStreamTracks(nextStream);
        return false;
      }

      stopStreamTracks(localVideoStreamRef.current);
      localVideoStreamRef.current = nextStream;
      replaceTracks('video', nextStream);

      video.srcObject = nextStream;
      await video.play();

      if (hasLeftRef.current) {
        stopStreamTracks(nextStream);
        video.srcObject = null;
        return false;
      }

      const isLive = nextStream.getVideoTracks().some((track) => track.readyState === 'live');
      setIsCameraEnabled(isLive);
      return isLive;
    },
    [replaceTracks],
  );

  const startLocalAudio = useCallback(async () => {
    if (hasLeftRef.current) {
      return false;
    }

    setIsMicrophoneEnabled(false);

    const nextStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    if (hasLeftRef.current) {
      stopStreamTracks(nextStream);
      return false;
    }

    stopStreamTracks(localAudioStreamRef.current);
    localAudioStreamRef.current = nextStream;
    replaceTracks('audio', nextStream);

    const isLive = nextStream.getAudioTracks().some((track) => track.readyState === 'live');
    setIsMicrophoneEnabled(isLive);
    return isLive;
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

  const destroyPeer = useCallback(() => {
    peerRef.current?.destroy();
    peerRef.current = null;
  }, []);

  const joinRoom = useCallback(
    async (roomId: string) => {
      if (hasLeftRef.current) {
        return;
      }

      const generation = joinGenerationRef.current + 1;
      joinGenerationRef.current = generation;
      destroyPeer();

      const peer = await joinPeerRoom(roomId, () => mediaStreamRef.current);

      if (hasLeftRef.current || generation !== joinGenerationRef.current) {
        peer.destroy();
        return;
      }

      peerRef.current = peer;
    },
    [destroyPeer],
  );

  const rejoinRoom = useCallback(() => {
    hasLeftRef.current = false;
  }, []);

  const leaveRoom = useCallback(() => {
    hasLeftRef.current = true;
    joinGenerationRef.current += 1;
    destroyPeer();

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
  }, [destroyPeer]);

  useEffect(() => {
    hasLeftRef.current = false;

    return () => {
      joinGenerationRef.current += 1;
      destroyPeer();
      stopStreamTracks(localVideoStreamRef.current);
      stopStreamTracks(localAudioStreamRef.current);
      stopStreamTracks(mediaStreamRef.current);
    };
  }, [destroyPeer]);

  return {
    mediaStream,
    isMicrophoneEnabled,
    isCameraEnabled,
    leaveRoom,
    rejoinRoom,
    joinRoom,
    startLocalVideo,
    startLocalAudio,
    toggleMicrophone,
    toggleCamera,
  };
};
