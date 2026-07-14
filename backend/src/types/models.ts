  import { Types, Document } from 'mongoose';

export enum UserRole {
  STAGIAIRE = 'stagiaire',
  MENTOR = 'mentor',
  ADMIN = 'admin'
}

export interface IUser {
  users_id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: UserRole;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;

  // Optional fields
  lastLogin?: Date;
  profile?: Types.ObjectId;
  mentorships?: Types.ObjectId[];
  notifications?: Types.ObjectId[];
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  emailVerificationToken?: string;
  emailVerificationExpires?: Date;
  emailVerified?: boolean;
  twoFactorEnabled?: boolean;
  twoFactorSecret?: string;
  bio?: string;
  skills?: string[];
  dateOfBirth?: Date;
  preferences?: {
    language: string;
    timezone: string;
  };
  socialAuth?: {
    provider: string;
    providerId: string;
    accessToken: string;
    refreshToken?: string;
  };
  isEmailNotificationsEnabled?: boolean;
  isProfilePublic?: boolean;
}

export interface IUserDocument extends IUser, Document {
  matchPassword(enteredPassword: string): Promise<boolean>;
}




 

 
export interface IProfile {
  id: string;
   firstName: string;
lastName: string; 
  user: IUser['users_id'];
  department: string;
  position: string;
  bio: string;
  skills: string[];
  experiences: string[];
  education: Array<{
    school: string;
    degree: string;
    field: string;
    from: Date;
    to: Date;
  }>;
  avatar?: string;
  socialLinks?: {
    linkedin?: string;
    github?: string;
    twitter?: string;
    website?: string;
  };
  certifications?: string[];
  languages?: string[];
  interests?: string[];
  achievements?: string[];
  availability?: {
    from: Date;
    to: Date;
  };
  preferences?: {
    communication: 'email' | 'chat' | 'video';
    timezone: string;
  };
  status: 'pending' | 'active' | 'completed' | 'archived' | 'deleted' | 'cancelled' | 'on-hold';
  statusReason?: string;
  archivedDate?: Date;
  deletedDate?: Date;
  cancelledDate?: Date;
  onHoldDate?: Date;
  isArchived?: boolean;
  isDeleted?: boolean;
  isCancelled?: boolean;
  isOnHold?: boolean;
  createdAt: Date;
  updatedAt: Date;
  isPublic: boolean;
}
 

export interface IMentorship {
  mentor: Types.ObjectId;
  mentee: Types.ObjectId;
  requestedBy: Types.ObjectId;
  startDate?: Date;
  endDate?: Date;
  objectives?: string[];
  progress?: Array<{
    description: string;
    date?: Date;
    status?: 'completed' | 'in-progress' | 'planned';
  }>;
  feedbackMentee?: {
    rating: number;
    comment: string;
  };
  feedbackMentor?: {
    rating: number;
    comment: string;
  };
  status: 'pending' | 'active' | 'completed' | 'archived' | 'deleted' | 'cancelled' | 'on-hold';
  statusReason?: string;
  archivedDate?: Date;
  deletedDate?: Date;
  cancelledDate?: Date;
  onHoldDate?: Date;
  isArchived?: boolean;
  isDeleted?: boolean;
  isCancelled?: boolean;
  isOnHold?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface INotification {
  user: IUser['users_id'];
  type: 'mentorship' | 'profile' | 'system';
  message: string;
  isRead: boolean;
  createdAt: Date;
}
export interface INotificationDocument extends INotification, Document {
  markAsRead(): Promise<void>;
}

 export interface IExperienceShare {
  user: IUser['users_id'];
  experience: string;
  createdAt: Date;
}
export interface ExperienceShareDocument extends IExperienceShare, Document {
  shareExperience(): Promise<void>;
}

export interface IMessage {
  sender: IUser['users_id'];
  recipient: IUser['users_id'];
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface MessageDocument extends IMessage, Document {
  sendMessage(): Promise<void>;
  markAsRead(): Promise<void>;
}

export interface IFeedback {
  mentor: IUser['users_id'];
  mentee: IUser['users_id'];
  rating: number;
  comment: string;
  createdAt: Date;
}
export interface FeedbackDocument extends IFeedback, Document {
  submitFeedback(): Promise<void>;
}
export interface IReport {
  reporter: IUser['users_id'];
  reportedUser: IUser['users_id'];
  reason: string;
  details?: string;
  status: 'pending' | 'resolved' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
}
export interface ReportDocument extends IReport, Document {
  resolveReport(): Promise<void>;
  rejectReport(): Promise<void>;
}
export interface ISession {
  user: IUser['users_id'];
  createdAt: Date;
  updatedAt: Date;
}
export interface SessionDocument extends ISession, Document {
  createSession(): Promise<void>;
  endSession(): Promise<void>;
}

export interface ISkill {
  name: string;
}
export interface SkillDocument extends ISkill, Document {
  addSkill(): Promise<void>;
  removeSkill(): Promise<void>;
}

export interface Conversation {
  conversationId: string;
   firstName: string;
lastName: string; 
avatar?: string;

}

 export interface ApiResponse<T> {
  success: boolean;
  data: T;
}