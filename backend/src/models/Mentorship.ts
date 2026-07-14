import express from 'express';
import MentorshipRequest from '../models/MentorshipRequest';
import MentorshipMatch from '../models/MentorshipMatch';
import { authMiddleware } from '../middlewares/authMiddleware';
import { Request, Response } from 'express';

// Extend Express Request interface to include 'user'
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

/*
export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string;
  role: 'stagiaire' | 'mentor' | 'admin';
  createdAt?: Date;
  updatedAt?: Date;
  __v?: number;
  password?: string; // Optional for security reasons
  isActive?: boolean; // Optional for user status
  isVerified?: boolean; // Optional for email verification
  isBanned?: boolean; // Optional for user ban status
  isDeleted?: boolean; // Optional for soft delete status
  lastLogin?: Date; // Optional for tracking last login time
  bio?: string; // Optional for user biography
  skills?: string[]; // Optional for user skills
  interests?: string[]; // Optional for user interests
  location?: string; // Optional for user location
  phone?: string; // Optional for user phone number
  website?: string; // Optional for user website
  socialLinks?: {
    linkedin?: string;
    github?: string;
    twitter?: string;
  };
}

export interface MentorshipRequest {
  _id: string;
  menteeId: string; // ID of the mentee (User)
  mentorId: string; // ID of the mentor (User)
  message: string; // Message from the mentee to the mentor

}

export interface MentorshipMatch {
  _id: string;
  menteeId: string; // ID of the mentee (User)
  mentorId: string; // ID of the mentor (User)
  status: 'pending' | 'active' | 'completed'; // Status of the mentorship match
  goals?: string[]; // Array of goals or objectives for the mentorship
  createdAt?: Date; // Timestamp when the match was created
  updatedAt?: Date; // Timestamp when the match was last updated
  startDate?: Date;
  endDate?: Date;

}

*/

const router = express.Router();

/**
 * ✅ Envoyer une demande de mentorat (stagiaire)
 */
router.post('/requests', authMiddleware, async (req, res) => {
  const { mentorId, message } = req.body;
  const menteeId = req.user._id;

  try {
    const existing = await MentorshipMatch.findOne({ menteeId, mentorId, status: { $in: ['active', 'completed', 'cancelled', 'pending' ] }  });
    if (existing) return res.status(400).json({ error: 'Demande déjà envoyée.' });

    const request = await MentorshipRequest.create({ menteeId, mentorId, message });
    res.status(201).json(request);
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de l\'envoi de la demande.' });
  }
    const request = await MentorshipRequest.validate({  menteeId, mentorId, message  });
    res.status(0).json({ error:  ' Erreur lors de la sauveg'})
});

/**
 * ✅ Voir les demandes reçues (pour mentor)
 */
router.get('/requests', authMiddleware, async (req, res) => {
  const mentorId = req.user._id;
  try {
    const requests = await MentorshipRequest.find({ mentorId, status: 'pending' })
      .populate('menteeId', 'firstName lastName avatar email');
    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la récupération des demandes.' });
  }
});

/**
 * ✅ Répondre à une demande (mentor)
 */
router.patch('/requests/:id', authMiddleware, async (req, res) => {
  const { status } = req.body;
  try {
    const request = await MentorshipRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ error: 'Demande introuvable.' });
    if (request.mentor.toString() !== req.user._id.toString()) return res.status(403).json({ error: 'Non autorisé.' });

    request.status = status;
    await request.save();

    if (status === 'accepted') {
      await MentorshipMatch.create({
        menteeId: request.mentee,
        mentorId: request.mentor,
        goals: []
      });
    }

    res.json({ message: 'Réponse enregistrée.', status });
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la réponse à la demande.' });
  }
});

/**
 * ✅ Annuler une demande de mentorat (stagiaire)
 */
router.delete('/requests/:id', authMiddleware, async (req, res) => {
  const requestId = req.params.id;
  try {
    const request = await MentorshipRequest.findById(requestId);
    if (!request) return res.status(404).json({ error: 'Demande introuvable.' });

    if (request.mentee.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Accès refusé.' });
    }

    await request.deleteOne();
    res.json({ message: 'Demande annulée.' });
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de l\'annulation de la demande.' });
  }
});





/**
 * ✅ Voir les demandes envoyées (stagiaire)
 */
router.get('/my-requests', authMiddleware, async (req, res) => {
  const menteeId = req.user._id;
  try {
    const requests = await MentorshipRequest.find({ menteeId })
      .populate('mentorId', 'firstName lastName avatar email status');
    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la récupération des demandes.' });
  }
});

/**
 * ✅ Voir les matchs de mentorat (stagiaire)
 */
router.get('/my-matches', authMiddleware, async (req, res) => {
  const menteeId = req.user._id;
  try {
    const matches = await MentorshipMatch.find({ menteeId })
      .populate('mentorId', 'firstName lastName avatar email')
      .populate('menteeId', 'firstName lastName avatar email');
    res.json(matches);
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la récupération des matchs.' });
  }
});

/**
 * ✅ Voir les matchs de mentorat (mentor)
 */
router.get('/my-mentorships', authMiddleware, async (req, res) => {
  const mentorId = req.user._id;
  try {
    const matches = await MentorshipMatch.find({ mentorId })
      .populate('mentorId', 'firstName lastName avatar email')
      .populate('menteeId', 'firstName lastName avatar email');
    res.json(matches);
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la récupération des matchs.' });
  }
});

/**
 * ✅ Terminer un match de mentorat (mentor ou stagiaire)
 */
