import { Request, Response, NextFunction } from 'express';
import User from '../models/User';
import MentorshipMatch from '../models/MentorshipMatch';
import MentorshipRequest from '../models/MentorshipRequest';
import Contract from '../models/Contract';

const formatUser = (u: any) => ({
  _id: u._id,
  name: `${u.firstName ?? ''} ${u.lastName ?? ''}`.trim(),
  email: u.email,
  phone: u.phone,
  department: u.department,
  specialty: u.bio,
});

// @desc    Liste de tous les stagiaires
// @route   GET /api/rh/interns
export const getAllInterns = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const interns = await User.find({ role: 'stagiaire' });
    res.json(interns.map(formatUser));
  } catch (error) {
    next(error);
  }
};

// @desc    Supprimer un stagiaire
// @route   DELETE /api/rh/interns/:id
export const deleteInternById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await User.findOneAndDelete({ _id: req.params.id, role: 'stagiaire' });
    if (!user) return res.status(404).json({ message: 'Stagiaire introuvable.' });
    res.json({ message: 'Stagiaire supprimé.' });
  } catch (error) {
    next(error);
  }
};

// @desc    Liste de tous les mentors
// @route   GET /api/rh/mentors
export const getAllMentorsForRH = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const mentors = await User.find({ role: 'mentor' });
    res.json(mentors.map(formatUser));
  } catch (error) {
    next(error);
  }
};

// @desc    Supprimer un mentor
// @route   DELETE /api/rh/mentors/:id
export const removeMentorById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await User.findOneAndDelete({ _id: req.params.id, role: 'mentor' });
    if (!user) return res.status(404).json({ message: 'Mentor introuvable.' });
    res.json({ message: 'Mentor supprimé.' });
  } catch (error) {
    next(error);
  }
};

// @desc    Stagiaires sans mentorat actif
// @route   GET /api/rh/interns/unmatched
export const getUnmatchedInterns = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const activeMatches = await MentorshipMatch.find({ status: 'active' }).select('menteeId');
    const assignedIds = activeMatches.map((m) => m.menteeId);
    const interns = await User.find({ role: 'stagiaire', _id: { $nin: assignedIds } });
    res.json(interns.map(formatUser));
  } catch (error) {
    next(error);
  }
};

// @desc    Mentors (tous, faute de suivi de capacité par mentor)
// @route   GET /api/rh/mentors/available
export const getAvailableMentorsForRH = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const mentors = await User.find({ role: 'mentor' });
    res.json(mentors.map(formatUser));
  } catch (error) {
    next(error);
  }
};

// @desc    Assigner un mentor à un stagiaire
// @route   POST /api/rh/interns/:internId/assign-mentor
export const assignMentorToIntern = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { mentorId } = req.body;
    const { internId } = req.params;
    const match = await MentorshipMatch.create({ mentorId, menteeId: internId, status: 'active' });
    res.status(201).json(match);
  } catch (error) {
    next(error);
  }
};

// @desc    Candidatures de mentorat en attente (toutes, vue RH)
// @route   GET /api/rh/applications
export const getAllApplications = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const requests = await MentorshipRequest.find({ status: 'pending' }).populate('mentee', 'firstName lastName email');
    res.json(
      requests.map((r: any) => ({
        _id: r._id,
        name: r.mentee ? `${r.mentee.firstName ?? ''} ${r.mentee.lastName ?? ''}`.trim() : '',
        email: r.mentee?.email ?? '',
        message: r.message ?? '',
        status: r.status,
      }))
    );
  } catch (error) {
    next(error);
  }
};

// @desc    Approuver une candidature (crée le mentorat)
// @route   POST /api/rh/applications/:id/approve
export const approveApplication = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const request = await MentorshipRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: 'Candidature introuvable.' });

    request.status = 'accepted';
    await request.save();

    const match = await MentorshipMatch.create({
      mentorId: request.mentor,
      menteeId: request.mentee,
      status: 'active',
    });

    res.json({ request, match });
  } catch (error) {
    next(error);
  }
};

// @desc    Stagiaires dont le contrat se termine dans les 30 prochains jours
// @route   GET /api/rh/stagiaires/departing
export const getDepartingStagiaires = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const in30Days = new Date();
    in30Days.setDate(in30Days.getDate() + 30);

    const contracts = await Contract.find({ endDate: { $lte: in30Days }, status: 'active' })
      .populate('intern', 'firstName lastName email');

    res.json(
      contracts.map((c: any) => ({
        _id: c.intern?._id,
        name: c.intern ? `${c.intern.firstName ?? ''} ${c.intern.lastName ?? ''}`.trim() : '',
        email: c.intern?.email ?? '',
        endDate: c.endDate,
      }))
    );
  } catch (error) {
    next(error);
  }
};

// @desc    Archiver un stagiaire (désactive le compte)
// @route   POST /api/rh/stagiaires/:id/archive
export const archiveStagiaire = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!user) return res.status(404).json({ message: 'Stagiaire introuvable.' });
    res.json({ message: 'Stagiaire archivé.' });
  } catch (error) {
    next(error);
  }
};