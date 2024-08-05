import { useState } from "react";

import { sendMessage } from "../services/api/messages";
import useChat from "../hooks/useChat";

import { Message } from "../utils/types/messageTypes";

const ChatRoom = () => {
  const [input, setInput] = useState("");

  const messages: Message[] = useChat(1); // conversationId

  const submitMessage = async () => {
    const newMessage: Message = {
      conversationId: 1,
      sender_id: 1,
      content: input,
    };

    const result = await sendMessage(newMessage);

    if (result.success) {
      // i don't know, play a sound or something;
    } else {
      console.error("Failed to send message:", result.message);
    }
  };

  return (
    <div>
      {/* Chat will be here: */}
      {messages.map((message) => (
        <div key={message.id}>
          <p>{message.content}</p>
        </div>
      ))}
      {/*  Chat will be here ^^^ */}

      <input value={input} onChange={(e) => setInput(e.target.value)} />
      <button
        onClick={() => {
          submitMessage();
        }}
      >
        Send
      </button>
    </div>
  );
};

export default ChatRoom;
