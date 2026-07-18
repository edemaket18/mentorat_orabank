import React, { useEffect, useState } from 'react';
import ChatBox from '@features/chat/ChatBox';
import { Card, CardHeader, CardTitle, CardContent } from '@components/layout/Card';
import { getInternDashboard, getMyMessages, sendMyMessage, ChatMessage } from '@api/intern.api';

const InternChat: React.FC = () => {
  const [mentorName, setMentorName] = useState<string>('votre mentor');
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  useEffect(() => {
    getInternDashboard()
      .then((data) => {
        if (data.currentMentor) setMentorName(data.currentMentor.name);
      })
      .catch(console.error);
    getMyMessages().then(setMessages).catch(console.error);
  }, []);

  const handleSendMessage = async (message: string) => {
    try {
      const sent = await sendMyMessage(message);
      setMessages((prev) => [...prev, sent]);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="p-6 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Messagerie avec {mentorName}</CardTitle>
        </CardHeader>
        <CardContent>
          <ChatBox messages={messages} onSendMessage={handleSendMessage} />
        </CardContent>
      </Card>
    </div>
  );
};

export default InternChat;