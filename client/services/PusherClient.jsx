import Pusher from "pusher-js/react-native";
import { useState, useEffect } from "react";

const pusher = new Pusher("YOUR_APP_KEY", {
  cluster: "us2",
  encrypted: true,
});

export const usePusher = (channelName, eventName, callback) => {
  useEffect(() => {
    const channel = pusher.subscribe(channelName);

    channel.bind(eventName, (data) => {
      console.log(`Received new message on ${eventName}:`, data);
      if (callback) callback(data);
    });

    return () => {
      channel.unbind(eventName);
      pusher.unsubscribe(channelName);
    };
  }, [channelName, eventName, callback]);
};
