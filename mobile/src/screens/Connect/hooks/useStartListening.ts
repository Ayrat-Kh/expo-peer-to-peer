import { useCallback, useState, useRef } from 'react';
import { type MediaStream } from 'react-native-webrtc';
import { useAsyncStorage } from '@react-native-async-storage/async-storage';

import { SocketMessageType } from 'src/types/peer';
import { Socket } from 'src/services/socket';
import { Peer } from 'src/services/peer';
import { StorageKeys } from 'src/constants/StorageKeys';

interface UseStartListeningParams {
  notifyEmptySettings: VoidFunction;
}

interface UseStartListeningResult {
  handleStartListening: () => Promise<void>;
  remoteStream: MediaStream | null;
}

export const useStartListening = ({
  notifyEmptySettings,
}: UseStartListeningParams): UseStartListeningResult => {
  const webSocketRef = useRef<Socket | null>(null);
  const senderIdRef = useRef<string>('');
  const peerRef = useRef<Peer | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);

  const { getItem: getClientId } = useAsyncStorage(StorageKeys.CLIENT_ID);
  const { getItem: getServerUrl } = useAsyncStorage(StorageKeys.SERVER_URL);

  return {
    handleCreateSession: useCallback(async () => {
      peerRef.current?.close();
      peerRef.current = null;

      webSocketRef.current?.close();
      webSocketRef.current = null;

      const [url, clientId] = await Promise.all([
        await getServerUrl(),
        await getClientId(),
      ]);

      if (!url || !clientId) {
        notifyEmptySettings();
        return;
      }

      const socket = new Socket(url, clientId);
      socket.setEventListener(SocketMessageType.ICE_CANDIDATE, (candidate) => {
        peer.addIceCandidate(candidate);
      });
      socket.setEventListener(
        SocketMessageType.OFFER,
        (description, fromClientId) => {
          senderIdRef.current = fromClientId;
          peer.setRemoteDescription(description);
        }
      );

      const peer = new Peer();
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

      await socket.connect();
      await peer.connect();

      webSocketRef.current = socket;
      peerRef.current = peer;
    }, []),
    remoteStream,
  };
};
