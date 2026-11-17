import React, { useState, useRef, useEffect } from 'react';
import {
  Bell,
  Bot,
  Globe,
  Menu,
  Moon,
  Search,
  Sun,
  CheckCheck,
} from 'lucide-react';
import { Lang, NavSection, NotificationItem, ThemeMode } from '../types/lms';
import { toLocaleDigits } from '../utils/formatters';

interface TopBarProps {
  lang: Lang;
  theme: ThemeMode;
  activeSection: NavSection;
  onToggleLang: () => void;
  onToggleTheme: () => void;
  onOpenSearch: () => void;
  onOpenMobileMenu: () => void;
  notifications: NotificationItem[];
  onMarkAllRead: () => void;
}

const SECTION_LABELS: Record<NavSection, { fa: string; en: string }> = {
  home: { fa: 'پیشخوان یادگیری', en: 'Home' },
  course: { fa: 'دوره‌ها و کتابخانه', en: 'Course' },
  'ai-tools': { fa: 'ابزارهای هوش مصنوعی', en: 'AI Tools Hub' },
  assignments: { fa: 'تکالیف و پروژه‌ها', en: 'Assignments' },
  'bot-connect': { fa: 'اتصال تلگرام و بله', en: 'Telegram & Bale' },
  transactions: { fa: 'تراکنش‌ها و لایسنس‌ها', en: 'Transactions' },
  'content-manager': { fa: 'مدیریت محتوا و داده‌های نمونه', en: 'Content & Demo Manager' },
  'wp-export': { fa: 'خروجی وردپرس و المنتور', en: 'WordPress & Elementor' },
};

