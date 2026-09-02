import { useEffect, useRef, useState, useSyncExternalStore } from 'react';

import type { VideoCallOptions, VideoCallState } from '../types';
import { VideoCall } from '../video-call';

const INITIAL_STATE: VideoCallState = {
  status: 'idle',
  role: null,
  localStream: null,
  remoteStream: null,
  isCameraEnabled: false,
  isMicrophoneEnabled: false,
  isVirtualBackgroundEnabled: false,
  error: null,
};

const subscribeNoop = () => () => {};
const getInitialState = () => INITIAL_STATE;
const noop = () => {};
const noopAsync = async () => {};

export const useVideoCall = (options?: VideoCallOptions) => {
  const optionsRef = useRef(options);
  optionsRef.current = options;

  const [call, setCall] = useState<VideoCall | null>(null);

  useEffect(() => {
    const next = new VideoCall(optionsRef.current);
    setCall(next);

    return () => {
      next.dispose();
    };
  }, []);

  const state = useSyncExternalStore(
    call?.subscribe ?? subscribeNoop,
    call?.getState ?? getInitialState,
    getInitialState,
  );

  return {
    ...state,
    join: call?.join ?? noopAsync,
    leave: call?.leave ?? noop,
    startCamera: call?.startCamera ?? noopAsync,
    startMicrophone: call?.startMicrophone ?? noopAsync,
    toggleCamera: call?.toggleCamera ?? noopAsync,
    toggleMicrophone: call?.toggleMicrophone ?? noopAsync,
    toggleVirtualBackground: call?.toggleVirtualBackground ?? noopAsync,
  };
};
