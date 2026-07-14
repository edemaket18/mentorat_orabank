import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import Profile from '../models/Profile'; // Pour supprimer le profil si l'utilisateur est supprimé
import bcrypt from 'bcryptjs';
import User from '../models/User';

// @desc    Obtenir tous les utilisateurs (Admin)
// @route   GET /api/admin/users
// @access  Private/Admin
export const getAllUsers = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await User.find({}).select('-password'); // Exclure le mot de passe
    res.json(users);
  } catch (error) {
    next(error);
  }
};

// @desc    Obtenir un utilisateur par ID (Admin)
// @route   GET /api/admin/users/:userId
// @access  Private/Admin
export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const user = await User.findById(req.params.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    // Optionnel: Récupérer aussi le profil associé
    const profile = await Profile.findOne({ user: user._id });
    res.json({ user, profile });
  } catch (error) {
    if (error instanceof Error && error.name === 'CastError') {
      return res.status(400).json({ message: 'ID utilisateur invalide' });
    }
    next(error);
  }
};

// @desc    Mettre à jour le rôle d'un utilisateur (Admin)
// @route   PUT /api/admin/users/:userId/role
// @access  Private/Admin
export const updateUserRole = async (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { role } = req.body;
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    // Empêcher un admin de changer son propre rôle s'il est le seul admin
    if (req.users && user._id.toString() === req.users._id.toString() && user.role === 'admin' && role !== 'admin') {
      const adminCount = await User.countDocuments({ role: 'admin' });
      if (adminCount <= 1) {
        return res.status(400).json({ message: 'Impossible de changer le rôle du seul administrateur.' });
      }
    }

    user.role = role;
    await user.save();

    res.json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
    });
  } catch (error) {
    if (error instanceof Error && error.name === 'CastError') {
      return res.status(400).json({ message: 'ID utilisateur invalide' });
    }
    next(error);
  }
};

// @desc    Activer/Désactiver un utilisateur (Admin)
// @route   PUT /api/admin/users/:userId/status
// @access  Private/Admin
export const updateUserStatus = async (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { isActive } = req.body; // Doit être un booléen
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    // Empêcher un admin de se désactiver lui-même s'il est le seul admin actif
    if (req.users && user._id.toString() === req.users._id.toString() && user.role === 'admin' && isActive === false) {
      const activeAdminCount = await User.countDocuments({ role: 'admin', isActive: true });
      if (activeAdminCount <= 1) {
        return res.status(400).json({ message: 'Impossible de désactiver le seul administrateur actif.' });
      }
    }

    user.isActive = isActive;
    await user.save();

    res.json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
    });
  } catch (error) {
    if (error instanceof Error && error.name === 'CastError') {
      return res.status(400).json({ message: 'ID utilisateur invalide' });
    }
    next(error);
  }
};

// @desc    Supprimer un utilisateur (Admin)
// @route   DELETE /api/admin/users/:userId
// @access  Private/Admin
export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    // Empêcher la suppression du seul admin
    if (user.role === 'admin') {
      const adminCount = await User.countDocuments({ role: 'admin' });
      if (adminCount <= 1) {
        return res.status(400).json({ message: 'Impossible de supprimer le seul administrateur.' });
      }
    }

    // Supprimer le profil associé avant de supprimer l'utilisateur
    await Profile.findOneAndDelete({ user: userId });
    await User.findByIdAndDelete(userId);

    res.json({ message: 'Utilisateur et son profil supprimés avec succès.' });
  } catch (error) {
    if (error instanceof Error && error.name === 'CastError') {
      return res.status(400).json({ message: 'ID utilisateur invalide' });
    }
    next(error);
  }
};

