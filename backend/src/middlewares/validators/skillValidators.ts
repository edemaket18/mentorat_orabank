import { body, param } from 'express-validator';
import Skill from '../../models/Skill';
 
export const skillIdParamValidator = [
    param('skillId').isMongoId().withMessage("L'ID de la compétence doit être un ObjectId MongoDB valide.")
];

export const createOrUpdateSkillValidator = [
    body('name')
        .notEmpty().withMessage("Le nom de la compétence est requis.")
        .isString().trim().escape(),
    body('description')
        .optional()
        .isString().trim().escape(),
    body('category')
        .notEmpty().withMessage("La catégorie est requise.")
        .isIn(['technical', 'soft', 'tool', 'language', 'other'])
        .withMessage("Catégorie invalide. Doit être 'technical', 'soft', 'tool', 'language' ou 'other'.")
];

 
 
export const updateSkillValidator = [
  // Validation de l'ID dans les paramètres de la route
  param('skillId')
    .isMongoId()
    .withMessage('ID de compétence invalide.'),

  // Validation des champs optionnels dans le corps de la requête
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Le nom doit contenir entre 2 et 50 caractères.'),

  body('level')
    .optional()
    .isIn(['débutant', 'intermédiaire', 'avancé', 'expert'])
    .withMessage('Niveau invalide. Choisissez parmi : débutant, intermédiaire, avancé, expert.'),

  body('category')
    .optional()
    .isString()
    .trim()
    .withMessage('La catégorie doit être une chaîne de caractères.'),

  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('Le statut actif doit être un booléen.'),
];

 
export const deleteSkillValidator = [
  param('skillId')
    .isMongoId()
    .withMessage('Invalid skill ID format')
    
     .custom(async (skillId) => {
      const skill = await Skill.findById(skillId);
      if (!skill) throw new Error('Skill not found');
      return true;
    })
    
     .custom(async (skillId, { req }) => {
      if (!req.user.isAdmin) {
        throw new Error('Only admins can delete skills');
      }
      return true;
    })
];

