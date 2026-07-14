import React from 'react';

const RhDashboard: React.FC = () => {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Espace Ressources Humaines</h2>
      <ul className="space-y-2">
        <li>📌 Suivi des stagiaires et affectations</li>
        <li>📅 Calendrier des stages</li>
        <li>📊 Rapports d'intégration</li>
        <li>🧾 Exportation des données RH</li>
        <li>📬 Notifications & messages</li>
      </ul>
    </div>
  );
};

export default RhDashboard;
