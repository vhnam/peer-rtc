import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react';

import type { VideoCallOptions, VideoCallState, VirtualBackgroundType } from '../types';
import { VideoCall } from '../video-call';

const INITIAL_STATE: VideoCallState = {
  status: 'idle',
  role: null,
  localStream: null,
  remoteStream: null,
  isRemoteConnected: false,
  isCameraEnabled: false,
  isMicrophoneEnabled: false,
  selectedMicrophoneDeviceId: null,
  selectedCameraDeviceId: null,
  isVirtualBackgroundEnabled: false,
  virtualBackgroundType: 'blur',
  error: null,
};

const subscribeNoop = () => () => {};
const getInitialState = () => INITIAL_STATE;

export const useVideoCall = (options?: VideoCallOptions) => {
  const optionsRef = useRef(options);
  optionsRef.current = options;

  const callRef = useRef<VideoCall | null>(null);
  const [call, setCall] = useState<VideoCall | null>(null);

  useEffect(() => {
    const next = new VideoCall(optionsRef.current);
    callRef.current = next;
    setCall(next);

    return () => {
      next.dispose();
      if (callRef.current === next) {
        callRef.current = null;
      }
    };
  }, []);

  const state = useSyncExternalStore(
    call?.subscribe ?? subscribeNoop,
    call?.getState ?? getInitialState,
    getInitialState,
  );

  const join = useCallback(async (roomId: string) => {
    const current = callRef.current;
    if (!current) {
      throw new Error('Video call is not ready');
    }
    await current.join(roomId);
  }, []);

  const leave = useCallback(() => {
    callRef.current?.leave();
  }, []);

  const startCamera = useCallback(async () => {
    await callRef.current?.startCamera();
  }, []);

  const startMicrophone = useCallback(async () => {
    await callRef.current?.startMicrophone();
  }, []);

  const toggleCamera = useCallback(async () => {
    await callRef.current?.toggleCamera();
  }, []);

  const setCameraDevice = useCallback(async (deviceId: string) => {
    await callRef.current?.setCameraDevice(deviceId);
  }, []);

  const toggleMicrophone = useCallback(async () => {
    await callRef.current?.toggleMicrophone();
  }, []);

  const setMicrophoneDevice = useCallback(async (deviceId: string) => {
    await callRef.current?.setMicrophoneDevice(deviceId);
  }, []);

  const toggleVirtualBackground = useCallback(async () => {
    await callRef.current?.toggleVirtualBackground();
  }, []);

  const setVirtualBackgroundType = useCallback(async (type: VirtualBackgroundType) => {
    await callRef.current?.setVirtualBackgroundType(type);
  }, []);

  return {
    ...state,
    join,
    leave,
    startCamera,
    startMicrophone,
    toggleCamera,
    setCameraDevice,
    toggleMicrophone,
    setMicrophoneDevice,
    toggleVirtualBackground,
    setVirtualBackgroundType,
  };
};
