import { ChatMessage } from "common/models/chat";
import { useEffect, useRef, useState } from "react";
import { MessageBubble } from "./MessageBubble";
import {
  ArrowLeftOutlined,
  MenuOutlined,
  PlusCircleOutlined,
  SendOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@redux/store";
import { useNavigate } from "react-router-dom";

export const ChatWindow: React.FC<{
  messages: ChatMessage[];
  onSend: (text: string, file?: File) => void;
  chatName?: string;
  chatAvatar?: string;
  isOnline?: boolean;
  onOpenSidebar?: () => void;
}> = ({ messages, onSend, chatName, chatAvatar, isOnline, onOpenSidebar }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [text, setText] = useState("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const navigate = useNavigate();
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const { userInfo, adminInfo } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (text.trim()) {
      onSend(text);
      setText("");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onSend("", e.target.files[0]);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      {chatName && (
        <div className="flex-shrink-0 bg-white border-b border-gray-200 shadow-sm">
          <div className="flex items-center gap-4 p-4 lg:p-6">
            <button
              onClick={onOpenSidebar}
              className="lg:hidden p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              {!userInfo ? <MenuOutlined /> : ""}
            </button>
            {userInfo && (
              <ArrowLeftOutlined
                onClick={() => navigate("/")}
                className="p-2 rounded-full text-black hover:bg-gray-100 transition-colors"
              />
            )}
            <div className="relative flex-shrink-0">
              <img
                src={chatAvatar}
                alt="avatar"
                className="w-10 h-10 lg:w-12 lg:h-12 rounded-full object-cover border-2 border-white shadow-sm"
              />
              {isOnline && (
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 truncate text-base lg:text-lg">
                {chatName}
              </h3>
              <p className="text-sm text-gray-500">
                {isOnline ? "Online" : "Online 2 minutes"}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-1">
        {messages.map((msg, index) => (
          <MessageBubble
            key={index}
            message={msg}
            isOwn={
              msg.senderName ===
              (userInfo ? userInfo.fullName : adminInfo?.fullName)
            }
          />
        ))}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="flex-shrink-0 bg-white border-t border-gray-200 p-4">
        <div className="flex items-center gap-3">
          <PlusCircleOutlined
            onClick={() => fileInputRef.current?.click()}
            className="flex-shrink-0 p-2 text-2xl text-gray-500 hover:text-black hover:bg-black/10 rounded-full transition-all duration-200"
          />

          <div className="flex-1 relative">
            <input
              className="w-full border border-gray-300 rounded-sm px-4 py-3 pr-12 outline-none transition-all duration-200"
              placeholder="Send messages..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
            />
            <SendOutlined
              onClick={handleSend}
              disabled={!text.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-xl text-gray-500 hover:bg-white hover:text-black transition-all duration-200 hover:scale-105"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
