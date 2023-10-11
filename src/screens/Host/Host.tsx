import { useRef } from "react";
import { View, Text, Button } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  RTCPeerConnection,
  RTCSessionDescription,
  RTCIceCandidate,
  RTCView,
} from "react-native-webrtc";

export const HostScreen = () => {
  const peer = useRef<RTCPeerConnection | null>(null);

  const handleCreateSession = async () => {
    peer.current = new RTCPeerConnection({
      iceServers: [
        {
          urls: "stun:stun.l.google.com:19302",
        },
      ],
    });

    const offer = (await peer.current.createOffer({})) as Record<
      string,
      unknown
    >;

    console.log("offer", JSON.stringify(offer));
  };

  return (
    <SafeAreaView>
      <Button title="Create session" onPress={handleCreateSession} />

      <RTCView mirror={true} objectFit={"cover"} streamURL={""} zOrder={0} />
    </SafeAreaView>
  );
};
