 import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@hooks/useAuth';

export type AppRole = 'admin' | 'mentor' | 'intern' | 'stagiaire' | 'hr' | 'rh';


const ROLE_GROUPS: Record<string, AppRole[]> = {
  intern: ['intern', 'stagiaire'],
  stagiaire: ['intern', 'stagiaire'],
  hr: ['hr', 'rh'],
  rh: ['hr', 'rh'],
  admin: ['admin'],
  mentor: ['mentor'],
};

interface Props {
  children: JSX.Element;
  allowedRoles?: AppRole[];
}

const PrivateRoute: React.FC<Props> = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <p>Initialisation...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && allowedRoles.length > 0) {
    const equivalentRoles = ROLE_GROUPS[user.role] ?? [user.role];
    const isAllowed = allowedRoles.some((r) => equivalentRoles.includes(r));
    if (!isAllowed) {
      return <Navigate to="/" replace />;
    }
  }

  return children;
};

export default PrivateRoute;