import React, { useEffect, useState } from 'react';
import { getReports, Report } from '@api/report.api';

const statusLabels: Record<string, string> = {
  draft: 'Brouillon',
  submitted: 'Soumis',
  validated: 'Validé',
  rejected: 'Rejeté',
};

const RHReports = () => {
  const [reports, setReports] = useState<Report[]>([]);

  useEffect(() => {
    getReports().then(setReports).catch(console.error);
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Rapports de Stage</h2>
      <div className="overflow-x-auto"><table className="w-full text-left min-w-[560px]">
        <thead>
          <tr className="border-b">
            <th>Stagiaire</th>
            <th>Titre</th>
            <th>Date</th>
            <th>Statut</th>
          </tr>
        </thead>
        <tbody>
          {reports.map((r) => (
            <tr key={r._id} className="border-b">
              <td>{r.mentee ? `${r.mentee.firstName ?? ''} ${r.mentee.lastName ?? ''}`.trim() : '-'}</td>
              <td>{r.title}</td>
              <td>{new Date(r.createdAt).toLocaleDateString()}</td>
              <td>{statusLabels[r.status] ?? r.status}</td>
            </tr>
          ))}
          {reports.length === 0 && (
            <tr><td colSpan={4} className="text-center text-gray-500 py-4">Aucun rapport pour le moment.</td></tr>
          )}
        </tbody>
      </table></div>
    </div>
  );
};

export default RHReports;