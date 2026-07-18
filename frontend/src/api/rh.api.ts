 import { ReactNode } from 'react';
import httpClient from './httpClient';

// Réutilise le client centralisé : bonne baseURL (env) + token Bearer attaché automatiquement.
const api = httpClient;

export interface User {
  specialty: string;
  department: string;
  phone: string;
  position: ReactNode;
  endDate: string | number | Date;
  _id: string;
  name: string;
  email: string;
  role: string;
}

  export interface Application  {
  _id: string,
  name: string,
  email: string,
  message: string,
  status: string,
};

export interface intern {
  _id: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  role: string;
  isActive: boolean;
};


export  interface ApplicationResponse {
  applications: Application[] | null;
  error: string | null;
};



// Récupérer tous les stagiaires
export const getAllInterns = async (): Promise<User[]> => {
  const res = await api.get('/rh/interns');
  return res.data;
};

// Supprimer un stagiaire par ID
export const deleteInternById = async (id: string): Promise<void> => {
  await api.delete(`/rh/interns/${id}`);
};

// Récupérer tous les mentors
export const getAllMentors = async (): Promise<User[]> => {
  const res = await api.get('/rh/mentors');
  return res.data;
};

// Supprimer un mentor par ID
export const removeMentorById = async (id: string): Promise<void> => {
  await api.delete(`/rh/mentors/${id}`);
};

// Récupérer tous les utilisateurs pour l'administration
export const getAllUsersForAdmin = async (): Promise<User[]> => {
  const res = await api.get('/admin/users');
  return res.data;
};

// Supprimer un utilisateur par ID pour l'administration
export const deleteUserById = async (id: string): Promise<void> => {
  await api.delete(`/admin/users/${id}`);
};

// Récupérer les détails d'un utilisateur par ID
export const getUserById = async (id: string): Promise<User> => {
  const res = await api.get(`/admin/users/${id}`);
  return res.data;
};

export const getUnmatchedInterns = async (): Promise<User[]> => {
  const res = await api.get('/rh/interns/unmatched');
  return res.data;
};

export const getAvailableMentors = async (): Promise<User[]> => {
  const res = await api.get('/rh/mentors/available');
  return res.data;
};

export const assignMentorToIntern = async (internId: string, mentorId: string): Promise<void> => {
  await api.post(`/rh/interns/${internId}/assign-mentor`, { mentorId });
};

 
export const approveApplication = async (id: string): Promise<void> => {
  await api.post(`/rh/applications/${id}/approve`);
};

export const getAllApplications = async (): Promise<Application[]> => {
  const res = await api.get('/rh/applications');
  return res.data;
};


export const getDepartingStagiaires = async (): Promise<User[]> => {
  const res = await api.get('/rh/stagiaires/departing');
  return res.data;
};

export const archiveStagiaire = async (id: string): Promise<void> => {
  await api.post(`/rh/stagiaires/${id}/archive`);
};

export const getStagiairesForEvaluation = async (): Promise<User[]> => {
  const res = await api.get('/rh/evaluations/stagiaires');
  return res.data;
};

export const submitEvaluation = async (id: string, note: number): Promise<void> => {
  await api.post(`/rh/evaluations/${id}`, { note });
};

export interface RHStatistics {
  interns: number;
  mentors: number;
  activeMentorships: number;
  completedReports: number;
}

export const getRHStatistics = async (): Promise<RHStatistics> => {
  const res = await api.get<RHStatistics>('/rh/statistics');
  return res.data;
};