import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@components/layout/Card';
import ChatBox from '@features/chat/ChatBox';
import {
  getMyInterns,
  getMessagesWithIntern,
  sendMessageToIntern,
  MentorInternSummary,
  MentorChatMessage,
} from '@api/mentor.api';

const MentorMessages: React.FC = () => {
  const [interns, setInterns] = useState<MentorInternSummary[]>([]);
  const [selectedMatchId, setSelectedMatchId] = useState<string>('');
  const [messages, setMessages] = useState<MentorChatMessage[]>([]);

  useEffect(() => {
    getMyInterns().then((data) => {
      setInterns(data);
      if (data.length > 0) setSelectedMatchId(data[0].matchId);
    }).catch(console.error);
  }, []);

  useEffect(() => {
    if (!selectedMatchId) return;
    getMessagesWithIntern(selectedMatchId).then(setMessages).catch(console.error);
  }, [selectedMatchId]);

  const handleSend = async (content: string) => {
    if (!selectedMatchId) return;
    try {
      const sent = await sendMessageToIntern(selectedMatchId, content);
      setMessages((prev) => [...prev, sent]);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Messagerie</CardTitle>
        </CardHeader>
        <CardContent>
          {interns.length === 0 ? (
            <p className="text-center text-gray-500">Aucun stagiaire suivi pour le moment.</p>
          ) : (
            <>
              <select
                className="border rounded px-3 py-2 mb-4 w-full"
                value={selectedMatchId}
                onChange={(e) => setSelectedMatchId(e.target.value)}
              >
                {interns.map((i) => (
                  <option key={i.matchId} value={i.matchId}>{i.intern?.name}</option>
                ))}
              </select>
              <ChatBox messages={messages} onSendMessage={handleSend} />
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MentorMessages;