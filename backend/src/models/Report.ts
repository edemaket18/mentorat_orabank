import mongoose, { Schema, Document } from 'mongoose';

export interface IReport extends Document {
  title: string;
  introduction: string;
  sections: string[];
  conclusion: string;
  skillsAcquired: string[];
  attachments: string[];
  comments: string[];
  mentee: mongoose.Schema.Types.ObjectId;
  status: 'draft' | 'submitted' | 'validated' | 'rejected';
  submissionDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  validationDate?: Date;
  rejectionDate?: Date;
  
}

const ReportSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    introduction: { type: String },
    sections: { type: [String], default: [] },
    conclusion: { type: String },
    skillsAcquired: { type: [String], default: [] },
    attachments: { type: [String], default: [] },
    mentee: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['draft', 'submitted', 'validated', 'rejected'], default: 'draft' },
    submissionDate: { type: Date },
    validationDate: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.model<IReport>('Report', ReportSchema);
