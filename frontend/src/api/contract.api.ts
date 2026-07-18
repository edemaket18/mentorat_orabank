 import httpClient from './httpClient';

const API_URL = '/contracts';

export interface Contract {
  intern: any;
  _id: string;
  title: string;
  description: string;
  startDate: string;
  endDate?: string;
  status: 'active' | 'terminated' | 'pending';
  parties: string[];
}

// Récupérer tous les contrats
export const getContracts = async (): Promise<Contract[]> => {
  const response = await httpClient.get<Contract[]>(API_URL);
  return response.data;
};

// Récupérer un contrat par ID
export const getContractById = async (id: string): Promise<Contract> => {
  const response = await httpClient.get<Contract>(`${API_URL}/${id}`);
  return response.data;
};

// Créer un nouveau contrat
export const createContract = async (contract: Omit<Contract, '_id'>): Promise<Contract> => {
  const response = await httpClient.post<Contract>(API_URL, contract);
  return response.data;
};

// Mettre à jour un contrat existant
export const updateContract = async (id: string, contract: Partial<Contract>): Promise<Contract> => {
  const response = await httpClient.put<Contract>(`${API_URL}/${id}`, contract);
  return response.data;
};

 // Supprimer un contrat
export const deleteContract = async (id: string): Promise<void> => {
  await httpClient.delete(`${API_URL}/${id}`);
};


// Récupérer tous les contrats pour l'administration
export const getAllContracts = async (): Promise<Contract[]> => {
  const response = await httpClient.get<Contract[]>('/admin/contracts');
  return response.data;
};