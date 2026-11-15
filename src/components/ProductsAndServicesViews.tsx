import React, { useState } from 'react';
import {
  CheckCircle2,
  Play,
  Send,
  User,
} from 'lucide-react';
import { motion } from 'motion/react';
import { SoftwareProduct } from '../data/lmsData';
import { Course, Lang } from '../types/lms';
import { toLocaleDigits } from '../utils/formatters';
import { PriceActionButton } from './PriceActionButton';

/* 1. Products Showcase & Interactive Demo Page */
interface ProductsDemoViewProps {
  lang: Lang;
  products: SoftwareProduct[];
  selectedProductId: string | null;
  onSelectProduct: (id: string) => void;
  onOpenCourseInPanel: (courseId: string) => void;
}

export const ProductsDemoView: React.FC<ProductsDemoViewProps> = ({
  lang,
  products,
  selectedProductId,
  onSelectProduct,
  onOpenCourseInPanel,
}) => {
  const isFa = lang === 'fa';
  const activeProduct =
    products.find((p) => p.id === selectedProductId) || products[0] || null;

  const [demoSampleInput, setDemoSampleInput] = useState(
    isFa
      ? 'فیش واریزی ۱۴۰۵/۰۸/۲۵ به مبلغ ۱۲,۵۰۰,۰۰۰ تومان بابت طراحی ربات تلگرام'
      : 'Payment receipt #4920 · $420 · Bot automation setup'
  );
  const [demoRan, setDemoRan] = useState(false);

  if (!activeProduct) {
    return (
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 py-12">
        <div className="rounded-2xl p-10 text-center bg-white dark:bg-[#0B1613] border border-slate-200 dark:border-emerald-500/15 space-y-2 shadow-xs">
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">
            {isFa ? 'هنوز محصولی ثبت نشده است' : 'No Products Available'}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {isFa
              ? 'داده‌های نمونه پاکسازی شده‌اند. می‌توانید از بخش مدیریت محتوا در پنل کاربری محصولات واقعی خود را اضافه کنید.'
              : 'Demo products were cleared. Add real products from the Content Manager in your panel.'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1320px] mx-auto px-4 sm:px-6 py-10 space-y-8">
      <div className="space-y-2 max-w-2xl">
        <p className="text-xs font-semibold text-amber-600 dark:text-amber-400">
          {isFa ? 'ویترین محصولات نرم‌افزاری iRamoAi' : 'iRamoAi Software Showcase'}
        </p>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white text-balance">
          {isFa
            ? 'محصولات نرم‌افزاری و آزمایشگاه دمو زنده'
            : 'Software Products & Interactive Live Demos'}
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          {isFa
            ? 'هر محصول را انتخاب کنید، دمو تعاملی آن را امتحان کنید و به آموزش کامل راه‌اندازی در پنل کاربری دسترسی داشته باشید.'
            : 'Select any software product to inspect technical features, test a live interactive preview, or open its training track.'}
        </p>
      </div>

      {/* 4:3 Product Cards Selector */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {products.map((prod) => {
          const active = prod.id === activeProduct.id;
          return (
            <motion.div
              key={prod.id}
              whileHover={{ y: -3 }}
              onClick={() => {
                onSelectProduct(prod.id);
                setDemoRan(false);
              }}
              className={`rounded-2xl border text-start overflow-hidden transition-all cursor-pointer flex flex-col justify-between shadow-xs ${
                active
                  ? 'bg-emerald-50/70 dark:bg-[#0D1E18] border-amber-500 dark:border-amber-400 shadow-md shadow-amber-500/10'
                  : 'bg-white dark:bg-[#0B1613] border-slate-200/85 dark:border-emerald-500/15 hover:border-emerald-400/60'
              }`}
            >
              <div>
                <div className="aspect-4/3 bg-slate-100 dark:bg-[#07110E] overflow-hidden">
                  <img
                    src={prod.thumbnail}
                    alt={isFa ? prod.name.fa : prod.name.en}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4 space-y-1">
                  <p className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                    {isFa ? prod.category.fa : prod.category.en}
                  </p>
                  <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
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
                    fa: active ? 'انتخاب‌شده' : 'دمو و خرید',
                    en: active ? 'Selected' : 'View Demo',
                  }}
                  variant={active ? 'emerald' : 'amber'}
                  fullWidth
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectProduct(prod.id);
                    setDemoRan(false);
                  }}
                />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Active Product Detail & Interactive Demo Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-6 rounded-2xl p-6 bg-white dark:bg-[#0B1613] border border-slate-200/85 dark:border-emerald-500/20 shadow-xs flex flex-col justify-between gap-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                {isFa ? activeProduct.name.fa : activeProduct.name.en}
              </h2>
              <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                {isFa ? activeProduct.billingLabel.fa : activeProduct.billingLabel.en}
              </span>
            </div>

            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {isFa ? activeProduct.description.fa : activeProduct.description.en}
            </p>

            <ul className="space-y-2.5 pt-2">
              {(isFa ? activeProduct.highlights.fa : activeProduct.highlights.en).map(
                (item, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-200"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                )
              )}
            </ul>
          </div>

          <div className="pt-4 border-t border-slate-200 dark:border-emerald-500/15 flex flex-wrap items-center justify-between gap-4">
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
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-emerald-500/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-500/15 text-xs font-bold transition-colors cursor-pointer whitespace-nowrap"
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
        <div className="lg:col-span-6 rounded-2xl p-6 bg-white dark:bg-[#07110E] border border-slate-200/85 dark:border-emerald-500/25 shadow-xs flex flex-col justify-between gap-5">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                {isFa ? 'آزمایشگاه دمو تعاملی' : 'Interactive Product Sandbox'}
              </h3>
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                {isFa ? activeProduct.category.fa : activeProduct.category.en}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2.5">
              {activeProduct.demoMetrics.map((m, i) => (
                <div
                  key={i}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-[#050C0A] border border-slate-200/80 dark:border-emerald-500/15"
                >
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                    {isFa ? m.label.fa : m.label.en}
                  </p>
                  <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400 tabular-nums mt-1">
                    {isFa ? m.value.fa : m.value.en}
                  </p>
                </div>
              ))}
            </div>

            <div className="space-y-2 pt-2">
              <label className="text-xs text-slate-600 dark:text-slate-300 block">
                {isFa
                  ? 'ورودی آزمایشی خود را وارد کنید و پردازش را ببینید:'
                  : 'Test a sample input payload:'}
              </label>
              <textarea
                rows={2}
                value={demoSampleInput}
                onChange={(e) => setDemoSampleInput(e.target.value)}
                className="w-full p-3 rounded-xl bg-slate-50 dark:bg-[#050C0A] border border-slate-200 dark:border-emerald-500/20 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 dark:focus:border-emerald-400"
              />
              <button
                type="button"
                onClick={() => setDemoRan(true)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-400 text-white dark:text-slate-950 text-xs font-bold cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{isFa ? 'اجرای دمو' : 'Run Demo Preview'}</span>
              </button>
            </div>
          </div>

          <div className="rounded-xl p-4 bg-slate-900 dark:bg-[#050C0A] border border-slate-800 dark:border-emerald-500/20 min-h-[110px]">
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
                    summary: demoSampleInput.slice(0, 60),
                  },
                  null,
                  2
                )}
              </pre>
            ) : (
              <p className="text-xs text-slate-400">
                {isFa
                  ? 'روی دکمه «اجرای دمو» کلیک کنید تا خروجی نمونه تولید شود.'
                  : 'Click "Run Demo Preview" to inspect a structured output payload.'}
              </p>
            )}
          </div>
        </div>
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
    <div className="max-w-[1320px] mx-auto px-4 sm:px-6 py-10 space-y-8">
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
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1677FF] hover:bg-[#0D65E8] text-white dark:bg-amber-500 dark:hover:bg-amber-400 dark:text-slate-950 text-xs font-bold cursor-pointer whitespace-nowrap self-start sm:self-auto shadow-xs shadow-[#1677FF]/25"
        >
          <User className="w-4 h-4" />
          <span>{isFa ? 'ورود به پنل کاربری' : 'Open Student Panel'}</span>
        </button>
      </div>

      {courses.length === 0 ? (
        <div className="rounded-2xl p-10 text-center bg-white dark:bg-[#0B1613] border border-slate-200 dark:border-emerald-500/15 space-y-2 shadow-xs">
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
          {courses.map((course, idx) => (
            <motion.article
              key={course.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: idx * 0.04 }}
              whileHover={{ y: -3 }}
              className="rounded-2xl bg-white dark:bg-[#0B1613] border border-slate-200/85 dark:border-emerald-500/15 hover:border-emerald-400/60 overflow-hidden flex flex-col justify-between transition-all shadow-xs hover:shadow-md"
            >
              <div>
                <div className="aspect-4/3 bg-slate-100 dark:bg-[#07110E] overflow-hidden">
                  <img
                    src={course.thumbnail}
                    alt={isFa ? course.title.fa : course.title.en}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-5 space-y-2">
                  <p className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 tabular-nums">
                    {course.category} · {isFa ? course.totalDuration.fa : course.totalDuration.en} ·{' '}
                    {toLocaleDigits(course.lessonCount, lang)}{' '}
                    {isFa ? 'جلسه' : 'Lessons'}
                  </p>
                  <h2 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
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
                  onClick={() => onOpenCourseInPanel(course.id)}
                />
              </div>
            </motion.article>
          ))}
        </div>
      )}
    </div>
  );
};

/* 3. Services & Project Consultation Page */
interface ServicesConsultationViewProps {
  lang: Lang;
}

export const ServicesConsultationView: React.FC<ServicesConsultationViewProps> = ({
  lang,
}) => {
  const isFa = lang === 'fa';
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [serviceType, setServiceType] = useState('bot');
  const [details, setDetails] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !contact.trim()) return;
    setSubmitted(true);
  };

  return (
    <div className="max-w-[1320px] mx-auto px-4 sm:px-6 py-10 space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-6 space-y-6">
          <div className="space-y-2">
            <p className="text-xs font-semibold text-amber-600 dark:text-amber-400">
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
                  <span className="text-amber-600 dark:text-amber-400 me-2 tabular-nums">
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
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-[#1677FF] hover:bg-[#0D65E8] text-white dark:bg-amber-500 dark:hover:bg-amber-400 dark:text-slate-950 text-sm font-bold shadow-xs shadow-[#1677FF]/25 transition-colors cursor-pointer"
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
