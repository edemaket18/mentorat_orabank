import mongoose, { Schema, Document } from 'mongoose';

export interface IEvaluation extends Document {
  mentor: mongoose.Schema.Types.ObjectId;
  intern: mongoose.Schema.Types.ObjectId;
  score: number;
  comment?: string;
  createdAt: Date;
  updatedAt: Date;
}

const EvaluationSchema: Schema = new Schema(
  {
    mentor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    intern: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    score: { type: Number, required: true, min: 0, max: 20 },
    comment: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model<IEvaluation>('Evaluation', EvaluationSchema);