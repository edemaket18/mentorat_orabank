 import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@components/layout/Card';
import { Input } from '@components/layout/Input';
import { Button } from '@components/common/Button';

type Message = {
  id: string;
  from: string;
  to: string;
  content: string;
  createdAt: string;
};

const mockMessages: Message[] = [
  {
    id: '1',
    from: 'Mentor Sandra',
    to: 'Moi',
    content: 'Bonjour, on commence le suivi lundi prochain.',
    createdAt: '2025-07-15 10:00',
  },
  {
    id: '2',
    from: 'Moi',
    to: 'Mentor Sandra',
    content: 'Parfait, merci beaucoup !',
    createdAt: '2025-07-15 10:02',
  },
];

const InternMessages: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [newMessage, setNewMessage] = useState('');

  const handleSend = () => {
    if (newMessage.trim() === '') return;

    const message: Message = {
      id: Date.now().toString(),
      from: 'Moi',
      to: 'Mentor Sandra',
      content: newMessage,
      createdAt: new Date().toLocaleString(),
    };

    setMessages([...messages, message]);
    setNewMessage('');
  };

  return (
    <div className="p-6 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Messagerie avec votre mentor</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 max-h-[500px] overflow-y-auto">
          {messages.map((msg) => (
            <div key={msg.id} className={`p-3 rounded-lg ${msg.from === 'Moi' ? 'bg-blue-100 dark:bg-blue-900 ml-auto text-right' : 'bg-gray-100 dark:bg-gray-800'}`}>
              <div className="text-sm font-semibold">{msg.from}</div>
              <div className="text-sm">{msg.content}</div>
              <div className="text-xs text-gray-500">{msg.createdAt}</div>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="flex items-center gap-2 mt-4">
        <Input
          placeholder="Écrire un message..."
          value={ newMessage }
          onChange={ (e) => setNewMessage(e.target.value) } name={ '' }        />
        <Button onClick={handleSend}>Envoyer</Button>
      </div>
    </div>
  );
};

export default InternMessages;

