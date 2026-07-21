import mongoose, { Schema, Document } from 'mongoose';

// Un "signalement" (utilisateur signalant un message problématique), à ne
// pas confondre avec le modèle Report qui représente les rapports de stage.
export interface IModerationReport extends Document {
  reporter: mongoose.Schema.Types.ObjectId;
  reason: string;
  messageContent: string;
  messageSenderName?: string;
  messageSenderEmail?: string;
  status: 'open' | 'in_progress' | 'closed';
  createdAt: Date;
  updatedAt: Date;
}

const ModerationReportSchema: Schema = new Schema(
  {
    reporter: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    reason: { type: String, required: true },
    messageContent: { type: String, required: true },
    messageSenderName: { type: String },
    messageSenderEmail: { type: String },
    status: { type: String, enum: ['open', 'in_progress', 'closed'], default: 'open' },
  },
  { timestamps: true }
);

export default mongoose.model<IModerationReport>('ModerationReport', ModerationReportSchema);