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
  Palette,
  Plus,
  RotateCcw,
  Sliders,
  Trash2,
  Type,
  UserPlus,
} from 'lucide-react';
import {
  BorderIntensity,
  COLOR_PRESETS,
  ColorPresetMeta,
  DEFAULT_THEME_COLORS,
  ThemeColorConfig,
} from '../utils/colorTheme';
import { courseAiImg, servicesNeuralImg } from '../assets/media';
import { SoftwareProduct } from '../data/lmsData';
import {
  AITool,
  AIToolInput,
  AIToolOutput,
  AIToolPricing,
  AIToolTask,
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
  themeColors: ThemeColorConfig;
  fontFamily: PersianFontOption;
  customFontName: string;
  customFontCssUrl?: string;
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
  onAddCustomProduct: (product: SoftwareProduct) => void;
  onAddCustomTool: (tool: AITool) => void;
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
  onAddCustomProduct,
  onAddCustomTool,
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

  // Quick Add Software Product Form (auto-inherits full Landing Page!)
  const [prodName, setProdName] = useState('');
  const [prodCategory, setProdCategory] = useState(
    isFa ? 'اتوماسیون و هوش مصنوعی' : 'AI Automation'
  );
  const [prodTagline, setProdTagline] = useState('');
  const [prodPriceToman, setProdPriceToman] = useState('1950000');
  const [prodHighlights, setProdHighlights] = useState('');
  const [prodLinkedCourse, setProdLinkedCourse] = useState('');

  // Quick Add AI Tool Form (Full directory & feature page fields)
  const [toolName, setToolName] = useState('');
  const [toolProvider, setToolProvider] = useState('');
  const [toolUrl, setToolUrl] = useState('https://');
  const [toolTask, setToolTask] = useState<AIToolTask>('AI Assistant');
  const [toolInput, setToolInput] = useState<AIToolInput>('Text');
  const [toolOutput, setToolOutput] = useState<AIToolOutput>('Text');
  const [toolPricing, setToolPricing] = useState<AIToolPricing>('Freemium');
  const [toolTagline, setToolTagline] = useState('');
  const [toolDesc, setToolDesc] = useState('');
  const [toolFeatures, setToolFeatures] = useState('');
  const [toolSteps, setToolSteps] = useState('');
  const [toolSamplePrompt, setToolSamplePrompt] = useState('');
  const [toolHasApi, setToolHasApi] = useState(true);
  const [toolHasMobile, setToolHasMobile] = useState(false);

  const demoProductsCount = products.filter(
    (p) => p.isDemo !== false && p.id.startsWith('prod-')
  ).length;
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

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodName.trim()) return;
    const priceNum = Math.max(0, Number(prodPriceToman) || 0);
    const parsedHighlights = prodHighlights
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);
    const finalHighlights =
      parsedHighlights.length > 0
        ? parsedHighlights
        : [
            'نصب سریع روی وردپرس و سازگار با المنتور پرو',
            'اتصال آماده به ربات تلگرام، پیام‌رسان بله و پنل پیامکی',
            'دریافت خودکار آپدیت‌ها و پشتیبانی فنی',
          ];

    const newProd: SoftwareProduct = {
      id: `custom-prod-${Date.now()}`,
      slug: `product-${Date.now()}`,
      name: { fa: prodName.trim(), en: prodName.trim() },
      category: { fa: prodCategory.trim() || 'نرم‌افزار هوشمند', en: prodCategory.trim() || 'AI Software' },
      tagline: {
        fa: prodTagline.trim() || 'محصول نرم‌افزاری اختصاصی متصل به وردپرس و ربات',
        en: prodTagline.trim() || 'Custom product integrated with WordPress & Messenger bots',
      },
      description: {
        fa:
          prodTagline.trim() ||
          'این محصول به‌طور کامل با طراحی لندینگ اختصاصی، دکمه قیمت هوشمند و آزمایشگاه دمو در سایت شما نمایش داده می‌شود.',
        en:
          prodTagline.trim() ||
          'Automatically rendered with the 6-section conversion landing page and sandbox demo.',
      },
      accent: 'emerald',
      thumbnail: courseAiImg,
      priceToman: priceNum,
      priceUsd: Math.max(9, Math.round(priceNum / 60000)),
      billingLabel: { fa: 'لایسنس رسمی + آپدیت', en: 'Pro License + Updates' },
      highlights: { fa: finalHighlights, en: finalHighlights },
      demoMetrics: [
        { label: { fa: 'سرعت استقرار', en: 'Setup Time' }, value: { fa: 'زیر ۲ دقیقه', en: '< 2 min' } },
        { label: { fa: 'سازگاری', en: 'Compatibility' }, value: { fa: 'وردپرس و ربات', en: 'WP & Bots' } },
        { label: { fa: 'وضعیت تحویل', en: 'Delivery' }, value: { fa: 'آنی و خودکار', en: 'Instant' } },
      ],
      linkedCourseId: prodLinkedCourse || undefined,
      isDemo: false,
    };

    onAddCustomProduct(newProd);
    setProdName('');
    setProdTagline('');
    setProdHighlights('');
    triggerFeedback(
      isFa
        ? 'محصول جدید با لندینگ پیج کامل ۶ بخشی به ویترین سایت اضافه شد!'
        : 'New product with auto-inherited 6-section landing page added!'
    );
  };

  const handleCreateTool = (e: React.FormEvent) => {
    e.preventDefault();
    if (!toolName.trim()) return;
    const featuresList = toolFeatures
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);
    const stepsList = toolSteps
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    const finalFeatures =
      featuresList.length > 0
        ? featuresList
        : ['پاسخگویی سریع و دقیق', 'قابلیت یکپارچه‌سازی با جریان‌های کاری', 'خروجی آماده برای تیم‌ها'];
    const finalSteps =
      stepsList.length > 0
        ? stepsList
        : ['ورود به سایت ابزار و ساخت حساب کاربری', 'وارد کردن ورودی یا پرامپت هدف', 'دریافت خروجی و استفاده در پروژه'];

    const newTool: AITool = {
      id: `custom-tool-${Date.now()}`,
      name: toolName.trim(),
      provider: toolProvider.trim() || 'Independent AI',
      tagline: {
        fa: toolTagline.trim() || 'ابزار هوشمند تخصصی برای افزایش بهره‌وری',
        en: toolTagline.trim() || 'Specialized AI productivity tool',
      },
      task: toolTask,
      subCategory: { fa: 'ابزار پیشنهادی مدیر', en: 'Curated Tool' },
      input: toolInput,
      output: toolOutput,
      pricing: toolPricing,
      roles: ['Creator', 'Developer', 'Business'],
      hasApi: toolHasApi,
      hasMobileApp: toolHasMobile,
      verified: true,
      popularityScore: 95,
      usersCount: 12000,
      likes: 48,
      dislikes: 2,
      thumbnail: servicesNeuralImg,
      isDemo: false,
      url: toolUrl.trim().startsWith('http') ? toolUrl.trim() : `https://${toolUrl.trim()}`,
      description: {
        fa: toolDesc.trim() || toolTagline.trim() || 'توضیحات کامل ابزار اضافه شده توسط مدیر سایت.',
        en: toolDesc.trim() || toolTagline.trim() || 'Full tool details configured by site admin.',
      },
      longDescription: {
        fa: [
          toolDesc.trim() || `${toolName.trim()} یک ابزار کاربردی در حوزه ${toolTask} است که توسط مدیر سایت به دایرکتوری اضافه شده است.`,
        ],
        en: [
          toolDesc.trim() || `${toolName.trim()} is a specialized tool in ${toolTask} curated in this directory.`,
        ],
      },
      keyFeatures: { fa: finalFeatures, en: finalFeatures },
      whoIsItFor: {
        fa: ['توسعه‌دهندگان و سازندگان محتوا', 'کسب‌وکارهای دیجیتال و تیم‌های محصول'],
        en: ['Creators & Developers', 'Digital Businesses & Product Teams'],
      },
      steps: { fa: finalSteps, en: finalSteps },
      samplePrompt: toolSamplePrompt.trim()
        ? { fa: toolSamplePrompt.trim(), en: toolSamplePrompt.trim() }
        : undefined,
    };

    onAddCustomTool(newTool);
    setToolName('');
    setToolProvider('');
    setToolTagline('');
    setToolDesc('');
    setToolFeatures('');
    setToolSteps('');
    setToolSamplePrompt('');
    triggerFeedback(
      isFa
        ? 'ابزار هوش مصنوعی جدید با صفحه جزئیات و ویژگی‌های کامل اضافه شد!'
        : 'New AI Tool added with full feature breakdown page!'
    );
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
              <Type className="w-3.5 h-3.5 text-[#FFBA00]" />
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
                  ? 'فونت اختصاصی آپلودشده (IRANYekanXVF وریبل · پیش‌فرض گیت‌هاب)'
                  : 'Custom Font (IRANYekanXVF Variable Default)'}
              </option>
            </select>

            {siteConfig.fontFamily === 'custom' && (
              <div className="space-y-2 mt-2">
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
                  placeholder="IRANYekanXVF (نام font-family)"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-[#050C0A] border border-[#FFBA00]/50 text-xs text-slate-900 dark:text-white focus:outline-none"
                />
                <input
                  type="text"
                  dir="ltr"
                  value={siteConfig.customFontCssUrl || ''}
                  onChange={(e) =>
                    onUpdateSiteConfig({
                      ...siteConfig,
                      customFontCssUrl: e.target.value,
                    })
                  }
                  placeholder="/fonts/custom-font.css یا لینک فایل CSS فونت"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-[#050C0A] border border-slate-200 dark:border-emerald-500/20 text-xs text-slate-900 dark:text-white focus:outline-none"
                />
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                  {isFa
                    ? 'فونت‌های وریبل IRANYekanXVF (.woff2 / .woff / .ttf) به‌صورت خودکار با وزن ۱۰۰ تا ۹۰۰ از پوشه public/fonts/ شناسایی و فعال می‌شوند.'
                    : 'Variable fonts inside public/fonts/ (IRANYekanXVF woff2/woff/ttf) are auto-registered with weights 100-900.'}
                </p>
              </div>
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
                      ? 'bg-[var(--iramo-primary-soft)] border-[var(--iramo-primary-border)] text-[var(--iramo-primary)]'
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

      {/* 1.5. Color System & 60-30-10 Theme Manager */}
      <section className="rounded-2xl p-6 bg-white dark:bg-[#0B1613] border border-[var(--iramo-card-border)] space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--iramo-primary)]">
              <Palette className="w-4 h-4" />
              <span>
                {isFa
                  ? 'مدیریت رنگ‌بندی و هارمونی ظاهری (قاعده ۶۰-۳۰-۱۰)'
                  : 'Color System & 60-30-10 Theme Manager'}
              </span>
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {isFa
                ? 'تغییر پالت رنگی، شدت حاشیه محصولات و رنگ دکمه‌های کل سایت'
                : 'Customize Brand Palette, Product Card Borders & CTA Accents'}
            </h3>
          </div>

          <button
            type="button"
            onClick={() => {
              onUpdateSiteConfig({
                ...siteConfig,
                themeColors: DEFAULT_THEME_COLORS,
              });
              triggerFeedback(
                isFa
                  ? 'رنگ‌بندی سایت به نسخه اصلی و اولیه روشن بازگردانده شد.'
                  : 'Theme colors reset to default classic light palette.'
              );
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-emerald-500/25 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-emerald-950/50 cursor-pointer shrink-0 self-start sm:self-auto"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{isFa ? 'بازگشت به رنگ اولیه روشن' : 'Reset Default Palette'}</span>
          </button>
        </div>

        {/* Preset Palettes Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {COLOR_PRESETS.map((preset: ColorPresetMeta) => {
            const active = siteConfig.themeColors.preset === preset.id;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => {
                  onUpdateSiteConfig({
                    ...siteConfig,
                    themeColors: {
                      ...siteConfig.themeColors,
                      preset: preset.id,
                      primaryHex: preset.primaryHex,
                      accentHex: preset.accentHex,
                      lightCanvasHex: preset.lightCanvasHex,
                    },
                  });
                  triggerFeedback(
                    isFa
                      ? `پالت «${preset.nameFa}» با موفقیت اعمال شد.`
                      : `Applied "${preset.nameEn}".`
                  );
                }}
                className={`p-3.5 rounded-xl border text-start transition-all cursor-pointer space-y-2 ${
                  active
                    ? 'bg-[var(--iramo-primary-soft)] border-[var(--iramo-primary-border)] ring-1 ring-[var(--iramo-primary)]/30'
                    : 'bg-slate-50/70 dark:bg-[#07110E] border-slate-200/80 dark:border-emerald-500/15 hover:border-slate-300 dark:hover:border-emerald-500/35'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <span
                      className="w-4 h-4 rounded-full border border-black/10"
                      style={{ backgroundColor: preset.lightCanvasHex }}
                    />
                    <span
                      className="w-4 h-4 rounded-full border border-black/10"
                      style={{ backgroundColor: preset.primaryHex }}
                    />
                    <span
                      className="w-4 h-4 rounded-full border border-black/10"
                      style={{ backgroundColor: preset.accentHex }}
                    />
                  </div>
                  {active && (
                    <span className="text-[10px] font-bold text-[var(--iramo-primary)]">
                      {isFa ? 'فعال' : 'Active'}
                    </span>
                  )}
                </div>
                <p className="text-xs font-bold text-slate-900 dark:text-white leading-snug">
                  {isFa ? preset.nameFa : preset.nameEn}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                  {isFa ? preset.descFa : preset.descEn}
                </p>
              </button>
            );
          })}
        </div>

        {/* Fine-Grained Custom Color Pickers + Card Border Intensity */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
          <div className="p-3.5 rounded-xl bg-slate-50/80 dark:bg-[#07110E] border border-slate-200/75 dark:border-emerald-500/15 space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-200 block">
              {isFa ? 'رنگ اصلی برند (Primary)' : 'Primary Brand Color'}
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={siteConfig.themeColors.primaryHex}
                onChange={(e) =>
                  onUpdateSiteConfig({
                    ...siteConfig,
                    themeColors: {
                      ...siteConfig.themeColors,
                      preset: 'custom',
                      primaryHex: e.target.value,
                    },
                  })
                }
                className="w-9 h-9 rounded-lg border border-slate-200 dark:border-emerald-500/20 bg-transparent cursor-pointer shrink-0"
              />
              <input
                type="text"
                dir="ltr"
                value={siteConfig.themeColors.primaryHex}
                onChange={(e) =>
                  onUpdateSiteConfig({
                    ...siteConfig,
                    themeColors: {
                      ...siteConfig.themeColors,
                      preset: 'custom',
                      primaryHex: e.target.value,
                    },
                  })
                }
                className="flex-1 min-w-0 px-2.5 py-1.5 rounded-lg bg-white dark:bg-[#050C0A] border border-slate-200 dark:border-emerald-500/20 text-xs font-mono text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50/80 dark:bg-[#07110E] border border-slate-200/75 dark:border-emerald-500/15 space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-200 block">
              {isFa ? 'رنگ تاکیدی دکمه‌ها (Accent CTA)' : 'Accent & CTA Color'}
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={siteConfig.themeColors.accentHex}
                onChange={(e) =>
                  onUpdateSiteConfig({
                    ...siteConfig,
                    themeColors: {
                      ...siteConfig.themeColors,
                      preset: 'custom',
                      accentHex: e.target.value,
                    },
                  })
                }
                className="w-9 h-9 rounded-lg border border-slate-200 dark:border-emerald-500/20 bg-transparent cursor-pointer shrink-0"
              />
              <input
                type="text"
                dir="ltr"
                value={siteConfig.themeColors.accentHex}
                onChange={(e) =>
                  onUpdateSiteConfig({
                    ...siteConfig,
                    themeColors: {
                      ...siteConfig.themeColors,
                      preset: 'custom',
                      accentHex: e.target.value,
                    },
                  })
                }
                className="flex-1 min-w-0 px-2.5 py-1.5 rounded-lg bg-white dark:bg-[#050C0A] border border-slate-200 dark:border-emerald-500/20 text-xs font-mono text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50/80 dark:bg-[#07110E] border border-slate-200/75 dark:border-emerald-500/15 space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-200 block">
              {isFa ? 'پس‌زمینه نسخه روشن (۶۰٪)' : 'Light Canvas Background'}
            </label>
            <select
              value={siteConfig.themeColors.lightCanvasHex}
              onChange={(e) =>
                onUpdateSiteConfig({
                  ...siteConfig,
                  themeColors: {
                    ...siteConfig.themeColors,
                    lightCanvasHex: e.target.value,
                  },
                })
              }
              className="w-full px-3 py-2 rounded-lg bg-white dark:bg-[#050C0A] border border-slate-200 dark:border-emerald-500/20 text-xs text-slate-900 dark:text-white cursor-pointer"
            >
              <option value="#F8FAFC">
                {isFa ? 'طوسی بسیار روشن مینیمال (#F8FAFC)' : 'Soft Cool Slate (#F8FAFC)'}
              </option>
              <option value="#FFFFFF">
                {isFa ? 'سفید خالص (#FFFFFF)' : 'Pure White (#FFFFFF)'}
              </option>
              <option value="#F4F6F9">
                {isFa ? 'خاکستری نرم (#F4F6F9)' : 'Neutral Mist (#F4F6F9)'}
              </option>
            </select>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50/80 dark:bg-[#07110E] border border-slate-200/75 dark:border-emerald-500/15 space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-200 block">
              {isFa ? 'شدت حاشیه (Border) کارت‌ها' : 'Card Border Intensity'}
            </label>
            <select
              value={siteConfig.themeColors.borderIntensity}
              onChange={(e) =>
                onUpdateSiteConfig({
                  ...siteConfig,
                  themeColors: {
                    ...siteConfig.themeColors,
                    borderIntensity: e.target.value as BorderIntensity,
                  },
                })
              }
              className="w-full px-3 py-2 rounded-lg bg-white dark:bg-[#050C0A] border border-slate-200 dark:border-emerald-500/20 text-xs text-slate-900 dark:text-white cursor-pointer"
            >
              <option value="subtle">
                {isFa ? 'بسیار ملایم و ظریف (پیشنهادی)' : 'Ultra Subtle (Recommended)'}
              </option>
              <option value="balanced">
                {isFa ? 'متعادل و استاندارد' : 'Balanced'}
              </option>
              <option value="defined">
                {isFa ? 'خطوط مشخص‌تر' : 'Defined'}
              </option>
            </select>
          </div>
        </div>

        {/* 60-30-10 Live Visual Balance Indicator */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
            <span>
              {isFa
                ? 'توزیع اصولی رنگ ۶۰-۳۰-۱۰ (۶۰٪ پس‌زمینه خنثی · ۳۰٪ ساختار کارت و متن · ۱۰٪ رنگ برند و دکمه)'
                : '60-30-10 UI Balance (60% Neutral Canvas · 30% Surface & Typography · 10% Brand & CTA)'}
            </span>
          </div>
          <div className="h-2.5 w-full rounded-full overflow-hidden flex border border-slate-200 dark:border-emerald-500/20">
            <div
              className="w-[60%]"
              style={{ backgroundColor: siteConfig.themeColors.lightCanvasHex }}
            />
            <div className="w-[30%] bg-slate-700 dark:bg-slate-300" />
            <div
              className="w-[6%]"
              style={{ backgroundColor: siteConfig.themeColors.primaryHex }}
            />
            <div
              className="w-[4%]"
              style={{ backgroundColor: siteConfig.themeColors.accentHex }}
            />
          </div>
        </div>
      </section>

      {/* 2. Authentication, Default Method, Registration & SMS Panel Controls */}
      <section className="rounded-2xl p-6 bg-white dark:bg-[#0B1613] border border-slate-200/80 dark:border-emerald-500/15 space-y-5">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#9A6E00] dark:text-[#FFBA00]">
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
                        ? 'bg-[#FFBA00]/15 border-[#FFBA00]/50 text-[#9A6E00] dark:text-[#FFBA00]'
                        : 'bg-white/70 dark:bg-[#050C0A] border-slate-200 dark:border-emerald-500/15 text-slate-600 dark:text-slate-300 hover:border-[#FFBA00]/50'
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
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#9A6E00] dark:text-[#FFBA00]">
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
            className="md:col-span-2 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-[var(--iramo-accent)] hover:bg-[var(--iramo-accent-hover)] text-[var(--iramo-accent-fg)] text-xs font-bold cursor-pointer transition-colors"
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
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#9A6E00] dark:text-[#FFBA00]">
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
              icon: <Layers className="w-4 h-4 text-[#FFBA00]" />,
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
            <Plus className="w-4 h-4 text-[#FFBA00]" />
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
            className="px-4 py-2.5 rounded-xl bg-[var(--iramo-accent)] hover:bg-[var(--iramo-accent-hover)] text-[var(--iramo-accent-fg)] text-xs font-bold cursor-pointer transition-colors"
          >
            {isFa ? 'افزودن دوره به آکادمی' : 'Add Course'}
          </button>
        </form>
      </div>

      {/* 6. Full Add Custom Product (Auto-Inherits 6-Section Landing) & Add AI Tool (Full Features) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <form
          onSubmit={handleCreateProduct}
          className="rounded-2xl p-6 bg-white dark:bg-[#0B1613] border border-slate-200/80 dark:border-emerald-500/15 space-y-4"
        >
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
              <Layers className="w-4 h-4 text-[var(--iramo-primary)]" />
              <span>{isFa ? 'افزودن محصول نرم‌افزاری جدید (با لندینگ خودکار)' : 'Add Software Product (Auto Landing)'}</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              {isFa
                ? 'هر محصولی که اینجا (یا در ووکامرس وردپرس) بسازید، خودکار با کارت، دکمه قیمت و لندینگ ۶ بخشی کامل نمایش داده می‌شود.'
                : 'Every product created here (or in WooCommerce) automatically renders with the full 6-section landing page.'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="text"
              required
              value={prodName}
              onChange={(e) => setProdName(e.target.value)}
              placeholder={isFa ? 'نام محصول (مثلاً: ربات منشی کلینیک)...' : 'Product name...'}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#050C0A] border border-slate-200 dark:border-emerald-500/20 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
            />
            <input
              type="text"
              value={prodCategory}
              onChange={(e) => setProdCategory(e.target.value)}
              placeholder={isFa ? 'دسته‌بندی محصول...' : 'Category...'}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#050C0A] border border-slate-200 dark:border-emerald-500/20 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="number"
              min="0"
              value={prodPriceToman}
              onChange={(e) => setProdPriceToman(e.target.value)}
              placeholder={isFa ? 'قیمت به تومان' : 'Price (Toman)'}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#050C0A] border border-slate-200 dark:border-emerald-500/20 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
            />
            <select
              value={prodLinkedCourse}
              onChange={(e) => setProdLinkedCourse(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#050C0A] border border-slate-200 dark:border-emerald-500/20 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
            >
              <option value="">
                {isFa ? 'اتصال به دوره آموزشی (اختیاری)' : 'Link Course (Optional)'}
              </option>
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {isFa ? c.title.fa : c.title.en}
                </option>
              ))}
            </select>
          </div>

          <input
            type="text"
            value={prodTagline}
            onChange={(e) => setProdTagline(e.target.value)}
            placeholder={isFa ? 'تیتر ارزش پیشنهادی و معرفی کوتاه...' : 'Headline value proposition...'}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#050C0A] border border-slate-200 dark:border-emerald-500/20 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
          />

          <textarea
            rows={3}
            value={prodHighlights}
            onChange={(e) => setProdHighlights(e.target.value)}
            placeholder={
              isFa
                ? 'ویژگی‌های کلیدی محصول (هر ویژگی در یک خط جدید)...'
                : 'Key highlights (one feature per line)...'
            }
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#050C0A] border border-slate-200 dark:border-emerald-500/20 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
          />

          <button
            type="submit"
            className="px-4 py-2.5 rounded-xl bg-[var(--iramo-primary)] hover:bg-[var(--iramo-primary-hover)] text-[var(--iramo-primary-fg)] text-xs font-bold cursor-pointer transition-colors"
          >
            {isFa ? 'ساخت محصول و لندینگ اختصاصی' : 'Create Product + Landing Page'}
          </button>
        </form>

        <form
          onSubmit={handleCreateTool}
          className="rounded-2xl p-6 bg-white dark:bg-[#0B1613] border border-slate-200/80 dark:border-emerald-500/15 space-y-4"
        >
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
              <Cpu className="w-4 h-4 text-[#FFBA00]" />
              <span>{isFa ? 'افزودن ابزار هوش مصنوعی با ویژگی‌های کامل' : 'Add AI Tool with Full Features'}</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              {isFa
                ? 'ابزار جدید مستقیماً به دایرکتوری اضافه می‌شود و هنگام کلیک، صفحه کامل جزئیات، ویژگی‌ها، مراحل و پرامپت نمونه را نشان می‌دهد.'
                : 'Appears in the AI Tools Hub with a complete detail page, steps, and sample prompt.'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <input
              type="text"
              required
              value={toolName}
              onChange={(e) => setToolName(e.target.value)}
              placeholder={isFa ? 'نام ابزار (مثلاً Cursor AI)...' : 'Tool name...'}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#050C0A] border border-slate-200 dark:border-emerald-500/20 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
            />
            <input
              type="text"
              value={toolProvider}
              onChange={(e) => setToolProvider(e.target.value)}
              placeholder={isFa ? 'شرکت سازنده...' : 'Provider...'}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#050C0A] border border-slate-200 dark:border-emerald-500/20 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
            />
            <input
              type="text"
              dir="ltr"
              value={toolUrl}
              onChange={(e) => setToolUrl(e.target.value)}
              placeholder="https://example.ai"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#050C0A] border border-slate-200 dark:border-emerald-500/20 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <select
              value={toolTask}
              onChange={(e) => setToolTask(e.target.value as AIToolTask)}
              className="w-full px-2.5 py-2 rounded-xl bg-slate-50 dark:bg-[#050C0A] border border-slate-200 dark:border-emerald-500/20 text-[11px] text-slate-900 dark:text-white focus:outline-none"
            >
              <option value="AI Assistant">AI Assistant</option>
              <option value="Video Generation">Video Generation</option>
              <option value="Art & Image">Art & Image</option>
              <option value="Code Assistant">Code Assistant</option>
              <option value="Audio & Music">Audio & Music</option>
              <option value="Data & Finance">Data & Finance</option>
              <option value="Automation & Agents">Automation & Agents</option>
              <option value="Writing & SEO">Writing & SEO</option>
              <option value="Research & Study">Research & Study</option>
              <option value="3D & Avatar">3D & Avatar</option>
            </select>

            <select
              value={toolInput}
              onChange={(e) => setToolInput(e.target.value as AIToolInput)}
              className="w-full px-2.5 py-2 rounded-xl bg-slate-50 dark:bg-[#050C0A] border border-slate-200 dark:border-emerald-500/20 text-[11px] text-slate-900 dark:text-white focus:outline-none"
            >
              <option value="Text">{isFa ? 'ورودی: متن' : 'In: Text'}</option>
              <option value="Prompt">{isFa ? 'ورودی: پرامپت' : 'In: Prompt'}</option>
              <option value="Image">{isFa ? 'ورودی: تصویر' : 'In: Image'}</option>
              <option value="Video">{isFa ? 'ورودی: ویدیو' : 'In: Video'}</option>
              <option value="Audio">{isFa ? 'ورودی: صدا' : 'In: Audio'}</option>
              <option value="Document">{isFa ? 'ورودی: سند/PDF' : 'In: Doc'}</option>
              <option value="Spreadsheet">{isFa ? 'ورودی: اکسل' : 'In: Sheet'}</option>
            </select>

            <select
              value={toolOutput}
              onChange={(e) => setToolOutput(e.target.value as AIToolOutput)}
              className="w-full px-2.5 py-2 rounded-xl bg-slate-50 dark:bg-[#050C0A] border border-slate-200 dark:border-emerald-500/20 text-[11px] text-slate-900 dark:text-white focus:outline-none"
            >
              <option value="Text">{isFa ? 'خروجی: متن' : 'Out: Text'}</option>
              <option value="Code">{isFa ? 'خروجی: کد' : 'Out: Code'}</option>
              <option value="Image">{isFa ? 'خروجی: تصویر' : 'Out: Image'}</option>
              <option value="Video">{isFa ? 'خروجی: ویدیو' : 'Out: Video'}</option>
              <option value="Audio">{isFa ? 'خروجی: صدا' : 'Out: Audio'}</option>
              <option value="Workflow">{isFa ? 'خروجی: اتوماسیون' : 'Out: Workflow'}</option>
              <option value="Dashboard">{isFa ? 'خروجی: داشبورد' : 'Out: Dashboard'}</option>
            </select>

            <select
              value={toolPricing}
              onChange={(e) => setToolPricing(e.target.value as AIToolPricing)}
              className="w-full px-2.5 py-2 rounded-xl bg-slate-50 dark:bg-[#050C0A] border border-slate-200 dark:border-emerald-500/20 text-[11px] text-slate-900 dark:text-white focus:outline-none"
            >
              <option value="Free">{isFa ? 'رایگان' : 'Free'}</option>
              <option value="Freemium">{isFa ? 'فریمیوم' : 'Freemium'}</option>
              <option value="Free Trial">{isFa ? 'تست رایگان' : 'Free Trial'}</option>
              <option value="Paid">{isFa ? 'پولی' : 'Paid'}</option>
            </select>
          </div>

          <input
            type="text"
            value={toolTagline}
            onChange={(e) => setToolTagline(e.target.value)}
            placeholder={isFa ? 'معرفی یک‌خطی ابزار...' : 'One-line tagline...'}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#050C0A] border border-slate-200 dark:border-emerald-500/20 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <textarea
              rows={2}
              value={toolFeatures}
              onChange={(e) => setToolFeatures(e.target.value)}
              placeholder={
                isFa
                  ? 'ویژگی‌های ابزار (هر مورد در یک خط)...'
                  : 'Key features (one per line)...'
              }
              className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-[#050C0A] border border-slate-200 dark:border-emerald-500/20 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
            />
            <textarea
              rows={2}
              value={toolSteps}
              onChange={(e) => setToolSteps(e.target.value)}
              placeholder={
                isFa
                  ? 'مراحل کار با ابزار (هر مرحله در یک خط)...'
                  : 'How-to steps (one per line)...'
              }
              className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-[#050C0A] border border-slate-200 dark:border-emerald-500/20 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-4 text-xs text-slate-600 dark:text-slate-300">
              <label className="inline-flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={toolHasApi}
                  onChange={() => setToolHasApi((v) => !v)}
                  className="accent-[#FFBA00] rounded"
                />
                <span>{isFa ? 'دارای API' : 'Has API'}</span>
              </label>
              <label className="inline-flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={toolHasMobile}
                  onChange={() => setToolHasMobile((v) => !v)}
                  className="accent-[#FFBA00] rounded"
                />
                <span>{isFa ? 'اپلیکیشن موبایل' : 'Mobile App'}</span>
              </label>
            </div>

            <button
              type="submit"
              className="px-4 py-2.5 rounded-xl bg-[var(--iramo-accent)] hover:bg-[var(--iramo-accent-hover)] text-[var(--iramo-accent-fg)] text-xs font-bold cursor-pointer transition-colors"
            >
              {isFa ? 'افزودن ابزار به دایرکتوری AI' : 'Add AI Tool'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
