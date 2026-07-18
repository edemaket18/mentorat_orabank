 import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@components/layout/Card';
import { getMyInterns, getMyEvaluations, createEvaluation, MentorInternSummary, MentorEvaluationSummary } from '@api/mentor.api';

const MentorEvaluations: React.FC = () => {
  const [interns, setInterns] = useState<MentorInternSummary[]>([]);
  const [evaluations, setEvaluations] = useState<MentorEvaluationSummary[]>([]);
  const [scores, setScores] = useState<Record<string, string>>({});
  const [comments, setComments] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState<string | null>(null);

  const load = () => {
    getMyInterns().then(setInterns).catch(console.error);
    getMyEvaluations().then(setEvaluations).catch(console.error);
  };

  useEffect(() => { load(); }, []);

  const handleSubmit = async (internId: string) => {
    const score = Number(scores[internId]);
    if (!score || score < 0 || score > 20) return;
    setSubmitting(internId);
    try {
      await createEvaluation(internId, score, comments[internId]);
      setScores((prev) => ({ ...prev, [internId]: '' }));
      setComments((prev) => ({ ...prev, [internId]: '' }));
      load();
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitting(null);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Évaluer mes stagiaires</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {interns.length === 0 && <p className="text-center text-gray-500">Aucun stagiaire à évaluer.</p>}
          {interns.map((item) => (
            <div key={item.matchId} className="border rounded-md p-4 space-y-2">
              <p className="font-semibold">{item.intern?.name ?? 'Stagiaire'}</p>
              <div className="flex gap-2 items-center">
                <input
                  type="number"
                  min={0}
                  max={20}
                  placeholder="Note /20"
                  value={scores[item.intern?._id ?? ''] ?? ''}
                  onChange={(e) =>
                    setScores((prev) => ({ ...prev, [item.intern?._id ?? '']: e.target.value }))
                  }
                  className="border rounded px-2 py-1 w-24"
                />
                <input
                  type="text"
                  placeholder="Commentaire (optionnel)"
                  value={comments[item.intern?._id ?? ''] ?? ''}
                  onChange={(e) =>
                    setComments((prev) => ({ ...prev, [item.intern?._id ?? '']: e.target.value }))
                  }
                  className="border rounded px-2 py-1 flex-1"
                />
                <button
                  onClick={() => handleSubmit(item.intern?._id ?? '')}
                  disabled={submitting === item.intern?._id}
                  className="bg-blue-500 text-white px-3 py-1 rounded disabled:opacity-50"
                >
                  Envoyer
                </button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Évaluations envoyées</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {evaluations.length === 0 ? (
            <p className="text-center text-gray-500">Aucune évaluation envoyée pour le moment.</p>
          ) : (
            evaluations.map((e) => (
              <div key={e._id} className="border rounded-md p-3">
                <p className="font-medium">{e.intern?.name} — {e.score}/20</p>
                {e.comment && <p className="text-sm text-gray-500">{e.comment}</p>}
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MentorEvaluations;