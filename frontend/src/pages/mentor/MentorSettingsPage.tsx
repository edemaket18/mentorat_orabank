 import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@components/layout/Card';
import { getCurrentUser, updateMyProfile } from '@api/auth.api';

const MentorSettingsPage: React.FC = () => {
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
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Paramètres</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
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
          <div>
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
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:opacity-50"
          >
            {saving ? 'Enregistrement...' : 'Enregistrer'}
          </button>
          {saved && <p className="text-green-600 mt-2">Paramètres sauvegardés.</p>}
        </CardContent>
      </Card>
    </div>
  );
};

export default MentorSettingsPage;