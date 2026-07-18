 import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@components/layout/Card';
import { getAvailableCandidates, MentorCandidate } from '@api/mentor.api';

const MentorCandidates: React.FC = () => {
  const [candidates, setCandidates] = useState<MentorCandidate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAvailableCandidates().then(setCandidates).catch(console.error).finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Stagiaires disponibles</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {loading ? (
            <p className="text-gray-500">Chargement...</p>
          ) : candidates.length === 0 ? (
            <p className="text-center text-gray-500">Aucun stagiaire disponible pour le moment.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {candidates.map((c) => (
                <div key={c._id} className="border rounded-md p-4">
                  <p className="font-semibold">{c.name}</p>
                  <p className="text-sm text-gray-500">{c.email}</p>
                  {(c.department || c.university) && (
                    <p className="text-sm text-gray-500">
                      {[c.department, c.university].filter(Boolean).join(' — ')}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MentorCandidates;