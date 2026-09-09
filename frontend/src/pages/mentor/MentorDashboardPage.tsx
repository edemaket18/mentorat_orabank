import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, ArrowRight, UsersRound } from 'lucide-react';
import { Card, CardContent } from '@components/layout/Card';
import { getMyInterns, getMyMentorStatistics, MentorInternSummary, MentorStatistics } from '@api/mentor.api';

const MentorDashboardPage: React.FC = () => {
  const [stats, setStats] = useState<MentorStatistics | null>(null);
  const [interns, setInterns] = useState<MentorInternSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    Promise.all([getMyMentorStatistics(), getMyInterns()])
      .then(([statistics, assignedInterns]) => {
        if (!active) return;
        setStats(statistics);
        setInterns(assignedInterns);
      })
      .catch(() => active && setError('Impossible de charger votre activité pour le moment.'))
      .finally(() => active && setLoading(false));

    return () => { active = false; };
  }, []);

  return (
    <section className="dashboard-shell dashboard-page">
      <div className="dashboard-heading">
        <div>
          <p className="dashboard-eyebrow">Espace accompagnement</p>
          <h1 className="text-2xl font-bold">Tableau de bord Mentor</h1>
          <p className="dashboard-subtitle">Suivez vos accompagnements et les prochaines actions à réaliser.</p>
        </div>
        <Link className="orabank-link" to="/mentor/interns">Voir mes stagiaires <ArrowRight size={16} /></Link>
      </div>

      {error && <div className="dashboard-state dashboard-state--error" role="alert"><AlertCircle size={20} />{error}</div>}

      <div className="dashboard-grid">
        <Metric title="Stagiaires actifs" value={stats?.activeInterns} loading={loading} />
        <Metric title="Mentorats terminés" value={stats?.completedMentorships} loading={loading} />
        <Metric title="Retours envoyés" value={stats?.feedbackGiven} loading={loading} />
      </div>

      <div className="dashboard-section">
        <Card className="dashboard-card">
          <CardContent className="p-4">
            <div className="dashboard-heading">
              <div>
                <h2 className="text-lg font-semibold">Stagiaires récemment suivis</h2>
                <p className="dashboard-subtitle">Les accompagnements actifs apparaissent ici.</p>
              </div>
              <span className="dashboard-heading__count">{interns.length} au total</span>
            </div>
            {loading ? <div className="dashboard-state">Chargement des accompagnements...</div> : interns.length === 0 ? (
              <div className="dashboard-state"><UsersRound size={28} /><strong>Aucun stagiaire assigné</strong><span>Les nouvelles affectations apparaîtront ici.</span></div>
            ) : (
              <div className="mentor-dashboard-list">
                {interns.slice(0, 4).map(({ matchId, intern, progress }) => (
                  <div className="mentor-dashboard-list__item" key={matchId}>
                    <div><strong>{intern?.name ?? 'Stagiaire sans profil'}</strong><span>{intern?.email ?? 'Adresse indisponible'}</span></div>
                    <span>{progress || 'Progression à définir'}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

const Metric = ({ title, value, loading }: { title: string; value?: number; loading: boolean }) => (
  <Card className="dashboard-card"><CardContent className="p-4"><p className="dashboard-card-header">{title}</p><p className="text-3xl font-bold">{loading ? '—' : value ?? 0}</p></CardContent></Card>
);

export default MentorDashboardPage;
