import { LeftOutlined, SearchOutlined } from "@ant-design/icons";
import { ChatPreview } from "common/models/chat";
import { useNavigate } from "react-router-dom";
import { formatDate } from "../../utils/FormatDate";
import { useSelector } from "react-redux";
import { RootState } from "@redux/store";

export const ChatSidebar: React.FC<{
  chats: ChatPreview[];
  selectedChatId: string | null;
  onSelectChat: (id: string) => void;
  isOpen: boolean;
  onClose: () => void;
}> = ({ chats, selectedChatId, onSelectChat, isOpen, onClose }) => {
  const navigate = useNavigate();
  const { adminInfo } = useSelector((state: RootState) => state.auth);
  const handleNavigate = () => {
    navigate("/");
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <div
        className={`
    fixed lg:relative inset-y-0 left-0 z-50 lg:z-0
    w-80 lg:w-80 xl:w-96 bg-white border-r border-gray-200 shadow-xl lg:shadow-none
    transform transition-transform duration-300 ease-in-out
    ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
  `}
      >
        {/* Sidebar container must be flex-col h-screen */}
        <div className="flex flex-col h-screen">
          {/* Header */}
          <div className="flex items-center justify-between p-4 lg:px-6 lg:py-5 border-b border-gray-100">
            <div className="flex items-center gap-x-2 text-lg">
              {!adminInfo && (
                <button onClick={handleNavigate}>
                  <LeftOutlined className="hidden lg:block rounded-full p-2 hover:bg-gray-300 hover:text-white transition-colors" />
                </button>
              )}

              <h2 className="font-bold text-2xl text-gray-800">Chats</h2>
            </div>
            <button onClick={onClose}>
              <LeftOutlined className="lg:hidden p-2 rounded-full hover:bg-gray-300 hover:text-white transition-colors" />
            </button>
          </div>

          {/* Search */}
          <div className="p-4 lg:p-6 border-b border-gray-100">
            <div className="relative">
              <input
                type="text"
                placeholder="Search conversations..."
                className="w-full pl-4 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-full text-sm outline-none"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <SearchOutlined className="text-gray-500"/>
              </div>
            </div>
          </div>

          {/* Chat List */}
          <div className="flex-1 overflow-y-auto">
            {chats.map((chat) => (
              <div
                key={chat.id}
                onClick={() => {
                  onSelectChat(chat.id);
                  onClose();
                }}
                className={`relative flex items-center gap-4 p-4 lg:px-6 cursor-pointer hover:bg-gray-50 transition-all duration-200
            ${
              selectedChatId === chat.id
                ? "bg-gray-100 border-r-4 border-black"
                : ""
            }
          `}
              >
                <div className="relative flex-shrink-0">
                  <img
                    src={chat.avatar}
                    alt="avatar"
                    className="w-12 h-12 lg:w-14 lg:h-14 rounded-full object-cover border-2 border-white shadow-sm"
                  />
                  {chat.isOnline && (
                    <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-gray-900 truncate text-sm lg:text-base">
                      {chat.name}
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400 flex-shrink-0">
                        {formatDate(chat.time)}
                      </span>
                      {chat.unreadCount && chat.unreadCount > 0 && (
                        <div className="bg-blue-500 text-white text-xs rounded-full min-w-[20px] h-5 flex items-center justify-center px-1">
                          {chat.unreadCount > 99 ? "99+" : chat.unreadCount}
                        </div>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 truncate leading-tight">
                    {chat.senderId === adminInfo?.id.toString()  && "You: "}{chat.lastMessage}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};
