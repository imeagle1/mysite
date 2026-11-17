import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowDown,
  ArrowUp,
  CornerDownLeft,
  Cpu,
  Search,
  X,
} from 'lucide-react';
import { AITool, Course, Lang } from '../types/lms';
import { toLocaleDigits } from '../utils/formatters';

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
  lang: Lang;
  courses: Course[];
  tools: AITool[];
  onSelectCourse: (course: Course) => void;
  onSelectTool: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  open,
  onClose,
  lang,
  courses,
  tools,
  onSelectCourse,
  onSelectTool,
}) => {
  const isFa = lang === 'fa';
  const [query, setQuery] = useState('');
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [recentSearches, setRecentSearches] = useState<string[]>(
    isFa
      ? ['ربات تلگرام و بله', 'حسابیار', 'المنتور پرو', 'هوش مصنوعی']
      : ['Telegram Bot', 'Hesabyar', 'Elementor Pro', 'AI Agents']
  );

  useEffect(() => {
    setRecentSearches(
      isFa
        ? ['ربات تلگرام و بله', 'حسابیار', 'المنتور پرو', 'هوش مصنوعی']
        : ['Telegram Bot', 'Hesabyar', 'Elementor Pro', 'AI Agents']
    );
  }, [isFa]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const matchedCourses = courses
      .filter((c) => {
        if (!q) return true;
        return (
          c.title.fa.toLowerCase().includes(q) ||
          c.title.en.toLowerCase().includes(q) ||
          c.subtitle.fa.toLowerCase().includes(q) ||
          c.subtitle.en.toLowerCase().includes(q) ||
          c.category.toLowerCase().includes(q)
        );
      })
      .map((c) => ({ kind: 'course' as const, course: c }));

    const matchedTools = tools
      .filter((t) => {
        if (!q) return false;
        return (
          t.name.toLowerCase().includes(q) ||
          t.tagline.fa.toLowerCase().includes(q) ||
          t.tagline.en.toLowerCase().includes(q)
        );
      })
      .map((t) => ({ kind: 'tool' as const, tool: t }));

    return [...matchedCourses.slice(0, 4), ...matchedTools.slice(0, 3)];
  }, [query, courses, tools]);

  useEffect(() => {
    setSelectedIdx(0);
  }, [query, open]);

  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIdx((i) => (results.length > 0 ? (i + 1) % results.length : 0));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIdx((i) =>
          results.length > 0 ? (i - 1 + results.length) % results.length : 0
        );
      } else if (e.key === 'Enter' && results[selectedIdx]) {
        e.preventDefault();
        const item = results[selectedIdx];
        if (item.kind === 'course') {
          onSelectCourse(item.course);
        } else {
          onSelectTool();
        }
        onClose();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [open, results, selectedIdx, onClose, onSelectCourse, onSelectTool]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-950/55 backdrop-blur-xs"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={isFa ? 'جستجوی سریع' : 'Command Search'}
    >
      <div
        className="w-full max-w-2xl rounded-2xl bg-white dark:bg-[#0B1613] border border-[var(--iramo-card-border)] shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Input */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-[var(--iramo-card-border)]">
          <Search className="w-4 h-4 text-[#FFBA00] shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={
              isFa
                ? 'دنبال چه دوره، ربات یا ابزاری هستید؟'
                : 'What are you looking for?'
            }
            className="w-full bg-transparent text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer"
              aria-label={isFa ? 'پاک کردن' : 'Clear'}
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="p-4 space-y-5 max-h-[65vh] overflow-y-auto iramo-inner-scroll">
          {/* Recent Search Tags (Interactive) */}
          {recentSearches.length > 0 && (
            <div>
              <p className="text-xs font-medium text-slate-400 dark:text-slate-400 mb-2.5">
                {isFa ? 'جستجوهای اخیر' : 'Recent search'}
              </p>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map((tag) => (
                  <div
                    key={tag}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-[#11221B] border border-[var(--iramo-card-border)] text-xs text-slate-700 dark:text-slate-200"
                  >
                    <button
                      type="button"
                      onClick={() => setQuery(tag)}
                      className="hover:text-emerald-600 dark:hover:text-emerald-400 cursor-pointer"
                    >
                      {tag}
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setRecentSearches((prev) => prev.filter((item) => item !== tag))
                      }
                      className="text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer"
                      aria-label={`Remove ${tag}`}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Trending / Results */}
          <div>
            <p className="text-xs font-medium text-slate-400 dark:text-slate-400 mb-2.5">
              {query.trim()
                ? isFa
                  ? 'نتایج جستجو'
                  : 'Matching results'
                : isFa
                ? 'دوره‌های پربازدید در iRamo'
                : 'Trending in iRamo'}
            </p>

            {results.length === 0 ? (
              <div className="py-8 text-center text-sm text-slate-500 dark:text-slate-400">
                {isFa
                  ? 'موردی با این عبارت پیدا نشد.'
                  : 'No courses or tools matched your search.'}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {results.map((item, idx) => {
                  const active = idx === selectedIdx;
                  if (item.kind === 'course') {
                    const c = item.course;
                    return (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => {
                          onSelectCourse(c);
                          onClose();
                        }}
                        className={`flex items-center gap-3 p-2.5 rounded-xl border text-start transition-colors cursor-pointer ${
                          active
                            ? 'bg-emerald-50/70 border-[var(--iramo-primary-border)] dark:bg-emerald-500/15'
                            : 'bg-slate-50/60 border-[var(--iramo-card-border)] hover:border-[var(--iramo-card-border-hover)] dark:bg-[#0F1E19]'
                        }`}
                      >
                        <img
                          src={c.thumbnail}
                          alt={isFa ? c.title.fa : c.title.en}
                          referrerPolicy="no-referrer"
                          className="w-12 h-10 rounded-lg object-cover shrink-0 bg-slate-200 dark:bg-emerald-950"
                        />
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                            {isFa ? c.title.fa : c.title.en}
                          </p>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 tabular-nums mt-0.5 truncate">
                            {toLocaleDigits(
                              isFa ? c.totalDuration.fa : c.totalDuration.en,
                              lang
                            )}{' '}
                            · {toLocaleDigits(c.lessonCount, lang)}{' '}
                            {isFa ? 'جلسه' : 'Lessons'}
                          </p>
                        </div>
                      </button>
                    );
                  }
                  const t = item.tool;
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => {
                        onSelectTool();
                        onClose();
                      }}
                      className={`flex items-center gap-3 p-2.5 rounded-xl border text-start transition-colors cursor-pointer ${
                        active
                          ? 'bg-emerald-50/70 border-[var(--iramo-primary-border)] dark:bg-emerald-500/15'
                          : 'bg-slate-50/60 border-[var(--iramo-card-border)] hover:border-[var(--iramo-card-border-hover)] dark:bg-[#0F1E19]'
                      }`}
                    >
                      <div className="w-12 h-10 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                        <Cpu className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                          {t.name}
                        </p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                          {isFa ? t.tagline.fa : t.tagline.en}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Keyboard Hints Footer (matches image_64b5462f.png) */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-slate-50 dark:bg-[#08110E] border-t border-[var(--iramo-card-border)] text-[11px] text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1">
              <kbd className="p-0.5 rounded bg-white dark:bg-[#0F1E19] border border-slate-200 dark:border-emerald-500/20">
                <ArrowUp className="w-3 h-3" />
              </kbd>
              <kbd className="p-0.5 rounded bg-white dark:bg-[#0F1E19] border border-slate-200 dark:border-emerald-500/20">
                <ArrowDown className="w-3 h-3" />
              </kbd>
              <span>{isFa ? 'جابجایی' : 'Navigate'}</span>
            </span>
            <span className="inline-flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-[#0F1E19] border border-slate-200 dark:border-emerald-500/20 font-mono">
                Esc
              </kbd>
              <span>{isFa ? 'بستن' : 'Close'}</span>
            </span>
          </div>
          <span className="inline-flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-[#0F1E19] border border-slate-200 dark:border-emerald-500/20 inline-flex items-center gap-1">
              <CornerDownLeft className="w-3 h-3" />
              Enter
            </kbd>
            <span>{isFa ? 'انتخاب' : 'Select'}</span>
          </span>
        </div>
      </div>
    </div>
  );
};
