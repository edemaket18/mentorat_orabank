import { body, param } from 'express-validator';

export const reportIdParamValidator = [
    param('reportId').isMongoId().withMessage("L'ID du rapport doit être un ObjectId MongoDB valide.")
];

export const createOrUpdateReportValidator = [
    body('title')
        .notEmpty().withMessage("Le titre du rapport est requis.")
        .isString().trim().escape(),
    body('introduction')
        .optional().isString().trim(),  
    body('sections')
        .optional().isArray().withMessage("Les sections doivent être un tableau."),
    body('sections.*.title')
        .if(body('sections').exists()) // Valider seulement si 'sections' est fourni
        .notEmpty().withMessage("Le titre de la section est requis.")
        .isString().trim().escape(),
    body('sections.*.content')
        .if(body('sections').exists())
        .notEmpty().withMessage("Le contenu de la section est requis.")
        .isString().trim(),  
    body('conclusion')
        .optional().isString().trim(),  
    body('skillsAcquired')
        .optional().isArray().withMessage("Les compétences acquises doivent être un tableau."),
    body('skillsAcquired.*')
        .isString().trim().escape().withMessage("Chaque compétence acquise doit être une chaîne de caractères."),
    body('attachments')
        .optional().isArray().withMessage("Les pièces jointes doivent être un tableau."),
    body('attachments.*.fileName').optional().isString().trim().escape(),
    body('attachments.*.fileUrl').optional().isURL().withMessage("L'URL du fichier joint doit être valide.")
];

export const submitReportValidator = [ // Peut-être pas nécessaire si la soumission est juste un changement de statut
    // Aucune validation spécifique pour la soumission pour l'instant,
    // la logique sera dans le contrôleur pour changer le statut.
     param('reportId')
    .isMongoId()
    .withMessage('L\'ID du rapport est invalide.'),

  // Exemple : Validation optionnelle du corps de la requête
  body('status')
    .optional()
    .isIn(['submitted', 'draft'])
    .withMessage('Le statut doit être "submitted" ou "draft".'),

  body('comments')
    .optional()
    .isString()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Les commentaires ne doivent pas dépasser 500 caractères.'),
];

export const validateReportValidator = [
    body('status')
        .notEmpty().withMessage("Le statut de validation est requis.")
        .isIn(['validated', 'rejected']).withMessage("Le statut doit être 'validated' ou 'rejected'."),
    body('mentorFeedback')
        .if(body('status').equals('rejected')) // Feedback requis si rejeté
        .notEmpty().withMessage("Un feedback est requis si le rapport est rejeté.")
        .isString().trim().escape(),
    body('mentorFeedback') // Feedback optionnel si validé
        .optional()
        .isString().trim().escape()
];




