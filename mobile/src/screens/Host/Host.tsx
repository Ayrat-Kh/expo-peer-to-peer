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
      video: {
        mandatory: {
          minWidth: 500, // Provide your own width, height and frame rate here
          minHeight: 300,
          minFrameRate: 30,
        },
      },
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

    socket.addEventListener("message", (ev) => {
      console.log("ev", ev.data);
    });

    await new Promise((resolve) => {
      socket.addEventListener("open", resolve);
    });

    peerConnection.addEventListener("icecandidate", (event) => {
      if (event.candidate) {
        socket.send(
          JSON.stringify({
            ...event.candidate,
            clientId,
          })
        );
      }
    });

    if (stream.getVideoTracks()[0]) {
      peerConnection.addTrack(stream.getVideoTracks()[0]);
    }

    const offer: RTCSessionDescription = await peerConnection.createOffer({});

    socket.send(
      JSON.stringify({
        ...offer,
        clientId,
      })
    );

    peerConnection.setLocalDescription(offer);

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
