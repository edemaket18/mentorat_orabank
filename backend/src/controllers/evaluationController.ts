import { Request, Response, NextFunction } from 'express';
import Evaluation from '../models/Evaluation';
import User from '../models/User';

// @desc    Liste des stagiaires à évaluer (RH : tous les stagiaires)
// @route   GET /api/rh/evaluations/stagiaires
// @access  Private (rh, admin)
export const getStagiairesForEvaluation = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const stagiaires = await User.find({ role: 'stagiaire' }).select('firstName lastName email department');
    res.json(
      stagiaires.map((s: any) => ({
        _id: s._id,
        name: `${s.firstName ?? ''} ${s.lastName ?? ''}`.trim(),
        email: s.email,
        department: s.department,
      }))
    );
  } catch (error) {
    next(error);
  }
};

// @desc    Soumettre une évaluation pour un stagiaire (RH)
// @route   POST /api/rh/evaluations/:id
// @access  Private (rh, admin)
export const submitEvaluation = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { note, score, comment } = req.body;
    const evaluation = await Evaluation.create({
      mentor: req.users?._id,
      intern: req.params.id,
      score: score ?? note,
      comment,
    });
    res.status(201).json(evaluation);
  } catch (error) {
    next(error);
  }
};

// @desc    Soumettre une évaluation pour un stagiaire (Mentor)
// @route   POST /api/mentors/me/evaluations
// @access  Private (mentor)
export const createEvaluationForMentor = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { intern, score, comment } = req.body;
    const evaluation = await Evaluation.create({ mentor: req.users?._id, intern, score, comment });
    res.status(201).json(evaluation);
  } catch (error) {
    next(error);
  }
};

// @desc    Évaluations déjà soumises par l'utilisateur connecté
// @route   GET /api/mentors/me/evaluations
// @access  Private (mentor, rh, admin)
export const getMyEvaluations = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const evaluations = await Evaluation.find({ mentor: req.users?._id })
      .populate('intern', 'firstName lastName email')
      .sort({ createdAt: -1 });

    res.json(
      evaluations.map((e: any) => ({
        _id: e._id,
        intern: e.intern
          ? { _id: e.intern._id, name: `${e.intern.firstName ?? ''} ${e.intern.lastName ?? ''}`.trim(), email: e.intern.email }
          : null,
        score: e.score,
        comment: e.comment,
        createdAt: e.createdAt,
      }))
    );
  } catch (error) {
    next(error);
  }
};