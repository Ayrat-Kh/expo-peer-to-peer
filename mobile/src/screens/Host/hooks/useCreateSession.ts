import { useCallback, useState, useRef } from 'react';
import { mediaDevices, type MediaStream } from 'react-native-webrtc';
import { useAsyncStorage } from '@react-native-async-storage/async-storage';

import { SocketMessageType } from 'src/types/peer';
import { Socket } from 'src/services/socket';
import { Peer } from 'src/services/peer';
import { StorageKeys } from 'src/constants/StorageKeys';

interface UseCreateSessionParams {
  notifyEmptySettings: VoidFunction;
  notifyEmptyRecipient: VoidFunction;
}

interface UseCreateSessionResult {
  handleCreateSession: () => Promise<void>;
  localStream: MediaStream | null;
}

const constraints = {
  audio: true,
  video: true,
};

export const useCreateSession = ({
  notifyEmptyRecipient,
  notifyEmptySettings,
}: UseCreateSessionParams): UseCreateSessionResult => {
  const webSocketRef = useRef<Socket | null>(null);
  const peerRef = useRef<Peer | null>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);

  const { getItem: getClientId } = useAsyncStorage(StorageKeys.CLIENT_ID);
  const { getItem: getServerUrl } = useAsyncStorage(StorageKeys.SERVER_URL);
  const { getItem: getRecipientId } = useAsyncStorage(StorageKeys.RECIPIENT_ID);

  return {
    handleCreateSession: useCallback(async () => {
      peerRef.current?.close();
      peerRef.current = null;

      webSocketRef.current?.close();
      webSocketRef.current = null;

      const recipientId = await getRecipientId();

      const [url, clientId] = await Promise.all([
        await getServerUrl(),
        await getClientId(),
      ]);

      if (!url || !clientId) {
        notifyEmptySettings();
        return;
      }

      if (!recipientId) {
        notifyEmptySettings();
        return;
      }

      const stream = await mediaDevices.getUserMedia(constraints);

      const socket = new Socket(url, clientId);

      const peer = new Peer();

      peer.onIceCandidate = (candidate) => {
        socket.send(SocketMessageType.ICE_CANDIDATE, candidate, recipientId);
      };

      socket.setEventListener(SocketMessageType.ANSWER, (description) => {
        peer.setRemoteDescription(description);
      });

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
    }, []),
    localStream,
  };
};
