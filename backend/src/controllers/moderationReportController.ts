import { Request, Response, NextFunction } from 'express';
import ModerationReport from '../models/ModerationReport';

// @desc    Liste des signalements
// @route   GET /api/moderation-reports
// @access  Private (admin, rh)
export const getAllModerationReports = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const reports = await ModerationReport.find().sort({ createdAt: -1 });
    res.json(
      reports.map((r: any) => ({
        _id: r._id,
        reason: r.reason,
        createdAt: r.createdAt,
        status: r.status,
        message: {
          _id: r._id,
          content: r.messageContent,
          sender: { name: r.messageSenderName ?? '', email: r.messageSenderEmail ?? '' },
        },
      }))
    );
  } catch (error) {
    next(error);
  }
};

// @desc    Marquer un signalement comme traité
// @route   POST /api/moderation-reports/:id/resolve
// @access  Private (admin, rh)
export const resolveModerationReport = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const report = await ModerationReport.findByIdAndUpdate(req.params.id, { status: 'closed' }, { new: true });
    if (!report) return res.status(404).json({ message: 'Signalement introuvable.' });
    res.json(report);
  } catch (error) {
    next(error);
  }
};

// @desc    Supprimer un signalement (et le message concerné)
// @route   DELETE /api/moderation-reports/:id/message
// @access  Private (admin, rh)
export const deleteModerationReportMessage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const report = await ModerationReport.findByIdAndDelete(req.params.id);
    if (!report) return res.status(404).json({ message: 'Signalement introuvable.' });
    res.json({ message: 'Signalement supprimé.' });
  } catch (error) {
    next(error);
  }
};