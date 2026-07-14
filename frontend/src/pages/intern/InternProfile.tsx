 import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@components/layout/Card';
import { Input } from '@components/layout/Input';
import { Button } from '@components/common/Button';
import { toast } from 'sonner';

type Profile = {
  fullName: string;
  email: string;
  department: string;
  university: string;
  phone: string;
  

};

 

const defaultProfile: Profile = {
  fullName: 'Edem Aket',
  email: 'edem.aket@example.com',
  department: 'Informatique',
  university: 'Université de Lomé',
  phone: '+228 90 00 00 00',
};

const InternProfile: React.FC = () => {
  const [profile, setProfile] = useState<Profile>(defaultProfile);
  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    setIsEditing(false);
    toast.success('Profil mis à jour avec succès.');
    // ici : requête API si backend connecté
  };

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Mon Profil</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <Input
              name="fullName"
              placeholder="Nom complet"
              value={profile.fullName}
              onChange={handleChange}
              disabled={!isEditing}
            />
            <Input
              name="email"
              placeholder="Email"
              value={profile.email}
              onChange={handleChange}
              disabled
            />
            <Input
              name="department"
              placeholder="Département"
              value={profile.department}
              onChange={handleChange}
              disabled={!isEditing}
            />
            <Input
              name="university"
              placeholder="Université"
              value={profile.university}
              onChange={handleChange}
              disabled={!isEditing}
            />
            <Input
              name="phone"
              placeholder="Téléphone"
              value={profile.phone}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            {!isEditing ? (
              <Button onClick={() => setIsEditing(true)}>Modifier</Button>
            ) : (
              <>
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  Annuler
                </Button>
                <Button onClick={handleSave}>Enregistrer</Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InternProfile;

