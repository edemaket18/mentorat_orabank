import mongoose from 'mongoose';
import e from 'express';
 

  const mentorshipMatchSchema = new mongoose.Schema({
  menteeId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  mentorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  goals: [{ type: String }],
  progress: { type: String, default: '' },
  startedAt: { type: Date, default: Date.now },
  endedAt: { type: Date },
  status: { type: String, enum: ['active', 'completed', 'cancelled', 'pending'  ], default: 'active' },
  feedback: { type: String, default: null },
}, { timestamps: true });



export default mongoose.model('MentorshipMatch', mentorshipMatchSchema);

