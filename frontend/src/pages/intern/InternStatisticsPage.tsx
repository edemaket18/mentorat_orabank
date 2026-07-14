import React, { useEffect, useState } from 'react';
import { getInternStatistics } from '@services/statisticsService';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent } from '@components/layout/Card';
import { Loader2 } from 'lucide-react';

interface InternStats {
  totalReports: number;
  totalMentorships: number;
  totalHours: number;
  evaluations: {
    month: string;
    score: number;
  }[];
}

export const InternStatisticsPage: React.FC = () => {
  const [stats, setStats] = useState<InternStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getInternStatistics();
        setStats(data);
      } catch (error) {
        console.error('Erreur lors du chargement des statistiques :', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="animate-spin h-8 w-8 text-primary" />
      </div>
    );
  }

  if (!stats) return <p>Impossible de charger les statistiques.</p>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Mes Statistiques</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Rapports générés</p>
            <p className="text-xl font-bold">{stats.totalReports}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Mentorats suivis</p>
            <p className="text-xl font-bold">{stats.totalMentorships}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Heures totales</p>
            <p className="text-xl font-bold">{stats.totalHours}</p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-2">Évaluations par mois</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={stats.evaluations}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="score" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default InternStatisticsPage;
