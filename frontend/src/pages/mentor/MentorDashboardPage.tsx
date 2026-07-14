 // src/pages/mentor/MentorDashboardPage.tsx
import React, { useEffect, useState } from 'react';
import { getMentorStats, getAssignedInterns } from '../../api/mentor.api';
import { InternCard } from '@features/cards/InternCard';
import { StatsChart } from '@features/chat/StatsChart';
import { Card, CardContent } from '@components/layout/Card';
import { Intern } from '@api/intern.api';

const MentorDashboardPage: React.FC = () => {
  const [stats, setStats] = useState<{ totalInterns: number; reportsReviewed: number }>({
    totalInterns: 0,
    reportsReviewed: 0,
  });
  const [interns, setInterns] = useState<Intern[]>([]);

  const mentorId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!mentorId) return;

        const statsRes = await getMentorStats(mentorId);
        setStats( {
          totalInterns: statsRes.data.totalInterns,
          reportsReviewed: statsRes.data.feedbacksCount,
        });

        const internsRes = await getAssignedInterns(mentorId);
        setInterns(internsRes);
      } catch (error) {
        console.error('Erreur lors du chargement des données du mentor:', error);
      }
    };

    fetchData();
  }, [mentorId]);

  return (
    <div className="dashboard-shell dashboard-page">
      <div className="dashboard-heading">
        <h1 className="text-2xl font-bold">Tableau de bord Mentor</h1>
      </div>

      <div className="dashboard-grid">
        <Card className="dashboard-card">
          <CardContent className="p-4">
            <p className="dashboard-card-header">Stagiaires assignés</p>
            <p className="text-3xl font-bold">{stats.totalInterns}</p>
          </CardContent>
        </Card>
        <Card className="dashboard-card">
          <CardContent className="p-4">
            <p className="dashboard-card-header">Rapports évalués</p>
            <p className="text-3xl font-bold">{stats.reportsReviewed}</p>
          </CardContent>
        </Card>
      </div>

      <div className="dashboard-section">
        <Card className="dashboard-card">
          <CardContent className="p-4">
            <h2 className="text-lg font-semibold mb-2">Évolution de l’activité</h2>
            <StatsChart dataKey="reportsReviewed" data={[]} />
          </CardContent>
        </Card>
      </div>

      <div className="dashboard-section">
        <h2 className="text-xl font-semibold mb-2">Stagiaires en cours</h2>
        <div className="dashboard-grid">
          {interns.map((intern) => (
            <InternCard key={intern._id} intern={intern} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MentorDashboardPage;
