import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ChatList from '../ChatList';
import Chat from './Chat';

interface ChatRoom {
  id: string;
  name: string;
  lastMessage: string;
  timestamp: Date;
  unread: number;
}

const ChatHome = () => {
  const { chatId } = useParams<{ chatId: string }>();
  const [showSidebar, setShowSidebar] = useState(window.innerWidth >= 768);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  
  // 모바일 반응형 처리
  useEffect(() => {
    const handleResize = () => {
      setShowSidebar(window.innerWidth >= 768);
      setWindowWidth(window.innerWidth);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 더미 채팅방 데이터
  const chatRooms: ChatRoom[] = [
    {
      id: '1',
      name: '고객 서비스',
      lastMessage: '안녕하세요! 무엇을 도와드릴까요?',
      timestamp: new Date(),
      unread: 1
    },
    {
      id: '2',
      name: '기술 지원',
      lastMessage: '문제가 해결되셨나요?',
      timestamp: new Date(Date.now() - 3600000), // 1시간 전
      unread: 0
    },
    {
      id: '3',
      name: '배송 문의',
      lastMessage: '주문하신 상품이 오늘 발송되었습니다.',
      timestamp: new Date(Date.now() - 86400000), // 1일 전
      unread: 2
    }
  ];

  return (
    <div className="h-screen w-full bg-gray-100 flex flex-col text-base">
      {/* 모바일 헤더 */}
      <div className="md:hidden bg-blue-500 text-white p-3 flex items-center">
        {chatId ? (
          <button 
            onClick={() => setShowSidebar(true)}
            className="mr-2 text-sm"
            aria-label="채팅 목록 보기"
          >
            &#8592;
          </button>
        ) : null}
        <h1 className="font-semibold text-base">채팅</h1>
      </div>
      
      <div className="flex flex-1 overflow-hidden w-full">
        {/* 채팅 목록 사이드바 */}
        {(showSidebar || !chatId) && (
          <div className="w-full md:w-80 bg-white md:border-r overflow-y-auto">
            <div className="hidden md:block p-3 bg-blue-500 text-white">
              <h1 className="font-semibold text-lg">채팅</h1>
            </div>
            <ChatList 
              chats={chatRooms} 
              activeChatId={chatId}
            />
          </div>
        )}
        
        {/* 채팅 영역 */}
        {chatId && (windowWidth >= 768 || !showSidebar) && (
          <div className="flex-1 flex flex-col">
            <Chat />
          </div>
        )}
        
        {/* 채팅 선택 안내 (데스크톱 전용) */}
        {!chatId && windowWidth >= 768 && (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center p-6">
              <svg className="w-12 h-12 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <h2 className="mt-3 text-lg font-semibold text-gray-700">채팅을 선택해주세요</h2>
              <p className="mt-1 text-sm text-gray-500">왼쪽 목록에서 대화할 채팅방을 선택하세요.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatHome; 