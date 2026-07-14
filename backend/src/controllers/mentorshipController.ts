import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import express from 'express';

import Mentorship from '../models/Mentorship';
import User from '../models/User';
import MentorshipRequest from '../models/MentorshipRequest';
import MentorshipMatch from '../models/MentorshipMatch';

 
 

 // @desc    Créer une demande de mentorat
// @route   POST /api/mentorships
// @access  Private (Stagiaire ou Admin/Mentor pour un stagiaire)
export const createMentorshipRequest = async (req: Request, res: Response, next: NextFunction) => {
  const { mentorId, objectives } = req.body;
  const menteeId = req.user?.role === 'stagiaire' ? req.user?._id : req.body.menteeId;

  if (!menteeId) {
    return res.status(400).json({ message: "ID du stagiaire manquant." });
  }

  try {
    const mentor = await User.findById(mentorId);
    const mentee = await User.findById(menteeId);

    if (!mentor || mentor.role !== 'mentor') {
      return res.status(404).json({ message: 'Mentor non trouvé ou utilisateur non mentor.' });
    }
    if (!mentee || mentee.role !== 'stagiaire') {
      return res.status(404).json({ message: 'Stagiaire non trouvé ou utilisateur non stagiaire.' });
    }

    if (mentor._id.equals(mentee._id)) {
      return res.status(400).json({ message: 'Un utilisateur ne peut pas se mentorer lui-même.' });
    }

    const existingMentorship = await MentorshipRequest.findOne({
      mentor: mentorId,
      mentee: menteeId,
      status: { $in: ['pending', 'accepted', 'rejected'] },
    });

    if (existingMentorship) {
      return res.status(400).json({ message: 'Une demande de mentorat est déjà en cours ou active avec ce mentor.' });
    }

    // Création
    const newRequest = await MentorshipRequest.create({
      mentor: mentorId,
      mentee: menteeId,
      requestedBy: req.user._id,
      objectives,
      status: 'pending',
      requestedAt: new Date()
    });

    // Population
    const populatedMentorship = await MentorshipRequest.findById(newRequest._id)
      .populate('mentor', 'firstName lastName email')
      .populate('mentee', 'firstName lastName email')
      .populate('requestedBy', 'firstName lastName email');

    if (!populatedMentorship) {
      return res.status(404).json({ message: 'Mentorat introuvable après création.' });
    }

    return res.status(201).json(populatedMentorship);

  } catch (error) {
    next(error);
  }
};


// @desc    Obtenir tous les mentorats
// @route   GET /api/mentorships
// @access  Private
export const getMyMentorships = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let query = {};
    if (req.user?.role === 'stagiaire') {
      query = { mentee: req.user?._id };
    } else if (req.user?.role === 'mentor') {
      query = { mentor: req.user?._id };
    }

    const mentorships = await MentorshipRequest.find(query)
      .populate('mentor', 'firstName lastName email avatar')
      .populate('mentee', 'firstName lastName email avatar')
      .populate('requestedBy', 'firstName lastName email')
      .sort({ createdAt: -1 });

    res.json(mentorships);
  } catch (error) {
    next(error);
  }
};

// @desc    Obtenir un mentorat par son ID
// @route   GET /api/mentorships/:mentorshipId
// @access  Private
export const getMentorshipById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const mentorship = await MentorshipRequest.findById(req.params.mentorshipId)
      .populate('mentor', 'firstName lastName email avatar')
      .populate('mentee', 'firstName lastName email avatar')
      .populate('requestedBy', 'firstName lastName email');

    if (!mentorship) {
      return res.status(404).json({ message: 'Mentorat non trouvé.' });
    }

    const userId = req.user?._id.toString();
    if (req.user?.role !== 'admin' && userId !== mentorship.mentor.toString() && userId !== mentorship.mentee.toString()) {
      return res.status(403).json({ message: 'Accès non autorisé à ce mentorat.' });
    }

    res.json(mentorship);
  } catch (error) {
    if (error instanceof Error && error.name === 'CastError') {
      return res.status(400).json({ message: 'ID de mentorat invalide' });
    }
    next(error);
  }
};

