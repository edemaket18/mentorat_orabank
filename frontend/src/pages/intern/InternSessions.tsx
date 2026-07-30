import React, { useEffect, useState } from 'react';
import { getMySessions, InternSession } from '@api/intern.api';

const statusLabels: Record<string, string> = {
  scheduled: 'Planifiée',
  completed: 'Terminée',
  cancelled: 'Annulée',
};

const statusColors: Record<string, string> = {
  scheduled: 'text-green-600',
  completed: 'text-gray-500',
  cancelled: 'text-red-500',
};

const InternSessions = () => {
  const [sessions, setSessions] = useState<InternSession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMySessions().then(setSessions).catch(console.error).finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Mes sessions avec mon mentor</h2>
      {loading ? (
        <p className="text-gray-500">Chargement...</p>
      ) : sessions.length === 0 ? (
        <p className="text-gray-500">Aucune session planifiée pour le moment.</p>
      ) : (
        <div className="grid gap-4">
          {sessions.map((session) => (
            <div key={session._id} className="border p-4 rounded shadow-sm">
              <h3 className="font-bold text-lg">{session.mentor?.name ?? 'Mentor'}</h3>
              <p className="text-sm text-gray-600">
                {new Date(session.scheduledAt).toLocaleString()} • {session.durationMinutes} min
              </p>
              {session.notes && <p className="mt-1 text-sm text-gray-600">{session.notes}</p>}
              <p className={`mt-2 text-sm font-medium ${statusColors[session.status]}`}>
                {statusLabels[session.status]}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InternSessions;