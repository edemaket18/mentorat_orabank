 import React, { useEffect, useState } from 'react';
import httpClient from '@api/httpClient';

interface Evaluation {
  _id: string;
  evaluator: string;
  score: number;
  comment: string;
  date: string;
}

const InternEvaluations: React.FC = () => {
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);

  useEffect(() => {
    const fetchEvaluations = async () => {
      try {
        const res = await httpClient.get<Evaluation[]>('/intern/evaluations');
        setEvaluations(res.data);
      } catch (error) {
        console.error('Erreur lors du chargement des évaluations :', error);
      }
    };
    fetchEvaluations();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Mes Évaluations</h2>
      <div className="space-y-4">
        {evaluations.map((evalItem) => (
          <div key={evalItem._id} className="border p-4 rounded-md shadow-sm bg-white">
            <p>
              <strong>Évaluateur :</strong> {evalItem.evaluator}
            </p>
            <p>
              <strong>Score :</strong> {evalItem.score} / 10
            </p>
            <p>
              <strong>Commentaire :</strong> {evalItem.comment}
            </p>
            <p className="text-xs text-gray-500">
              {new Date(evalItem.date).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InternEvaluations;