 import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import NotAuthorized from '../components/NotAuthorized';

const HomePage: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', background: '#f8fafc' }}>
        <p style={{ fontSize: '1.1rem', color: '#334155' }}>Chargement de votre espace...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mobile-shell">
        <div className="mobile-shell__inner">
          <div className="mobile-grid">
            <div className="mobile-hero-copy">
              <div className="mobile-pill">
                <span style={{ fontSize: '1rem' }}>🏦</span>
                Orabank Togo - Programme de mentorat
              </div>
              <h1 className="mobile-title">Favorisons l’épanouissement, la transmission de savoir et l’innovation.</h1>
              <p className="mobile-text">
                Orabank Togo met en place une plateforme dédiée au mentorat pour accompagner les talents, renforcer les compétences et créer des opportunités de développement durable au sein de la banque et de ses partenaires.
              </p>
              <div className="mobile-actions">
                <Link to="/login" className="mobile-action-btn mobile-action-btn--primary">
                  Se connecter
                </Link>
                <Link to="/register" className="mobile-action-btn mobile-action-btn--secondary">
                  Créer un compte
                </Link>
              </div>
              <div className="mobile-highlights">
                <span>✅ Accompagnement de carrière</span>
                <span>✅ Sessions de mentorat</span>
                <span>✅ Suivi des documents</span>
              </div>
            </div>
            <div className="mobile-hero-card">
              <h3>À propos d’Orabank Togo</h3>
              <p>
                Orabank Togo est une institution financière engagée dans le développement de solutions adaptées aux besoins de ses clients et de ses collaborateurs, avec une forte volonté de soutenir l’entrepreneuriat, l’innovation et l’employabilité.
              </p>
              <div className="mobile-hero-card__box">
                <p>Pourquoi ce programme ?</p>
                <ul>
                  <li>Renforcer les compétences par le partage d’expérience</li>
                  <li>Créer un accompagnement structuré et durable</li>
                  <li>Favoriser la réussite professionnelle et personnelle</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  switch (user.role) {
    case 'admin':
      return <Navigate to="/admin/dashboard" replace />;
    case 'mentor':
      return <Navigate to="/mentor/dashboard" replace />;
    case 'intern':
    case 'stagiaire':
      return <Navigate to="/intern/dashboard" replace />;
    case 'rh':
    case 'hr':
      return <Navigate to="/hr/dashboard" replace />;
    default:
      return <NotAuthorized />;
  }
};

export default HomePage;