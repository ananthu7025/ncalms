import { User, Course, PurchasedCourse, EmailTemplate, SupportTicket, Transaction, DashboardStats, SalesData, BundleSales, Lesson, PDFResource, VideoResource, QuestionBankItem } from '@/types';

export const currentUser: User = {
  id: '1',
  name: 'John Doe',
  email: 'john.doe@example.com',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
  role: 'admin',
};

export const courses: Course[] = [
  {
    id: '1',
    title: 'Complete NCA Pathway Exam Preparation',
    description: 'Comprehensive preparation for all NCA pathway exams with detailed study materials, video lectures, and practice questions.',
    thumbnail: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400&h=250&fit=crop',
    instructor: 'Dr. Sarah Mitchell',
    instructorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face',
    price: 299,
    originalPrice: 450,
    rating: 4.8,
    totalRatings: 1247,
    studentsEnrolled: 5420,
    duration: '45 hours',
    lessonsCount: 120,
    category: 'Law',
    level: 'Intermediate',
  },
  {
    id: '2',
    title: 'Constitutional Law Fundamentals',
    description: 'Master the fundamentals of Canadian constitutional law with expert guidance and real case studies.',
    thumbnail: 'https://images.unsplash.com/photo-1505664194779-8beaceb93744?w=400&h=250&fit=crop',
    instructor: 'Prof. Michael Chen',
    instructorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    price: 199,
    originalPrice: 280,
    rating: 4.7,
    totalRatings: 892,
    studentsEnrolled: 3210,
    duration: '32 hours',
    lessonsCount: 85,
    category: 'Law',
    level: 'Beginner',
  },
  {
    id: '3',
    title: 'Criminal Law & Procedure',
    description: 'In-depth study of Canadian criminal law and procedures with practice exams and case analyses.',
    thumbnail: 'https://images.unsplash.com/photo-1436450412740-6b988f486c6b?w=400&h=250&fit=crop',
    instructor: 'Dr. Emily Watson',
    instructorAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
    price: 249,
    originalPrice: 350,
    rating: 4.9,
    totalRatings: 1056,
    studentsEnrolled: 4150,
    duration: '38 hours',
    lessonsCount: 95,
    category: 'Law',
    level: 'Advanced',
  },
  {
    id: '4',
    title: 'Contract Law Essentials',
    description: 'Learn the essential principles of contract law with practical examples and exam preparation.',
    thumbnail: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=400&h=250&fit=crop',
    instructor: 'Prof. David Brown',
    instructorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
    price: 179,
    originalPrice: 250,
    rating: 4.6,
    totalRatings: 678,
    studentsEnrolled: 2890,
    duration: '28 hours',
    lessonsCount: 72,
    category: 'Law',
    level: 'Beginner',
  },
  {
    id: '5',
    title: 'Professional Responsibility & Ethics',
    description: 'Comprehensive coverage of legal ethics and professional responsibility for NCA candidates.',
    thumbnail: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=400&h=250&fit=crop',
    instructor: 'Dr. Sarah Mitchell',
    instructorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face',
    price: 149,
    originalPrice: 200,
    rating: 4.8,
    totalRatings: 534,
    studentsEnrolled: 2100,
    duration: '20 hours',
    lessonsCount: 48,
    category: 'Ethics',
    level: 'Intermediate',
  },
  {
    id: '6',
    title: 'Administrative Law Practice',
    description: 'Master administrative law principles and tribunal procedures with practical exercises.',
    thumbnail: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400&h=250&fit=crop',
    instructor: 'Prof. Jennifer Lee',
    instructorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop&crop=face',
    price: 189,
    originalPrice: 260,
    rating: 4.5,
    totalRatings: 423,
    studentsEnrolled: 1850,
    duration: '25 hours',
    lessonsCount: 62,
    category: 'Law',
    level: 'Advanced',
  },
];

export const purchasedCourses: PurchasedCourse[] = [
  {
    id: 'pc1',
    course: courses[0],
    purchasedBundles: ['pdf', 'video', 'questionBank'],
    purchaseDate: '2024-01-15',
    overallProgress: 68,
    bundleProgress: {
      pdf: 85,
      video: 60,
      questionBank: 45,
    },
  },
  {
    id: 'pc2',
    course: courses[2],
    purchasedBundles: ['video'],
    purchaseDate: '2024-02-20',
    overallProgress: 32,
    bundleProgress: {
      video: 32,
    },
  },
  {
    id: 'pc3',
    course: courses[4],
    purchasedBundles: ['pdf', 'questionBank'],
    purchaseDate: '2024-03-01',
    overallProgress: 100,
    bundleProgress: {
      pdf: 100,
      questionBank: 100,
    },
  },
];

