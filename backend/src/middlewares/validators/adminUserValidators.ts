import { body, param } from 'express-validator';

export const userIdParamValidator = [
    param('userId').isMongoId().withMessage("L'ID utilisateur doit être un ObjectId MongoDB valide.")
];

export const updateUserRoleValidator = [
    body('role')
        .notEmpty().withMessage("Le rôle est requis.")
        .isIn(['stagiaire', 'mentor', 'admin']).withMessage("Le rôle doit être 'stagiaire', 'mentor', ou 'admin'.")
];

export const updateUserStatusValidator = [
    body('isActive')
        .notEmpty().withMessage("Le statut d'activité est requis.")
        .isBoolean().withMessage("Le statut d'activité doit être un booléen (true ou false).")
];
