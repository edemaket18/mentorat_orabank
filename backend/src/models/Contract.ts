import mongoose, { Schema, Document } from 'mongoose';

export interface IContract extends Document {
  title: string;
  description?: string;
  intern: mongoose.Schema.Types.ObjectId;
  parties: string[];
  startDate: Date;
  endDate?: Date;
  status: 'active' | 'terminated' | 'pending';
  createdAt: Date;
  updatedAt: Date;
}

const ContractSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    intern: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    parties: { type: [String], default: [] },
    startDate: { type: Date, required: true },
    endDate: { type: Date },
    status: {
      type: String,
      enum: ['active', 'terminated', 'pending'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

export default mongoose.model<IContract>('Contract', ContractSchema);