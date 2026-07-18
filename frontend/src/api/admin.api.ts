 import axios from 'axios';

const API_URL = '/api/admin';
const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5001/api',
  withCredentials: true,
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface AdminUser {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'mentor' | 'intern' | 'hr';
  isActive: boolean;
  firstName: string;
  lastName: string;
  avatar?: string;
  bio?: string;
  emailVerified?: boolean;
  createdAt: string;
  updatedAt: string;
}

// FIX: interface User restaurée — utilisée par MatchingPanel, AdminManageUsersPage,
// AdminRoles, AdminUsers. C'est un alias de AdminUser pour compatibilité.
export type User = AdminUser;

// Récupérer tous les utilisateurs (admin)
export const getAllUsers = async (): Promise<AdminUser[]> => {
  const res = await API.get(`${API_URL}/users`);
  return res.data;
};

// Supprimer un utilisateur par ID
export const deleteUser = async (id: string): Promise<void> => {
  await API.delete(`${API_URL}/users/${id}`);
};

// Mettre à jour le rôle d'un utilisateur
export const updateUserRole = async (id: string, role: string): Promise<AdminUser> => {
  const response = await API.put<AdminUser>(`${API_URL}/users/${id}/role`, { role });
  return response.data;
};

export const getStats = async (): Promise<any> => {
  const response = await API.get(`${API_URL}/stats`);
  return response.data;
};

export const getDashboardStats = async (): Promise<any> => {
  const response = await API.get(`${API_URL}/dashboard/stats`);
  return response.data;
};

export const updateUser = async (id: string, userData: Partial<AdminUser>): Promise<AdminUser> => {
  const response = await API.put<AdminUser>(`${API_URL}/users/${id}`, userData);
  return response.data;
};

export const getSettings = async (): Promise<any> => {
  const response = await API.get(`${API_URL}/settings`);
  return response.data;
};

export const updateSettings = async (settings: any): Promise<void> => {
  await API.put(`${API_URL}/settings`, settings);
};