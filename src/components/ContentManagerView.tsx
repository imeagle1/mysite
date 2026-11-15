import React, { useState } from 'react';
import {
  AlertTriangle,
  BookOpen,
  Bot,
  CheckCircle2,
  Cpu,
  Database,
  FileText,
  Layers,
  Lightbulb,
  MessageSquareCode,
  Plus,
  RotateCcw,
  Sliders,
  Trash2,
  Type,
  UserPlus,
} from 'lucide-react';
import { courseAiImg, servicesNeuralImg } from '../assets/media';
import { SoftwareProduct } from '../data/lmsData';
import {
  AITool,
  Article,
  ArticleCategory,
  Course,
  CourseCategory,
  Lang,
} from '../types/lms';
import { toLocaleDigits } from '../utils/formatters';

export type PersianFontOption =
  | 'vazirmatn'
  | 'rubik'
  | 'readex'
  | 'noto-arabic'
  | 'custom';

export type SmsProviderOption = 'kavenegar' | 'melipayamak' | 'faraz' | 'custom';

export type AuthMethodKey = 'telegram' | 'bale' | 'sms' | 'email';

export interface QuickTipItem {
  id: string;
  fa: string;
  en: string;
  isDemo?: boolean;
}

export interface AuthChannelsConfig {
  telegram: boolean;
  bale: boolean;
  sms: boolean;
  email: boolean;
  defaultChannel: AuthMethodKey;
  allowRegistration: boolean;
  telegramBotUsername: string;
  baleBotUsername: string;
  smsProvider: SmsProviderOption;
  smsPatternCode: string;
}

export interface SiteConfig {
  brandTitle: string;
  accentColor: 'emerald' | 'amber' | 'blue';
  fontFamily: PersianFontOption;
  customFontName: string;
  showArticles: boolean;
  showAiTools: boolean;
  showServices: boolean;
  authChannels: AuthChannelsConfig;
  quickTips: QuickTipItem[];
}

interface ContentManagerViewProps {
  lang: Lang;
  siteConfig: SiteConfig;
  onUpdateSiteConfig: (cfg: SiteConfig) => void;
  products: SoftwareProduct[];
  courses: Course[];
  tools: AITool[];
  articles: Article[];
  onClearDemoSection: (
    section: 'all' | 'products' | 'courses' | 'tools' | 'articles' | 'ops'
  ) => void;
  onRestoreDemoData: () => void;
  onAddCustomArticle: (article: Article) => void;
  onAddCustomCourse: (course: Course) => void;
}

