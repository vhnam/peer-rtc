type TrackKind = 'audio' | 'video';

/**
 * Resolve the outbound RTP sender for a media kind.
 *
 * After `replaceTrack(null)`, `sender.track` is null, so matching on
 * `sender.track.kind` alone misses the video/audio sender and the next
 * camera/mic enable never reaches the peer connection.
 */
export function findRtpSenderForKind(peerConnection: RTCPeerConnection, kind: TrackKind): RTCRtpSender | undefined {
  const byLiveTrack = peerConnection.getSenders().find((sender) => sender.track?.kind === kind);
  if (byLiveTrack) {
    return byLiveTrack;
  }

  return peerConnection.getTransceivers().find((transceiver) => {
    return transceiver.sender.track?.kind === kind || transceiver.receiver.track.kind === kind;
  })?.sender;
}
