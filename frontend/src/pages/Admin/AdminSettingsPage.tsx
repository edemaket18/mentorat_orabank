 // src/pages/admin/SettingsPage.tsx
import React, { useEffect, useState } from 'react';
import { Input } from '@components/layout/Input';
import { Button } from '@components/common/Button';
import { Card, CardContent } from '@components/layout/Card';
import { toast } from 'sonner';
import { getSettings, updateSettings } from '@api/admin.api';

interface Settings {
  platformName: string;
  contactEmail: string;
  maintenanceMode: boolean;
}

const SettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<Settings>({
    platformName: '',
    contactEmail: '',
    maintenanceMode: false,
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await getSettings();
      setSettings(res.data);
    } catch (err) {
      toast.error('Erreur lors du chargement des paramètres');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await updateSettings(settings);
      toast.success('Paramètres mis à jour');
    } catch (err) {
      toast.error("Échec de l'enregistrement");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Paramètres de la plateforme</h1>

      <Card>
        <CardContent className="space-y-4 p-6">
          <div>
            <label className="block text-sm font-medium">Nom de la plateforme</label>
            <Input
              name="platformName"
              value={settings.platformName}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Email de contact</label>
            <Input
              name="contactEmail"
              type="email"
              value={settings.contactEmail}
              onChange={handleChange}
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="maintenanceMode"
              checked={settings.maintenanceMode}
              onChange={handleChange}
              className="form-checkbox h-4 w-4 text-blue-600"
            />
            <span>Mode maintenance activé</span>
          </div>

          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? 'Enregistrement...' : 'Sauvegarder'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsPage;

