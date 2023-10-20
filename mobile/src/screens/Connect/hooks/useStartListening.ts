import { useCallback, useState, useRef } from 'react';
import { type MediaStream } from 'react-native-webrtc';
import { useAsyncStorage } from '@react-native-async-storage/async-storage';

import { SocketMessageType } from 'src/types/peer';
import { Socket } from 'src/services/socket';
import { Peer } from 'src/services/peer';
import { StorageKeys } from 'src/constants/StorageKeys';

interface UseStartListeningParams {
  notifyEmptySettings: VoidFunction;
  notifyError: (message: string) => void;
}

interface UseStartListeningResult {
  handleStartListening: () => Promise<void>;
  handleDisconnect: () => void;
  remoteStream: MediaStream | null;
  conencted: boolean;
}

export const useStartListening = ({
  notifyEmptySettings,
  notifyError,
}: UseStartListeningParams): UseStartListeningResult => {
  const webSocketRef = useRef<Socket | null>(null);
  const senderIdRef = useRef<string>('');
  const peerRef = useRef<Peer | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [conencted, setConnected] = useState<boolean>(false);

  const { getItem: getClientId } = useAsyncStorage(StorageKeys.CLIENT_ID);
  const { getItem: getServerUrl } = useAsyncStorage(StorageKeys.SERVER_URL);

  const handleDisconnect = useCallback(() => {
    setRemoteStream(null);
    setConnected(false);

    peerRef.current?.close();
    peerRef.current = null;

    webSocketRef.current?.close();
    webSocketRef.current = null;
  }, []);

  const handleStartListening = useCallback(async () => {
    handleDisconnect();

    const [url, clientId] = await Promise.all([
      await getServerUrl(),
      await getClientId(),
    ]);

    if (!url || !clientId) {
      notifyEmptySettings();
      return;
    }
    try {
      const socket = new Socket(url, clientId);
      webSocketRef.current = socket;

      socket.setEventListener(SocketMessageType.ICE_CANDIDATE, (candidate) => {
        peer.addIceCandidate(candidate);
      });
      socket.setEventListener(
        SocketMessageType.OFFER,
        async (description, fromClientId) => {
          senderIdRef.current = fromClientId;
          const answer = await peer.createAnswer(description);

          socket.send(SocketMessageType.ANSWER, answer, fromClientId);
        }
      );

      const peer = new Peer();
      peerRef.current = peer;
      peer.onIceCandidate = (candidate) => {
        socket.send(
          SocketMessageType.ICE_CANDIDATE,
          candidate,
          senderIdRef.current
        );
      };
      peer.onTrack = (streams) => {
        setRemoteStream(streams[0]);
      };

      socket.setCloseListener(handleDisconnect);

      await socket.connect();
      await peer.connect();
      setConnected(true);
    } catch (error) {
      notifyError(`${error}`);
    }
  }, [handleDisconnect]);

  return {
    handleStartListening,
    handleDisconnect,
    remoteStream,
    conencted,
  };
};
