import { Schema, model } from 'mongoose';

const goalSchema = new Schema({
  mentorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  menteeId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: String,
  status: { type: String, enum: ['en_attente', 'en_cours', 'terminé'], default: 'en_attente' },
  deadline: Date,
   tasks: [
    {
      _id: { type: Schema.Types.ObjectId, auto: true },
      title: String,
      isDone: { type: Boolean, default: false }
    }
  ],
  comments: [
    {
      text: String,
      author: { type: Schema.Types.ObjectId, ref: 'User' },
      createdAt: { type: Date, default: Date.now }
    }
  ]
}, { timestamps: true });


export default model('Goal', goalSchema);
export type Goal = {
  mentorId: string;
  menteeId: string;
  title: string;
  description?: string;
  status?: 'en_attente' | 'en_cours' | 'terminé';
  deadline?: Date;
};
import { Document, Model } from 'mongoose';

export interface GoalDocument extends Document {
  mentorId: string;
  menteeId: string;
  title: string;
  description?: string;
  status?: 'en_attente' | 'en_cours' | 'terminé';
  deadline?: Date;
  tasks?: { title: string; isDone: boolean }[];
  comments?: { text: string; author: string; createdAt: Date }[];
}

export const GoalModel = model<GoalDocument>('Goal', goalSchema);

import { FilterQuery } from 'mongoose';

export const getGoals = async (query: FilterQuery<GoalDocument> = {}): Promise<GoalDocument[]> => {
  return GoalModel.find(query);
};
/*
export const getGoalById = async (id: string): Promise<GoalDocument | null> => {
  return GoalModel.findById(id);
};
*/
export const updateGoal = async (id: string, update: Partial<GoalDocument>): Promise<GoalDocument | null> => {
  return GoalModel.findByIdAndUpdate(id, update, { new: true });
};
export const createGoal = async (req: Request, res: Response) => {
  const { title, description, menteeId, deadline } = req.body;
  const mentorId = req.userId;

  const goal = await GoalModel.create({ title, description, menteeId, mentorId, deadline });
  res.status(201).json(goal);
};
export const deleteGoal = async (id: string): Promise<GoalDocument | null> => {
  return GoalModel.findByIdAndDelete(id);
};
import { Request, Response } from 'express';
export const getGoalsByUser = async (req: Request, res: Response) => {
  const userId = req.userId;
  const goals = await GoalModel.find({ $or: [{ mentorId: userId }, { menteeId: userId }] });
  res.json(goals);
};
export const getGoalsByMentor = async (req: Request, res: Response) => {
  const mentorId = req.params.mentorId;
  const goals = await GoalModel.find({ mentorId });
  res.json(goals);
};
export const getGoalsByMentee = async (req: Request, res: Response) => {
  const menteeId = req.params.menteeId;
  const goals = await GoalModel.find({ menteeId });
  res.json(goals);
};
 

export const updateGoalStatus = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!['en_attente', 'en_cours', 'terminé'].includes(status)) {
    return res.status(400).json({ message: 'Statut invalide.' });
  }

  const goal = await GoalModel.findByIdAndUpdate(id, { status }, { new: true });
  if (!goal) return res.status(404).json({ message: 'Objectif non trouvé.' });

  res.json(goal);
};



export const getGoalById = async (req: Request, res: Response) => {
  const goalId = req.params.goalId;
  const goal = await GoalModel.findById(goalId);
  if (!goal) {
    return res.status(404).json({ message: 'Objectif non trouvé' });
  }
  res.json(goal);
};
export const deleteGoalById = async (req: Request, res: Response) => {
  const goalId = req.params.goalId;
  const goal = await GoalModel.findByIdAndDelete(goalId);
  if (!goal) {
    return res.status(404).json({ message: 'Objectif non trouvé' });
  }
    res.json({ message: 'Objectif supprimé avec succès' });
    res.json(goal); 
};

export const addGoalTask = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title } = req.body;

  const goal = await GoalModel.findById(id);
  if (!goal) return res.status(404).json({ message: 'Objectif non trouvé.' });

  if (!goal.tasks) goal.tasks = [];
  goal.tasks.push({ title, isDone: false });
  await goal.save();

  res.json(goal);
};
export const updateGoalTask = async (req: Request, res: Response) => {
  const { id, taskId } = req.params;
  const { title, isDone } = req.body;

  const goal = await GoalModel.findById(id);
  if (!goal) return res.status(404).json({ message: 'Objectif non trouvé.' });

  if (!goal.tasks) return res.status(404).json({ message: 'Aucune tâche trouvée pour cet objectif.' });
  const task = goal.tasks.find((t: any) => t._id?.toString() === taskId);
  if (!task) return res.status(404).json({ message: 'Tâche non trouvée.' });

  task.title = title;
  task.isDone = isDone;
  await goal.save();

  res.json(goal);
  res.json(goal);
};

export const addGoalComment = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { text } = req.body;
  const author = req.userId;
  if (!author) {
    return res.status(400).json({ message: 'Utilisateur non authentifié.' });
  }

  const goal = await GoalModel.findById(id);
  if (!goal) return res.status(404).json({ message: 'Objectif non trouvé.' });

  if (!goal.comments) goal.comments = [];
  goal.comments.push({ text, author, createdAt: new Date() });
  await goal.save();

  res.json(goal);
};
export const getGoalComments = async (req: Request, res: Response) => {
  const { id } = req.params;
  const goal = await GoalModel.findById(id).populate('comments.author', 'name email');
  if (!goal) return res.status(404).json({ message: 'Objectif non trouvé.' });
  res.json(goal.comments);
};
