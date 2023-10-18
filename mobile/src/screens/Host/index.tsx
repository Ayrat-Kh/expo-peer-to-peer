import { useLayoutEffect, useState } from 'react';
import { Alert } from 'react-native';
import { RTCView } from 'react-native-webrtc';
import { useAsyncStorage } from '@react-native-async-storage/async-storage';

import { Button } from '../shared/Button';
import { StorageKeys } from 'src/constants/StorageKeys';
import { useNavigation } from '@react-navigation/native';
import type { RootNavigationProps } from 'src/navigation/AppNavigationContainer';
import { Input } from '../shared/Input';
import { useCreateSession } from './hooks/useCreateSession';
import { ScreenLayout } from '../shared/ScreenLayout';

export const HostScreen = () => {
  const [recipientId, setRecipientId] = useState<string>('');
  const { navigate } = useNavigation<RootNavigationProps>();

  const { getItem: getRecipientId, setItem: saveRecipientId } = useAsyncStorage(
    StorageKeys.RECIPIENT_ID
  );

  const updateRecipientId = (recId: string) => {
    saveRecipientId(recId);
    setRecipientId(recId);
  };

  const notifyEmptyRecipient = () => {
    Alert.alert('Empty recipient id', 'Please enter recipient id', [
      { text: 'Ok', style: 'cancel' },
    ]);
  };

  const notifyEmptySettings = () => {
    Alert.alert(
      'Empty server url or client id',
      'Please enter server url or client id in the Setting screen',
      [
        { text: 'Ok', style: 'cancel' },
        {
          text: 'Go to Settings',
          style: 'default',
          // If the user confirmed, then we dispatch the action we blocked earlier
          // This will continue the action that had triggered the removal of the screen
          onPress: () => navigate('Settings'),
        },
      ]
    );
  };

  const { handleCreateSession, localStream } = useCreateSession({
    notifyEmptyRecipient,
    notifyEmptySettings,
  });

  useLayoutEffect(() => {
    async function init() {
      const r = await getRecipientId();
      updateRecipientId(r ?? '');
    }

    init();
  }, []);

  return (
    <ScreenLayout>
      <RTCView
        tw="w-full h-[350]"
        objectFit={'cover'}
        streamURL={localStream?.toURL() ?? ''}
        zOrder={0}
      />

      <Input
        tw="mt-3"
        label="Recipient id"
        value={recipientId}
        onChange={updateRecipientId}
      />

      <Button
        tw="mt-3"
        label={'Create session'}
        onPress={handleCreateSession}
      />
    </ScreenLayout>
  );
};
