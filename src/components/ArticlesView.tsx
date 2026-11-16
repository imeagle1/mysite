import React, { useMemo, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Bookmark,
  BookOpen,
  Bot,
  Check,
  Clock,
  Eye,
  Flame,
  Hash,
  Lightbulb,
  RefreshCw,
  Search,
  Share2,
  Sparkles,
  X,
} from 'lucide-react';
import { SoftwareProduct } from '../data/lmsData';
import { Article, ArticleCategory, Lang } from '../types/lms';
import { toLocaleDigits } from '../utils/formatters';
import { AuthChannelsConfig, QuickTipItem } from './ContentManagerView';

interface ArticlesViewProps {
  lang: Lang;
  articles: Article[];
  quickTips: QuickTipItem[];
  featuredProduct: SoftwareProduct | null;
  authChannels: AuthChannelsConfig;
  wpRestUrl?: string;
  onOpenCourseInPanel: (courseId: string) => void;
  onNavigateToProducts: () => void;
}

export const ArticlesView: React.FC<ArticlesViewProps> = ({
  lang,
  articles,
  quickTips,
  featuredProduct,
  authChannels,
  wpRestUrl,
  onOpenCourseInPanel,
  onNavigateToProducts,
}) => {
  const isFa = lang === 'fa';
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<'ALL' | ArticleCategory>('ALL');
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);
  const [readingArticle, setReadingArticle] = useState<Article | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // Widget states
  const [tipIndex, setTipIndex] = useState(0);
  const [newsletterChannel, setNewsletterChannel] = useState<'telegram' | 'bale'>('telegram');
  const [newsletterHandle, setNewsletterHandle] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  const safeTipIndex = quickTips.length > 0 ? tipIndex % quickTips.length : 0;
  const activeTip = quickTips[safeTipIndex] || null;

  const categories: { id: 'ALL' | ArticleCategory; fa: string; en: string }[] = [
    { id: 'ALL', fa: 'همه مقالات', en: 'All Articles' },
    { id: 'AI', fa: 'هوش مصنوعی', en: 'AI Systems' },
    { id: 'Bots', fa: 'ربات تلگرام و بله', en: 'Bots' },
    { id: 'Finance', fa: 'مالی و حسابیار', en: 'FinTech' },
    { id: 'WordPress', fa: 'وردپرس و المنتور', en: 'WordPress' },
    { id: 'Video', fa: 'ویدیو و محتوا', en: 'Video AI' },
  ];

  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    articles.forEach((a) => {
      (isFa ? a.tags.fa : a.tags.en).forEach((t) => tagSet.add(t));
    });
    return Array.from(tagSet);
  }, [articles, isFa]);

  const popularArticles = useMemo(
    () => [...articles].sort((a, b) => b.views - a.views).slice(0, 3),
    [articles]
  );

  const featuredArticle = useMemo(
    () => articles.find((a) => a.featured) || articles[0] || null,
    [articles]
  );

  const filteredArticles = useMemo(() => {
    const q = query.trim().toLowerCase();
    return articles.filter((a) => {
      if (activeCategory !== 'ALL' && a.category !== activeCategory) return false;
      const tagsList = isFa ? a.tags.fa : a.tags.en;
      if (activeTag && !tagsList.includes(activeTag)) return false;
      if (!q) return true;
      return (
        a.title.fa.toLowerCase().includes(q) ||
        a.title.en.toLowerCase().includes(q) ||
        a.excerpt.fa.toLowerCase().includes(q) ||
        a.excerpt.en.toLowerCase().includes(q) ||
        tagsList.some((t) => t.toLowerCase().includes(q))
      );
    });
  }, [articles, activeCategory, activeTag, query, isFa]);

  const toggleBookmark = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setBookmarkedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleCopyShare = (slug: string) => {
    const shareUrl = `${window.location.origin}/#articles/${slug}`;
    navigator.clipboard?.writeText(shareUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 1800);
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterHandle.trim()) return;
    if (wpRestUrl) {
      fetch(`${wpRestUrl.replace(/\/$/, '')}/newsletter`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          channel: newsletterChannel,
          handle: newsletterHandle.trim(),
        }),
      }).catch(() => {});
    }
    setNewsletterSubscribed(true);
  };

  return (
    <div className="max-w-[1460px] mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--iramo-primary)] dark:text-[#FFBA00]">
            <BookOpen className="w-4 h-4" />
            <span>
              {isFa
                ? 'مجله تخصصی و آموزش‌های متنی iRamoAi'
                : 'iRamoAi Engineering Journal'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white text-balance">
            {isFa
              ? 'مقالات، راهنماهای فنی و ابزارک‌های کاربردی هوش مصنوعی'
              : 'Articles, Architecture Guides & AI Widgets'}
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            {isFa
              ? 'آموزش‌های کاربردی ساخت ربات تلگرام و بله، بهینه‌سازی وردپرس و المنتور پرو و اتوماسیون مالی با ابزارک‌های تعاملی.'
              : 'Deep-dives on Telegram & Bale bots, Elementor Pro optimization, financial OCR, and prompt workflows.'}
          </p>
        </div>

        <div className="text-xs text-slate-500 dark:text-slate-400 tabular-nums shrink-0">
          {toLocaleDigits(filteredArticles.length, lang)}{' '}
          {isFa ? 'مقاله منتشر شده' : 'published articles'}
        </div>
      </div>

      {/* Featured Lead Article Banner */}
      {featuredArticle && !query && activeCategory === 'ALL' && !activeTag && (
        <section
          onClick={() => setReadingArticle(featuredArticle)}
          className="group iramo-card-interactive rounded-2xl overflow-hidden bg-gradient-to-br from-[var(--iramo-primary-soft)] via-white to-slate-50 dark:from-[#0B1B16] dark:via-[#08130F] dark:to-[#0B1613] border border-[var(--iramo-card-border)] cursor-pointer grid grid-cols-1 lg:grid-cols-12 shadow-xs"
        >
          <div className="lg:col-span-5 aspect-16/10 lg:aspect-auto overflow-hidden bg-slate-100 dark:bg-[#07110E]">
            <img
              src={featuredArticle.thumbnail}
              alt={isFa ? featuredArticle.title.fa : featuredArticle.title.en}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-150"
            />
          </div>
          <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between gap-4">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-3 text-xs text-[var(--iramo-primary)] font-semibold">
                <span>{isFa ? 'مقاله برگزیده هفته' : 'Featured Guide'}</span>
                <span aria-hidden="true">·</span>
                <span className="text-slate-700 dark:text-[#FFBA00]">
                  {featuredArticle.category}
                </span>
                <span aria-hidden="true">·</span>
                <span className="text-slate-500 dark:text-slate-400 tabular-nums">
                  {toLocaleDigits(featuredArticle.readMinutes, lang)}{' '}
                  {isFa ? 'دقیقه مطالعه' : 'min read'}
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white group-hover:text-[var(--iramo-primary)] transition-colors duration-150 leading-snug">
                {isFa ? featuredArticle.title.fa : featuredArticle.title.en}
              </h2>

              <p className="text-sm text-slate-600 dark:text-slate-300/90 leading-relaxed line-clamp-3">
                {isFa ? featuredArticle.excerpt.fa : featuredArticle.excerpt.en}
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-slate-200 dark:border-emerald-500/15">
              <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 tabular-nums">
                <span>{isFa ? featuredArticle.author.fa : featuredArticle.author.en}</span>
                <span aria-hidden="true">·</span>
                <span>{isFa ? featuredArticle.publishedAt.fa : featuredArticle.publishedAt.en}</span>
                <span aria-hidden="true">·</span>
                <span className="inline-flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5 text-[var(--iramo-primary)]" />
                  {toLocaleDigits(featuredArticle.views.toLocaleString('en-US'), lang)}
                </span>
              </div>

              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--iramo-primary)] dark:text-[#FFBA00]">
                <span>{isFa ? 'مطالعه کامل مقاله' : 'Read Article'}</span>
                {isFa ? (
                  <ArrowLeft className="w-4 h-4" />
                ) : (
                  <ArrowRight className="w-4 h-4" />
                )}
              </span>
            </div>
          </div>
        </section>
      )}

      {/* Search & Category Filter Ribbon */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-1.5">
          {categories.map((cat) => {
            const active = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                  active
                    ? 'bg-[var(--iramo-primary)] text-[var(--iramo-primary-fg)] font-bold'
                    : 'bg-white dark:bg-[#0B1613] text-slate-700 dark:text-slate-300 border border-[var(--iramo-card-border)] hover:border-[var(--iramo-card-border-hover)]'
                }`}
              >
                {isFa ? cat.fa : cat.en}
              </button>
            );
          })}
          {activeTag && (
            <button
              type="button"
              onClick={() => setActiveTag(null)}
              className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-[#FFBA00] text-slate-950 text-xs font-bold cursor-pointer"
            >
              <span>#{activeTag}</span>
              <X className="w-3 h-3" />
            </button>
          )}
        </div>

        <div className="relative w-full lg:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute start-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={isFa ? 'جستجو در مقالات و برچسب‌ها...' : 'Search articles...'}
            className="w-full ps-9 pe-3 py-2 rounded-xl bg-white dark:bg-[#0B1613] border border-slate-200 dark:border-emerald-500/20 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 dark:focus:border-emerald-400"
          />
        </div>
      </div>

      {/* Main Grid + Widgets Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-start">
        {/* Articles List / Grid */}
        <div className="lg:col-span-8">
          {filteredArticles.length === 0 ? (
            <div className="rounded-2xl p-10 text-center bg-white dark:bg-[#0B1613] border border-slate-200 dark:border-emerald-500/15 shadow-xs space-y-3">
              <p className="text-sm font-bold text-slate-900 dark:text-white">
                {articles.length === 0
                  ? isFa
                    ? 'در حال حاضر هیچ مقاله‌ای وجود ندارد (داده‌های نمونه پاکسازی شده‌اند).'
                    : 'No articles available yet (demo data has been cleared).'
                  : isFa
                  ? 'مقاله‌ای با این جستجو یا برچسب پیدا نشد.'
                  : 'No articles matched your filter.'}
              </p>
              {(query || activeCategory !== 'ALL' || activeTag) && (
                <button
                  type="button"
                  onClick={() => {
                    setQuery('');
                    setActiveCategory('ALL');
                    setActiveTag(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-emerald-600 text-white dark:bg-emerald-500 dark:text-slate-950 text-xs font-bold cursor-pointer"
                >
                  {isFa ? 'نمایش همه مقالات' : 'Reset Filters'}
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {filteredArticles.map((art) => {
                const isBookmarked = bookmarkedIds.includes(art.id);
                return (
                  <article
                    key={art.id}
                    onClick={() => setReadingArticle(art)}
                    className="group iramo-card-interactive rounded-2xl bg-white dark:bg-[#0B1613] border border-[var(--iramo-card-border)] shadow-xs overflow-hidden flex flex-col justify-between cursor-pointer"
                  >
                    <div>
                      <div className="relative aspect-4/3 overflow-hidden bg-slate-100 dark:bg-[#07110E]">
                        <img
                          src={art.thumbnail}
                          alt={isFa ? art.title.fa : art.title.en}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-150"
                        />
                        <button
                          type="button"
                          onClick={(e) => toggleBookmark(art.id, e)}
                          aria-label={isFa ? 'ذخیره مقاله' : 'Bookmark article'}
                          className={`absolute top-3 end-3 p-2 rounded-xl backdrop-blur-md border transition-colors duration-150 cursor-pointer ${
                            isBookmarked
                              ? 'bg-[#FFBA00] text-slate-950 border-[#FFBA00]'
                              : 'bg-slate-950/65 text-white border-white/15 hover:bg-slate-950'
                          }`}
                        >
                          <Bookmark className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="p-5 space-y-2.5">
                        <div className="flex items-center justify-between gap-2 text-[11px] font-semibold text-[var(--iramo-primary)] tabular-nums">
                          <span>{art.category}</span>
                          <span className="inline-flex items-center gap-1 text-slate-500 dark:text-slate-400">
                            <Clock className="w-3 h-3" />
                            {toLocaleDigits(art.readMinutes, lang)}{' '}
                            {isFa ? 'دقیقه' : 'min'}
                          </span>
                        </div>

                        <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-[var(--iramo-primary)] transition-colors duration-150 leading-snug line-clamp-2">
                          {isFa ? art.title.fa : art.title.en}
                        </h3>

                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2">
                          {isFa ? art.excerpt.fa : art.excerpt.en}
                        </p>
                      </div>
                    </div>

                    <div className="px-5 py-3.5 border-t border-slate-100 dark:border-emerald-500/10 flex items-center justify-between gap-2 text-xs">
                      <span className="text-slate-500 dark:text-slate-400 truncate">
                        {isFa ? art.publishedAt.fa : art.publishedAt.en}
                      </span>
                      <span className="inline-flex items-center gap-1 font-bold text-[var(--iramo-primary)] group-hover:translate-x-0.5 transition-transform duration-150 shrink-0">
                        <span>{isFa ? 'مطالعه' : 'Read'}</span>
                        {isFa ? (
                          <ArrowLeft className="w-3.5 h-3.5" />
                        ) : (
                          <ArrowRight className="w-3.5 h-3.5" />
                        )}
                      </span>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>

        {/* Sidebar Widgets Column (ابزارک‌های صفحه مقالات — کاملاً متصل به دیتای واقعی/CMS) */}
        <aside className="lg:col-span-4 space-y-5">
          {/* Widget 1: Popular Posts Widget (Derived from articles[]) */}
          <div className="rounded-2xl p-5 bg-white dark:bg-[#0B1613] border border-[var(--iramo-card-border)] shadow-xs space-y-4">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
              <Flame className="w-4 h-4 text-[#FFBA00]" />
              <span>{isFa ? 'پربازدیدترین مقالات هفته' : 'Trending Articles'}</span>
            </div>

            {popularArticles.length === 0 ? (
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {isFa ? 'مقاله‌ای ثبت نشده است.' : 'No trending posts yet.'}
              </p>
            ) : (
              <div className="space-y-3">
                {popularArticles.map((item, i) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setReadingArticle(item)}
                    className="w-full flex items-start gap-3 p-2.5 rounded-xl bg-slate-50 dark:bg-[#07110E] hover:bg-emerald-50/70 dark:hover:bg-[#0D1E18] border border-slate-200/70 dark:border-emerald-500/10 hover:border-[var(--iramo-card-border-hover)] text-start transition-colors duration-150 cursor-pointer"
                  >
                    <span className="w-6 h-6 rounded-lg bg-[#FFBA00]/20 text-slate-900 dark:text-[#FFBA00] text-xs font-extrabold tabular-nums flex items-center justify-center shrink-0 mt-0.5">
                      {toLocaleDigits(i + 1, lang)}
                    </span>
                    <div className="min-w-0 flex-1 space-y-1">
                      <p className="text-xs font-bold text-slate-900 dark:text-white line-clamp-2 leading-snug">
                        {isFa ? item.title.fa : item.title.en}
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 tabular-nums">
                        {toLocaleDigits(item.views.toLocaleString('en-US'), lang)}{' '}
                        {isFa ? 'بازدید' : 'views'} ·{' '}
                        {toLocaleDigits(item.readMinutes, lang)}{' '}
                        {isFa ? 'دقیقه' : 'min'}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Widget 2: Tag Cloud Widget (Derived from articles[]) */}
          <div className="rounded-2xl p-5 bg-white dark:bg-[#0B1613] border border-[var(--iramo-card-border)] shadow-xs space-y-3.5">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
              <Hash className="w-4 h-4 text-[var(--iramo-primary)]" />
              <span>{isFa ? 'ابزارک برچسب‌های موضوعی' : 'Topic Tags'}</span>
            </div>
            {allTags.length === 0 ? (
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {isFa
                  ? 'برچسبی موجود نیست (پس از افزودن مقاله نمایش داده می‌شود).'
                  : 'Tags will appear automatically once articles are published.'}
              </p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {allTags.map((tag) => {
                  const selected = activeTag === tag;
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => setActiveTag(selected ? null : tag)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors duration-150 cursor-pointer ${
                        selected
                          ? 'bg-[#FFBA00] text-slate-950 font-bold'
                          : 'bg-slate-50 dark:bg-[#07110E] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-emerald-500/15 hover:border-[var(--iramo-card-border-hover)]'
                      }`}
                    >
                      #{tag}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Widget 3: Telegram & Bale Newsletter Digest Widget */}
          <div className="rounded-2xl p-5 bg-gradient-to-br from-emerald-50/80 via-white to-slate-50 dark:from-[#0B1E17] dark:via-[#0B1613] dark:to-[#08120F] border border-emerald-200/80 dark:border-emerald-500/25 shadow-xs space-y-3.5">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
              <Bot className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>
                {isFa ? 'خبرنامه ربات تلگرام و بله' : 'Telegram & Bale Digest'}
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300/85 leading-relaxed">
              {isFa
                ? `خلاصه مقالات جدید و ابزارهای هوش مصنوعی را مستقیم از طریق ${authChannels.telegramBotUsername || '@iRamoBot'} یا ${authChannels.baleBotUsername || '@iRamoBaleBot'} دریافت کنید.`
                : `Get new guides and AI breakdowns directly via ${authChannels.telegramBotUsername || '@iRamoBot'} or ${authChannels.baleBotUsername || '@iRamoBaleBot'}.`}
            </p>

            {newsletterSubscribed ? (
              <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-xs text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
                <Check className="w-4 h-4 shrink-0" />
                <span>
                  {isFa
                    ? `عضویت شما برای ${newsletterHandle} در ${
                        newsletterChannel === 'telegram' ? 'تلگرام' : 'بله'
                      } فعال شد!`
                    : `Subscribed ${newsletterHandle} on ${newsletterChannel}!`}
                </span>
              </div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="space-y-2.5">
                <div className="grid grid-cols-2 gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-[#050C0A] border border-slate-200 dark:border-emerald-500/15">
                  <button
                    type="button"
                    onClick={() => setNewsletterChannel('telegram')}
                    className={`py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                      newsletterChannel === 'telegram'
                        ? 'bg-white dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 shadow-xs'
                        : 'text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    {isFa ? 'تلگرام' : 'Telegram'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewsletterChannel('bale')}
                    className={`py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                      newsletterChannel === 'bale'
                        ? 'bg-white dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 shadow-xs'
                        : 'text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    {isFa ? 'پیام‌رسان بله' : 'Bale'}
                  </button>
                </div>

                <input
                  type="text"
                  dir="ltr"
                  value={newsletterHandle}
                  onChange={(e) => setNewsletterHandle(e.target.value)}
                  placeholder="@your_id"
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#050C0A] border border-slate-200 dark:border-emerald-500/20 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 dark:focus:border-emerald-400"
                />

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-[var(--iramo-accent)] hover:bg-[var(--iramo-accent-hover)] text-[var(--iramo-accent-fg)] text-xs font-bold transition-colors cursor-pointer shadow-xs"
                >
                  {isFa ? 'عضویت در خبرنامه ربات' : 'Subscribe via Bot'}
                </button>
              </form>
            )}
          </div>

          {/* Widget 4: Quick Engineering Tip Widget (Dynamic from SiteConfig.quickTips) */}
          <div className="rounded-2xl p-5 bg-white dark:bg-[#0B1613] border border-[var(--iramo-card-border)] shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--iramo-primary)] dark:text-[#FFBA00]">
                <Lightbulb className="w-4 h-4 text-[#FFBA00]" />
                <span>{isFa ? 'نکته سریع روز' : 'Quick Pro Tip'}</span>
              </span>
              {quickTips.length > 1 && (
                <button
                  type="button"
                  onClick={() => setTipIndex((i) => (i + 1) % quickTips.length)}
                  className="inline-flex items-center gap-1 text-[11px] text-[var(--iramo-primary)] hover:underline cursor-pointer"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>{isFa ? 'نکته بعدی' : 'Next tip'}</span>
                </button>
              )}
            </div>
            {activeTip ? (
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {isFa ? activeTip.fa : activeTip.en}
              </p>
            ) : (
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                {isFa
                  ? 'نکات نمونه پاکسازی شده‌اند. مدیر سایت می‌تواند از بخش مدیریت محتوا نکات جدید اضافه کند.'
                  : 'Demo tips were cleared. Add custom tips from the Content Manager.'}
              </p>
            )}
          </div>

          {/* Widget 5: Featured Product Promo Widget (Unified soft mint-emerald surface matching Newsletter widget) */}
          {featuredProduct && (
            <div className="rounded-2xl p-5 bg-gradient-to-br from-emerald-50/80 via-white to-slate-50 dark:from-[#0B1E17] dark:via-[#0B1613] dark:to-[#08120F] border border-emerald-200/80 dark:border-emerald-500/25 shadow-xs space-y-3">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[var(--iramo-primary)]">
                <Sparkles className="w-4 h-4 text-[#FFBA00]" />
                <span>{isFa ? 'پیشنهاد ویژه آکادمی' : 'Featured Toolkit'}</span>
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                {isFa ? featuredProduct.name.fa : featuredProduct.name.en}
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300/85 leading-relaxed">
                {isFa ? featuredProduct.tagline.fa : featuredProduct.tagline.en}
              </p>
              <button
                type="button"
                onClick={onNavigateToProducts}
                className="w-full py-2.5 rounded-xl bg-[var(--iramo-accent)] hover:bg-[var(--iramo-accent-hover)] text-[var(--iramo-accent-fg)] text-xs font-extrabold cursor-pointer transition-colors duration-150 shadow-xs"
              >
                {isFa ? 'مشاهده محصولات و دمو' : 'Explore Products & Demo'}
              </button>
            </div>
          )}
        </aside>
      </div>

      {/* Article Reader Modal with Table of Contents Widget */}
      {readingArticle && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/75 backdrop-blur-xs"
          onClick={() => setReadingArticle(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden rounded-2xl bg-white dark:bg-[#091511] border border-slate-200 dark:border-emerald-500/25 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="shrink-0 px-5 py-4 bg-white dark:bg-[#091511] border-b border-slate-200 dark:border-emerald-500/15 flex items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                <span>{readingArticle.category}</span>
                <span aria-hidden="true">·</span>
                <span className="tabular-nums text-slate-500 dark:text-slate-400">
                  {toLocaleDigits(readingArticle.readMinutes, lang)}{' '}
                  {isFa ? 'دقیقه مطالعه' : 'min read'}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleCopyShare(readingArticle.slug)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-[#050C0A] border border-slate-200 dark:border-emerald-500/20 text-xs text-slate-700 dark:text-slate-200 hover:border-emerald-400/50 cursor-pointer"
                >
                  {copiedLink ? (
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                  ) : (
                    <Share2 className="w-3.5 h-3.5" />
                  )}
                  <span>
                    {copiedLink
                      ? isFa
                        ? 'لینک کپی شد'
                        : 'Copied'
                      : isFa
                      ? 'اشتراک‌گذاری'
                      : 'Share'}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setReadingArticle(null)}
                  className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 cursor-pointer"
                  aria-label={isFa ? 'بستن' : 'Close'}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto iramo-inner-scroll p-5 sm:p-8 space-y-6">
              <div className="aspect-16/9 rounded-2xl overflow-hidden bg-slate-100 dark:bg-[#050C0A] border border-slate-200 dark:border-emerald-500/15">
                <img
                  src={readingArticle.thumbnail}
                  alt={isFa ? readingArticle.title.fa : readingArticle.title.en}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-3">
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white leading-snug">
                  {isFa ? readingArticle.title.fa : readingArticle.title.en}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 tabular-nums">
                  {isFa ? readingArticle.author.fa : readingArticle.author.en} ·{' '}
                  {isFa ? readingArticle.publishedAt.fa : readingArticle.publishedAt.en}
                </p>
              </div>

              {/* Interactive Table of Contents Widget inside Reader */}
              <div className="rounded-xl p-4 bg-slate-50 dark:bg-[#050C0A] border border-slate-200 dark:border-emerald-500/20 space-y-2">
                <p className="text-xs font-bold text-[var(--iramo-primary)] dark:text-[#FFBA00]">
                  {isFa ? 'فهرست مطالب مقاله' : 'Table of Contents'}
                </p>
                <ul className="space-y-1.5">
                  {readingArticle.sections.map((sec, idx) => (
                    <li key={sec.id}>
                      <a
                        href={`#${sec.id}`}
                        className="text-xs text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 flex items-center gap-2"
                      >
                        <span className="text-emerald-600 dark:text-emerald-400 tabular-nums font-bold">
                          {toLocaleDigits(idx + 1, lang)}.
                        </span>
                        <span>{isFa ? sec.heading.fa : sec.heading.en}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Article Sections */}
              <div className="space-y-6">
                {readingArticle.sections.map((sec) => (
                  <section key={sec.id} id={sec.id} className="space-y-2 scroll-mt-20">
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                      {isFa ? sec.heading.fa : sec.heading.en}
                    </h3>
                    <p className="text-sm text-slate-700 dark:text-slate-300 leading-8">
                      {isFa ? sec.body.fa : sec.body.en}
                    </p>
                  </section>
                ))}
              </div>

              {readingArticle.relatedCourseId && (
                <div className="rounded-2xl p-5 bg-gradient-to-l from-emerald-50 to-slate-50 dark:from-emerald-950/80 dark:to-[#050C0A] border border-emerald-200 dark:border-emerald-500/25 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-bold text-[var(--iramo-primary)] dark:text-[#FFBA00]">
                      {isFa ? 'دوره مرتبط با این مقاله' : 'Related Course'}
                    </p>
                    <p className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                      {isFa
                        ? 'آموزش ویدیویی و پیاده‌سازی گام‌به‌گام در آکادمی iRamoAi'
                        : 'Watch the step-by-step implementation in iRamoAi Academy'}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const cid = readingArticle.relatedCourseId!;
                      setReadingArticle(null);
                      onOpenCourseInPanel(cid);
                    }}
                    className="px-4 py-2.5 rounded-xl bg-[var(--iramo-accent)] hover:bg-[var(--iramo-accent-hover)] text-[var(--iramo-accent-fg)] text-xs font-bold whitespace-nowrap cursor-pointer transition-colors"
                  >
                    {isFa ? 'مشاهده دوره مرتبط' : 'Open Related Course'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
