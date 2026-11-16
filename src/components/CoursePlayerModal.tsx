import React, { useMemo, useState } from 'react';
import {
  Award,
  Check,
  CheckCircle2,
  Copy,
  Download,
  FileText,
  Lock,
  Pause,
  Play,
  Terminal,
  X,
} from 'lucide-react';
import { Course, Lang, Lesson } from '../types/lms';
import { toLocaleDigits } from '../utils/formatters';

interface CoursePlayerModalProps {
  course: Course | null;
  lang: Lang;
  completedLessons: string[];
  onToggleLessonComplete: (lessonId: string) => void;
  onEnrollCourse: (courseId: string) => void;
  onClose: () => void;
}

export const CoursePlayerModal: React.FC<CoursePlayerModalProps> = ({
  course,
  lang,
  completedLessons,
  onToggleLessonComplete,
  onEnrollCourse,
  onClose,
}) => {
  const isFa = lang === 'fa';
  const allLessons = useMemo(
    () => (course ? course.modules.flatMap((m) => m.lessons) : []),
    [course]
  );

  const [selectedLessonId, setSelectedLessonId] = useState<string>('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [noteInput, setNoteInput] = useState('');
  const [savedNotes, setSavedNotes] = useState<Record<string, string[]>>({});

  if (!course) return null;

  const activeLesson: Lesson =
    allLessons.find((l) => l.id === selectedLessonId) || allLessons[0];

  const completedCount = allLessons.filter((l) =>
    completedLessons.includes(l.id)
  ).length;
  const progressPercent =
    allLessons.length > 0
      ? Math.round((completedCount / allLessons.length) * 100)
      : 0;

  const isLocked = !course.enrolled && !activeLesson?.isFreePreview;
  const isLessonCompleted = activeLesson
    ? completedLessons.includes(activeLesson.id)
    : false;

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 1800);
  };

  const handleSaveNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteInput.trim() || !activeLesson) return;
    setSavedNotes((prev) => ({
      ...prev,
      [activeLesson.id]: [...(prev[activeLesson.id] || []), noteInput.trim()],
    }));
    setNoteInput('');
  };

  const currentNotes = activeLesson ? savedNotes[activeLesson.id] || [] : [];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-5 bg-slate-950/75 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={isFa ? course.title.fa : course.title.en}
    >
      <div className="w-full max-w-6xl max-h-[94vh] flex flex-col rounded-2xl bg-white dark:bg-[#08110E] border border-slate-200 dark:border-emerald-500/25 shadow-2xl overflow-hidden">
        {/* Player Header */}
        <div className="flex items-center justify-between gap-4 px-5 py-3.5 border-b border-slate-200 dark:border-emerald-500/15 bg-slate-50/80 dark:bg-[#0B1613]">
          <div className="min-w-0">
            <p className="text-[11px] font-medium text-slate-500 dark:text-emerald-300/75 truncate">
              {isFa ? course.instructor.fa : course.instructor.en}
            </p>
            <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white truncate">
              {isFa ? course.title.fa : course.title.en}
            </h2>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="hidden sm:flex items-center gap-2 text-xs tabular-nums text-slate-600 dark:text-emerald-300">
              <span>{toLocaleDigits(`${progressPercent}%`, lang)}</span>
              <div className="w-24 h-1.5 rounded-full bg-slate-200 dark:bg-emerald-950 overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl border border-slate-200 dark:border-emerald-500/20 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white cursor-pointer"
              aria-label={isFa ? 'بستن پنجره' : 'Close player'}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Main Split: Video Stage + Curriculum */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-12">
          {/* Left/Main Stage */}
          <div className="lg:col-span-8 p-5 space-y-5 border-b lg:border-b-0 lg:border-e border-slate-200 dark:border-emerald-500/15">
            {/* Simulated Video Stage */}
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 dark:border-emerald-500/25 flex items-center justify-center">
              <img
                src={course.thumbnail}
                alt={isFa ? activeLesson.title.fa : activeLesson.title.en}
                referrerPolicy="no-referrer"
                className="absolute inset-0 w-full h-full object-cover opacity-35"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/30" />

              {isLocked ? (
                <div className="relative z-10 text-center p-6 max-w-md space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#FFBA00]/20 border border-[#FFBA00]/40 text-[#FFBA00] flex items-center justify-center mx-auto">
                    <Lock className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-white">
                    {isFa
                      ? 'این جلسه مخصوص دانشجویان دوره است'
                      : 'Enroll to Unlock Full Lesson Access'}
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {isFa
                      ? 'با ثبت‌نام در دوره، به تمام ویدیوها، فایل‌های تمرینی و کدهای آماده دسترسی خواهید داشت.'
                      : 'Unlock all modules, downloadable project files, and completion certificates.'}
                  </p>
                  <button
                    type="button"
                    onClick={() => onEnrollCourse(course.id)}
                    className="px-5 py-2.5 rounded-xl bg-[var(--iramo-accent)] hover:bg-[var(--iramo-accent-hover)] text-[var(--iramo-accent-fg)] text-xs font-bold cursor-pointer transition-colors"
                  >
                    {isFa ? 'ثبت‌نام و باز کردن دوره' : 'Enroll Now'}
                  </button>
                </div>
              ) : (
                <div className="relative z-10 w-full h-full flex flex-col justify-between p-5">
                  <div className="flex items-center justify-between text-xs text-slate-300">
                    <span className="tabular-nums">
                      {toLocaleDigits(activeLesson.duration, lang)}
                    </span>
                    {activeLesson.isFreePreview && !course.enrolled && (
                      <span className="text-[#FFBA00] font-semibold">
                        {isFa ? 'پیش‌نمایش رایگان' : 'Free Preview'}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col items-center justify-center gap-3 text-center">
                    <button
                      type="button"
                      onClick={() => setIsPlaying((p) => !p)}
                      className="w-16 h-16 rounded-full bg-[var(--iramo-accent)] hover:bg-[var(--iramo-accent-hover)] text-[var(--iramo-accent-fg)] flex items-center justify-center shadow-lg transition-transform hover:scale-105 cursor-pointer"
                      aria-label={isPlaying ? 'Pause' : 'Play'}
                    >
                      {isPlaying ? (
                        <Pause className="w-6 h-6 fill-current" />
                      ) : (
                        <Play className="w-6 h-6 fill-current ms-0.5" />
                      )}
                    </button>
                    <p className="text-sm font-semibold text-white max-w-lg">
                      {isFa ? activeLesson.title.fa : activeLesson.title.en}
                    </p>
                  </div>

                  {/* Player Scrubber */}
                  <div className="space-y-1.5">
                    <div className="h-1.5 w-full rounded-full bg-white/20 overflow-hidden">
                      <div
                        className={`h-full bg-emerald-400 rounded-full transition-all duration-500 ${
                          isPlaying ? 'w-2/3' : 'w-1/3'
                        }`}
                      />
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-300 tabular-nums">
                      <span>{toLocaleDigits(isPlaying ? '14:22' : '08:10', lang)}</span>
                      <span>{toLocaleDigits(activeLesson.duration, lang)}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Lesson Title + Mark Complete Button */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-emerald-500/15">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {isFa ? activeLesson.title.fa : activeLesson.title.en}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300/80 mt-1 leading-relaxed">
                  {isFa ? activeLesson.summary.fa : activeLesson.summary.en}
                </p>
              </div>

              {course.enrolled && (
                <button
                  type="button"
                  onClick={() => onToggleLessonComplete(activeLesson.id)}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    isLessonCompleted
                      ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30'
                      : 'bg-slate-900 text-white hover:bg-slate-800 dark:bg-emerald-500 dark:text-slate-950 dark:hover:bg-emerald-400'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>
                    {isLessonCompleted
                      ? isFa
                        ? 'تکمیل شده'
                        : 'Completed'
                      : isFa
                      ? 'علامت‌گذاری تکمیل'
                      : 'Mark Complete'}
                  </span>
                </button>
              )}
            </div>

            {/* Key Takeaways & Code Snippet */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-xl p-4 bg-slate-50 dark:bg-[#0B1613] border border-slate-200/80 dark:border-emerald-500/15 space-y-2.5">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                  {isFa ? 'نکات کلیدی این جلسه' : 'Key Takeaways'}
                </h4>
                <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300 leading-relaxed list-disc list-inside">
                  {(isFa
                    ? activeLesson.keyTakeaways.fa
                    : activeLesson.keyTakeaways.en
                  ).map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>

              {activeLesson.codeSnippet ? (
                <div className="rounded-xl p-4 bg-[#07110E] border border-emerald-500/20 text-slate-100 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
                      <Terminal className="w-3.5 h-3.5" />
                      <span>{isFa ? 'قطعه کد جلسه' : 'Lesson Snippet'}</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopyCode(activeLesson.codeSnippet!)}
                      className="inline-flex items-center gap-1 text-[11px] text-slate-300 hover:text-white cursor-pointer"
                    >
                      {copiedCode ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                      <span>
                        {copiedCode
                          ? isFa
                            ? 'کپی شد'
                            : 'Copied'
                          : isFa
                          ? 'کپی'
                          : 'Copy'}
                      </span>
                    </button>
                  </div>
                  <pre
                    dir="ltr"
                    className="text-[11px] font-mono text-emerald-200/90 overflow-x-auto leading-relaxed"
                  >
                    <code>{activeLesson.codeSnippet}</code>
                  </pre>
                </div>
              ) : (
                <div className="rounded-xl p-4 bg-slate-50 dark:bg-[#0B1613] border border-slate-200/80 dark:border-emerald-500/15 space-y-2.5">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                    {isFa ? 'یادداشت شخصی شما' : 'Personal Study Notes'}
                  </h4>
                  <form onSubmit={handleSaveNote} className="flex gap-2">
                    <input
                      type="text"
                      value={noteInput}
                      onChange={(e) => setNoteInput(e.target.value)}
                      placeholder={
                        isFa
                          ? 'نکته مهمی را اینجا یادداشت کنید...'
                          : 'Add a quick timestamped note...'
                      }
                      className="flex-1 px-3 py-1.5 rounded-lg bg-white dark:bg-[#050C0A] border border-slate-200 dark:border-emerald-500/20 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                    />
                    <button
                      type="submit"
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-semibold cursor-pointer"
                    >
                      {isFa ? 'ذخیره' : 'Save'}
                    </button>
                  </form>
                  {currentNotes.length > 0 && (
                    <ul className="space-y-1 text-xs text-slate-600 dark:text-emerald-200/80 pt-1">
                      {currentNotes.map((n, idx) => (
                        <li key={idx}>• {n}</li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>

            {activeLesson.attachmentName && (
              <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-slate-50 dark:bg-[#0B1613] border border-slate-200/80 dark:border-emerald-500/15">
                <div className="flex items-center gap-2.5 text-xs font-medium text-slate-700 dark:text-slate-200">
                  <FileText className="w-4 h-4 text-blue-600 dark:text-emerald-400" />
                  <span dir="ltr" className="font-mono">
                    {activeLesson.attachmentName}
                  </span>
                </div>
                <a
                  href={`data:text/plain;charset=utf-8,${encodeURIComponent(
                    activeLesson.codeSnippet || activeLesson.summary.en
                  )}`}
                  download={activeLesson.attachmentName}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-emerald-400 hover:underline"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{isFa ? 'دانلود فایل' : 'Download'}</span>
                </a>
              </div>
            )}
          </div>

          {/* Right Curriculum Rail */}
          <aside className="lg:col-span-4 p-5 space-y-4 bg-slate-50/50 dark:bg-[#060E0B]">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                {isFa ? 'سرفصل‌های دوره' : 'Course Curriculum'}
              </h4>
              <span className="text-[11px] font-medium tabular-nums text-slate-500 dark:text-emerald-300/70">
                {toLocaleDigits(`${completedCount}/${allLessons.length}`, lang)}
              </span>
            </div>

            <div className="space-y-4">
              {course.modules.map((mod) => (
                <div key={mod.id} className="space-y-2">
                  <p className="text-xs font-bold text-slate-700 dark:text-emerald-300/90">
                    {isFa ? mod.title.fa : mod.title.en}
                  </p>
                  <div className="space-y-1.5">
                    {mod.lessons.map((lesson) => {
                      const isCurrent = lesson.id === activeLesson.id;
                      const done = completedLessons.includes(lesson.id);
                      const locked = !course.enrolled && !lesson.isFreePreview;

                      return (
                        <button
                          key={lesson.id}
                          type="button"
                          onClick={() => {
                            setSelectedLessonId(lesson.id);
                            setIsPlaying(false);
                          }}
                          className={`w-full flex items-center justify-between gap-2.5 p-2.5 rounded-xl border text-start transition-colors cursor-pointer ${
                            isCurrent
                              ? 'bg-white dark:bg-emerald-500/15 border-[#FFBA00] dark:border-emerald-400/50 text-slate-950 dark:text-white'
                              : 'bg-white/60 dark:bg-[#0B1613] border-slate-200/70 dark:border-emerald-500/15 text-slate-600 dark:text-slate-300 hover:border-slate-300 dark:hover:border-emerald-500/35'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            {done ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                            ) : locked ? (
                              <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            ) : (
                              <Play className="w-3.5 h-3.5 text-[#FFBA00] shrink-0" />
                            )}
                            <span className="text-xs font-medium truncate">
                              {isFa ? lesson.title.fa : lesson.title.en}
                            </span>
                          </div>
                          <span className="text-[11px] tabular-nums text-slate-400 shrink-0">
                            {toLocaleDigits(lesson.duration, lang)}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {progressPercent === 100 && (
              <div className="rounded-xl p-4 bg-emerald-500/10 border border-emerald-500/30 space-y-2">
                <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300 text-xs font-bold">
                  <Award className="w-4 h-4" />
                  <span>
                    {isFa
                      ? 'تبریک! دوره با موفقیت تکمیل شد'
                      : 'Course Completed · Certificate Ready'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-300">
                  {isFa
                    ? 'گواهینامه دوزبانه شما صادر شده و از ربات تلگرام قابل دریافت است.'
                    : 'Your bilingual completion certificate has been synced to your account.'}
                </p>
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
};
