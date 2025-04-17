import { useState, useRef, useEffect } from 'react';
import ChatMessage from '../ChatMessage';
import ChatInput from '../ChatInput';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'other';
  timestamp: Date;
}

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 스크롤을 항상 최신 메시지로 이동
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 초기 메시지 로드 시뮬레이션
  useEffect(() => {
    const initialMessage: Message = {
      id: 'initial',
      text: '안녕하세요! 무엇을 도와드릴까요?',
      sender: 'other',
      timestamp: new Date(),
    };
    setMessages([initialMessage]);
  }, []);

  // 메시지 전송 처리
  const handleSendMessage = (text: string) => {
    const message: Message = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date(),
    };
    
    setMessages([...messages, message]);
    
    // 응답 메시지 시뮬레이션 (실제로는 API 호출 등으로 대체)
    setTimeout(() => {
      const responseMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: '알겠습니다. 더 필요한 것이 있으신가요?',
        sender: 'other',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, responseMessage]);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-full w-full bg-gray-100 text-base">
      {/* 헤더 */}
      <div className="bg-white shadow-sm p-3 flex items-center">
        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold text-sm">
          CS
        </div>
        <div className="ml-2">
          <h1 className="font-medium text-sm">고객 서비스</h1>
          <p className="text-xs text-gray-500">온라인</p>
        </div>
      </div>

      {/* 메시지 영역 */}
      <div className="flex-1 p-3 overflow-y-auto">
        <div className="space-y-3">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* 메시지 입력 컴포넌트 */}
      <ChatInput onSendMessage={handleSendMessage} />
    </div>
  );
};

export default Chat; 