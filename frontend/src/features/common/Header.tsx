import React from 'react';
import { Link } from 'react-router-dom';
import Avatar from './Avatar';

interface HeaderProps {
  userName?: string;
  userAvatar?: string;
}

const Header: React.FC<HeaderProps> = ({ userName, userAvatar }) => {
  return (
    <header
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '1rem 2rem',
        background: '#1976d2',
        color: '#fff',
      }}
    >
      <div>
        <Link to="/" style={{ color: '#fff', textDecoration: 'none', fontWeight: 'bold', fontSize: 24 }}>
          Mon Application
        </Link>
      </div>
      <nav>
        <Link to="/dashboard" style={{ color: '#fff', marginRight: 20 }}>
          Tableau de bord
        </Link>
        <Link to="/profile" style={{ color: '#fff', marginRight: 20 }}>
          Profil
        </Link>
        <Link to="/settings" style={{ color: '#fff' }}>
          Paramètres
        </Link>
      </nav>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Avatar src={userAvatar} name={userName} size={36} />
        {userName && <span style={{ marginLeft: 10 }}>{userName}</span>}
      </div>
    </header>
  );
};

export default Header;
