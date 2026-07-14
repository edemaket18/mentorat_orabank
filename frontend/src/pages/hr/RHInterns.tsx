import React, { useEffect, useState } from 'react';
import { getAllInterns, deleteInternById } from '@api/rh.api';
import { User } from '@api/rh.api';
import { Button } from '@components/common/Button';
import { Card, CardContent } from '@components/layout/Card';

const RHInterns: React.FC = () => {
  const [interns, setInterns] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInterns();
  }, []);

  const fetchInterns = async () => {
    try {
      const data = await getAllInterns();
      setInterns(data);
    } catch (error) {
      console.error('Erreur de chargement des stagiaires', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Confirmer la suppression de ce stagiaire ?')) return;
    try {
      await deleteInternById(id);
      setInterns((prev) => prev.filter((intern) => intern._id !== id));
    } catch (error) {
      console.error('Erreur lors de la suppression', error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Gestion des Stagiaires</h1>

      {loading ? (
        <p>Chargement…</p>
      ) : interns.length === 0 ? (
        <p>Aucun stagiaire trouvé.</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {interns.map((intern) => (
            <Card key={intern._id}>
              <CardContent className="space-y-2">
                <p><strong>Nom :</strong> {intern.name}</p>
                <p><strong>Email :</strong> {intern.email}</p>
                <p><strong>Téléphone :</strong> {intern.phone ?? 'N/A'}</p>
                <p><strong>Département :</strong> {intern.department ?? 'Non assigné'}</p>
                <Button variant="primary" size="sm" onClick={() => handleDelete(intern._id)}>
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

export default RHInterns;
