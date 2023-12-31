import React, { useLayoutEffect, useState } from 'react';
import { useAsyncStorage } from '@react-native-async-storage/async-storage';

import { StorageKeys } from 'src/constants/StorageKeys';
import { Input } from '../shared/Input';
import { ScreenLayout } from '../shared/ScreenLayout';

export const SettingsScreen = () => {
  const [serverUrl, setServerUrl] = useState<string>('');
  const [clientId, setClientId] = useState<string>('');

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
      setServerUrl((await getServerUrl()) ?? '');
      setClientId((await getClientId()) ?? '');
    }

    init();
  }, []);

  return (
    <ScreenLayout>
      <Input
        label="Server url"
        value={serverUrl}
        onChange={handleServerUrlChange}
      />

      <Input
        tw="mt-2"
        label="Client id"
        value={clientId}
        onChange={handleClientIdChange}
      />
    </ScreenLayout>
  );
};
