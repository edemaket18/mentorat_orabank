import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, Mail, Search, UserRound } from 'lucide-react';
import { getMyInterns, MentorInternSummary } from '@api/mentor.api';

const MentorInterns: React.FC = () => {
  const [interns, setInterns] = useState<MentorInternSummary[]>([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    getMyInterns()
      .then((data) => {
        if (active) setInterns(data);
      })
      .catch(() => {
        if (active) setError('Impossible de charger vos stagiaires pour le moment.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const filteredInterns = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return interns;

    return interns.filter(({ intern }) =>
      [intern?.name, intern?.email].some((value) => value?.toLowerCase().includes(normalizedQuery)),
    );
  }, [interns, query]);

  return (
    <section className="dashboard-shell dashboard-page">
      <div className="dashboard-heading">
        <div>
          <p className="dashboard-eyebrow">Suivi individuel</p>
          <h1 className="text-2xl font-bold">Mes stagiaires</h1>
          <p className="dashboard-subtitle">Retrouvez les personnes que vous accompagnez et leurs objectifs.</p>
        </div>
        <span className="dashboard-heading__count">{interns.length} accompagnés</span>
      </div>

      <div className="dashboard-toolbar">
        <label className="dashboard-search">
          <Search aria-hidden="true" size={18} />
          <span className="sr-only">Rechercher un stagiaire</span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Rechercher par nom ou email"
          />
        </label>
      </div>

      {error && (
        <div className="dashboard-state dashboard-state--error" role="alert">
          <AlertCircle size={20} aria-hidden="true" />
          {error}
        </div>
      )}

      {loading ? (
        <div className="dashboard-state">Chargement de vos stagiaires...</div>
      ) : filteredInterns.length === 0 ? (
        <div className="dashboard-state">
          <UserRound size={28} aria-hidden="true" />
          <strong>{query ? 'Aucun résultat' : 'Aucun stagiaire assigné'}</strong>
          <span>{query ? 'Essayez un autre nom ou une autre adresse email.' : 'Les nouveaux mentorats apparaîtront ici.'}</span>
        </div>
      ) : (
        <div className="dashboard-grid">
          {filteredInterns.map(({ matchId, intern, goals, progress }) => (
            <article className="dashboard-card mentor-intern-card" key={matchId}>
              <div className="mentor-intern-card__header">
                <div className="mentor-intern-card__avatar"><UserRound size={22} aria-hidden="true" /></div>
                <div>
                  <h2>{intern?.name ?? 'Stagiaire sans profil'}</h2>
                  {intern?.email && <a href={`mailto:${intern.email}`}><Mail size={14} aria-hidden="true" /> {intern.email}</a>}
                </div>
              </div>
              <p className="mentor-intern-card__progress">Progression : <strong>{progress || 'À définir'}</strong></p>
              {goals.length > 0 && (
                <ul className="mentor-intern-card__goals">
                  {goals.slice(0, 3).map((goal) => <li key={goal}>{goal}</li>)}
                </ul>
              )}
              {intern && <Link className="orabank-link" to={`/interns/${intern._id}`}>Consulter le profil</Link>}
            </article>
          ))}
        </div>
      )}
    </section>
  );
};

export default MentorInterns;
