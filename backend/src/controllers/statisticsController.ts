import { Request, Response, NextFunction } from 'express';
import User from '../models/User';
import MentorshipMatch from '../models/MentorshipMatch';
import Report from '../models/Report';
import Feedback from '../models/Feedback';

// @desc    Statistiques globales pour l'espace RH
// @route   GET /api/rh/statistics
// @access  Private (rh, admin)
export const getRHStatistics = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const [interns, mentors, activeMentorships, completedReports] = await Promise.all([
      User.countDocuments({ role: 'stagiaire' }),
      User.countDocuments({ role: 'mentor' }),
      MentorshipMatch.countDocuments({ status: 'active' }),
      Report.countDocuments({ status: 'validated' }),
    ]);

    res.json({ interns, mentors, activeMentorships, completedReports });
  } catch (error) {
    next(error);
  }
};

// @desc    Statistiques du mentor connecté
// @route   GET /api/mentors/me/statistics
// @access  Private (mentor)
export const getMentorStatistics = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const mentorId = req.users?._id;

    const [activeInterns, completedMentorships, feedbackGiven] = await Promise.all([
      MentorshipMatch.countDocuments({ mentorId, status: 'active' }),
      MentorshipMatch.countDocuments({ mentorId, status: 'completed' }),
      Feedback.countDocuments({ author: mentorId }),
    ]);

    res.json({ activeInterns, completedMentorships, feedbackGiven });
  } catch (error) {
    next(error);
  }
};

// @desc    Statistiques du stagiaire connecté
// @route   GET /api/intern/statistics
// @access  Private (stagiaire)
// NB: totalHours et evaluations (score par mois) ne sont pas encore suivis
// dans le modèle de données — retournés à 0/vide plutôt qu'inventés.
export const getInternStatisticsController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const internId = req.users?._id;

    const [totalReports, totalMentorships] = await Promise.all([
      Report.countDocuments({ mentee: internId }),
      MentorshipMatch.countDocuments({ menteeId: internId }),
    ]);

    res.json({
      totalReports,
      totalMentorships,
      totalHours: 0,
      evaluations: [],
    });
  } catch (error) {
    next(error);
  }
};