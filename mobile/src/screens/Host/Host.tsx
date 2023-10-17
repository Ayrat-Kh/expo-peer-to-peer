import { useRef, useState } from "react";
import { Text, Pressable, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { RTCView, mediaDevices, type MediaStream } from "react-native-webrtc";

import { Socket } from "@peer-lib/services/socket";
import { SocketMessageType } from "@peer-lib/types/peer";
import { Peer } from "src/services/peer";

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

    const peer = new Peer();

    peer.onIceCandidate = (candidate) => {
      socket.send(SocketMessageType.ICE_CANDIDATE, candidate as any);
    };

    socket.setEventListener(SocketMessageType.ANSWER, (description) => {
      peer.setRemoteDescription(description as any);
    });

    socket.setEventListener(SocketMessageType.ICE_CANDIDATE, (candidate) => {
      peer.addIceCandidate(candidate);
    });

    await socket.connect();
    await peer.connect();

    peer.addTrack(stream as any);

    const offer = await peer.createOffer();

    socket.send(SocketMessageType.OFFER, offer as any);

    webSocketRef.current = socket;
    peerRef.current = peer;
    setLocalStream(stream);
  };

  return (
    <SafeAreaView style={style.container}>
      <Pressable style={style.createSession} onPress={handleCreateSession}>
        <Text>Create session</Text>
      </Pressable>

      <RTCView
        style={style.rtcView}
        objectFit={"cover"}
        streamURL={localStream?.toURL() ?? ""}
        zOrder={0}
      />
    </SafeAreaView>
  );
};

const style = StyleSheet.create({
  container: {
    padding: 12,
  },
  createSession: {
    marginTop: 12,
    paddingVertical: 4,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "grey",
  },
  rtcView: {
    width: "100%",
    height: 300,
    marginTop: 12,
  },
});
