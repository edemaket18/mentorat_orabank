 import React, { useEffect, useState } from 'react';
import { getAllFeedback, Feedback } from '@api/feedback.api';

const RHFeedback: React.FC = () => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);

  useEffect(() => {
    getAllFeedback().then(setFeedbacks).catch(console.error);
  }, []);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Feedbacks</h2>

      {feedbacks.length === 0 ? (
        <p>Aucun retour pour le moment.</p>
      ) : (
        <ul className="space-y-4">
          {feedbacks.map((fb) => (
            <li key={fb._id} className="border p-4 rounded shadow-sm bg-white">
              <p className="font-semibold">{fb.author?.name ?? 'Utilisateur'}</p>
              <p className="text-gray-700">{fb.message}</p>
              <p className="text-sm text-gray-400">{new Date(fb.createdAt).toLocaleDateString()}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default RHFeedback;