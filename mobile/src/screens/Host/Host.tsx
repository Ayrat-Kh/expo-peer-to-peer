import { useRef, useState } from "react";
import { Alert, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { RTCView, mediaDevices, type MediaStream } from "react-native-webrtc";

import { Socket } from "@peer-lib/services/socket";
import { SocketMessageType } from "@peer-lib/types/peer";

import { Button } from "../shared/Button";
import { Peer } from "src/services/peer";
import { useAsyncStorage } from "@react-native-async-storage/async-storage";
import { StorageKeys } from "src/constants/StorageKeys";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "src/navigation/AppNavigationContainer";

export const HostScreen = () => {
  const webSocketRef = useRef<Socket | null>(null);
  const peerRef = useRef<Peer | null>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const { navigate } = useNavigation<NavigationProp<RootStackParamList>>();

  const { getItem: getClientId } = useAsyncStorage(StorageKeys.CLIENT_ID);
  const { getItem: getServerUrl } = useAsyncStorage(StorageKeys.SERVER_URL);

  const notifyEmptyList = () => {
    Alert.alert(
      "Unset server url or clientId",
      "Please set server url or clientId in the Setting screen",
      [
        { text: "Ok", style: "cancel", onPress: () => {} },
        {
          text: "Go to Settings",
          style: "default",
          // If the user confirmed, then we dispatch the action we blocked earlier
          // This will continue the action that had triggered the removal of the screen
          onPress: () => navigate("Settings"),
        },
      ]
    );
  };

  const handleCreateSession = async () => {
    peerRef.current?.close();
    peerRef.current = null;

    webSocketRef.current?.close();
    webSocketRef.current = null;

    const constraints = {
      audio: true,
      video: true,
    };

    const [url, clientId] = await Promise.all([
      await getServerUrl(),
      await getClientId(),
    ]);

    if (!url || !clientId) {
      notifyEmptyList();
      return;
    }

    const stream = await mediaDevices.getUserMedia(constraints);

    const socket = new Socket(url, clientId);

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
    <SafeAreaView style={styles.container}>
      <View style={styles.rtcView}>
        <RTCView
          objectFit={"cover"}
          streamURL={localStream?.toURL() ?? ""}
          zOrder={0}
        />
      </View>

      <Button
        style={styles.buttonPush}
        label={"Create session"}
        onPress={handleCreateSession}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  buttonPush: {
    marginTop: 12,
  },
  container: {
    padding: 12,
    backgroundColor: "#18111B",
    height: "100%",
  },
  rtcView: {
    width: "100%",
    height: 300,
    marginTop: 12,
    backgroundColor: "#48295C",
    color: "#48295C",
    tintColor: "red",
    borderColor: "red",
    textDecorationColor: "red",
    borderRadius: 4,
  },
});
