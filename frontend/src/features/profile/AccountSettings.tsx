import React, { useEffect, useState } from 'react';
import { changePassword, getCurrentUser, updateMyProfile } from '@api/auth.api';
import { Button } from '@components/common/Button';
import { Card, CardContent } from '@components/layout/Card';

interface AccountSettingsProps { title: string; }

const AccountSettings: React.FC<AccountSettingsProps> = ({ title }) => {
  const [email, setEmail] = useState('');
  const [language, setLanguage] = useState('fr');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    getCurrentUser().then((user) => {
      setEmail(user.email);
      setLanguage(user.preferences?.language ?? 'fr');
      setNotificationsEnabled(user.preferences?.notificationsEnabled ?? true);
    }).catch(() => setMessage({ type: 'error', text: 'Impossible de charger vos paramètres.' }));
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setMessage(null);
    if ((currentPassword || newPassword) && (!currentPassword || newPassword.length < 6)) {
      setMessage({ type: 'error', text: 'Saisissez le mot de passe actuel et un nouveau mot de passe d’au moins 6 caractères.' });
      return;
    }

    setSaving(true);
    try {
      await updateMyProfile({ email, preferences: { language, notificationsEnabled } });
      if (currentPassword && newPassword) {
        await changePassword(currentPassword, newPassword);
        setCurrentPassword('');
        setNewPassword('');
      }
      setMessage({ type: 'success', text: 'Vos paramètres ont été enregistrés.' });
    } catch (error: any) {
      setMessage({ type: 'error', text: error?.response?.data?.message || 'Enregistrement impossible. Réessayez.' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="dashboard-shell dashboard-page settings-page">
      <div className="dashboard-heading"><div><p className="dashboard-eyebrow">Compte personnel</p><h1 className="text-2xl font-bold">{title}</h1><p className="dashboard-subtitle">Gérez vos préférences et protégez votre accès.</p></div></div>
      <form onSubmit={handleSubmit} className="settings-page__form">
        <Card className="dashboard-card"><CardContent className="p-6 space-y-4">
          <h2 className="text-lg font-semibold">Préférences</h2>
          <label className="settings-page__field">Adresse e-mail<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required /></label>
          <label className="settings-page__field">Langue<select value={language} onChange={(event) => setLanguage(event.target.value)}><option value="fr">Français</option><option value="en">English</option></select></label>
          <label className="settings-page__check"><input type="checkbox" checked={notificationsEnabled} onChange={(event) => setNotificationsEnabled(event.target.checked)} /> Recevoir les notifications de la plateforme</label>
        </CardContent></Card>
        <Card className="dashboard-card"><CardContent className="p-6 space-y-4">
          <h2 className="text-lg font-semibold">Sécurité</h2>
          <p className="dashboard-subtitle">Laissez ces champs vides si vous ne souhaitez pas changer votre mot de passe.</p>
          <label className="settings-page__field">Mot de passe actuel<input type="password" value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} autoComplete="current-password" /></label>
          <label className="settings-page__field">Nouveau mot de passe<input type="password" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} minLength={6} autoComplete="new-password" /></label>
        </CardContent></Card>
        {message && <div className={`dashboard-state${message.type === 'error' ? ' dashboard-state--error' : ''}`} role="status">{message.text}</div>}
        <Button type="submit" disabled={saving}>{saving ? 'Enregistrement...' : 'Enregistrer les paramètres'}</Button>
      </form>
    </section>
  );
};

export default AccountSettings;
