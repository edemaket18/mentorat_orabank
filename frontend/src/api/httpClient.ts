import axios from 'axios';

/**
 * Client HTTP partagé pour les pages qui n'utilisent pas encore un fichier
 * dédié dans src/api/*.api.ts. Toujours utiliser celui-ci (ou un fichier
 * api/*.api.ts qui a la même baseURL) plutôt qu'un axios.get('/api/...')
 * en chemin relatif : un chemin relatif fonctionne par hasard en dev web
 * (même origine que le backend), mais pointe vers le mauvais serveur dès
 * qu'on est en production ou dans le shell mobile (Capacitor).
 */
const httpClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5001/api',
  withCredentials: true,
});

// Même mécanisme d'authentification que api/auth.api.ts : le backend lit le
// token dans l'en-tête Authorization (pas de cookie de session), donc chaque
// client axios de l'app doit l'attacher lui-même.
const TOKEN_STORAGE_KEY = 'authToken';

httpClient.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_STORAGE_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default httpClient;