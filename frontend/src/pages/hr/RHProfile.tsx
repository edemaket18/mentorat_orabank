import React, { useEffect, useState } from 'react';
import { getCurrentUser } from '@api/auth.api';
import { AuthUser } from '@api/auth.api';

const RHProfile = () => {
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    getCurrentUser().then(setUser).catch(console.error);
  }, []);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Mon Profil RH</h2>
      {user && (
        <div className="space-y-3">
          <p><strong>Nom :</strong> {user.name}</p>
          <p><strong>Email :</strong> {user.email}</p>
          <p><strong>Rôle :</strong> {user.role}</p>
        </div>
      )}
    </div>
  );
};

export default RHProfile;
