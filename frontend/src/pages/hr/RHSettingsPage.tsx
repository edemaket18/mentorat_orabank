 import React, { useState } from 'react';

const RHSettingsPage: React.FC = () => {
  const [language, setLanguage] = useState('fr');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const handleSave = () => {
    console.log('Paramètres enregistrés', { language, notificationsEnabled });
    alert('Paramètres sauvegardés avec succès.');
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
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Enregistrer
      </button>
    </div>
  );
};

export default RHSettingsPage;
