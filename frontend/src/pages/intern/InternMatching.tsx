 import React, { useState } from 'react';
import   MentorCard   from '@features/cards/MentorCard';
import { toast } from 'react-hot-toast';
import { Card, CardHeader, CardTitle, CardContent } from '@components/layout/Card';

type Mentor = {
  id: string;
  name: string;
  expertise: string;
  company: string;
  available: boolean;
};

const mockMentors: Mentor[] = [
  { id: 'm1', name: 'Awa Traoré', expertise: 'Finance', company: 'Orabank', available: true },
  { id: 'm2', name: 'Kossi Adadji', expertise: 'IT', company: 'Orabank', available: false },
  { id: 'm3', name: 'Sandra Gbadoé', expertise: 'RH', company: 'Orabank', available: true },
];

const InternMatching: React.FC = () => {
  const [mentors, setMentors] = useState<Mentor[]>(mockMentors);
  const [requestedIds, setRequestedIds] = useState<string[]>([]);

  const handleRequest = (mentorId: string) => {
    setRequestedIds((prev) => [...prev, mentorId]);
    toast.success('Demande de mentorat envoyée avec succès !');
    // Ici, on simule une API call
    // await sendMatchingRequest({ mentorId, internId });
  };

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Matching avec un mentor</CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mentors.map((mentor) => (
            <MentorCard
              key={ mentor.id }
              mentor={ mentor }
              onRequest={ () => handleRequest(mentor.id) }
              disabled={ !mentor.available || requestedIds.includes(mentor.id) }
              requested={ requestedIds.includes(mentor.id) } id={ '' } name={ '' } expertise={ '' } company={ '' } available={ false }            />
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default InternMatching;
