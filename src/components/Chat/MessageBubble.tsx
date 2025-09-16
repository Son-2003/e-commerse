import { ChatMessage } from "common/models/chat";

export const MessageBubble: React.FC<{ message: ChatMessage; isOwn: boolean }> = ({ message, isOwn }) => {
  return (
    <div className={`flex items-start gap-3 mb-4 ${isOwn ? "justify-end" : "justify-start"}`}>
      {!isOwn && (
        <div className="relative flex-shrink-0">
          <img
            src={message.senderAvatar}
            alt="avatar"
            className="w-8 h-8 rounded-full object-cover border-2 border-white shadow-sm"
          />
        </div>
      )}
      <div
        className={`relative max-w-xs lg:max-w-md xl:max-w-lg px-4 py-2 rounded-2xl shadow-sm transition-all duration-200 hover:shadow-md
          ${isOwn 
            ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-br-md" 
            : "bg-white text-gray-800 border border-gray-100 rounded-bl-md"}
        `}
      >
        {message.type === "TEXT" ? (
          <p className="text-sm leading-relaxed break-words">{message.content}</p>
        ) : (
          <img 
            src={message.content} 
            alt="img" 
            className="max-w-[200px] rounded-lg shadow-sm" 
          />
        )}
        <div className={`text-xs mt-1 ${isOwn ? "text-blue-100" : "text-gray-400"}`}>
          {message.timestamp ? new Date(message.timestamp).toLocaleTimeString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit'
          }) : ""}
        </div>
      </div>
      {isOwn && (
        <div className="relative flex-shrink-0">
          <img
            src={message.senderAvatar}
            alt="avatar"
            className="w-8 h-8 rounded-full object-cover border-2 border-white shadow-sm"
          />
        </div>
      )}
    </div>
  );
};