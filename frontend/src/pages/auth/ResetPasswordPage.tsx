// src/pages/auth/ResetPasswordPage.tsx
import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { Input } from '@components/layout/Input';
import { Button } from '@components/common/Button';
import { Card, CardContent } from '@components/layout/Card';
import { toast } from 'sonner';
import { resetPassword } from '@api/auth.api';

 
const ResetPasswordPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token') || '';

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);

  // 🔁 Redirection si token invalide
  useEffect(() => {
    if (!token || token.length < 10) {
      toast.error("Lien de réinitialisation invalide ou expiré.");
      navigate('/forgot-password');
    }
  }, [token, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!password || !confirm) {
      toast.error('Veuillez remplir tous les champs');
      return;
    }

    if (password !== confirm) {
      toast.error('Les mots de passe ne correspondent pas');
      return;
    }

    setLoading(true);
    try {
      await resetPassword(token, password);
      toast.success('Mot de passe réinitialisé avec succès');
      navigate('/login');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erreur lors de la réinitialisation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 via-slate-50 to-white px-4 py-8">
      <div className="w-full max-w-lg">
        <Card className="shadow-xl border border-slate-200">
          <CardContent className="p-8">
            <div className="mb-6 text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-700">Orabank Mentorat</p>
              <h2 className="mt-3 text-3xl font-bold text-slate-900">Réinitialisez votre mot de passe</h2>
              <p className="mt-2 text-sm text-slate-600">Entrez un nouveau mot de passe et confirmez-le pour sécuriser votre compte.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
                  Nouveau mot de passe
                </label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Entrez votre nouveau mot de passe"
                  className="w-full"
                />
              </div>

              <div>
                <label htmlFor="confirm" className="block text-sm font-medium text-slate-700 mb-2">
                  Confirmer le mot de passe
                </label>
                <Input
                  id="confirm"
                  name="confirm"
                  type="password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="Confirmez le nouveau mot de passe"
                  className="w-full"
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading} isLoading={loading}>
                {loading ? 'Réinitialisation...' : 'Réinitialiser mon mot de passe'}
              </Button>
            </form>

            <div className="mt-6 flex flex-col gap-3 text-sm text-slate-600 text-center">
              <Link to="/login" className="text-sky-700 hover:underline">Retour à la connexion</Link>
              <Link to="/" className="text-slate-500 hover:text-slate-700 hover:underline">Retour à l’accueil</Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