export const ContentManagerView: React.FC<ContentManagerViewProps> = ({
  lang,
  siteConfig,
  onUpdateSiteConfig,
  products,
  courses,
  tools,
  articles,
  onClearDemoSection,
  onRestoreDemoData,
  onAddCustomArticle,
  onAddCustomCourse,
}) => {
  const isFa = lang === 'fa';
  const [confirmTarget, setConfirmTarget] = useState<
    null | 'all' | 'products' | 'courses' | 'tools' | 'articles' | 'ops'
  >(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Quick Add Article Form
  const [artTitle, setArtTitle] = useState('');
  const [artExcerpt, setArtExcerpt] = useState('');
  const [artCategory, setArtCategory] = useState<ArticleCategory>('AI');

  // Quick Add Course Form
  const [courseTitle, setCourseTitle] = useState('');
  const [coursePrice, setCoursePrice] = useState('1850000');
  const [courseCategory, setCourseCategory] = useState<CourseCategory>('AI');

  // Quick Add Tip Form
  const [tipInputFa, setTipInputFa] = useState('');
  const [tipInputEn, setTipInputEn] = useState('');

  const demoProductsCount = products.filter((p) => p.id.startsWith('prod-')).length;
  const demoCoursesCount = courses.filter((c) => c.isDemo !== false).length;
  const demoToolsCount = tools.filter((t) => t.isDemo !== false).length;
  const demoArticlesCount = articles.filter((a) => a.isDemo !== false).length;

  const triggerFeedback = (msg: string) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleConfirmClear = () => {
    if (!confirmTarget) return;
    onClearDemoSection(confirmTarget);
    triggerFeedback(
      confirmTarget === 'all'
        ? isFa
          ? 'تمام داده‌های نمونه (از جمله ابزارک نکات سریع مقالات) با موفقیت پاکسازی شدند.'
          : 'All demo data has been cleared.'
        : isFa
        ? 'داده‌های نمونه این بخش پاکسازی شدند.'
        : 'Selected demo data cleared.'
    );
    setConfirmTarget(null);
  };

  const updateAuth = (patch: Partial<AuthChannelsConfig>) => {
    const nextAuth: AuthChannelsConfig = {
      ...siteConfig.authChannels,
      ...patch,
    };

    // Ensure at least one auth channel stays active
    const anyActive =
      nextAuth.telegram || nextAuth.bale || nextAuth.sms || nextAuth.email;
    if (!anyActive) {
      triggerFeedback(
        isFa
          ? 'حداقل یک روش ورود باید فعال بماند تا کاربران به پنل دسترسی داشته باشند.'
          : 'At least one sign-in channel must remain enabled.'
      );
      return;
    }

    // Ensure defaultChannel stays aligned with an enabled channel
    if (!nextAuth[nextAuth.defaultChannel]) {
      const firstActive = (['telegram', 'bale', 'sms', 'email'] as AuthMethodKey[]).find(
        (k) => nextAuth[k]
      );
      if (firstActive) nextAuth.defaultChannel = firstActive;
    }

    onUpdateSiteConfig({
      ...siteConfig,
      authChannels: nextAuth,
    });
  };

  const handleCreateArticle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!artTitle.trim()) return;
    const newArticle: Article = {
      id: `custom-art-${Date.now()}`,
      slug: `article-${Date.now()}`,
      title: { fa: artTitle.trim(), en: artTitle.trim() },
      excerpt: {
        fa: artExcerpt.trim() || 'مقاله اختصاصی اضافه شده توسط مدیر سایت.',
        en: artExcerpt.trim() || 'Custom article published by site admin.',
      },
      category: artCategory,
      tags: { fa: [artCategory, 'اختصاصی'], en: [artCategory, 'Custom'] },
      author: { fa: 'مدیر سایت iRamoAi', en: 'Site Admin' },
      publishedAt: { fa: 'امروز', en: 'Today' },
      readMinutes: 5,
      views: 1,
      isDemo: false,
      thumbnail: servicesNeuralImg,
      sections: [
        {
          id: 's1',
          heading: { fa: 'مقدمه و توضیحات', en: 'Overview' },
          body: {
            fa:
              artExcerpt.trim() ||
              'متن کامل مقاله را از ویرایشگر وردپرس یا پنل مدیریت ویرایش کنید.',
            en: artExcerpt.trim() || 'Full article body ready for editing.',
          },
        },
      ],
    };
    onAddCustomArticle(newArticle);
    setArtTitle('');
    setArtExcerpt('');
    triggerFeedback(isFa ? 'مقاله جدید به سایت اضافه شد!' : 'New article published!');
  };

  const handleCreateCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseTitle.trim()) return;
    const priceNum = Number(coursePrice) || 0;
    const newCourse: Course = {
      id: `custom-course-${Date.now()}`,
      slug: `course-${Date.now()}`,
      title: { fa: courseTitle.trim(), en: courseTitle.trim() },
      subtitle: {
        fa: 'دوره اختصاصی اضافه شده در پنل مدیریت محتوا',
        en: 'Custom course created from Content Manager',
      },
      description: {
        fa: 'سرفصل‌ها و ویدیوهای این دوره از پیشخوان وردپرس یا پنل مدیریت قابل تکمیل است.',
        en: 'Modules and video streams can be attached from WordPress Admin.',
      },
      category: courseCategory,
      format: 'Video',
      durationTier: 'medium',
      totalDuration: { fa: '۴ ساعت', en: '4h 00m' },
      lessonCount: 4,
      moduleCount: 1,
      enrolled: true,
      featured: false,
      isNew: true,
      isDemo: false,
      accentColor: 'emerald',
      thumbnail: courseAiImg,
      instructor: { fa: 'تیم مدرسان iRamoAi', en: 'iRamoAi Faculty' },
      priceToman: priceNum,
      priceUsd: Math.max(19, Math.round(priceNum / 60000)),
      modules: [
        {
          id: `mod-${Date.now()}`,
          title: { fa: 'فصل اول · شروع دوره', en: 'Module 1 · Getting Started' },
          lessons: [
            {
              id: `les-${Date.now()}`,
              title: { fa: 'معرفی و نقشه راه', en: 'Introduction & Roadmap' },
              duration: '12:00',
              durationMinutes: 12,
              type: 'video',
              isFreePreview: true,
              summary: {
                fa: 'آشنایی با ساختار کلی دوره و پیش‌نیازها.',
                en: 'Overview of course structure and prerequisites.',
              },
              keyTakeaways: {
                fa: ['آشنایی با ابزارها', 'نحوه دریافت فایل‌ها'],
                en: ['Tooling overview', 'Resource setup'],
              },
            },
          ],
        },
      ],
    };
    onAddCustomCourse(newCourse);
    setCourseTitle('');
    triggerFeedback(isFa ? 'دوره جدید با موفقیت ساخته شد!' : 'New course created!');
  };

  const handleAddQuickTip = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tipInputFa.trim()) return;
    const newTip: QuickTipItem = {
      id: `tip-${Date.now()}`,
      fa: tipInputFa.trim(),
      en: tipInputEn.trim() || tipInputFa.trim(),
      isDemo: false,
    };
    onUpdateSiteConfig({
      ...siteConfig,
      quickTips: [newTip, ...siteConfig.quickTips],
    });
    setTipInputFa('');
    setTipInputEn('');
    triggerFeedback(
      isFa ? 'نکته جدید به ابزارک صفحه مقالات اضافه شد.' : 'New tip added to Articles widget.'
    );
  };

  const handleDeleteQuickTip = (id: string) => {
    onUpdateSiteConfig({
      ...siteConfig,
      quickTips: siteConfig.quickTips.filter((t) => t.id !== id),
    });
  };

  const authChannelItems: {
    key: AuthMethodKey;
    fa: string;
    en: string;
    subFa: string;
    subEn: string;
  }[] = [
    {
      key: 'telegram',
      fa: 'ورود با ربات تلگرام',
      en: 'Telegram Bot OTP',
      subFa: 'ارسال کد تایید آنی رایگان',
      subEn: 'Zero-cost bot OTP',
    },
    {
      key: 'bale',
      fa: 'ورود با ربات بله',
      en: 'Bale Messenger OTP',
      subFa: 'سازگار با پیام‌رسان بومی بله',
      subEn: 'Bale API ready',
    },
    {
      key: 'sms',
      fa: 'ورود با پیامک (SMS)',
      en: 'Mobile SMS OTP',
      subFa: 'ارسال کد تایید به شماره موبایل',
      subEn: 'SMS Gateway OTP',
    },
    {
      key: 'email',
      fa: 'ورود با ایمیل و رمز',
      en: 'Email & Password',
      subFa: 'ثبت‌نام و ورود با ایمیل',
      subEn: 'Standard account',
    },
  ];

  return (
    <div className="space-y-6">
      {feedback && (
        <div className="rounded-xl px-4 py-3 bg-emerald-500/15 border border-emerald-500/35 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* 1. Theme, Typography & Navigation Controls */}
      <section className="rounded-2xl p-6 bg-white dark:bg-[#0B1613] border border-slate-200/80 dark:border-emerald-500/15 space-y-5">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
            <Sliders className="w-4 h-4" />
            <span>{isFa ? 'تنظیمات قالب، فونت و منوها' : 'Theme, Font & Menu Controls'}</span>
          </div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            {isFa
              ? 'شخصی‌سازی فونت، برند و صفحات سایت'
              : 'Customize Typography, Branding & Public Pages'}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
              {isFa ? 'عنوان برند در هدر سایت' : 'Header Brand Name'}
            </label>
            <input
              type="text"
              value={siteConfig.brandTitle}
              onChange={(e) =>
                onUpdateSiteConfig({ ...siteConfig, brandTitle: e.target.value })
              }
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#050C0A] border border-slate-200 dark:border-emerald-500/20 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Type className="w-3.5 h-3.5 text-amber-500" />
              <span>{isFa ? 'انتخاب فونت فارسی سایت و پنل' : 'Site & Panel Persian Font'}</span>
            </label>
            <select
              value={siteConfig.fontFamily}
              onChange={(e) =>
                onUpdateSiteConfig({
                  ...siteConfig,
                  fontFamily: e.target.value as PersianFontOption,
                })
              }
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#050C0A] border border-slate-200 dark:border-emerald-500/20 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
            >
              <option value="vazirmatn">
                {isFa ? 'وزیرمتن (Vazirmatn) · استاندارد و خوانا' : 'Vazirmatn (Default)'}
              </option>
              <option value="rubik">
                {isFa ? 'روبیک (Rubik) · هندسی و مدرن' : 'Rubik (Modern Geometric)'}
              </option>
              <option value="readex">
                {isFa ? 'ریدکس پرو (Readex Pro) · مینیمال و نرم' : 'Readex Pro (Clean)'}
              </option>
              <option value="noto-arabic">
                {isFa ? 'نوتو سنس عربی/فارسی (Noto Sans Arabic)' : 'Noto Sans Arabic'}
              </option>
              <option value="custom">
                {isFa
                  ? 'فونت دلخواه نصب‌شده روی وردپرس (ایران‌سنس / یکان‌بخ / پیدا)'
                  : 'Custom WordPress Font (IRANSans / YekanBakh)'}
              </option>
            </select>

            {siteConfig.fontFamily === 'custom' && (
              <input
                type="text"
                dir="ltr"
                value={siteConfig.customFontName}
                onChange={(e) =>
                  onUpdateSiteConfig({
                    ...siteConfig,
                    customFontName: e.target.value,
                  })
                }
                placeholder="IRANSansX, YekanBakh, Peyda"
                className="w-full mt-2 px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-[#050C0A] border border-amber-400/50 text-xs text-slate-900 dark:text-white focus:outline-none"
              />
            )}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
            {isFa ? 'فعال و غیرفعال‌سازی صفحات در منوی اصلی' : 'Toggle Public Site Sections'}
          </label>
          <div className="flex flex-wrap gap-2">
            {[
              { key: 'showAiTools' as const, fa: 'صفحه ابزارهای AI', en: 'AI Tools Page' },
              { key: 'showArticles' as const, fa: 'صفحه مقالات و ابزارک‌ها', en: 'Articles Page' },
              { key: 'showServices' as const, fa: 'صفحه خدمات و مشاوره', en: 'Services Page' },
            ].map((toggle) => {
              const enabled = siteConfig[toggle.key];
              return (
                <button
                  key={toggle.key}
                  type="button"
                  onClick={() =>
                    onUpdateSiteConfig({
                      ...siteConfig,
                      [toggle.key]: !enabled,
                    })
                  }
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
                    enabled
                      ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-700 dark:text-emerald-300'
                      : 'bg-slate-100 dark:bg-[#050C0A] border-slate-200 dark:border-emerald-500/15 text-slate-400'
                  }`}
                >
                  {enabled ? '✓ ' : '✕ '}
                  {isFa ? toggle.fa : toggle.en}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 2. Authentication, Default Method, Registration & SMS Panel Controls */}
      <section className="rounded-2xl p-6 bg-white dark:bg-[#0B1613] border border-slate-200/80 dark:border-emerald-500/15 space-y-5">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-600 dark:text-amber-400">
            <MessageSquareCode className="w-4 h-4" />
            <span>
              {isFa
                ? 'مدیریت ورود و ثبت‌نام کاربران، ربات‌ها و پنل پیامکی'
                : 'Auth Channels, Default Method & SMS Gateway'}
            </span>
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            {isFa
              ? 'کنترل کامل روش‌های ورود و ثبت‌نام توسط مدیر سایت'
              : 'Configure Active Login & Registration Channels'}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {isFa
              ? 'تنها روش‌هایی که اینجا فعال کنید در فرم ورود و ثبت‌نام به کاربران نمایش داده می‌شوند. همچنین می‌توانید تعیین کنید ورود به‌صورت پیش‌فرض روی کدام روش باز شود.'
              : 'Only enabled channels appear inside the public Sign In & Sign Up modal. You can also choose the default active method.'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {authChannelItems.map((ch) => {
            const active = siteConfig.authChannels[ch.key];
            const isDefault = siteConfig.authChannels.defaultChannel === ch.key;
            return (
              <div
                key={ch.key}
                className={`p-3.5 rounded-xl border transition-colors space-y-2.5 ${
                  active
                    ? 'bg-emerald-500/10 border-emerald-500/40 text-slate-900 dark:text-white'
                    : 'bg-slate-50 dark:bg-[#07110E] border-slate-200 dark:border-emerald-500/15 text-slate-400'
                }`}
              >
                <div className="flex items-center justify-between gap-2 text-xs font-bold">
                  <span>{isFa ? ch.fa : ch.en}</span>
                  <button
                    type="button"
                    onClick={() => updateAuth({ [ch.key]: !active })}
                    className={`px-2 py-0.5 rounded-lg text-[10px] font-extrabold cursor-pointer transition-colors ${
                      active
                        ? 'bg-emerald-500 text-white'
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {active ? (isFa ? 'فعال' : 'ON') : isFa ? 'غیرفعال' : 'OFF'}
                  </button>
                </div>
                <p className="text-[11px] opacity-75">
                  {isFa ? ch.subFa : ch.subEn}
                </p>
                {active && (
                  <button
                    type="button"
                    onClick={() => updateAuth({ defaultChannel: ch.key })}
                    className={`w-full py-1 px-2 rounded-lg text-[10px] font-bold border transition-colors cursor-pointer ${
                      isDefault
                        ? 'bg-amber-500/15 border-amber-500/40 text-amber-700 dark:text-amber-300'
                        : 'bg-white/70 dark:bg-[#050C0A] border-slate-200 dark:border-emerald-500/15 text-slate-600 dark:text-slate-300 hover:border-amber-400/50'
                    }`}
                  >
                    {isDefault
                      ? isFa
                        ? '★ روش پیش‌فرض ورود'
                        : '★ Default Method'
                      : isFa
                      ? 'تنظیم به‌عنوان پیش‌فرض'
                      : 'Set as Default'}
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Allow Registration Toggle + Channel Technical Settings (Admin Only) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3 pt-1">
          <button
            type="button"
            onClick={() =>
              updateAuth({
                allowRegistration: !siteConfig.authChannels.allowRegistration,
              })
            }
            className={`p-3 rounded-xl border text-start transition-colors cursor-pointer flex flex-col justify-between gap-1 ${
              siteConfig.authChannels.allowRegistration
                ? 'bg-emerald-500/10 border-emerald-500/40 text-slate-900 dark:text-white'
                : 'bg-slate-50 dark:bg-[#050C0A] border-slate-200 dark:border-emerald-500/15 text-slate-500'
            }`}
          >
            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold">
              <UserPlus className="w-3.5 h-3.5 text-emerald-500" />
              <span>{isFa ? 'ثبت‌نام کاربر جدید' : 'Public Registration'}</span>
            </span>
            <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
              {siteConfig.authChannels.allowRegistration
                ? isFa
                  ? 'فعال (ورود و ثبت‌نام)'
                  : 'Enabled (Login + Signup)'
                : isFa
                ? 'بسته (فقط ورود)'
                : 'Login Only'}
            </span>
          </button>

          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-1">
              <Bot className="w-3 h-3 text-sky-400" />
              <span>{isFa ? 'یوزرنیم ربات تلگرام' : 'Telegram Bot Handle'}</span>
            </label>
            <input
              type="text"
              dir="ltr"
              value={siteConfig.authChannels.telegramBotUsername}
              onChange={(e) =>
                updateAuth({ telegramBotUsername: e.target.value })
              }
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#050C0A] border border-slate-200 dark:border-emerald-500/20 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-1">
              <Bot className="w-3 h-3 text-emerald-400" />
              <span>{isFa ? 'یوزرنیم ربات بله' : 'Bale Bot Handle'}</span>
            </label>
            <input
              type="text"
              dir="ltr"
              value={siteConfig.authChannels.baleBotUsername}
              onChange={(e) => updateAuth({ baleBotUsername: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#050C0A] border border-slate-200 dark:border-emerald-500/20 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 block">
              {isFa ? 'درگاه پیامکی (پنل مدیر)' : 'SMS Gateway'}
            </label>
            <select
              value={siteConfig.authChannels.smsProvider}
              onChange={(e) =>
                updateAuth({ smsProvider: e.target.value as SmsProviderOption })
              }
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#050C0A] border border-slate-200 dark:border-emerald-500/20 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
            >
              <option value="kavenegar">{isFa ? 'کاوه‌نگار (Kavenegar)' : 'Kavenegar'}</option>
              <option value="melipayamak">{isFa ? 'ملی‌پیامک (Melipayamak)' : 'Melipayamak'}</option>
              <option value="faraz">{isFa ? 'فراز اس‌ام‌اس (FarazSMS)' : 'FarazSMS'}</option>
              <option value="custom">{isFa ? 'وب‌سرویس اختصاصی (REST API)' : 'Custom REST Webhook'}</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 block">
              {isFa ? 'پترن پیامک (مخفی از کاربر)' : 'Internal SMS Pattern ID'}
            </label>
            <input
              type="text"
              dir="ltr"
              value={siteConfig.authChannels.smsPatternCode}
              onChange={(e) => updateAuth({ smsPatternCode: e.target.value })}
              placeholder="iramo-verify-otp"
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#050C0A] border border-slate-200 dark:border-emerald-500/20 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>
      </section>

      {/* 3. Articles Widgets Manager (Quick Tips & Widget Sources) */}
      <section className="rounded-2xl p-6 bg-white dark:bg-[#0B1613] border border-slate-200/80 dark:border-emerald-500/15 space-y-5">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-600 dark:text-amber-400">
            <Lightbulb className="w-4 h-4" />
            <span>
              {isFa
                ? 'منبع ابزارک‌های صفحه مقالات (نکات سریع روز)'
                : 'Articles Sidebar Widgets & Quick Tips Source'}
            </span>
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            {isFa
              ? 'مدیریت نکات سریع روز و ابزارک‌های مجله'
              : 'Manage Daily Quick Pro Tips'}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {isFa
              ? 'ابزارک «پربازدیدترین مقالات» و «برچسب‌ها» خودکار از مقالات منتشرشده خوانده می‌شوند، ابزارک «پیشنهاد ویژه» به اولین محصول شما متصل است و «نکات سریع روز» دقیقاً از لیست زیر (یا تنظیمات وردپرس) تغذیه می‌شود.'
              : 'Trending posts and tags populate dynamically from published articles, Featured Toolkit links to your active product, and Quick Tips pull from this list.'}
          </p>
        </div>

        <form onSubmit={handleAddQuickTip} className="grid grid-cols-1 md:grid-cols-12 gap-3">
          <input
            type="text"
            value={tipInputFa}
            onChange={(e) => setTipInputFa(e.target.value)}
            placeholder={
              isFa ? 'متن فارسی نکته جدید برای ابزارک مقالات...' : 'Persian tip text...'
            }
            className="md:col-span-6 px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#050C0A] border border-slate-200 dark:border-emerald-500/20 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
          />
          <input
            type="text"
            dir="ltr"
            value={tipInputEn}
            onChange={(e) => setTipInputEn(e.target.value)}
            placeholder="English tip (optional)..."
            className="md:col-span-4 px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#050C0A] border border-slate-200 dark:border-emerald-500/20 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
          />
          <button
            type="submit"
            className="md:col-span-2 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#1677FF] hover:bg-[#0D65E8] text-white dark:bg-amber-500 dark:hover:bg-amber-400 dark:text-slate-950 text-xs font-bold cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{isFa ? 'افزودن نکته' : 'Add Tip'}</span>
          </button>
        </form>

        {siteConfig.quickTips.length === 0 ? (
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#07110E] border border-slate-200 dark:border-emerald-500/15 text-xs text-slate-500 dark:text-slate-400">
            {isFa
              ? 'هیچ نکته‌ای ثبت نشده است (داده‌های نمونه پاکسازی شده‌اند). از فرم بالا نکته واقعی اضافه کنید.'
              : 'No quick tips registered yet. Add a custom tip above.'}
          </div>
        ) : (
          <div className="space-y-2">
            {siteConfig.quickTips.map((tip) => (
              <div
                key={tip.id}
                className="flex items-center justify-between gap-3 p-3 rounded-xl bg-slate-50 dark:bg-[#07110E] border border-slate-200/80 dark:border-emerald-500/15 text-xs"
              >
                <div className="min-w-0 space-y-0.5">
                  <p className="text-slate-800 dark:text-slate-200 font-medium leading-relaxed">
                    {isFa ? tip.fa : tip.en}
                  </p>
                  <p className="text-[10px] text-slate-400">
                    {tip.isDemo
                      ? isFa
                        ? 'منبع: داده نمونه (با پاکسازی مقالات حذف می‌شود)'
                        : 'Source: Demo item'
                      : isFa
                      ? 'منبع: ثبت‌شده توسط مدیر سایت'
                      : 'Source: Custom Admin Tip'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleDeleteQuickTip(tip.id)}
                  className="p-1.5 rounded-lg text-red-500 hover:bg-red-500/10 shrink-0 cursor-pointer"
                  aria-label={isFa ? 'حذف نکته' : 'Delete tip'}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 4. Demo Data Manager */}
      <section className="rounded-2xl p-6 bg-white dark:bg-[#0B1613] border border-slate-200/80 dark:border-emerald-500/15 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-600 dark:text-amber-400">
              <Database className="w-4 h-4" />
              <span>{isFa ? 'مدیریت داده‌های نمونه (Demo Data)' : 'Demo Data Manager'}</span>
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {isFa
                ? 'حذف داده‌های پیش‌فرض و آماده‌سازی سایت برای محتوای واقعی شما'
                : 'Purge Sample Content & Start Fresh'}
            </h3>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => {
                onRestoreDemoData();
                triggerFeedback(
                  isFa
                    ? 'تمام داده‌های نمونه اولیه بازگردانی شدند.'
                    : 'Demo dataset restored.'
                );
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-emerald-500/25 text-xs font-semibold text-slate-700 dark:text-emerald-300 hover:bg-slate-50 dark:hover:bg-emerald-950/50 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{isFa ? 'بازگردانی داده‌های نمونه' : 'Restore Demo'}</span>
            </button>

            <button
              type="button"
              onClick={() => setConfirmTarget('all')}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-500/15 hover:bg-red-500/25 text-red-600 dark:text-red-400 border border-red-500/30 text-xs font-bold cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{isFa ? 'پاک کردن همه داده‌های نمونه' : 'Clear All Demo Data'}</span>
            </button>
          </div>
        </div>

        {confirmTarget && (
          <div className="rounded-xl p-4 bg-red-500/10 border border-red-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 text-xs font-semibold text-red-700 dark:text-red-300">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>
                {isFa
                  ? 'آیا از پاکسازی داده‌های نمونه انتخاب‌شده مطمئن هستید؟ (محتوای اختصاصی که خودتان ساخته‌اید حفظ می‌شود)'
                  : 'Confirm clearing selected demo items? Custom items you created will be preserved.'}
              </span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setConfirmTarget(null)}
                className="px-3 py-1.5 rounded-lg bg-white dark:bg-[#050C0A] text-xs font-medium text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-emerald-500/20 cursor-pointer"
              >
                {isFa ? 'انصراف' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={handleConfirmClear}
                className="px-3.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-bold cursor-pointer"
              >
                {isFa ? 'بله، پاک شود' : 'Yes, Clear Now'}
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            {
              key: 'products' as const,
              icon: <Layers className="w-4 h-4 text-amber-500" />,
              label: isFa ? 'محصولات نرم‌افزاری' : 'Products',
              count: demoProductsCount,
            },
            {
              key: 'courses' as const,
              icon: <BookOpen className="w-4 h-4 text-emerald-500" />,
              label: isFa ? 'دوره‌های آموزشی' : 'Courses',
              count: demoCoursesCount,
            },
            {
              key: 'tools' as const,
              icon: <Cpu className="w-4 h-4 text-blue-500" />,
              label: isFa ? 'ابزارهای هوش مصنوعی' : 'AI Tools',
              count: demoToolsCount,
            },
            {
              key: 'articles' as const,
              icon: <FileText className="w-4 h-4 text-purple-500" />,
              label: isFa ? 'مقالات و ابزارک‌ها' : 'Articles & Tips',
              count: demoArticlesCount,
            },
          ].map((box) => (
            <div
              key={box.key}
              className="p-4 rounded-xl bg-slate-50 dark:bg-[#07110E] border border-slate-200/70 dark:border-emerald-500/15 flex items-center justify-between gap-2"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-white">
                  {box.icon}
                  <span>{box.label}</span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 tabular-nums">
                  {toLocaleDigits(box.count, lang)}{' '}
                  {isFa ? 'مورد نمونه فعال' : 'demo items'}
                </p>
              </div>
              {box.count > 0 && (
                <button
                  type="button"
                  onClick={() => setConfirmTarget(box.key)}
                  className="p-2 rounded-lg text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer"
                  title={isFa ? 'پاکسازی این بخش' : 'Clear section'}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 5. Quick Add Custom Article & Course */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <form
          onSubmit={handleCreateArticle}
          className="rounded-2xl p-6 bg-white dark:bg-[#0B1613] border border-slate-200/80 dark:border-emerald-500/15 space-y-4"
        >
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
            <Plus className="w-4 h-4 text-emerald-500" />
            <span>{isFa ? 'افزودن سریع مقاله جدید' : 'Add Custom Article'}</span>
          </div>

          <input
            type="text"
            required
            value={artTitle}
            onChange={(e) => setArtTitle(e.target.value)}
            placeholder={isFa ? 'عنوان مقاله...' : 'Article title...'}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#050C0A] border border-slate-200 dark:border-emerald-500/20 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
          />

          <select
            value={artCategory}
            onChange={(e) => setArtCategory(e.target.value as ArticleCategory)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#050C0A] border border-slate-200 dark:border-emerald-500/20 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
          >
            <option value="AI">{isFa ? 'هوش مصنوعی' : 'AI'}</option>
            <option value="Bots">{isFa ? 'ربات تلگرام و بله' : 'Bots'}</option>
            <option value="WordPress">{isFa ? 'وردپرس و المنتور' : 'WordPress'}</option>
            <option value="Finance">{isFa ? 'مالی و حسابیار' : 'Finance'}</option>
            <option value="Video">{isFa ? 'ویدیو AI' : 'Video'}</option>
          </select>

          <textarea
            rows={2}
            value={artExcerpt}
            onChange={(e) => setArtExcerpt(e.target.value)}
            placeholder={isFa ? 'خلاصه یا مقدمه مقاله...' : 'Short summary...'}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#050C0A] border border-slate-200 dark:border-emerald-500/20 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
          />

          <button
            type="submit"
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold cursor-pointer"
          >
            {isFa ? 'انتشار مقاله در سایت' : 'Publish Article'}
          </button>
        </form>

        <form
          onSubmit={handleCreateCourse}
          className="rounded-2xl p-6 bg-white dark:bg-[#0B1613] border border-slate-200/80 dark:border-emerald-500/15 space-y-4"
        >
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
            <Plus className="w-4 h-4 text-amber-500" />
            <span>{isFa ? 'افزودن سریع دوره آموزشی جدید' : 'Add Custom Course'}</span>
          </div>

          <input
            type="text"
            required
            value={courseTitle}
            onChange={(e) => setCourseTitle(e.target.value)}
            placeholder={isFa ? 'نام دوره آموزشی...' : 'Course title...'}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#050C0A] border border-slate-200 dark:border-emerald-500/20 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
          />

          <div className="grid grid-cols-2 gap-3">
            <select
              value={courseCategory}
              onChange={(e) => setCourseCategory(e.target.value as CourseCategory)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#050C0A] border border-slate-200 dark:border-emerald-500/20 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
            >
              <option value="AI">{isFa ? 'هوش مصنوعی' : 'AI'}</option>
              <option value="Bots">{isFa ? 'ربات‌سازی' : 'Bots'}</option>
              <option value="WordPress">{isFa ? 'وردپرس و المنتور' : 'WordPress'}</option>
              <option value="Finance">{isFa ? 'مالی و حسابیار' : 'Finance'}</option>
              <option value="Video">{isFa ? 'تولید ویدیو' : 'Video'}</option>
            </select>

            <input
              type="number"
              min="0"
              value={coursePrice}
              onChange={(e) => setCoursePrice(e.target.value)}
              placeholder={isFa ? 'قیمت به تومان' : 'Price (Toman)'}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#050C0A] border border-slate-200 dark:border-emerald-500/20 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <button
            type="submit"
            className="px-4 py-2.5 rounded-xl bg-[#1677FF] hover:bg-[#0D65E8] text-white dark:bg-amber-500 dark:hover:bg-amber-400 dark:text-slate-950 text-xs font-bold cursor-pointer"
          >
            {isFa ? 'افزودن دوره به آکادمی' : 'Add Course'}
          </button>
        </form>
      </div>
    </div>
  );
};
