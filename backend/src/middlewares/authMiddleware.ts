import { Request, Response, NextFunction } from 'express'; 
import jwt from 'jsonwebtoken';
import User from '../models/User';

// Étendre l'interface Request pour inclure les propriétés 'users' et 'userId'
declare global {
  namespace Express {
    interface Request {
      users?: any;
      userId?: string;
    }
  }
}
// middlewares/authMiddleware.ts
 
export const mockAuth = (req: Request, res: Response, next: NextFunction) => {
  req.user = {
    _id: '123456789',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    role: 'stagiaire',
  };
  next();
};


// Middleware pour protéger les routes (authentification requise)
export const protect = async (req: Request, res: Response, next: NextFunction) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Extraire le token de l'en-tête Authorization
      token = req.headers.authorization.split(' ')[1];

      // Vérifier et décoder le token
      const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

      // Récupérer l'utilisateur à partir de l'ID dans le token
      req.users = await User.findById(decoded.id).select('-password');

      if (!req.users) {
        return res.status(401).json({ message: 'Utilisateur non trouvé.' });
      }

      next();
    } catch (error) {
      console.error('Erreur de token:', error);
      res.status(401).json({ message: 'Non autorisé, token invalide.' });
    }
  } else {
    res.status(401).json({ message: 'Non autorisé, aucun token fourni.' });
  }

};

// Middleware pour autoriser uniquement certains rôles
export const authorizeRoles = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.users) {
      return res.status(401).json({ message: 'Non autorisé.' });
    }

    if (!roles.includes(req.users.role)) {
      return res.status(403).json({ message: 'Accès interdit.' });
    }

    next();
  };
};

// Middleware pour vérifier si l'utilisateur est admin, mentor ou stagiaire
export const adminOrMentorOrTrainee = async (req: Request, res: Response, next: NextFunction) => {
  if (req.users && ['admin', 'mentor', 'trainee'].includes(req.users.role)) {
    next();
  } else {
    res.status(403).json({ message: 'Accès refusé.' });
  }
};
 
 
// Middleware pour vérifier si l'utilisateur est admin ou mentor
export const adminOrMentor = async (req: Request, res: Response, next: NextFunction) => {
  if (req.users && ['admin', 'mentor'].includes(req.users.role)) {
    next();
  } else {
    res.status(403).json({ message: 'Accès refusé.' });
  }
};

// Middleware pour vérifier si l'utilisateur est admin
export const adminOnly = async (req: Request, res: Response, next: NextFunction) => {
  if (req.users && req.users.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Accès refusé.' });
  }
};

// Middleware pour vérifier si l'utilisateur est mentor
export const mentorOnly = async (req: Request, res: Response, next: NextFunction) => {
  if (req.users && req.users.role === 'mentor') {
    next();
  } else {
    res.status(403).json({ message: 'Accès refusé.' });
  }
};
// Middleware pour vérifier si l'utilisateur est stagiaire
export const traineeOnly = async (req: Request, res: Response, next: NextFunction) => {
  if (req.users && req.users.role === 'trainee') {
    next();
  } else {
    res.status(403).json({ message: 'Accès refusé.' });
  }
};
// Middleware pour vérifier si l'utilisateur est admin ou stagiaire
export const adminOrTrainee = async (req: Request, res: Response, next: NextFunction) => {
  if (req.users && ['admin', 'trainee'].includes(req.users.role)) {
    next();
  } else {
    res.status(403).json({ message: 'Accès refusé.' });
  }
};

export const authorize = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!roles.includes(req.users?.role)) {
      return res.status(403).json({ message: 'Accès refusé' });
    }
    next();
  };
};
export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ message: 'Token manquant' });
    }

    const token = authHeader.split(' ')[1]; // Format "Bearer <token>"

    if (!token) {
      return res.status(401).json({ message: 'Token invalide' });
    }

    // Vérifie le token avec ta clé secrète
    const secret = process.env.JWT_SECRET || 'default_secret_key'; // Mieux vaut définir dans .env

    const decoded = jwt.verify(token, secret) as { userId: string };

    // On attache userId à la requête pour usage ultérieur
    req.userId = decoded.userId;

    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token invalide ou expiré' });
  }
};

// src/middlewares/adminMiddleware.ts
 
export const adminMiddleware = (req: Request, res: Response, next: NextFunction) => {
  if (req.users?.role !== 'admin') {
    return res.status(403).json({ message: 'Accès non autorisé' });
  }
  next();
};
 

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (req.users?.role !== 'admin') {
    return res.status(403).json({ message: 'Accès non autorisé' });
  }
  next();
};