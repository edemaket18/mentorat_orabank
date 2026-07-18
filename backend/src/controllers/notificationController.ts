import { Request, Response, NextFunction } from 'express';
import Notification from '../models/Notification';

// @desc    Notifications de l'utilisateur connecté (tous rôles)
// @route   GET /api/notifications
// @access  Private
export const getMyNotifications = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const notifications = await Notification.find({ recipient: req.users?._id }).sort({ createdAt: -1 });
    res.json(notifications);
  } catch (error) {
    next(error);
  }
};

// @desc    Marquer une notification comme lue
// @route   PATCH /api/notifications/:id/read
// @access  Private
export const markNotificationAsRead = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const notification = await Notification.findOne({ _id: req.params.id, recipient: req.users?._id });
    if (!notification) return res.status(404).json({ message: 'Notification introuvable.' });

    notification.read = true;
    await notification.save();
    res.json(notification);
  } catch (error) {
    next(error);
  }
};

// @desc    Marquer toutes les notifications comme lues
// @route   PATCH /api/notifications/read-all
// @access  Private
export const markAllNotificationsAsRead = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await Notification.updateMany({ recipient: req.users?._id, read: false }, { $set: { read: true } });
    res.json({ message: 'Toutes les notifications ont été marquées comme lues.' });
  } catch (error) {
    next(error);
  }
};

// @desc    Supprimer une notification
// @route   DELETE /api/notifications/:id
// @access  Private
export const deleteNotification = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const notification = await Notification.findOneAndDelete({ _id: req.params.id, recipient: req.users?._id });
    if (!notification) return res.status(404).json({ message: 'Notification introuvable.' });
    res.json({ message: 'Notification supprimée.' });
  } catch (error) {
    next(error);
  }
};