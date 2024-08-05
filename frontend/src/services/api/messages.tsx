import {
  Message,
  SendMessageResult,
  SendMessageResponseData,
  GetMessagesResult,
  GetMessagesResponseData,
  GetConversationidResult,
} from "../../utils/types/messageTypes";

import authService from "../auth/auth";

const sendMessage = async (message: Message): Promise<SendMessageResult> => {
  try {
    const userToken = authService.getCurrentUserToken();

    const response = await fetch("http://localhost:3002/message/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userToken}`,
      },
      body: JSON.stringify({
        conversationId: message.conversationId,
        content: message.content,
      }),
    });

    let data: SendMessageResponseData = await response.json();

    if (response.status === 200) return { success: true };

    return { success: false, message: data.message || "Send message failed" };
  } catch (error) {
    console.error("Send message error:", error);
    return { success: false, message: "Network error" };
  }
};

const getMessages = async (
  conversationId: string
): Promise<GetMessagesResult> => {
  try {
    const userToken = authService.getCurrentUserToken();

    const response = await fetch(
      `http://localhost:3002/message/${conversationId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
      }
    );

    let data: GetMessagesResponseData = await response.json();

    if (response.status === 200)
      if ("messages" in data) return { success: true, messages: data.messages };

    if ("message" in data)
      return { success: false, message: data.message || "Get messages failed" };

    return { success: false, message: "Get messages failed" };
  } catch (error) {
    console.error("Get messages error:", error);
    return { success: false, message: "Network error" };
  }
};

const fetchConversationId = async (
  userId: number
): Promise<GetConversationidResult> => {
  try {
    const userToken = authService.getCurrentUserToken();

    const response = await fetch(
      `http://localhost:3002/message/conversation/${userId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
      }
    );

    let data: GetConversationidResult = await response.json();


    if (response.status === 200) return data;

    return { success: false, message: "Get conversationId failed" };
  } catch (error) {
    console.error("Get conversationId error:", error);
    return { success: false, message: "Network error" };
  }
};

export { sendMessage, getMessages, fetchConversationId };
