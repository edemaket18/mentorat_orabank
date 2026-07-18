 import React, { useEffect, useState } from 'react';
import httpClient from '@api/httpClient';

interface Mentorship {
  _id: string;
  mentorName: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'completed' | 'pending';
  feedback?: string;
}

const API_URL = '/intern/mentorships';  

export const InternMentorships: React.FC = () => {
  const [mentorships, setMentorships] = useState<Mentorship[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMentorships = async () => {
    try {
      const response = await httpClient.get<Mentorship[]>(API_URL);
      setMentorships(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des suivis :', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMentorships();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Mes suivis de mentorat</h2>

      {loading ? (
        <p>Chargement...</p>
      ) : mentorships.length === 0 ? (
        <p>Aucun suivi de mentorat trouvé.</p>
      ) : (
        <div className="grid gap-4">
          {mentorships.map((m) => (
            <div
              key={m._id}
              className="bg-white dark:bg-gray-800 shadow rounded-lg p-4 border-l-4"
              style={{
                borderColor:
                  m.status === 'completed'
                    ? 'green'
                    : m.status === 'active'
                    ? 'blue'
                    : 'orange',
              }}
            >
              <h3 className="text-xl font-medium mb-1">{m.mentorName}</h3>
              <p className="text-sm text-gray-500">
                Du {new Date(m.startDate).toLocaleDateString()} au{' '}
                {new Date(m.endDate).toLocaleDateString()}
              </p>
              <p className="mt-2">
                <strong>Statut :</strong>{' '}
                <span
                  className={`px-2 py-1 rounded text-white text-sm ${
                    m.status === 'completed'
                      ? 'bg-green-500'
                      : m.status === 'active'
                      ? 'bg-blue-500'
                      : 'bg-yellow-500'
                  }`}
                >
                  {m.status}
                </span>
              </p>
              {m.feedback && (
                <p className="mt-2 text-sm italic text-gray-600 dark:text-gray-300">
                  « {m.feedback} »
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InternMentorships;