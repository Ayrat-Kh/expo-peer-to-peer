import React, { useRef, useState } from 'react';
import { Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RTCView, mediaDevices, type MediaStream } from 'react-native-webrtc';
import { useAsyncStorage } from '@react-native-async-storage/async-storage';
import { styled } from 'nativewind';
import { useNavigation } from '@react-navigation/native';

import { Socket } from 'src/services/socket';
import { Peer } from 'src/services/peer';
import { SocketMessageType } from 'src/types/peer';
import { Button } from '../shared/Button';
import { StorageKeys } from 'src/constants/StorageKeys';
import type { RootNavigationProps } from 'src/navigation/AppNavigationContainer';

const StyledContainer = styled(SafeAreaView, 'bg-primary h-full p-4');

export const HostScreen = () => {
  const webSocketRef = useRef<Socket | null>(null);
  const peerRef = useRef<Peer | null>(null);
  const fromClientIdRef = useRef<string>('');
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);

  const { navigate } = useNavigation<RootNavigationProps>();

  const { getItem: getClientId } = useAsyncStorage(StorageKeys.CLIENT_ID);
  const { getItem: getServerUrl } = useAsyncStorage(StorageKeys.SERVER_URL);

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
      notifyEmptySettings();
      return;
    }

    const stream = await mediaDevices.getUserMedia(constraints);

    const socket = new Socket(url, clientId);

    const peer = new Peer();

    peer.onIceCandidate = (candidate) => {
      socket.send(SocketMessageType.ICE_CANDIDATE, candidate, recipientId);
    };

    socket.setEventListener(
      SocketMessageType.ANSWER,
      (description, fromClientId) => {
        peer.setRemoteDescription(description);
      }
    );

    socket.setEventListener(SocketMessageType.ICE_CANDIDATE, (candidate) => {
      peer.addIceCandidate(candidate);
    });

    await socket.connect();
    await peer.connect();

    peer.addTrack(stream);

    const offer = await peer.createOffer();

    socket.send(SocketMessageType.OFFER, offer, recipientId);

    webSocketRef.current = socket;
    peerRef.current = peer;
    setLocalStream(stream);
  };

  return (
    <StyledContainer>
      <RTCView
        tw="w-full h-[350]"
        objectFit={'cover'}
        streamURL={localStream?.toURL() ?? ''}
        zOrder={0}
      />

      <Button tw="mt-3" label={'Listen'} onPress={handleCreateSession} />
    </StyledContainer>
  );
};
