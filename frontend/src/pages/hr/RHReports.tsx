import React, { useEffect, useState } from 'react';
import { getAllReports } from '@api/report.api';
import { Report } from '@api/report.api';

const RHReports = () => {
  const [reports, setReports] = useState<Report[]>([]);

  useEffect(() => {
    getAllReports().then(setReports).catch(console.error);
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Rapports de Stage</h2>
      <table className="w-full text-left">
        <thead>
          <tr className="border-b">
            <th>Stagiaire</th>
            <th>Mentor</th>
            <th>Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {reports.map((r) => (
            <tr key={r._id} className="border-b">
              <td>{r.intern.name}</td>
              <td>{r.mentor.name}</td>
              <td>{new Date(r.createdAt).toLocaleDateString()}</td>
              <td>{r.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RHReports;
