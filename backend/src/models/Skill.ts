import mongoose, { Schema, Document } from 'mongoose';

interface ISkill extends Document {
  name: string;
  description?: string;
  level: string;
  category: 'technical' | 'soft' | 'tool';  
  validatedBy: mongoose.Schema.Types.ObjectId[]; // Mentors qui ont validé cette compétence pour un stagiaire  
  isActive: boolean;
}

const SkillSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  level: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ['technical', 'soft', 'tool', 'language', 'other'],
    required: true,
  },
    createdBy: {
     type: Schema.Types.ObjectId,
     ref: 'User'
   },
   isActive: {
    type: Boolean,
    required: true,
   },
}, {
  timestamps: true,
});

export default mongoose.model<ISkill>('Skill', SkillSchema);
