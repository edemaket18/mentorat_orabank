import express from 'express';
import {
  createExperience,
  getAllExperiences,
  getExperienceById,
  updateExperience,
  deleteExperience,
} from '../controllers/experienceShareController';
import { protect, adminOrMentorOrTrainee } from '../middlewares/authMiddleware';

const router = express.Router();

// @route   POST /api/experiences
// @desc    Créer une nouvelle expérience
// @access  Private (Stagiaires, Mentors, Admins)
router.post('/', protect, adminOrMentorOrTrainee, createExperience);

// @route   GET /api/experiences
// @desc    Obtenir toutes les expériences
// @access  Public
router.get('/', getAllExperiences);

// @route   GET /api/experiences/:experienceId
// @desc    Obtenir une expérience par ID
// @access  Public
router.get('/:experienceId', getExperienceById);

// @route   PUT /api/experiences/:experienceId
// @desc    Mettre à jour une expérience
// @access  Private (Auteur ou Admin)
router.put('/:experienceId', protect, adminOrMentorOrTrainee, updateExperience);

// @route   DELETE /api/experiences/:experienceId
// @desc    Supprimer une expérience
// @access  Private (Auteur ou Admin)
router.delete('/:experienceId', protect, adminOrMentorOrTrainee, deleteExperience);

export default router;