// @desc    Mettre à jour le statut d'un mentorat
// @route   PUT /api/mentorships/:mentorshipId/status
// @access  Private
 export const updateMentorshipStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { mentorshipId } = req.params;
    const { status } = req.body; // 'active', 'completed', 'cancelled', etc.

    const mentorship = await MentorshipMatch.findById(mentorshipId);
    if (!mentorship) {
      return res.status(404).json({ message: 'Mentorat non trouvé.' });
    }

    // Exemple de logique métier
    if (mentorship.status === 'pending' && status === 'active') {
      mentorship.status = 'active';
      mentorship.startedAt = new Date();
    } else if (mentorship.status === 'active' && status === 'completed') {
      mentorship.status = 'completed';
      mentorship.endedAt = new Date();
    } else if (['pending', 'active'].includes(mentorship.status) && status === 'cancelled') {
      mentorship.status = 'cancelled';
      mentorship.endedAt = new Date();
    } else {
      return res.status(400).json({ message: 'Changement de statut invalide ou non autorisé.' });
    }

    await mentorship.save();
    return res.json(mentorship);

  } catch (error) {
    next(error);
  }
};


// @desc    Supprimer un mentorat
// @route   DELETE /api/mentorships/:mentorshipId
// @access  Private
export const deleteMentorship = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const mentorship = await MentorshipRequest.findById(req.params.mentorshipId);

    if (!mentorship) {
      return res.status(404).json({ message: 'Mentorat non trouvé.' });
    }

    const userId = req.user?._id.toString();
    if (req.user?.role !== 'admin' && userId !== mentorship.mentor.toString() && userId !== mentorship.mentee.toString()) {
      return res.status(403).json({ message: 'Accès non autorisé à ce mentorat.' });
    }

    await mentorship.deleteOne();
    res.json({ message: 'Mentorat supprimé avec succès.' });
  } catch (error) {
    if (error instanceof Error && error.name === 'CastError') {
      return res.status(400).json({ message: 'ID de mentorat invalide' });
    }
    next(error);
  }
};

// @desc    Ajouter un feedback à un mentorat terminé
export const addMentorshipFeedback = async (req: Request, res: Response, next: NextFunction) => {
  const { feedback } = req.body;
  const { mentorshipId } = req.params;

  try {
    const mentorship = await MentorshipMatch.findById( mentorshipId);

    if (!mentorship) {
      return res.status(404).json({ message: 'Mentorat non trouvé.' });
    }

    if (mentorship.status !== 'completed') {
      return res.status(400).json({ message: 'Le mentorat doit être terminé pour ajouter un feedback.' });
    }

   mentorship.feedback = feedback;
    await mentorship.save();

    return res.json({ message: 'Feedback ajouté avec succès.', mentorship });

  } catch (error) {
    if (error instanceof Error && (error as any).name === 'CastError') {
      return res.status(400).json({ message: 'ID de mentorat invalide.' });
    }
    next(error);
  }
};


// @desc    Ajouter un progrès à un mentorat actif
export const addMentorshipProgress = async (req: Request, res: Response, next: NextFunction) => {
  const { mentorshipId, progress } = req.body;

  try {
    const mentorship = await MentorshipMatch.findById(mentorshipId);

    if (!mentorship) {
      return res.status(404).json({ message: 'Mentorat non trouvé.' });
    }

    if (mentorship.status !== 'active') {
      return res.status(400).json({ message: 'Le mentorat doit être actif pour ajouter des progrès.' });
    }

    mentorship.progress = progress ;
    await mentorship.save();

    res.json({ message: 'Progrès ajouté avec succès.', mentorship });
  } catch (error) {
    if (error instanceof Error && error.name === 'CastError') {
      return res.status(400).json({ message: 'ID de mentorat invalide' });
    }
    next(error);
  }
};

// @desc    Voir les demandes reçues par le mentor
export const getRequestsForMentor = async (req: Request, res: Response) => {
  try {
    const requests = await MentorshipRequest.find({ mentor: req.user._id })
      .populate('mentee', 'firstName lastName email');
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// @desc    Répondre à une demande de mentorat
export const respondToRequest = async (req: Request, res: Response) => {
  const { requestId } = req.params;
  const { action } = req.body;

  if (!['accepted', 'rejected'].includes(action)) {
    return res.status(400).json({ message: 'Action invalide' });
  }

  try {
    const request = await MentorshipRequest.findById(requestId);
    if (!request) return res.status(404).json({ message: 'Demande introuvable' });

    request.status = action;
    await request.save();
    res.json(request);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// @desc    Voir les demandes envoyées par le stagiaire
export const getMyRequests = async (req: Request, res: Response) => {
  try {
    const requests = await MentorshipRequest.find({ mentee: req.user._id })
      .populate('mentor', 'firstName lastName email');
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Export du contrôleur
export const mentorshipController = {
  createMentorshipRequest,
  getMyMentorships,
  getMentorshipById,
  updateMentorshipStatus,
  deleteMentorship,
  addMentorshipFeedback,
  addMentorshipProgress,
  getRequestsForMentor,
  respondToRequest,
  getMyRequests,
};

export default mentorshipController;


