import React from 'react';

const InternDashboard: React.FC = () => {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Tableau de bord Stagiaire</h2>
      <ul className="space-y-2">
        <li>📄 Mon profil et mon CV</li>
        <li>🤝 Matching avec un mentor</li>
        <li>📅 Planning de mentorat</li>
        <li>📝 Saisir mon rapport de stage</li>
        <li>📨 Messages & Feedbacks du mentor</li>
        <li>📊 Évolution et Statistiques personnelles</li>
      </ul>
    </div>
  );
};

export default InternDashboard;
