import React, { useState } from 'react';

interface Settings {
  notificationEmail: string;
  enableNotifications: boolean;
  theme: 'light' | 'dark';
}

const defaultSettings: Settings = {
  notificationEmail: '',
  enableNotifications: true,
  theme: 'light',
};

const SettingsForm: React.FC = () => {
  const [settings, setSettings] = useState<Settings>(defaultSettings);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: type === 'checkbox'
        ? (e.target as HTMLInputElement).checked
        : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Ici, vous pouvez envoyer les paramètres au backend ou les sauvegarder
    alert('Paramètres enregistrés !');
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Paramètres</h2>
      <div>
        <label>
          Email de notification :
          <input
            type="email"
            name="notificationEmail"
            value={settings.notificationEmail}
            onChange={handleChange}
            required
          />
        </label>
      </div>
      <div>
        <label>
          Activer les notifications :
          <input
            type="checkbox"
            name="enableNotifications"
            checked={settings.enableNotifications}
            onChange={handleChange}
          />
        </label>
      </div>
      <div>
        <label>
          Thème :
          <select name="theme" value={settings.theme} onChange={handleChange}>
            <option value="light">Clair</option>
            <option value="dark">Sombre</option>
          </select>
        </label>
      </div>
      <button type="submit">Enregistrer</button>
    </form>
  );
};

export default SettingsForm;
