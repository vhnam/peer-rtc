import { useEffect, useRef, useSyncExternalStore } from 'react';

import type { VideoCallOptions } from '../types';
import { VideoCall } from '../video-call';

export const useVideoCall = (options?: VideoCallOptions) => {
  const callRef = useRef<VideoCall | null>(null);
  callRef.current ??= new VideoCall(options);
  const call = callRef.current;

  const state = useSyncExternalStore(call.subscribe, call.getState, call.getState);

  useEffect(() => {
    return () => {
      call.dispose();
    };
  }, [call]);

  return {
    ...state,
    join: call.join,
    leave: call.leave,
    toggleCamera: call.toggleCamera,
    toggleMicrophone: call.toggleMicrophone,
  };
};
