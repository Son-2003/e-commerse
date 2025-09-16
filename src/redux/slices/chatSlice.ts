import {
  fetchConversationsThunk,
  fetchMessagesThunk,
} from "@redux/thunk/chatThunk";
import {
  ActionReducerMapBuilder,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";
import { ChatMessage, ChatPreview } from "common/models/chat";

export interface ChatState {
  messages: ChatMessage[];
  chats: ChatPreview[];
  loadingChat: boolean;
  errorChat: string | null;
}

const initialState: ChatState = {
  messages: [],
  chats: [],
  loadingChat: false,
  errorChat: null,
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    addMessage: (state, action: PayloadAction<ChatMessage>) => {
      state.messages.push(action.payload);
    },
    updateChatPreview: (state, action: PayloadAction<ChatMessage>) => {      
      const msg = action.payload;
      const chatIndex = state.chats.findIndex(
        (c) => c.id === msg.conversationId
      );

      const msgTime = msg.timestamp
        ? new Date(msg.timestamp).getTime()
        : Date.now();

      if (chatIndex >= 0) {
        const existing = state.chats[chatIndex];
        const existingTime = existing.time
          ? new Date(existing.time).getTime()
          : 0;

        if (msgTime < existingTime) {
          return;
        }

        state.chats[chatIndex] = {
          ...existing,
          senderId: msg.senderId,
          lastMessage: msg.content,
          time: msg.timestamp,
        };

        const updatedChat = state.chats[chatIndex];
        state.chats.splice(chatIndex, 1);
        state.chats.unshift(updatedChat);
      } else {
        state.chats.unshift({
          id: msg.conversationId,
          senderId: msg.senderId,
          name: msg.senderName,
          avatar: msg.senderAvatar,
          lastMessage: msg.content,
          time: msg.timestamp,
        });
      }
    },
  },
  extraReducers: (builder) => {
    fetchConversations(builder);
    fetchMessages(builder);
  },
});

function fetchMessages(builder: ActionReducerMapBuilder<ChatState>) {
  builder
    .addCase(fetchMessagesThunk.pending, (state) => {
      state.loadingChat = true;
      state.errorChat = null;
    })
    .addCase(
      fetchMessagesThunk.fulfilled,
      (state, action: PayloadAction<ChatMessage[]>) => {
        state.loadingChat = false;
        state.messages = action.payload;
      }
    )
    .addCase(
      fetchMessagesThunk.rejected,
      (state, action: PayloadAction<any>) => {
        state.loadingChat = false;
        state.errorChat = action.payload || "Fetch messages failed";
      }
    );
}

function fetchConversations(builder: ActionReducerMapBuilder<ChatState>) {
  builder
    .addCase(fetchConversationsThunk.pending, (state) => {
      state.loadingChat = true;
      state.errorChat = null;
    })
    .addCase(
      fetchConversationsThunk.fulfilled,
      (state, action: PayloadAction<ChatMessage[]>) => {
        state.loadingChat = false;
        state.chats = action.payload.map((msg) => ({
          id: msg.conversationId,
          senderId: msg.senderId,
          name: msg.senderName,
          avatar: msg.senderAvatar,
          lastMessage: msg.content,
          time: msg.timestamp,
        }));
      }
    )
    .addCase(
      fetchConversationsThunk.rejected,
      (state, action: PayloadAction<any>) => {
        state.loadingChat = false;
        state.errorChat = action.payload || "Fetch conversations failed";
      }
    );
}

export const { addMessage, updateChatPreview } = chatSlice.actions;
export default chatSlice.reducer;
