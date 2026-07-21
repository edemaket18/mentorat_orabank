import { Request, Response, NextFunction } from 'express';
import User from '../models/User';
import MentorshipMatch from '../models/MentorshipMatch';
import MentorshipRequest from '../models/MentorshipRequest';
import Report from '../models/Report';

const formatUser = (user: any) =>
  user ? { _id: user._id, name: `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim(), email: user.email } : null;

// @desc    Liste des mentors (pour le matching)
// @route   GET /api/intern/mentors
// @access  Private (stagiaire)
export const getMentorsForMatching = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const mentors = await User.find({ role: 'mentor' }).select('firstName lastName email bio department');

    const activeMatches = await MentorshipMatch.find({ status: 'active' }).select('mentorId');
    const busyMentorIds = new Set(activeMatches.map((m) => m.mentorId.toString()));

    const pendingRequests = await MentorshipRequest.find({ mentee: req.users?._id, status: 'pending' }).select('mentor');
    const requestedMentorIds = new Set(pendingRequests.map((r: any) => r.mentor.toString()));

    res.json(
      mentors.map((m: any) => ({
        id: m._id,
        name: `${m.firstName ?? ''} ${m.lastName ?? ''}`.trim(),
        expertise: m.bio ?? m.department ?? '',
        company: 'Orabank',
        available: !busyMentorIds.has(m._id.toString()),
        requested: requestedMentorIds.has(m._id.toString()),
      }))
    );
  } catch (error) {
    next(error);
  }
};

// @desc    Envoyer une demande de mentorat
// @route   POST /api/intern/matching-requests
// @access  Private (stagiaire)
export const requestMentor = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { mentorId } = req.body;
    if (!mentorId) return res.status(400).json({ message: 'mentorId requis.' });

    const existing = await MentorshipRequest.findOne({
      mentee: req.users?._id,
      mentor: mentorId,
      status: 'pending',
    });
    if (existing) return res.status(409).json({ message: 'Demande déjà envoyée.' });

    const request = await MentorshipRequest.create({ mentee: req.users?._id, mentor: mentorId });
    res.status(201).json(request);
  } catch (error) {
    next(error);
  }
};

// @desc    Résumé pour le tableau de bord du stagiaire connecté
// @route   GET /api/intern/dashboard
// @access  Private (stagiaire)
export const getInternDashboard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const activeMatch: any = await MentorshipMatch.findOne({
      menteeId: req.users?._id,
      status: 'active',
    }).populate('mentorId', 'firstName lastName email bio');

    const lastReport = await Report.findOne({ mentee: req.users?._id }).sort({ createdAt: -1 });

    res.json({
      name: `${req.users?.firstName ?? ''} ${req.users?.lastName ?? ''}`.trim(),
      currentMentor: activeMatch
        ? {
            id: activeMatch.mentorId?._id,
            name: `${activeMatch.mentorId?.firstName ?? ''} ${activeMatch.mentorId?.lastName ?? ''}`.trim(),
            expertise: activeMatch.mentorId?.bio ?? '',
            email: activeMatch.mentorId?.email,
            available: true,
          }
        : null,
      mentorshipProgress: activeMatch?.progress ? Number(activeMatch.progress) || 0 : 0,
      lastReport: lastReport
        ? { title: lastReport.title, status: lastReport.status, submittedAt: lastReport.createdAt }
        : null,
    });
  } catch (error) {
    next(error);
  }
};