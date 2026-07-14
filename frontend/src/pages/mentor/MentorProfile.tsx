import React from 'react';

const MentorProfile = () => {
  return (
     
     
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-xl font-bold mb-4">Mon Profil</h1>
 
      <div className="bg-white dark:bg-gray-800 rounded p-4 shadow space-y-4">
        <div>
          <label className="block font-medium">Nom</label>
          <input type="text" value="Tchalla M." className="input input-bordered w-full" disabled />
        </div>
        <div>
          <label className="block font-medium">Email</label>
          <input type="email" value="tchalla@orabank.com" className="input input-bordered w-full" disabled />
        </div>
        <div>
          <label className="block font-medium">Spécialité</label>
          <input type="text" value="Cybersécurité / IT Governance" className="input input-bordered w-full" />
        </div>
      </div>
    </div>
  );
};

export default MentorProfile;
