export type Lang = 'fa' | 'en';
export type ThemeMode = 'light' | 'dark';

export type NavSection =
  | 'home'
  | 'course'
  | 'ai-tools'
  | 'assignments'
  | 'bot-connect'
  | 'transactions'
  | 'content-manager'
  | 'wp-export';

export type CourseTab = 'my-course' | 'library' | 'ended';

export interface BiText {
  fa: string;
  en: string;
}

export interface Lesson {
  id: string;
  title: BiText;
  duration: string;
  durationMinutes: number;
  type: 'video' | 'reading' | 'lab';
  isFreePreview?: boolean;
  summary: BiText;
  keyTakeaways: { fa: string[]; en: string[] };
  codeSnippet?: string;
  attachmentName?: string;
}

export interface CourseModule {
  id: string;
  title: BiText;
  lessons: Lesson[];
}

export type CourseCategory = 'AI' | 'Automation' | 'Bots' | 'Finance' | 'Video' | 'WordPress';
export type CourseFormat = 'Video' | 'Workshop' | 'Project';
export type CourseDurationTier = 'short' | 'medium' | 'long';

export interface Course {
  id: string;
  slug: string;
  title: BiText;
  subtitle: BiText;
  description: BiText;
  category: CourseCategory;
  format: CourseFormat;
  durationTier: CourseDurationTier;
  totalDuration: BiText;
  lessonCount: number;
  moduleCount: number;
  enrolled: boolean;
  featured: boolean;
  isNew?: boolean;
  isDemo?: boolean;
  accentColor: 'amber' | 'blue' | 'emerald' | 'indigo';
  thumbnail: string;
  instructor: BiText;
  priceToman: number;
  priceUsd: number;
  modules: CourseModule[];
}

export interface Assignment {
  id: string;
  courseId: string;
  title: BiText;
  dueDate: BiText;
  status: 'pending' | 'submitted' | 'graded';
  score?: number;
  maxScore: number;
  submittedUrl?: string;
  feedback?: BiText;
  isDemo?: boolean;
}

export interface Transaction {
  id: string;
  invoiceNo: string;
  item: BiText;
  type: 'course' | 'software' | 'bundle';
  amountToman: number;
  amountUsd: number;
  date: BiText;
  status: 'paid' | 'pending';
  licenseKey?: string;
  botDelivered: boolean;
  isDemo?: boolean;
}

export type AIToolTask =
  | 'AI Assistant'
  | 'Art & Image'
  | 'Video Generation'
  | '3D & Avatar'
  | 'Code Assistant'
  | 'Audio & Music'
  | 'Data & Finance'
  | 'Automation & Agents'
  | 'Writing & SEO'
  | 'Research & Study';

export type AIToolInput =
  | 'Text'
  | 'Prompt'
  | 'Image'
  | 'Audio'
  | 'Video'
  | 'Spreadsheet'
  | 'Document';

export type AIToolOutput =
  | 'Text'
  | 'Image'
  | 'Video'
  | '3D Model'
  | 'Audio'
  | 'Code'
  | 'Dashboard'
  | 'Workflow'
  | 'Presentation';

export type AIToolPricing = 'Free' | 'Freemium' | 'Paid' | 'Free Trial';

export type AIToolRole =
  | 'Creator'
  | 'Developer'
  | 'Business'
  | 'Analyst'
  | 'Designer'
  | 'Researcher';

export interface AICategoryMeta {
  id: AIToolTask;
  fa: string;
  en: string;
  headline: BiText;
  description: BiText;
  medianPrice: BiText;
}

export interface AITool {
  id: string;
  name: string;
  provider?: string;
  tagline: BiText;
  task: AIToolTask;
  subCategory?: BiText;
  input: AIToolInput;
  output: AIToolOutput;
  pricing: AIToolPricing;
  startingPrice?: BiText;
  roles?: AIToolRole[];
  isNativeIramo?: boolean;
  verified?: boolean;
  featured?: boolean;
  hasApi?: boolean;
  hasMobileApp?: boolean;
  isOpenSource?: boolean;
  hasExtension?: boolean;
  popularityScore?: number;
  usersCount?: number;
  likes?: number;
  dislikes?: number;
  thumbnail?: string;
  isDemo?: boolean;
  url: string;
  description: BiText;
  longDescription?: { fa: string[]; en: string[] };
  keyFeatures?: { fa: string[]; en: string[] };
  whoIsItFor?: { fa: string[]; en: string[] };
  pricingDetails?: BiText;
  likedFor?: { label: BiText; count: number; total: number }[];
  dislikedFor?: { label: BiText; count: number; total: number }[];
  steps?: { fa: string[]; en: string[] };
  samplePrompt?: BiText;
}

export type ArticleCategory =
  | 'AI'
  | 'Bots'
  | 'Finance'
  | 'WordPress'
  | 'Video';

export interface ArticleSection {
  id: string;
  heading: BiText;
  body: BiText;
}

export interface Article {
  id: string;
  slug: string;
  title: BiText;
  excerpt: BiText;
  category: ArticleCategory;
  tags: { fa: string[]; en: string[] };
  author: BiText;
  publishedAt: BiText;
  readMinutes: number;
  views: number;
  featured?: boolean;
  isDemo?: boolean;
  thumbnail: string;
  sections: ArticleSection[];
  relatedCourseId?: string;
}

export interface NotificationItem {
  id: string;
  title: BiText;
  detail: BiText;
  time: BiText;
  read: boolean;
  channel: 'lms' | 'telegram' | 'bale';
}