router.post('/matches/:id/complete', authMiddleware, async (req, res) => {
  const matchId = req.params.id;
  try {
    const match = await MentorshipMatch.findById(matchId);
    if (!match) return res.status(404).json({ error: 'Match introuvable.' });

    if (match.menteeId.toString() !== req.user._id.toString() && match.mentorId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Accès refusé.' });
    }

    match.status = 'completed';
    await match.save();

    res.json({ message: 'Match terminé.', match });
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la terminaison du match.' });
  }
});

/**
 * ✅ Supprimer un match de mentorat (mentor ou stagiaire)
 */
router.delete('/matches/:id', authMiddleware, async (req, res) => {
  const matchId = req.params.id;
  try {
    const match = await MentorshipMatch.findById(matchId);
    if (!match) return res.status(404).json({ error: 'Match introuvable.' });

    if (match.menteeId.toString() !== req.user._id.toString() && match.mentorId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Accès refusé.' });
    }

    await match.deleteOne();
    res.json({ message: 'Match supprimé.' });
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la suppression du match.' });
  }
});

/**
 * ✅ Voir les détails d'un match de mentorat (mentor ou stagiaire)
 */
router.get('/matches/:id', authMiddleware, async (req, res) => {
  const matchId = req.params.id;
  try {
    const match = await MentorshipMatch.findById(matchId)
      .populate('mentorId', 'firstName lastName avatar email')
      .populate('menteeId', 'firstName lastName avatar email');

    if (!match) return res.status(404).json({ error: 'Match introuvable.' });

    if (match.menteeId.toString() !== req.user._id.toString() && match.mentorId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Accès refusé.' });
    }

    res.json(match);
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la récupération du match.' });
  }
});

/**
 * ✅ Valider une étape de mentorat (mentor)
 */
router.post('/validate-stage/:userId', authMiddleware, async (req, res) => {
  const { userId } = req.params;
  const { stage } = req.body;

  if (!stage) return res.status(400).json({ error: 'Étape requise.' });

  try {
    const match = await MentorshipMatch.findOne({ menteeId: userId, mentorId: req.user._id });
    if (!match) return res.status(404).json({ error: 'Mentorat introuvable.' });

    match.goals.push(stage);
    await match.save();

    res.json({ message: 'Étape validée.', goals: match.goals });
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la validation de l\'étape.' });
  }
});

/**
 * ✅ Voir les étapes validées (mentor)
 */
router.get('/stages/:userId', authMiddleware, async (req, res) => {
  const { userId } = req.params;

  try {
    const match = await MentorshipMatch.findOne({ menteeId: userId, mentorId: req.user._id });
    if (!match) return res.status(404).json({ error: 'Mentorat introuvable.' });

    res.json(match.goals);
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la récupération des étapes.' });
  }
});

/**
 * ✅ Voir les détails d'une demande de mentorat (stagiaire)
 */

/**
 * ✅ Voir tous les matchs de mentorat (admin)
 */
router.get('/admin/matches', authMiddleware, async (req, res) => {
  try {
    const matches = await MentorshipMatch.find()
      .populate('mentorId', 'firstName lastName avatar email')
      .populate('menteeId', 'firstName lastName avatar email');
    res.json(matches);
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la récupération des matchs.' });
  }
});

/**
 * ✅ Voir toutes les demandes de mentorat (admin)
 */
router.get('/admin/requests', authMiddleware, async (req, res) => {
  try {
    const requests = await MentorshipRequest.find()
      .populate('mentorId', 'firstName lastName avatar email')
      .populate('menteeId', 'firstName lastName avatar email');
    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la récupération des demandes.' });
  }
});

/**
 * ✅ Supprimer une demande de mentorat (admin)
 */
router.delete('/admin/requests/:id', authMiddleware, async (req, res) => {
  const requestId = req.params.id;
  try {
    const request = await MentorshipRequest.findById(requestId);
    if (!request) return res.status(404).json({ error: 'Demande introuvable.' });

    await request.deleteOne();
    res.json({ message: 'Demande supprimée.' });
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la suppression de la demande.' });
  }
});

/**
 * ✅ Terminer un match de mentorat (admin)
 */
router.post('/admin/matches/:id/complete', authMiddleware, async (req, res) => {
  const matchId = req.params.id;
  try {
    const match = await MentorshipMatch.findById(matchId);
    if (!match) return res.status(404).json({ error: 'Match introuvable.' });

    match.status = 'completed';
    await match.save();

    res.json({ message: 'Match terminé.', match });
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la terminaison du match.' });
  }
});

/**
 * ✅ Supprimer un match de mentorat (admin)
 */
router.delete('/admin/matches/:id', authMiddleware, async (req, res) => {
  const matchId = req.params.id;
  try {
    const match = await MentorshipMatch.findById(matchId);
    if (!match) return res.status(404).json({ error: 'Match introuvable.' });

    await match.deleteOne();
    res.json({ message: 'Match supprimé.' });
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la suppression du match.' });
  }
});

/**
 * ✅ Voir les détails d'un match de mentorat (admin)
 */
router.get('/admin/matches/:id', authMiddleware, async (req, res) => {
  const matchId = req.params.id;
  try {
    const match = await MentorshipMatch.findById(matchId)
      .populate('mentorId', 'firstName lastName avatar email')
      .populate('menteeId', 'firstName lastName avatar email');

    if (!match) return res.status(404).json({ error: 'Match introuvable.' });

    res.json(match);
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la récupération du match.' });
  }
});

//     Ajouter un feedback à un mentorat terminé


// Export du router
export default router;
