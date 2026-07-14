import React, { useEffect, useState } from 'react';
import { getDepartingStagiaires, archiveStagiaire } from '@api/rh.api';
import { User } from '@api/rh.api';
import { Button } from '@components/common/Button';
import { Card, CardContent } from '@components/layout/Card';

const RHDepartures: React.FC = () => {
  const [stagiaires, setStagiaires] = useState<User[]>([]);

  useEffect(() => {
    fetchDepartures();
  }, []);

  const fetchDepartures = async () => {
    const data = await getDepartingStagiaires();
    setStagiaires(data);
  };

  const handleArchive = async (id: string) => {
    await archiveStagiaire(id);
    fetchDepartures();
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Fin de stage</h2>
      <div className="grid md:grid-cols-2 gap-4">
        {stagiaires.map((s) => (
          <Card key={s._id}>
            <CardContent className="space-y-2">
              <p><strong>Nom :</strong> {s.name}</p>
              <p><strong>Email :</strong> {s.email}</p>
              <p><strong>Date fin :</strong> {new Date(s.endDate).toLocaleDateString()}</p>
              <Button variant="secondary" onClick={() => handleArchive(s._id)}>
                Archiver
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default RHDepartures;
