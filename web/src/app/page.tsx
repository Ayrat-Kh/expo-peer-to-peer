"use client";

import { useEffect, useRef, useState } from "react";

export default function Home() {
  const [configJson, setConfigJson] = useState<string>("");
  const videoRef = useRef<HTMLVideoElement>(null);
  const peerRef = useRef<RTCPeerConnection>();

  const handleConnect = async () => {
    setConfigJson(configJson);

    peerRef.current = new RTCPeerConnection({
      iceServers: [
        {
          urls: "stun:stun.l.google.com:19302",
        },
      ],
    });

    peerRef.current.addEventListener("icecandidate", (event) => {
      console.log("event", event);
      if (!event.candidate) {
      }
    });

    peerRef.current.addEventListener("track", (event) => {
      if (videoRef.current?.srcObject && event.streams[0]) {
        videoRef.current.srcObject = event.streams[0];
      }
    });

    const obj = JSON.parse(configJson);
    peerRef.current.setRemoteDescription(obj);
    const answer = await peerRef.current.createAnswer(obj);

    peerRef.current.setLocalDescription(answer);

    const serializedAnswer = JSON.stringify(answer);

    console.log("answer", serializedAnswer);

    navigator.clipboard.writeText(serializedAnswer);

    localStorage.setItem("connection", configJson);
  };

  useEffect(() => {
    setConfigJson(localStorage.getItem("connection") ?? "");
  }, []);

  return (
    <main className="flex flex-col p-10">
      <label className="flex flex-col w-96">
        Config
        <textarea
          className="mt-2 text-black"
          cols={40}
          rows={5}
          value={configJson}
          onChange={(e) => {
            setConfigJson(e.target.value);
          }}
        />
      </label>

      <button
        className="w-96 bg-slate-300 mt-2  text-blue-700"
        onClick={handleConnect}
      >
        Connect
      </button>

      <video ref={videoRef} className="bg-blue-100 mt-6" />
    </main>
  );
}
