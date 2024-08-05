import { useState, useEffect } from "react";

import { socketService } from "../services/socket/socket";
import { getMessages } from "../services/api/messages";

import { Message } from "../utils/types/messageTypes";

const useChat = (conversationId: any) => {
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    if (!conversationId) return;

    const receiveMessages = async () => {
      const result = await getMessages(conversationId);

      if (result.success === true) {
        setMessages(result.messages);
      } else {
        console.error("Failed to get messages:", result.message);
      }
    };

    receiveMessages();

    socketService.emit("joinConversation", conversationId);

    socketService.on("receiveMessage", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socketService.off("receiveMessage");
    };
  }, [conversationId]);

  return messages;
};

export default useChat;
