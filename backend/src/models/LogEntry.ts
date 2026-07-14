import mongoose, { Schema, model, Document } from 'mongoose';
import { Request, Response } from 'express';
// import { IUser } from './User'; // Uncomment if you need to use IUser from User model
const logEntrySchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  title: String,
  content: String,
  date: { type: Date, default: Date.now },
});

export default model('LogEntry', logEntrySchema);
export type LogEntry = {
  userId: string;
  title: string;
  content: string;
  date?: Date;
};
export type LogEntryDocument = LogEntry & Document;
export type LogEntryModel = typeof model & {
  create: (doc: LogEntry) => Promise<LogEntryDocument>;
  find: (query: Partial<LogEntry>) => Promise<LogEntryDocument[]>;
  findById: (id: string) => Promise<LogEntryDocument | null>;
  findByIdAndUpdate: (id: string, update: Partial<LogEntry>) => Promise<LogEntryDocument | null>;
  findByIdAndDelete: (id: string) => Promise<LogEntryDocument | null>;
};

export const addLogEntry = async (req: Request, res: Response) => {
  const { title, content } = req.body;
  const userId = req.userId;

  const entry = await model('LogEntry').create({ title, content, userId });
  res.status(201).json(entry);
};
