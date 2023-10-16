"use client";

import { useEffect, useRef } from "react";

const clientId = "web-client-1";
const remoteClientId = "mobile-user-1";

export default function Home() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const peerRef = useRef<RTCPeerConnection | null>();
  const webSocketRef = useRef<WebSocket | null>();

  const connectToCall = async () => {
    webSocketRef.current?.close();
    webSocketRef.current = null;

    peerRef.current?.close();
    peerRef.current = null;

    const socket = new WebSocket(`ws://localhost:5000/ws?clientId=${clientId}`);
    await new Promise((resolve) => socket.addEventListener("open", resolve));

    socket.addEventListener("close", () => {
      console.error("Please try again later.");
    });

    const peerConnection = new RTCPeerConnection({
      iceServers: [
        {
          urls: "stun:stun.l.google.com:19302",
        },
      ],
    });

    peerConnection.onicecandidate = (event) => {
      socket.send(
        JSON.stringify({
          messageType: "ice-candidate",
          recipientClientId: remoteClientId,
          payload: event.candidate,
        })
      );
    };

    peerConnection.ontrack = (event) => {
      console.log("track", event.streams[0]);

      if (videoRef.current && event.streams[0]) {
        videoRef.current.srcObject = event.streams[0];
      }
    };

    socket.addEventListener("message", async (ev) => {
      const data = JSON.parse(ev.data);

      if (data.messageType === "offer") {
        await peerConnection.setRemoteDescription(data.payload);

        const answer = await peerConnection.createAnswer();
        await peerConnection.setLocalDescription(answer);

        socket.send(
          JSON.stringify({
            recipientClientId: remoteClientId,
            messageType: "answer",
            payload: answer,
          })
        );
        return;
      }

      if (data.messageType === "ice-candidate") {
        peerConnection.addIceCandidate(data.payload);

        return;
      }
    });

    peerRef.current = peerConnection;
    webSocketRef.current = socket;
  };

  return (
    <main className="flex flex-col p-10">
      <button onClick={connectToCall}>Connect to call</button>

      <video ref={videoRef} className="bg-blue-100 mt-6 w-2/5" autoPlay muted />
    </main>
  );
}
