import { Request, Response, NextFunction } from 'express';
import Report from '../models/Report'; // Assurez-vous que le modèle Report est correct
import User from '../models/User'; // Pour vérifier les auteurs des rapports

// @desc    Créer un nouveau rapport
// @route   POST /api/reports
// @access  Private (Stagiaires uniquement)
export const createReport = async (req: Request, res: Response, next: NextFunction) => {
  const { title, introduction, sections, conclusion, skillsAcquired, attachments } = req.body;

  try {
    const report = new Report({
      title,
      introduction,
      sections,
      conclusion,
      skillsAcquired,
      attachments,
      mentee: req.users?._id,
      status: 'draft', // Par défaut, le rapport est en brouillon
    });

    const savedReport = await report.save();
    res.status(201).json(savedReport);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

// @desc    Obtenir tous les rapports de l'utilisateur connecté
// @route   GET /api/reports
// @access  Private
export const getMyReports = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const reports = await Report.find({ mentee: req.users?._id }).sort({ createdAt: -1 });
    res.json(reports);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

// @desc    Obtenir un rapport par ID
// @route   GET /api/reports/:reportId
// @access  Private
export const getReportById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const report = await Report.findById(req.params.reportId).populate('mentee', 'firstName lastName email');

    if (!report) {
      return res.status(404).json({ message: 'Rapport non trouvé.' });
    }

    if (report.mentee.toString() !== req.users?._id.toString() && req.users?.role !== 'admin') {
      return res.status(403).json({ message: 'Accès non autorisé à ce rapport.' });
    }

    res.json(report);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

// @desc    Mettre à jour un rapport
// @route   PUT /api/reports/:reportId
// @access  Private (Stagiaires uniquement)
export const updateReport = async (req: Request, res: Response, next: NextFunction) => {
  const { title, introduction, sections, conclusion, skillsAcquired, attachments } = req.body;

  try {
    const report = await Report.findById(req.params.reportId);

    if (!report) {
      return res.status(404).json({ message: 'Rapport non trouvé.' });
    }

    if (report.mentee.toString() !== req.users?._id.toString() || report.status !== 'draft') {
      return res.status(403).json({ message: 'Action non autorisée. Vous ne pouvez modifier que vos rapports en brouillon.' });
    }

    if (title) report.title = title;
    if (introduction !== undefined) report.introduction = introduction;
    if (sections !== undefined) report.sections = sections;
    if (conclusion !== undefined) report.conclusion = conclusion;
    if (skillsAcquired !== undefined) report.skillsAcquired = skillsAcquired;
    if (attachments !== undefined) report.attachments = attachments;
    report.updatedAt = new Date();

    const updatedReport = await report.save();
    res.json(updatedReport);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

// @desc    Soumettre un rapport
// @route   PUT /api/reports/:reportId/submit
// @access  Private (Stagiaires uniquement)

import { validationResult } from 'express-validator';

 
export const submitReport = async (req: Request, res: Response, next: NextFunction) => {
  // 1. Validation des données
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { reportId } = req.params;
  const { status, comments } = req.body;

  try {
    // 2. Logique métier
    const report = await Report.findById(reportId);
    if (!report) {
      return res.status(404).json({ message: 'Rapport introuvable.' });
    }

    // Mise à jour conditionnelle
    if (status) report.status = status;
    if (comments) report.comments = comments;

    await report.save();

    // 3. Réponse
    res.status(200).json({
      message: 'Rapport soumis avec succès.',
      data: report,
    });
  } catch (error) {
      
      console.error(error);
    next(error);
     
  }
};
/*
export const submitReport = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const report = await Report.findById(req.params.reportId);

    if (!report) {
      return res.status(404).json({ message: 'Rapport non trouvé.' });
    }

    if (report.mentee.toString() !== req.users?._id.toString()) {
      return res.status(403).json({ message: 'Vous ne pouvez soumettre que vos propres rapports.' });
    }

    if (report.status !== 'draft') {
      return res.status(400).json({ message: `Le rapport ne peut être soumis que s'il est en brouillon (statut actuel: ${report.status}).` });
    }

    report.status = 'submitted';
    report.submissionDate = new Date();

    await report.save();
    res.json({ message: 'Rapport soumis avec succès.' });
  } catch (error) {
    console.error(error);
    next(error);
  }
};
*/

// @desc    Supprimer un rapport
// @route   DELETE /api/reports/:reportId
// @access  Private (Stagiaires uniquement)
export const deleteReport = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const report = await Report.findById(req.params.reportId);

    if (!report) {
      return res.status(404).json({ message: 'Rapport non trouvé.' });
    }

    if (report.mentee.toString() !== req.users?._id.toString()) {
      return res.status(403).json({ message: 'Vous ne pouvez supprimer que vos propres rapports.' });
    }

    await report.deleteOne();
    res.json({ message: 'Rapport supprimé avec succès.' });
  } catch (error) {
    console.error(error);
    next(error);
  }
  
  
};

// @desc    Obtenir tous les rapports (pour les admins)
// @route   GET /api/reports/admin
export const getAllReportsForAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const reports = await Report.find().populate('mentee', 'firstName lastName email');
    res.json(reports);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

// @desc    Mettre à jour le statut d'un rapport (pour les admins)
export const updateReportStatus = async (req: Request, res: Response, next: NextFunction) => {
  const { status } = req.body;

  try {
    const report = await Report.findById(req.params.reportId);

    if (!report) {
      return res.status(404).json({ message: 'Rapport non trouvé.' });
    }

    if (req.users?.role !== 'admin') {
      return res.status(403).json({ message: 'Action non autorisée.' });
    }

    report.status = status;
    report.updatedAt = new Date();

    const updatedReport = await report.save();
    res.json(updatedReport);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

// @desc    Obtenir les statistiques des rapports (pour les admins)
export const getReportStatistics = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const totalReports = await Report.countDocuments();
    const submittedReports = await Report.countDocuments({ status: 'submitted' });
    const draftReports = await Report.countDocuments({ status: 'draft' });

    res.json({
      totalReports,
      submittedReports,
      draftReports,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

// @desc    Obtenir les rapports soumis par un stagiaire spécifique (pour les admins)
export const getReportsByMentee = async (req: Request, res: Response, next: NextFunction) => {
  const { menteeId } = req.params;

  try {
    const reports = await Report.find({ mentee: menteeId, status: 'submitted' })
      .populate('mentee', 'firstName lastName email');

    if (reports.length === 0) {
      return res.status(404).json({ message: 'Aucun rapport soumis trouvé pour ce stagiaire.' });
    }

    res.json(reports);
  } catch (error) {
    console.error(error);
    next(error);
  }
};


export const validateReport = async (req: Request, res: Response, next: NextFunction) => {
  const { reportId } = req.params;

  try {
    const report = await Report.findById(reportId);
    if (!report) {
      return res.status(404).json({ message: 'Rapport non trouvé.' });
    }
    if (req.users?.role !== 'admin') {
      return res.status(403).json({ message: 'Action non autorisée.' });
    }
    if (report.status !== 'submitted') {
      return res.status(400).json({ message: 'Le rapport doit être soumis pour être validé.' });
    }
    report.status = 'validated';
    report.validationDate = new Date();
    await report.save();
    res.json({ message: 'Rapport validé avec succès.' });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

// @desc    Rejeter un rapport (pour les admins)
export const rejectReport = async (req: Request, res: Response, next: NextFunction) => {
  const { reportId } = req.params;

  try {
    const report = await Report.findById(reportId);
    if (!report) {
      return res.status(404).json({ message: 'Rapport non trouvé.' });
    }
    if (req.users?.role !== 'admin') {
      return res.status(403).json({ message: 'Action non autorisée.' });
    }
    if (report.status !== 'submitted') {
      return res.status(400).json({ message: 'Le rapport doit être soumis pour être rejeté.' });
    }
    report.status = 'rejected';
    report.rejectionDate = new Date();
    await report.save();
    res.json({ message: 'Rapport rejeté avec succès.' });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

// @desc    Obtenir les rapports validés (pour les admins)
export const getValidatedReports = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const reports = await Report.find({ status: 'validated' })
      .populate('mentee', 'firstName lastName email');

    if (reports.length === 0) {
      return res.status(404).json({ message: 'Aucun rapport validé trouvé.' });
    }

    res.json(reports);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

// @desc    Obtenir les rapports rejetés (pour les admins)
export const getRejectedReports = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const reports = await Report.find({ status: 'rejected' })
      .populate('mentee', 'firstName lastName email');

    if (reports.length === 0) {
      return res.status(404).json({ message: 'Aucun rapport rejeté trouvé.' });
    }

    res.json(reports);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

// @desc    Obtenir les rapports en brouillon (pour les admins)
export const getDraftReports = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const reports = await Report.find({ status: 'draft' })
      .populate('mentee', 'firstName lastName email');

    if (reports.length === 0) {
      return res.status(404).json({ message: 'Aucun rapport en brouillon trouvé.' });
    }

    res.json(reports);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

// @desc    Obtenir les rapports soumis (pour les admins)
export const getSubmittedReports = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const reports = await Report.find({ status: 'submitted' })
      .populate('mentee', 'firstName lastName email');

    if (reports.length === 0) {
      return res.status(404).json({ message: 'Aucun rapport soumis trouvé.' });
    }

    res.json(reports);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

// @desc    Obtenir les rapports par statut (pour les admins)
export const getReportsByStatus = async (req: Request, res: Response, next: NextFunction) => {
  const { status } = req.params;

  try {
    const reports = await Report.find({ status })
      .populate('mentee', 'firstName lastName email');

    if (reports.length === 0) {
      return res.status(404).json({ message: `Aucun rapport ${status} trouvé.` });
    }

    res.json(reports);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

// @desc    Obtenir les rapports par stagiaire (pour les admins)
export const reportController = {
  getDraftReports,
  getSubmittedReports,
  getRejectedReports,
  getValidatedReports,
  getReportsByStatus
};


export default reportController;