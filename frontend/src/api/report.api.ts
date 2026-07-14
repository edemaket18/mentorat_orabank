import axios from 'axios';

const API_URL = '/api/reports';

export interface Report {
  mentor: any;
  intern: any;
  _id: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt?: string;
  status: 'open' | 'in_progress' | 'closed';
  author: string;
  reason: string;
  message: {
    _id: string;
    content: string;
    sender: { name: string; email: string };
  };
  data?: any;  
  
}

// Récupérer tous les rapports
export const getReports = async (): Promise<Report[]> => {
  const response = await axios.get<Report[]>(API_URL);
  return response.data;
};

// Récupérer un rapport par ID
export const getReportById = async (id: string): Promise<Report> => {
  const response = await axios.get<Report>(`${API_URL}/${id}`);
  return response.data;
};

// Créer un nouveau rapport
export const createReport = async (report: Omit<Report, '_id' | 'createdAt' | 'updatedAt'>): Promise<Report> => {
  const response = await axios.post<Report>(API_URL, report);
  return response.data;
};

// Mettre à jour un rapport existant
export const updateReport = async (id: string, report: Partial<Report>): Promise<Report> => {
  const response = await axios.put<Report>(`${API_URL}/${id}`, report);
  return response.data;
};

// Supprimer un rapport
export const deleteReport = async (id: string): Promise<void> => {
  await axios.delete(`${API_URL}/${id}`);
};

// Récupérer tous les rapports pour l'administration
export const getAllReportsForAdmin = async (): Promise<Report[]> => {
  const response = await axios.get<Report[]>('/admin/reports');
  return response.data;
};

// Supprimer un rapport par ID pour l'administration
export const deleteReportById = async (id: string): Promise<void> => {
  await axios.delete(`/admin/reports/${id}`);
};


export const getAllReports = async (): Promise<Report[]> => {
  const response = await axios.get<Report[]>(API_URL);
  return response.data;
};

export const resolveReport = async (id: string): Promise<void> => {
  await axios.post(`${API_URL}/${id}/resolve`);
};

export const deleteReportedMessage = async (id: string): Promise<void> => {
  await axios.delete(`${API_URL}/${id}/message`);
};