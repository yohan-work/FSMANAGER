import { Link } from 'react-router-dom';

interface ChatRoom {
  id: string;
  name: string;
  lastMessage: string;
  timestamp: Date;
  unread: number;
}

interface ChatListProps {
  chats: ChatRoom[];
  activeChatId?: string;
}

const ChatList = ({ chats, activeChatId }: ChatListProps) => {
  return (
    <div className="bg-white shadow overflow-hidden">
      <div className="p-3 bg-blue-500 text-white">
        <h2 className="font-semibold text-base">메시지</h2>
      </div>
      <div className="divide-y">
        {chats.map(chat => (
          <Link
            key={chat.id}
            to={`/chat/${chat.id}`}
            className={`block p-3 hover:bg-gray-50 transition ${
              activeChatId === chat.id ? 'bg-blue-50' : ''
            }`}
          >
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-gray-300 flex-shrink-0 flex items-center justify-center font-semibold text-sm text-white">
                {chat.name.charAt(0)}
              </div>
              <div className="ml-3 flex-1 overflow-hidden">
                <div className="flex justify-between items-baseline">
                  <h3 className="font-medium text-sm truncate">{chat.name}</h3>
                  <span className="text-xs text-gray-500">
                    {formatTime(chat.timestamp)}
                  </span>
                </div>
                <p className="text-xs text-gray-600 truncate">{chat.lastMessage}</p>
              </div>
              {chat.unread > 0 && (
                <div className="ml-2 bg-blue-500 text-white text-xs font-semibold rounded-full w-4 h-4 flex items-center justify-center">
                  {chat.unread}
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

// 메시지 시간을 포맷팅하는 함수
const formatTime = (date: Date) => {
  const now = new Date();
  const isToday = date.getDate() === now.getDate() &&
                  date.getMonth() === now.getMonth() &&
                  date.getFullYear() === now.getFullYear();
  
  if (isToday) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  
  return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
};

export default ChatList; 