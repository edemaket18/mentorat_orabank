// models/Meeting.ts
import mongoose from 'mongoose';

const meetingSchema = new mongoose.Schema({
  mentor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  mentee: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  durationMinutes: { type: Number, default: 30 },
  status: { type: String, enum: ['pending', 'confirmed', 'cancelled'], default: 'pending' },
  subject: { type: String },
  message: { type: String },
}, { timestamps: true });

export default mongoose.model('Meeting', meetingSchema);
