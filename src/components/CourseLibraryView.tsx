import React, { useMemo, useState } from 'react';
import {
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Code2,
  FolderOpen,
  LayoutGrid,
  List,
  Play,
  RotateCcw,
} from 'lucide-react';
import {
  Course,
  CourseCategory,
  CourseDurationTier,
  CourseFormat,
  CourseTab,
  Lang,
} from '../types/lms';
import { toLocaleDigits } from '../utils/formatters';
import { PriceActionButton } from './PriceActionButton';

interface CourseLibraryViewProps {
  lang: Lang;
  courses: Course[];
  completedLessons: string[];
  onOpenCourse: (course: Course) => void;
  onEnrollCourse: (courseId: string) => void;
  onGoToWpExport: () => void;
}

export const CourseLibraryView: React.FC<CourseLibraryViewProps> = ({
  lang,
  courses,
  completedLessons,
  onOpenCourse,
  onEnrollCourse,
  onGoToWpExport,
}) => {
  const isFa = lang === 'fa';
  const [activeTab, setActiveTab] = useState<CourseTab>('library');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [featuredExpanded, setFeaturedExpanded] = useState(true);
  const [learningExpanded, setLearningExpanded] = useState(true);

  const [selectedCategories, setSelectedCategories] = useState<CourseCategory[]>([]);
  const [selectedFormats, setSelectedFormats] = useState<CourseFormat[]>([]);
  const [selectedDurations, setSelectedDurations] = useState<CourseDurationTier[]>([]);

  const [openFilterSections, setOpenFilterSections] = useState({
    categories: true,
    format: true,
    duration: false,
  });

  const getCourseProgress = (course: Course) => {
    const ids = course.modules.flatMap((m) => m.lessons.map((l) => l.id));
    if (ids.length === 0) return 0;
    const done = ids.filter((id) => completedLessons.includes(id)).length;
    return Math.round((done / ids.length) * 100);
  };

  const toggleCategory = (cat: CourseCategory) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const toggleFormat = (fmt: CourseFormat) => {
    setSelectedFormats((prev) =>
      prev.includes(fmt) ? prev.filter((f) => f !== fmt) : [...prev, fmt]
    );
  };

  const toggleDuration = (dur: CourseDurationTier) => {
    setSelectedDurations((prev) =>
      prev.includes(dur) ? prev.filter((d) => d !== dur) : [...prev, dur]
    );
  };

  const resetFilters = () => {
    setSelectedCategories([]);
    setSelectedFormats([]);
    setSelectedDurations([]);
  };

  const featuredCourses = useMemo(
    () => courses.filter((c) => c.featured),
    [courses]
  );

  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      const progress = getCourseProgress(course);
      if (activeTab === 'my-course' && !course.enrolled) return false;
      if (activeTab === 'ended' && progress < 100) return false;

      if (
        selectedCategories.length > 0 &&
        !selectedCategories.includes(course.category)
      ) {
        return false;
      }
      if (selectedFormats.length > 0 && !selectedFormats.includes(course.format)) {
        return false;
      }
      if (
        selectedDurations.length > 0 &&
        !selectedDurations.includes(course.durationTier)
      ) {
        return false;
      }
      return true;
    });
  }, [
    courses,
    activeTab,
    selectedCategories,
    selectedFormats,
    selectedDurations,
    completedLessons,
  ]);

  const categoryLabels: { id: CourseCategory; fa: string; en: string }[] = [
    { id: 'AI', fa: 'هوش مصنوعی', en: 'AI' },
    { id: 'Bots', fa: 'ربات تلگرام و بله', en: 'Bots' },
    { id: 'Finance', fa: 'مالی و حسابیار', en: 'Finance' },
    { id: 'Automation', fa: 'اتوماسیون فروش', en: 'Automation' },
    { id: 'Video', fa: 'تولید ویدیو', en: 'Video AI' },
    { id: 'WordPress', fa: 'وردپرس و المنتور', en: 'WordPress' },
  ];

  const formatLabels: { id: CourseFormat; fa: string; en: string }[] = [
    { id: 'Video', fa: 'دوره ویدیویی', en: 'Video' },
    { id: 'Workshop', fa: 'کارگاه تخصصی', en: 'Workshop' },
    { id: 'Project', fa: 'پروژه‌محور', en: 'Project' },
  ];

  const durationLabels: { id: CourseDurationTier; fa: string; en: string }[] = [
    { id: 'short', fa: 'کوتاه (زیر ۴ ساعت)', en: 'Short (< 4h)' },
    { id: 'medium', fa: 'متوسط (۴ تا ۸ ساعت)', en: 'Medium (4-8h)' },
    { id: 'long', fa: 'جامع (بالای ۸ ساعت)', en: 'Comprehensive (8h+)' },
  ];

  const hasActiveFilters =
    selectedCategories.length > 0 ||
    selectedFormats.length > 0 ||
    selectedDurations.length > 0;

  return (
    <div className="space-y-6">
      {/* Sub-Tabs Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 dark:border-emerald-500/15 pb-3">
        <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100/80 dark:bg-[#0B1613] border border-slate-200/70 dark:border-emerald-500/15">
          {(
            [
              {
                id: 'my-course',
                fa: 'دوره‌های من',
                en: 'My course',
                icon: <BookOpen className="w-3.5 h-3.5" />,
              },
              {
                id: 'library',
                fa: 'کتابخانه دوره‌ها',
                en: 'Library',
                icon: <FolderOpen className="w-3.5 h-3.5" />,
              },
              {
                id: 'ended',
                fa: 'تکمیل‌شده',
                en: 'Ended course',
                icon: <CheckCircle2 className="w-3.5 h-3.5" />,
              },
            ] as const
          ).map((tab) => {
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  active
                    ? 'bg-white text-amber-600 shadow-xs dark:bg-emerald-500/20 dark:text-emerald-300'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                }`}
              >
                {tab.icon}
                <span>{isFa ? tab.fa : tab.en}</span>
              </button>
            );
          })}
        </div>

        <div className="text-xs text-slate-500 dark:text-emerald-200/60 tabular-nums">
          {toLocaleDigits(filteredCourses.length, lang)}{' '}
          {isFa ? 'دوره در دسترس' : 'courses available'}
        </div>
      </div>

      {/* Hero Banner */}
      <section className="rounded-2xl p-6 sm:p-7 border border-[#1677FF]/20 dark:border-emerald-500/20 bg-gradient-to-l from-[#1677FF]/10 via-sky-50/50 to-white dark:from-emerald-950/60 dark:via-[#0B1613] dark:to-[#0D1A15]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white text-balance">
              {isFa
                ? 'مسیر یادگیری هوشمند بعدی خود را انتخاب کنید'
                : 'Find Your Next Course'}
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300/85 leading-relaxed">
              {isFa
                ? 'کتابخانه تخصصی آکادمی iRamo شامل آموزش هوش مصنوعی، طراحی ربات تلگرام و بله، حسابیار و اتوماسیون وردپرس.'
                : 'Explore the iRamo course library covering AI systems, Telegram & Bale automation, Hesabyar, and WordPress integration.'}
            </p>
          </div>
          {courses[0] && (
            <button
              type="button"
              onClick={() => onOpenCourse(courses[0])}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-[#1677FF] hover:bg-[#0D65E8] text-white dark:bg-amber-500 dark:hover:bg-amber-400 dark:text-slate-950 transition-colors cursor-pointer whitespace-nowrap shrink-0 shadow-sm shadow-[#1677FF]/20 dark:shadow-none"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{isFa ? 'ادامه یادگیری' : 'Resume Learning'}</span>
            </button>
          )}
        </div>
      </section>

      {/* Featured Course Horizontal Cards */}
      {activeTab === 'library' && (
        <section className="space-y-3">
          <button
            type="button"
            onClick={() => setFeaturedExpanded((p) => !p)}
            className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white cursor-pointer"
          >
            {featuredExpanded ? (
              <ChevronDown className="w-4 h-4 text-slate-400" />
            ) : (
              <ChevronUp className="w-4 h-4 text-slate-400" />
            )}
            <span>{isFa ? 'دوره‌های ویژه و پرمخاطب' : 'Featured Course'}</span>
          </button>

          {featuredExpanded && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {featuredCourses.map((course) => {
                const progress = getCourseProgress(course);
                const folderGradient =
                  course.accentColor === 'amber'
                    ? 'from-amber-400 to-orange-500'
                    : course.accentColor === 'blue'
                    ? 'from-blue-500 to-sky-600'
                    : 'from-emerald-400 to-teal-600';

                return (
                  <button
                    key={course.id}
                    type="button"
                    onClick={() => onOpenCourse(course)}
                    className="group flex items-start gap-3.5 p-4 rounded-2xl bg-white dark:bg-[#0B1613] border border-slate-200/80 dark:border-emerald-500/15 hover:border-amber-400/70 dark:hover:border-emerald-400/40 text-start transition-all duration-150 cursor-pointer"
                  >
                    <div
                      className={`w-16 h-16 rounded-xl bg-gradient-to-br ${folderGradient} p-2.5 flex flex-col justify-between shrink-0 text-white shadow-sm`}
                    >
                      <div className="w-6 h-1.5 rounded-full bg-white/40" />
                      <FolderOpen className="w-6 h-6 text-white/95" />
                    </div>

                    <div className="min-w-0 flex-1 space-y-1.5">
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-emerald-400 transition-colors">
                        {isFa ? course.title.fa : course.title.en}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                        {isFa ? course.subtitle.fa : course.subtitle.en}
                      </p>
                      <div className="pt-1 flex items-center gap-2 text-[11px] font-medium text-slate-500 dark:text-emerald-300/70 tabular-nums">
                        <span>
                          {toLocaleDigits(course.moduleCount, lang)}{' '}
                          {isFa ? 'فصل' : 'modules'}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span>
                          {toLocaleDigits(course.lessonCount, lang)}{' '}
                          {isFa ? 'جلسه' : 'lessons'}
                        </span>
                        {course.enrolled && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                              {toLocaleDigits(`${progress}%`, lang)}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </section>
      )}

      {/* Main Content Split */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        <div className="xl:col-span-9 space-y-4">
          <div className="flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={() => setLearningExpanded((p) => !p)}
              className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white cursor-pointer"
            >
              {learningExpanded ? (
                <ChevronDown className="w-4 h-4 text-slate-400" />
              ) : (
                <ChevronUp className="w-4 h-4 text-slate-400" />
              )}
              <span>
                {activeTab === 'my-course'
                  ? isFa
                    ? 'دوره‌های ثبت‌نام‌شده شما'
                    : 'Your Enrolled Courses'
                  : activeTab === 'ended'
                  ? isFa
                    ? 'دوره‌های به اتمام رسیده'
                    : 'Completed Courses'
                  : isFa
                  ? 'دوره‌های آموزشی تخصصی'
                  : 'Featured learning'}
              </span>
            </button>

            <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-[#0B1613] border border-slate-200/80 dark:border-emerald-500/15">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  viewMode === 'grid'
                    ? 'bg-white text-amber-600 shadow-xs dark:bg-emerald-500/20 dark:text-emerald-300'
                    : 'text-slate-400 hover:text-slate-700 dark:hover:text-white'
                }`}
                aria-label={isFa ? 'نمای شبکه‌ای' : 'Grid view'}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  viewMode === 'list'
                    ? 'bg-white text-amber-600 shadow-xs dark:bg-emerald-500/20 dark:text-emerald-300'
                    : 'text-slate-400 hover:text-slate-700 dark:hover:text-white'
                }`}
                aria-label={isFa ? 'نمای لیستی' : 'List view'}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>

          {learningExpanded && (
            <>
              {filteredCourses.length === 0 ? (
                <div className="rounded-2xl p-10 text-center bg-white dark:bg-[#0B1613] border border-slate-200 dark:border-emerald-500/15 space-y-3">
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">
                    {activeTab === 'ended'
                      ? isFa
                        ? 'هنوز هیچ دوره‌ای را ۱۰۰٪ تکمیل نکرده‌اید.'
                        : 'No courses completed 100% yet.'
                      : isFa
                      ? 'دوره‌ای با این فیلترها یافت نشد.'
                      : 'No courses match the selected filters.'}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      resetFilters();
                      if (activeTab === 'ended') setActiveTab('library');
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 text-white dark:bg-emerald-500 dark:text-slate-950 text-xs font-semibold cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>
                      {activeTab === 'ended'
                        ? isFa
                          ? 'مشاهده کتابخانه دوره‌ها'
                          : 'Browse Library'
                        : isFa
                        ? 'حذف فیلترها'
                        : 'Reset Filters'}
                    </span>
                  </button>
                </div>
              ) : (
                <div
                  className={
                    viewMode === 'grid'
                      ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'
                      : 'space-y-3'
                  }
                >
                  {filteredCourses.map((course) => {
                    const progress = getCourseProgress(course);
                    return (
                      <article
                        key={course.id}
                        className={`group rounded-2xl bg-white dark:bg-[#0B1613] border border-slate-200/80 dark:border-emerald-500/15 hover:border-blue-400/60 dark:hover:border-emerald-400/40 overflow-hidden transition-all duration-150 flex ${
                          viewMode === 'list' ? 'flex-col sm:flex-row' : 'flex-col'
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() => onOpenCourse(course)}
                          className={`relative overflow-hidden bg-slate-100 dark:bg-[#0F1E19] cursor-pointer text-start ${
                            viewMode === 'list'
                              ? 'sm:w-52 aspect-4/3 shrink-0'
                              : 'w-full aspect-4/3'
                          }`}
                        >
                          <img
                            src={course.thumbnail}
                            alt={isFa ? course.title.fa : course.title.en}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
                          />
                        </button>

                        <div className="p-4 flex-1 flex flex-col justify-between gap-3">
                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between gap-2 text-[11px] font-medium text-slate-500 dark:text-emerald-300/75">
                              <span>{course.category}</span>
                              {course.isNew && (
                                <span className="font-semibold text-amber-600 dark:text-amber-400">
                                  {isFa ? 'جدید' : 'New'}
                                </span>
                              )}
                            </div>

                            <button
                              type="button"
                              onClick={() => onOpenCourse(course)}
                              className="text-start block w-full cursor-pointer"
                            >
                              <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-snug group-hover:text-blue-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-2">
                                {isFa ? course.title.fa : course.title.en}
                              </h3>
                            </button>

                            <p className="text-xs text-slate-500 dark:text-slate-400 tabular-nums">
                              {isFa ? course.totalDuration.fa : course.totalDuration.en}{' '}
                              <span aria-hidden="true">·</span>{' '}
                              {toLocaleDigits(course.lessonCount, lang)}{' '}
                              {isFa ? 'جلسه' : 'Lessons'}
                            </p>
                          </div>

                          <div className="pt-2 border-t border-slate-100 dark:border-emerald-500/10 flex items-center justify-between gap-3">
                            {course.enrolled ? (
                              <div className="flex-1 space-y-1.5">
                                <div className="flex items-center justify-between text-[11px]">
                                  <span className="text-slate-500 dark:text-slate-400">
                                    {isFa ? 'پیشرفت دوره' : 'Progress'}
                                  </span>
                                  <span className="tabular-nums font-semibold text-emerald-600 dark:text-emerald-400">
                                    {toLocaleDigits(`${progress}%`, lang)}
                                  </span>
                                </div>
                                <div className="h-1.5 w-full rounded-full bg-slate-100 dark:bg-emerald-950 overflow-hidden">
                                  <div
                                    className="h-full rounded-full bg-emerald-500 transition-all duration-300"
                                    style={{ width: `${progress}%` }}
                                  />
                                </div>
                              </div>
                            ) : (
                              <PriceActionButton
                                lang={lang}
                                priceToman={course.priceToman}
                                priceUsd={course.priceUsd}
                                ctaLabel={{ fa: 'ثبت‌نام سریع', en: 'Enroll Now' }}
                                variant="amber"
                                fullWidth
                                onClick={() => onEnrollCourse(course.id)}
                              />
                            )}

                            {course.enrolled && (
                              <button
                                type="button"
                                onClick={() => onOpenCourse(course)}
                                className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-emerald-500/15 dark:hover:bg-emerald-500/25 text-slate-800 dark:text-emerald-300 text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0"
                              >
                                {isFa ? 'ورود به کلاس' : 'Open'}
                              </button>
                            )}
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>

        {/* Right Filters Sidebar */}
        <aside className="xl:col-span-3 space-y-4">
          <div className="rounded-2xl p-4 bg-white dark:bg-[#0B1613] border border-slate-200/80 dark:border-emerald-500/15 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                {isFa ? 'فیلتر دوره‌ها' : 'Filters'}
              </h3>
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="text-xs font-medium text-blue-600 dark:text-emerald-400 hover:underline cursor-pointer"
                >
                  {isFa ? 'پاک کردن' : 'Reset'}
                </button>
              )}
            </div>

            <div className="border-t border-slate-100 dark:border-emerald-500/10 pt-3">
              <button
                type="button"
                onClick={() =>
                  setOpenFilterSections((s) => ({
                    ...s,
                    categories: !s.categories,
                  }))
                }
                className="w-full flex items-center justify-between text-xs font-semibold text-slate-800 dark:text-slate-200 mb-2.5 cursor-pointer"
              >
                <span>
                  {isFa ? 'دسته‌بندی' : 'Categories'}{' '}
                  {selectedCategories.length > 0 && (
                    <span className="text-amber-600 dark:text-amber-400 tabular-nums">
                      ({toLocaleDigits(selectedCategories.length, lang)})
                    </span>
                  )}
                </span>
                {openFilterSections.categories ? (
                  <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                )}
              </button>

              {openFilterSections.categories && (
                <div className="space-y-2">
                  {categoryLabels.map((cat) => (
                    <label
                      key={cat.id}
                      className="flex items-center gap-2.5 text-xs text-slate-600 dark:text-slate-300 cursor-pointer select-none"
                    >
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(cat.id)}
                        onChange={() => toggleCategory(cat.id)}
                        className="w-4 h-4 rounded border-slate-300 dark:border-emerald-500/30 text-amber-500 focus:ring-amber-500 cursor-pointer accent-amber-500"
                      />
                      <span>{isFa ? cat.fa : cat.en}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            <div className="border-t border-slate-100 dark:border-emerald-500/10 pt-3">
              <button
                type="button"
                onClick={() =>
                  setOpenFilterSections((s) => ({ ...s, format: !s.format }))
                }
                className="w-full flex items-center justify-between text-xs font-semibold text-slate-800 dark:text-slate-200 mb-2.5 cursor-pointer"
              >
                <span>{isFa ? 'نوع آموزش' : 'Format'}</span>
                {openFilterSections.format ? (
                  <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                )}
              </button>

              {openFilterSections.format && (
                <div className="space-y-2">
                  {formatLabels.map((fmt) => (
                    <label
                      key={fmt.id}
                      className="flex items-center gap-2.5 text-xs text-slate-600 dark:text-slate-300 cursor-pointer select-none"
                    >
                      <input
                        type="checkbox"
                        checked={selectedFormats.includes(fmt.id)}
                        onChange={() => toggleFormat(fmt.id)}
                        className="w-4 h-4 rounded border-slate-300 text-amber-500 accent-amber-500 cursor-pointer"
                      />
                      <span>{isFa ? fmt.fa : fmt.en}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            <div className="border-t border-slate-100 dark:border-emerald-500/10 pt-3">
              <button
                type="button"
                onClick={() =>
                  setOpenFilterSections((s) => ({ ...s, duration: !s.duration }))
                }
                className="w-full flex items-center justify-between text-xs font-semibold text-slate-800 dark:text-slate-200 mb-2.5 cursor-pointer"
              >
                <span>{isFa ? 'مدت زمان' : 'Duration'}</span>
                {openFilterSections.duration ? (
                  <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                )}
              </button>

              {openFilterSections.duration && (
                <div className="space-y-2">
                  {durationLabels.map((dur) => (
                    <label
                      key={dur.id}
                      className="flex items-center gap-2.5 text-xs text-slate-600 dark:text-slate-300 cursor-pointer select-none"
                    >
                      <input
                        type="checkbox"
                        checked={selectedDurations.includes(dur.id)}
                        onChange={() => toggleDuration(dur.id)}
                        className="w-4 h-4 rounded border-slate-300 text-amber-500 accent-amber-500 cursor-pointer"
                      />
                      <span>{isFa ? dur.fa : dur.en}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="rounded-2xl p-4 bg-gradient-to-br from-slate-900 to-emerald-950 text-white border border-emerald-500/25 space-y-3">
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold">
              <Code2 className="w-4 h-4 shrink-0" />
              <span>{isFa ? 'آماده نصب روی وردپرس' : 'WordPress + Elementor Pro'}</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {isFa
                ? 'این پلتفرم را با پلاگین اختصاصی و قالب آماده المنتور پرو مستقیماً روی سایت خودتان قرار دهید.'
                : 'Drop this exact platform into Elementor Pro via our native widget, shortcode, and WooCommerce bridge.'}
            </p>
            <button
              type="button"
              onClick={onGoToWpExport}
              className="w-full py-2 px-3 rounded-xl bg-[#1677FF] hover:bg-[#0D65E8] text-white dark:bg-amber-500 dark:hover:bg-amber-400 dark:text-slate-950 text-xs font-bold transition-colors cursor-pointer whitespace-nowrap"
            >
              {isFa ? 'دریافت کد و پلاگین المنتور' : 'Get Elementor Package'}
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
};
