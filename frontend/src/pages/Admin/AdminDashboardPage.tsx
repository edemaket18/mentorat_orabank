 // src/pages/admin/DashboardPage.tsx
import React, { useEffect, useState } from 'react';
import { getDashboardStats } from '@api/admin.api';
import { toast } from 'sonner';
import { Card, CardContent } from '@components/layout/Card';
import { StatsChart } from '@features/chat/StatsChart';
import { Loader2 } from 'lucide-react';

interface Stats {
  totalUsers: number;
  totalMentors: number;
  totalInterns: number;
  totalReports: number;
  totalProjects: number;
  totalSessions: number;
  totalFeedbacks: number;
  totalAnnouncements: number;
  totalMessages: number;
  monthlyRegistrations: { month: string; count: number }[];
}

const StatCard = ({ title, value }: { title: string; value: number }) => (
  <Card className="dashboard-card">
    <CardContent className="p-4">
      <p className="dashboard-card-header">{title}</p>
      <p className="text-2xl font-bold">{value}</p>
    </CardContent>
  </Card>
);

const AdminDashboardPage: React.FC = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await getDashboardStats();
        setStats(res.data);
      } catch (error) {
        toast.error('Erreur lors du chargement des statistiques.');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin h-10 w-10 text-muted" />
      </div>
    );
  }

  if (!stats) {
    return <p className="text-center text-red-500">Impossible de charger les données.</p>;
  }

  return (
    <div className="dashboard-shell dashboard-page">
      <div className="dashboard-heading">
        <h1 className="text-2xl font-bold">Tableau de bord Admin</h1>
      </div>

      <div className="dashboard-grid">
        <StatCard title="Utilisateurs" value={stats.totalUsers} />
        <StatCard title="Mentors" value={stats.totalMentors} />
        <StatCard title="Stagiaires" value={stats.totalInterns} />
        <StatCard title="Signalements" value={stats.totalReports} />
      </div>

      <div className="dashboard-section">
        <Card className="dashboard-card">
          <CardContent className="p-4">
            <h2 className="text-lg font-semibold mb-4">Évolution mensuelle</h2>
            <StatsChart
              data={stats.monthlyRegistrations.map((item) => ({
                id: item.month,
                name: item.month,
                value: item.count,
                month: item.month,
                count: item.count,
              }))}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboardPage;

 