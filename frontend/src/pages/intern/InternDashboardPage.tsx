 import React from 'react';
import MentorCard from '@features/cards/MentorCard';
import ReportCard from '@features/cards/ReportCard';
import ChatBox from '@features/chat/ChatBox';
import { Card, CardContent } from '@components/layout/Card';

const InternDashboard: React.FC = () => {
  const internInfo = {
    name: 'Jean Koffi',
    mentorshipProgress: 75,
    currentMentor: {
      name: 'Awa Traoré',
      expertise: 'Finance',
      company: 'Orabank Togo',
      available: true,
      id: 'mentor123',
      domain: 'Finance',
      email: 'awa.traore@orabank.tg',
      mentorId: 'mentor123',
      profilePicture: 'https://example.com/mentor.jpg',
    },
    lastReport: {
      title: 'Rapport Mensuel - Juin',
      status: 'Validé',
      submittedAt: '2025-07-10',
    },

  };

  return (
    <div className="dashboard-shell dashboard-page">
      <div className="dashboard-heading">
        <h1 className="text-2xl font-bold">Bienvenue, {internInfo.name} 👋</h1>
      </div>

      <div className="dashboard-grid">
        <MentorCard
          mentor={internInfo.currentMentor}
          name={internInfo.currentMentor.name}
          expertise={internInfo.currentMentor.expertise}
          company={internInfo.currentMentor.company}
          id={internInfo.currentMentor.id}
          available={internInfo.currentMentor.available}
          onRequest={function (): void {
            throw new Error('Function not implemented.');
          }}
        />

        <ReportCard
          report={internInfo.lastReport}
          title={''}
          status={'en attente'}
          createdAt={''}
          onView={function (): void {
            throw new Error('Function not implemented.');
          }}
        />

        <Card className="dashboard-card">
          <CardContent className="p-4">
            <p className="dashboard-card-header">Progression Mentorat</p>
            <div className="mt-2 w-full bg-gray-200 rounded-full h-4">
              <div
                className="bg-green-500 h-4 rounded-full text-xs text-white text-center"
                style={{ width: `${internInfo.mentorshipProgress}%` }}
              >
                {internInfo.mentorshipProgress}%
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="dashboard-section">
        <h2 className="text-lg font-semibold mb-2">Messagerie avec votre mentor</h2>
        <ChatBox
          mentorId="mentor123"
          messages={[]}
          onSendMessage={function (message: string): void {
            throw new Error('Function not implemented.');
          }}
        />
      </div>
    </div>
  );
};

export default InternDashboard;
