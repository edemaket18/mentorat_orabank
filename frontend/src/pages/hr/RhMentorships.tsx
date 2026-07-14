 import React, { useEffect, useState } from 'react';
import { getAllMentorships, endMentorship } from '@api/mentorship.api';
import { Mentorship } from '@api/mentorship.api';
import { Card, CardContent } from '@components/layout/Card';
import { Input } from '@components/layout/Input';
import { Select, SelectItem } from '@components/layout/Select';
import { Button } from '@components/common/Button';
import { Badge } from '@components/layout/Badge';
import { toast } from 'react-hot-toast';

export const RHMentorships: React.FC = () => {
  const [mentorships, setMentorships] = useState<Mentorship[]>([]);
  const [filtered, setFiltered] = useState<Mentorship[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('tous');

  useEffect(() => {
    const fetchMentorships = async () => {
      try {
        const res = await getAllMentorships();
        setMentorships(res);
        setFiltered(res);
      } catch (error) {
        console.error('Erreur lors du chargement :', error);
      } finally {
        setLoading(false);
      }
    };
    fetchMentorships();
  }, []);

  // Filtrage dynamique
  useEffect(() => {
    let list = mentorships;

    if (statusFilter !== 'tous') {
      list = list.filter((m) => m.status === statusFilter);
    }

    if (search.trim()) {
      const term = search.toLowerCase();
      list = list.filter(
        (m) =>
          m.intern?.fullName.toLowerCase().includes(term) ||
          m.mentor?.fullName.toLowerCase().includes(term)
      );
    }

    setFiltered(list);
  }, [search, statusFilter, mentorships]);

  const handleEndMentorship = async (id: string) => {
    try {
      await endMentorship(id);
      toast.success('Mentorat terminé.');
      setMentorships((prev) =>
        prev.map((m) =>
          m._id === id ? { ...m, status: 'terminé' } : m
        )
      );
    } catch (err) {
      toast.error("Erreur lors de la mise à jour.");
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Suivis de Mentorat</h1>

      {/* Recherche + filtre */}
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <Input
                  placeholder="Rechercher un stagiaire ou mentor..."
                  value={ search }
                  onChange={ (e) => setSearch(e.target.value) }
                  className="w-full md:w-1/2" name={ '' }        />
        <Select
          value={statusFilter}
          onValueChange={(val) => setStatusFilter(val)}
        >
          <SelectItem value="tous">Tous</SelectItem>
          <SelectItem value="en cours">En cours</SelectItem>
          <SelectItem value="terminé">Terminé</SelectItem>
          <SelectItem value="en attente">En attente</SelectItem>
        </Select>
      </div>

      {/* Liste */}
      {loading ? (
        <p>Chargement...</p>
      ) : filtered.length === 0 ? (
        <p>Aucun mentorat trouvé.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((m) => (
            <Card key={m._id}>
              <CardContent className="p-4 space-y-2">
                <p><strong>Stagiaire :</strong> {m.intern?.fullName}</p>
                <p><strong>Mentor :</strong> {m.mentor?.fullName}</p>
                <p><strong>Statut :</strong> {m.status}</p>
                <p><strong>Début :</strong> {new Date(m.startDate).toLocaleDateString()}</p>

                {m.status === 'en cours' && (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleEndMentorship(m._id)}
                  >
                    Terminer le mentorat
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default RHMentorships;
