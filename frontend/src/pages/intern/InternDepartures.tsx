 import React, { useState, useEffect } from 'react';
import httpClient from '@api/httpClient';

interface Departure {
  id: string;
  endDate: string;
  feedbackSubmitted: boolean;
  certificateReady: boolean;
}

const InternDepartures = () => {
  const [departures, setDepartures] = useState<Departure[]>([]);

  useEffect(() => {
    const fetchDepartures = async () => {
      try {
        const res = await httpClient.get('/interns/departures');
        setDepartures(res.data);
      } catch (err) {
        console.error('Erreur chargement départs', err);
      }
    };
    fetchDepartures();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Mes départs de stage</h2>
      <div className="overflow-x-auto"><table className="w-full border-collapse min-w-[560px]">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-2">Date de fin</th>
            <th className="p-2">Feedback envoyé</th>
            <th className="p-2">Attestation</th>
          </tr>
        </thead>
        <tbody>
          {departures.map((dep) => (
            <tr key={dep.id} className="border-t">
              <td className="p-2">{new Date(dep.endDate).toLocaleDateString()}</td>
              <td className="p-2">{dep.feedbackSubmitted ? 'Oui' : 'Non'}</td>
              <td className="p-2">{dep.certificateReady ? 'Disponible' : 'En attente'}</td>
            </tr>
          ))}
        </tbody>
      </table></div>
    </div>
  );
};

export default InternDepartures;