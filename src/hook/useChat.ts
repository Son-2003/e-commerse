import { AppDispatch } from "@redux/store";
import { ChatMessage } from "common/models/chat";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { Client, IMessage, StompSubscription } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { addMessage, updateChatPreview } from "@redux/slices/chatSlice";

const socketUrl = "http://localhost:8080/ws";

export const useChat = (userId: string, conversationId: string | null) => {
  const dispatch = useDispatch<AppDispatch>();
  const clientRef = useRef<Client | null>(null);
  const subRef = useRef<StompSubscription | null>(null);
  const [connected, setConnected] = useState(false);
  const receivedIdsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!userId || !conversationId) {
      return;
    }

    const client = new Client({
      brokerURL: undefined, // dùng SockJS
      webSocketFactory: () => new SockJS(socketUrl),
      reconnectDelay: 5000,
      debug: (str) => console.log("[STOMP]", str),
      onConnect: () => {
        setConnected(true);

        if (subRef.current) {
          try { subRef.current.unsubscribe(); } catch (e) {}
          subRef.current = null;
        }

        const dest = `/topic/messages/${conversationId}`;
        try {
          subRef.current = client.subscribe(dest, (message: IMessage) => {
            try {
              const body: ChatMessage = JSON.parse(message.body);

              if (body?.id && receivedIdsRef.current.has(body.id)) {
                return;
              }
              if (body?.id) receivedIdsRef.current.add(body.id);

              dispatch(addMessage(body));
              dispatch(updateChatPreview(body));
            } catch (err) {
            }
          });
        } catch (err) {
        }
      },
      onDisconnect: () => {
        setConnected(false);
      },
      onStompError: (frame) => {
      },
      onWebSocketClose: () => {
        setConnected(false);
      }
    });

    client.activate();
    clientRef.current = client;

    return () => {
      try {
        if (subRef.current) {
          subRef.current.unsubscribe();
          subRef.current = null;
        }
        client.deactivate();
      } catch (e) {
      } finally {
        setConnected(false);
      }
    };
  }, [userId, conversationId, dispatch]);

  const sendMessage = (msg: ChatMessage) => {
    const client = clientRef.current;
    if (client && client.connected) {
      client.publish({
        destination: "/app/chat",
        body: JSON.stringify(msg),
      });
    } else {
      console.warn("⚠️ Cannot send message, STOMP not connected", client?.active, client?.connected);
    }
  };

  return { sendMessage, connected };
};
