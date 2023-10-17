type PeerConnection = Pick<
  RTCPeerConnection,
  | "addEventListener"
  | "addTrack"
  | "addIceCandidate"
  | "createAnswer"
  | "createOffer"
  | "setLocalDescription"
  | "setRemoteDescription"
  | "setConfiguration"
  | "close"
>;

export class Peer {
  public onIceCandidate:
    | ((candidate: RTCIceCandidate) => void | Promise<void>)
    | undefined = undefined;

  public onTrack:
    | ((streams: ReadonlyArray<MediaStream>) => void | Promise<void>)
    | undefined = undefined;

  constructor(private readonly peerConnection: PeerConnection) {}

  async connect() {
    this.peerConnection.setConfiguration({
      iceServers: [
        {
          urls: "stun:stun.l.google.com:19302",
        },
      ],
    });

    this.peerConnection.addEventListener("icecandidate", (event) => {
      if (event.candidate) {
        this.onIceCandidate?.(event.candidate);
      }
    });

    this.peerConnection.addEventListener("track", (event) => {
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

  async createOffer(): Promise<RTCSessionDescriptionInit> {
    const offer: RTCSessionDescriptionInit =
      await this.peerConnection.createOffer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: true,
      });

    await this.peerConnection.setLocalDescription(offer);

    return offer;
  }

  async createAnswer(offer: RTCSessionDescriptionInit): Promise<void> {
    if (!this.peerConnection) {
      return;
    }

    await this.setRemoteDescription(offer);

    const answer: RTCSessionDescriptionInit =
      await this.peerConnection.createAnswer({
        // offerToReceiveAudio: true,
        // offerToReceiveVideo: true,
      });

    await this.peerConnection.setLocalDescription(answer);
  }

  async addIceCandidate(candidate: RTCIceCandidateInit): Promise<void> {
    await this.peerConnection.addIceCandidate(candidate);
  }

  async setRemoteDescription(
    description: RTCSessionDescriptionInit
  ): Promise<void> {
    await this.peerConnection?.setRemoteDescription(description);
  }

  close() {
    this.peerConnection?.close();
  }
}
