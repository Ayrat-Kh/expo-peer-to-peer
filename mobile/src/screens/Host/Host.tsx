import { useRef, useState } from "react";
import { Text, Pressable, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  RTCPeerConnection,
  RTCSessionDescription,
  RTCView,
  mediaDevices,
  type MediaStream,
} from "react-native-webrtc";

export const HostScreen = () => {
  const peerRef = useRef<RTCPeerConnection | null>(null);
  const [answer, setAnswer] = useState<string>("");
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);

  const handleCreateSession = async () => {
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

    setLocalStream(await mediaDevices.getUserMedia(constraints));

    peerRef.current = new RTCPeerConnection({
      iceServers: [
        {
          urls: "stun:stun.l.google.com:19302",
        },
      ],
    });

    peerRef.current.addEventListener("icecandidate", (event) => {
      console.log("event.candidate");
      if (!event.candidate) {
      }
    });

    if (localStream?.getVideoTracks()[0]) {
      peerRef.current?.addTrack(localStream.getVideoTracks()[0]);
    }

    const offer = (await peerRef.current.createOffer(
      {}
    )) as RTCSessionDescription;

    peerRef.current.setLocalDescription(offer);

    console.log("offer", JSON.stringify(offer));
  };

  const handleAnswer = () => {
    peerRef.current?.setRemoteDescription(JSON.parse(answer));
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

      <Text style={{ marginTop: 12 }}>Answer</Text>
      <TextInput
        multiline
        style={{ backgroundColor: "grey", height: 100 }}
        onChangeText={setAnswer}
      />

      <Pressable
        style={{
          marginTop: 12,
          paddingVertical: 4,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "grey",
        }}
        onPress={handleAnswer}
      >
        <Text>Handle answer</Text>
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
