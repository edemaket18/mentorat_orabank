import React, { useState } from 'react';
import { register } from '../../api/auth.api';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const initialState = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  role: 'intern' as 'intern' | 'mentor',
};

export default function RegisterPage() {
  const [form, setForm] = useState(initialState);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRoleChange = (role: 'intern' | 'mentor') => {
    setForm({ ...form, role });
  };

  const validate = () => {
    if (!form.name.trim() || !form.email.trim() || !form.password || !form.confirmPassword) {
      return 'Tous les champs sont obligatoires.';
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) {
      return "L'email n'est pas valide.";
    }
    if (form.password.length < 6) {
      return 'Le mot de passe doit contenir au moins 6 caractères.';
    }
    if (form.password !== form.confirmPassword) {
      return 'Les mots de passe ne correspondent pas.';
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    setLoading(true);
    try {
      const { name, email, password, role } = form;
      const user = await register(name, email, password, role);
      login({
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role as 'intern' | 'mentor',
      });
      navigate('/');
    } catch (err: any) {
      setError(err?.response?.data?.message || "Erreur lors de l'inscription.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-shell">
      <div className="auth-grid">
        <div className="auth-intro">
          <p style={{ color: '#2563eb', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '1rem' }}>Rejoignez-nous</p>
          <h1>Créer votre compte mentorat en quelques secondes.</h1>
          <p>Choisissez votre profil, créez un accès sécurisé puis accédez à l’ensemble des services proposés.</p>
        </div>
        <div className="auth-card">
          <div className="auth-back-link">
            <Link to="/" className="auth-back-link">
              ← Retour à l’accueil
            </Link>
          </div>
          <div className="auth-heading" style={{ marginBottom: '1.5rem' }}>
            <h2>Créer un compte</h2>
            <p>Rejoignez la plateforme de mentorat</p>
          </div>
          <form className="auth-form" onSubmit={handleSubmit} autoComplete="off">
            <div className="form-group">
              <label>Je suis un</label>
              <div className="role-selector">
                <button
                  type="button"
                  className={`role-btn ${form.role === 'intern' ? 'active' : ''}`}
                  onClick={() => handleRoleChange('intern')}
                >
                  Stagiaire
                </button>
                <button
                  type="button"
                  className={`role-btn ${form.role === 'mentor' ? 'active' : ''}`}
                  onClick={() => handleRoleChange('mentor')}
                >
                  Mentor
                </button>
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="name">Nom complet</label>
              <input
                type="text"
                id="name"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Votre nom complet"
                required
                className="auth-input"
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Adresse email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="exemple@email.com"
                required
                className="auth-input"
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Mot de passe</label>
              <input
                type="password"
                id="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Mot de passe"
                required
                minLength={6}
                className="auth-input"
              />
            </div>
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirmer le mot de passe</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="Confirmez le mot de passe"
                required
                minLength={6}
                className="auth-input"
              />
            </div>
            {error && <div className="auth-error">{error}</div>}
            <button className="auth-button" type="submit" disabled={loading}>
              {loading ? <span className="auth-spinner" /> : "S'inscrire"}
            </button>
          </form>
          <div className="auth-footer auth-footer--center">
            <span>Déjà un compte ? </span>
            <Link to="/login" style={{ color: '#2563eb', textDecoration: 'none' }}>Se connecter</Link>
          </div>
        </div>
      </div>
    </div>
  );
}