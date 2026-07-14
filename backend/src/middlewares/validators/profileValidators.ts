import { body, param } from 'express-validator';

export const objectIdValidator = (fieldName: string) => [
    param(fieldName).isMongoId().withMessage(`L'ID ${fieldName} doit être un ObjectId valide.`)
];

export const createOrUpdateProfileValidator = [
    body('department').optional().isString().trim().escape().withMessage("Le département doit être une chaîne de caractères."),
    body('position').optional().isString().trim().escape().withMessage("Le poste doit être une chaîne de caractères."),
    body('bio').optional().isString().trim().escape().withMessage("La biographie doit être une chaîne de caractères."),
    body('skills').optional().isArray().withMessage("Les compétences doivent être un tableau."),
    body('skills.*').optional().isString().trim().escape().withMessage("Chaque compétence doit être une chaîne de caractères."),
    body('experiences').optional().isArray().withMessage("Les expériences doivent être un tableau."),
    body('experiences.*.title').optional().isString().trim().escape(),
    body('experiences.*.company').optional().isString().trim().escape(),
    body('experiences.*.from').optional().isISO8601().toDate(),
    body('experiences.*.to').optional().isISO8601().toDate(),
    body('experiences.*.description').optional().isString().trim().escape(),
    body('education').optional().isArray().withMessage("L'éducation doit être un tableau."),
    body('education.*.school').optional().isString().trim().escape(),
    body('education.*.degree').optional().isString().trim().escape(),
    body('education.*.field').optional().isString().trim().escape(),
    body('education.*.from').optional().isISO8601().toDate(),
    body('education.*.to').optional().isISO8601().toDate(),
    body('linkedinProfile').optional().isURL().withMessage("Le profil LinkedIn doit être une URL valide."),
    body('githubProfile').optional().isURL().withMessage("Le profil GitHub doit être une URL valide."),
    body('interests').optional().isArray().withMessage("Les centres d'intérêt doivent être un tableau."),
    body('interests.*').optional().isString().trim().escape().withMessage("Chaque centre d'intérêt doit être une chaîne de caractères.")
];