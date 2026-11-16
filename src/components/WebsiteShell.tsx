import React, { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Globe,
  LayoutGrid,
  LogIn,
  Mail,
  Menu,
  Moon,
  ShieldCheck,
  Sparkles,
  Sun,
  X,
} from 'lucide-react';
import { motion } from 'motion/react';
import { resolveBrandLogo } from '../assets/media';
import { Lang, ThemeMode } from '../types/lms';
import { toLocaleDigits } from '../utils/formatters';
import { UserProfile } from './AuthModal';
import { SiteConfig } from './ContentManagerView';

export type SitePage =
  | 'home'
  | 'products'
  | 'ai-marketplace'
  | 'courses'
  | 'articles'
  | 'services'
  | 'lms';

interface WebsiteShellProps {
  lang: Lang;
  theme: ThemeMode;
  onToggleLang: () => void;
  onToggleTheme: () => void;
  activePage: SitePage;
  onNavigate: (page: SitePage) => void;
  currentUser: UserProfile | null;
  onOpenAuth: () => void;
  siteConfig: SiteConfig;
  wpRestUrl?: string;
  children: React.ReactNode;
}

function renderBrandWordmark(rawTitle: string) {
  const title = (rawTitle || 'iRamoAi').trim();
  if (title.includes('.')) {
    const parts = title.split('.');
    return (
      <>
        {parts[0]}
        <span className="text-[var(--iramo-accent)]">
          .{parts.slice(1).join('.')}
        </span>
      </>
    );
  }
  const aiMatch = title.match(/^(.*?)(ai)$/i);
  if (aiMatch && aiMatch[1]) {
    return (
      <>
        {aiMatch[1]}
        <span className="text-[var(--iramo-accent)]">{aiMatch[2]}</span>
      </>
    );
  }
  return title;
}

