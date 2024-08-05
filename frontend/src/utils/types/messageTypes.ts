export type Message = {
  id?: number;
  conversationId: number;
  sender_id: number;
  content: string;
  createdAt?: string;
  updatedAt?: string;
};

export type SendMessageResult =
  | { success: true }
  | { success: false; message: string };

export type SendMessageResponseData = {
  message?: string; // not sure if this is the correct type
};

export type GetMessagesResult =
  | { success: true; messages: Message[] }
  | { success: false; message: string };

export type GetMessagesResponseData =
  | { messages: Message[] }
  | { message: string };

export type GetConversationidResult =
  | { success: true; conversationId: number }
  | { success: false; message: string };
