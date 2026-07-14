import express from 'express';
import { protect, authorize } from '../middlewares/authMiddleware';
import {
    createSkill,
    getAllSkills,
    getSkillById,
    updateSkill,
    deleteSkill
} from '../controllers/skillController';
import {
    skillIdParamValidator,
    createOrUpdateSkillValidator,
    updateSkillValidator,
    deleteSkillValidator
} from '../middlewares/validators/skillValidators';
 
import { param } from 'express-validator';

const router = express.Router();

// Création de compétences (Admin, potentiellement Mentor)
router.post('/', protect, authorize(['admin', 'mentor']), createOrUpdateSkillValidator, createSkill);

// Liste et détail des compétences (accessible à tous les utilisateurs connectés, ou public)
router.get('/', getAllSkills); // Ou protect si besoin
router.get('/:skillId', skillIdParamValidator, getSkillById); // Ou protect si besoin

// Mise à jour et suppression (Admin seulement)
router.put('/:skillId', protect, authorize(['admin']), skillIdParamValidator, createOrUpdateSkillValidator, updateSkill);
/*router.delete('/:skillId', protect, authorize(['admin']), skillIdParamValidator, deleteSkill);*/
router.delete(
  '/skills/:skillId',
   // Optional authentication
  deleteSkillValidator,
  deleteSkill
);
router.put(
  '/skills/:skillId',
  updateSkillValidator, // Middleware de validation
  updateSkill // Contrôleur
);

export default router;
