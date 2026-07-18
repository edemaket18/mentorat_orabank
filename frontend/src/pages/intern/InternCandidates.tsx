 import React, { useEffect, useState } from 'react';
import httpClient from '@api/httpClient';

interface Candidate {
  id: string;
  name: string;
  email: string;
  university: string;
  appliedAt: string;
}

const InternCandidates = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const res = await httpClient.get('/interns/candidates');
        setCandidates(res.data);
      } catch (error) {
        console.error('Erreur lors du chargement des candidats', error);
      }
    };
    fetchCandidates();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Autres candidats</h2>
      <ul className="space-y-3">
        {candidates.map((c) => (
          <li key={c.id} className="border p-4 rounded shadow-sm">
            <p className="font-semibold">{c.name}</p>
            <p className="text-sm text-gray-600">{c.email}</p>
            <p className="text-sm">{c.university}</p>
            <p className="text-xs text-gray-400">Postulé le : {new Date(c.appliedAt).toLocaleDateString()}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default InternCandidates;