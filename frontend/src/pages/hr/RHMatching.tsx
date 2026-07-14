import React, { useEffect, useState } from 'react';
import { getAllMatchings } from '@api/matching.api';
import { Matching } from '@api/matching.api';
import { Card, CardContent } from '@components/layout/Card';


interface Props {
  
  matchings: Matching[];

}

const RHMatching = () => {
  const [matchings, setMatchings] = useState<Matching[]>([]);

  useEffect(() => {
  getAllMatchings()
    .then((res) => setMatchings(res.data))
    .catch(console.error);
}, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Matchings Actuels</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {matchings.map((match) => (
          <Card key={match._id}>
            <CardContent>
              <p><strong>Mentor :</strong> {match.mentor.name}</p>
              <p><strong>Stagiaire :</strong> {match.intern.name}</p>
              <p><strong>Status :</strong> {match.status}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default RHMatching;
