import httpClient from './httpClient';

// Rapports de stage (à ne pas confondre avec les signalements de messages,
// gérés séparément dans moderationReport.api.ts). Ce fichier correspond au
// vrai modèle Report du backend (mentés à /api/reports).
export interface Report {
  _id: string;
  title: string;
  introduction?: string;
  sections?: { heading: string; content: string }[];
  conclusion?: string;
  skillsAcquired?: string[];
  attachments?: string[];
  mentee?: any;
  createdAt: string;
  updatedAt?: string;
  status: 'draft' | 'submitted' | 'validated' | 'rejected';
  // Champs conservés pour compatibilité avec d'anciens composants non
  // routés dans l'app (ReportList/ReportUploader) — toujours vides côté
  // backend réel, ne pas s'appuyer dessus pour de nouvelles fonctionnalités.
  author?: string;
  description?: string;
}

// Récupérer tous les rapports (filtrés par rôle côté backend)
export const getReports = async (): Promise<Report[]> => {
  const response = await httpClient.get<Report[]>('/reports');
  return response.data;
};

// Récupérer un rapport par ID
export const getReportById = async (id: string): Promise<Report> => {
  const response = await httpClient.get<Report>(`/reports/${id}`);
  return response.data;
};

// Créer un nouveau rapport (brouillon)
export const createReport = async (report: Partial<Report>): Promise<Report> => {
  const response = await httpClient.post<Report>('/reports', report);
  return response.data;
};

// Mettre à jour un rapport existant
export const updateReport = async (id: string, report: Partial<Report>): Promise<Report> => {
  const response = await httpClient.put<Report>(`/reports/${id}`, report);
  return response.data;
};

// Soumettre un rapport (brouillon -> soumis)
export const submitReport = async (id: string): Promise<Report> => {
  const response = await httpClient.put<Report>(`/reports/${id}/submit`, {});
  return response.data;
};

// Supprimer un rapport
export const deleteReport = async (id: string): Promise<void> => {
  await httpClient.delete(`/reports/${id}`);
};