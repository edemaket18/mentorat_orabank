import axios from 'axios';

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

export interface Matching {
  _id: string;
  mentor: {
    _id: string;
    name: string;
  };
  intern: {
    _id: string;
    name: string;
  };
  status: 'pending' | 'accepted' | 'rejected';
}

export interface MatchingResult {
  _id: string;

}


export interface Evaluation {
  _id: string;
   
}



// Récupérer tous les mentors disponibles pour le matching
export const getAllMentors = () => API.get('/api/matching/mentors');

// Envoyer une demande à un mentor spécifique
export const sendRequestToMentor = (mentorId: string) =>
  API.post(`/api/matching/request/${mentorId}`);

// Récupérer les correspondances (matchs) de l'utilisateur courant
export const getMatches = () => API.get('/api/matching/my-matches');

export const getAllMatchings = () => API.get('/api/matching/all');

export const setMatchings = (data: Matching[]) => {
  return data.map((match) => ({
    ...match,
    mentor: match.mentor || { _id: '', name: 'Inconnu' },
    intern: match.intern || { _id: '', name: 'Inconnu' },
  }));
}