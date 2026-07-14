import mongoose, { Document, Schema } from 'mongoose';

export interface MentorshipMessageDocument extends Document {
  mentorship: mongoose.Types.ObjectId;
  sender: mongoose.Types.ObjectId;
  text: string;
  createdAt: Date;
  read: boolean;
}

const MentorshipMessageSchema = new Schema<MentorshipMessageDocument>({
  mentorship: { type: Schema.Types.ObjectId, ref: 'Mentorship', required: true },
  sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  read: { type: Boolean, default: false },
});

export const MentorshipMessage = mongoose.model<MentorshipMessageDocument>('MentorshipMessage', MentorshipMessageSchema);
