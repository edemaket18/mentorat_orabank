// src/pages/auth/ForgotPasswordPage.tsx
import React, { useState } from 'react';
import { toast } from 'sonner';
import { sendPasswordResetEmail } from '@api/auth.api';
import { Link } from 'react-router-dom';

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetLink, setResetLink] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error('Veuillez saisir votre adresse email');
      return;
    }

    setLoading(true);
    setResetLink(null);
    try {
      const response = await sendPasswordResetEmail(email.trim());
      toast.success(response?.message || 'Email de réinitialisation envoyé ! Vérifiez votre boîte de réception.');
      if (response?.resetLink) setResetLink(response.resetLink);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Une erreur est survenue.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-shell" style={{ background: 'linear-gradient(135deg, #f0f4ff 0%, #e2e8f0 100%)' }}>
      <div className="auth-card">
        <div className="auth-card__header">
          <div className="mobile-pill" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.55rem', padding: '0.75rem 1rem', borderRadius: '999px', backgroundColor: '#eef2ff', color: '#4338ca', fontWeight: 700, fontSize: '0.85rem' }}>
            <span>🏦</span>
            Orabank Mentorat
          </div>
          <h1 className="auth-card__header-title">Mot de passe oublié</h1>
          <p className="auth-card__header-text">
            Saisissez votre adresse email pour recevoir un lien sécurisé de réinitialisation.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Adresse email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="exemple@orabank.tg"
              autoComplete="email"
              className="auth-input"
              style={{ padding: '1rem 1.1rem' }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="auth-button"
            style={{ padding: '1rem 1.2rem', opacity: loading ? 0.7 : 1 }}
          >
            {loading ? 'Envoi en cours...' : 'Envoyer le lien de réinitialisation'}
          </button>

          {resetLink && (
            <div className="dashboard-card" style={{ marginTop: '0.6rem', border: '1px dashed #cbd5e1', display: 'flex', gap: '0.6rem', alignItems: 'center', justifyContent: 'space-between' }}>
              <a href={resetLink} target="_blank" rel="noreferrer" style={{ color: '#0f172a', textDecoration: 'underline', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '78%' }}>{resetLink}</a>
              <button type="button" onClick={() => { navigator.clipboard?.writeText(resetLink); toast.success('Lien copié dans le presse-papier'); }} style={{ background: '#e2e8f0', border: 'none', padding: '0.5rem 0.75rem', borderRadius: '10px', cursor: 'pointer' }}>Copier</button>
            </div>
          )}

          <div className="auth-footer auth-footer--center" style={{ marginTop: '0.75rem' }}>
            <Link to="/login" style={{ color: '#2563eb', textDecoration: 'none' }}>
              Retour à la connexion
            </Link>
            <Link to="/" style={{ color: '#64748b', textDecoration: 'none' }}>
              Retour à l’accueil
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
