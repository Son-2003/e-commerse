import axios from "axios";
import { ChatMessage } from "common/models/chat";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const fetchMessages = async (
  accessToken: string,
  senderId: string,
  recipientId: string
): Promise<ChatMessage[]> => {
  try {    
    const response = await axios.get<ChatMessage[]>(
      `${API_BASE_URL}/messages/${senderId}/${recipientId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    throw error;
  }
};

const fetchConversations = async (
  accessToken: string,
  userId: string
): Promise<ChatMessage[]> => {
  try {
    const response = await axios.get<ChatMessage[]>(
      `${API_BASE_URL}/conversations/${userId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );    
    return response.data;
  } catch (error: any) {
    throw error;
  }
};

export default {
  fetchConversations,
  fetchMessages,
};
