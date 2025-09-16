import { RootState } from "@redux/store";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { ChatMessage } from "common/models/chat";
import ChatService from "services/ChatService";

export const fetchMessagesThunk = createAsyncThunk<
  ChatMessage[],
  {
    senderId: string;
    recipientId: string;
  },
  { state: RootState }
>(
  "chat/fetchMessages",
  async ({ senderId, recipientId }, thunkAPI) => {
    const state = thunkAPI.getState();
    const accessToken = state.auth.accessToken === null ? state.auth.accessTokenAdmin : state.auth.accessToken;
    if (!accessToken) {
      return thunkAPI.rejectWithValue("No access token available");
    }
    try {
      const data = await ChatService.fetchMessages(
        accessToken,
        senderId,
        recipientId
      );
      return data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Fetch messages failed"
      );
    }
  }
);

export const fetchConversationsThunk = createAsyncThunk<
  ChatMessage[],
  string,
  { state: RootState }
>(
  "chat/fetchConversations",
  async (userId, thunkAPI) => {    
    const state = thunkAPI.getState();
    const accessToken = state.auth.accessTokenAdmin;
    if (!accessToken) {
      return thunkAPI.rejectWithValue("No access token available");
    }
    try {
      const data = await ChatService.fetchConversations(accessToken, userId);
      return data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Fetch conversations failed"
      );
    }
  }
);
