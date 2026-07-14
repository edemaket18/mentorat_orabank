import React, { useEffect, useState } from 'react';
import { getAllMentorships, deleteMentorshipById } from '@api/mentorship.api';
import { Mentorship } from '@api/mentorship.api';
import Button from '@components/common/Button';
 import  { Card }   from '@components/layout/Card';
 import { CardContent } from '@components/layout/Card';

const AdminMentorships: React.FC = () => {
  const [mentorships, setMentorships] = useState<Mentorship[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMentorships();
  }, []);

  const fetchMentorships = async () => {
    try {
      const response = await getAllMentorships();
      setMentorships(response);
    } catch (error) {
      console.error('Erreur lors de la récupération des accompagnements', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Confirmer la suppression de cet accompagnement ?')) return;
    try {
      await deleteMentorshipById(id);
        setMentorships((prev) => prev.filter((m) => String(m._id) !== id));
      alert('Accompagnement supprimé avec succès');
      fetchMentorships();  

    } catch (error) {
      console.error('Erreur lors de la suppression', error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Gestion des Accompagnements</h1>

      {loading ? (
        <p>Chargement en cours...</p>
      ) : mentorships.length === 0 ? (
        <p>Aucun accompagnement trouvé.</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {mentorships.map((mentorship) => (
            <Card key={mentorship._id}>
              <CardContent className="space-y-2">
                <p>
                  <strong>Mentor :</strong> {mentorship.mentor.name}
                </p>
                <p>
                  <strong>Stagiaire :</strong> {mentorship.intern.name}
                </p>
                <p>
                  <strong>Date de début :</strong>{' '}
                  {new Date(mentorship.startDate).toLocaleDateString()}
                </p>
                <p>
                  <strong>État :</strong> {mentorship.status}
                </p>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleDelete(String(mentorship._id))}
                >
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

export default AdminMentorships;
