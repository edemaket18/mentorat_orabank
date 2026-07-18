 import React, { useEffect, useState } from 'react';
import { getCurrentUser, updateMyProfile } from '@api/auth.api';

const RHSettingsPage: React.FC = () => {
  const [language, setLanguage] = useState('fr');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    getCurrentUser().then((u) => {
      setLanguage(u.preferences?.language ?? 'fr');
      setNotificationsEnabled(u.preferences?.notificationsEnabled ?? true);
    }).catch(console.error);
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateMyProfile({ preferences: { language, notificationsEnabled } });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Paramètres RH</h2>

      <div className="mb-4">
        <label className="block font-semibold mb-2">Langue :</label>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="border rounded px-3 py-2 w-full"
        >
          <option value="fr">Français</option>
          <option value="en">Anglais</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="block font-semibold mb-2">Activer les notifications :</label>
        <input
          type="checkbox"
          checked={notificationsEnabled}
          onChange={() => setNotificationsEnabled(!notificationsEnabled)}
          className="mr-2"
        />
        {notificationsEnabled ? 'Activées' : 'Désactivées'}
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {saving ? 'Enregistrement...' : 'Enregistrer'}
      </button>
      {saved && <p className="text-green-600 mt-2">Paramètres sauvegardés avec succès.</p>}
    </div>
  );
};

export default RHSettingsPage;