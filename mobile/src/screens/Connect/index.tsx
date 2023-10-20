import React from 'react';
import { Alert } from 'react-native';
import { RTCView } from 'react-native-webrtc';
import { useNavigation } from '@react-navigation/native';

import { Button } from '../shared/Button';
import type { RootNavigationProps } from 'src/navigation/AppNavigationContainer';
import { useStartListening } from './hooks/useStartListening';
import { ScreenLayout } from '../shared/ScreenLayout';

export const ConnectScreen = () => {
  const { navigate } = useNavigation<RootNavigationProps>();

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

  const notifyError = (message: string) => {
    Alert.alert('Error occured', message, [{ text: 'Ok', style: 'cancel' }]);
  };

  const { handleStartListening, handleDisconnect, conencted, remoteStream } =
    useStartListening({
      notifyEmptySettings,
      notifyError,
    });

  return (
    <ScreenLayout>
      <RTCView
        tw="w-full h-[350]"
        objectFit={'cover'}
        streamURL={remoteStream?.toURL() ?? ''}
        zOrder={0}
      />

      <Button
        tw="mt-3"
        label={conencted ? 'Disconnect' : 'Listen'}
        onPress={conencted ? handleDisconnect : handleStartListening}
      />
    </ScreenLayout>
  );
};
