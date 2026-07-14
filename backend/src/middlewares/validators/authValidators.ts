import { body } from 'express-validator';

export const registerValidator = [
  body('firstName', 'Le prénom est requis').not().isEmpty().trim().escape(),
  body('lastName', 'Le nom est requis').not().isEmpty().trim().escape(),
  body('email', 'Veuillez inclure un email valide').isEmail().normalizeEmail(),
  body('password', 'Veuillez entrer un mot de passe avec 6 caractères ou plus').isLength({ min: 6 }),
  body('role', 'Le rôle doit être stagiaire, mentor ou admin').optional().isIn(['stagiaire', 'mentor', 'admin'])
];

export const loginValidator = [
  body('email', 'Veuillez inclure un email valide').isEmail().normalizeEmail(),
  body('password', 'Le mot de passe est requis').exists()
];


