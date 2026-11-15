import React from 'react';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Bot,
  CheckCircle2,
  Clock,
  KeyRound,
  Play,
} from 'lucide-react';
import { Course, Lang, NavSection, Transaction } from '../types/lms';
import { toLocaleDigits } from '../utils/formatters';
import { UserProfile } from './AuthModal';

interface HomeDashboardViewProps {
  lang: Lang;
  currentUser: UserProfile;
  courses: Course[];
  completedLessons: string[];
  transactions: Transaction[];
  onOpenCourse: (course: Course) => void;
  onNavigate: (section: NavSection) => void;
}

export const HomeDashboardView: React.FC<HomeDashboardViewProps> = ({
  lang,
  currentUser,
  courses,
  completedLessons,
  transactions,
  onOpenCourse,
  onNavigate,
}) => {
  const isFa = lang === 'fa';
  const enrolledCourses = courses.filter((c) => c.enrolled);
  const totalLessonsEnrolled = enrolledCourses.reduce(
    (sum, c) => sum + c.modules.reduce((ms, m) => ms + m.lessons.length, 0),
    0
  );
  const overallProgress =
    totalLessonsEnrolled > 0
      ? Math.round((completedLessons.length / totalLessonsEnrolled) * 100)
      : 0;

  const activeLicenses = transactions.filter((t) => t.licenseKey);

  return (
    <div className="space-y-6">
      <section className="rounded-2xl p-6 sm:p-7 bg-white dark:bg-[#0B1613] border border-slate-200/80 dark:border-emerald-500/15 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            {isFa ? 'پنل کاربری و آکادمی iRamoAi' : 'iRamoAi Learning & Product Workspace'}
          </p>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white text-balance">
            {isFa
              ? `خوش آمدید ${currentUser.name}! آماده ادامه یادگیری هستید؟`
              : `Welcome back, ${currentUser.name}! Ready to continue learning?`}
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-300/85 leading-relaxed">
            {isFa
              ? 'دسترسی یکجا به دوره‌های هوش مصنوعی، لایسنس نرم‌افزار حسابیار، وضعیت ربات تلگرام و بله و ابزارهای هوشمند.'
              : 'Access your AI courses, Hesabyar software licenses, Telegram & Bale delivery status, and AI tools.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => onNavigate('course')}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1677FF] hover:bg-[#0D65E8] text-white dark:bg-amber-500 dark:hover:bg-amber-400 dark:text-slate-950 text-xs font-bold transition-colors cursor-pointer whitespace-nowrap shadow-sm shadow-[#1677FF]/20 dark:shadow-none"
          >
            <BookOpen className="w-4 h-4" />
            <span>{isFa ? 'مشاهده کتابخانه دوره‌ها' : 'Browse Course Library'}</span>
          </button>
          <button
            type="button"
            onClick={() => onNavigate('wp-export')}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-emerald-500/25 text-slate-800 dark:text-emerald-300 hover:bg-slate-50 dark:hover:bg-emerald-950/50 text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap"
          >
            <span>{isFa ? 'راهنمای نصب در المنتور' : 'Elementor Setup'}</span>
          </button>
        </div>
      </section>

      {/* 4-Column KPI Row with Persian Numerals */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl p-4 bg-white dark:bg-[#0B1613] border border-slate-200/80 dark:border-emerald-500/15 space-y-1.5">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>{isFa ? 'دوره‌های فعال' : 'Enrolled Courses'}</span>
            <BookOpen className="w-4 h-4 text-blue-600 dark:text-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white tabular-nums">
            {toLocaleDigits(enrolledCourses.length, lang)}
          </p>
          <p className="text-xs text-slate-500 dark:text-emerald-200/60">
            {isFa ? 'دسترسی مادام‌العمر' : 'Lifetime access active'}
          </p>
        </div>

        <div className="rounded-2xl p-4 bg-white dark:bg-[#0B1613] border border-slate-200/80 dark:border-emerald-500/15 space-y-1.5">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>{isFa ? 'جلسات تکمیل‌شده' : 'Lessons Completed'}</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white tabular-nums">
            {toLocaleDigits(completedLessons.length, lang)}{' '}
            <span className="text-sm font-normal text-slate-400">
              / {toLocaleDigits(totalLessonsEnrolled, lang)}
            </span>
          </p>
          <p className="text-xs text-emerald-600 dark:text-emerald-400 tabular-nums">
            {toLocaleDigits(`${overallProgress}%`, lang)}{' '}
            {isFa ? 'پیشرفت کل' : 'overall completion'}
          </p>
        </div>

        <div className="rounded-2xl p-4 bg-white dark:bg-[#0B1613] border border-slate-200/80 dark:border-emerald-500/15 space-y-1.5">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>{isFa ? 'لایسنس‌های نرم‌افزاری' : 'Active Licenses'}</span>
            <KeyRound className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white tabular-nums">
            {toLocaleDigits(activeLicenses.length, lang)}
          </p>
          <p className="text-xs text-slate-500 dark:text-emerald-200/60">
            {isFa ? 'حسابیار نسخه تجاری' : 'Hesabyar Pro active'}
          </p>
        </div>

        <div className="rounded-2xl p-4 bg-white dark:bg-[#0B1613] border border-slate-200/80 dark:border-emerald-500/15 space-y-1.5">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>{isFa ? 'اتصال پیام‌رسان' : 'Messenger Sync'}</span>
            <Bot className="w-4 h-4 text-blue-500 dark:text-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">
            {isFa ? 'متصل' : 'Linked'}
          </p>
          <p className="text-xs text-slate-500 dark:text-emerald-200/60">
            {isFa ? 'تلگرام و بله فعال' : 'Telegram & Bale synced'}
          </p>
        </div>
      </section>

      {/* Active Courses Continue Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            {isFa ? 'ادامه دوره‌های ثبت‌نام‌شده' : 'Continue Learning'}
          </h3>
          <button
            type="button"
            onClick={() => onNavigate('course')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-emerald-400 hover:underline cursor-pointer"
          >
            <span>{isFa ? 'مشاهده همه' : 'View all'}</span>
            {isFa ? (
              <ArrowLeft className="w-3.5 h-3.5" />
            ) : (
              <ArrowRight className="w-3.5 h-3.5" />
            )}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {enrolledCourses.map((course) => {
            const lessonIds = course.modules.flatMap((m) =>
              m.lessons.map((l) => l.id)
            );
            const done = lessonIds.filter((id) =>
              completedLessons.includes(id)
            ).length;
            const pct =
              lessonIds.length > 0
                ? Math.round((done / lessonIds.length) * 100)
                : 0;

            return (
              <div
                key={course.id}
                className="flex flex-col sm:flex-row gap-4 p-4 rounded-2xl bg-white dark:bg-[#0B1613] border border-slate-200/80 dark:border-emerald-500/15"
              >
                <img
                  src={course.thumbnail}
                  alt={isFa ? course.title.fa : course.title.en}
                  referrerPolicy="no-referrer"
                  className="w-full sm:w-36 aspect-4/3 rounded-xl object-cover shrink-0 bg-slate-100 dark:bg-emerald-950"
                />
                <div className="flex-1 min-w-0 flex flex-col justify-between gap-3">
                  <div>
                    <p className="text-[11px] font-medium text-slate-500 dark:text-emerald-300/75 tabular-nums">
                      {course.category} ·{' '}
                      {isFa ? course.totalDuration.fa : course.totalDuration.en}
                    </p>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-0.5 truncate">
                      {isFa ? course.title.fa : course.title.en}
                    </h4>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500 dark:text-slate-400 inline-flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span className="tabular-nums">
                          {toLocaleDigits(`${done}/${lessonIds.length}`, lang)}
                        </span>
                      </span>
                      <span className="tabular-nums font-bold text-emerald-600 dark:text-emerald-400">
                        {toLocaleDigits(`${pct}%`, lang)}
                      </span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-slate-100 dark:bg-emerald-950 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-emerald-500 transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => onOpenCourse(course)}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-amber-400 hover:underline cursor-pointer pt-1"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>{isFa ? 'ورود به جلسه بعدی' : 'Resume Next Lesson'}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
