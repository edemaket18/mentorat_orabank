import { body, param } from 'express-validator';

export const experienceIdParamValidator = [
    param('experienceId').isMongoId().withMessage("L'ID de l'expérience doit être un ObjectId MongoDB valide.")
];

export const createExperienceValidator = [
    body('title')
        .notEmpty().withMessage("Le titre est requis.")
        .isString().trim().escape(),
    body('content')
        .notEmpty().withMessage("Le contenu est requis.")
        .isString().trim(),  
    body('category')
        .notEmpty().withMessage("La catégorie est requise.")
        .isIn(['article', 'question', 'tip']).withMessage("Catégorie invalide. Doit être 'article', 'question' ou 'tip'."),
    body('tags')
        .optional()
        .isArray().withMessage("Les tags doivent être un tableau.")
        .custom((tags) => tags.every((tag: any) => typeof tag === 'string')).withMessage("Chaque tag doit être une chaîne de caractères.")
];

export const addCommentValidator = [
    body('text')
        .notEmpty().withMessage("Le texte du commentaire est requis.")
        .isString().trim().escape()
];
