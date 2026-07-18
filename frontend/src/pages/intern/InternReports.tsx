import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@components/layout/Card';
import { Input } from '@components/layout/Input';
import { Textarea } from '@components/layout/textarea';
import { Button } from '@components/common/Button';
import { toast } from 'sonner';
import { getMyReports, createAndSubmitReport, InternReport } from '@api/intern.api';

const statusLabels: Record<string, string> = {
  draft: 'Brouillon',
  submitted: 'Soumis',
  validated: 'Validé',
  rejected: 'Rejeté',
};

const InternReports: React.FC = () => {
  const [reports, setReports] = useState<InternReport[]>([]);
  const [newReport, setNewReport] = useState({ title: '', content: '' });
  const [submitting, setSubmitting] = useState(false);

  const load = () => {
    getMyReports().then(setReports).catch(console.error);
  };

  useEffect(() => { load(); }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setNewReport({ ...newReport, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!newReport.title || !newReport.content) {
      toast.error('Veuillez remplir tous les champs');
      return;
    }

    setSubmitting(true);
    try {
      await createAndSubmitReport(newReport.title, newReport.content);
      setNewReport({ title: '', content: '' });
      toast.success('Rapport soumis avec succès');
      load();
    } catch (error) {
      toast.error("Erreur lors de l'envoi du rapport");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Soumettre un rapport</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            name="title"
            placeholder="Titre du rapport"
            value={newReport.title}
            onChange={handleChange}
          />
          <Textarea
            name="content"
            placeholder="Contenu du rapport"
            value={newReport.content}
            onChange={handleChange}
            rows={6}
          />
          <Button onClick={handleSubmit} disabled={submitting}>
            {submitting ? 'Envoi...' : 'Soumettre'}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Mes rapports précédents</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {reports.length === 0 ? (
            <p className="text-center text-muted-foreground">Aucun rapport disponible.</p>
          ) : (
            reports.map((report) => (
              <div key={report._id} className="border p-4 rounded-md">
                <h3 className="font-semibold">{report.title}</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  {statusLabels[report.status] ?? report.status} — {new Date(report.createdAt).toLocaleDateString()}
                </p>
                {report.introduction && <p className="text-sm">{report.introduction}</p>}
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default InternReports;