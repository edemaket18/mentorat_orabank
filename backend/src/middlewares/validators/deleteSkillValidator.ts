import { param } from 'express-validator';
import Skill from '../../models/Skill';

/**
 * Validates skill deletion request
 * - Checks if skillId is a valid MongoDB ID
 * - Optionally verifies user permissions (if needed)
 */
export const deleteSkillValidator = [
  param('skillId')
    .isMongoId()
    .withMessage('Invalid skill ID format')
    
    // Optional: Check if skill exists (via database query)
    .custom(async (skillId) => {
      const skill = await Skill.findById(skillId);
      if (!skill) throw new Error('Skill not found');
      return true;
    })
    
    // Optional: Verify user has deletion rights
    .custom(async (skillId, { req }) => {
      if (!req.user.isAdmin) {
        throw new Error('Only admins can delete skills');
      }
      return true;
    })
];