import { useRef, useState } from "react";
import { Text, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  RTCPeerConnection,
  RTCView,
  mediaDevices,
  type RTCSessionDescription,
  type MediaStream,
} from "react-native-webrtc";

const clientId = "mobile-user-1";
const remoteClientId = "web-client-1";

export const HostScreen = () => {
  const webSocketRef = useRef<WebSocket | null>(null);
  const peerRef = useRef<RTCPeerConnection | null>(null);
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

    const peerConnection = new RTCPeerConnection({
      iceServers: [
        {
          urls: "stun:stun.l.google.com:19302",
        },
      ],
    });

    const socket = new WebSocket(`ws://localhost:5000/ws?clientId=${clientId}`);

    socket.addEventListener("message", async (ev) => {
      const data = JSON.parse(ev.data);

      if (data.messageType === "answer") {
        peerConnection.setRemoteDescription(data.payload);
      }

      if (data.messageType === "ice-candidate") {
        peerConnection.addIceCandidate(data.payload);
      }
    });

    await new Promise((resolve) => {
      socket.addEventListener("open", resolve);
    });

    peerConnection.addEventListener("icecandidate", (event) => {
      if (event.candidate) {
        socket.send(
          JSON.stringify({
            messageType: "ice-candidate",
            recipientClientId: remoteClientId,
            payload: event.candidate,
          })
        );
      }
    });

    for (const track of stream.getTracks()) {
      peerConnection.addTrack(track, stream);
    }

    const offer: RTCSessionDescription = await peerConnection.createOffer({
      offerToReceiveAudio: true,
      offerToReceiveVideo: true,
    });
    await peerConnection.setLocalDescription(offer);

    socket.send(
      JSON.stringify({
        messageType: "offer",
        recipientClientId: remoteClientId,
        payload: offer,
      })
    );

    webSocketRef.current = socket;
    peerRef.current = peerConnection;
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
