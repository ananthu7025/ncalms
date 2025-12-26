export type UserRole = 'learner' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: UserRole;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  instructor: string;
  instructorAvatar: string;
  price: number;
  originalPrice?: number;
  rating: number;
  totalRatings: number;
  studentsEnrolled: number;
  duration: string;
  lessonsCount: number;
  category: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  isPurchased?: boolean;
  progress?: number;
}

export interface Bundle {
  id: string;
  type: 'pdf' | 'video' | 'questionBank';
  name: string;
  description: string;
  price: number;
  features: string[];
}

export interface CourseBundle {
  courseId: string;
  bundles: Bundle[];
  fullBundlePrice: number;
  fullBundleSavings: number;
}

export interface PurchasedCourse {
  id: string;
  course: Course;
  purchasedBundles: ('pdf' | 'video' | 'questionBank')[];
  purchaseDate: string;
  accessExpiry?: string;
  overallProgress: number;
  bundleProgress: {
    pdf?: number;
    video?: number;
    questionBank?: number;
  };
}

export interface Lesson {
  id: string;
  title: string;
  duration: string;
  isCompleted: boolean;
  isLocked: boolean;
  type: 'video' | 'pdf' | 'quiz';
}

export interface PDFResource {
  id: string;
  title: string;
  pages: number;
  size: string;
  isDownloaded: boolean;
}

export interface VideoResource {
  id: string;
  title: string;
  duration: string;
  isWatched: boolean;
  thumbnail: string;
}

export interface QuestionBankItem {
  id: string;
  title: string;
  questionsCount: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  isCompleted: boolean;
  score?: number;
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  content: string;
  trigger: string;
  isActive: boolean;
  lastModified: string;
}

export interface SupportTicket {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  subject: string;
  message: string;
  category: 'feedback' | 'question' | 'issue' | 'refund';
  status: 'new' | 'pending' | 'resolved';
  createdAt: string;
  updatedAt: string;
}

export interface Transaction {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  courseTitle: string;
  bundleType: 'full' | 'pdf' | 'video' | 'questionBank';
  amount: number;
  date: string;
  status: 'completed' | 'pending' | 'refunded';
  paymentMethod: 'card' | 'paypal' | 'bank';
}

export interface DashboardStats {
  totalRevenue: number;
  revenueChange: number;
  activeUsers: number;
  usersChange: number;
  totalCourses: number;
  coursesChange: number;
  pendingSupport: number;
  supportChange: number;
}

export interface SalesData {
  name: string;
  sales: number;
  revenue: number;
}

export interface BundleSales {
  pdf: number;
  video: number;
  questionBank: number;
}

export interface CartItem {
  id: string;
  courseId: string;
  courseTitle: string;
  courseThumbnail: string;
  bundleType: 'full' | 'pdf' | 'video' | 'questionBank';
  bundleName: string;
  price: number;
}
