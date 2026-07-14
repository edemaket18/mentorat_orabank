 import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@components/layout/Card';
import { Input } from '@components/layout/Input';
import { Textarea } from '@components/layout/textarea';
import { Button } from '@components/common/Button';
import { toast } from 'sonner';

interface Report {
  _id: string;
  title: string;
  content: string;
  date: string;
  period: string;
  downloadUrl: string;
  createdAt?: string;  
}

const InternReports: React.FC = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [newReport, setNewReport] = useState({ title: '', content: '', period: '', downloadUrl: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setNewReport({ ...newReport, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (!newReport.title || !newReport.content) {
      toast.error('Veuillez remplir tous les champs');
      return;
    }

    const report: Report = {
      _id: Date.now().toString(),
      title: newReport.title,
      content: newReport.content,
      date: new Date().toLocaleDateString(),
      period: newReport.period,
      downloadUrl: newReport.downloadUrl,
      createdAt: new Date().toISOString(),
    };

    setReports([report, ...reports]);
    setNewReport({ title: '', content: '', period: '', downloadUrl: '' });  
    toast.success('Rapport soumis avec succès');
  };

  return (
    <><div className="p-6 max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Soumettre un rapport</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            name="title"
            placeholder="Titre du rapport"
            value={ newReport.title }
            onChange={ handleChange } />
          <Textarea
            name="content"
            placeholder="Contenu du rapport"
            value={ newReport.content }
            onChange={ handleChange }
            rows={ 6 } />
          <Button onClick={ handleSubmit }>Soumettre</Button>
        </CardContent>
      </Card>

      { reports.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Mes rapports précédents</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            { reports.map((report) => (
              <div key={ report._id } className="border p-4 rounded-md">
                <h3 className="font-semibold">{ report.title }</h3>
                <p className="text-sm text-muted-foreground mb-2">{ report.date }</p>
                <p className="text-sm">{ report.content }</p>
              </div>
            )) }
          </CardContent>
        </Card>
      ) }
    </div><div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Mes Rapports de stage</h1>

        { reports.length === 0 ? (
          <p>Aucun rapport disponible.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            { reports.map((report) => (
              <Card key={ report._id }>
                <CardContent>
                  <h2 className="text-lg font-semibold">{ report.title }</h2>
                  <p>Période : { report.period }</p>
                  <p>Créé le : { report.createdAt ? new Date(report.createdAt).toLocaleDateString() : 'Inconnu' }</p>
                  <a
                    href={ report.downloadUrl }
                    className="text-blue-600 underline text-sm"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Télécharger
                  </a>
                </CardContent>
              </Card>
            )) }
          </div>
        ) }
      </div></>
  );
};

export default InternReports;

