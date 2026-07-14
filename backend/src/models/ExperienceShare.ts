import mongoose, { Schema, Document } from 'mongoose';

interface IExperienceShare extends Document {
  author: mongoose.Schema.Types.ObjectId;
  title: string;
  content: string;
  tags: string[];
  category: 'article' | 'question' | 'tip';
  upvotes: mongoose.Schema.Types.ObjectId[];
  comments: {
    user: mongoose.Schema.Types.ObjectId;
    text: string;
    createdAt: Date;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const CommentSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const ExperienceShareSchema = new Schema({
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  content: {
    type: String,
    required: true,
  },
  tags: [{
    type: String,
    trim: true,
  }],
  category: {
    type: String,
    enum: ['article', 'question', 'tip'], // Article de blog, question, astuce rapide
    default: 'article',
  },
  upvotes: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  comments: [CommentSchema]
}, {
  timestamps: true,
});

export default mongoose.model<IExperienceShare>('ExperienceShare', ExperienceShareSchema);
