import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Bookmark,
  BookOpen,
  Bot,
  Box,
  Check,
  CheckCircle2,
  Code2,
  Copy,
  Cpu,
  DollarSign,
  ExternalLink,
  FileText,
  Flame,
  Image as ImageIcon,
  Layers,
  Mic,
  Puzzle,
  RotateCcw,
  Search,
  ShieldCheck,
  Smartphone,
  Sparkles,
  ThumbsDown,
  ThumbsUp,
  TrendingUp,
  Users,
  Video,
  Wrench,
} from 'lucide-react';
import { AI_CATEGORIES_META } from '../data/lmsData';
import { AITool, AIToolRole, AIToolTask, Lang } from '../types/lms';
import { toLocaleDigits } from '../utils/formatters';

interface AIToolsViewProps {
  lang: Lang;
  tools: AITool[];
  initialQuery?: string;
  initialTask?: string;
}

type SortMode = 'popular' | 'users' | 'free-first';

const CATEGORY_ICON: Record<AIToolTask, React.ReactNode> = {
  'AI Assistant': <Bot className="w-3.5 h-3.5" />,
  'Art & Image': <ImageIcon className="w-3.5 h-3.5" />,
  'Video Generation': <Video className="w-3.5 h-3.5" />,
  '3D & Avatar': <Box className="w-3.5 h-3.5" />,
  'Code Assistant': <Code2 className="w-3.5 h-3.5" />,
  'Audio & Music': <Mic className="w-3.5 h-3.5" />,
  'Data & Finance': <DollarSign className="w-3.5 h-3.5" />,
  'Automation & Agents': <Cpu className="w-3.5 h-3.5" />,
  'Writing & SEO': <FileText className="w-3.5 h-3.5" />,
  'Research & Study': <BookOpen className="w-3.5 h-3.5" />,
};

