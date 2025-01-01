import { Stomp } from "@stomp/stompjs";
import SockJS from "sockjs-client";

const WEBSOCKET_URL = "http://localhost:8080/ws";

export const connectToWebSocket = (onMessageReceived) => {
  const socket = new SockJS(WEBSOCKET_URL);
  const stompClient = Stomp.over(socket);

  stompClient.connect({}, () => {
    console.log("Connected to WebSocket");
    stompClient.subscribe("/topic/notifications", (message) => {
      const notification = JSON.parse(message.body);
      onMessageReceived(notification);
    });
  });

  return stompClient;
};
