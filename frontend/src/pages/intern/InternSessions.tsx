import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Session {
  id: string;
  title: string;
  date: string;
  location: string;
  registered: boolean;
}

const InternSessions = () => {
  const [sessions, setSessions] = useState<Session[]>([]);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const res = await axios.get('/api/interns/sessions');
        setSessions(res.data);
      } catch (err) {
        console.error('Erreur lors du chargement des sessions', err);
      }
    };
    fetchSessions();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Sessions de formation</h2>
      <div className="grid gap-4">
        {sessions.map((session) => (
          <div key={session.id} className="border p-4 rounded shadow-sm">
            <h3 className="font-bold text-lg">{session.title}</h3>
            <p className="text-sm text-gray-600">{new Date(session.date).toLocaleDateString()} • {session.location}</p>
            <p className="mt-2 text-sm">
              Statut : {session.registered ? 'Inscrit' : 'Non inscrit'}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InternSessions;
