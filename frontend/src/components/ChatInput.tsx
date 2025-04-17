import { useState } from 'react';
import { FiSend, FiPaperclip } from 'react-icons/fi';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
}

const ChatInput = ({ onSendMessage }: ChatInputProps) => {
  const [message, setMessage] = useState('');

  const handleSubmit = () => {
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };

  return (
    <div className="bg-white p-3 shadow-inner">
      <div className="flex items-center border rounded-full bg-gray-50 px-3 py-1.5">
        <button 
          className="text-gray-400 hover:text-gray-600"
          aria-label="파일 첨부"
        >
          <FiPaperclip size={16} />
        </button>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
          placeholder="메시지를 입력하세요..."
          className="flex-1 ml-2 bg-transparent focus:outline-none text-sm"
        />
        <button
          onClick={handleSubmit}
          disabled={!message.trim()}
          className={`ml-2 p-1.5 rounded-full ${
            message.trim() ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-400'
          }`}
          aria-label="메시지 보내기"
        >
          <FiSend size={14} />
        </button>
      </div>
    </div>
  );
};

export default ChatInput; 