export const AIToolsView: React.FC<AIToolsViewProps> = ({
  lang,
  tools,
  initialQuery = '',
  initialTask = 'ALL',
}) => {
  const isFa = lang === 'fa';

  const [query, setQuery] = useState(initialQuery);
  const [taskFilter, setTaskFilter] = useState<string>(initialTask);
  const [inputFilter, setInputFilter] = useState<string>('ALL');
  const [outputFilter, setOutputFilter] = useState<string>('ALL');
  const [roleFilter, setRoleFilter] = useState<string>('ALL');
  const [pricingFilter, setPricingFilter] = useState<string>('ALL');
  const [capFilters, setCapFilters] = useState<{
    free: boolean;
    verified: boolean;
    hasApi: boolean;
    mobile: boolean;
    openSource: boolean;
    extension: boolean;
  }>({
    free: false,
    verified: false,
    hasApi: false,
    mobile: false,
    openSource: false,
    extension: false,
  });
  const [sortBy, setSortBy] = useState<SortMode>('popular');

  const [selectedToolId, setSelectedToolId] = useState<string | null>(null);
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(['tool-chatgpt', 'tool-cursor']);
  const [usedIds, setUsedIds] = useState<string[]>([]);
  const [userVotes, setUserVotes] = useState<Record<string, 'up' | 'down'>>({});
  const [copiedPrompt, setCopiedPrompt] = useState(false);

  const selectedTool = useMemo(
    () => tools.find((t) => t.id === selectedToolId) || null,
    [tools, selectedToolId]
  );

  useEffect(() => {
    if (selectedToolId) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [selectedToolId]);

  const inputs = [
    { id: 'ALL', fa: 'همه ورودی‌ها (What you provide)', en: 'All Inputs' },
    { id: 'Text', fa: 'متن / مقاله', en: 'Text' },
    { id: 'Prompt', fa: 'توضیح ایده (Prompt)', en: 'Prompt' },
    { id: 'Image', fa: 'تصویر / عکس', en: 'Image' },
    { id: 'Audio', fa: 'فایل صوتی', en: 'Audio' },
    { id: 'Video', fa: 'ویدیو', en: 'Video' },
    { id: 'Spreadsheet', fa: 'اکسل / CSV', en: 'Spreadsheet' },
    { id: 'Document', fa: 'اسناد و PDF', en: 'Document / PDF' },
  ];

  const outputs = [
    { id: 'ALL', fa: 'همه خروجی‌ها (What you need)', en: 'All Outputs' },
    { id: 'Text', fa: 'متن و پاسخ رفرنس‌دار', en: 'Text & Answers' },
    { id: 'Image', fa: 'تصویر و گرافیک', en: 'Image' },
    { id: 'Video', fa: 'ویدیو و آواتار', en: 'Video' },
    { id: '3D Model', fa: 'مدل سه‌بعدی (3D)', en: '3D Model' },
    { id: 'Audio', fa: 'صوت، دوبله و موسیقی', en: 'Audio & Music' },
    { id: 'Code', fa: 'کد و رابط کاربری', en: 'Code & UI' },
    { id: 'Dashboard', fa: 'نمودار و داشبورد داده', en: 'Dashboard' },
    { id: 'Workflow', fa: 'اتوماسیون و ایجنت', en: 'Workflow' },
    { id: 'Presentation', fa: 'اسلاید ارائه و وب‌سایت', en: 'Presentation' },
  ];

  const roles: { id: 'ALL' | AIToolRole; fa: string; en: string }[] = [
    { id: 'ALL', fa: 'همه نقش‌ها (Your role)', en: 'All Roles' },
    { id: 'Creator', fa: 'تولیدکننده محتوا', en: 'Content Creator' },
    { id: 'Developer', fa: 'برنامه‌نویس و فنی', en: 'Developer' },
    { id: 'Business', fa: 'مدیر کسب‌وکار / بازاریاب', en: 'Business / Marketer' },
    { id: 'Designer', fa: 'طراح گرافیک / 3D', en: 'Designer / 3D Artist' },
    { id: 'Analyst', fa: 'تحلیل‌گر داده / مالی', en: 'Data Analyst' },
    { id: 'Researcher', fa: 'پژوهشگر / دانشجو', en: 'Researcher / Student' },
  ];

  const translateBadge = (val: string) => {
    const map: Record<string, { fa: string; en: string }> = {
      Text: { fa: 'متن', en: 'Text' },
      Prompt: { fa: 'دستور متنی', en: 'Prompt' },
      Image: { fa: 'تصویر', en: 'Image' },
      Audio: { fa: 'صوت / موسیقی', en: 'Audio' },
      Video: { fa: 'ویدیو', en: 'Video' },
      Spreadsheet: { fa: 'اکسل / داده', en: 'Spreadsheet' },
      Document: { fa: 'اسناد / PDF', en: 'Document' },
      '3D Model': { fa: 'مدل 3D', en: '3D Model' },
      Code: { fa: 'کد / UI', en: 'Code' },
      Dashboard: { fa: 'نمودار و تحلیل', en: 'Dashboard' },
      Workflow: { fa: 'اتوماسیون', en: 'Workflow' },
      Presentation: { fa: 'اسلاید ارائه', en: 'Presentation' },
      Free: { fa: 'رایگان', en: 'Free' },
      Freemium: { fa: 'فریمیوم', en: 'Freemium' },
      Paid: { fa: 'اشتراکی', en: 'Paid' },
      'Free Trial': { fa: 'تست رایگان', en: 'Free Trial' },
    };
    if (map[val]) return isFa ? map[val].fa : map[val].en;
    const cat = AI_CATEGORIES_META.find((c) => c.id === val);
    if (cat) return isFa ? cat.fa : cat.en;
    return val;
  };

  const activeCategoryMeta = useMemo(
    () => AI_CATEGORIES_META.find((c) => c.id === taskFilter) || null,
    [taskFilter]
  );

  const filteredTools = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = tools.filter((tool) => {
      if (taskFilter !== 'ALL' && tool.task !== taskFilter) return false;
      if (inputFilter !== 'ALL' && tool.input !== inputFilter) return false;
      if (outputFilter !== 'ALL' && tool.output !== outputFilter) return false;
      if (roleFilter !== 'ALL' && !(tool.roles || []).includes(roleFilter as AIToolRole)) {
        return false;
      }
      if (pricingFilter !== 'ALL' && tool.pricing !== pricingFilter) return false;

      if (capFilters.free && tool.pricing !== 'Free') return false;
      if (capFilters.verified && !tool.verified) return false;
      if (capFilters.hasApi && !tool.hasApi) return false;
      if (capFilters.mobile && !tool.hasMobileApp) return false;
      if (capFilters.openSource && !tool.isOpenSource) return false;
      if (capFilters.extension && !tool.hasExtension) return false;

      if (!q) return true;
      return (
        tool.name.toLowerCase().includes(q) ||
        (tool.provider || '').toLowerCase().includes(q) ||
        tool.tagline.fa.toLowerCase().includes(q) ||
        tool.tagline.en.toLowerCase().includes(q) ||
        tool.description.fa.toLowerCase().includes(q) ||
        tool.description.en.toLowerCase().includes(q) ||
        tool.task.toLowerCase().includes(q)
      );
    });

    return [...list].sort((a, b) => {
      if (sortBy === 'users') {
        return (b.usersCount ?? 0) - (a.usersCount ?? 0);
      }
      if (sortBy === 'free-first') {
        const rank = (p: string) =>
          p === 'Free' ? 0 : p === 'Freemium' ? 1 : p === 'Free Trial' ? 2 : 3;
        return rank(a.pricing) - rank(b.pricing);
      }
      return (b.popularityScore ?? 85) - (a.popularityScore ?? 85);
    });
  }, [
    tools,
    query,
    taskFilter,
    inputFilter,
    outputFilter,
    roleFilter,
    pricingFilter,
    capFilters,
    sortBy,
  ]);

  // Dynamic Sidebar Market Stats
  const marketStats = useMemo(() => {
    const total = tools.length || 1;
    const freeCount = tools.filter((t) => t.pricing === 'Free').length;
    const freemiumCount = tools.filter((t) => t.pricing === 'Freemium').length;
    const paidCount = tools.filter((t) => t.pricing === 'Paid' || t.pricing === 'Free Trial').length;
    const apiPct = Math.round((tools.filter((t) => t.hasApi).length / total) * 100);
    const mobilePct = Math.round((tools.filter((t) => t.hasMobileApp).length / total) * 100);
    const extPct = Math.round((tools.filter((t) => t.hasExtension).length / total) * 100);
    return {
      total: tools.length,
      freeCount,
      freemiumCount,
      paidCount,
      freePct: Math.round((freeCount / total) * 100),
      freemiumPct: Math.round((freemiumCount / total) * 100),
      paidPct: Math.max(
        0,
        100 - Math.round((freeCount / total) * 100) - Math.round((freemiumCount / total) * 100)
      ),
      apiPct,
      mobilePct,
      extPct,
    };
  }, [tools]);

  const topPopularTools = useMemo(
    () =>
      [...tools]
        .sort((a, b) => (b.popularityScore ?? 80) - (a.popularityScore ?? 80))
        .slice(0, 5),
    [tools]
  );

  const featuredTools = useMemo(
    () => tools.filter((t) => t.featured || (t.popularityScore ?? 0) >= 96).slice(0, 6),
    [tools]
  );

  const toggleBookmark = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setBookmarkedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const toggleUsed = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setUsedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleVote = (id: string, vote: 'up' | 'down', e?: React.MouseEvent) => {
    e?.stopPropagation();
    setUserVotes((prev) => {
      if (prev[id] === vote) {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      }
      return { ...prev, [id]: vote };
    });
  };

  const getToolCounts = (tool: AITool) => {
    const v = userVotes[tool.id];
    const likes = (tool.likes ?? 45) + (v === 'up' ? 1 : 0);
    const dislikes = (tool.dislikes ?? 2) + (v === 'down' ? 1 : 0);
    const users = (tool.usersCount ?? 320) + (usedIds.includes(tool.id) ? 1 : 0);
    return { likes, dislikes, users };
  };

  const resetAll = () => {
    setQuery('');
    setTaskFilter('ALL');
    setInputFilter('ALL');
    setOutputFilter('ALL');
    setRoleFilter('ALL');
    setPricingFilter('ALL');
    setCapFilters({
      free: false,
      verified: false,
      hasApi: false,
      mobile: false,
      openSource: false,
      extension: false,
    });
  };

  const hasActiveFilters =
    Boolean(query) ||
    taskFilter !== 'ALL' ||
    inputFilter !== 'ALL' ||
    outputFilter !== 'ALL' ||
    roleFilter !== 'ALL' ||
    pricingFilter !== 'ALL' ||
    Object.values(capFilters).some(Boolean);

  const handleCopyPrompt = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 1800);
  };

  const scrollToDetailSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const getHostDomain = (url: string) => {
    try {
      return new URL(url).hostname.replace(/^www\./, '');
    } catch {
      return url;
    }
  };

  // =========================================================================
  // VIEW B: DEDICATED TOOL DETAIL PAGE (Inspired by topai.tools/t/...)
  // =========================================================================
  if (selectedTool) {
    const { likes, dislikes, users } = getToolCounts(selectedTool);
    const totalReviews = likes + dislikes;
    const recommendPct = totalReviews > 0 ? Math.round((likes / totalReviews) * 100) : 95;
    const isBookmarked = bookmarkedIds.includes(selectedTool.id);
    const isUsedByMe = usedIds.includes(selectedTool.id);
    const currentVote = userVotes[selectedTool.id];

    const relatedTools = tools
      .filter((t) => t.id !== selectedTool.id && t.task === selectedTool.task)
      .slice(0, 3);

    return (
      <div className="space-y-6">
        {/* Top Breadcrumb + Back */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <button
              type="button"
              onClick={() => setSelectedToolId(null)}
              className="hover:text-emerald-500 font-semibold cursor-pointer"
            >
              {isFa ? 'مرجع ابزارهای هوش مصنوعی' : 'AI Tools Directory'}
            </button>
            <span>/</span>
            <button
              type="button"
              onClick={() => {
                setTaskFilter(selectedTool.task);
                setSelectedToolId(null);
              }}
              className="hover:text-emerald-500 cursor-pointer"
            >
              {translateBadge(selectedTool.task)}
            </button>
            <span>/</span>
            <span className="text-slate-900 dark:text-white font-bold">
              {selectedTool.name}
            </span>
          </div>

          <button
            type="button"
            onClick={() => setSelectedToolId(null)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white dark:bg-[#0B1613] border border-slate-200 dark:border-emerald-500/20 text-xs font-bold text-slate-700 dark:text-emerald-300 hover:border-emerald-400 cursor-pointer"
          >
            {isFa ? <ArrowRight className="w-3.5 h-3.5" /> : <ArrowLeft className="w-3.5 h-3.5" />}
            <span>{isFa ? 'بازگشت به لیست ابزارها' : 'Back to Directory'}</span>
          </button>
        </div>

        {/* Hero Overview Card */}
        <section className="rounded-2xl p-4 sm:p-6 bg-white dark:bg-[#0B1613] border border-slate-200/80 dark:border-emerald-500/20 shadow-lg">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-center">
            <div className="lg:col-span-7 space-y-4 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3.5 sm:gap-4">
                <div className="space-y-1.5 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="text-xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                      {selectedTool.name}
                    </h1>
                    {selectedTool.verified && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-[11px] font-bold">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>{isFa ? 'تاییدشده' : 'Verified'}</span>
                      </span>
                    )}
                  </div>

                  {selectedTool.provider && (
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {isFa ? 'توسعه‌دهنده / پلتفرم:' : 'Provider:'}{' '}
                      <strong className="text-slate-800 dark:text-emerald-300">
                        {selectedTool.provider}
                      </strong>{' '}
                      ·{' '}
                      <span dir="ltr" className="text-[var(--iramo-primary)] dark:text-[#FFBA00] font-semibold">
                        {getHostDomain(selectedTool.url)}
                      </span>
                    </p>
                  )}

                  <div className="flex flex-wrap items-center gap-3 text-xs tabular-nums pt-0.5">
                    <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
                      <ThumbsUp className="w-3.5 h-3.5" />
                      {toLocaleDigits(likes, lang)}
                    </span>
                    <span className="inline-flex items-center gap-1 text-red-500 font-bold">
                      <ThumbsDown className="w-3.5 h-3.5" />
                      {toLocaleDigits(dislikes, lang)}
                    </span>
                    <span className="text-slate-500 dark:text-slate-400">
                      ({toLocaleDigits(totalReviews, lang)} {isFa ? 'نظر و امتیاز' : 'reviews'})
                    </span>
                  </div>
                </div>

                {/* Official Website External Link */}
                <a
                  href={selectedTool.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#FFBA00] hover:bg-[#FFC629] text-slate-950 text-xs sm:text-sm font-extrabold shadow-md shadow-[#FFBA00]/25 shrink-0 whitespace-nowrap transition-colors duration-150"
                >
                  <span>{isFa ? 'ورود به سایت ابزار (Try Now)' : 'Visit Tool (Try Now)'}</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>

              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {isFa ? selectedTool.tagline.fa : selectedTool.tagline.en}
              </p>

              {/* Popularity & Category Row */}
              <div className="flex flex-wrap items-center gap-2.5">
                <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#050C0A] border border-[#FFBA00]/40">
                  <div className="w-9 h-9 rounded-full border-2 border-[#FFBA00] bg-[#FFBA00]/15 text-slate-900 dark:text-[#FFBA00] font-extrabold text-xs tabular-nums flex items-center justify-center shrink-0">
                    {toLocaleDigits(selectedTool.popularityScore ?? 92, lang)}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900 dark:text-[#FFBA00]">
                      {isFa
                        ? `رتبه محبوبیت در ${translateBadge(selectedTool.task)}`
                        : `Popular in ${translateBadge(selectedTool.task)}`}
                    </p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400">
                      {isFa ? 'امتیاز بر اساس رضایت کاربران' : 'Based on adoption & votes'}
                    </p>
                  </div>
                </div>

                <span className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-[#050C0A] border border-slate-200 dark:border-emerald-500/20 text-xs font-semibold text-slate-700 dark:text-emerald-300">
                  {translateBadge(selectedTool.pricing)}
                </span>
                <span className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-[#050C0A] border border-slate-200 dark:border-emerald-500/20 text-xs font-semibold text-slate-700 dark:text-slate-200">
                  {translateBadge(selectedTool.task)}
                </span>
              </div>

              {/* Accepts / Produces */}
              <div className="flex flex-wrap items-center gap-4 text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-slate-500 dark:text-slate-400">
                    {isFa ? 'ورودی (Accepts):' : 'Accepts:'}
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-[#050C0A] border border-slate-200 dark:border-emerald-500/20 font-semibold text-slate-800 dark:text-white">
                    {translateBadge(selectedTool.input)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-500 dark:text-slate-400">
                    {isFa ? 'خروجی (Produces):' : 'Produces:'}
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-500/15 border border-emerald-500/30 font-bold text-emerald-700 dark:text-emerald-300">
                    {translateBadge(selectedTool.output)}
                  </span>
                </div>
              </div>

              {/* Interactive Save & I Use This */}
              <div className="flex flex-wrap items-center gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={(e) => toggleBookmark(selectedTool.id, e)}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-xs font-bold transition-colors cursor-pointer ${
                    isBookmarked
                      ? 'bg-[#FFBA00] border-[#FFBA00] text-slate-950'
                      : 'bg-slate-50 dark:bg-[#050C0A] border-slate-200 dark:border-emerald-500/20 text-slate-600 dark:text-slate-300 hover:border-emerald-400'
                  }`}
                >
                  <Bookmark className="w-3.5 h-3.5" />
                  <span>{isBookmarked ? (isFa ? 'ذخیره‌شده' : 'Saved') : isFa ? 'ذخیره ابزار' : 'Save'}</span>
                </button>

                <button
                  type="button"
                  onClick={(e) => toggleUsed(selectedTool.id, e)}
                  className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border text-xs font-bold tabular-nums transition-colors cursor-pointer ${
                    isUsedByMe
                      ? 'bg-emerald-500/20 border-emerald-400 text-emerald-700 dark:text-emerald-300'
                      : 'bg-slate-50 dark:bg-[#050C0A] border-slate-200 dark:border-emerald-500/20 text-slate-600 dark:text-slate-300 hover:border-emerald-400'
                  }`}
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>{isFa ? 'من استفاده می‌کنم' : 'I use this'}</span>
                  <span className="px-2 py-0.5 rounded-md bg-emerald-500 text-slate-950 font-extrabold">
                    {toLocaleDigits(users, lang)}
                  </span>
                </button>
              </div>
            </div>

            {/* Thumbnail Card */}
            <div className="lg:col-span-5">
              <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-emerald-500/25 bg-[#050C0A] aspect-[16/10] shadow-xl">
                {selectedTool.thumbnail ? (
                  <img
                    src={selectedTool.thumbnail}
                    alt={selectedTool.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-emerald-400">
                    <Cpu className="w-12 h-12" />
                  </div>
                )}
                <div className="absolute bottom-3 start-3 px-3 py-1 rounded-lg bg-slate-950/80 backdrop-blur-md border border-white/10 text-[11px] font-bold text-white" dir="ltr">
                  {getHostDomain(selectedTool.url)}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Sub-navigation Tabs */}
        <nav className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-200 dark:border-emerald-500/15">
          {[
            { id: 'tool-overview', fa: 'معرفی کامل', en: 'Overview' },
            { id: 'tool-pricing', fa: 'تعرفه و پلن‌ها', en: 'Pricing' },
            { id: 'tool-features', fa: 'امکانات کلیدی', en: 'Features' },
            { id: 'tool-workflow', fa: 'نحوه استفاده', en: 'How to Use' },
            { id: 'tool-reviews', fa: 'نظرات کاربران', en: 'Reviews' },
            { id: 'tool-audience', fa: 'مناسب چه کسانی است؟', en: "Who's it for" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => scrollToDetailSection(tab.id)}
              className="px-3.5 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 whitespace-nowrap cursor-pointer border-b-2 border-transparent hover:border-emerald-500 transition-colors"
            >
              {isFa ? tab.fa : tab.en}
            </button>
          ))}
        </nav>

        {/* Main Detail + Slim Utility Sidebar */}
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          <div className="flex-1 min-w-0 space-y-5 w-full">
            {/* 1. What is [Tool]? */}
            <section
              id="tool-overview"
              className="rounded-2xl p-6 bg-white dark:bg-[#0B1613] border border-slate-200/80 dark:border-emerald-500/15 space-y-3"
            >
              <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">
                {isFa ? `${selectedTool.name} چیست و چگونه کار می‌کند؟` : `What is ${selectedTool.name}?`}
              </h2>
              <div className="space-y-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {(selectedTool.longDescription
                  ? isFa
                    ? selectedTool.longDescription.fa
                    : selectedTool.longDescription.en
                  : [isFa ? selectedTool.description.fa : selectedTool.description.en]
                ).map((para, idx) => (
                  <p key={idx}>{para}</p>
                ))}
              </div>
            </section>

            {/* 2. Pricing Breakdown */}
            <section
              id="tool-pricing"
              className="rounded-2xl p-6 bg-white dark:bg-[#0B1613] border border-slate-200/80 dark:border-emerald-500/15 space-y-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-emerald-500" />
                  <span>
                    {isFa ? `تعرفه و اشتراک‌های ${selectedTool.name}` : `${selectedTool.name} Pricing`}
                  </span>
                </h2>
                <span className="px-3 py-1 rounded-lg bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 text-xs font-bold">
                  {selectedTool.startingPrice
                    ? isFa
                      ? selectedTool.startingPrice.fa
                      : selectedTool.startingPrice.en
                    : translateBadge(selectedTool.pricing)}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {selectedTool.pricingDetails
                  ? isFa
                    ? selectedTool.pricingDetails.fa
                    : selectedTool.pricingDetails.en
                  : translateBadge(selectedTool.pricing)}
              </p>
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 dark:border-emerald-500/10">
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  {isFa
                    ? 'بررسی دقیق‌ترین تعرفه‌های به‌روز در صفحه رسمی پلتفرم'
                    : 'Verify latest plans on the official pricing page'}
                </span>
                <a
                  href={selectedTool.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 w-full sm:w-auto px-4 py-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/35 text-emerald-700 dark:text-emerald-300 text-xs font-bold"
                >
                  <span>{isFa ? 'مشاهده پلن‌ها در سایت اصلی' : 'View Plans'}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </section>

            {/* 3. Key Features Grid */}
            {selectedTool.keyFeatures && (
              <section
                id="tool-features"
                className="rounded-2xl p-6 bg-white dark:bg-[#0B1613] border border-slate-200/80 dark:border-emerald-500/15 space-y-4"
              >
                <h2 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#FFBA00]" />
                  <span>
                    {isFa ? `ویژگی‌های کلیدی ${selectedTool.name}` : `${selectedTool.name} Key Features`}
                  </span>
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {(isFa ? selectedTool.keyFeatures.fa : selectedTool.keyFeatures.en).map(
                    (feat, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2.5 p-3.5 rounded-xl bg-slate-50 dark:bg-[#07110E] border border-slate-200/70 dark:border-emerald-500/15 text-xs font-semibold text-slate-800 dark:text-slate-200"
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                        <span>{feat}</span>
                      </div>
                    )
                  )}
                </div>
              </section>
            )}

            {/* 4. Step-by-Step Workflow & Ready Prompt */}
            {(selectedTool.steps || selectedTool.samplePrompt) && (
              <section
                id="tool-workflow"
                className="rounded-2xl p-6 bg-white dark:bg-[#0B1613] border border-slate-200/80 dark:border-emerald-500/15 space-y-4"
              >
                <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">
                  {isFa ? `مراحل شروع کار با ${selectedTool.name}` : `How to Use ${selectedTool.name}`}
                </h2>

                {selectedTool.steps && (
                  <ol className="space-y-2.5">
                    {(isFa ? selectedTool.steps.fa : selectedTool.steps.en).map((step, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-[#050C0A] border border-slate-200/70 dark:border-emerald-500/15 text-xs sm:text-sm text-slate-700 dark:text-slate-200"
                      >
                        <span className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 font-bold tabular-nums flex items-center justify-center shrink-0">
                          {toLocaleDigits(i + 1, lang)}
                        </span>
                        <span className="leading-relaxed">{step}</span>
                      </li>
                    ))}
                  </ol>
                )}

                {selectedTool.samplePrompt && (
                  <div className="rounded-xl p-4 bg-[#FFBA00]/10 dark:bg-[#050C0A] border border-[#FFBA00]/45 space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-slate-900 dark:text-[#FFBA00]">
                        {isFa ? 'پرامپت نمونه برای تست سریع' : 'Sample Prompt Template'}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          handleCopyPrompt(
                            isFa ? selectedTool.samplePrompt!.fa : selectedTool.samplePrompt!.en
                          )
                        }
                        className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:underline cursor-pointer"
                      >
                        {copiedPrompt ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>
                          {copiedPrompt ? (isFa ? 'کپی شد' : 'Copied') : isFa ? 'کپی پرامپت' : 'Copy'}
                        </span>
                      </button>
                    </div>
                    <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed">
                      {isFa ? selectedTool.samplePrompt.fa : selectedTool.samplePrompt.en}
                    </p>
                  </div>
                )}
              </section>
            )}

            {/* 5. User Reviews & Interactive Recommendation */}
            <section
              id="tool-reviews"
              className="rounded-2xl p-6 bg-white dark:bg-[#0B1613] border border-slate-200/80 dark:border-emerald-500/15 space-y-5"
            >
              <div className="space-y-1">
                <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">
                  {isFa ? `امتیاز و تجربه کاربران از ${selectedTool.name}` : 'User Reviews & Feedback'}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 tabular-nums">
                  {isFa
                    ? `بر اساس ${toLocaleDigits(totalReviews, lang)} رای ثبت‌شده، ${toLocaleDigits(recommendPct, lang)}٪ از کاربران این پلتفرم را پیشنهاد می‌کنند.`
                    : `Based on ${totalReviews} reviews, ${recommendPct}% of users recommend this tool.`}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
                <div className="md:col-span-7 space-y-4">
                  <div className="flex items-center gap-6 tabular-nums">
                    <div>
                      <div className="flex items-center gap-1.5 text-xl font-extrabold text-emerald-600 dark:text-emerald-400">
                        <ThumbsUp className="w-5 h-5" />
                        <span>{toLocaleDigits(likes, lang)}</span>
                      </div>
                      <p className="text-[11px] text-slate-500">{isFa ? 'پیشنهاد می‌کنند' : 'Recommend'}</p>
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 text-xl font-extrabold text-red-500">
                        <ThumbsDown className="w-5 h-5" />
                        <span>{toLocaleDigits(dislikes, lang)}</span>
                      </div>
                      <p className="text-[11px] text-slate-500">{isFa ? 'پیشنهاد نمی‌کنند' : "Don't"}</p>
                    </div>
                  </div>

                  {selectedTool.likedFor && (
                    <div className="space-y-2">
                      <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                        {isFa ? 'نقاط قوت از دید کاربران:' : 'Liked for:'}
                      </p>
                      {selectedTool.likedFor.map((lf, i) => (
                        <div key={i} className="space-y-1 text-xs">
                          <div className="flex items-center justify-between text-slate-700 dark:text-slate-300">
                            <span>{isFa ? lf.label.fa : lf.label.en}</span>
                            <span className="tabular-nums text-emerald-500 font-bold">
                              {toLocaleDigits(lf.count, lang)}/{toLocaleDigits(lf.total, lang)}
                            </span>
                          </div>
                          <div className="h-1.5 rounded-full bg-slate-100 dark:bg-emerald-950 overflow-hidden">
                            <div
                              className="h-full bg-emerald-500 rounded-full"
                              style={{ width: `${Math.round((lf.count / lf.total) * 100)}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="md:col-span-5 rounded-2xl p-5 bg-slate-50 dark:bg-[#07110E] border border-slate-200 dark:border-emerald-500/20 text-center space-y-3">
                  <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                    {isFa
                      ? `آیا ${selectedTool.name} را پیشنهاد می‌کنید؟`
                      : `Would you recommend ${selectedTool.name}?`}
                  </p>
                  <div className="flex items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={(e) => handleVote(selectedTool.id, 'up', e)}
                      className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border text-xs font-bold cursor-pointer transition-colors ${
                        currentVote === 'up'
                          ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                          : 'bg-white dark:bg-[#050C0A] border-slate-200 dark:border-emerald-500/25 text-emerald-600 dark:text-emerald-400 hover:border-emerald-400'
                      }`}
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span>{isFa ? 'بله' : 'Yes'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={(e) => handleVote(selectedTool.id, 'down', e)}
                      className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border text-xs font-bold cursor-pointer transition-colors ${
                        currentVote === 'down'
                          ? 'bg-red-500 text-white border-red-400'
                          : 'bg-white dark:bg-[#050C0A] border-slate-200 dark:border-emerald-500/25 text-red-500 hover:border-red-400'
                      }`}
                    >
                      <ThumbsDown className="w-3.5 h-3.5" />
                      <span>{isFa ? 'خیر' : 'No'}</span>
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* 6. Who is it for? */}
            {selectedTool.whoIsItFor && (
              <section
                id="tool-audience"
                className="rounded-2xl p-6 bg-white dark:bg-[#0B1613] border border-slate-200/80 dark:border-emerald-500/15 space-y-4"
              >
                <h2 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-emerald-500" />
                  <span>
                    {isFa ? `${selectedTool.name} مناسب چه کسانی است؟` : `Who is ${selectedTool.name} for?`}
                  </span>
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {(isFa ? selectedTool.whoIsItFor.fa : selectedTool.whoIsItFor.en).map(
                    (role, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2.5 p-3.5 rounded-xl bg-slate-50 dark:bg-[#07110E] border border-slate-200/70 dark:border-emerald-500/15 text-xs font-semibold text-slate-800 dark:text-slate-200"
                      >
                        <Users className="w-4 h-4 text-[#FFBA00] shrink-0" />
                        <span>{role}</span>
                      </div>
                    )
                  )}
                </div>
              </section>
            )}

            {/* 7. Similar Tools */}
            {relatedTools.length > 0 && (
              <section className="space-y-3">
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                  {isFa ? 'ابزارهای جایگزین و مشابه' : 'Similar & Alternative Tools'}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {relatedTools.map((rt) => (
                    <button
                      key={rt.id}
                      type="button"
                      onClick={() => setSelectedToolId(rt.id)}
                      className="iramo-card-interactive p-3.5 rounded-xl bg-white dark:bg-[#0B1613] border border-[var(--iramo-card-border)] text-start cursor-pointer flex items-center gap-2.5"
                    >
                      <div className="w-9 h-9 rounded-lg bg-emerald-500/15 text-emerald-500 flex items-center justify-center shrink-0">
                        {CATEGORY_ICON[rt.task]}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                          {rt.name}
                        </p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                          {rt.provider} · {translateBadge(rt.pricing)}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Readable Utility Sidebar */}
          <aside className="w-full lg:w-[310px] shrink-0 space-y-4">
            <div className="rounded-2xl p-4 bg-white dark:bg-[#0B1613] border border-[var(--iramo-card-border)] space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
                <Flame className="w-4 h-4 text-[#FFBA00]" />
                <span>{isFa ? 'پلتفرم‌های برگزیده' : 'Featured Platforms'}</span>
              </div>
              <div className="space-y-2">
                {featuredTools.map((ft) => (
                  <button
                    key={ft.id}
                    type="button"
                    onClick={() => setSelectedToolId(ft.id)}
                    className={`w-full flex items-center justify-between gap-2 p-2.5 rounded-xl border text-start transition-colors cursor-pointer ${
                      ft.id === selectedTool.id
                        ? 'bg-emerald-500/15 border-emerald-500/40'
                        : 'bg-slate-50 dark:bg-[#07110E] border-slate-200/60 dark:border-emerald-500/10 hover:border-emerald-400/40'
                    }`}
                  >
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {ft.name}
                      </p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                        {translateBadge(ft.task)}
                      </p>
                    </div>
                    <ExternalLink className="w-3 h-3 text-slate-400 shrink-0" />
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-2xl p-4 bg-white dark:bg-[#0B1613] border border-slate-200/80 dark:border-emerald-500/15 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
                <Wrench className="w-4 h-4 text-emerald-400" />
                <span>{isFa ? 'دسته‌بندی‌های مرتبط' : 'Related Categories'}</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {AI_CATEGORIES_META.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => {
                      setTaskFilter(cat.id);
                      setSelectedToolId(null);
                    }}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-[#07110E] hover:bg-emerald-500/15 border border-slate-200/70 dark:border-emerald-500/20 text-[11px] font-medium text-slate-700 dark:text-slate-200 cursor-pointer"
                  >
                    {CATEGORY_ICON[cat.id]}
                    <span>{isFa ? cat.fa : cat.en}</span>
                  </button>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW A: TOPAI.TOOLS / AI-ASSIST FINDER + 3-COLUMN GRID + SLIM SIDEBAR
  // =========================================================================
  return (
    <div className="space-y-6">
      {/* 1. AI-Assist Hero Search (Modeled directly after topai.tools/ai-assist) */}
      <section className="rounded-2xl p-4 sm:p-7 bg-gradient-to-br from-emerald-50/90 via-white to-slate-50 dark:from-[#071611] dark:via-[#0A1A14] dark:to-[#06100C] text-slate-900 dark:text-white border border-emerald-200/80 dark:border-emerald-500/25 shadow-xs space-y-4 sm:space-y-5">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--iramo-primary)] dark:text-[#FFBA00]">
            <Sparkles className="w-3.5 h-3.5 text-[#FFBA00]" />
            <span>
              {isFa
                ? 'مرجع جامع و هوشمند پلتفرم‌های هوش مصنوعی'
                : 'Global AI Tools Directory & Task Finder'}
            </span>
          </div>
          <h1 className="text-xl sm:text-3xl font-extrabold text-slate-900 dark:text-white text-balance">
            {isFa
              ? 'امروز چه کاری می‌خواهید انجام دهید؟'
              : 'What Task Do You Need Done?'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
            {isFa
              ? 'هدف خود را بنویسید یا فیلترهای دسته‌بندی، ورودی، خروجی و نقش را انتخاب کنید تا بهترین پلتفرم‌های واقعی دنیا را ببینید.'
              : 'Describe your task or filter by input, output, and role to discover the right AI platform.'}
          </p>
        </div>

        {/* Centered Search Input */}
        <div className="max-w-2xl mx-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-2 p-1.5 rounded-2xl bg-white dark:bg-[#050C0A] border border-slate-200 dark:border-emerald-500/35 focus-within:border-[var(--iramo-primary)] dark:focus-within:border-[#FFBA00] shadow-xs transition-colors">
          <div className="flex items-center gap-2.5 flex-1 px-2.5 min-w-0">
            <Search className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={
                isFa
                  ? 'جستجوی ابزار، کاربرد یا دسته‌بندی (مثلاً ChatGPT، ساخت ویدیو...)'
                  : 'Search AI tools, use cases, categories...'
              }
              className="w-full min-w-0 bg-transparent text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 py-2 focus:outline-none"
            />
          </div>
          <div className="flex items-center justify-between sm:justify-end gap-2 shrink-0 px-1 sm:px-0">
            {hasActiveFilters && (
              <button
                type="button"
                onClick={resetAll}
                className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 text-xs font-medium cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{isFa ? 'پاک کردن' : 'Reset'}</span>
              </button>
            )}
            <span className="px-4 py-2 rounded-xl bg-emerald-600 dark:bg-emerald-500 text-white dark:text-slate-950 text-xs font-extrabold tabular-nums ms-auto">
              {toLocaleDigits(filteredTools.length, lang)}{' '}
              {isFa ? 'ابزار' : 'Results'}
            </span>
          </div>
        </div>

        {/* 4-Input Structured Bar (TASK · INPUT · OUTPUT · I AM A...) */}
        <div className="rounded-xl p-4 bg-white/85 dark:bg-[#050C0A]/90 border border-slate-200/80 dark:border-emerald-500/20 space-y-3.5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <label className="block space-y-1">
              <span className="text-[10px] font-bold tracking-wide text-emerald-700 dark:text-emerald-300/80 uppercase">
                {isFa ? 'نوع کار (TASK)' : 'TASK'}
              </span>
              <select
                value={taskFilter}
                onChange={(e) => setTaskFilter(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#0B1613] border border-slate-200 dark:border-emerald-500/20 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 dark:focus:border-emerald-400 cursor-pointer"
              >
                <option value="ALL">{isFa ? 'همه دسته‌بندی‌ها' : 'All Categories'}</option>
                {AI_CATEGORIES_META.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {isFa ? cat.fa : cat.en}
                  </option>
                ))}
              </select>
            </label>

            <label className="block space-y-1">
              <span className="text-[10px] font-bold tracking-wide text-emerald-700 dark:text-emerald-300/80 uppercase">
                {isFa ? 'ورودی شما (INPUT)' : 'INPUT'}
              </span>
              <select
                value={inputFilter}
                onChange={(e) => setInputFilter(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#0B1613] border border-slate-200 dark:border-emerald-500/20 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 dark:focus:border-emerald-400 cursor-pointer"
              >
                {inputs.map((inp) => (
                  <option key={inp.id} value={inp.id}>
                    {isFa ? inp.fa : inp.en}
                  </option>
                ))}
              </select>
            </label>

            <label className="block space-y-1">
              <span className="text-[10px] font-bold tracking-wide text-emerald-700 dark:text-emerald-300/80 uppercase">
                {isFa ? 'خروجی مورد نظر (OUTPUT)' : 'OUTPUT'}
              </span>
              <select
                value={outputFilter}
                onChange={(e) => setOutputFilter(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#0B1613] border border-slate-200 dark:border-emerald-500/20 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 dark:focus:border-emerald-400 cursor-pointer"
              >
                {outputs.map((out) => (
                  <option key={out.id} value={out.id}>
                    {isFa ? out.fa : out.en}
                  </option>
                ))}
              </select>
            </label>

            <label className="block space-y-1">
              <span className="text-[10px] font-bold tracking-wide text-emerald-700 dark:text-emerald-300/80 uppercase">
                {isFa ? 'نقش شما (I AM A...)' : 'I AM A...'}
              </span>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#0B1613] border border-slate-200 dark:border-emerald-500/20 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 dark:focus:border-emerald-400 cursor-pointer"
              >
                {roles.map((r) => (
                  <option key={r.id} value={r.id}>
                    {isFa ? r.fa : r.en}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {/* Quick Capability Badges */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            {[
              { key: 'free' as const, icon: <Sparkles className="w-3 h-3" />, fa: 'رایگان', en: 'Free' },
              { key: 'verified' as const, icon: <ShieldCheck className="w-3 h-3" />, fa: 'تاییدشده', en: 'Verified' },
              { key: 'mobile' as const, icon: <Smartphone className="w-3 h-3" />, fa: 'اپ موبایل', en: 'Mobile App' },
              { key: 'openSource' as const, icon: <Cpu className="w-3 h-3" />, fa: 'متن‌باز', en: 'Open Source' },
              { key: 'extension' as const, icon: <Puzzle className="w-3 h-3" />, fa: 'افزونه مرورگر', en: 'Extension' },
              { key: 'hasApi' as const, icon: <Code2 className="w-3 h-3" />, fa: 'دارای API', en: 'Has API' },
            ].map((cap) => {
              const active = capFilters[cap.key];
              return (
                <button
                  key={cap.key}
                  type="button"
                  onClick={() =>
                    setCapFilters((prev) => ({ ...prev, [cap.key]: !prev[cap.key] }))
                  }
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-[11px] font-semibold transition-colors cursor-pointer ${
                    active
                      ? 'bg-emerald-500/15 border-emerald-500 text-emerald-700 dark:text-emerald-300'
                      : 'bg-slate-50 dark:bg-[#0B1613] border-slate-200 dark:border-emerald-500/15 text-slate-700 dark:text-slate-300 hover:border-emerald-400/50'
                  }`}
                >
                  {cap.icon}
                  <span>{isFa ? cap.fa : cap.en}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 2. Browse By Category Chips (Compact Grid) */}
      <section className="space-y-2.5">
        <div className="flex items-center justify-between gap-2">
          <p className="text-[11px] font-bold text-slate-500 dark:text-emerald-300/80 uppercase tracking-wide">
            {isFa ? 'مرور بر اساس دسته‌بندی (BROWSE BY CATEGORY)' : 'BROWSE BY CATEGORY'}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setTaskFilter('ALL')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-colors cursor-pointer ${
              taskFilter === 'ALL'
                ? 'bg-emerald-500/15 border-emerald-500/50 text-emerald-600 dark:text-emerald-300'
                : 'bg-white dark:bg-[#0B1613] border-slate-200/80 dark:border-emerald-500/15 text-slate-700 dark:text-slate-300 hover:border-emerald-400/40'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{isFa ? 'همه دسته‌ها' : 'All'}</span>
            <span className="text-[11px] opacity-65 tabular-nums">
              ({toLocaleDigits(tools.length, lang)})
            </span>
          </button>

          {AI_CATEGORIES_META.map((cat) => {
            const active = taskFilter === cat.id;
            const count = tools.filter((t) => t.task === cat.id).length;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setTaskFilter(cat.id)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-colors cursor-pointer ${
                  active
                    ? 'bg-emerald-500/15 border-emerald-500/50 text-emerald-600 dark:text-emerald-300'
                    : 'bg-white dark:bg-[#0B1613] border-slate-200/80 dark:border-emerald-500/15 text-slate-700 dark:text-slate-300 hover:border-emerald-400/40'
                }`}
              >
                {CATEGORY_ICON[cat.id]}
                <span>{isFa ? cat.fa : cat.en}</span>
                <span className="text-[11px] opacity-65 tabular-nums">
                  ({toLocaleDigits(count, lang)})
                </span>
              </button>
            );
          })}
        </div>

        {/* Category Explanatory Insight Banner when a Category is selected */}
        {activeCategoryMeta && (
          <div className="rounded-xl p-4 bg-white dark:bg-[#0B1613] border border-emerald-500/25 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                {CATEGORY_ICON[activeCategoryMeta.id]}
                <span>
                  {isFa ? activeCategoryMeta.headline.fa : activeCategoryMeta.headline.en}
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {isFa ? activeCategoryMeta.description.fa : activeCategoryMeta.description.en}
              </p>
            </div>
            <div className="px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-[#050C0A] border border-slate-200 dark:border-emerald-500/20 shrink-0">
              <p className="text-[10px] text-slate-500 dark:text-slate-400">
                {isFa ? 'میانگین هزینه این دسته:' : 'Median Starting Cost:'}
              </p>
              <p className="text-xs font-bold text-[var(--iramo-primary)] dark:text-[#FFBA00] mt-0.5">
                {isFa ? activeCategoryMeta.medianPrice.fa : activeCategoryMeta.medianPrice.en}
              </p>
            </div>
          </div>
        )}
      </section>

      {/* 3. Main 3-Column Tool Cards + Slim Utility Sidebar */}
      <div className="flex flex-col lg:flex-row gap-5 items-start">
        {/* Main Tools Column */}
        <div className="flex-1 min-w-0 w-full space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white tabular-nums">
              {isFa
                ? `مشاهده ${toLocaleDigits(filteredTools.length, lang)} پلتفرم هوش مصنوعی`
                : `Showing ${filteredTools.length} AI Platforms`}
            </h2>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {isFa ? 'مرتب‌سازی:' : 'Sort:'}
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortMode)}
                className="px-3 py-1.5 rounded-xl bg-white dark:bg-[#0B1613] border border-slate-200 dark:border-emerald-500/20 text-xs font-semibold text-slate-700 dark:text-white focus:outline-none cursor-pointer"
              >
                <option value="popular">{isFa ? 'محبوب‌ترین' : 'Popular'}</option>
                <option value="users">{isFa ? 'بیشترین کاربر' : 'Most Used'}</option>
                <option value="free-first">{isFa ? 'رایگان‌ها اول' : 'Free First'}</option>
              </select>
            </div>
          </div>

          {filteredTools.length === 0 ? (
            <div className="rounded-2xl p-10 text-center bg-white dark:bg-[#0B1613] border border-slate-200 dark:border-emerald-500/15 space-y-3">
              <p className="text-sm font-semibold text-slate-900 dark:text-white">
                {isFa
                  ? 'ابزاری با این ترکیب فیلترها پیدا نشد.'
                  : 'No AI tools match those filters.'}
              </p>
              <button
                type="button"
                onClick={resetAll}
                className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 text-xs font-bold cursor-pointer"
              >
                {isFa ? 'نمایش همه ابزارها' : 'Reset Filters'}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredTools.map((tool) => {
                const { likes, dislikes, users } = getToolCounts(tool);
                const isBookmarked = bookmarkedIds.includes(tool.id);

                return (
                  <article
                    key={tool.id}
                    onClick={() => setSelectedToolId(tool.id)}
                    className="group iramo-card-interactive rounded-2xl overflow-hidden bg-white dark:bg-[#0B1613] border border-[var(--iramo-card-border)] flex flex-col justify-between cursor-pointer"
                  >
                    <div>
                      {/* Compact Card Thumbnail */}
                      <div className="relative aspect-[16/9] bg-[#050C0A] overflow-hidden">
                        {tool.thumbnail ? (
                          <img
                            src={tool.thumbnail}
                            alt={tool.name}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-150"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-emerald-400">
                            <Cpu className="w-8 h-8" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#050C0A]/75 via-transparent to-transparent" />

                        {tool.featured && (
                          <span className="absolute top-2.5 start-2.5 inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#FFBA00] text-slate-950 text-[10px] font-extrabold">
                            <Flame className="w-2.5 h-2.5" />
                            <span>{isFa ? 'ویژه' : 'Featured'}</span>
                          </span>
                        )}

                        <button
                          type="button"
                          onClick={(e) => toggleBookmark(tool.id, e)}
                          aria-label={isFa ? 'ذخیره ابزار' : 'Bookmark tool'}
                          className={`absolute top-2.5 end-2.5 p-1.5 rounded-lg backdrop-blur-md border transition-colors duration-150 cursor-pointer ${
                            isBookmarked
                              ? 'bg-[#FFBA00] text-slate-950 border-transparent'
                              : 'bg-slate-950/65 text-white border-white/15 hover:bg-slate-950'
                          }`}
                        >
                          <Bookmark className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Compact Card Body */}
                      <div className="p-4 space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-1.5 min-w-0">
                            <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-[var(--iramo-primary)] transition-colors duration-150 truncate">
                              {tool.name}
                            </h3>
                            {tool.verified && (
                              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                            )}
                          </div>
                          <span className="text-[11px] font-bold text-slate-400 truncate shrink-0">
                            {tool.provider}
                          </span>
                        </div>

                        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-2 min-h-[2.25rem]">
                          {isFa ? tool.tagline.fa : tool.tagline.en}
                        </p>

                        <div className="flex flex-wrap items-center gap-1.5 pt-0.5 text-[11px]">
                          <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-[#050C0A] border border-slate-200 dark:border-emerald-500/15 text-slate-700 dark:text-slate-300 font-medium truncate">
                            {translateBadge(tool.task)}
                          </span>
                          <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold tabular-nums">
                            <Users className="w-3 h-3" />
                            {toLocaleDigits(users, lang)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Card Footer */}
                    <div className="px-4 py-2.5 border-t border-slate-100 dark:border-emerald-500/10 flex items-center justify-between gap-2 text-xs">
                      <div className="flex items-center gap-2.5 tabular-nums">
                        <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
                          <ThumbsUp className="w-3 h-3" />
                          {toLocaleDigits(likes, lang)}
                        </span>
                        <span className="inline-flex items-center gap-1 text-red-500 font-semibold">
                          <ThumbsDown className="w-3 h-3" />
                          {toLocaleDigits(dislikes, lang)}
                        </span>
                      </div>

                      <span className="font-bold text-[var(--iramo-primary)] dark:text-[#FFBA00] truncate">
                        {translateBadge(tool.pricing)}
                      </span>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>

        {/* Readable Sidebar Widgets (300px - 325px, fits cleanly beside 3 columns inside 1460px container) */}
        <aside className="w-full lg:w-[300px] xl:w-[325px] shrink-0 space-y-4">
          {/* Widget 1: Market Snapshot (Harmonized mint-emerald style matching Telegram Newsletter card) */}
          <div className="rounded-2xl p-5 bg-gradient-to-br from-emerald-50/80 via-white to-slate-50 dark:from-[#0B1E17] dark:via-[#0B1613] dark:to-[#08120F] border border-emerald-200/80 dark:border-emerald-500/25 shadow-xs space-y-3.5">
            <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
              <TrendingUp className="w-4 h-4 text-[var(--iramo-primary)]" />
              <span>{isFa ? 'آمار کل ابزارهای بازار' : 'Directory Snapshot'}</span>
            </div>

            <div className="grid grid-cols-2 gap-2.5 tabular-nums">
              <div className="p-3 rounded-xl bg-white/90 dark:bg-[#07110E] border border-slate-200/70 dark:border-emerald-500/15">
                <p className="text-lg font-extrabold text-slate-900 dark:text-white">
                  {toLocaleDigits(marketStats.total, lang)}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{isFa ? 'پلتفرم معتبر' : 'Platforms'}</p>
              </div>
              <div className="p-3 rounded-xl bg-white/90 dark:bg-[#07110E] border border-slate-200/70 dark:border-emerald-500/15">
                <p className="text-lg font-extrabold text-[var(--iramo-primary)]">
                  {toLocaleDigits(`${marketStats.apiPct}%`, lang)}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{isFa ? 'دارای API' : 'Have API'}</p>
              </div>
              <div className="p-3 rounded-xl bg-white/90 dark:bg-[#07110E] border border-slate-200/70 dark:border-emerald-500/15">
                <p className="text-lg font-extrabold text-slate-900 dark:text-white">
                  {toLocaleDigits(`${marketStats.mobilePct}%`, lang)}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{isFa ? 'اپ موبایل' : 'Mobile App'}</p>
              </div>
              <div className="p-3 rounded-xl bg-white/90 dark:bg-[#07110E] border border-slate-200/70 dark:border-emerald-500/15">
                <p className="text-lg font-extrabold text-slate-900 dark:text-[#FFBA00]">
                  {toLocaleDigits(`${marketStats.extPct}%`, lang)}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{isFa ? 'افزونه کروم' : 'Extension'}</p>
              </div>
            </div>
          </div>

          {/* Widget 2: Pricing Breakdown */}
          <div className="rounded-2xl p-5 bg-white dark:bg-[#0B1613] border border-[var(--iramo-card-border)] shadow-xs space-y-3.5">
            <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
              <DollarSign className="w-4 h-4 text-[#FFBA00]" />
              <span>{isFa ? 'تفکیک تعرفه ابزارها' : 'Pricing Breakdown'}</span>
            </div>

            <div className="h-2.5 rounded-full overflow-hidden flex bg-slate-200 dark:bg-emerald-950">
              <div className="bg-emerald-500" style={{ width: `${marketStats.freemiumPct}%` }} />
              <div className="bg-[#FFBA00]" style={{ width: `${marketStats.freePct}%` }} />
              <div className="bg-sky-500" style={{ width: `${marketStats.paidPct}%` }} />
            </div>

            <div className="flex flex-wrap gap-x-3 gap-y-1.5 text-xs text-slate-600 dark:text-slate-300 tabular-nums">
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                {isFa ? 'فریمیوم' : 'Freemium'} {toLocaleDigits(`${marketStats.freemiumPct}%`, lang)}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#FFBA00]" />
                {isFa ? 'رایگان' : 'Free'} {toLocaleDigits(`${marketStats.freePct}%`, lang)}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-500" />
                {isFa ? 'پولی' : 'Paid'} {toLocaleDigits(`${marketStats.paidPct}%`, lang)}
              </span>
            </div>

            <div className="flex flex-wrap gap-2 pt-0.5">
              <button
                type="button"
                onClick={() => setPricingFilter('Free')}
                className="px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/25 text-xs font-bold text-emerald-700 dark:text-emerald-300 cursor-pointer tabular-nums transition-colors duration-150"
              >
                {toLocaleDigits(marketStats.freeCount, lang)} {isFa ? 'کاملاً رایگان' : 'Free'}
              </button>
              <button
                type="button"
                onClick={() => setPricingFilter('Freemium')}
                className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-[#07110E] border border-slate-200 dark:border-emerald-500/15 hover:border-[var(--iramo-card-border-hover)] text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer tabular-nums transition-colors duration-150"
              >
                {toLocaleDigits(marketStats.freemiumCount, lang)} {isFa ? 'دارای پلن رایگان' : 'Free Tier'}
              </button>
            </div>
          </div>

          {/* Widget 3: Most Popular */}
          <div className="rounded-2xl p-5 bg-white dark:bg-[#0B1613] border border-[var(--iramo-card-border)] shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
              <Flame className="w-4 h-4 text-[#FFBA00]" />
              <span>{isFa ? 'محبوب‌ترین ابزارها' : 'Most Popular'}</span>
            </div>

            <div className="space-y-2">
              {topPopularTools.map((pt) => (
                <button
                  key={pt.id}
                  type="button"
                  onClick={() => setSelectedToolId(pt.id)}
                  className="w-full flex items-center justify-between gap-2.5 p-2.5 rounded-xl bg-slate-50 dark:bg-[#07110E] hover:bg-emerald-500/10 border border-slate-200/70 dark:border-emerald-500/15 hover:border-[var(--iramo-card-border-hover)] text-start transition-colors duration-150 cursor-pointer"
                >
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {pt.name}
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                      {pt.provider}
                    </p>
                  </div>
                  <span className="w-7 h-7 rounded-full border border-emerald-500/50 text-emerald-600 dark:text-emerald-400 text-xs font-extrabold tabular-nums flex items-center justify-center shrink-0">
                    {toLocaleDigits(pt.popularityScore ?? 90, lang)}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Widget 4: Saved Bookmarks (Unified mint-emerald widget style) */}
          <div className="rounded-2xl p-5 bg-gradient-to-br from-emerald-50/80 via-white to-slate-50 dark:from-[#0B1E17] dark:via-[#0B1613] dark:to-[#08120F] border border-emerald-200/80 dark:border-emerald-500/25 shadow-xs text-slate-900 dark:text-white space-y-3">
            <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-slate-900 dark:text-[#FFBA00]">
              <span className="inline-flex items-center gap-1.5">
                <Bookmark className="w-4 h-4 text-[#FFBA00]" />
                <span>{isFa ? 'ابزارهای ذخیره‌شده' : 'Saved Tools'}</span>
              </span>
              <span className="tabular-nums text-[var(--iramo-primary)] dark:text-[#FFBA00]">{toLocaleDigits(bookmarkedIds.length, lang)}</span>
            </div>
            {bookmarkedIds.length === 0 ? (
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {isFa ? 'نشانک ابزارها اینجا نمایش داده می‌شود.' : 'Bookmark tools for quick access.'}
              </p>
            ) : (
              <div className="space-y-2">
                {tools
                  .filter((t) => bookmarkedIds.includes(t.id))
                  .map((bt) => (
                    <button
                      key={bt.id}
                      type="button"
                      onClick={() => setSelectedToolId(bt.id)}
                      className="w-full flex items-center justify-between gap-2 px-3 py-2 rounded-xl bg-white dark:bg-[#050C0A] hover:bg-emerald-50 dark:hover:bg-emerald-500/15 border border-slate-200 dark:border-emerald-500/20 hover:border-[var(--iramo-card-border-hover)] text-xs font-semibold text-slate-800 dark:text-slate-200 transition-colors duration-150 cursor-pointer text-start"
                    >
                      <span className="truncate">{bt.name}</span>
                      {isFa ? (
                        <ArrowLeft className="w-3.5 h-3.5 text-[var(--iramo-primary)] dark:text-[#FFBA00] shrink-0" />
                      ) : (
                        <ArrowRight className="w-3.5 h-3.5 text-[var(--iramo-primary)] dark:text-[#FFBA00] shrink-0" />
                      )}
                    </button>
                  ))}
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
};
