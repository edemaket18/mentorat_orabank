 import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@components/layout/Card';
import { getMyMentorships, endMentorship, MentorMentorshipSummary } from '@api/mentor.api';

const statusLabels: Record<string, string> = {
  active: 'Actif',
  completed: 'Terminé',
  cancelled: 'Annulé',
  pending: 'En attente',
};

const MentorMentorships: React.FC = () => {
  const [mentorships, setMentorships] = useState<MentorMentorshipSummary[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    getMyMentorships().then(setMentorships).catch(console.error).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleEnd = async (id: string) => {
    try {
      await endMentorship(id);
      load();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Mes mentorats</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {loading ? (
            <p className="text-gray-500">Chargement...</p>
          ) : mentorships.length === 0 ? (
            <p className="text-center text-gray-500">Aucun mentorat pour le moment.</p>
          ) : (
            mentorships.map((m) => (
              <div key={m._id} className="border rounded-md p-4 flex justify-between items-center">
                <div>
                  <p className="font-semibold">{m.intern?.name ?? 'Stagiaire'}</p>
                  <p className="text-sm text-gray-500">{m.intern?.email}</p>
                  <p className="text-sm text-gray-500">
                    Statut : {statusLabels[m.status] ?? m.status} — depuis le {new Date(m.startedAt).toLocaleDateString()}
                  </p>
                </div>
                {m.status === 'active' && (
                  <button
                    onClick={() => handleEnd(m._id)}
                    className="text-sm border rounded px-3 py-1 hover:bg-gray-50"
                  >
                    Clore
                  </button>
                )}
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MentorMentorships;