export const courseLessons: Lesson[] = [
  { id: 'l1', title: 'Introduction to NCA Exams', duration: '15:30', isCompleted: true, isLocked: false, type: 'video' },
  { id: 'l2', title: 'Understanding the Exam Format', duration: '22:45', isCompleted: true, isLocked: false, type: 'video' },
  { id: 'l3', title: 'Study Guide PDF', duration: '45 pages', isCompleted: true, isLocked: false, type: 'pdf' },
  { id: 'l4', title: 'Constitutional Foundations', duration: '35:20', isCompleted: true, isLocked: false, type: 'video' },
  { id: 'l5', title: 'Charter of Rights Overview', duration: '28:15', isCompleted: false, isLocked: false, type: 'video' },
  { id: 'l6', title: 'Practice Quiz: Module 1', duration: '20 questions', isCompleted: false, isLocked: false, type: 'quiz' },
  { id: 'l7', title: 'Federal vs Provincial Powers', duration: '42:10', isCompleted: false, isLocked: false, type: 'video' },
  { id: 'l8', title: 'Case Study Analysis', duration: '32 pages', isCompleted: false, isLocked: true, type: 'pdf' },
  { id: 'l9', title: 'Constitutional Remedies', duration: '38:55', isCompleted: false, isLocked: true, type: 'video' },
  { id: 'l10', title: 'Module 2 Quiz', duration: '25 questions', isCompleted: false, isLocked: true, type: 'quiz' },
];

export const pdfResources: PDFResource[] = [
  { id: 'pdf1', title: 'Complete NCA Study Guide 2024', pages: 120, size: '8.5 MB', isDownloaded: true },
  { id: 'pdf2', title: 'Constitutional Law Summary Notes', pages: 45, size: '3.2 MB', isDownloaded: true },
  { id: 'pdf3', title: 'Charter Rights Quick Reference', pages: 12, size: '1.1 MB', isDownloaded: false },
  { id: 'pdf4', title: 'Case Analysis Templates', pages: 28, size: '2.4 MB', isDownloaded: false },
  { id: 'pdf5', title: 'Exam Preparation Workbook', pages: 85, size: '6.8 MB', isDownloaded: false },
  { id: 'pdf6', title: 'Federal Powers Overview', pages: 32, size: '2.8 MB', isDownloaded: true },
];

