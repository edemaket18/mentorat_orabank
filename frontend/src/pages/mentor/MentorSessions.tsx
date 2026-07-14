import React from 'react';

const MentorSessions = () => {
  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Mes Sessions de Mentorat</h1>

      <table className="w-full text-left border-collapse">
        <thead>
          <tr>
            <th className="p-2 border-b">Stagiaire</th>
            <th className="p-2 border-b">Date</th>
            <th className="p-2 border-b">Statut</th>
          </tr>
        </thead>
        <tbody>
          <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
            <td className="p-2">Akanbi Sarah</td>
            <td className="p-2">25 Juillet 2025</td>
            <td className="p-2 text-green-600">Planifiée</td>
          </tr>
          <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
            <td className="p-2">Assimi Kodjo</td>
            <td className="p-2">10 Juillet 2025</td>
            <td className="p-2 text-gray-500">Terminée</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default MentorSessions;
