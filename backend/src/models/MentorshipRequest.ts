 // models/MentorshipRequest.ts
import e from 'express';
import mongoose from 'mongoose';

 

const mentorshipRequestSchema = new mongoose.Schema(
  {
    mentee: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    mentor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected'],
      default: 'pending',
    },
    message: { type: String },
    
  },
  { timestamps: true }
);
  

export default mongoose.model('MentorshipRequest', mentorshipRequestSchema);
