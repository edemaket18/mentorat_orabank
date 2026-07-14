 import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode
} from 'react';
import { getCurrentUser, logout as logoutApi } from '../api/auth.api';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'mentor' | 'intern' | 'stagiaire' | 'hr' | 'rh';
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (user: AuthUser) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      // Timeout de sécurité : si le backend ne répond pas en 5s,
      // on débloque le front sans crasher
      const timeout = setTimeout(() => {
        setUser(null);
        setLoading(false);
      }, 5000);

      try {
        const currentUser = await getCurrentUser();
        clearTimeout(timeout);
        setUser({
          id: currentUser._id,
          name: currentUser.name,
          email: currentUser.email,
          role: currentUser.role as AuthUser['role'],
        });
      } catch {
        // Backend down ou pas de session : utilisateur non connecté
        clearTimeout(timeout);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const login = (user: AuthUser) => setUser(user);

  const logout = async () => {
    try {
      await logoutApi();
    } catch (error) {
      console.error('Erreur lors de la déconnexion', error);
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth doit être utilisé à l'intérieur de <AuthProvider>");
  }
  return context;
};

export default AuthContext;