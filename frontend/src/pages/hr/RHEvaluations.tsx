import React, { useEffect, useState } from 'react';
import { getStagiairesForEvaluation, submitEvaluation } from '@api/rh.api';
import { User } from '@api/rh.api';
import { Button } from '@components/common/Button';
import { Card, CardContent } from '@components/layout/Card';

const RHEvaluations: React.FC = () => {
  const [stagiaires, setStagiaires] = useState<User[]>([]);
  const [notes, setNotes] = useState<Record<string, number>>({});

  useEffect(() => {
    fetchStagiaires();
  }, []);

  const fetchStagiaires = async () => {
    const data = await getStagiairesForEvaluation();
    setStagiaires(data);
  };

  const handleChange = (id: string, value: string) => {
    setNotes((prev) => ({ ...prev, [id]: parseFloat(value) }));
  };

  const handleSubmit = async (id: string) => {
    await submitEvaluation(id, notes[id] ?? 0);
    alert('Évaluation envoyée.');
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Évaluations des stagiaires</h2>
      <div className="grid md:grid-cols-2 gap-4">
        {stagiaires.map((stagiaire) => (
          <Card key={stagiaire._id}>
            <CardContent className="space-y-2">
              <p><strong>Nom :</strong> {stagiaire.name}</p>
              <p><strong>Poste :</strong> {stagiaire.position}</p>
              <input
                type="number"
                min="0"
                max="20"
                placeholder="Note sur 20"
                className="border rounded px-2 py-1"
                onChange={(e) => handleChange(stagiaire._id, e.target.value)}
              />
              <Button onClick={() => handleSubmit(stagiaire._id)}>Valider</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default RHEvaluations;
