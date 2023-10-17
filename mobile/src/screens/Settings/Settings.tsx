import React from "react";
import { useLayoutEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAsyncStorage } from "@react-native-async-storage/async-storage";

import { StorageKeys } from "src/constants/StorageKeys";
import { Input } from "../shared/Input";
import { StyleSheet, View } from "react-native";

export const SettingsScreen = () => {
  const [serverUrl, setServerUrl] = useState<string>("");
  const [clientId, setClientId] = useState<string>("");

  const { getItem: getServerUrl, setItem: updateServerUrl } = useAsyncStorage(
    StorageKeys.SERVER_URL
  );
  const { getItem: getClientId, setItem: updateClientId } = useAsyncStorage(
    StorageKeys.CLIENT_ID
  );

  const handleServerUrlChange = (url: string) => {
    setServerUrl(url);
    updateServerUrl(url);
  };

  const handleClientIdChange = (clientId: string) => {
    setClientId(clientId);
    updateClientId(clientId);
  };

  useLayoutEffect(() => {
    async function init() {
      setServerUrl((await getServerUrl()) ?? "ws://localhost:5000/ws");
      setClientId((await getClientId()) ?? "mobile-app-1");
    }

    init();
  }, []);

  return (
    <SafeAreaView style={{ padding: 12 }}>
      <Input
        label="Server url"
        value={serverUrl}
        onChange={handleServerUrlChange}
      />

      <View style={styles.gap} />
      <Input
        label="Client id"
        value={clientId}
        onChange={handleClientIdChange}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  gap: {
    marginTop: 12,
  },
});
