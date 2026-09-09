 // src/pages/admin/DashboardPage.tsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getDashboardStats } from '@api/admin.api';
import { toast } from 'sonner';
import { Card, CardContent } from '@components/layout/Card';
import { Loader2 } from 'lucide-react';

interface Stats {
  totalUsers: number;
  totalMentors: number;
  totalStagiaires: number;
  totalReports: number;
  totalMentorships: number;
  totalAttestations: number;
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
        setStats(res);
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
        <div>
          <p className="dashboard-eyebrow">Administration</p>
          <h1 className="text-2xl font-bold">Tableau de bord Admin</h1>
          <p className="dashboard-subtitle">Pilotez les accès, le mentorat et les indicateurs de la plateforme.</p>
        </div>
        <Link className="orabank-link" to="/admin/users">Gérer les utilisateurs</Link>
      </div>

      <div className="dashboard-grid">
        <StatCard title="Utilisateurs" value={stats.totalUsers} />
        <StatCard title="Mentors" value={stats.totalMentors} />
        <StatCard title="Stagiaires" value={stats.totalStagiaires} />
        <StatCard title="Rapports" value={stats.totalReports} />
        <StatCard title="Mentorats" value={stats.totalMentorships} />
      </div>

      <div className="dashboard-section">
        <Card className="dashboard-card">
          <CardContent className="p-4">
            <h2 className="text-lg font-semibold mb-4">Actions administratives</h2>
            <div className="dashboard-action-links">
              <Link to="/admin/users">Valider les inscriptions et gérer les comptes</Link>
              <Link to="/admin/mentorships">Suivre les mentorats en cours</Link>
              <Link to="/admin/statistics">Consulter les statistiques détaillées</Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
