import mongoose, { Document, Schema } from 'mongoose';

export interface AttestationDocument extends Document {
  user: mongoose.Types.ObjectId;
  stage: mongoose.Types.ObjectId;
  issuedAt: Date;
  fileUrl: string;
  status: 'pending' | 'generated' | 'sent';
}

const AttestationSchema = new Schema<AttestationDocument>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  stage: { type: Schema.Types.ObjectId, ref: 'Stage', required: true },
  issuedAt: { type: Date, default: Date.now },
  fileUrl: { type: String, required: true },
  status: { type: String, enum: ['pending', 'generated', 'sent'], default: 'pending' },
});

const Attestation = mongoose.model<AttestationDocument>('Attestation', AttestationSchema);

export default Attestation;