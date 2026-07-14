import React, { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { useAuth } from '@hooks/useAuth';
import Sidebar from '../features/common/Sidebar';
import type { AppRole } from '../routes/PrivateRoute';

const ROLE_LABELS: Record<string, string> = {
  admin: 'Administrateur',
  mentor: 'Mentor',
  hr: 'Ressources Humaines',
  rh: 'Ressources Humaines',
  intern: 'Stagiaire',
  stagiaire: 'Stagiaire',
};

const AppShell: React.FC = () => {
  const { user, logout } = useAuth();
  const [drawerOpen, setDrawerOpen] = useState(false);

  if (!user) return null;

  const role = user.role as AppRole;
  const closeDrawer = () => setDrawerOpen(false);

  return (
    <div className="app-shell">
      <header className="app-topbar">
        <button
          className="app-topbar__toggle"
          aria-label="Ouvrir le menu"
          onClick={() => setDrawerOpen((prev) => !prev)}
        >
          ☰
        </button>
        <Link to="/" className="app-topbar__brand">Orabank Mentorat</Link>
        <div className="app-topbar__user">
          <span className="app-topbar__role">{ROLE_LABELS[role] ?? role}</span>
          <span className="app-topbar__name">{user.name}</span>
          <button className="app-topbar__logout" onClick={() => logout()}>Déconnexion</button>
        </div>
      </header>

      <div className="app-body">
        <div className={`app-sidebar-wrap${drawerOpen ? ' app-sidebar-wrap--open' : ''}`}>
          <Sidebar role={role} onNavigate={closeDrawer} />
        </div>
        {drawerOpen && (
          <div className="app-sidebar-overlay" onClick={closeDrawer} aria-hidden="true" />
        )}

        <main className="app-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppShell;