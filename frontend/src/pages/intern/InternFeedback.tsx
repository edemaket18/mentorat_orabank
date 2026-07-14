import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Feedback {
  _id: string;
  mentorName: string;
  message: string;
  createdAt: string;
}

export const InternFeedback: React.FC = () => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const res = await axios.get<Feedback[]>('/api/intern/feedback');
        setFeedbacks(res.data);
      } catch (error) {
        console.error('Erreur lors du chargement des retours :', error);
      }
    };
    fetchFeedbacks();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Mes Retours</h2>
      <ul className="space-y-4">
        {feedbacks.map((fb) => (
          <li key={fb._id} className="p-4 border rounded-md bg-white shadow-sm">
            <p className="text-sm text-gray-500">
              <strong>{fb.mentorName}</strong> — {new Date(fb.createdAt).toLocaleDateString()}
            </p>
            <p className="mt-1">{fb.message}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default InternFeedback;
