 // src/pages/rh/RHStatisticsPage.tsx
import React, { useEffect, useState } from 'react';
import { StatsChart, ChartDataPoint } from '@features/chat/StatsChart';
import { Card, CardContent } from '@components/layout/Card';
import { getRHStatistics, RHStatistics } from '@api/rh.api';

const RHStatisticsPage: React.FC = () => {
  const [stats, setStats] = useState<RHStatistics | null>(null);

  useEffect(() => {
    getRHStatistics().then(setStats).catch(console.error);
  }, []);

  const chartData: ChartDataPoint[] = stats
    ? [
        { id: 'interns', name: 'Internes', month: 'Internes', count: stats.interns, value: stats.interns },
        { id: 'mentors', name: 'Mentors', month: 'Mentors', count: stats.mentors, value: stats.mentors },
        {
          id: 'activeMentorships',
          name: 'Accompagnements actifs',
          month: 'Accompagnements actifs',
          count: stats.activeMentorships,
          value: stats.activeMentorships,
        },
        {
          id: 'completedReports',
          name: 'Rapports terminés',
          month: 'Rapports terminés',
          count: stats.completedReports,
          value: stats.completedReports,
        },
      ]
    : [];

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Statistiques RH</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Internes</p>
            <p className="text-xl font-semibold">{stats?.interns ?? '-'}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Mentors</p>
            <p className="text-xl font-semibold">{stats?.mentors ?? '-'}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Accompagnements</p>
            <p className="text-xl font-semibold">{stats?.activeMentorships ?? '-'}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Rapports complétés</p>
            <p className="text-xl font-semibold">{stats?.completedReports ?? '-'}</p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <StatsChart data={chartData} dataKey="value" />
      </div>
    </div>
  );
};

export default RHStatisticsPage;