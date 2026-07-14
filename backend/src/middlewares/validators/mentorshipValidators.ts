import { body, param } from 'express-validator';

export const mentorshipIdParamValidator = [
    param('mentorshipId').isMongoId().withMessage("L'ID du mentorat doit être un ObjectId MongoDB valide.")
];

export const createMentorshipRequestValidator = [
    body('mentorId')
        .isMongoId().withMessage("L'ID du mentor est requis et doit être un ObjectId valide."),
      body('menteeId') // Optionnel, si un admin/mentor initie
        .optional()
        .isMongoId().withMessage("L'ID du stagiaire doit être un ObjectId valide."),
    body('objectives')
        .optional()
        .isArray({ min: 1 }).withMessage("Au moins un objectif est requis pour le mentorat.")
        .isArray().withMessage("Les objectifs doivent être un tableau de chaînes de caractères."),
    body('objectives.*')
        .isString().notEmpty().trim().escape().withMessage("Chaque objectif doit être une chaîne de caractères non vide.")
];

export const updateMentorshipStatusValidator = [
    body('status')
        .notEmpty().withMessage("Le statut est requis.")
        .isIn(['pending', 'active', 'completed', 'cancelled', 'rejected'])
        .withMessage("Statut invalide. Doit être 'pending', 'active', 'completed', 'cancelled' ou 'rejected'.")
];

export const addMentorshipProgressValidator = [
    body('description')
        .notEmpty().withMessage("La description du progrès est requise.")
        .isString().trim().escape(),
    body('status')
        .optional()
        .isIn(['completed', 'in-progress', 'planned'])
        .withMessage("Statut de progrès invalide.")
];

export const addMentorshipFeedbackValidator = [
    body('rating')
        .notEmpty().withMessage("La note est requise.")
        .isNumeric().withMessage("La note doit être un nombre.")
        .isInt({ min: 1, max: 5 }).withMessage("La note doit être entre 1 et 5."),
    body('comment')
        .optional()
        .isString().trim().escape()
];

