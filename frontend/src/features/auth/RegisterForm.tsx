 import React, { useState } from 'react';
import { register } from '../../api/auth.api';
import { useNavigate } from 'react-router-dom';

const RegisterForm: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'intern' | 'mentor'>('intern');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await register(name, email, password, role);
      navigate('/dashboard');
    } catch (err) {
      // BUG FIX: apostrophe échappée via template literal
      setError("Erreur lors de l'inscription ou email déjà utilisé.");
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Inscription</h2>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <div>
        <label>
          Nom :
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            required
            autoComplete="name"
          />
        </label>
      </div>
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
            autoComplete="new-password"
          />
        </label>
      </div>
      <div>
        <label>
          Rôle :
          <select
            value={role}
            onChange={e => setRole(e.target.value as 'intern' | 'mentor')}
            required
          >
            <option value="intern">Stagiaire</option>
            <option value="mentor">Mentor</option>
          </select>
        </label>
      </div>
      <button type="submit" disabled={loading}>
        {loading ? 'Inscription...' : "S'inscrire"}
      </button>
    </form>
  );
};

export default RegisterForm;