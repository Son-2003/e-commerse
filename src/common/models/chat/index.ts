import { MessageType } from "common/enums/MessageType";

export interface ChatMessage {
  id?: string;
  conversationId: string;
  senderId: string;
  recipientId: string;
  senderName: string;
  senderAvatar: string;
  content: string;
  type: MessageType;
  timestamp: string;
}

export interface ChatPreview {
  id: string;
  senderId: string;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unreadCount?: number;
  isOnline?: boolean;
}