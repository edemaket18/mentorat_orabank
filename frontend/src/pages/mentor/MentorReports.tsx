 import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@components/layout/Card';
import { getMyMentorReports, MentorReportSummary } from '@api/mentor.api';

const statusLabels: Record<string, string> = {
  draft: 'Brouillon',
  submitted: 'Soumis',
  validated: 'Validé',
  rejected: 'Rejeté',
};

const MentorReports: React.FC = () => {
  const [reports, setReports] = useState<MentorReportSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyMentorReports().then(setReports).catch(console.error).finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Rapports de mes stagiaires</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {loading ? (
            <p className="text-gray-500">Chargement...</p>
          ) : reports.length === 0 ? (
            <p className="text-center text-gray-500">Aucun rapport soumis pour le moment.</p>
          ) : (
            reports.map((r) => (
              <div key={r._id} className="border rounded-md p-4">
                <p className="font-semibold">{r.title}</p>
                <p className="text-sm text-gray-500">{r.intern?.name ?? 'Stagiaire'}</p>
                <p className="text-sm text-gray-500">
                  {statusLabels[r.status] ?? r.status} — {new Date(r.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MentorReports;