import { describe, expect, it, vi } from 'vite-plus/test';

import { findRtpSenderForKind } from './find-rtp-sender';

describe('findRtpSenderForKind', () => {
  it('finds a sender by live track kind', () => {
    const videoSender = { track: { kind: 'video' }, replaceTrack: vi.fn() };
    const audioSender = { track: { kind: 'audio' }, replaceTrack: vi.fn() };
    const peerConnection = {
      getSenders: () => [videoSender, audioSender],
      getTransceivers: () => [],
    } as unknown as RTCPeerConnection;

    expect(findRtpSenderForKind(peerConnection, 'video')).toBe(videoSender);
  });

  it('still finds the video sender after replaceTrack(null) muted it', () => {
    const videoSender = { track: null, replaceTrack: vi.fn() };
    const audioSender = { track: { kind: 'audio' }, replaceTrack: vi.fn() };
    const peerConnection = {
      getSenders: () => [videoSender, audioSender],
      getTransceivers: () => [
        {
          sender: videoSender,
          receiver: { track: { kind: 'video' } },
        },
        {
          sender: audioSender,
          receiver: { track: { kind: 'audio' } },
        },
      ],
    } as unknown as RTCPeerConnection;

    // Broken lookup used by the old handleTrackReplaced:
    const broken = peerConnection.getSenders().find((sender) => sender.track?.kind === 'video');
    expect(broken).toBeUndefined();

    expect(findRtpSenderForKind(peerConnection, 'video')).toBe(videoSender);
  });
});
