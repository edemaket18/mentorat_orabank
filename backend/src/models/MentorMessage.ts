import mongoose, { Schema, Document } from 'mongoose';

export interface IMentorMessage extends Document {
  mentorshipMatch: mongoose.Schema.Types.ObjectId;
  sender: mongoose.Schema.Types.ObjectId;
  content: string;
  createdAt: Date;
}

const MentorMessageSchema: Schema = new Schema(
  {
    mentorshipMatch: { type: mongoose.Schema.Types.ObjectId, ref: 'MentorshipMatch', required: true, index: true },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export default mongoose.model<IMentorMessage>('MentorMessage', MentorMessageSchema);