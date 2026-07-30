import { Request, Response, NextFunction } from 'express';
import Session from '../models/Session';
import MentorshipMatch from '../models/MentorshipMatch';

const formatUser = (user: any) =>
  user ? { _id: user._id, name: `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim(), email: user.email } : null;

const formatSession = (s: any) => ({
  _id: s._id,
  mentor: formatUser(s.mentor),
  mentee: formatUser(s.mentee),
  scheduledAt: s.scheduledAt,
  durationMinutes: s.durationMinutes,
  notes: s.notes,
  status: s.status,
});

// @desc    Sessions du mentor connecté
// @route   GET /api/mentors/me/sessions
// @access  Private (mentor)
export const getMentorSessions = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const sessions = await Session.find({ mentor: req.users?._id })
      .populate('mentor', 'firstName lastName email')
      .populate('mentee', 'firstName lastName email')
      .sort({ scheduledAt: -1 });
    res.json(sessions.map(formatSession));
  } catch (error) {
    next(error);
  }
};

// @desc    Sessions du stagiaire connecté
// @route   GET /api/intern/sessions
// @access  Private (stagiaire)
export const getInternSessions = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const sessions = await Session.find({ mentee: req.users?._id })
      .populate('mentor', 'firstName lastName email')
      .populate('mentee', 'firstName lastName email')
      .sort({ scheduledAt: -1 });
    res.json(sessions.map(formatSession));
  } catch (error) {
    next(error);
  }
};

// @desc    Planifier une session avec un stagiaire suivi
// @route   POST /api/mentors/me/sessions
// @access  Private (mentor)
export const createSession = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { menteeId, scheduledAt, durationMinutes, notes } = req.body;

    if (!menteeId || !scheduledAt) {
      return res.status(400).json({ message: 'Stagiaire et date sont requis.' });
    }

    // On vérifie que ce stagiaire est bien suivi par ce mentor
    const match = await MentorshipMatch.findOne({ mentorId: req.users?._id, menteeId, status: 'active' });
    if (!match) {
      return res.status(403).json({ message: "Ce stagiaire n'est pas suivi par vous." });
    }

    const session = await Session.create({
      mentor: req.users?._id,
      mentee: menteeId,
      scheduledAt,
      durationMinutes: durationMinutes || 60,
      notes,
    });

    res.status(201).json(session);
  } catch (error) {
    next(error);
  }
};

// @desc    Mettre à jour le statut d'une session (terminée / annulée)
// @route   PATCH /api/mentors/me/sessions/:id/status
// @access  Private (mentor)
export const updateSessionStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { status } = req.body;
    if (!['scheduled', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({ message: 'Statut invalide.' });
    }

    const session = await Session.findOneAndUpdate(
      { _id: req.params.id, mentor: req.users?._id },
      { status },
      { new: true }
    );

    if (!session) return res.status(404).json({ message: 'Session introuvable.' });
    res.json(session);
  } catch (error) {
    next(error);
  }
};