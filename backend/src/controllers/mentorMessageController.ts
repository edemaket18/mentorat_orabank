import { Request, Response, NextFunction } from 'express';
import MentorshipMatch from '../models/MentorshipMatch';
import MentorMessage from '../models/MentorMessage';

const getActiveMatchForUser = async (userId: any) => {
  return MentorshipMatch.findOne({
    status: 'active',
    $or: [{ menteeId: userId }, { mentorId: userId }],
  });
};

// @desc    Messages échangés avec le mentor/stagiaire du mentorat actif
// @route   GET /api/intern/messages  |  GET /api/mentors/me/messages/:matchId
// @access  Private (stagiaire, mentor)
export const getMyMessages = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const match = await getActiveMatchForUser(req.users?._id);
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

// @desc    Envoyer un message dans le mentorat actif
// @route   POST /api/intern/messages
// @access  Private (stagiaire, mentor)
export const sendMessage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { content } = req.body;
    if (!content || !content.trim()) return res.status(400).json({ message: 'Message vide.' });

    const match = await getActiveMatchForUser(req.users?._id);
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