import {
  RTCPeerConnection,
  type RTCIceCandidate,
  type MediaStream,
  type RTCSessionDescription,
} from 'react-native-webrtc';

type PeerConnection = Pick<
  RTCPeerConnection,
  | 'addEventListener'
  | 'addTrack'
  | 'addIceCandidate'
  | 'createAnswer'
  | 'createOffer'
  | 'setLocalDescription'
  | 'setRemoteDescription'
  | 'setConfiguration'
  | 'close'
>;

export class Peer {
  private readonly peerConnection: PeerConnection;

  public onIceCandidate:
    | ((candidate: RTCIceCandidate) => void | Promise<void>)
    | undefined = undefined;

  public onTrack:
    | ((streams: ReadonlyArray<MediaStream>) => void | Promise<void>)
    | undefined = undefined;

  constructor() {
    this.peerConnection = new RTCPeerConnection({
      iceServers: [
        { urls: 'stun:freestun.net:3479' },
        { urls: 'stun:freestun.net:5350' },
        {
          urls: 'turns:freestun.net:5350',
          username: 'free',
          credential: 'free',
        },
      ],
    });
  }

  async connect() {
    this.peerConnection.addEventListener('icecandidate', (event) => {
      if (event.candidate) {
        this.onIceCandidate?.(event.candidate);
      }
    });

    this.peerConnection.addEventListener('track', (event) => {
      if (event.streams) {
        this.onTrack?.(event.streams);
      }
    });
  }

  addTrack(stream: MediaStream): void {
    for (const track of stream.getTracks()) {
      this.peerConnection?.addTrack(track, stream);
    }
  }

  async createOffer(): Promise<RTCSessionDescription> {
    const offer: RTCSessionDescription = await this.peerConnection.createOffer({
      offerToReceiveAudio: true,
      offerToReceiveVideo: true,
    });

    await this.peerConnection.setLocalDescription(offer);

    return offer;
  }

  async createAnswer(
    offer: RTCSessionDescription
  ): Promise<RTCSessionDescription> {
    await this.setRemoteDescription(offer);

    const answer: RTCSessionDescription =
      await this.peerConnection.createAnswer();

    await this.peerConnection.setLocalDescription(answer);

    return answer;
  }

  async addIceCandidate(candidate: RTCIceCandidateInit): Promise<void> {
    await this.peerConnection.addIceCandidate(candidate);
  }

  async setRemoteDescription(
    description: RTCSessionDescription
  ): Promise<void> {
    await this.peerConnection?.setRemoteDescription(description);
  }

  close() {
    this.peerConnection?.close();
  }
}
