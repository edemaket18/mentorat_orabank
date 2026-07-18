import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@components/layout/Card';
import { getMyDepartures, MentorMentorshipSummary } from '@api/mentor.api';

const MentorDepartures: React.FC = () => {
  const [departures, setDepartures] = useState<MentorMentorshipSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyDepartures().then(setDepartures).catch(console.error).finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Départs</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {loading ? (
            <p className="text-gray-500">Chargement...</p>
          ) : departures.length === 0 ? (
            <p className="text-center text-gray-500">Aucun stagiaire n'a encore terminé son accompagnement.</p>
          ) : (
            departures.map((d) => (
              <div key={d._id} className="border rounded-md p-4">
                <p className="font-semibold">{d.intern?.name ?? 'Stagiaire'}</p>
                <p className="text-sm text-gray-500">{d.intern?.email}</p>
                <p className="text-sm text-gray-500">
                  {d.status === 'completed' ? 'Terminé' : 'Annulé'} le{' '}
                  {d.endedAt ? new Date(d.endedAt).toLocaleDateString() : '-'}
                </p>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MentorDepartures;