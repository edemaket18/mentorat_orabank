import { Request, Response, NextFunction } from 'express';
import MentorshipMatch from '../models/MentorshipMatch';
import Report from '../models/Report';
import User from '../models/User';

const formatUser = (user: any) =>
  user ? { _id: user._id, name: `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim(), email: user.email } : null;

// @desc    Stagiaires actuellement suivis (mentorats actifs) par le mentor connecté
// @route   GET /api/mentors/me/interns
// @access  Private (mentor)
export const getMyInterns = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const matches = await MentorshipMatch.find({ mentorId: req.users?._id, status: 'active' })
      .populate('menteeId', 'firstName lastName email');

    res.json(
      matches.map((m: any) => ({
        matchId: m._id,
        intern: formatUser(m.menteeId),
        startedAt: m.startedAt,
        goals: m.goals ?? [],
        progress: m.progress ?? '',
      }))
    );
  } catch (error) {
    next(error);
  }
};

// @desc    Tous les mentorats (tous statuts) du mentor connecté
// @route   GET /api/mentors/me/mentorships
// @access  Private (mentor)
export const getMyMentorships = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const matches = await MentorshipMatch.find({ mentorId: req.users?._id })
      .populate('menteeId', 'firstName lastName email')
      .sort({ createdAt: -1 });

    res.json(
      matches.map((m: any) => ({
        _id: m._id,
        intern: formatUser(m.menteeId),
        status: m.status,
        startedAt: m.startedAt,
        endedAt: m.endedAt,
      }))
    );
  } catch (error) {
    next(error);
  }
};

// @desc    Clore un mentorat
// @route   PATCH /api/mentors/me/mentorships/:id/end
// @access  Private (mentor)
export const endMentorship = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const match = await MentorshipMatch.findOneAndUpdate(
      { _id: req.params.id, mentorId: req.users?._id },
      { status: 'completed', endedAt: new Date() },
      { new: true }
    );
    if (!match) return res.status(404).json({ message: 'Mentorat introuvable.' });
    res.json(match);
  } catch (error) {
    next(error);
  }
};

// @desc    Mentorats terminés/annulés (départs) du mentor connecté
// @route   GET /api/mentors/me/departures
// @access  Private (mentor)
export const getMyDepartures = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const matches = await MentorshipMatch.find({
      mentorId: req.users?._id,
      status: { $in: ['completed', 'cancelled'] },
    })
      .populate('menteeId', 'firstName lastName email')
      .sort({ endedAt: -1 });

    res.json(
      matches.map((m: any) => ({
        _id: m._id,
        intern: formatUser(m.menteeId),
        status: m.status,
        startedAt: m.startedAt,
        endedAt: m.endedAt,
      }))
    );
  } catch (error) {
    next(error);
  }
};

// @desc    Stagiaires disponibles (sans mentorat actif) pouvant être pris en charge
// @route   GET /api/mentors/me/candidates
// @access  Private (mentor)
export const getAvailableCandidates = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const activeMatches = await MentorshipMatch.find({ status: 'active' }).select('menteeId');
    const assignedIds = activeMatches.map((m) => m.menteeId);

    const candidates = await User.find({ role: 'stagiaire', _id: { $nin: assignedIds } })
      .select('firstName lastName email department university');

    res.json(
      candidates.map((c: any) => ({
        _id: c._id,
        name: `${c.firstName ?? ''} ${c.lastName ?? ''}`.trim(),
        email: c.email,
        department: c.department,
        university: c.university,
      }))
    );
  } catch (error) {
    next(error);
  }
};

// @desc    Rapports de stage soumis par les stagiaires suivis par le mentor connecté
// @route   GET /api/mentors/me/reports
// @access  Private (mentor)
export const getMyMentorReports = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const matches = await MentorshipMatch.find({ mentorId: req.users?._id }).select('menteeId');
    const menteeIds = matches.map((m) => m.menteeId);

    const reports = await Report.find({ mentee: { $in: menteeIds } })
      .populate('mentee', 'firstName lastName email')
      .sort({ createdAt: -1 });

    res.json(
      reports.map((r: any) => ({
        _id: r._id,
        title: r.title,
        status: r.status,
        createdAt: r.createdAt,
        intern: formatUser(r.mentee),
      }))
    );
  } catch (error) {
    next(error);
  }
};