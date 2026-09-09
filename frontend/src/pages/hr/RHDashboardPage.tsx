import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@components/layout/Card';
import { getRHStatistics, RHStatistics } from '@api/rh.api';

export const RhDashboardPage: React.FC = () => {
  const [stats, setStats] = useState<RHStatistics | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { getRHStatistics().then(setStats).catch(() => setError('Impossible de charger les indicateurs RH.')); }, []);

  return (
    <section className="dashboard-shell dashboard-page">
      <div className="dashboard-heading">
        <div><p className="dashboard-eyebrow">Pilotage RH</p><h1 className="text-2xl font-bold">Tableau de bord RH</h1><p className="dashboard-subtitle">Une vue d’ensemble des ressources et des accompagnements en cours.</p></div>
        <Link className="orabank-link" to="/hr/matching">Gérer le matching <ArrowRight size={16} /></Link>
      </div>
      {error && <div className="dashboard-state dashboard-state--error" role="alert"><AlertCircle size={20} />{error}</div>}
      <div className="dashboard-grid">
        <Metric title="Stagiaires" value={stats?.interns} />
        <Metric title="Mentors" value={stats?.mentors} />
        <Metric title="Mentorats actifs" value={stats?.activeMentorships} />
        <Metric title="Rapports validés" value={stats?.completedReports} />
      </div>
      <Card className="dashboard-card dashboard-section"><CardContent className="p-4"><h2 className="text-lg font-semibold">Actions prioritaires</h2><div className="dashboard-action-links"><Link to="/hr/candidates">Traiter les candidatures <ArrowRight size={16} /></Link><Link to="/hr/evaluations">Planifier les évaluations <ArrowRight size={16} /></Link><Link to="/hr/departures">Suivre les départs <ArrowRight size={16} /></Link></div></CardContent></Card>
    </section>
  );
};

const Metric = ({ title, value }: { title: string; value?: number }) => <Card className="dashboard-card"><CardContent className="p-4"><p className="dashboard-card-header">{title}</p><p className="text-3xl font-bold">{value ?? '—'}</p></CardContent></Card>;

export default RhDashboardPage;
