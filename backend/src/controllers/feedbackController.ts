import { Request, Response, NextFunction } from 'express';
import Feedback from '../models/Feedback';

// @desc    Envoyer un retour utilisateur
// @route   POST /api/feedback
// @access  Private (tout utilisateur connecté)
export const createFeedback = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { message } = req.body;
    if (!message || !message.trim()) {
      return res.status(400).json({ message: 'Le message est requis.' });
    }
    const feedback = await Feedback.create({ author: req.users?._id, message });
    res.status(201).json(feedback);
  } catch (error) {
    next(error);
  }
};

// @desc    Voir tous les retours utilisateurs
// @route   GET /api/feedback
// @access  Private (admin, rh)
export const getAllFeedback = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const feedbacks = await Feedback.find()
      .populate('author', 'firstName lastName role')
      .sort({ createdAt: -1 });

    const formatted = feedbacks.map((fb) => {
      const plain: any = fb.toObject();
      const author: any = plain.author;
      return {
        ...plain,
        author: author ? { ...author, name: `${author.firstName ?? ''} ${author.lastName ?? ''}`.trim() } : author,
      };
    });

    res.json(formatted);
  } catch (error) {
    next(error);
  }
};