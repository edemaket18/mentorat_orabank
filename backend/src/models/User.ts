 import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

// Interface TypeScript pour le modèle User
export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: 'mentor' | 'stagiaire' | 'admin' | 'rh';
  bio?: string;
  department?: string;
  university?: string;
  preferences?: {
    language?: string;
    notificationsEnabled?: boolean;
  };
  avatar?: string;
  avatarUrl?: string;
  birthDate?: string;
  phone?: string;
  isActive: boolean;
  isVerified: boolean;
  emailVerified: boolean;
  emailVerificationToken?: string;
  emailVerificationExpires?: Date;
  skills?: string[];
  education?: {
    id?: string;
    title?: string;
    institution?: string;
    years?: string;
  }[];
  experiences?: {
    title?: string;
    company?: string;
    startDate?: string;
    endDate?: string;
    description?: string;
  }[];
  isPublic?: boolean;
  showSkills?: boolean;
  showCv?: boolean;
  cvUrl?: string;
   cvUploadedAt?: Date;
  mentorships: mongoose.Types.ObjectId[];
  messages: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

interface Mentorship {
  id: string;
  mentor: string;
  mentee: string;
  status: 'pending'| 'active';
}

const UserSchema = new Schema<IUser>(
  {
    firstName: { type: String, required: true },
    lastName:  { type: String, required: true },
    email:     { type: String, required: true, unique: true },
    password:  { type: String, required: true },

    // Vérification email
    emailVerified: { type: Boolean, default: false },
    emailVerificationToken: String,
    emailVerificationExpires: Date,

    avatar: String,
    avatarUrl: String,
    birthDate: String,
    phone: String,

    role: {
      type: String,
      enum: ['mentor', 'stagiaire', 'admin', 'rh'],
      default: 'stagiaire',
    },
    isActive: { type: Boolean, default: true },
    isVerified: { type: Boolean, default: false },

    skills: [String],
    education: [
      {
        id: String,
        title: String,
        institution: String,
        years: String,
      }
    ],
    experiences: [
      {
        title: String,
        company: String,
        startDate: String,
        endDate: String,
        description: String,
      }
    ],
    isPublic: { type: Boolean, default: true },
    showSkills: { type: Boolean, default: true },
    showCv: { type: Boolean, default: true },
    cvUrl: String,
    bio: String,
    department: String,
    university: String,
    preferences: {
      language: { type: String, default: 'fr' },
      notificationsEnabled: { type: Boolean, default: true },
    },

    mentorships: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Mentorship' }],
    messages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message' }],
  },
  { timestamps: true }
);

// Middleware pour vérifier l'unicité de l'email à la création
UserSchema.pre('save', async function (next) {
  if (this.isNew || this.isModified('email')) {
    const existingUser = await mongoose.models.User.findOne({ email: this.email });
    if (existingUser) {
      return next(new Error('Email déjà utilisé'));
    }
  }
  next();
});

// Middleware pour vérifier l'unicité de l'email lors de la mise à jour
UserSchema.pre('findOneAndUpdate', async function (next) {
  const update = this.getUpdate();
  const emailToCheck =
    update && typeof update === 'object' && !Array.isArray(update) && 'email' in update
      ? (update as { email?: string }).email
      : undefined;

  if (emailToCheck && emailToCheck !== this.getQuery().email) {
    const existingUser = await mongoose.models.User.findOne({
      email: emailToCheck,
      _id: { $ne: this.getQuery()._id },
    });
    if (existingUser) {
      return next(new Error('Email déjà utilisé'));
    }
  }
  next();
});

// Middleware pour hacher le mot de passe avant enregistrement
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Méthode pour comparer le mot de passe
UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);



export default User;