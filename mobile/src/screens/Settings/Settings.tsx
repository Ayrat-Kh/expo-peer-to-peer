import { useRef, useState } from "react";
import { Text, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  RTCPeerConnection,
  RTCView,
  mediaDevices,
  type MediaStream,
} from "react-native-webrtc";

import { Socket } from "peer-lib/services/socket";
import { Peer } from "peer-lib/services/peer";
import { SocketMessageType } from "peer-lib/types/peer";

const clientId = "mobile-user-1";
const remoteClientId = "web-client-1";

export const HostScreen = () => {
  const webSocketRef = useRef<Socket | null>(null);
  const peerRef = useRef<Peer | null>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);

  const handleCreateSession = async () => {
    peerRef.current?.close();
    peerRef.current = null;

    webSocketRef.current?.close();
    webSocketRef.current = null;

    const constraints = {
      audio: true,
      video: true,
    };

    const stream = await mediaDevices.getUserMedia(constraints);

    const socket = new Socket("ws://localhost:5000/ws", clientId);

    const peerBase = new RTCPeerConnection({});
    const peer = new Peer(peerBase as any);

    peer.onIceCandidate = (candidate) => {
      socket.send(SocketMessageType.ICE_CANDIDATE, candidate);
    };

    socket.setEventListener(SocketMessageType.ANSWER, (description) => {
      peer.setRemoteDescription(description);
    });

    socket.setEventListener(SocketMessageType.ICE_CANDIDATE, (candidate) => {
      peer.addIceCandidate(candidate);
    });

    await socket.connect();
    await peer.connect();

    peer.addTrack(stream as any);

    const offer = await peer.createOffer();

    socket.send(SocketMessageType.OFFER, offer);

    webSocketRef.current = socket;
    peerRef.current = peer;
    setLocalStream(stream);
  };

  return (
    <SafeAreaView style={{ padding: 12 }}>
      <Pressable
        style={{
          marginTop: 12,
          paddingVertical: 4,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "grey",
        }}
        onPress={handleCreateSession}
      >
        <Text>Create session</Text>
      </Pressable>

      <RTCView
        style={{ width: "100%", height: 300, marginTop: 12 }}
        objectFit={"cover"}
        streamURL={localStream?.toURL() ?? ""}
        zOrder={0}
      />
    </SafeAreaView>
  );
};
