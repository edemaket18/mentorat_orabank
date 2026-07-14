// src/pages/admin/AdminReports.tsx
import React, { useEffect, useState } from 'react';
import { getStats } from '@api/admin.api';
 import { Card, CardContent } from '@components/layout/Card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const AdminReports: React.FC = () => {
  const [stats, setStats] = useState<any>({});

  useEffect(() => {
    const fetchStats = async () => {
      const res = await getStats();
      setStats(res.data);
    };
    fetchStats();
  }, []);

  const chartData = [
    { name: 'Stagiaires', value: stats.interns || 0 },
    { name: 'Mentors', value: stats.mentors || 0 },
    { name: 'Sessions', value: stats.sessions || 0 },
    { name: 'Rapports', value: stats.reports || 0 },
  ];

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Statistiques</h1>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="value" fill="#2563eb" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AdminReports;
