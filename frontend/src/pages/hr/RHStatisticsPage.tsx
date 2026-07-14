// src/pages/rh/RHStatisticsPage.tsx
import React from 'react';
import StatsChart from '@features/chat/StatsChart';
import { Card, CardContent } from '@components/layout/Card';


const rhStats =  {

  interns: 24,
  mentors: 8,
  activeMentorships: 15,
  completedReports: 12,
   
};

const chartData: {
  name: string,
  value: number;
}[] = [];

          

const RHStatisticsPage: React.FC = () => {
  let chartData = [
    { name: 'Internes', value: rhStats.interns },
    { name: 'Mentors', value: rhStats.mentors },
    { name: 'Accompagnements actifs', value: rhStats.activeMentorships },
    { name: 'Rapports terminés', value: rhStats.completedReports },
  ];

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Statistiques RH</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Internes</p>
            <p className="text-xl font-semibold">{rhStats.interns}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Mentors</p>
            <p className="text-xl font-semibold">{rhStats.mentors}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Accompagnements</p>
            <p className="text-xl font-semibold">{rhStats.activeMentorships}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Rapports complétés</p>
            <p className="text-xl font-semibold">{rhStats.completedReports}</p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        {/*<StatsChart data={chartData} />*/}
      </div>
    </div>
  );
};

export default RHStatisticsPage;
