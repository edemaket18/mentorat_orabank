import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, ArrowRight } from 'lucide-react';
import ChatBox from '@features/chat/ChatBox';
import { Card, CardContent } from '@components/layout/Card';
import { getInternDashboard, InternDashboardData, getMyMessages, sendMyMessage, ChatMessage } from '@api/intern.api';

const InternDashboard: React.FC = () => {
  const [data, setData] = useState<InternDashboardData | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getInternDashboard().then(setData).catch(() => setError('Impossible de charger votre tableau de bord.'));
    getMyMessages().then(setMessages).catch(() => setError('Impossible de charger votre messagerie.'));
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
        <div><p className="dashboard-eyebrow">Mon parcours</p><h1 className="text-2xl font-bold">Bienvenue{data?.name ? `, ${data.name}` : ''} 👋</h1><p className="dashboard-subtitle">Retrouvez vos repères et échangez simplement avec votre mentor.</p></div>
        <Link className="orabank-link" to={data?.currentMentor ? '/intern/messages' : '/intern/matching'}>{data?.currentMentor ? 'Ouvrir la messagerie' : 'Trouver un mentor'} <ArrowRight size={16} /></Link>
      </div>

      {error && <div className="dashboard-state dashboard-state--error" role="alert"><AlertCircle size={20} />{error}</div>}

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
        {data?.currentMentor ? <ChatBox messages={messages} onSendMessage={handleSendMessage} /> : <div className="dashboard-state">Dès qu’un mentor sera assigné, vous pourrez échanger avec lui ici.</div>}
      </div>
    </div>
  );
};

export default InternDashboard;
