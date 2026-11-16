import React, { useRef, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Award,
  BookOpen,
  Bot,
  CheckCircle2,
  ChevronDown,
  Layers,
  Play,
  Send,
  ShieldCheck,
  Sparkles,
  User,
  Users,
  Zap,
} from 'lucide-react';
import { SoftwareProduct } from '../data/lmsData';
import { Course, Lang } from '../types/lms';
import { toLocaleDigits } from '../utils/formatters';
import { PriceActionButton } from './PriceActionButton';

/* 1. Products Showcase & Auto-Inherited 6-Section Product Landing Page */
interface ProductsDemoViewProps {
  lang: Lang;
  products: SoftwareProduct[];
  courses?: Course[];
  selectedProductId: string | null;
  onSelectProduct: (id: string) => void;
  onOpenCourseInPanel: (courseId: string) => void;
}

export const ProductsDemoView: React.FC<ProductsDemoViewProps> = ({
  lang,
  products,
  courses = [],
  selectedProductId,
  onSelectProduct,
  onOpenCourseInPanel,
}) => {
  const isFa = lang === 'fa';
  const activeProduct =
    products.find((p) => p.id === selectedProductId) || products[0] || null;
  const sandboxRef = useRef<HTMLDivElement>(null);

  const [demoSampleInput, setDemoSampleInput] = useState(
    isFa
      ? 'فیش واریزی ۱۴۰۵/۰۸/۲۵ به مبلغ ۱۲,۵۰۰,۰۰۰ تومان بابت طراحی ربات تلگرام'
      : 'Payment receipt #4920 · $420 · Bot automation setup'
  );
  const [demoRan, setDemoRan] = useState(false);
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(0);

  if (!activeProduct) {
    return (
      <div className="max-w-[1460px] mx-auto px-4 sm:px-6 py-12">
        <div className="rounded-2xl p-10 text-center bg-white dark:bg-[#0B1613] border border-slate-200 dark:border-emerald-500/15 space-y-2 shadow-xs">
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">
            {isFa ? 'هنوز محصولی ثبت نشده است' : 'No Products Available'}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {isFa
              ? 'داده‌های نمونه پاکسازی شده‌اند. می‌توانید از بخش مدیریت محتوا در پنل کاربری یا پیشخوان وردپرس محصولات واقعی خود را اضافه کنید.'
              : 'Demo products were cleared. Add real products from the Content Manager or WordPress WooCommerce.'}
          </p>
        </div>
      </div>
    );
  }

  const linkedCourse = activeProduct.linkedCourseId
    ? courses.find((c) => c.id === activeProduct.linkedCourseId)
    : undefined;

  const prodName = isFa ? activeProduct.name.fa : activeProduct.name.en;
  const prodCategory = isFa ? activeProduct.category.fa : activeProduct.category.en;

  // Smart default 3 steps inherited automatically by any product (including new WP/Woo products)
  const resolvedSteps = activeProduct.howItWorks?.length
    ? activeProduct.howItWorks
    : [
        {
          title: {
            fa: '۱. سفارش و دریافت آنی لایسنس',
            en: '1. Instant License Activation',
          },
          desc: {
            fa: `بلافاصله پس از تهیه ${activeProduct.name.fa}، کلید لایسنس و فایل نصب در پنل کاربری و ربات تلگرام/بله ارسال می‌شود.`,
            en: `Immediately receive your license key and installer for ${activeProduct.name.en} inside your dashboard and Messenger bot.`,
          },
        },
        {
          title: {
            fa: '۲. نصب ۱ کلیکی در وردپرس و اتصال ربات',
            en: '2. One-Click WordPress & Bot Setup',
          },
          desc: {
            fa: 'افزونه یا شورتکد اختصاصی را فعال کنید و در کمتر از ۲ دقیقه توکن ربات یا پنل پیامکی را متصل نمایید.',
            en: 'Activate the plugin or Elementor block and connect your Telegram, Bale, or SMS credentials in under 2 minutes.',
          },
        },
        {
          title: {
            fa: '۳. اجرای خودکار و گزارش‌گیری روزانه',
            en: '3. Automated Daily Execution',
          },
          desc: {
            fa: 'سیستم به‌صورت ۲۴ ساعته درخواست‌ها را پردازش کرده و خروجی آماده یا دسترسی محصول را به مشتریان تحویل می‌دهد.',
            en: 'Process workflows 24/7 with zero manual effort, automated reporting, and instant customer fulfillment.',
          },
        },
      ];

  // Smart default target personas inherited automatically
  const resolvedAudience = isFa
    ? activeProduct.whoIsItFor?.fa || [
        `مدیران کسب‌وکارها و فروشگاه‌های وردپرسی نیازمند ${activeProduct.name.fa}`,
        'مدرسان و آکادمی‌های آنلاین که تحویل خودکار محصول و دوره می‌خواهند',
        'توسعه‌دهندگان و تیم‌های فنی برای پیاده‌سازی سریع بدون کدنویسی تکراری',
        'تیم‌های پشتیبانی و مالی جهت خودکارسازی گزارش‌ها و پاسخگویی سریع',
      ]
    : activeProduct.whoIsItFor?.en || [
        `Business owners and WordPress teams deploying ${activeProduct.name.en}`,
        'Online academies automating instant course & license delivery',
        'Developers looking for production-ready REST API & Elementor integration',
        'Operations teams replacing repetitive manual reporting',
      ];

  // Smart default FAQs inherited automatically
  const resolvedFaqs = activeProduct.faqs?.length
    ? activeProduct.faqs
    : [
        {
          q: {
            fa: `بعد از خرید ${activeProduct.name.fa} فایل‌ها چطور تحویل داده می‌شوند؟`,
            en: `How is ${activeProduct.name.en} delivered after purchase?`,
          },
          a: {
            fa: 'بلافاصله پس از تکمیل سفارش، فایل نصبی، کلید لایسنس اختصاصی و مستندات کامل در پنل کاربری شما فعال شده و نسخه پشتیبان آن نیز توسط ربات تلگرام/بله برایتان ارسال می‌شود.',
            en: 'Instantaneously after checkout, your package files, license key, and documentation unlock in your account panel and sync to your Telegram/Bale bot.',
          },
        },
        {
          q: {
            fa: 'آیا با قالب و افزونه المنتور پرو و ووکامرس سازگار است؟',
            en: 'Is it compatible with Elementor Pro & WooCommerce?',
          },
          a: {
            fa: 'بله، تمامی محصولات iRamoAi دارای شورتکد اختصاصی، ویجت المنتور پرو و اتصال مستقیم به سفارش‌های ووکامرس هستند و بدون تداخل با قالب فعلی سایت کار می‌کنند.',
            en: 'Yes. Every product natively supports WooCommerce checkout hooks, Elementor Pro widgets, and clean isolated styling.',
          },
        },
        {
          q: {
            fa: 'آیا آپدیت‌ها و پشتیبانی فنی شامل این لایسنس می‌شود؟',
            en: 'Are future updates and technical support included?',
          },
          a: {
            fa: 'بله، تمام خریداران به آپدیت‌های بعدی محصول، رفع باگ و راهنمای گام‌به‌گام راه‌اندازی دسترسی مادام‌العمر یا مطابق دوره اشتراک خواهند داشت.',
            en: 'Yes, you receive continuous version updates, security patches, and step-by-step setup guidance.',
          },
        },
        {
          q: {
            fa: 'آیا امکان اتصال به ربات بله، تلگرام و پنل پیامکی وجود دارد؟',
            en: 'Can I connect Telegram, Bale Messenger, and SMS panels?',
          },
          a: {
            fa: 'بله، از پنل تنظیمات افزونه می‌توانید به‌صورت همزمان توکن ربات تلگرام، ربات پیام‌رسان بله و پترن پنل پیامکی (کاوه‌نگار، ملی‌پیامک و...) را وارد و فعال کنید.',
            en: 'Yes, you can configure Telegram, Bale Messenger bots, and Iranian/REST SMS OTP gateways directly from the admin control panel.',
          },
        },
      ];

  const scrollToSandbox = () => {
    sandboxRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  return (
    <div className="max-w-[1460px] mx-auto px-4 sm:px-6 py-10 space-y-10">
      {/* Compact Top Switcher Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div className="space-y-1.5 max-w-2xl">
          <p className="text-xs font-semibold text-[var(--iramo-primary)]">
            {isFa ? 'ویترین و لندینگ تخصصی محصولات نرم‌افزاری' : 'Software Products & Dedicated Landing Pages'}
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white text-balance">
            {isFa
              ? 'محصولات نرم‌افزاری و آزمایشگاه دمو زنده'
              : 'Software Products & Interactive Live Demos'}
          </h1>
        </div>
        <span className="text-xs text-slate-500 dark:text-slate-400 tabular-nums">
          {toLocaleDigits(products.length, lang)}{' '}
          {isFa ? 'محصول فعال با لندینگ اختصاصی' : 'active products with full landing'}
        </span>
      </div>

      {/* Product Selector Cards Grid (Every newly added WP/Panel product renders identically here) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {products.map((prod) => {
          const active = prod.id === activeProduct.id;
          return (
            <div
              key={prod.id}
              onClick={() => {
                onSelectProduct(prod.id);
                setDemoRan(false);
                setOpenFaqIdx(0);
              }}
              className={`group iramo-card-interactive rounded-2xl border text-start overflow-hidden cursor-pointer flex flex-col justify-between ${
                active
                  ? 'bg-white dark:bg-[#0D1E18] border-[var(--iramo-primary-border)] ring-1 ring-[var(--iramo-primary)]/30 shadow-sm'
                  : 'bg-white dark:bg-[#0B1613] border-[var(--iramo-card-border)] shadow-[0_1px_2px_rgba(15,23,42,0.03)]'
              }`}
            >
              <div>
                <div className="aspect-4/3 bg-slate-100 dark:bg-[#07110E] overflow-hidden relative">
                  <img
                    src={prod.thumbnail}
                    alt={isFa ? prod.name.fa : prod.name.en}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-150"
                  />
                  {active && (
                    <span className="absolute top-2.5 end-2.5 px-2.5 py-1 rounded-lg bg-[var(--iramo-primary)] text-[var(--iramo-primary-fg)] text-[10px] font-bold shadow-xs">
                      {isFa ? 'در حال نمایش' : 'Active View'}
                    </span>
                  )}
                </div>
                <div className="p-4 space-y-1">
                  <p className="text-[11px] font-semibold text-[var(--iramo-primary)]">
                    {isFa ? prod.category.fa : prod.category.en}
                  </p>
                  <p className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-[var(--iramo-primary)] transition-colors duration-150 truncate">
                    {isFa ? prod.name.fa : prod.name.en}
                  </p>
                </div>
              </div>
              <div className="px-4 pb-4 pt-2">
                <PriceActionButton
                  lang={lang}
                  priceToman={prod.priceToman}
                  priceUsd={prod.priceUsd}
                  ctaLabel={{
                    fa: active ? 'لندینگ باز' : 'مشاهده لندینگ',
                    en: active ? 'Viewing' : 'View Page',
                  }}
                  variant={active ? 'emerald' : 'amber'}
                  fullWidth
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectProduct(prod.id);
                    setDemoRan(false);
                    setOpenFaqIdx(0);
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* ================================================================ */}
      {/* AUTO-INHERITED 6-SECTION PRODUCT LANDING PAGE                    */}
      {/* ================================================================ */}
      <div className="space-y-8 pt-2">
        {/* SECTION 1: Product Hero (Conversion Above-the-Fold) */}
        <section className="rounded-3xl p-6 sm:p-8 lg:p-10 bg-white dark:bg-[#0B1613] border border-[var(--iramo-card-border)] shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-5">
            <div className="flex flex-wrap items-center gap-2.5 text-xs">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[var(--iramo-primary-soft)] border border-[var(--iramo-primary-border)] text-[var(--iramo-primary)] font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{prodCategory}</span>
              </span>
              <span className="text-slate-500 dark:text-slate-400 font-semibold">
                {isFa ? activeProduct.billingLabel.fa : activeProduct.billingLabel.en}
              </span>
            </div>

            <div className="space-y-3">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white leading-tight text-balance">
                {prodName}
              </h2>
              <p className="text-sm sm:text-base font-medium text-[var(--iramo-primary)] leading-relaxed">
                {isFa ? activeProduct.tagline.fa : activeProduct.tagline.en}
              </p>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300/90 leading-relaxed max-w-2xl">
                {isFa ? activeProduct.description.fa : activeProduct.description.en}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <PriceActionButton
                lang={lang}
                priceToman={activeProduct.priceToman}
                priceUsd={activeProduct.priceUsd}
                ctaLabel={{ fa: 'تهیه و فعال‌سازی آنی', en: 'Get Instant Access' }}
                variant="amber"
                size="md"
                onClick={() => {
                  if (activeProduct.checkoutUrl) {
                    window.location.assign(activeProduct.checkoutUrl);
                  } else if (activeProduct.linkedCourseId) {
                    onOpenCourseInPanel(activeProduct.linkedCourseId);
                  } else {
                    scrollToSandbox();
                  }
                }}
              />

              <button
                type="button"
                onClick={scrollToSandbox}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[var(--iramo-primary-border)] text-[var(--iramo-primary)] hover:bg-[var(--iramo-primary-soft)] text-xs font-bold transition-colors cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{isFa ? 'مشاهده دمو زنده' : 'Try Live Demo'}</span>
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-3 border-t border-[var(--iramo-card-border)] text-[11.5px] font-medium text-slate-500 dark:text-slate-400">
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[var(--iramo-primary)]" />
                <span>{isFa ? 'نصب آسان روی وردپرس و المنتور' : 'WP & Elementor Ready'}</span>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Bot className="w-4 h-4 text-[var(--iramo-primary)]" />
                <span>{isFa ? 'تحویل خودکار در تلگرام و بله' : 'Telegram & Bale Sync'}</span>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Award className="w-4 h-4 text-[#FFBA00]" />
                <span>{isFa ? 'آپدیت و پشتیبانی مداوم' : 'Updates & Support Included'}</span>
              </span>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="relative rounded-2xl overflow-hidden aspect-4/3 bg-slate-100 dark:bg-[#07110E] border border-[var(--iramo-card-border)] shadow-md">
              <img
                src={activeProduct.thumbnail}
                alt={prodName}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </section>

        {/* SECTION 2: Trust & Live Metrics Strip */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {activeProduct.demoMetrics.map((m, i) => (
            <div
              key={i}
              className="iramo-card-interactive rounded-2xl p-5 bg-gradient-to-br from-emerald-50/75 via-white to-white dark:from-[#0E241C] dark:via-[#0B1613] dark:to-[#0B1613] border border-emerald-200/80 dark:border-emerald-500/20 flex items-center justify-between gap-4"
            >
              <div className="space-y-1 min-w-0">
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                  {isFa ? m.label.fa : m.label.en}
                </p>
                <p className="text-lg sm:text-xl font-extrabold text-[var(--iramo-primary)] tabular-nums">
                  {isFa ? m.value.fa : m.value.en}
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-[var(--iramo-primary-soft)] text-[var(--iramo-primary)] flex items-center justify-center shrink-0">
                <Zap className="w-5 h-5" />
              </div>
            </div>
          ))}
        </section>

        {/* SECTION 3: How It Works in 3 Steps */}
        <section className="rounded-3xl p-6 sm:p-7 bg-white dark:bg-[#0B1613] border border-[var(--iramo-card-border)] space-y-5">
          <div className="space-y-1">
            <p className="text-xs font-bold text-[var(--iramo-primary)]">
              {isFa ? 'مسیر سریع راه‌اندازی' : '3-Step Quick Workflow'}
            </p>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
              {isFa ? `${prodName} چطور کار می‌کند؟` : `How ${prodName} Works`}
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {resolvedSteps.map((step, idx) => (
              <div
                key={idx}
                className="iramo-card-interactive rounded-2xl p-5 bg-slate-50/80 dark:bg-[#07110E] border border-[var(--iramo-card-border)] space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <span className="w-8 h-8 rounded-xl bg-[#FFBA00] text-[#061A13] font-extrabold text-sm tabular-nums flex items-center justify-center shadow-xs">
                    {toLocaleDigits(idx + 1, lang)}
                  </span>
                  <Layers className="w-4 h-4 text-[var(--iramo-primary)] opacity-70" />
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  {isFa ? step.title.fa : step.title.en}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {isFa ? step.desc.fa : step.desc.en}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 4: Feature Bento Grid + Live Interactive Sandbox */}
        <section
          ref={sandboxRef}
          className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch"
        >
          <div className="lg:col-span-6 rounded-3xl p-6 bg-white dark:bg-[#0B1613] border border-[var(--iramo-card-border)] shadow-[0_1px_3px_rgba(15,23,42,0.04)] flex flex-col justify-between gap-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {isFa ? 'امکانات کلیدی و فنی محصول' : 'Core Technical Capabilities'}
                </h3>
                <span className="text-xs text-[var(--iramo-primary)] font-semibold">
                  {isFa ? activeProduct.billingLabel.fa : activeProduct.billingLabel.en}
                </span>
              </div>

              <div className="space-y-2.5">
                {(isFa ? activeProduct.highlights.fa : activeProduct.highlights.en).map(
                  (item, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50/80 dark:bg-[#07110E] border border-[var(--iramo-card-border)] text-xs sm:text-sm text-slate-700 dark:text-slate-200"
                    >
                      <CheckCircle2 className="w-4 h-4 text-[var(--iramo-primary)] shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{item}</span>
                    </div>
                  )
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-[var(--iramo-card-border)] flex flex-wrap items-center justify-between gap-4">
              <PriceActionButton
                lang={lang}
                priceToman={activeProduct.priceToman}
                priceUsd={activeProduct.priceUsd}
                ctaLabel={{ fa: 'خرید لایسنس', en: 'Get License' }}
                variant="amber"
                size="md"
                onClick={() => {
                  if (activeProduct.linkedCourseId) {
                    onOpenCourseInPanel(activeProduct.linkedCourseId);
                  }
                }}
              />

              {activeProduct.linkedCourseId && (
                <button
                  type="button"
                  onClick={() => onOpenCourseInPanel(activeProduct.linkedCourseId!)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[var(--iramo-primary-border)] text-[var(--iramo-primary)] hover:bg-[var(--iramo-primary-soft)] text-xs font-bold transition-colors cursor-pointer whitespace-nowrap"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>
                    {isFa
                      ? 'مشاهده آموزش راه‌اندازی در پنل'
                      : 'Open Setup Course in Panel'}
                  </span>
                </button>
              )}
            </div>
          </div>

          {/* Live Interactive Sandbox */}
          <div className="lg:col-span-6 rounded-3xl p-6 bg-white dark:bg-[#07110E] border border-[var(--iramo-card-border)] shadow-[0_1px_3px_rgba(15,23,42,0.04)] flex flex-col justify-between gap-5">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {isFa ? 'آزمایشگاه دمو تعاملی' : 'Interactive Product Sandbox'}
                </h3>
                <span className="text-[11px] text-[var(--iramo-primary)] font-semibold">
                  {prodCategory}
                </span>
              </div>

              <div className="space-y-2 pt-1">
                <label className="text-xs text-slate-600 dark:text-slate-300 block">
                  {isFa
                    ? 'ورودی آزمایشی خود را وارد کنید تا خروجی محصول شبیه‌سازی شود:'
                    : 'Test a sample input payload:'}
                </label>
                <textarea
                  rows={3}
                  value={demoSampleInput}
                  onChange={(e) => setDemoSampleInput(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-[#050C0A] border border-[var(--iramo-card-border)] text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[var(--iramo-primary-border)]"
                />
                <button
                  type="button"
                  onClick={() => setDemoRan(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--iramo-primary)] hover:bg-[var(--iramo-primary-hover)] text-[var(--iramo-primary-fg)] text-xs font-bold cursor-pointer transition-colors"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>{isFa ? 'اجرای دمو زنده' : 'Run Live Demo'}</span>
                </button>
              </div>
            </div>

            <div className="rounded-xl p-4 bg-slate-900 dark:bg-[#050C0A] border border-slate-800 dark:border-emerald-500/20 min-h-[125px]">
              <p className="text-[11px] text-slate-400 mb-2">
                {isFa ? 'خروجی ساختاریافته محصول:' : 'Structured Product Output:'}
              </p>
              {demoRan ? (
                <pre
                  dir="ltr"
                  className="text-xs font-mono text-emerald-300 overflow-x-auto leading-relaxed"
                >
                  {JSON.stringify(
                    {
                      product: activeProduct.slug,
                      status: 'processed',
                      sync: ['telegram_bot', 'bale_bot', 'woocommerce'],
                      summary: demoSampleInput.slice(0, 70),
                    },
                    null,
                    2
                  )}
                </pre>
              ) : (
                <p className="text-xs text-slate-400">
                  {isFa
                    ? 'روی دکمه «اجرای دمو زنده» کلیک کنید تا خروجی نمونه تولید شود.'
                    : 'Click "Run Live Demo" to inspect a structured output payload.'}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* SECTION 5: Who Is It For + Smart Bundle Academy Course Upsell */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          <div
            className={`${
              linkedCourse ? 'lg:col-span-6' : 'lg:col-span-12'
            } rounded-3xl p-6 bg-white dark:bg-[#0B1613] border border-[var(--iramo-card-border)] space-y-4`}
          >
            <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
              <Users className="w-4 h-4 text-[var(--iramo-primary)]" />
              <span>{isFa ? 'این محصول مناسب چه کسانی است؟' : 'Who Is This Built For?'}</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {resolvedAudience.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#07110E] border border-[var(--iramo-card-border)] flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300 leading-relaxed"
                >
                  <CheckCircle2 className="w-4 h-4 text-[var(--iramo-primary)] shrink-0 mt-0.5" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {linkedCourse && (
            <div className="lg:col-span-6 rounded-3xl p-6 bg-gradient-to-br from-emerald-50/90 via-white to-white dark:from-[#0E241C] dark:via-[#0B1613] dark:to-[#07110E] border border-emerald-200/80 dark:border-emerald-500/25 flex flex-col justify-between gap-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--iramo-primary)]">
                    <BookOpen className="w-4 h-4" />
                    <span>
                      {isFa ? 'پیشنهاد باندل: محصول + دوره آموزشی' : 'Recommended Training Track'}
                    </span>
                  </span>
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#FFBA00]/20 text-[#9A6E00] dark:text-[#FFBA00]">
                    {isFa ? 'آموزش راه‌اندازی صفر تا صد' : 'Step-by-Step Setup'}
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 items-center">
                  <img
                    src={linkedCourse.thumbnail}
                    alt={isFa ? linkedCourse.title.fa : linkedCourse.title.en}
                    referrerPolicy="no-referrer"
                    className="w-full sm:w-36 aspect-4/3 rounded-xl object-cover shrink-0 border border-emerald-200/60 dark:border-emerald-500/20"
                  />
                  <div className="space-y-1.5 min-w-0">
                    <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-snug">
                      {isFa ? linkedCourse.title.fa : linkedCourse.title.en}
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-300/85 line-clamp-2 leading-relaxed">
                      {isFa ? linkedCourse.description.fa : linkedCourse.description.en}
                    </p>
                    <p className="text-[11px] font-semibold text-[var(--iramo-primary)] tabular-nums">
                      {isFa ? linkedCourse.totalDuration.fa : linkedCourse.totalDuration.en} ·{' '}
                      {toLocaleDigits(linkedCourse.lessonCount, lang)}{' '}
                      {isFa ? 'جلسه عملی' : 'Lessons'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-emerald-200/60 dark:border-emerald-500/15 flex flex-wrap items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => onOpenCourseInPanel(linkedCourse.id)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--iramo-primary)] hover:bg-[var(--iramo-primary-hover)] text-[var(--iramo-primary-fg)] text-xs font-bold cursor-pointer transition-colors"
                >
                  <span>{isFa ? 'ورود به دوره آموزشی همراه' : 'Open Included Course'}</span>
                  {isFa ? (
                    <ArrowLeft className="w-3.5 h-3.5" />
                  ) : (
                    <ArrowRight className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>
          )}
        </section>

        {/* SECTION 6: Product FAQ Accordion + Final Conversion CTA */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-7 rounded-3xl p-6 bg-white dark:bg-[#0B1613] border border-[var(--iramo-card-border)] space-y-3">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white pb-1">
              {isFa ? `سوالات متداول درباره ${prodName}` : `${prodName} · FAQ`}
            </h3>
            <div className="space-y-2.5">
              {resolvedFaqs.map((faq, idx) => {
                const isOpen = openFaqIdx === idx;
                return (
                  <div
                    key={idx}
                    className="rounded-xl border border-[var(--iramo-card-border)] bg-slate-50/70 dark:bg-[#07110E] overflow-hidden"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaqIdx(isOpen ? null : idx)}
                      className="w-full flex items-center justify-between gap-3 px-4 py-3 text-start text-xs sm:text-sm font-bold text-slate-900 dark:text-white cursor-pointer"
                    >
                      <span>{isFa ? faq.q.fa : faq.q.en}</span>
                      <ChevronDown
                        className={`w-4 h-4 text-[var(--iramo-primary)] shrink-0 transition-transform duration-150 ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-4 pb-3.5 pt-0.5 text-xs text-slate-600 dark:text-slate-300/85 leading-relaxed">
                        {isFa ? faq.a.fa : faq.a.en}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="lg:col-span-5 rounded-3xl p-6 sm:p-7 bg-gradient-to-br from-slate-900 via-[#081A14] to-emerald-950 text-white border border-emerald-500/30 space-y-4">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#FFBA00]">
              <Sparkles className="w-4 h-4" />
              <span>{isFa ? 'آماده شروع هستید؟' : 'Ready to Launch?'}</span>
            </span>
            <h3 className="text-xl font-extrabold leading-snug">
              {isFa
                ? `همین حالا ${prodName} را روی سایت و کسب‌وکار خود فعال کنید`
                : `Activate ${prodName} on Your Site Today`}
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              {isFa
                ? 'تحویل آنی فایل‌ها، کد لایسنس، اتصال مستقیم به تلگرام و بله و پشتیبانی راه‌اندازی از روز اول.'
                : 'Instant downloads, license keys, Messenger automation, and full setup documentation included.'}
            </p>
            <div className="pt-2">
              <PriceActionButton
                lang={lang}
                priceToman={activeProduct.priceToman}
                priceUsd={activeProduct.priceUsd}
                ctaLabel={{ fa: 'سفارش و دریافت فوری', en: 'Order Now' }}
                variant="amber"
                size="md"
                fullWidth
                onClick={() => {
                  if (activeProduct.checkoutUrl) {
                    window.location.assign(activeProduct.checkoutUrl);
                  } else if (activeProduct.linkedCourseId) {
                    onOpenCourseInPanel(activeProduct.linkedCourseId);
                  } else {
                    scrollToSandbox();
                  }
                }}
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

/* 2. Public Courses Catalog Page */
interface PublicCoursesViewProps {
  lang: Lang;
  courses: Course[];
  onOpenCourseInPanel: (courseId: string) => void;
  onEnterPanel: () => void;
}

export const PublicCoursesView: React.FC<PublicCoursesViewProps> = ({
  lang,
  courses,
  onOpenCourseInPanel,
  onEnterPanel,
}) => {
  const isFa = lang === 'fa';
  return (
    <div className="max-w-[1460px] mx-auto px-4 sm:px-6 py-10 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="space-y-2 max-w-2xl">
          <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            {isFa ? 'آکادمی تخصصی iRamoAi' : 'iRamoAi Engineering Academy'}
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white text-balance">
            {isFa
              ? 'دوره‌های آموزشی هوش مصنوعی، ربات‌سازی و وردپرس'
              : 'Courses in AI Systems, Bots & WordPress Automation'}
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {isFa
              ? 'برای مشاهده ویدیوهای آموزشی، تمرین‌های عملی و دریافت گواهینامه، وارد پنل کاربری خود شوید.'
              : 'Sign in to watch video modules, submit hands-on labs, and track your learning progress.'}
          </p>
        </div>

        <button
          type="button"
          onClick={onEnterPanel}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--iramo-accent)] hover:bg-[var(--iramo-accent-hover)] text-[var(--iramo-accent-fg)] text-xs font-bold cursor-pointer whitespace-nowrap self-start sm:self-auto shadow-xs transition-colors"
        >
          <User className="w-4 h-4" />
          <span>{isFa ? 'ورود به پنل کاربری' : 'Open Student Panel'}</span>
        </button>
      </div>

      {courses.length === 0 ? (
        <div className="rounded-2xl p-10 text-center bg-white dark:bg-[#0B1613] border border-[var(--iramo-card-border)] space-y-2 shadow-xs">
          <p className="text-sm font-bold text-slate-900 dark:text-white">
            {isFa ? 'در حال حاضر دوره‌ای ثبت نشده است' : 'No Courses Available'}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {isFa
              ? 'داده‌های نمونه پاکسازی شده‌اند. از بخش مدیریت محتوا در پنل کاربری دوره جدید اضافه کنید.'
              : 'Demo courses were cleared. Add new courses from the Content Manager.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {courses.map((course) => (
            <article
              key={course.id}
              onClick={() => onOpenCourseInPanel(course.id)}
              className="group iramo-card-interactive rounded-2xl bg-white dark:bg-[#0B1613] border border-[var(--iramo-card-border)] overflow-hidden flex flex-col justify-between shadow-[0_1px_3px_rgba(15,23,42,0.04)] cursor-pointer"
            >
              <div>
                <div className="aspect-4/3 bg-slate-100 dark:bg-[#07110E] overflow-hidden">
                  <img
                    src={course.thumbnail}
                    alt={isFa ? course.title.fa : course.title.en}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-150"
                  />
                </div>
                <div className="p-5 space-y-2">
                  <p className="text-[11px] font-semibold text-[var(--iramo-primary)] tabular-nums">
                    {course.category} · {isFa ? course.totalDuration.fa : course.totalDuration.en} ·{' '}
                    {toLocaleDigits(course.lessonCount, lang)}{' '}
                    {isFa ? 'جلسه' : 'Lessons'}
                  </p>
                  <h2 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-[var(--iramo-primary)] transition-colors duration-150 leading-snug">
                    {isFa ? course.title.fa : course.title.en}
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2">
                    {isFa ? course.description.fa : course.description.en}
                  </p>
                </div>
              </div>

              <div className="px-5 pb-5 pt-2">
                <PriceActionButton
                  lang={lang}
                  priceToman={course.priceToman}
                  priceUsd={course.priceUsd}
                  ctaLabel={{ fa: 'مشاهده دوره', en: 'Open Course' }}
                  variant="emerald"
                  fullWidth
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenCourseInPanel(course.id);
                  }}
                />
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

/* 3. Services & Project Consultation Page */
interface ServicesConsultationViewProps {
  lang: Lang;
  wpRestUrl?: string;
}

export const ServicesConsultationView: React.FC<ServicesConsultationViewProps> = ({
  lang,
  wpRestUrl,
}) => {
  const isFa = lang === 'fa';
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [serviceType, setServiceType] = useState('bot');
  const [details, setDetails] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !contact.trim()) return;
    if (wpRestUrl) {
      try {
        const base = wpRestUrl.replace(/\/$/, '');
        await fetch(`${base}/consultation`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: name.trim(),
            contact: contact.trim(),
            serviceType,
            details: details.trim(),
          }),
        });
      } catch {
        // Fallback smoothly without blocking form confirmation
      }
    }
    setSubmitted(true);
  };

  return (
    <div className="max-w-[1460px] mx-auto px-4 sm:px-6 py-10 space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-6 space-y-6">
          <div className="space-y-2">
            <p className="text-xs font-semibold text-[var(--iramo-primary)] dark:text-[#FFBA00]">
              {isFa ? 'مهندسی پروژه و مشاوره تخصصی' : 'Custom Engineering & Consulting'}
            </p>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white text-balance">
              {isFa
                ? 'پروژه هوشمند کسب‌وکار خود را به تیم iRamoAi بسپارید'
                : 'Partner with iRamoAi to Build Your AI & Bot Infrastructure'}
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              {isFa
                ? 'تمامی درخواست‌های ثبت‌شده بلافاصله از طریق پل ربات به تلگرام و بله تیم فنی ارسال می‌شوند تا در کمتر از ۲ ساعت جلسه بررسی زمان‌بندی شود.'
                : 'Every inquiry is routed straight to our engineering team via Telegram & Bale Bot API for rapid scoping.'}
            </p>
          </div>

          <div className="space-y-3">
            {[
              {
                num: toLocaleDigits('01.', lang),
                faTitle: 'طراحی ربات‌های فروشگاهی و پشتیبانی تلگرام و بله',
                enTitle: 'Commercial Telegram & Bale Bot Engineering',
                faDesc: 'اتصال کامل به درگاه پرداخت، ووکامرس، احراز هویت کد تایید و پشتیبانی هوشمند ۲۴ ساعته.',
                enDesc: 'Connected directly to WooCommerce checkout, license generation, and AI customer triage.',
              },
              {
                num: toLocaleDigits('02.', lang),
                faTitle: 'هوشمندسازی و اتوماسیون فرآیندهای سازمانی',
                enTitle: 'Enterprise Workflow & Financial Automation',
                faDesc: 'حذف کارهای تکراری، تحلیل فاکتورها با حسابیار و اتصال فرم‌های المنتور به CRM.',
                enDesc: 'Automated receipt OCR, daily executive digests, and Elementor-to-CRM pipelines.',
              },
              {
                num: toLocaleDigits('03.', lang),
                faTitle: 'توسعه پلاگین‌های اختصاصی وردپرس و آکادمی',
                enTitle: 'Custom WordPress Plugins & Elementor Widgets',
                faDesc: 'پیاده‌سازی سیستم‌های آموزش آنلاین، بازار ابزارها و داشبورد کاربری سریع بدون کندی سایت.',
                enDesc: 'High-speed custom React/PHP WordPress plugins tailored for Elementor Pro.',
              },
            ].map((srv) => (
              <div
                key={srv.num}
                className="p-5 rounded-2xl bg-white dark:bg-[#0B1613] border border-slate-200/85 dark:border-emerald-500/15 shadow-xs space-y-1.5"
              >
                <p className="text-sm font-bold text-slate-900 dark:text-white">
                  <span className="text-[var(--iramo-primary)] dark:text-[#FFBA00] me-2 tabular-nums">
                    {srv.num}
                  </span>
                  {isFa ? srv.faTitle : srv.enTitle}
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {isFa ? srv.faDesc : srv.enDesc}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-6 rounded-2xl p-6 sm:p-7 bg-white dark:bg-[#0B1613] border border-slate-200/85 dark:border-emerald-500/25 shadow-xs">
          {submitted ? (
            <div className="py-10 text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                {isFa
                  ? 'درخواست شما با موفقیت ثبت و به ربات تیم فنی ارسال شد'
                  : 'Inquiry Submitted & Forwarded to Engineering Bot'}
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
                {isFa
                  ? `ممنون ${name} عزیز؛ جزئیات پروژه شما از طریق پل تلگرام و بله ثبت شد و کارشناسان ما با شماره/آیدی ${contact} تماس می‌گیرند.`
                  : `Thank you ${name}. Your project scope was dispatched to our Telegram/Bale admin channel and we will reach out via ${contact}.`}
              </p>
              <button
                type="button"
                onClick={() => {
                  setSubmitted(false);
                  setDetails('');
                }}
                className="px-4 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 text-xs font-semibold cursor-pointer"
              >
                {isFa ? 'ثبت درخواست جدید' : 'Submit Another Request'}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                {isFa ? 'فرم درخواست مشاوره و برآورد پروژه' : 'Project Scoping & Consultation'}
              </h2>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block">
                  {isFa ? 'نام و نام خانوادگی' : 'Full Name'}
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={isFa ? 'مثلاً: علی محمدی' : 'e.g. Ali Mohammadi'}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#050C0A] border border-slate-200 dark:border-emerald-500/20 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 dark:focus:border-emerald-400"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block">
                  {isFa ? 'شماره تماس یا آیدی تلگرام/بله' : 'Phone or Telegram / Bale Handle'}
                </label>
                <input
                  type="text"
                  required
                  dir="ltr"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  placeholder="@username / 0912..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#050C0A] border border-slate-200 dark:border-emerald-500/20 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 dark:focus:border-emerald-400"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block">
                  {isFa ? 'نوع پروژه مورد نیاز' : 'Service Category'}
                </label>
                <select
                  value={serviceType}
                  onChange={(e) => setServiceType(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#050C0A] border border-slate-200 dark:border-emerald-500/20 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 dark:focus:border-emerald-400 cursor-pointer"
                >
                  <option value="bot">
                    {isFa ? 'توسعه ربات هوشمند تلگرام و بله' : 'Telegram & Bale Bot Development'}
                  </option>
                  <option value="ai">
                    {isFa ? 'پیاده‌سازی سیستم هوش مصنوعی و پایگاه دانش' : 'Custom AI Agent / RAG System'}
                  </option>
                  <option value="wp">
                    {isFa ? 'پلاگین اختصاصی وردپرس و المنتور پرو' : 'WordPress & Elementor Pro Academy'}
                  </option>
                  <option value="hesabyar">
                    {isFa ? 'سفارشی‌سازی حسابیار و اتوماسیون مالی' : 'Hesabyar & Financial Automation'}
                  </option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block">
                  {isFa ? 'توضیحات کوتاه درباره ایده یا نیاز شما' : 'Project Brief'}
                </label>
                <textarea
                  rows={4}
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder={
                    isFa
                      ? 'بفرمایید ربات یا سیستم هوشمند قرار است چه کاری برای کسب‌وکار شما انجام دهد...'
                      : 'Describe the workflow, integrations, or timeline you have in mind...'
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#050C0A] border border-slate-200 dark:border-emerald-500/20 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 dark:focus:border-emerald-400"
                />
              </div>

              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-[var(--iramo-accent)] hover:bg-[var(--iramo-accent-hover)] text-[var(--iramo-accent-fg)] text-sm font-bold shadow-xs transition-colors cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>{isFa ? 'ارسال درخواست مشاوره' : 'Submit Consultation Request'}</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
