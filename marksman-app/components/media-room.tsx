"use client";

import "@livekit/components-styles";
import { LiveKitRoom, VideoConference } from "@livekit/components-react";
import { useEffect, useState } from "react";

import { Spinner } from "@/components/spinner";

interface MediaRoomProps {
  roomId: string;
  title: string;
  onDisconnected?: () => void;
}

export const MediaRoom = ({
  roomId,
  title,
  onDisconnected,
}: MediaRoomProps) => {
  const [token, setToken] = useState<string>("");

  useEffect(() => {
    (async () => {
      try {
        const resp = await fetch(
          `/api/livekit?room=${roomId}&username=${title}`
        );

        const data = await resp.json();
        setToken(data.token);
      } catch (e) {
        console.error(e);
      }
    })();
  }, [roomId, title]);

  if (token === "") {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <LiveKitRoom
      video={true}
      audio={true}
      token={token}
      onDisconnected={onDisconnected}
      serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
      data-lk-theme="default">
      <VideoConference />
    </LiveKitRoom>
  );
};
