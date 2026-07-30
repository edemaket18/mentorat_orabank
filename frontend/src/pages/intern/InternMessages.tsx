import React, { useRef, useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@components/layout/Card';
import { Input } from '@components/layout/Input';
import { Button } from '@components/common/Button';
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';
import { Smile } from 'lucide-react';
import { getMyMessages, sendMyMessage, ChatMessage } from '@api/intern.api';

const InternMessages: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getMyMessages().then(setMessages).catch(console.error);
  }, []);

  const handleSend = async () => {
    if (newMessage.trim() === '') return;
    try {
      const sent = await sendMyMessage(newMessage);
      setMessages((prev) => [...prev, sent]);
      setNewMessage('');
      setShowEmojiPicker(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    setNewMessage((prev) => prev + emojiData.emoji);
  };

  return (
    <div className="p-6 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Messagerie avec votre mentor</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 max-h-[500px] overflow-y-auto">
          {messages.length === 0 && (
            <p className="text-center text-gray-500">Aucun message pour le moment. 👋</p>
          )}
          {messages.map((msg, idx) => (
            <div key={idx} className={`p-3 rounded-lg ${msg.from === 'me' ? 'bg-blue-100 dark:bg-blue-900 ml-auto text-right' : 'bg-gray-100 dark:bg-gray-800'}`}>
              <div className="text-sm whitespace-pre-wrap break-words">{msg.content}</div>
              <div className="text-xs text-gray-500">{new Date(msg.timestamp).toLocaleString()}</div>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="relative">
        {showEmojiPicker && (
          <div ref={pickerRef} className="absolute bottom-14 right-0 z-20">
            <EmojiPicker onEmojiClick={handleEmojiClick} height={350} width={300} />
          </div>
        )}
        <div className="flex items-center gap-2 mt-4">
          <button
            type="button"
            onClick={() => setShowEmojiPicker((prev) => !prev)}
            className="text-gray-400 hover:text-gray-600 p-2"
            aria-label="Insérer un emoji"
          >
            <Smile size={20} />
          </button>
          <Input
            placeholder="Écrire un message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            name="message"
          />
          <Button onClick={handleSend}>Envoyer</Button>
        </div>
      </div>
    </div>
  );
};

export default InternMessages;