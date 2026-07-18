 import React, { useEffect, useState } from 'react';
import ChatBox from '@features/chat/ChatBox';
import { Card, CardContent } from '@components/layout/Card';
import { getInternDashboard, InternDashboardData, getMyMessages, sendMyMessage, ChatMessage } from '@api/intern.api';

const InternDashboard: React.FC = () => {
  const [data, setData] = useState<InternDashboardData | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  useEffect(() => {
    getInternDashboard().then(setData).catch(console.error);
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
    <div className="dashboard-shell dashboard-page">
      <div className="dashboard-heading">
        <h1 className="text-2xl font-bold">Bienvenue{data?.name ? `, ${data.name}` : ''} 👋</h1>
      </div>

      <div className="dashboard-grid">
        <Card className="dashboard-card">
          <CardContent className="p-4">
            <p className="dashboard-card-header">Mon mentor</p>
            {data?.currentMentor ? (
              <>
                <p className="font-semibold mt-2">{data.currentMentor.name}</p>
                <p className="text-sm text-gray-500">{data.currentMentor.expertise}</p>
                <p className="text-sm text-gray-500">{data.currentMentor.email}</p>
              </>
            ) : (
              <p className="text-sm text-gray-500 mt-2">Aucun mentor assigné pour le moment.</p>
            )}
          </CardContent>
        </Card>

        <Card className="dashboard-card">
          <CardContent className="p-4">
            <p className="dashboard-card-header">Dernier rapport</p>
            {data?.lastReport ? (
              <>
                <p className="font-semibold mt-2">{data.lastReport.title}</p>
                <p className="text-sm text-gray-500">{data.lastReport.status}</p>
              </>
            ) : (
              <p className="text-sm text-gray-500 mt-2">Aucun rapport soumis pour le moment.</p>
            )}
          </CardContent>
        </Card>

        <Card className="dashboard-card">
          <CardContent className="p-4">
            <p className="dashboard-card-header">Progression Mentorat</p>
            <div className="mt-2 w-full bg-gray-200 rounded-full h-4">
              <div
                className="bg-green-500 h-4 rounded-full text-xs text-white text-center"
                style={{ width: `${data?.mentorshipProgress ?? 0}%` }}
              >
                {data?.mentorshipProgress ?? 0}%
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="dashboard-section">
        <h2 className="text-lg font-semibold mb-2">Messagerie avec votre mentor</h2>
        <ChatBox messages={messages} onSendMessage={handleSendMessage} />
      </div>
    </div>
  );
};

export default InternDashboard;