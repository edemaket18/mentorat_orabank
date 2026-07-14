 import React, { useState } from 'react';
import { login as loginApi } from '../../api/auth.api';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  // BUG FIX: récupérer login() du contexte pour mettre à jour l'état global
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const userData = await loginApi(email, password);
      // BUG FIX: mettre à jour le contexte Auth avec les données reçues
      login({
        id: userData._id,
        name: userData.name,
        email: userData.email,
        role: userData.role as 'admin' | 'mentor' | 'intern' | 'hr' | 'rh',
      });
      navigate('/dashboard');
    } catch (err) {
      setError('Identifiants invalides ou erreur de connexion.');
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Connexion</h2>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <div>
        <label>
          Email :
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            autoComplete="username"
          />
        </label>
      </div>
      <div>
        <label>
          Mot de passe :
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
        </label>
      </div>
      <div>
        <button type="submit" disabled={loading}>
          {loading ? 'Chargement...' : 'Se connecter'}
        </button>
      </div>
    </form>
  );
};

export default LoginForm;