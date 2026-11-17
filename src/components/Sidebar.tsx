import React from 'react';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Bot,
  ChevronLeft,
  ChevronRight,
  Code2,
  Cpu,
  FileCheck2,
  Home,
  LogOut,
  Receipt,
  Sliders,
  Sparkles,
  X,
} from 'lucide-react';
import { resolveBrandLogo } from '../assets/media';
import { Course, Lang, NavSection, ThemeMode } from '../types/lms';
import { toLocaleDigits } from '../utils/formatters';
import { UserProfile } from './AuthModal';

interface SidebarProps {
  lang: Lang;
  theme: ThemeMode;
  currentUser: UserProfile;
  activeSection: NavSection;
  onSelectSection: (section: NavSection) => void;
  latestCourses: Course[];
  onOpenCourse: (course: Course) => void;
  onOpenStudyPlanner: () => void;
  onBackToWebsite: () => void;
  onLogout: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
  completedLessons: string[];
}

export const Sidebar: React.FC<SidebarProps> = ({
  lang,
  theme,
  currentUser,
  activeSection,
  onSelectSection,
  latestCourses,
  onOpenCourse,
  onOpenStudyPlanner,
  onBackToWebsite,
  onLogout,
  mobileOpen,
  onCloseMobile,
  completedLessons,
}) => {
  const isFa = lang === 'fa';

  const navItems: {
    id: NavSection;
    label: { fa: string; en: string };
    icon: React.ReactNode;
    badge?: string;
  }[] = [
    {
      id: 'home',
      label: { fa: 'پیشخوان', en: 'Home' },
      icon: <Home className="w-4 h-4 shrink-0" />,
    },
    {
      id: 'course',
      label: { fa: 'دوره‌های آموزشی', en: 'Courses' },
      icon: <BookOpen className="w-4 h-4 shrink-0" />,
    },
    {
      id: 'ai-tools',
      label: { fa: 'ابزارهای هوش مصنوعی', en: 'AI Tools' },
      icon: <Cpu className="w-4 h-4 shrink-0" />,
    },
    {
      id: 'assignments',
      label: { fa: 'تکالیف و پروژه‌ها', en: 'Assignments' },
      icon: <FileCheck2 className="w-4 h-4 shrink-0" />,
      badge: '1',
    },
    {
      id: 'bot-connect',
      label: { fa: 'اتصال تلگرام و بله', en: 'Telegram & Bale' },
      icon: <Bot className="w-4 h-4 shrink-0" />,
    },
    {
      id: 'transactions',
      label: { fa: 'تراکنش‌ها و لایسنس', en: 'Transactions' },
      icon: <Receipt className="w-4 h-4 shrink-0" />,
    },
    {
      id: 'content-manager',
      label: { fa: 'مدیریت محتوا و پاکسازی دمو', en: 'Content & Demo Data' },
      icon: <Sliders className="w-4 h-4 shrink-0" />,
    },
    {
      id: 'wp-export',
      label: { fa: 'نصب در وردپرس و المنتور', en: 'WordPress & Elementor' },
      icon: <Code2 className="w-4 h-4 shrink-0" />,
    },
  ];

  const getCourseProgress = (course: Course) => {
    const allLessonIds = course.modules.flatMap((m) => m.lessons.map((l) => l.id));
    if (allLessonIds.length === 0) return 0;
    const done = allLessonIds.filter((id) => completedLessons.includes(id)).length;
    return Math.round((done / allLessonIds.length) * 100);
  };

  const initials = currentUser.name.trim().slice(0, 2) || (isFa ? 'کا' : 'IR');

  const sidebarBody = (
    <aside
      className="flex flex-col h-full w-[264px] shrink-0 bg-white dark:bg-[#08110E] border-e border-[var(--iramo-card-border)] select-none transition-colors duration-200"
      aria-label={isFa ? 'منوی پنل کاربری' : 'User Panel Navigation'}
    >
      {/* Brand Header */}
      <div className="flex items-center justify-between px-5 h-16 border-b border-[var(--iramo-card-border)]">
        <button
          type="button"
          onClick={() => {
            onSelectSection('course');
            onCloseMobile();
          }}
          className="flex items-center gap-2.5 text-start focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-lg cursor-pointer"
        >
          <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-emerald-950/60 border border-[var(--iramo-card-border)] flex items-center justify-center overflow-hidden p-1">
            <img
              src={resolveBrandLogo(theme === 'dark' ? 'dark' : 'light')}
              alt="iRamoAi"
              referrerPolicy="no-referrer"
              className="w-full h-full object-contain"
            />
          </div>
          <span
            dir="ltr"
            className="text-[17px] font-bold tracking-tight text-slate-900 dark:text-white whitespace-nowrap shrink-0"
          >
            iRamo<span className="text-[var(--iramo-accent)]">Ai</span>
          </span>
        </button>

        <button
          type="button"
          onClick={onCloseMobile}
          className="lg:hidden p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-emerald-950/50"
          aria-label={isFa ? 'بستن منو' : 'Close menu'}
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Scrollable Menu Area */}
      <div className="flex-1 overflow-y-auto px-3.5 py-4 space-y-6">
        {/* Student Identity Row */}
        <div className="space-y-2">
          <div className="flex items-center gap-3 px-2.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#0D1A15] border border-[var(--iramo-card-border)]">
            <div className="w-9 h-9 rounded-lg bg-[var(--iramo-primary)] text-[var(--iramo-primary-fg)] font-semibold text-sm flex items-center justify-center shrink-0">
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">
                {currentUser.name}
              </p>
              <p className="text-xs text-slate-500 dark:text-emerald-200/60 truncate">
                {currentUser.telegramId || currentUser.email}
              </p>
            </div>
            <button
              type="button"
              onClick={onLogout}
              title={isFa ? 'خروج از حساب' : 'Sign Out'}
              className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer"
              aria-label={isFa ? 'خروج از حساب' : 'Sign out'}
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            type="button"
            onClick={() => {
              onBackToWebsite();
              onCloseMobile();
            }}
            className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-[var(--iramo-card-border)] hover:border-[var(--iramo-card-border-hover)] text-xs font-semibold text-slate-700 dark:text-emerald-300 hover:bg-slate-50 dark:hover:bg-emerald-950/50 transition-colors cursor-pointer"
          >
            {isFa ? (
              <ArrowRight className="w-3.5 h-3.5" />
            ) : (
              <ArrowLeft className="w-3.5 h-3.5" />
            )}
            <span>{isFa ? 'بازگشت به سایت اصلی' : 'Back to Website'}</span>
          </button>
        </div>

        {/* Main Navigation */}
        <div>
          <p className="px-2.5 mb-2 text-[11px] font-semibold text-slate-400 dark:text-emerald-200/45">
            {isFa ? 'منوی پنل کاربری' : 'Dashboard'}
          </p>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    onSelectSection(item.id);
                    onCloseMobile();
                  }}
                  className={`w-full flex items-center justify-between gap-2.5 px-3 py-2.5 rounded-xl text-[13.5px] font-medium transition-all duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
                    isActive
                      ? 'bg-slate-100 text-slate-950 font-semibold dark:bg-emerald-500/15 dark:text-emerald-300 border border-[var(--iramo-card-border)]'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 dark:text-slate-300/80 dark:hover:text-white dark:hover:bg-emerald-950/40 border border-transparent'
                  }`}
                >
                  <span className="flex items-center gap-2.5 min-w-0">
                    <span
                      className={
                        isActive
                          ? 'text-[var(--iramo-primary)] dark:text-emerald-400'
                          : 'text-slate-400 dark:text-slate-400'
                      }
                    >
                      {item.icon}
                    </span>
                    <span className="truncate whitespace-nowrap">
                      {isFa ? item.label.fa : item.label.en}
                    </span>
                  </span>
                  {item.badge && (
                    <span className="text-[11px] tabular-nums text-[#9A6E00] dark:text-[#FFBA00] font-semibold">
                      {toLocaleDigits(item.badge, lang)}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Latest Courses Quick Resume */}
        <div>
          <p className="px-2.5 mb-2 text-[11px] font-semibold text-slate-400 dark:text-emerald-200/45">
            {isFa ? 'آخرین دوره‌های فعال' : 'Latest course'}
          </p>
          <div className="space-y-1">
            {latestCourses.slice(0, 3).map((course) => {
              const pct = getCourseProgress(course);
              const colorDot =
                course.accentColor === 'blue'
                  ? 'bg-blue-500'
                  : course.accentColor === 'amber'
                  ? 'bg-[#FFBA00]'
                  : course.accentColor === 'emerald'
                  ? 'bg-emerald-500'
                  : 'bg-indigo-500';

              return (
                <button
                  key={course.id}
                  type="button"
                  onClick={() => {
                    onOpenCourse(course);
                    onCloseMobile();
                  }}
                  className="w-full flex items-center justify-between gap-2 px-2.5 py-2 rounded-lg text-start text-xs text-slate-600 hover:text-slate-950 hover:bg-slate-50 dark:text-slate-300/85 dark:hover:text-white dark:hover:bg-emerald-950/40 transition-colors cursor-pointer"
                >
                  <span className="flex items-center gap-2 min-w-0">
                    <span className={`w-2 h-2 rounded-sm shrink-0 ${colorDot}`} />
                    <span className="truncate">
                      {isFa ? course.title.fa : course.title.en}
                    </span>
                  </span>
                  <span className="text-[11px] tabular-nums text-slate-400 dark:text-emerald-300/60 shrink-0">
                    {toLocaleDigits(`${pct}%`, lang)}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom AI Study Overview Card */}
      <div className="p-3.5 border-t border-[var(--iramo-card-border)]">
        <div className="rounded-2xl p-3.5 bg-gradient-to-br from-[var(--iramo-primary-soft)] via-white to-slate-50 dark:from-[#0E1E18] dark:via-[#0B1613] dark:to-[#13251E] border border-[var(--iramo-card-border)]">
          <div className="flex items-center gap-2 mb-1.5">
            <div className="w-6 h-6 rounded-md bg-[var(--iramo-accent-soft)] text-[var(--iramo-accent)] flex items-center justify-center shrink-0">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
              {isFa ? 'برنامه مطالعه هوشمند' : 'Need an AI overview?'}
            </p>
          </div>
          <p className="text-[11.5px] leading-relaxed text-slate-600 dark:text-slate-300/80 mb-3">
            {isFa
              ? 'پیشرفت دوره‌ها و مسیر پیشنهادی امروز خود را در یک نگاه ببینید.'
              : 'See your progress, pending labs, and recommended next lesson instantly.'}
          </p>
          <button
            type="button"
            onClick={() => {
              onOpenStudyPlanner();
              onCloseMobile();
            }}
            className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold bg-slate-900 text-white hover:bg-slate-800 dark:bg-[#FFBA00] dark:text-slate-950 dark:hover:bg-[#E5A700] transition-colors cursor-pointer whitespace-nowrap"
          >
            <span>{isFa ? 'شروع تحلیل مسیر' : 'Start Session'}</span>
            {isFa ? (
              <ChevronLeft className="w-3.5 h-3.5" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </div>
    </aside>
  );

  return (
    <>
      <div className="hidden lg:block h-full shrink-0">{sidebarBody}</div>
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs"
            onClick={onCloseMobile}
            aria-hidden="true"
          />
          <div className="relative z-10 h-full max-w-[82vw] shadow-2xl">
            {sidebarBody}
          </div>
        </div>
      )}
    </>
  );
};
