// src/components/chat/ChatBox.tsx

import React, { useRef, useState } from 'react';
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';
import { Smile } from 'lucide-react';

interface Message {
  from: 'me' | 'mentor';
  content: string;
  timestamp: string;
}

interface ChatBoxProps {
  messages: Message[];
  onSendMessage: (message: string) => void;
  mentorId?: string;
  mentor?: {
    id: string;
    name: string;
    domain: string;
    email: string;
    mentorId: string;
    profilePicture: string;
    avatar?: string;
  } | null;
}

const ChatBox: React.FC<ChatBoxProps> = ({ messages, onSendMessage, mentorId, mentor }) => {
  const [newMessage, setNewMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);

  const handleSend = () => {
    if (newMessage.trim() !== '') {
      onSendMessage(newMessage);
      setNewMessage('');
      setShowEmojiPicker(false);
    }
  };

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    setNewMessage((prev) => prev + emojiData.emoji);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4 h-[400px] flex flex-col">
      <div className="flex-1 overflow-y-auto space-y-2">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`p-2 rounded-lg max-w-xs ${
              msg.from === 'me'
                ? 'bg-blue-500 text-white self-end'
                : 'bg-gray-200 dark:bg-gray-700 text-black dark:text-white self-start'
            }`}
          >
            <p className="text-sm whitespace-pre-wrap break-words">{msg.content}</p>
            <span className="text-[10px] block text-right mt-1 opacity-70">{msg.timestamp}</span>
          </div>
        ))}
        {messages.length === 0 && (
          <p className="text-sm text-gray-400 text-center mt-4">Aucun message pour le moment. 👋</p>
        )}
      </div>
      <div className="mt-4 relative">
        {showEmojiPicker && (
          <div ref={pickerRef} className="absolute bottom-14 right-0 z-20">
            <EmojiPicker onEmojiClick={handleEmojiClick} height={350} width={300} />
          </div>
        )}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowEmojiPicker((prev) => !prev)}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-2"
            aria-label="Insérer un emoji"
          >
            <Smile size={20} />
          </button>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            className="flex-1 rounded-lg border px-3 py-2 text-sm dark:bg-gray-700 dark:text-white"
            placeholder="Écrire un message..."
          />
          <button
            onClick={handleSend}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700"
          >
            Envoyer
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBox;