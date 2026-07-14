import React, { useState } from 'react';

const InternSettingsPage = () => {
  const [email, setEmail] = useState('edem@example.com');
  const [password, setPassword] = useState('');
  const [success, setSuccess] = useState(false);

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Envoyer une requête à l'API pour mettre à jour les infos
    console.log('Email:', email, 'Password:', password);
    setSuccess(true);
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Paramètres du compte</h2>
      <form onSubmit={handleUpdate} className="space-y-4 max-w-md">
        <div>
          <label className="block text-sm font-medium">Adresse e-mail</label>
          <input
            type="email"
            className="w-full border rounded p-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Nouveau mot de passe</label>
          <input
            type="password"
            className="w-full border rounded p-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Enregistrer
        </button>
        {success && <p className="text-green-600 mt-2">Paramètres mis à jour avec succès.</p>}
      </form>
    </div>
  );
};

export default InternSettingsPage;
