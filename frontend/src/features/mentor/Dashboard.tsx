import React from 'react';

const MentorDashboard: React.FC = () => {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Espace Mentor</h2>
      <ul className="space-y-2">
        <li>👨‍🎓 Liste des stagiaires assignés</li>
        <li>📝 Feedbacks et suivi</li>
        <li>📆 Planification de séances de mentorat</li>
        <li>📨 Messages reçus</li>
        <li>📄 Rapports en cours</li>
      </ul>
    </div>
  );
};

export default MentorDashboard;
