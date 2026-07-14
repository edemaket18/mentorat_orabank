 import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@components/layout/Card';
import { StatsChart } from '@features/chat/StatsChart';
import { Badge } from '@components/layout/Badge';
import { Separator } from '@components/layout/separator';
import axios from 'axios';
import { Loader } from '@components/layout/Loader';   

interface Stats {
  monthlyRegistrations: ChartDataPoint[];
  interns: number;
  contracts: number;
  reports: number;
  pendingMatches: number;
}

interface ChartDataPoint {
  id: string;
  name: string;
  value: number;
  month: string;
  count: number;
}

export const RhDashboardPage: React.FC = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get('/api/rh/stats');
        setStats(response.data);
      } catch (error) {
        console.error('Erreur lors du chargement des statistiques RH', error);
        setStats({ interns: 0, contracts: 0, reports: 0, pendingMatches: 0, monthlyRegistrations: [] }); // fallback
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="dashboard-shell dashboard-page">
      <div className="dashboard-heading">
        <h1 className="text-2xl font-bold">Bienvenue, Responsable RH</h1>
        <p className="text-muted-foreground">Tableau de bord de gestion des stagiaires</p>
      </div>

      <Separator />

      {loading || !stats ? (
        <div className="flex justify-center items-center py-10">
          <Loader /> {/* ou un simple <p>Chargement...</p> */}
        </div>
      ) : (
        <>
          <div className="dashboard-grid">
            <Card className="dashboard-card">
              <CardContent className="p-4">
                <h3 className="dashboard-card-header">Stagiaires</h3>
                <p className="text-2xl font-bold">{stats.interns}</p>
              </CardContent>
            </Card>
            <Card className="dashboard-card">
              <CardContent className="p-4">
                <h3 className="dashboard-card-header">Contrats signés</h3>
                <p className="text-2xl font-bold">{stats.contracts}</p>
              </CardContent>
            </Card>
            <Card className="dashboard-card">
              <CardContent className="p-4">
                <h3 className="dashboard-card-header">Rapports soumis</h3>
                <p className="text-2xl font-bold">{stats.reports}</p>
              </CardContent>
            </Card>
            <Card className="dashboard-card">
              <CardContent className="p-4">
                <h3 className="dashboard-card-header">Matching en attente</h3>
                <p className="text-2xl font-bold">{stats.pendingMatches}</p>
                <Badge variant="destructive" className="mt-2">À traiter</Badge>
              </CardContent>
            </Card>
          </div>

          <Card className="dashboard-card">
            <CardContent className="p-4">
              <h2 className="text-lg font-semibold mb-4">Statistiques mensuelles</h2>
              <StatsChart data={stats.monthlyRegistrations} />
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default RhDashboardPage;
