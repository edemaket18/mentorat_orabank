import React, { useEffect, useState } from 'react';

interface Feedback {
  id: string;
  sender: string;
  message: string;
  date: string;
}

const mockFeedbacks: Feedback[] = [
  { id: '1', sender: 'Mentor A', message: 'Le stagiaire progresse bien.', date: '2025-07-15' },
  { id: '2', sender: 'Stagiaire B', message: 'Besoin d’un suivi plus régulier.', date: '2025-07-14' },
];

const RHFeedback: React.FC = () => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);

  useEffect(() => {
    setFeedbacks(mockFeedbacks);
  }, []);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Feedbacks</h2>

      {feedbacks.length === 0 ? (
        <p>Aucun retour pour le moment.</p>
      ) : (
        <ul className="space-y-4">
          {feedbacks.map((fb) => (
            <li key={fb.id} className="border p-4 rounded shadow-sm bg-white">
              <p className="font-semibold">{fb.sender}</p>
              <p className="text-gray-700">{fb.message}</p>
              <p className="text-sm text-gray-400">{fb.date}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default RHFeedback;
