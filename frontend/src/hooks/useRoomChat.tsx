import { useState, useEffect } from "react";

import { socketService } from "../services/socket/socket";
import { getRoomMessages } from "../services/api/room";

import { Message } from "../utils/types/messageTypes";

const useRoomChat = (roomId: any, refreshRoomMessagesTrigger: boolean) => {
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    if (!roomId) return;

    const receiveMessages = async () => {
      const result = await getRoomMessages(roomId);

      if (result.success === true) {
        setMessages(result.messages);
      } else {
        console.error("Failed to get messages:", result.message);
      }
    };

    receiveMessages();

    socketService.emit("joinRoomConversation", roomId);

    socketService.on("receiveRoomMessage", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socketService.off("receiveRoomMessage");
    };
  }, [roomId, refreshRoomMessagesTrigger]);

  return messages;
};

export default useRoomChat;
