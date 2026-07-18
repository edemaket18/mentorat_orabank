 import { Request, Response, NextFunction } from 'express';
import User from '../models/User';
import Profile from '../models/Profile';
import generateToken from '../utils/generateToken';
import { sendEmail } from '../utils/sendEmail';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// ➤ Enregistrement
export const registerUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { firstName, lastName, email, password, role, name } = req.body;

    const normalizedFirstName = firstName || (name ? name.split(/\s+/)[0] : '');
    const normalizedLastName = lastName || (name ? name.split(/\s+/).slice(1).join(' ') : '');
    const normalizedRole = role === 'intern' ? 'stagiaire' : (role === 'stagiaire' ? 'stagiaire' : (role || 'stagiaire'));

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'Cet utilisateur existe déjà' });
    }

    const user = await User.create({
      firstName: normalizedFirstName,
      lastName: normalizedLastName,
      email,
      password,
      role: normalizedRole,
    });

    await Profile.create({ user: user._id });

    res.status(201).json({
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },
      token: generateToken(user._id),
    });
  } catch (error) {
    next(error);
  }
};

// ➤ Connexion
/*
export const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Email ou mot de passe invalide' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Email ou mot de passe invalide' });
    }

    res.json({
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },
      token: generateToken(user._id),
    });
  } catch (error) {
    next(error);
  }
};
*/
export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Email ou mot de passe invalide' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Email ou mot de passe invalide' });
    }

    // Redirection basée sur le rôle
    const role = user.role;
    let redirect = '';
    if (role === 'admin') {
      redirect = '/admin';
    } else if (role === 'stagiaire') {
      redirect = '/stagiaire';
    } else if (role === 'mentor') {
      redirect = '/mentor';
    } else {
      return res.status(400).json({ message: 'Rôle inconnu' });
    }

    return res.status(200).json({
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },
      token: generateToken(user._id),
      redirect,
    });
  } catch (err: any) {
    console.error('Erreur dans loginUser:', err); // ← Ajoute ceci
    res.status(500).json({ message: 'Erreur serveur' });
  }
};


// ➤ Obtenir Profil
export const getMe = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    res.json(user);
  } catch (error) {
    next(error);
  }
};

// ➤ Mettre à jour le Profil
export const updateProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { firstName, lastName, email, password, phone, bio, department, university, preferences } = req.body;
    const user = await User.findById(req.users?._id);

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.email = email || user.email;
    if (phone !== undefined) user.phone = phone;
    if (bio !== undefined) user.bio = bio;
    if (department !== undefined) (user as any).department = department;
    if (university !== undefined) (user as any).university = university;
    if (preferences !== undefined) {
      (user as any).preferences = { ...(user as any).preferences, ...preferences };
    }
    if (password) user.password = await bcrypt.hash(password, 10);

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      email: updatedUser.email,
      role: updatedUser.role,
      phone: updatedUser.phone,
      bio: updatedUser.bio,
      department: (updatedUser as any).department,
      university: (updatedUser as any).university,
      preferences: (updatedUser as any).preferences,
    });
  } catch (error) {
    next(error);
  }
};

