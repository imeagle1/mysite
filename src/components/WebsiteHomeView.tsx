import React, { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Play,
  Search,
  Sparkles,
} from 'lucide-react';
import { motion } from 'motion/react';
import {
  courseAiImg,
  heroDeskImg,
  servicesNeuralImg,
} from '../assets/media';
import { SoftwareProduct } from '../data/lmsData';
import { Course, Lang } from '../types/lms';
import { toLocaleDigits } from '../utils/formatters';
import { PriceActionButton } from './PriceActionButton';
import { SitePage } from './WebsiteShell';

interface WebsiteHomeViewProps {
  lang: Lang;
  brandTitle: string;
  products: SoftwareProduct[];
  courses: Course[];
  onNavigate: (page: SitePage) => void;
  onOpenMarketplaceWithFilter: (query: string, task: string) => void;
  onOpenProductDemo: (productId: string) => void;
}

export const WebsiteHomeView: React.FC<WebsiteHomeViewProps> = ({
  lang,
  brandTitle,
  products,
  courses,
  onNavigate,
  onOpenMarketplaceWithFilter,
  onOpenProductDemo,
}) => {
  const isFa = lang === 'fa';
  const [heroSearch, setHeroSearch] = useState('');
  const [quickTask, setQuickTask] = useState('ALL');

  const handleDiscoverySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onOpenMarketplaceWithFilter(heroSearch, quickTask);
  };

  const featuredCourse = courses[0];

  return (
    <div className="space-y-14 pb-10">
      {/* 1. Hero Section — Modern Minimal Light Mode + Deep Emerald Dark Mode */}
      <section className="relative overflow-hidden border-b border-[var(--iramo-card-border)] dark:border-emerald-500/15 bg-gradient-to-b from-[var(--iramo-primary-soft)] via-white to-[var(--iramo-canvas)] dark:from-[#071611] dark:via-[#06110D] dark:to-[#050C0A]">
        <div className="max-w-[1460px] mx-auto px-4 sm:px-6 pt-24 pb-10 lg:pt-28 lg:pb-16 grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:col-span-6 flex flex-col justify-center space-y-6"
          >
            <p className="text-xs font-semibold text-[var(--iramo-primary)] tracking-wide">
              {isFa
                ? `جایی برای خلق آینده هوشمند · ${brandTitle}`
                : `Engineering Intelligent Systems · ${brandTitle}`}
            </p>

            <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold text-slate-900 dark:text-white leading-[1.3] text-balance">
              {isFa ? (
                <>
                  محصولات نرم‌افزاری، آموزش حرفه‌ای و{' '}
                  <span className="text-[var(--iramo-primary)] dark:text-[#FFBA00]">
                    راهکارهای هوشمند AI
                  </span>
                </>
              ) : (
                <>
                  AI Software Products, Academy &{' '}
                  <span className="text-[var(--iramo-primary)] dark:text-[#FFBA00]">
                    Custom Automation
                  </span>
                </>
              )}
            </h1>

            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl">
              {isFa
                ? 'از تجربه مهندسی ما در دنیای فناوری بهره ببرید؛ مجموعه نرم‌افزارهای آماده مثل حسابیار و ربات‌های آموزشی، دستیار انتخاب ابزارهای هوش مصنوعی و آکادمی تخصصی iRamo.'
                : 'Explore production AI software like Hesabyar, our unified Telegram & Bale academy bots, curated AI tools assistant, and hands-on engineering courses.'}
            </p>

            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <button
                type="button"
                onClick={() => onNavigate('products')}
                className="inline-flex items-center gap-2.5 px-6 py-3 rounded-xl bg-[var(--iramo-accent)] hover:bg-[var(--iramo-accent-hover)] text-[var(--iramo-accent-fg)] text-sm font-bold shadow-sm shadow-black/10 transition-colors cursor-pointer whitespace-nowrap"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>{isFa ? 'مشاهده دمو محصولات' : 'Explore Product Demos'}</span>
              </button>

              <button
                type="button"
                onClick={() => onNavigate('services')}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white dark:bg-transparent border border-[var(--iramo-card-border)] dark:border-emerald-500/30 hover:border-[var(--iramo-primary-border)] dark:hover:border-emerald-400 text-slate-800 dark:text-slate-100 text-sm font-semibold transition-colors cursor-pointer whitespace-nowrap"
              >
                <span>{isFa ? 'درخواست مشاوره و پروژه' : 'Request Consultation'}</span>
                {isFa ? (
                  <ArrowLeft className="w-4 h-4 text-[var(--iramo-primary)]" />
                ) : (
                  <ArrowRight className="w-4 h-4 text-[var(--iramo-primary)]" />
                )}
              </button>
            </div>

            {/* Clean localized proof strip */}
            <div className="pt-3 flex flex-wrap items-center gap-6 text-xs text-slate-500 dark:text-slate-400 border-t border-slate-200 dark:border-emerald-500/15">
              <span>
                <strong className="text-slate-900 dark:text-white font-bold tabular-nums">
                  {toLocaleDigits('50,000+', lang)}
                </strong>{' '}
                {isFa ? 'دانشجو و کاربر فعال' : 'Active Learners'}
              </span>
              <span aria-hidden="true">·</span>
              <span>
                <strong className="text-slate-900 dark:text-white font-bold tabular-nums">
                  {toLocaleDigits('24+', lang)}
                </strong>{' '}
                {isFa ? 'ابزار و ربات هوشمند' : 'AI Tools & Bots'}
              </span>
              <span aria-hidden="true">·</span>
              <span>
                {isFa ? 'اتصال بومی به تلگرام و بله' : 'Native Telegram & Bale Sync'}
              </span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="lg:col-span-6"
          >
            <div className="relative h-full min-h-[280px] sm:min-h-[370px] rounded-2xl overflow-hidden border border-slate-200 dark:border-emerald-500/20 bg-slate-100 dark:bg-[#08130F] shadow-lg shadow-slate-900/5 dark:shadow-none">
              <img
                src={heroDeskImg}
                alt={
                  isFa
                    ? `محیط کاری هوشمند ${brandTitle}`
                    : `${brandTitle} Intelligent Workspace`
                }
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/35 via-transparent to-transparent dark:from-[#050C0A]/75" />
            </div>
          </motion.div>
        </div>
      </section>

      <div className="max-w-[1460px] mx-auto px-4 sm:px-6 space-y-14">
        {/* 2. Top Products Showcase */}
        {products.length > 0 && (
          <section className="space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                  {isFa ? 'محصولات نرم‌افزاری برتر ما' : 'Flagship Software & Products'}
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                  {isFa
                    ? 'نرم‌افزارها و ربات‌های آماده با طراحی اختصاصی برای کار و کسب‌وکار هوشمندتر'
                    : 'Purpose-built software tools, bots, and financial automation.'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('products')}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-[var(--iramo-card-border)] hover:border-[var(--iramo-primary-border)] text-slate-700 hover:text-[var(--iramo-primary)] dark:border-emerald-500/30 dark:text-emerald-300 dark:hover:bg-emerald-500/10 text-xs font-semibold transition-colors duration-150 cursor-pointer self-start sm:self-auto whitespace-nowrap"
              >
                <span>{isFa ? 'مشاهده همه محصولات' : 'View All Products'}</span>
                {isFa ? (
                  <ArrowLeft className="w-3.5 h-3.5" />
                ) : (
                  <ArrowRight className="w-3.5 h-3.5" />
                )}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {products.map((prod) => (
                <article
                  key={prod.id}
                  onClick={() => onOpenProductDemo(prod.id)}
                  className="group iramo-card-interactive rounded-2xl bg-white dark:bg-[#0B1613] border border-[var(--iramo-card-border)] shadow-[0_1px_3px_rgba(15,23,42,0.04)] overflow-hidden flex flex-col justify-between cursor-pointer"
                >
                  <div>
                    <div className="aspect-4/3 overflow-hidden bg-slate-100 dark:bg-[#07110E]">
                      <img
                        src={prod.thumbnail}
                        alt={isFa ? prod.name.fa : prod.name.en}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-150"
                      />
                    </div>

                    <div className="p-4 space-y-2">
                      <p className="text-[11px] font-semibold text-[var(--iramo-primary)]">
                        {isFa ? prod.category.fa : prod.category.en}
                      </p>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-[var(--iramo-primary)] transition-colors duration-150 leading-snug">
                        {isFa ? prod.name.fa : prod.name.en}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2">
                        {isFa ? prod.tagline.fa : prod.tagline.en}
                      </p>
                    </div>
                  </div>

                  <div className="px-4 pb-4 pt-2">
                    <PriceActionButton
                      lang={lang}
                      priceToman={prod.priceToman}
                      priceUsd={prod.priceUsd}
                      ctaLabel={{ fa: 'دمو و خرید', en: 'Demo' }}
                      variant="amber"
                      fullWidth
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenProductDemo(prod.id);
                      }}
                    />
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* 3. AI Tools Assistant Teaser */}
        <section className="rounded-2xl p-6 sm:p-8 bg-white dark:bg-[#091611] border border-[var(--iramo-card-border)] shadow-[0_1px_3px_rgba(15,23,42,0.04)]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-5 space-y-2.5">
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--iramo-primary)]">
                <Sparkles className="w-3.5 h-3.5" />
                <span>
                  {isFa
                    ? 'دستیار و بازار ابزارهای هوش مصنوعی'
                    : 'AI Tools Assistant & Directory'}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white text-balance">
                {isFa
                  ? 'چه کاری می‌خواهید با هوش مصنوعی انجام دهید؟'
                  : 'Discover the Best AI Tool for Your Task'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300/85 leading-relaxed">
                {isFa
                  ? 'کافی است هدف خود را بنویسید یا نوع ورودی و خروجی را انتخاب کنید؛ موتور پیشنهادگر ابزارهای AI بهترین راهکار را با دستورالعمل گام‌به‌گام معرفی می‌کند.'
                  : 'Describe your task or select input & output types to find matched AI tools with ready prompt templates.'}
              </p>
            </div>

            <form
              onSubmit={handleDiscoverySubmit}
              className="lg:col-span-7 space-y-3"
            >
              <div className="flex items-center gap-2 p-1.5 rounded-xl bg-slate-50/80 dark:bg-[#050C0A] border border-[var(--iramo-card-border)] focus-within:border-[var(--iramo-primary-border)] shadow-xs">
                <input
                  type="text"
                  value={heroSearch}
                  onChange={(e) => setHeroSearch(e.target.value)}
                  placeholder={
                    isFa
                      ? 'مثلاً: ثبت خودکار فیش بانکی، ساخت ربات تلگرام، تولید ویدیو آموزشی...'
                      : 'e.g. build a Telegram bot, transcribe audio, automate P&L...'
                  }
                  className="flex-1 bg-transparent px-3 py-2 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none"
                />
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[var(--iramo-primary)] hover:bg-[var(--iramo-primary-hover)] text-[var(--iramo-primary-fg)] text-xs font-bold transition-colors cursor-pointer shrink-0"
                >
                  <Search className="w-4 h-4" />
                  <span>{isFa ? 'پیشنهاد ابزار' : 'Find AI Tool'}</span>
                </button>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  {(
                    [
                      { id: 'ALL', fa: 'همه ابزارها', en: 'All' },
                      { id: 'AI Assistant', fa: 'دستیار هوشمند', en: 'AI Assistant' },
                      { id: 'Video Generation', fa: 'تولید ویدیو', en: 'Video AI' },
                      { id: 'Art & Image', fa: 'تصویر و گرافیک', en: 'Art & Image' },
                      { id: 'Code Assistant', fa: 'کدنویسی', en: 'Code' },
                      { id: 'Data & Finance', fa: 'تحلیل داده', en: 'Data' },
                    ] as const
                  ).map((chip) => (
                    <button
                      key={chip.id}
                      type="button"
                      onClick={() => setQuickTask(chip.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                        quickTask === chip.id
                          ? 'bg-[var(--iramo-primary-soft)] text-[var(--iramo-primary)] border border-[var(--iramo-primary-border)]'
                          : 'bg-slate-50 text-slate-600 border border-[var(--iramo-card-border)] hover:text-slate-950 dark:bg-[#050C0A] dark:text-slate-400 dark:hover:text-white'
                      }`}
                    >
                      {isFa ? chip.fa : chip.en}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => onNavigate('ai-marketplace')}
                  className="text-xs font-semibold text-[var(--iramo-primary)] hover:underline cursor-pointer"
                >
                  {isFa ? 'ورود به صفحه کامل ابزارهای AI ←' : 'Open AI Tools Page →'}
                </button>
              </div>
            </form>
          </div>
        </section>

        {/* 4. Bottom Dual Bento Cards: Academy + Services & Consultation */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          <div className="group iramo-card-interactive rounded-2xl p-6 bg-white dark:bg-[#0B1613] border border-[var(--iramo-card-border)] shadow-[0_1px_3px_rgba(15,23,42,0.04)] flex flex-col justify-between gap-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  {isFa ? 'دوره‌های آموزشی و آکادمی' : 'Engineering Academy'}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {isFa
                    ? 'یادگیری هوش مصنوعی و ربات‌سازی، قدم‌به‌گام و پروژه‌محور'
                    : 'Step-by-step project-driven AI & automation engineering.'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('courses')}
                className="px-3.5 py-1.5 rounded-xl border border-[var(--iramo-card-border)] hover:border-[var(--iramo-primary-border)] text-slate-700 hover:text-[var(--iramo-primary)] dark:border-emerald-500/30 dark:text-emerald-300 text-xs font-semibold whitespace-nowrap shrink-0 cursor-pointer transition-colors"
              >
                {isFa ? 'مشاهده همه دوره‌ها' : 'All Courses'}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
              <div className="sm:col-span-5 aspect-4/3 rounded-xl overflow-hidden bg-slate-100 dark:bg-[#07110E] border border-[var(--iramo-card-border)]">
                <img
                  src={featuredCourse?.thumbnail || courseAiImg}
                  alt={isFa ? 'دوره جامع هوش مصنوعی' : 'AI Mastery Course'}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="sm:col-span-7 space-y-2.5">
                <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                  {featuredCourse
                    ? isFa
                      ? featuredCourse.title.fa
                      : featuredCourse.title.en
                    : isFa
                    ? 'دوره جامع هوش مصنوعی از صفر تا پیشرفته'
                    : 'AI-Powered Systems & Engineering Mastery'}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {isFa
                    ? 'از مبانی تا ساخت ایجنت‌های حرفه‌ای، اتصال به وردپرس و اتوماسیون ربات‌های تلگرام و بله.'
                    : 'Build real agents, connect WordPress REST APIs, and launch automated bots.'}
                </p>
                <p className="text-xs tabular-nums text-[var(--iramo-primary)] font-semibold pt-1">
                  {isFa
                    ? '۱۲ ساعت آموزش · ۶ پروژه عملی'
                    : '12h Video · 6 Hands-on Labs'}
                </p>
                <div className="pt-1">
                  <PriceActionButton
                    lang={lang}
                    priceToman={featuredCourse?.priceToman ?? 1950000}
                    priceUsd={featuredCourse?.priceUsd ?? 49}
                    ctaLabel={{ fa: 'مشاهده سرفصل', en: 'Curriculum' }}
                    variant="emerald"
                    onClick={() => onNavigate('courses')}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="group iramo-card-interactive rounded-2xl p-6 bg-white dark:bg-[#0B1613] border border-[var(--iramo-card-border)] shadow-[0_1px_3px_rgba(15,23,42,0.04)] flex flex-col justify-between gap-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  {isFa ? 'خدمات و مشاوره تخصصی' : 'Engineering & AI Consulting'}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {isFa
                    ? 'همراه شما در پیاده‌سازی پروژه‌های هوشمند کسب‌وکار'
                    : 'Custom bots, WordPress integrations, and AI pipelines.'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('services')}
                className="px-3.5 py-1.5 rounded-xl border border-[var(--iramo-card-border)] hover:border-[var(--iramo-primary-border)] text-slate-700 hover:text-[var(--iramo-primary)] dark:border-emerald-500/30 dark:text-emerald-300 text-xs font-semibold whitespace-nowrap shrink-0 cursor-pointer transition-colors"
              >
                {isFa ? 'ثبت سفارش پروژه' : 'Request Quote'}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
              <ul className="sm:col-span-7 space-y-3 text-xs sm:text-sm text-slate-700 dark:text-slate-200">
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>
                    {isFa
                      ? 'مشاوره و اجرای پروژه‌های اختصاصی AI'
                      : 'Custom AI System Architecture'}
                  </span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>
                    {isFa
                      ? 'توسعه ربات‌های فروش و پشتیبانی تلگرام و بله'
                      : 'Telegram & Bale Commercial Bots'}
                  </span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>
                    {isFa
                      ? 'اتوماسیون فرآیندها و اتصال به وردپرس/ووکامرس'
                      : 'WordPress & WooCommerce Automation'}
                  </span>
                </li>
              </ul>

              <div className="sm:col-span-5 aspect-4/3 rounded-xl overflow-hidden bg-slate-100 dark:bg-[#07110E] border border-slate-200 dark:border-emerald-500/20">
                <img
                  src={servicesNeuralImg}
                  alt={isFa ? 'خدمات و مشاوره هوش مصنوعی' : 'AI Engineering Services'}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
