 import React, { useEffect, useState } from 'react';
import MentorCard from '@features/cards/MentorCard';
import { toast } from 'react-hot-toast';
import { Card, CardHeader, CardTitle, CardContent } from '@components/layout/Card';
import { getMentorsForMatching, requestMentor, MatchingMentor } from '@api/intern.api';

const InternMatching: React.FC = () => {
  const [mentors, setMentors] = useState<MatchingMentor[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    getMentorsForMatching().then(setMentors).catch(console.error).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleRequest = async (mentorId: string) => {
    try {
      await requestMentor(mentorId);
      toast.success('Demande de mentorat envoyée avec succès !');
      load();
    } catch (error: any) {
      toast.error(error?.response?.data?.message ?? "Erreur lors de l'envoi de la demande.");
    }
  };

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Matching avec un mentor</CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {loading ? (
            <p className="text-gray-500">Chargement...</p>
          ) : mentors.length === 0 ? (
            <p className="text-center text-gray-500 col-span-full">Aucun mentor disponible pour le moment.</p>
          ) : (
            mentors.map((mentor) => (
              <MentorCard
                key={mentor.id}
                mentor={mentor}
                id={mentor.id}
                name={mentor.name}
                expertise={mentor.expertise}
                company={mentor.company}
                available={mentor.available}
                onRequest={() => handleRequest(mentor.id)}
                disabled={!mentor.available || mentor.requested}
                requested={mentor.requested}
              />
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default InternMatching;