export const videoResources: VideoResource[] = [
  { id: 'v1', title: 'Introduction to NCA Exams', duration: '15:30', isWatched: true, thumbnail: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=300&h=180&fit=crop' },
  { id: 'v2', title: 'Understanding the Exam Format', duration: '22:45', isWatched: true, thumbnail: 'https://images.unsplash.com/photo-1505664194779-8beaceb93744?w=300&h=180&fit=crop' },
  { id: 'v3', title: 'Constitutional Foundations', duration: '35:20', isWatched: true, thumbnail: 'https://images.unsplash.com/photo-1436450412740-6b988f486c6b?w=300&h=180&fit=crop' },
  { id: 'v4', title: 'Charter of Rights Deep Dive', duration: '28:15', isWatched: false, thumbnail: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=300&h=180&fit=crop' },
  { id: 'v5', title: 'Federal vs Provincial Powers', duration: '42:10', isWatched: false, thumbnail: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=300&h=180&fit=crop' },
  { id: 'v6', title: 'Constitutional Remedies', duration: '38:55', isWatched: false, thumbnail: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=300&h=180&fit=crop' },
];

export const questionBankItems: QuestionBankItem[] = [
  { id: 'qb1', title: 'Constitutional Law Basics', questionsCount: 50, difficulty: 'Easy', isCompleted: true, score: 92 },
  { id: 'qb2', title: 'Charter Rights Practice', questionsCount: 75, difficulty: 'Medium', isCompleted: true, score: 85 },
  { id: 'qb3', title: 'Federal Powers Quiz', questionsCount: 40, difficulty: 'Easy', isCompleted: false },
  { id: 'qb4', title: 'Provincial Powers Quiz', questionsCount: 45, difficulty: 'Medium', isCompleted: false },
  { id: 'qb5', title: 'Advanced Constitutional Issues', questionsCount: 60, difficulty: 'Hard', isCompleted: false },
  { id: 'qb6', title: 'Full Mock Exam', questionsCount: 100, difficulty: 'Hard', isCompleted: false },
];

export const emailTemplates: EmailTemplate[] = [
  {
    id: 'et1',
    name: 'Purchase Confirmation',
    subject: 'Thank you for your purchase - {{course_name}}',
    content: '<h2>Welcome to NCA!</h2><p>Thank you for purchasing {{course_name}}. Your learning journey begins now!</p><p>Access your course materials in your library.</p>',
    trigger: 'On successful purchase',
    isActive: true,
    lastModified: '2024-03-15',
  },
  {
    id: 'et2',
    name: 'Course Access Granted',
    subject: 'Your course access is ready - {{course_name}}',
    content: '<h2>Access Granted!</h2><p>You now have full access to {{course_name}}.</p><p>Start learning today!</p>',
    trigger: 'On course enrollment',
    isActive: true,
    lastModified: '2024-03-10',
  },
  {
    id: 'et3',
    name: 'Study Reminder',
    subject: "Don't forget to continue learning!",
    content: "<h2>Keep the momentum going!</h2><p>You haven't logged in for a while. Your courses are waiting for you.</p>",
    trigger: '7 days of inactivity',
    isActive: true,
    lastModified: '2024-03-08',
  },
  {
    id: 'et4',
    name: 'Exam Preparation Reminder',
    subject: 'Your exam is approaching - Time to prepare!',
    content: '<h2>Exam Reminder</h2><p>Your scheduled exam is in {{days_until_exam}} days. Make sure to review all materials.</p>',
    trigger: '14 days before exam',
    isActive: false,
    lastModified: '2024-02-28',
  },
  {
    id: 'et5',
    name: 'Certificate Available',
    subject: 'Congratulations! Your certificate is ready',
    content: '<h2>Congratulations!</h2><p>You have successfully completed {{course_name}}. Download your certificate now.</p>',
    trigger: 'On course completion',
    isActive: true,
    lastModified: '2024-03-12',
  },
];

export const supportTickets: SupportTicket[] = [
  {
    id: 'st1',
    userId: 'u1',
    userName: 'Alice Johnson',
    userEmail: 'alice@example.com',
    subject: 'Cannot access video lectures',
    message: 'I purchased the video bundle but cannot access the lectures. The page shows a loading error.',
    category: 'issue',
    status: 'new',
    createdAt: '2024-03-18T10:30:00Z',
    updatedAt: '2024-03-18T10:30:00Z',
  },
  {
    id: 'st2',
    userId: 'u2',
    userName: 'Bob Smith',
    userEmail: 'bob@example.com',
    subject: 'Question about exam format',
    message: 'Can you clarify the format of the Constitutional Law exam? Is it multiple choice or essay?',
    category: 'question',
    status: 'pending',
    createdAt: '2024-03-17T14:20:00Z',
    updatedAt: '2024-03-18T09:15:00Z',
  },
  {
    id: 'st3',
    userId: 'u3',
    userName: 'Carol Davis',
    userEmail: 'carol@example.com',
    subject: 'Great course content!',
    message: 'Just wanted to share that the Criminal Law course is excellent. The case studies are very helpful.',
    category: 'feedback',
    status: 'resolved',
    createdAt: '2024-03-16T08:45:00Z',
    updatedAt: '2024-03-16T11:30:00Z',
  },
  {
    id: 'st4',
    userId: 'u4',
    userName: 'Daniel Wilson',
    userEmail: 'daniel@example.com',
    subject: 'Refund request',
    message: 'I accidentally purchased the wrong bundle. Can I get a refund and purchase the correct one?',
    category: 'refund',
    status: 'pending',
    createdAt: '2024-03-18T16:00:00Z',
    updatedAt: '2024-03-18T16:00:00Z',
  },
  {
    id: 'st5',
    userId: 'u5',
    userName: 'Eva Martinez',
    userEmail: 'eva@example.com',
    subject: 'PDF download not working',
    message: 'The download button for study materials is not responding. I need to access them offline.',
    category: 'issue',
    status: 'new',
    createdAt: '2024-03-18T12:15:00Z',
    updatedAt: '2024-03-18T12:15:00Z',
  },
];

export const transactions: Transaction[] = [
  { id: 't1', userId: 'u1', userName: 'Alice Johnson', userEmail: 'alice@example.com', courseTitle: 'Complete NCA Pathway Exam Preparation', bundleType: 'full', amount: 299, date: '2024-03-18', status: 'completed', paymentMethod: 'card' },
  { id: 't2', userId: 'u2', userName: 'Bob Smith', userEmail: 'bob@example.com', courseTitle: 'Constitutional Law Fundamentals', bundleType: 'video', amount: 149, date: '2024-03-18', status: 'completed', paymentMethod: 'paypal' },
  { id: 't3', userId: 'u3', userName: 'Carol Davis', userEmail: 'carol@example.com', courseTitle: 'Criminal Law & Procedure', bundleType: 'pdf', amount: 99, date: '2024-03-17', status: 'completed', paymentMethod: 'card' },
  { id: 't4', userId: 'u4', userName: 'Daniel Wilson', userEmail: 'daniel@example.com', courseTitle: 'Contract Law Essentials', bundleType: 'questionBank', amount: 79, date: '2024-03-17', status: 'refunded', paymentMethod: 'card' },
  { id: 't5', userId: 'u5', userName: 'Eva Martinez', userEmail: 'eva@example.com', courseTitle: 'Professional Responsibility & Ethics', bundleType: 'full', amount: 149, date: '2024-03-16', status: 'completed', paymentMethod: 'bank' },
  { id: 't6', userId: 'u6', userName: 'Frank Brown', userEmail: 'frank@example.com', courseTitle: 'Administrative Law Practice', bundleType: 'video', amount: 139, date: '2024-03-16', status: 'completed', paymentMethod: 'card' },
  { id: 't7', userId: 'u7', userName: 'Grace Lee', userEmail: 'grace@example.com', courseTitle: 'Complete NCA Pathway Exam Preparation', bundleType: 'pdf', amount: 119, date: '2024-03-15', status: 'completed', paymentMethod: 'paypal' },
  { id: 't8', userId: 'u8', userName: 'Henry Chen', userEmail: 'henry@example.com', courseTitle: 'Constitutional Law Fundamentals', bundleType: 'full', amount: 199, date: '2024-03-15', status: 'pending', paymentMethod: 'card' },
];

export const dashboardStats: DashboardStats = {
  totalRevenue: 48520,
  revenueChange: 12.5,
  activeUsers: 2847,
  usersChange: 8.3,
  totalCourses: 12,
  coursesChange: 2,
  pendingSupport: 8,
  supportChange: -15,
};

export const topSellingCourses: SalesData[] = [
  { name: 'NCA Pathway', sales: 542, revenue: 162058 },
  { name: 'Criminal Law', sales: 415, revenue: 103335 },
  { name: 'Constitutional', sales: 321, revenue: 63879 },
  { name: 'Contract Law', sales: 289, revenue: 51731 },
  { name: 'Ethics', sales: 210, revenue: 31290 },
  { name: 'Admin Law', sales: 185, revenue: 34965 },
];

export const bundleSales: BundleSales = {
  pdf: 1245,
  video: 2180,
  questionBank: 890,
};

export const monthlyRevenue = [
  { month: 'Jan', revenue: 32000, users: 180 },
  { month: 'Feb', revenue: 38000, users: 220 },
  { month: 'Mar', revenue: 45000, users: 285 },
  { month: 'Apr', revenue: 42000, users: 260 },
  { month: 'May', revenue: 48520, users: 310 },
];

export const learnerStats = {
  coursesEnrolled: 3,
  hoursLearned: 45,
  certificatesEarned: 1,
  currentStreak: 7,
};

export const weeklyActivity = [
  { day: 'Mon', hours: 2.5 },
  { day: 'Tue', hours: 1.8 },
  { day: 'Wed', hours: 3.2 },
  { day: 'Thu', hours: 2.1 },
  { day: 'Fri', hours: 1.5 },
  { day: 'Sat', hours: 4.0 },
  { day: 'Sun', hours: 3.5 },
];

export const categories = ['All', 'Law', 'Ethics', 'Business', 'Finance'];
