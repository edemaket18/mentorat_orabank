import mongoose, { Schema, Document } from 'mongoose';

export interface ITask extends Document {
  title: string;
  assignedTo: mongoose.Schema.Types.ObjectId;
  completed: boolean;
  assignedDate: Date;
}

const TaskSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    completed: { type: Boolean, default: false },
    assignedDate: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model<ITask>('Task', TaskSchema);