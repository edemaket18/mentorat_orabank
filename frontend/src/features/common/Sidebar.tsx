 import React from 'react';
import { NavLink } from 'react-router-dom';
import type { AppRole } from '../../routes/PrivateRoute';

interface MenuItem {
  label: string;
  path: string;
}

const MENUS: Record<'admin' | 'mentor' | 'hr' | 'intern', MenuItem[]> = {
  admin: [
    { label: 'Tableau de bord', path: '/admin/dashboard' },
    { label: 'Utilisateurs', path: '/admin/users' },
    { label: 'Rôles', path: '/admin/roles' },
    { label: 'Mentorats', path: '/admin/mentorships' },
    { label: 'Signalements', path: '/admin/moderation' },
    { label: 'Statistiques', path: '/admin/statistics' },
    { label: 'Ressources Humaines', path: '/admin/hr' },
    { label: 'Notifications', path: '/admin/notifications' },
    { label: 'Retours utilisateurs', path: '/admin/feedback' },
    { label: 'Paramètres', path: '/admin/settings' },
  ],
  mentor: [
    { label: 'Tableau de bord', path: '/mentor/dashboard' },
    { label: 'Mes stagiaires', path: '/mentor/interns' },
    { label: 'Candidats', path: '/mentor/candidates' },
    { label: 'Matching', path: '/mentor/matching' },
    { label: 'Mentorats', path: '/mentor/mentorships' },
    { label: 'Sessions', path: '/mentor/sessions' },
    { label: 'Évaluations', path: '/mentor/evaluations' },
    { label: 'Rapports', path: '/mentor/reports' },
    { label: 'Contrats', path: '/mentor/contracts' },
    { label: 'Départs', path: '/mentor/departures' },
    { label: 'Feedback', path: '/mentor/feedback' },
    { label: 'Notifications', path: '/mentor/notifications' },
    { label: 'Statistiques', path: '/mentor/statistics' },
    { label: 'Profil', path: '/mentor/profile' },
    { label: 'Paramètres', path: '/mentor/settings' },
  ],
  hr: [
    { label: 'Tableau de bord', path: '/hr/dashboard' },
    { label: 'Stagiaires', path: '/hr/interns' },
    { label: 'Mentors', path: '/hr/mentors' },
    { label: 'Mentorats', path: '/hr/mentorships' },
    { label: 'Matching', path: '/hr/matching' },
    { label: 'Candidatures', path: '/hr/candidates' },
    { label: 'Contrats', path: '/hr/contracts' },
    { label: 'Départs', path: '/hr/departures' },
    { label: 'Évaluations', path: '/hr/evaluations' },
    { label: 'Rapports', path: '/hr/reports' },
    { label: 'Statistiques', path: '/hr/statistics' },
    { label: 'Feedback', path: '/hr/feedback' },
    { label: 'Notifications', path: '/hr/notifications' },
    { label: 'Profil', path: '/hr/profile' },
    { label: 'Paramètres', path: '/hr/settings' },
  ],
  intern: [
    { label: 'Tableau de bord', path: '/intern/dashboard' },
    { label: 'Mon profil', path: '/intern/profile' },
    { label: 'Matching', path: '/intern/matching' },
    { label: 'Mentorats', path: '/intern/mentorships' },
    { label: 'Messagerie', path: '/intern/messages' },
    { label: 'Rapports', path: '/intern/reports' },
    { label: 'Tâches', path: '/intern/tasks' },
    { label: 'Documents', path: '/intern/documents' },
    { label: 'Contrats', path: '/intern/contracts' },
    { label: 'Évaluations', path: '/intern/evaluations' },
    { label: 'Sessions', path: '/intern/sessions' },
    { label: 'Départs', path: '/intern/departures' },
    { label: 'Candidats', path: '/intern/candidates' },
    { label: 'Feedback', path: '/intern/feedback' },
    { label: 'Notifications', path: '/intern/notifications' },
    { label: 'Statistiques', path: '/intern/statistics' },
    { label: 'Paramètres', path: '/intern/settings' },
  ],
};

const normalizeRoleForMenu = (role: AppRole): keyof typeof MENUS => {
  if (role === 'stagiaire') return 'intern';
  if (role === 'rh') return 'hr';
  return role as keyof typeof MENUS;
};

interface SidebarProps {
  role: AppRole;
  onNavigate?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ role, onNavigate }) => {
  const items = MENUS[normalizeRoleForMenu(role)] ?? [];

  return (
    <aside className="app-sidebar">
      <nav>
        <ul className="app-sidebar__list">
          {items.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                onClick={onNavigate}
                className={({ isActive }) =>
                  `app-sidebar__link${isActive ? ' app-sidebar__link--active' : ''}`
                }
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;