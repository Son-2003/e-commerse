import { MessageOutlined, WechatOutlined } from "@ant-design/icons";
import { addMessage } from "@redux/slices/chatSlice";
import { AppDispatch, RootState } from "@redux/store";
import { MessageType } from "common/enums/MessageType";
import { ChatMessage, ChatPreview } from "common/models/chat";
import { ChatSidebar } from "components/Chat/ChatSidebar";
import { ChatWindow } from "components/Chat/ChatWindow";
import { useChat } from "../../hook/useChat";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchConversationsThunk,
  fetchMessagesThunk,
} from "@redux/thunk/chatThunk";

const Chat: React.FC = () => {
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const { chats, messages } = useSelector((state: RootState) => state.chat);
  const { adminInfo } = useSelector((state: RootState) => state.auth);
  const { sendMessage, connected } = useChat(
    adminInfo?.id.toString()!,
    "1" + "_" + selectedChat?.split("_")[1]
  );

  useEffect(() => {
    if (adminInfo) {
      dispatch(fetchConversationsThunk(adminInfo?.id.toString()));
    }
  }, [dispatch, adminInfo]);

  useEffect(() => {
    if (selectedChat) {
      dispatch(
        fetchMessagesThunk({
          senderId: adminInfo?.id.toString()!,
          recipientId: selectedChat.split("_")[1],
        })
      );
    }
  }, [dispatch, selectedChat, adminInfo]);

  const handleSend = (text: string, file?: File) => {
    if (!selectedChat) return;

    const newMsg: ChatMessage = {
      id: crypto.randomUUID(),
      conversationId: selectedChat,
      senderId: adminInfo?.id.toString()!,
      recipientId: selectedChat.split("_")[1],
      senderName: adminInfo?.fullName!,
      senderAvatar: adminInfo?.image!,
      content: file ? URL.createObjectURL(file) : text,
      type: file ? MessageType.IMAGE : MessageType.TEXT,
      timestamp: new Date().toISOString(),
    };

    if (connected) {
      sendMessage(newMsg);
    } else {
      console.warn("⚠️ WebSocket chưa kết nối, không gửi được tin nhắn");
    }
  };

  const selectedChatInfo: ChatPreview | undefined = chats.find(
    (chat) => chat.id === selectedChat
  );

  return (
    <div className="flex h-screen w-full bg-gray-100 overflow-hidden">
      {/* Sidebar */}
      <ChatSidebar
        chats={chats}
        selectedChatId={selectedChat}
        onSelectChat={(convId) => setSelectedChat(convId)}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min">
        {selectedChat ? (
          <ChatWindow
            messages={messages}
            onSend={handleSend}
            chatName={selectedChatInfo?.name ?? "Unknown"}
            chatAvatar={selectedChatInfo?.avatar ?? ""}
            isOnline={selectedChatInfo?.isOnline}
            onOpenSidebar={() => setSidebarOpen(true)}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center bg-white">
            <div className="text-center max-w-md mx-auto px-8">
              <div className="w-32 h-32 mx-auto mb-8 bg-gray-200 rounded-full flex items-center justify-center">
                <MessageOutlined className="text-5xl" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                Welcome to Chat
              </h3>
              <p className="text-gray-500 leading-relaxed">
                Select a conversation from the list on the left to start
                messaging.
              </p>
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden mt-6 px-6 py-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
              >
                Open chat list
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