export const TopBar: React.FC<TopBarProps> = ({
  lang,
  theme,
  activeSection,
  onToggleLang,
  onToggleTheme,
  onOpenSearch,
  onOpenMobileMenu,
  notifications,
  onMarkAllRead,
}) => {
  const isFa = lang === 'fa';
  const [notifOpen, setNotifOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-30 h-16 px-4 sm:px-6 flex items-center justify-between gap-4 bg-white/90 dark:bg-[#08110E]/90 backdrop-blur-md border-b border-[var(--iramo-card-border)]">
      {/* Zone 1: Menu trigger + Page Title */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 rounded-xl border border-[var(--iramo-card-border)] text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-emerald-950/50 cursor-pointer"
          aria-label={isFa ? 'باز کردن منو' : 'Open navigation'}
        >
          <Menu className="w-4 h-4" />
        </button>
        <h1 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white truncate">
          {isFa ? SECTION_LABELS[activeSection].fa : SECTION_LABELS[activeSection].en}
        </h1>
      </div>

      {/* Zone 2: Central Search Trigger (Cmd+K) */}
      <button
        type="button"
        onClick={onOpenSearch}
        className="hidden sm:flex items-center justify-between gap-4 w-full max-w-sm px-3.5 py-2 rounded-xl bg-slate-100/80 hover:bg-slate-100 dark:bg-[#0D1A15] dark:hover:bg-[#11221B] border border-[var(--iramo-card-border)] text-slate-500 dark:text-slate-400 text-xs transition-colors cursor-pointer"
      >
        <span className="flex items-center gap-2 truncate">
          <Search className="w-3.5 h-3.5 shrink-0 text-slate-400 dark:text-emerald-400" />
          <span className="truncate">
            {isFa ? 'جستجو در دوره‌ها، ابزارها و دروس...' : 'Search courses, tools, lessons...'}
          </span>
        </span>
        <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-[#050C0A] border border-[var(--iramo-card-border)] text-[10px] font-mono text-slate-500 dark:text-emerald-300 shrink-0">
          ⌘K
        </kbd>
      </button>

      {/* Zone 3: Language, Theme & Notifications */}
      <div className="flex items-center gap-2 shrink-0">
        <button
          type="button"
          onClick={onOpenSearch}
          className="sm:hidden p-2 rounded-xl border border-[var(--iramo-card-border)] text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-emerald-950/50 cursor-pointer"
          aria-label={isFa ? 'جستجو' : 'Search'}
        >
          <Search className="w-4 h-4" />
        </button>

        {/* Bilingual RTL/LTR Switch */}
        <button
          type="button"
          onClick={onToggleLang}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[var(--iramo-card-border)] bg-white dark:bg-[#0D1A15] text-xs font-semibold text-slate-700 dark:text-slate-200 hover:border-[var(--iramo-card-border-hover)] transition-colors cursor-pointer whitespace-nowrap shrink-0"
          title={isFa ? 'تغییر زبان به انگلیسی' : 'Switch to Persian RTL'}
        >
          <Globe className="w-3.5 h-3.5 text-[var(--iramo-primary)] dark:text-emerald-400" />
          <span>{isFa ? 'FA | EN' : 'EN | FA'}</span>
        </button>

        {/* Light Cortex / Dark Emerald Switch */}
        <button
          type="button"
          onClick={onToggleTheme}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-[var(--iramo-card-border)] bg-white dark:bg-[#0D1A15] text-xs font-medium text-slate-700 dark:text-emerald-300 hover:border-[var(--iramo-card-border-hover)] transition-colors cursor-pointer whitespace-nowrap shrink-0"
          aria-label={isFa ? 'تغییر تم روشن و تاریک' : 'Toggle theme'}
          title={
            theme === 'dark'
              ? isFa
                ? 'نمای روشن (Cortex)'
                : 'Switch to Light Mode'
              : isFa
              ? 'نمای تاریک زمردی'
              : 'Switch to Dark Emerald'
          }
        >
          {theme === 'dark' ? (
            <Sun className="w-3.5 h-3.5 text-[#FFBA00]" />
          ) : (
            <Moon className="w-3.5 h-3.5 text-slate-600" />
          )}
          <span className="hidden md:inline">
            {theme === 'dark'
              ? isFa
                ? 'حالت روشن'
                : 'Light'
              : isFa
              ? 'سبز زمردی'
              : 'Emerald Dark'}
          </span>
        </button>

        {/* Notifications Popover */}
        <div className="relative" ref={notifRef}>
          <button
            type="button"
            onClick={() => setNotifOpen((prev) => !prev)}
            className="relative p-2 rounded-xl border border-[var(--iramo-card-border)] bg-white dark:bg-[#0D1A15] text-slate-600 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-emerald-950/50 transition-colors cursor-pointer"
            aria-label={isFa ? 'اعلان‌ها' : 'Notifications'}
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -end-1 w-4 h-4 rounded-full bg-[var(--iramo-accent)] text-[var(--iramo-accent-fg)] text-[10px] font-bold tabular-nums flex items-center justify-center">
                {toLocaleDigits(unreadCount, lang)}
              </span>
            )}
          </button>

          {notifOpen && (
            <div className="absolute end-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white dark:bg-[#0B1613] border border-[var(--iramo-card-border)] shadow-xl overflow-hidden z-50">
              <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--iramo-card-border)]">
                <span className="text-xs font-bold text-slate-900 dark:text-white">
                  {isFa ? 'اعلان‌های آکادمی و ربات' : 'Academy & Bot Alerts'}
                </span>
                <button
                  type="button"
                  onClick={onMarkAllRead}
                  className="flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  <span>{isFa ? 'خوانده شد' : 'Mark all read'}</span>
                </button>
              </div>
              <div className="divide-y divide-slate-100 dark:divide-emerald-500/10 max-h-80 overflow-y-auto">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`px-4 py-3 text-start transition-colors ${
                      n.read
                        ? 'opacity-70'
                        : 'bg-emerald-50/40 dark:bg-emerald-950/25'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                        {isFa ? n.title.fa : n.title.en}
                      </span>
                      <span className="text-[11px] text-slate-400 dark:text-slate-400 shrink-0">
                        {isFa ? n.time.fa : n.time.en}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300/80 leading-relaxed">
                      {isFa ? n.detail.fa : n.detail.en}
                    </p>
                    <div className="mt-1.5 flex items-center gap-1.5 text-[11px] text-slate-400 dark:text-emerald-300/60">
                      <Bot className="w-3 h-3" />
                      <span>
                        {n.channel === 'telegram'
                          ? isFa
                            ? 'همگام با ربات تلگرام'
                            : 'Synced with Telegram'
                          : n.channel === 'bale'
                          ? isFa
                            ? 'همگام با پیام‌رسان بله'
                            : 'Synced with Bale'
                          : isFa
                          ? 'پلتفرم آموزش iRamo'
                          : 'iRamo Academy'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
