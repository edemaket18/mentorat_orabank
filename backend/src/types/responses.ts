export interface ApiResponse {
  success: boolean;
  message?: string;
  data?: any;
  error?: string;
}

export interface AuthResponse extends ApiResponse {
  token?: string;
  user?: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}
export interface UserProfileResponse extends ApiResponse {
  profile?: {
    id: string;
    userId: string;
    bio: string;
    skills: string[];
    experience: string[];
  };
}
export interface MentorshipResponse extends ApiResponse {
  mentorship?: {
    id: string;
    mentorId: string;
    menteeId: string;
    status: string;
    startDate: Date;
    endDate: Date;
  };
}

export interface ExperienceShareResponse extends ApiResponse {
  experience?: {
    id: string;
    userId: string;
    title: string;
    description: string;
    date: Date;
  };
}

export interface SkillResponse extends ApiResponse {
  skills?: string[];
}

export interface ReportResponse extends ApiResponse {
  report?: {
    id: string;
    userId: string;
    type: string;
    description: string;
    status: string;
  };
}

export interface StudentResponse extends ApiResponse {
  students?: {
    id: string;
    name: string;
    email: string;
    enrolledCourses: string[];
  }[];
}

export interface AdminUserResponse extends ApiResponse {
  users?: {
    id: string;
    name: string;
    email: string;
    role: string;
  }[];
}

export interface NotFoundResponse extends ApiResponse {
  message: string;
}

export interface ErrorResponse extends ApiResponse {
  error: string;
  statusCode?: number;
}

export interface SuccessResponse extends ApiResponse {
  data: any;
  message?: string;
}     

export interface ValidationErrorResponse extends ApiResponse {
  errors: Record<string, string>;
}

export interface PaginatedResponse<T> extends ApiResponse {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface FileUploadResponse extends ApiResponse {
  fileUrl?: string;
  fileName?: string;
}

export interface EmailResponse extends ApiResponse {
  success: boolean;
  message?: string;
  error?: string;
}

export interface NotificationResponse extends ApiResponse {
  notifications?: {
    id: string;
    userId: string;
    message: string;
    read: boolean;
    createdAt: Date;
  }[];
}

export interface FeedbackResponse extends ApiResponse {
  feedback?: {
    id: string;
    userId: string;
    content: string;
    rating: number;
    createdAt: Date;
  }[];
}

export interface CourseResponse extends ApiResponse {
  courses?: {
    id: string;
    title: string;
    description: string;
    instructorId: string;
    createdAt: Date;
  }[];
}

export interface CourseEnrollmentResponse extends ApiResponse {
  enrollments?: {
    id: string;
    userId: string;
    courseId: string;
    status: string;
    enrolledAt: Date;
  }[];
}

export interface SearchResponse<T> extends ApiResponse {
  results: T[];
  totalResults: number;
  query: string;
}

export interface AnalyticsResponse extends ApiResponse {
  data: {
    totalUsers: number;
    totalMentorships: number;
    totalExperiences: number;
    totalSkills: number;
    totalReports: number;
  };
}

export interface DashboardResponse extends ApiResponse {
  stats: {
    totalUsers: number;
    totalMentorships: number;
    totalExperiences: number;
    totalSkills: number;
    totalReports: number;
  };
  recentActivities: {
    id: string;
    type: string;
    userId: string;
    timestamp: Date;
  }[];
}

export interface SettingsResponse extends ApiResponse {
  settings: {
    siteName: string;
    contactEmail: string;
    supportPhone: string;
    socialLinks: {
      facebook?: string;
      twitter?: string;
      linkedin?: string;
      instagram?: string;
    };
  };
}

export interface LanguageResponse extends ApiResponse {
  languages: string[];
}

export interface LocalizationResponse extends ApiResponse {
  translations: Record<string, string>;
  locale: string;
}

export interface BackupResponse extends ApiResponse {
  backupUrl?: string;
  backupDate?: Date;
}
export interface ImportResponse extends ApiResponse {
  importedCount: number;
  errors?: string[];
}

export interface ExportResponse extends ApiResponse {
  exportUrl?: string;
  exportDate?: Date;
}

export interface RateLimitResponse extends ApiResponse {
  remainingRequests: number;
  resetTime: Date;
}

export interface HealthCheckResponse extends ApiResponse {
  status: 'ok' | 'degraded' | 'down';
  details?: Record<string, any>;
}