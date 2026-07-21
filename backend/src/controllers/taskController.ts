import { Request, Response, NextFunction } from 'express';
import Task from '../models/Task';

// @desc    Mes tâches
// @route   GET /api/intern/tasks
// @access  Private (stagiaire)
export const getMyTasks = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tasks = await Task.find({ assignedTo: req.users?._id }).sort({ assignedDate: -1 });
    res.json(tasks);
  } catch (error) {
    next(error);
  }
};

// @desc    Créer une tâche personnelle
// @route   POST /api/intern/tasks
// @access  Private (stagiaire)
export const createTask = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title } = req.body;
    if (!title || !title.trim()) return res.status(400).json({ message: 'Le titre est requis.' });
    const task = await Task.create({ title, assignedTo: req.users?._id });
    res.status(201).json(task);
  } catch (error) {
    next(error);
  }
};

// @desc    Basculer l'état complété d'une tâche
// @route   PATCH /api/intern/tasks/:id/toggle
// @access  Private (stagiaire)
export const toggleTask = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, assignedTo: req.users?._id });
    if (!task) return res.status(404).json({ message: 'Tâche introuvable.' });
    task.completed = !task.completed;
    await task.save();
    res.json(task);
  } catch (error) {
    next(error);
  }
};