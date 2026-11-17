import React from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2, Sparkles, X } from 'lucide-react';
import { Assignment, Course, Lang } from '../types/lms';
import { toLocaleDigits } from '../utils/formatters';

interface StudyPlannerModalProps {
  open: boolean;
  onClose: () => void;
  lang: Lang;
  courses: Course[];
  completedLessons: string[];
  assignments: Assignment[];
  onOpenCourse: (course: Course) => void;
}

export const StudyPlannerModal: React.FC<StudyPlannerModalProps> = ({
  open,
  onClose,
  lang,
  courses,
  completedLessons,
  assignments,
  onOpenCourse,
}) => {
  if (!open) return null;
  const isFa = lang === 'fa';

  const enrolled = courses.filter((c) => c.enrolled);
  const nextCourse =
    enrolled.find((c) => {
      const ids = c.modules.flatMap((m) => m.lessons.map((l) => l.id));
      return ids.some((id) => !completedLessons.includes(id));
    }) || enrolled[0];

  const pendingAssignments = assignments.filter((a) => a.status === 'pending');

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="w-full max-w-lg rounded-2xl bg-white dark:bg-[#0B1613] border border-[var(--iramo-card-border)] shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--iramo-card-border)]">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
            <Sparkles className="w-4 h-4 text-[#FFBA00]" />
            <span>
              {isFa ? 'تحلیل هوشمند مسیر یادگیری' : 'Smart Learning Overview'}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div className="rounded-xl p-4 bg-emerald-50/70 dark:bg-emerald-950/35 border border-[var(--iramo-primary-border)] space-y-2">
            <p className="text-xs font-bold text-emerald-800 dark:text-emerald-300">
              {isFa ? 'گام پیشنهادی امروز' : 'Recommended Next Action'}
            </p>
            {nextCourse && (
              <>
                <p className="text-sm font-bold text-slate-900 dark:text-white">
                  {isFa ? nextCourse.title.fa : nextCourse.title.en}
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  {isFa
                    ? 'تکمیل جلسه بعدی حدود ۲۵ دقیقه زمان می‌برد و شما را به دریافت گواهینامه نزدیک‌تر می‌کند.'
                    : 'Completing your next lesson takes ~25 minutes and advances your certification track.'}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    onOpenCourse(nextCourse);
                    onClose();
                  }}
                  className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[var(--iramo-accent)] hover:bg-[var(--iramo-accent-hover)] text-[var(--iramo-accent-fg)] text-xs font-bold cursor-pointer transition-colors"
                >
                  <span>{isFa ? 'شروع جلسه بعدی' : 'Jump to Next Lesson'}</span>
                  {isFa ? (
                    <ArrowLeft className="w-3.5 h-3.5" />
                  ) : (
                    <ArrowRight className="w-3.5 h-3.5" />
                  )}
                </button>
              </>
            )}
          </div>

          <div className="space-y-2">
            <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
              {isFa ? 'خلاصه وضعیت فعلی' : 'Current Snapshot'}
            </p>
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-[#08110E] border border-[var(--iramo-card-border)] text-xs">
              <span className="text-slate-600 dark:text-slate-300">
                {isFa ? 'تکالیف در انتظار ارسال' : 'Pending Assignments'}
              </span>
              <span className="tabular-nums font-bold text-[#9A6E00] dark:text-[#FFBA00]">
                {toLocaleDigits(pendingAssignments.length, lang)}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-[#08110E] border border-[var(--iramo-card-border)] text-xs">
              <span className="text-slate-600 dark:text-slate-300 inline-flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>{isFa ? 'دروس تکمیل‌شده' : 'Completed Lessons'}</span>
              </span>
              <span className="tabular-nums font-bold text-emerald-600 dark:text-emerald-400">
                {toLocaleDigits(completedLessons.length, lang)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
