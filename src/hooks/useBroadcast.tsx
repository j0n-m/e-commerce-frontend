import { useEffect, useMemo } from "react";

export default function useBroadcast<T>({
  channelName,
  messageHandler,
}: {
  channelName: string;
  messageHandler: (msg: MessageEvent<T>) => void;
}) {
  const channel = useMemo(
    () => new BroadcastChannel(channelName),
    [channelName]
  );

  const broadcast = (msg: T) => {
    channel.postMessage(msg);
  };

  useEffect(() => {
    channel.addEventListener("message", messageHandler);
    return () => {
      channel.removeEventListener("message", messageHandler);
    };
  }, [channel, messageHandler]);

  return { broadcast };
}
