import React from 'react';
import ChatBox from '@features/chat/ChatBox';
import { Card, CardHeader, CardTitle, CardContent } from '@components/layout/Card';

const InternChat: React.FC = () => {
  const mentor = {
    id: 'mentor123',
    name: 'Awa Traoré',
    domain: 'Finance',
  };

  return (
    <div className="p-6 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>
            Messagerie avec votre mentor : {mentor.name} ({mentor.domain})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ChatBox mentorId={ mentor.id } messages={ [] } onSendMessage={ function (message: string): void {
            throw new Error('Function not implemented.');
          } } />
        </CardContent>
      </Card>
    </div>
  );
};

export default InternChat;
