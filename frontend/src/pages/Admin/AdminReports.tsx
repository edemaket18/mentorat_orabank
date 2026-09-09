// src/pages/admin/AdminReports.tsx
import React, { useEffect, useState } from 'react';
import { getStats } from '@api/admin.api';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const AdminReports: React.FC = () => {
  const [stats, setStats] = useState<any>({});

  useEffect(() => {
    const fetchStats = async () => {
      const res = await getStats();
      setStats(res);
    };
    fetchStats();
  }, []);

  const chartData = [
    { name: 'Stagiaires', value: stats.totalStagiaires || 0 },
    { name: 'Mentors', value: stats.totalMentors || 0 },
    { name: 'Mentorats', value: stats.totalMentorships || 0 },
    { name: 'Rapports', value: stats.totalReports || 0 },
  ];

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Statistiques</h1>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="value" fill="var(--orabank-blue)" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AdminReports;
