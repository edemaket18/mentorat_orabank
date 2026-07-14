import React, { useEffect, useState } from 'react';
import { getAllMentors, removeMentorById } from '@api/rh.api';
import { User } from '@api/rh.api';
import { Button } from '@components/common/Button';
import { Card, CardContent } from '@components/layout/Card';

const RHMentors: React.FC = () => {
  const [mentors, setMentors] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMentors();
  }, []);

  const fetchMentors = async () => {
    try {
      const data = await getAllMentors();
      setMentors(data);
    } catch (error) {
      console.error('Erreur lors du chargement des mentors', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (id: string) => {
    if (!window.confirm('Confirmer la suppression de ce mentor ?')) return;
    try {
      await removeMentorById(id);
      setMentors((prev) => prev.filter((m) => m._id !== id));
    } catch (error) {
      console.error('Erreur lors de la suppression du mentor', error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Gestion des Mentors</h1>

      {loading ? (
        <p>Chargement…</p>
      ) : mentors.length === 0 ? (
        <p>Aucun mentor enregistré.</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {mentors.map((mentor) => (
            <Card key={mentor._id}>
              <CardContent className="space-y-2">
                <p><strong>Nom :</strong> {mentor.name}</p>
                <p><strong>Email :</strong> {mentor.email}</p>
                <p><strong>Spécialité :</strong> {mentor.specialty ?? 'Non précisée'}</p>
                <p><strong>Département :</strong> {mentor.department ?? 'Non assigné'}</p>
                <Button variant="primary" size="sm" onClick={() => handleRemove(mentor._id)}>
                  Supprimer
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default RHMentors;
