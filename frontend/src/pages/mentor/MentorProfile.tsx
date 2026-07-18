 import React, { useEffect, useState } from 'react';
import { getCurrentUser, updateMyProfile, AuthUser } from '@api/auth.api';
import { toast } from 'react-hot-toast';

const MentorProfile: React.FC = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [specialty, setSpecialty] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getCurrentUser()
      .then((u) => {
        setUser(u);
        setSpecialty(u.bio ?? '');
      })
      .catch(console.error);
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const updated = await updateMyProfile({ bio: specialty });
      setUser(updated);
      setIsEditing(false);
      toast.success('Profil mis à jour.');
    } catch (error) {
      toast.error('Erreur lors de la mise à jour du profil.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-xl font-bold mb-4">Mon Profil</h1>

      <div className="bg-white dark:bg-gray-800 rounded p-4 shadow space-y-4">
        <div>
          <label className="block font-medium">Nom</label>
          <input type="text" value={user?.name ?? ''} className="input input-bordered w-full" disabled />
        </div>
        <div>
          <label className="block font-medium">Email</label>
          <input type="email" value={user?.email ?? ''} className="input input-bordered w-full" disabled />
        </div>
        <div>
          <label className="block font-medium">Spécialité</label>
          <input
            type="text"
            value={specialty}
            onChange={(e) => setSpecialty(e.target.value)}
            className="input input-bordered w-full"
            disabled={!isEditing}
          />
        </div>
        <div className="flex justify-end gap-2 pt-2">
          {!isEditing ? (
            <button className="bg-blue-500 text-white px-4 py-2 rounded-md" onClick={() => setIsEditing(true)}>
              Modifier
            </button>
          ) : (
            <>
              <button className="px-4 py-2 rounded-md border" onClick={() => setIsEditing(false)}>
                Annuler
              </button>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-md disabled:opacity-50"
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? 'Enregistrement...' : 'Enregistrer'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MentorProfile;