// ➤ Mot de passe oublié
export const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Adresse email requise' });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });

    const token = crypto.randomBytes(32).toString('hex');
    user.resetToken = token;
    user.resetTokenExpires = Date.now() + 3600000; // 1h
    await user.save();

    const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${token}`;

    try {
      await sendEmail({
        to: user.email,
        subject: 'Réinitialisation du mot de passe',
        html: `<p>Cliquez ici pour réinitialiser votre mot de passe : <a href="${resetLink}">Réinitialiser</a></p>`,
      });

      return res.status(200).json({ message: 'Lien de réinitialisation envoyé avec succès.' });
    } catch (mailErr) {
      console.error('Envoi mail échoué, fourniture du lien en réponse pour tests locaux:', mailErr);
      return res.status(200).json({
        message: "Demande enregistrée. SMTP non configuré => lien disponible pour test local.",
        resetLink,
      });
    }
  } catch (error) {
    next(error);
  }
};

// ➤ Réinitialiser le mot de passe
export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({
      resetToken: token,
      resetTokenExpires: { $gt: Date.now() },
    });

    if (!user) return res.status(400).json({ message: 'Lien invalide ou expiré' });

    user.password = await bcrypt.hash(password, 10);
    user.resetToken = undefined;
    user.resetTokenExpires = undefined;

    await user.save();

    res.status(200).json({ message: 'Mot de passe mis à jour' });
  } catch (error) {
    next(error);
  }
};

// ➤ Changer mot de passe (connecté)
export const changePassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Ancien mot de passe incorrect' });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.status(200).json({ message: 'Mot de passe changé avec succès' });
  } catch (error) {
    next(error);
  }
};



/*

import { Request, Response, NextFunction } from 'express';
import User from '../models/User';  
import Profile from '../models/Profile';
import generateToken from '../utils/generateToken';
import { validationResult } from 'express-validator';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
 import { sendEmail } from '../utils/sendEmail';
 
 // @desc    Enregistrer un nouvel utilisateur
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { firstName, lastName, email, password, role } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'Cet utilisateur existe déjà' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role: role || 'stagiaire', // Rôle par défaut si non fourni
    });

    if (user) {
      // Créer un profil vide pour le nouvel utilisateur
      await Profile.create({ user: user._id });

      res.status(201).json({
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Données utilisateur invalides' });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Authentifier un utilisateur & obtenir un token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req: Request, res: Response, next: NextFunction) => {
   

  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(401).json({ message: 'Email ou mot de passe invalide' });
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.status(401).json({ message: 'Email ou mot de passe invalide' });
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, { expiresIn: '7d' });

  res.json({
    user: {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
    },
    token,
  });
};


  /*
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).select('+password');

    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Email ou mot de passe invalide' });
    }
  } catch (error) {
    next(error);
  }
};

*/

/*
// @desc    Obtenir le profil de l'utilisateur connecté
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.users || !req.users._id) {
      return res.status(401).json({ message: 'Non autorisé, utilisateur non identifié dans la requête' });
    }

    const user = await User.findById(req.users._id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    res.json(user);
  } catch (error) {
    next(error);
  }
};

// @desc    Mettre à jour le profil de l'utilisateur connecté
// @route   PUT /api/auth/profile
// @access  Private
export const updateProfile = async (req: Request, res: Response, next: NextFunction) => {
  const { firstName, lastName, email, password } = req.body;

  try {
    const user = await User.findById(req.users._id);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.email = email || user.email;
    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }

    await user.save();
    res.json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Obtenir tous les utilisateurs (pour l'administration)
// @route   GET /api/auth/users
// @access  Private/Admin
export const getAllUsers = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    next(error);
  }
};

// @desc    Supprimer un utilisateur (pour l'administration)
// @route   DELETE /api/auth/users/:id
// @access  Private/Admin
export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    await user.remove();
    res.json({ message: 'Utilisateur supprimé' });
  } catch (error) {
    next(error);
  }
};


// Déplacez cette logique dans une fonction asynchrone appropriée, par exemple dans registerUser après la création de l'utilisateur
// Exemple :
async function sendVerificationEmail(user: any) {
  const token = crypto.randomBytes(32).toString('hex');
  user.emailVerificationToken = token;
  user.emailVerificationExpires = Date.now() + 1000 * 60 * 60; // 1h
  await user.save();

  const verificationLink = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;
  await sendEmail({
    to: user.email,
    subject: 'Vérification de votre adresse e-mail',
    html: `
      <h2>Bienvenue ${user.firstName}</h2>
      <p>Merci de vous être inscrit. Cliquez sur le lien ci-dessous pour vérifier votre adresse :</p>
      <a href="${verificationLink}">Vérifier mon e-mail</a>
      <p>Ce lien expire dans 1 heure.</p>
    `,
  });
}

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Adresse email requise' });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });

    const token = crypto.randomBytes(32).toString('hex');
    user.resetToken = token;
    user.resetTokenExpires = Date.now() + 3600000; // 1h
    await user.save();

    const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${token}`;

    try {
      await sendEmail({
        to: user.email,
        subject: 'Réinitialisation du mot de passe',
        html: `<p>Cliquez ici pour réinitialiser votre mot de passe : <a href="${resetLink}">Réinitialiser</a></p>`
      });

      return res.status(200).json({ message: 'Lien de réinitialisation envoyé avec succès.' });
    } catch (mailError) {
      console.error('Échec d’envoi du mail de réinitialisation:', mailError);
      console.log('Lien de réinitialisation généré (smtp non configuré):', resetLink);
      return res.status(200).json({
        message: 'Demande enregistrée. Le lien de réinitialisation est prêt ; vérifiez la console du backend si l’e-mail ne part pas.',
      });
    }
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la demande de réinitialisation' });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const token = req.body?.token || req.params?.token;
    const { password } = req.body;

    if (!token || !password) {
      return res.status(400).json({ message: 'Token ou mot de passe manquant' });
    }

    const user = await User.findOne({
      resetToken: token,
      resetTokenExpires: { $gt: Date.now() }
    });

    if (!user) return res.status(400).json({ message: 'Lien expiré ou invalide' });

    user.password = await bcrypt.hash(password, 10);
    user.resetToken = undefined;
    user.resetTokenExpires = undefined;
    await user.save();

    res.status(200).json({ message: 'Mot de passe mis à jour' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la réinitialisation du mot de passe' });
  }
};


export const changePassword = async (req: Request, res: Response) => {
  const userId = req.user.id;
  const { oldPassword, newPassword } = req.body;

  const user = await User.findById(userId);
  const isMatch = await user.comparePassword(oldPassword);
  if (!isMatch) return res.status(400).json({ message: "Ancien mot de passe incorrect" });

  user.password = newPassword;
  await user.save();

  res.status(200).json({ message: "Mot de passe changé avec succès" });
};

*/