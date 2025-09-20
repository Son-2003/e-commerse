import { addMessage } from "@redux/slices/chatSlice";
import { AppDispatch, RootState } from "@redux/store";
import { MessageType } from "common/enums/MessageType";
import { ChatMessage } from "common/models/chat";
import { ChatWindow } from "components/Chat/ChatWindow";
import { useChat } from "../../hook/useChat";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMessagesThunk } from "@redux/thunk/chatThunk";
import { getInfoAdminThunk } from "@redux/thunk/authThunk";
import { AVA_DEFAULT } from "common/constant";

const Chat: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { messages } = useSelector((state: RootState) => state.chat);
  const { userInfo } = useSelector((state: RootState) => state.auth);
  const { sendMessage, connected } = useChat(userInfo?.id.toString()!, "1" + "_" + userInfo?.id);

  useEffect(() => {
    if (userInfo) {
      dispatch(
        fetchMessagesThunk({
          senderId: userInfo.id.toString(),
          recipientId: "1",
        })
      );
    }
  }, [userInfo, dispatch]);

  const handleSend = (text: string, file?: File) => {
    const newMsg: ChatMessage = {
      id: crypto.randomUUID(),
      conversationId:
        userInfo?.id! > 1 ? "1" + "_" + userInfo?.id : userInfo?.id + "_" + "1",
      senderId: userInfo?.id.toString()!,
      recipientId: "1",
      senderName: userInfo?.fullName!,
      senderAvatar: userInfo?.image!,
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

  return (
    <div className="flex h-screen w-full bg-gray-100 overflow-hidden">
      <div className="flex-1 flex flex-col">
        <ChatWindow
          messages={messages}
          onSend={handleSend}
          chatName={"Customer service"}
          chatAvatar={AVA_DEFAULT}
          isOnline={true}
        />
      </div>
    </div>
  );
};

export default Chat;
