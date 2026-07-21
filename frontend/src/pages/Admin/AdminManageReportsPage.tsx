// src/pages/admin/ManageReportsPage.tsx
import React, { useEffect, useState } from 'react';
import { getAllModerationReports, resolveModerationReport, deleteModerationReportMessage, ModerationReport as Report } from '@api/moderationReport.api';
import { toast } from 'sonner';
import { Button } from '@components/common/Button';
import { Card, CardContent } from '@components/layout/Card';
import { Loader2, Check, Trash2 } from 'lucide-react';

const ManageReportsPage: React.FC = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReports = async () => {
  setLoading(true);  
  try {
    const res = await getAllModerationReports();
    if (Array.isArray(res)) {
      setReports(res);
    } else {
      toast.error("Format de données inattendu.");
    }
  } catch (error: any) {
    console.error(error);
    toast.error('Erreur lors du chargement des signalements.');
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    fetchReports();
  }, []);

  const handleResolve = async (reportId: string) => {
  try {
    await resolveModerationReport(reportId);
    toast.success('Signalement marqué comme traité.');
    setReports((prev) =>
      prev.map((r) => (r._id === reportId ? { ...r, status: 'closed' } : r))
    );
  } catch (error) {
    toast.error("Erreur lors du traitement du signalement.");
  }
};


  

  const handleDeleteMessage = async (messageId: string) => {
  const confirm = window.confirm("Supprimer ce message ? Cette action est irréversible.");
  if (!confirm) return;

  try {
    await deleteModerationReportMessage(messageId);
    toast.success('Message supprimé avec succès.');
    fetchReports();
  } catch (error) {
    toast.error("Impossible de supprimer le message.");
  }
};

 
const chartData = reports.map((report) => ({
  name: new Date(report.createdAt).toLocaleDateString('fr-FR'),
  value: 1,  
}));


  if (reports.length === 0 && !loading) {
    return <p className="text-center text-muted-foreground">Aucun signalement en attente.</p>;
  }


  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin w-8 h-8 text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Gestion des Signalements</h1>

      {reports.length === 0 ? (
        <p className="text-muted-foreground">Aucun signalement en attente.</p>
      ) : (
        <div className="space-y-4">
          {reports.map((report) => (
            <><Card key={ report._id }>
              <CardContent className="p-4 space-y-2">
                <p className="text-sm text-muted-foreground">
                  Signalement : <span className="font-medium">{ report.reason }</span>
                </p>
                <p className="text-sm">
                  Message : <span className="italic">"{ report.message.content }"</span>
                </p>
                <p className="text-xs text-gray-500">
                  Auteur : { report.message.sender.name } ({ report.message.sender.email })
                </p>
                <div className="flex gap-2 mt-2">
                  <Button variant="outline" onClick={ () => handleResolve(report._id) } disabled={ report.status === 'closed' }>
                    <Check className="w-4 h-4 mr-1" />
                    Marquer comme traité
                  </Button>
                  <Button variant="primary" onClick={ () => handleDeleteMessage(report.message._id) }>
                    <Trash2 className="w-4 h-4 mr-1" />
                    Supprimer le message
                  </Button>
                </div>
              </CardContent>
            </Card> </>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageReportsPage;