 import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5001/api',
  withCredentials: true,
});

export interface AuthUser {
  _id: string;
  name: string;
  email: string;
  role: string;
  token?: string;
  phone?: string;
  bio?: string;
  department?: string;
  university?: string;
  preferences?: {
    language?: string;
    notificationsEnabled?: boolean;
  };
}

interface ApiAuthUser {
  _id: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  email: string;
  role: string;
  phone?: string;
  bio?: string;
  department?: string;
  university?: string;
  preferences?: { language?: string; notificationsEnabled?: boolean };
}

interface AuthResponse {
  user?: ApiAuthUser;
  token?: string;
  _id?: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  role?: string;
  phone?: string;
  bio?: string;
  department?: string;
  university?: string;
  preferences?: { language?: string; notificationsEnabled?: boolean };
}

const TOKEN_STORAGE_KEY = 'authToken';

const normalizeRole = (role?: string) => {
  switch (role) {
    case 'intern':
    case 'stagiaire':
      return 'intern';
    case 'mentor':
      return 'mentor';
    case 'admin':
      return 'admin';
    case 'hr':
    case 'rh':
      return role;
    default:
      return 'intern';
  }
};

API.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_STORAGE_KEY);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

const normalizeAuthUser = (data: AuthResponse): AuthUser => {
  const rawUser = data.user ?? data;
  const name = rawUser.name ?? [rawUser.firstName, rawUser.lastName].filter(Boolean).join(' ');

  return {
    _id: rawUser._id ?? '',
    name: name || (rawUser.email ?? ''),
    email: rawUser.email ?? '',
    role: normalizeRole(rawUser.role),
    token: data.token,
    phone: rawUser.phone,
    bio: rawUser.bio,
    department: rawUser.department,
    university: rawUser.university,
    preferences: rawUser.preferences,
  };
};

const persistToken = (token?: string) => {
  if (token) {
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
  }
};

// Connexion utilisateur
export const login = async (email: string, password: string): Promise<AuthUser> => {
  const res = await API.post('/auth/login', { email, password });
  const user = normalizeAuthUser(res.data);
  persistToken(user.token);
  return user;
};

// Déconnexion utilisateur
export const logout = async (): Promise<void> => {
  localStorage.removeItem(TOKEN_STORAGE_KEY);
};

// Inscription utilisateur
export const register = async (name: string, email: string, password: string, role: any): Promise<AuthUser> => {
  const [firstName, ...rest] = (name || '').trim().split(/\s+/);
  const lastName = rest.join(' ');

  const res = await API.post('/auth/register', {
    firstName,
    lastName,
    email,
    password,
    role: role === 'mentor' ? 'mentor' : 'intern',
  });

  const user = normalizeAuthUser(res.data);
  persistToken(user.token);
  return user;
};

// Vérifier l'authentification de l'utilisateur courant
export const getCurrentUser = async (): Promise<AuthUser> => {
  const res = await API.get('/auth/current');
  return normalizeAuthUser(res.data);
};

export interface UpdateProfilePayload {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  bio?: string;
  department?: string;
  university?: string;
  preferences?: {
    language?: string;
    notificationsEnabled?: boolean;
  };
}

export const updateMyProfile = async (payload: UpdateProfilePayload): Promise<AuthUser> => {
  const res = await API.put('/auth/update-profile', payload);
  return normalizeAuthUser(res.data);
};

export const changePassword = async (currentPassword: string, newPassword: string): Promise<void> => {
  await API.post('/auth/change-password', { currentPassword, newPassword });
};

export const resetPassword = async (token: string, password: string): Promise<void> => {
  await API.post('/auth/reset-password', { token, password });
};

export const sendPasswordResetEmail = async (email: string): Promise<{ message: string; resetLink?: string }> => {
  const res = await API.post('/auth/forgot-password', { email });
  return res.data;
};