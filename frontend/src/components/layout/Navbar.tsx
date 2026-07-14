import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

function Navbar() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  const closeMenu = () => setOpen(false);

  return (
    <nav className="navbar">
      <div className="navbar__brand">
        <Link to="/">MI-Platform</Link>
      </div>

      <div className="navbar__links">
        <Link to="/" className="navbar__link" onClick={closeMenu}>Accueil</Link>
        {user && (
          <>
            <Link to="/dashboard" className="navbar__link" onClick={closeMenu}>Dashboard</Link>
            <Link to="/profile" className="navbar__link" onClick={closeMenu}>Profil</Link>
            <Link to="/settings" className="navbar__link" onClick={closeMenu}>Paramètres</Link>
            <button onClick={() => { logout(); closeMenu(); }} className="navbar__button">Déconnexion</button>
          </>
        )}
        {!user && (
          <>
            <Link to="/login" className="navbar__link" onClick={closeMenu}>Connexion</Link>
            <Link to="/register" className="navbar__link" onClick={closeMenu}>Inscription</Link>
          </>
        )}
      </div>

      <button className="navbar__toggle" onClick={() => setOpen((prev) => !prev)} aria-label="Ouvrir le menu">
        ☰
      </button>

      <div className={`navbar__mobile ${open ? 'open' : ''}`}>
        <Link to="/" className="navbar__link" onClick={closeMenu}>Accueil</Link>
        {user && (
          <>
            <Link to="/dashboard" className="navbar__link" onClick={closeMenu}>Dashboard</Link>
            <Link to="/profile" className="navbar__link" onClick={closeMenu}>Profil</Link>
            <Link to="/settings" className="navbar__link" onClick={closeMenu}>Paramètres</Link>
            <button onClick={() => { logout(); closeMenu(); }} className="navbar__button">Déconnexion</button>
          </>
        )}
        {!user && (
          <>
            <Link to="/login" className="navbar__link" onClick={closeMenu}>Connexion</Link>
            <Link to="/register" className="navbar__link" onClick={closeMenu}>Inscription</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;

