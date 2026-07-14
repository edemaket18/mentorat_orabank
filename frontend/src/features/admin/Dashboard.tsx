import React from 'react';

const AdminDashboard: React.FC = () => {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Tableau de bord Administrateur</h2>
      <ul className="space-y-2">
        <li>📊 Statistiques globales de la plateforme</li>
        <li>👥 Gestion des utilisateurs (mentors, stagiaires, RH)</li>
        <li>🔒 Gestion des rôles et des autorisations</li>
        <li>📁 Exportation des rapports</li>
        <li>⚙️ Paramètres globaux</li>
      </ul>
    </div>
  );
};

export default AdminDashboard;
