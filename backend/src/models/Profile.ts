 import mongoose, { Schema, Document, Model } from 'mongoose';
//import { IProfile } from '../types/models';

// Interface pour les sous-documents
interface IEducation {
  school: string;
  degree: string;
  field: string;
  from: Date;
  to?: Date;
}

interface IExperience {
  title: string;
  company: string;
  location?: string;
  from: Date;
  to?: Date;
  description?: string;
}

 
// Extension de IProfile avec les sous-documents
interface IProfile extends Document {
  user: mongoose.Types.ObjectId;
  firstName?: string;
lastName?: string; 
  department?: string;
  position?: string;
  bio?: string;
  location?: string;
  skills: string[];
  experiences: IExperience[];
  education: IEducation[];
  avatar?: string;
  linkedinProfile?: string;
  githubProfile?: string;
  socialLinks?: Map<string, string>;
}
 
// Interface pour les méthodes d'instance
interface IProfileMethods {
  fullName(): string;
  addSkill(skill: string): Promise<void>;
  removeSkill(skill: string): Promise<void>;
}

// Interface pour les méthodes statiques
interface ProfileModel extends Model<IProfile, {}, IProfileMethods> {
  findByUserId(userId: mongoose.Types.ObjectId): Promise<IProfile | null>;
  searchProfiles(query: string): Promise<IProfile[]>;
}

// Schéma Education
const EducationSchema = new Schema<IEducation>({
  school: { type: String, required: true },
  degree: { type: String, required: true },
  field: { type: String, required: true },
  from: { type: Date, required: true },
  to: { type: Date }
});

// Schéma Experience
const ExperienceSchema = new Schema<IExperience>({
  title: { type: String, required: true },
  company: { type: String, required: true },
  location: { type: String },
  from: { type: Date, required: true },
  to: { type: Date },
  description: { type: String }
});

// Schéma principal Profile
const ProfileSchema = new Schema<IProfile, ProfileModel, IProfileMethods>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  department: { type: String },
  position: { type: String },
  bio: { type: String },
  location: { type: String },
  skills: [{ type: String }],
  experiences: [ExperienceSchema],
  education: [EducationSchema],
  avatar: { type: String },
  linkedinProfile: { type: String },
  githubProfile: { type: String },
  socialLinks: { type: Map, of: String }
}, {
  timestamps: true
});

// Méthodes d'instance
ProfileSchema.method('fullName', function(this: IProfile) {
  return `${this.firstName} ${this.lastName}`;
});

ProfileSchema.method('addSkill', async function(this: IProfile, skill: string) {
  if (!this.skills.includes(skill)) {
    this.skills.push(skill);
    await this.save();
  }
});

ProfileSchema.method('removeSkill', async function(this: IProfile, skill: string) {
  this.skills = this.skills.filter(s => s !== skill);
  await this.save();
});

// Méthodes statiques
ProfileSchema.static('findByUserId', function(userId: mongoose.Types.ObjectId) {
  return this.findOne({ user: userId });
});

ProfileSchema.static('searchProfiles', function(query: string) {
  return this.find({
    $or: [
      { firstName: new RegExp(query, 'i') },
      { lastName: new RegExp(query, 'i') },
      { bio: new RegExp(query, 'i') }
    ]
  });
});

// Middleware/Validation supplémentaire
ProfileSchema.pre('save', function(next) {
  if (this.skills.length > 10) {
    throw new Error('Cannot have more than 10 skills');
  }
  next();
});

// Index pour la recherche
ProfileSchema.index({
  firstName: 'text',
  lastName: 'text',
  bio: 'text',
  'experiences.title': 'text',
  'education.school': 'text'
});

// Export du modèle
const Profile = mongoose.model<IProfile, ProfileModel>('Profile', ProfileSchema);


export default Profile;