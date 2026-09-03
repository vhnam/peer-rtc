import { useEffect, useState } from 'react';

const getAudioInputDevices = async () => {
  const devices = await navigator.mediaDevices.enumerateDevices();
  return devices.filter((device) => device.kind === 'audioinput');
};

const getVideoInputDevices = async () => {
  const devices = await navigator.mediaDevices.enumerateDevices();
  return devices.filter((device) => device.kind === 'videoinput');
};

export const useAudioInputDevices = () => {
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);

  useEffect(() => {
    const updateDevices = async () => {
      try {
        setDevices(await getAudioInputDevices());
      } catch (error: unknown) {
        console.error(error);
      }
    };

    void updateDevices();
    navigator.mediaDevices.addEventListener('devicechange', updateDevices);

    return () => {
      navigator.mediaDevices.removeEventListener('devicechange', updateDevices);
    };
  }, []);

  return devices;
};

export const useVideoInputDevices = () => {
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);

  useEffect(() => {
    const updateDevices = async () => {
      try {
        setDevices(await getVideoInputDevices());
      } catch (error: unknown) {
        console.error(error);
      }
    };

    void updateDevices();
    navigator.mediaDevices.addEventListener('devicechange', updateDevices);

    return () => {
      navigator.mediaDevices.removeEventListener('devicechange', updateDevices);
    };
  }, []);

  return devices;
};

export const getMicrophoneLabel = (device: MediaDeviceInfo, index: number) => {
  return device.label || `Microphone ${index + 1}`;
};

export const getCameraLabel = (device: MediaDeviceInfo, index: number) => {
  return device.label || `Camera ${index + 1}`;
};
