import React, { useLayoutEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, View } from "react-native";
import { useAsyncStorage } from "@react-native-async-storage/async-storage";

import { StorageKeys } from "src/constants/StorageKeys";
import { Input } from "../shared/Input";

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
      setServerUrl((await getServerUrl()) ?? "");
      setClientId((await getClientId()) ?? "");
    }

    init();
  }, []);

  return (
    <SafeAreaView style={styles.root}>
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
  root: {
    padding: 12,
    backgroundColor: "#1B1525",
    height: "100%",
  },
  gap: {
    marginTop: 12,
  },
});
