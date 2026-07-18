import mongoose, { Schema, Document } from 'mongoose';

export interface IFeedback extends Document {
  author: mongoose.Schema.Types.ObjectId;
  message: string;
  createdAt: Date;
  updatedAt: Date;
}

const FeedbackSchema: Schema = new Schema(
  {
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    message: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IFeedback>('Feedback', FeedbackSchema);