import { Request, Response, NextFunction } from 'express';
import MentorshipMatch from '../models/MentorshipMatch';
import MentorMessage from '../models/MentorMessage';

const getActiveMatchForUser = async (userId: string) => {
  return MentorshipMatch.findOne({
    status: 'active',
    $or: [{ menteeId: userId }, { mentorId: userId }],
  });
};

// Résout le mentorat concerné : un stagiaire n'en a qu'un seul actif à la
// fois (comportement historique), mais un mentor peut suivre plusieurs
// stagiaires — dans ce cas, un matchId explicite précise la conversation.
const resolveMatch = async (req: Request) => {
  const matchId = (req.query.matchId as string) || (req.body?.matchId as string);
  if (matchId) {
    return MentorshipMatch.findOne({
      _id: matchId,
      status: 'active',
      $or: [{ menteeId: req.users?._id }, { mentorId: req.users?._id }],
    });
  }
  return getActiveMatchForUser(req.users?._id);
};

// @desc    Messages échangés dans un mentorat actif (le sien pour un
//          stagiaire, ou celui précisé par ?matchId= pour un mentor)
// @route   GET /api/intern/messages  |  GET /api/mentors/me/messages
// @access  Private (stagiaire, mentor)
export const getMyMessages = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const match = await resolveMatch(req);
    if (!match) return res.json([]);

    const messages = await MentorMessage.find({ mentorshipMatch: match._id }).sort({ createdAt: 1 });

    res.json(
      messages.map((m: any) => ({
        from: String(m.sender) === String(req.users?._id) ? 'me' : 'mentor',
        content: m.content,
        timestamp: m.createdAt,
      }))
    );
  } catch (error) {
    next(error);
  }
};

// @desc    Envoyer un message (mentorat actif du stagiaire, ou matchId
//          précisé dans le corps pour un mentor)
// @route   POST /api/intern/messages  |  POST /api/mentors/me/messages
// @access  Private (stagiaire, mentor)
export const sendMessage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { content } = req.body;
    if (!content || !content.trim()) return res.status(400).json({ message: 'Message vide.' });

    const match = await resolveMatch(req);
    if (!match) return res.status(404).json({ message: 'Aucun mentorat actif.' });

    const message = await MentorMessage.create({
      mentorshipMatch: match._id,
      sender: req.users?._id,
      content,
    });

    res.status(201).json({ from: 'me', content: message.content, timestamp: message.createdAt });
  } catch (error) {
    next(error);
  }
};