export const WebsiteShell: React.FC<WebsiteShellProps> = ({
  lang,
  theme,
  onToggleLang,
  onToggleTheme,
  activePage,
  onNavigate,
  currentUser,
  onOpenAuth,
  siteConfig,
  wpRestUrl,
  children,
}) => {
  const isFa = lang === 'fa';
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [footerEmail, setFooterEmail] = useState('');
  const [footerSubscribed, setFooterSubscribed] = useState(false);

  const handleFooterNewsletter = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = footerEmail.trim();
    if (!cleaned.includes('@')) return;
    if (wpRestUrl) {
      try {
        const base = wpRestUrl.replace(/\/$/, '');
        await fetch(`${base}/newsletter`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ channel: 'email', handle: cleaned }),
        });
      } catch {
        // Keep graceful UX feedback
      }
    }
    setFooterSubscribed(true);
    setFooterEmail('');
  };

  const navLinks: { id: SitePage; fa: string; en: string; visible: boolean }[] = [
    { id: 'products', fa: 'محصولات', en: 'Products', visible: true },
    { id: 'courses', fa: 'دوره‌های آموزشی', en: 'Courses', visible: true },
    {
      id: 'ai-marketplace',
      fa: 'ابزارهای هوش مصنوعی',
      en: 'AI Tools',
      visible: siteConfig.showAiTools,
    },
    {
      id: 'articles',
      fa: 'مقالات',
      en: 'Articles',
      visible: siteConfig.showArticles,
    },
    {
      id: 'services',
      fa: 'خدمات و مشاوره',
      en: 'Services',
      visible: siteConfig.showServices,
    },
  ];

  const visibleNavLinks = navLinks.filter((l) => l.visible);

  const handlePanelClick = () => {
    if (currentUser) {
      onNavigate('lms');
    } else {
      onOpenAuth();
    }
  };

  const tgHandle = (siteConfig.authChannels.telegramBotUsername || '@iRamoBot').replace(/^@/, '');
  const baleHandle = (siteConfig.authChannels.baleBotUsername || '@iRamoBaleBot').replace(/^@/, '');

  const socialChannels = [
    {
      id: 'telegram',
      label: isFa ? 'تلگرام' : 'Telegram',
      href: `https://t.me/${tgHandle}`,
      glowClass:
        'hover:border-sky-400/70 hover:text-sky-600 dark:hover:text-sky-300 hover:shadow-[0_0_24px_-2px_rgba(14,165,233,0.55)]',
      auraClass: 'bg-sky-500/15 dark:bg-sky-400/20',
      icon: (
        <svg viewBox="0 0 24 24" className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21.5 3.5 2.8 10.7c-.9.3-.8 1.6.1 1.9l4.7 1.5 1.8 5.5c.3.8 1.3 1 1.9.4l2.7-2.7 4.9 3.6c.7.5 1.7.1 1.9-.8l2.7-15.2c.2-.9-.7-1.6-1.5-1.3Z" />
          <path d="m8 14 9.5-7" />
        </svg>
      ),
    },
    {
      id: 'bale',
      label: isFa ? 'پیام‌رسان بله' : 'Bale',
      href: `https://ble.ir/${baleHandle}`,
      glowClass:
        'hover:border-emerald-400/70 hover:text-emerald-600 dark:hover:text-emerald-300 hover:shadow-[0_0_24px_-2px_rgba(16,185,129,0.55)]',
      auraClass: 'bg-emerald-500/15 dark:bg-emerald-400/20',
      icon: (
        <svg viewBox="0 0 24 24" className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5Z" />
          <path d="m9.5 12 1.8 1.8 3.5-3.6" />
        </svg>
      ),
    },
    {
      id: 'instagram',
      label: isFa ? 'اینستاگرام' : 'Instagram',
      href: 'https://instagram.com',
      glowClass:
        'hover:border-pink-400/70 hover:text-pink-600 dark:hover:text-pink-300 hover:shadow-[0_0_24px_-2px_rgba(236,72,153,0.5)]',
      auraClass: 'bg-pink-500/15 dark:bg-pink-400/20',
      icon: (
        <svg viewBox="0 0 24 24" className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
          <rect width="18" height="18" x="3" y="3" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.5" cy="6.5" r=".8" fill="currentColor" />
        </svg>
      ),
    },
    {
      id: 'youtube',
      label: isFa ? 'یوتیوب' : 'YouTube',
      href: 'https://youtube.com',
      glowClass:
        'hover:border-rose-400/70 hover:text-rose-600 dark:hover:text-rose-300 hover:shadow-[0_0_24px_-2px_rgba(244,63,94,0.5)]',
      auraClass: 'bg-rose-500/15 dark:bg-rose-400/20',
      icon: (
        <svg viewBox="0 0 24 24" className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
          <path d="m10 15 5-3-5-3v6Z" fill="currentColor" stroke="none" />
        </svg>
      ),
    },
    {
      id: 'github',
      label: isFa ? 'گیت‌هاب' : 'GitHub',
      href: 'https://github.com',
      glowClass:
        'hover:border-[#FFBA00]/75 hover:text-[#B38200] dark:hover:text-[#FFBA00] hover:shadow-[0_0_24px_-2px_rgba(255,186,0,0.5)]',
      auraClass: 'bg-[#FFBA00]/15 dark:bg-[#FFBA00]/20',
      icon: (
        <svg viewBox="0 0 24 24" className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
          <path d="M9 18c-4.51 2-5-2-7-2" />
        </svg>
      ),
    },
    {
      id: 'linkedin',
      label: isFa ? 'لینکدین' : 'LinkedIn',
      href: 'https://linkedin.com',
      glowClass:
        'hover:border-indigo-400/70 hover:text-indigo-600 dark:hover:text-indigo-300 hover:shadow-[0_0_24px_-2px_rgba(99,102,241,0.5)]',
      auraClass: 'bg-indigo-500/15 dark:bg-indigo-400/20',
      icon: (
        <svg viewBox="0 0 24 24" className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
          <rect width="4" height="12" x="2" y="9" />
          <circle cx="4" cy="4" r="2" />
        </svg>
      ),
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[var(--iramo-canvas)] dark:bg-[#050C0A] text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {/* Pure Floating Rounded Header */}
      <header className="fixed top-0 inset-x-0 z-40 px-4 sm:px-6 pt-3 bg-transparent pointer-events-none">
        <div className="max-w-[1460px] mx-auto relative rounded-full border border-[var(--iramo-card-border)] dark:border-emerald-500/25 bg-white/90 dark:bg-[#07130F]/90 backdrop-blur-md shadow-sm shadow-slate-900/5 dark:shadow-black/40 pointer-events-auto">
          <div className="h-14 px-4 sm:px-5 rounded-full flex items-center justify-between gap-3">
            {/* Zone 1: Brand Mark (Zero dot in iRamoAi) */}
            <button
              type="button"
              onClick={() => onNavigate('home')}
              className="flex items-center gap-2.5 text-lg font-extrabold tracking-tight whitespace-nowrap shrink-0 cursor-pointer"
            >
              <img
                src={resolveBrandLogo(theme === 'dark' ? 'header' : 'light')}
                alt={siteConfig.brandTitle}
                referrerPolicy="no-referrer"
                className="w-7 h-7 object-contain"
              />
              <span dir="ltr" className="text-slate-900 dark:text-white">
                {renderBrandWordmark(siteConfig.brandTitle)}
              </span>
            </button>

            {/* Zone 2: Segmented Pill Navigation */}
            <nav
              className="hidden lg:flex items-center gap-1 p-1 rounded-full bg-slate-100/90 dark:bg-[#050C0A]/85 border border-[var(--iramo-card-border)] dark:border-emerald-500/15"
              aria-label={isFa ? 'ناوبری اصلی سایت' : 'Primary navigation'}
            >
              {visibleNavLinks.map((link) => {
                const active = activePage === link.id;
                return (
                  <button
                    key={link.id}
                    type="button"
                    onClick={() => onNavigate(link.id)}
                    className={`relative px-3.5 py-1.5 rounded-full text-[13px] font-medium whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                      active
                        ? 'text-[var(--iramo-primary)] dark:text-white font-semibold'
                        : 'text-slate-600 dark:text-slate-300/85 hover:text-slate-950 dark:hover:text-white'
                    }`}
                  >
                    {active && (
                      <motion.span
                        layoutId="header-nav-pill"
                        transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                        className="absolute inset-0 rounded-full bg-white dark:bg-[#0F271E] border border-[var(--iramo-primary-border)] dark:border-emerald-500/30 shadow-xs -z-0"
                      />
                    )}
                    <span className="relative z-10">
                      {isFa ? link.fa : link.en}
                    </span>
                  </button>
                );
              })}
            </nav>

            {/* Zone 3: Theme Toggle + Language Switcher + Panel CTA */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={onToggleTheme}
                aria-label={
                  theme === 'dark'
                    ? isFa
                      ? 'تغییر به حالت روشن'
                      : 'Switch to light mode'
                    : isFa
                    ? 'تغییر به حالت تیره'
                    : 'Switch to dark mode'
                }
                title={
                  theme === 'dark'
                    ? isFa
                      ? 'حالت روشن'
                      : 'Light mode'
                    : isFa
                    ? 'حالت تیره'
                    : 'Dark mode'
                }
                className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200/80 dark:bg-[#0B1914] dark:hover:bg-[#11261E] border border-slate-200 dark:border-emerald-500/20 text-slate-700 dark:text-[#FFBA00] flex items-center justify-center transition-colors cursor-pointer shrink-0"
              >
                {theme === 'dark' ? (
                  <Sun className="w-4 h-4" />
                ) : (
                  <Moon className="w-4 h-4 text-slate-700" />
                )}
              </button>

              <button
                type="button"
                onClick={onToggleLang}
                className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200/80 dark:bg-[#0B1914] border border-slate-200 dark:border-emerald-500/20 dark:hover:border-emerald-400/50 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <Globe className="w-3.5 h-3.5 text-slate-500 dark:text-slate-300" />
                <span>{isFa ? 'فارسی | EN' : 'EN | فارسی'}</span>
              </button>

              <button
                type="button"
                onClick={handlePanelClick}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--iramo-primary)] hover:bg-[var(--iramo-primary-hover)] text-[var(--iramo-primary-fg)] dark:bg-[#0A261C] dark:hover:bg-[#0E3326] border border-transparent dark:border-emerald-500/45 dark:text-emerald-300 text-xs font-bold shadow-xs transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                {currentUser ? (
                  <>
                    <LayoutGrid className="w-3.5 h-3.5 text-current dark:text-emerald-400" />
                    <span>{isFa ? 'پنل کاربری' : 'Dashboard'}</span>
                  </>
                ) : (
                  <>
                    <LogIn className="w-3.5 h-3.5 text-current dark:text-emerald-400" />
                    <span>{isFa ? 'ورود / پنل کاربری' : 'Sign In / Panel'}</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setMobileMenuOpen((o) => !o)}
                className="lg:hidden p-2 rounded-full border border-slate-200 dark:border-emerald-500/25 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-emerald-950/60 cursor-pointer"
                aria-label={isFa ? 'منو' : 'Menu'}
              >
                {mobileMenuOpen ? (
                  <X className="w-4 h-4" />
                ) : (
                  <Menu className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Nav Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-2 max-w-[1460px] mx-auto rounded-2xl bg-white/95 dark:bg-[#07130F]/95 backdrop-blur-md border border-slate-200 dark:border-emerald-500/25 p-3 space-y-1 shadow-xl pointer-events-auto">
            <button
              type="button"
              onClick={() => {
                onNavigate('home');
                setMobileMenuOpen(false);
              }}
              className={`block w-full text-start px-3.5 py-2 rounded-xl text-sm font-medium cursor-pointer ${
                activePage === 'home'
                  ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-[#FFBA00] font-semibold'
                  : 'text-slate-700 dark:text-slate-300'
              }`}
            >
              {isFa ? 'صفحه اصلی' : 'Home'}
            </button>
            {visibleNavLinks.map((link) => (
              <button
                key={link.id}
                type="button"
                onClick={() => {
                  onNavigate(link.id);
                  setMobileMenuOpen(false);
                }}
                className={`block w-full text-start px-3.5 py-2 rounded-xl text-sm font-medium cursor-pointer ${
                  activePage === link.id
                    ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-[#FFBA00] font-semibold'
                    : 'text-slate-700 dark:text-slate-300'
                }`}
              >
                {isFa ? link.fa : link.en}
              </button>
            ))}
            <div className="pt-2 mt-1 border-t border-slate-200 dark:border-emerald-500/15 flex items-center justify-between px-2">
              <button
                type="button"
                onClick={onToggleLang}
                className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 cursor-pointer"
              >
                {isFa ? 'تغییر زبان به English' : 'Switch to فارسی'}
              </button>
              <button
                type="button"
                onClick={onToggleTheme}
                className="text-xs font-semibold text-slate-600 dark:text-[#FFBA00] cursor-pointer"
              >
                {theme === 'dark'
                  ? isFa
                    ? 'حالت روشن'
                    : 'Light Mode'
                  : isFa
                  ? 'حالت تیره'
                  : 'Dark Mode'}
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Page Body */}
      <main className={`flex-1 ${activePage === 'home' ? '' : 'pt-20'}`}>
        {children}
      </main>

      {/* Upgraded Multi-Column Professional Footer with Glowing Social Icons */}
      <footer className="relative mt-16 border-t border-slate-200/90 dark:border-emerald-500/15 bg-white dark:bg-[#040A08] overflow-hidden">
        {/* Ambient top horizon glow */}
        <div
          aria-hidden="true"
          className="h-px w-full bg-gradient-to-r from-transparent via-emerald-500/45 to-transparent"
        />

        <div className="max-w-[1460px] mx-auto px-4 sm:px-6 pt-12 pb-8 space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10">
            {/* Column 1: Brand Identity (Strictly RTL/LTR aligned with logo) + Glowing Social Row */}
            <div className="lg:col-span-5 space-y-5 text-start">
              <button
                type="button"
                onClick={() => onNavigate('home')}
                className="w-full flex items-center justify-start gap-3.5 text-start cursor-pointer"
              >
                <div className="w-11 h-11 rounded-xl bg-slate-50 dark:bg-[#0B1B15] border border-slate-200 dark:border-emerald-500/25 flex items-center justify-center p-1.5 shadow-xs shrink-0">
                  <img
                    src={resolveBrandLogo(theme === 'dark' ? 'header' : 'light')}
                    alt={siteConfig.brandTitle}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="min-w-0 flex-1 text-start">
                  <div className="flex items-center justify-start">
                    <span
                      dir="ltr"
                      className="inline-block text-xl font-extrabold text-slate-900 dark:text-white tracking-tight"
                    >
                      {renderBrandWordmark(siteConfig.brandTitle)}
                    </span>
                  </div>
                  <p className="text-[11.5px] font-medium text-[var(--iramo-primary)] mt-0.5 text-start">
                    {isFa
                      ? 'آکادمی هوش مصنوعی، ربات‌سازی و مهندسی نرم‌افزار'
                      : 'AI Academy, Bots & Software Studio'}
                  </p>
                </div>
              </button>

              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-md text-start">
                {isFa
                  ? 'پلتفرم یکپارچه ارائه محصولات نرم‌افزاری هوشمند، دوره‌های تخصصی کاربردی، دایرکتوری انتخاب ابزارهای AI و زیرساخت بومی اتصال به تلگرام، بله و وردپرس.'
                  : 'Unified platform for intelligent software products, practical engineering courses, curated AI tools directory, and native Telegram, Bale & WordPress automation.'}
              </p>

              {/* Glowing Social Media Icons */}
              <div className="space-y-2.5">
                <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                  {isFa ? 'ما را در شبکه‌های اجتماعی دنبال کنید' : 'Connect with us'}
                </p>
                <div className="flex flex-wrap items-center gap-2.5">
                  {socialChannels.map((soc) => (
                    <a
                      key={soc.id}
                      href={soc.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={soc.label}
                      aria-label={soc.label}
                      className={`group relative w-10 h-10 rounded-xl bg-slate-50 dark:bg-[#0A1712] border border-[var(--iramo-card-border)] dark:border-emerald-500/20 text-slate-600 dark:text-slate-300 flex items-center justify-center transition-all duration-200 hover:-translate-y-0.5 ${soc.glowClass}`}
                    >
                      <span
                        aria-hidden="true"
                        className={`absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 blur-md transition-opacity duration-200 -z-10 ${soc.auraClass}`}
                      />
                      {soc.icon}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Column 2: Quick Navigation */}
            <div className="lg:col-span-2 space-y-3.5 text-start">
              <h3 className="text-xs font-extrabold text-slate-900 dark:text-white tracking-wide">
                {isFa ? 'بخش‌های سایت' : 'Navigation'}
              </h3>
              <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-400">
                <li>
                  <button
                    type="button"
                    onClick={() => onNavigate('home')}
                    className="hover:text-[var(--iramo-primary)] transition-colors cursor-pointer"
                  >
                    {isFa ? 'صفحه اصلی' : 'Home'}
                  </button>
                </li>
                {visibleNavLinks.map((link) => (
                  <li key={link.id}>
                    <button
                      type="button"
                      onClick={() => onNavigate(link.id)}
                      className="hover:text-[var(--iramo-primary)] transition-colors cursor-pointer"
                    >
                      {isFa ? link.fa : link.en}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3: Ecosystem & Tools */}
            <div className="lg:col-span-2 space-y-3.5 text-start">
              <h3 className="text-xs font-extrabold text-slate-900 dark:text-white tracking-wide">
                {isFa ? 'امکانات و پلتفرم' : 'Ecosystem'}
              </h3>
              <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-400">
                <li>
                  <button
                    type="button"
                    onClick={handlePanelClick}
                    className="hover:text-[var(--iramo-primary)] transition-colors cursor-pointer"
                  >
                    {isFa ? 'پنل کاربری و آموزش' : 'User Workspace'}
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => onNavigate('products')}
                    className="hover:text-[var(--iramo-primary)] transition-colors cursor-pointer"
                  >
                    {isFa ? 'نرم‌افزار حسابیار' : 'Hesabyar Automation'}
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => onNavigate('ai-marketplace')}
                    className="hover:text-[var(--iramo-primary)] transition-colors cursor-pointer"
                  >
                    {isFa ? 'دایرکتوری ابزارهای AI' : 'AI Directory'}
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => onNavigate('services')}
                    className="hover:text-[var(--iramo-primary)] transition-colors cursor-pointer"
                  >
                    {isFa ? 'پلاگین وردپرس و المنتور' : 'WordPress & Elementor'}
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 4: Newsletter + Project Advisory & Trust Highlights */}
            <div className="lg:col-span-3">
              <div className="rounded-2xl p-5 bg-slate-50/90 dark:bg-[#091511] border border-[var(--iramo-card-border)] space-y-4 text-start">
                <div className="space-y-1">
                  <p className="text-xs font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[var(--iramo-accent)] shrink-0" />
                    <span>
                      {isFa
                        ? 'خبرنامه هفتگی ابزارها و آموزش‌های AI'
                        : 'Weekly AI Tools & Guides Digest'}
                    </span>
                  </p>
                  <p className="text-[11.5px] text-slate-600 dark:text-slate-400 leading-relaxed">
                    {isFa
                      ? 'معرفی جدیدترین ابزارهای هوش مصنوعی، پرامپت‌های کاربردی و آپدیت محصولات را در ایمیل دریافت کنید.'
                      : 'Receive curated AI tools, tested prompts, and product releases in your inbox.'}
                  </p>
                </div>

                {footerSubscribed ? (
                  <div className="p-3 rounded-xl bg-[var(--iramo-primary-soft)] border border-[var(--iramo-primary-border)] text-xs text-[var(--iramo-primary)] flex items-center gap-2">
                    <Check className="w-4 h-4 shrink-0" />
                    <span>
                      {isFa
                        ? 'عضویت شما در خبرنامه iRamoAi با موفقیت ثبت شد!'
                        : 'Subscribed to iRamoAi digest!'}
                    </span>
                  </div>
                ) : (
                  <form onSubmit={handleFooterNewsletter} className="flex items-center gap-2">
                    <div className="relative flex-1 min-w-0">
                      <Mail className="w-3.5 h-3.5 text-slate-400 absolute top-1/2 -translate-y-1/2 start-3" />
                      <input
                        type="email"
                        required
                        dir="ltr"
                        value={footerEmail}
                        onChange={(e) => setFooterEmail(e.target.value)}
                        placeholder="you@domain.com"
                        className="w-full ps-8 pe-2.5 py-2 rounded-xl bg-white dark:bg-[#050C0A] border border-[var(--iramo-card-border)] text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-[var(--iramo-primary-border)]"
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-3.5 py-2 rounded-xl bg-[var(--iramo-accent)] hover:bg-[var(--iramo-accent-hover)] text-[var(--iramo-accent-fg)] text-xs font-bold transition-colors cursor-pointer shrink-0 whitespace-nowrap"
                    >
                      {isFa ? 'عضویت' : 'Join'}
                    </button>
                  </form>
                )}

                <div className="pt-3 border-t border-[var(--iramo-card-border)] flex items-center justify-between gap-2 text-[11px]">
                  <span className="inline-flex items-center gap-1.5 text-slate-600 dark:text-slate-300 font-medium">
                    <ShieldCheck className="w-3.5 h-3.5 text-[var(--iramo-primary)] shrink-0" />
                    <span>
                      {isFa ? 'تضمین آپدیت و پشتیبانی فنی' : 'Verified Updates & SLA'}
                    </span>
                  </span>
                  <button
                    type="button"
                    onClick={() => onNavigate('services')}
                    className="inline-flex items-center gap-1 font-bold text-[var(--iramo-primary)] hover:underline cursor-pointer shrink-0"
                  >
                    <span>{isFa ? 'مشاوره پروژه' : 'Consulting'}</span>
                    {isFa ? (
                      <ArrowLeft className="w-3 h-3" />
                    ) : (
                      <ArrowRight className="w-3 h-3" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Legal & Language Strip */}
          <div className="pt-6 border-t border-slate-200/80 dark:border-emerald-500/15 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
            <p className="tabular-nums">
              {isFa
                ? `© ${toLocaleDigits('2025', lang)} ${siteConfig.brandTitle} — طراحی و مهندسی پلتفرم هوشمند`
                : `© 2025 ${siteConfig.brandTitle} — Intelligent Software & Engineering Academy`}
            </p>
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={onToggleTheme}
                className="hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
              >
                {theme === 'dark'
                  ? isFa
                    ? 'نمای روشن سایت'
                    : 'Light Theme'
                  : isFa
                  ? 'نمای تیره سایت'
                  : 'Dark Theme'}
              </button>
              <span aria-hidden="true">·</span>
              <button
                type="button"
                onClick={onToggleLang}
                className="hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
              >
                {isFa ? 'English Version' : 'نسخه فارسی'}
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
