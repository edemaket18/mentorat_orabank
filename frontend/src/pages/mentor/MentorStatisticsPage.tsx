 import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@components/layout/Card';
import { getMyMentorStatistics, MentorStatistics } from '@api/mentor.api';

const MentorStatisticsPage: React.FC = () => {
  const [stats, setStats] = useState<MentorStatistics | null>(null);

  useEffect(() => {
    getMyMentorStatistics().then(setStats).catch(console.error);
  }, []);

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Statistiques</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border rounded-md p-4 text-center">
              <p className="text-sm text-muted-foreground">Stagiaires actifs</p>
              <p className="text-xl font-semibold">{stats?.activeInterns ?? '-'}</p>
            </div>
            <div className="border rounded-md p-4 text-center">
              <p className="text-sm text-muted-foreground">Mentorats terminés</p>
              <p className="text-xl font-semibold">{stats?.completedMentorships ?? '-'}</p>
            </div>
            <div className="border rounded-md p-4 text-center">
              <p className="text-sm text-muted-foreground">Retours envoyés</p>
              <p className="text-xl font-semibold">{stats?.feedbackGiven ?? '-'}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MentorStatisticsPage;