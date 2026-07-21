import { Request, Response, NextFunction } from 'express';
import MentorshipMatch from '../models/MentorshipMatch';

const formatMentorshipForAdmin = (m: any) => {
  const statusMap: Record<string, 'en cours' | 'terminé' | 'en attente'> = {
    active: 'en cours',
    completed: 'terminé',
    cancelled: 'terminé',
    pending: 'en attente',
  };
  const mentor = m.mentorId;
  const intern = m.menteeId;
  const mentorName = mentor ? `${mentor.firstName ?? ''} ${mentor.lastName ?? ''}`.trim() : 'Inconnu';
  const internName = intern ? `${intern.firstName ?? ''} ${intern.lastName ?? ''}`.trim() : 'Inconnu';

  return {
    _id: m._id,
    mentor: { _id: mentor?._id ?? '', name: mentorName, fullName: mentorName },
    intern: { _id: intern?._id ?? '', name: internName, fullName: internName },
    status: statusMap[m.status] ?? 'en attente',
    startDate: m.startedAt,
    endDate: m.endedAt,
  };
};

// @desc    Tous les accompagnements (vue RH/Admin)
// @route   GET /api/mentorships/all
// @access  Private (rh, admin)
export const getAllMentorshipsForAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const matches = await MentorshipMatch.find()
      .populate('mentorId', 'firstName lastName')
      .populate('menteeId', 'firstName lastName')
      .sort({ createdAt: -1 });
    res.json(matches.map(formatMentorshipForAdmin));
  } catch (error) {
    next(error);
  }
};

// @desc    Clore un accompagnement (vue RH)
// @route   PUT /api/mentorships/:id/end
// @access  Private (rh, admin)
export const endMentorshipAsRH = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const match = await MentorshipMatch.findByIdAndUpdate(
      req.params.id,
      { status: 'completed', endedAt: new Date() },
      { new: true }
    );
    if (!match) return res.status(404).json({ message: 'Accompagnement introuvable.' });
    res.json(match);
  } catch (error) {
    next(error);
  }
};

// @desc    Supprimer un accompagnement (vue Admin)
// @route   DELETE /api/admin/mentorships/:id
// @access  Private (admin)
export const deleteMentorshipAsAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const match = await MentorshipMatch.findByIdAndDelete(req.params.id);
    if (!match) return res.status(404).json({ message: 'Accompagnement introuvable.' });
    res.json({ message: 'Accompagnement supprimé.' });
  } catch (error) {
    next(error);
  }
};
// @desc    Tous les matchings mentor/stagiaire (vue RH)
// @route   GET /api/matching/all
// @access  Private (rh, admin)
export const getAllMatchings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const matches = await MentorshipMatch.find()
      .populate('mentorId', 'firstName lastName')
      .populate('menteeId', 'firstName lastName')
      .sort({ createdAt: -1 });

    res.json(
      matches.map((m: any) => ({
        _id: m._id,
        mentor: m.mentorId
          ? { _id: m.mentorId._id, name: `${m.mentorId.firstName ?? ''} ${m.mentorId.lastName ?? ''}`.trim() }
          : { _id: '', name: 'Inconnu' },
        intern: m.menteeId
          ? { _id: m.menteeId._id, name: `${m.menteeId.firstName ?? ''} ${m.menteeId.lastName ?? ''}`.trim() }
          : { _id: '', name: 'Inconnu' },
        status: m.status,
      }))
    );
  } catch (error) {
    next(error);
  }
};