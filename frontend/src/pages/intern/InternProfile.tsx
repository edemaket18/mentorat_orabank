 import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@components/layout/Card';
import { Input } from '@components/layout/Input';
import { Button } from '@components/common/Button';
import { toast } from 'sonner';
import { getCurrentUser, updateMyProfile } from '@api/auth.api';

type ProfileForm = {
  fullName: string;
  email: string;
  department: string;
  university: string;
  phone: string;
};

const emptyProfile: ProfileForm = {
  fullName: '',
  email: '',
  department: '',
  university: '',
  phone: '',
};

const InternProfile: React.FC = () => {
  const [profile, setProfile] = useState<ProfileForm>(emptyProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getCurrentUser()
      .then((u) => {
        setProfile({
          fullName: u.name,
          email: u.email,
          department: u.department ?? '',
          university: u.university ?? '',
          phone: u.phone ?? '',
        });
      })
      .catch(console.error);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const [firstName, ...rest] = profile.fullName.trim().split(' ');
      const updated = await updateMyProfile({
        firstName,
        lastName: rest.join(' '),
        department: profile.department,
        university: profile.university,
        phone: profile.phone,
      });
      setProfile({
        fullName: updated.name,
        email: updated.email,
        department: updated.department ?? '',
        university: updated.university ?? '',
        phone: updated.phone ?? '',
      });
      setIsEditing(false);
      toast.success('Profil mis à jour avec succès.');
    } catch (error) {
      toast.error('Erreur lors de la mise à jour du profil.');
    } finally {
      setSaving(false);
    }
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
                <Button onClick={handleSave} disabled={saving}>
                  {saving ? 'Enregistrement...' : 'Enregistrer'}
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InternProfile;