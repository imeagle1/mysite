import React, { useEffect, useState } from 'react';
import { AIToolsView } from './components/AIToolsView';
import { ArticlesView } from './components/ArticlesView';
import { AuthModal, UserProfile } from './components/AuthModal';
import { CommandPalette } from './components/CommandPalette';
import {
  AuthChannelsConfig,
  ContentManagerView,
  PersianFontOption,
  QuickTipItem,
  SiteConfig,
} from './components/ContentManagerView';
import { CourseLibraryView } from './components/CourseLibraryView';
import { CoursePlayerModal } from './components/CoursePlayerModal';
import { HomeDashboardView } from './components/HomeDashboardView';
import {
  AssignmentsView,
  BotConnectView,
  TransactionsView,
} from './components/OperationsViews';
import {
  ProductsDemoView,
  PublicCoursesView,
  ServicesConsultationView,
} from './components/ProductsAndServicesViews';
import { Sidebar } from './components/Sidebar';
import { StudyPlannerModal } from './components/StudyPlannerModal';
import { TopBar } from './components/TopBar';
import { WebsiteHomeView } from './components/WebsiteHomeView';
import { SitePage, WebsiteShell } from './components/WebsiteShell';
import { WordPressExportView } from './components/WordPressExportView';
import { ARTICLES_DATA } from './data/articlesData';
import {
  courseAiImg,
  courseBotImg,
  courseHesabyarImg,
  servicesNeuralImg,
} from './assets/media';
import {
  AI_TOOLS_DATA,
  ASSIGNMENTS_DATA,
  COURSES_DATA,
  INITIAL_NOTIFICATIONS,
  PRODUCTS_DATA,
  SoftwareProduct,
  TRANSACTIONS_DATA,
} from './data/lmsData';
import {
  AITool,
  Article,
  Assignment,
  Course,
  Lang,
  NavSection,
  NotificationItem,
  ThemeMode,
  Transaction,
} from './types/lms';
import {
  applyThemeColorVariables,
  DEFAULT_THEME_COLORS,
  ThemeColorConfig,
} from './utils/colorTheme';

const STORAGE_KEY = 'iramo_platform_state_v3';

const DEFAULT_QUICK_TIPS: QuickTipItem[] = [
  {
    id: 'demo-tip-1',
    fa: 'برای کاهش ۸۰٪ هزینه پیامک ورود (OTP)، وب‌هوک بله و تلگرام را با یک توکن روی سایت خود فعال کنید.',
    en: 'Cut login SMS costs by 80% using unified Telegram & Bale OTP bot webhooks.',
    isDemo: true,
  },
  {
    id: 'demo-tip-2',
    fa: 'در المنتور پرو، همیشه صفحات پنل کاربری را روی طرح‌بندی Elementor Canvas بگذارید تا استایل قالب اصلی تداخل ایجاد نکند.',
    en: 'Set Elementor Pro portal pages to Elementor Canvas so host theme CSS never collides.',
    isDemo: true,
  },
  {
    id: 'demo-tip-3',
    fa: 'برای خروجی دقیق از هوش مصنوعی در ربات حسابیار، همیشه یک نمونه JSON خروجی در انتهای پرامپت قرار دهید.',
    en: 'Include a strict JSON schema example at the end of your system prompt for deterministic receipt parsing.',
    isDemo: true,
  },
];

const DEFAULT_AUTH_CHANNELS: AuthChannelsConfig = {
  telegram: true,
  bale: true,
  sms: true,
  email: true,
  defaultChannel: 'telegram',
  allowRegistration: true,
  telegramBotUsername: '@iRamoBot',
  baleBotUsername: '@iRamoBaleBot',
  smsProvider: 'kavenegar',
  smsPatternCode: 'iramo-verify-otp',
};

const DEFAULT_SITE_CONFIG: SiteConfig = {
  brandTitle: 'iRamoAi',
  accentColor: 'emerald',
  themeColors: DEFAULT_THEME_COLORS,
  fontFamily: 'custom',
  customFontName: 'IRANYekanXVF',
  customFontCssUrl: '',
  showArticles: true,
  showAiTools: true,
  showServices: true,
  authChannels: DEFAULT_AUTH_CHANNELS,
  quickTips: DEFAULT_QUICK_TIPS,
};

const FONT_STACKS: Record<Exclude<PersianFontOption, 'custom'>, string> = {
  vazirmatn: "'Vazirmatn', system-ui, -apple-system, sans-serif",
  rubik: "'Rubik', 'Vazirmatn', system-ui, sans-serif",
  readex: "'Readex Pro', 'Vazirmatn', system-ui, sans-serif",
  'noto-arabic': "'Noto Sans Arabic', 'Vazirmatn', system-ui, sans-serif",
};

interface SavedState {
  lang?: Lang;
  theme?: ThemeMode;
  enrolledIds?: string[];
  completedLessons?: string[];
  user?: UserProfile | null;
  siteConfig?: SiteConfig;
  clearedSections?: {
    products?: boolean;
    courses?: boolean;
    tools?: boolean;
    articles?: boolean;
    ops?: boolean;
  };
  customArticles?: Article[];
  customCourses?: Course[];
  customProducts?: SoftwareProduct[];
  customTools?: AITool[];
}

function readInitialState(): SavedState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as SavedState) : {};
  } catch {
    return {};
  }
}

export default function App() {
  const saved = readInitialState();
  const wpRoot =
    typeof document !== 'undefined'
      ? document.getElementById('iramo-lms-root')
      : null;
  const wpDemoCleared = wpRoot?.dataset.demoCleared === '1';
  const wpRestUrl = wpRoot?.dataset.restUrl || '';
  const initialWpNonce = wpRoot?.dataset.wpNonce || '';

  let wpUser: UserProfile | null = null;
  if (wpRoot?.dataset.user && wpRoot.dataset.user !== 'null') {
    try {
      const parsedUser = JSON.parse(wpRoot.dataset.user);
      if (parsedUser && typeof parsedUser === 'object' && parsedUser.name) {
        wpUser = parsedUser as UserProfile;
      }
    } catch {
      wpUser = null;
    }
  }

  const [wpNonce, setWpNonce] = useState<string>(
    wpUser?.nonce || initialWpNonce
  );

  const [lang, setLang] = useState<Lang>(
    saved.lang || (wpRoot?.dataset.lang === 'en' ? 'en' : 'fa')
  );
  const [theme, setTheme] = useState<ThemeMode>(
    saved.theme || (wpRoot?.dataset.theme === 'dark' ? 'dark' : 'light')
  );
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(
    wpRestUrl ? wpUser : saved.user ?? null
  );
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [pendingCourseAfterAuth, setPendingCourseAfterAuth] = useState<
    string | null
  >(null);

  const wpFont = wpRoot?.dataset.font as PersianFontOption | undefined;
  const wpCustomFont = wpRoot?.dataset.customFont || '';
  const wpCustomFontCssUrl = wpRoot?.dataset.customFontCssUrl || '';
  const wpBrandName = wpRoot?.dataset.brandName || '';
  let wpAuthConfig: Partial<AuthChannelsConfig> = {};
  if (wpRoot?.dataset.authConfig) {
    try {
      wpAuthConfig = JSON.parse(wpRoot.dataset.authConfig) as Partial<AuthChannelsConfig>;
    } catch {
      wpAuthConfig = {};
    }
  }
  let wpQuickTips: QuickTipItem[] = [];
  if (wpRoot?.dataset.quickTips) {
    try {
      const parsed = JSON.parse(wpRoot.dataset.quickTips);
      if (Array.isArray(parsed)) {
        wpQuickTips = parsed as QuickTipItem[];
      }
    } catch {
      wpQuickTips = [];
    }
  }

  let wpColorConfig: Partial<ThemeColorConfig> = {};
  if (wpRoot?.dataset.colorConfig) {
    try {
      wpColorConfig = JSON.parse(wpRoot.dataset.colorConfig) as Partial<ThemeColorConfig>;
    } catch {
      wpColorConfig = {};
    }
  }

  const parseWpJsonArray = <T,>(raw?: string): T[] => {
    if (!raw) return [];
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? (parsed as T[]) : [];
    } catch {
      return [];
    }
  };

  const wpProducts: SoftwareProduct[] = parseWpJsonArray<SoftwareProduct>(
    wpRoot?.dataset.products
  ).map((p) => ({
    ...p,
    thumbnail: p.thumbnail || courseHesabyarImg,
  }));

  const wpTools: AITool[] = parseWpJsonArray<AITool>(wpRoot?.dataset.tools).map(
    (t) => ({
      ...t,
      thumbnail: t.thumbnail || servicesNeuralImg,
    })
  );

  const wpCourses: Course[] = parseWpJsonArray<Course>(
    wpRoot?.dataset.courses
  ).map((c) => ({
    ...c,
    thumbnail: c.thumbnail || courseBotImg,
  }));

  const wpArticles: Article[] = parseWpJsonArray<Article>(
    wpRoot?.dataset.articles
  ).map((a) => ({
    ...a,
    thumbnail: a.thumbnail || courseAiImg,
  }));

  const [siteConfig, setSiteConfig] = useState<SiteConfig>(() => {
    const savedCfg = saved.siteConfig;
    const rawBrand = savedCfg?.brandTitle || wpBrandName || DEFAULT_SITE_CONFIG.brandTitle;
    const normalizedBrand = rawBrand === 'iRamo.Ai' ? 'iRamoAi' : rawBrand;
    const resolvedQuickTips =
      savedCfg?.quickTips !== undefined
        ? savedCfg.quickTips
        : wpQuickTips.length > 0
        ? wpQuickTips
        : wpDemoCleared
        ? []
        : DEFAULT_QUICK_TIPS;

    return {
      ...DEFAULT_SITE_CONFIG,
      ...(wpFont ? { fontFamily: wpFont } : {}),
      ...(wpCustomFont ? { customFontName: wpCustomFont } : {}),
      ...(wpCustomFontCssUrl ? { customFontCssUrl: wpCustomFontCssUrl } : {}),
      ...(savedCfg || {}),
      brandTitle: normalizedBrand,
      themeColors: (() => {
        const merged = {
          ...DEFAULT_THEME_COLORS,
          ...wpColorConfig,
          ...(savedCfg?.themeColors || {}),
        };
        if (merged.accentHex?.toUpperCase() === '#F59E0B') {
          merged.accentHex = '#FFBA00';
        }
        return merged;
      })(),
      authChannels: {
        ...DEFAULT_AUTH_CHANNELS,
        ...wpAuthConfig,
        ...(savedCfg?.authChannels || {}),
      },
      quickTips: resolvedQuickTips,
    };
  });

  // Top-level site route: Public Website Pages vs User Panel
  const [sitePage, setSitePage] = useState<SitePage>('home');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    null
  );
  const [marketplaceInit, setMarketplaceInit] = useState<{
    query: string;
    task: string;
  }>({ query: '', task: 'ALL' });

  // Inside User Panel state
  const [activeSection, setActiveSection] = useState<NavSection>('course');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [studyPlannerOpen, setStudyPlannerOpen] = useState(false);

  // Controllable Data & Demo-Clear State
  const [clearedSections, setClearedSections] = useState<{
    products?: boolean;
    courses?: boolean;
    tools?: boolean;
    articles?: boolean;
    ops?: boolean;
  }>(
    wpRestUrl
      ? wpDemoCleared
        ? {
            products: true,
            courses: true,
            articles: true,
            ops: true,
          }
        : {}
      : { ...(saved.clearedSections || {}), tools: false }
  );
  const [customArticles, setCustomArticles] = useState<Article[]>(
    saved.customArticles || []
  );
  const [customCourses, setCustomCourses] = useState<Course[]>(
    saved.customCourses || []
  );
  const [customProducts, setCustomProducts] = useState<SoftwareProduct[]>(
    saved.customProducts || []
  );
  const [customTools, setCustomTools] = useState<AITool[]>(
    saved.customTools || []
  );

  const [enrolledIds, setEnrolledIds] = useState<string[]>(() => {
    if (wpRestUrl) {
      const wpEnrolled = wpUser?.enrolled || [];
      if (wpDemoCleared) return wpEnrolled;
      return Array.from(
        new Set([
          ...wpEnrolled,
          ...COURSES_DATA.filter((c) => c.enrolled).map((c) => c.id),
        ])
      );
    }
    return (
      saved.enrolledIds ||
      COURSES_DATA.filter((c) => c.enrolled).map((c) => c.id)
    );
  });

  const [completedLessons, setCompletedLessons] = useState<string[]>(() => {
    if (wpRestUrl) {
      return wpUser?.completed || [];
    }
    return saved.completedLessons || ['ai-l1', 'bot-l1', 'hes-l1'];
  });

  const [assignments, setAssignments] = useState<Assignment[]>(() => {
    if (wpRestUrl && wpUser?.assignments) {
      return wpUser.assignments;
    }
    return wpDemoCleared ? [] : ASSIGNMENTS_DATA;
  });
  const [wpTransactions, setWpTransactions] = useState<Transaction[]>(
    wpUser?.transactions || []
  );
  const [notifications, setNotifications] = useState<NotificationItem[]>(
    wpDemoCleared ? [] : INITIAL_NOTIFICATIONS
  );
  const [activeCourseId, setActiveCourseId] = useState<string | null>(null);

  // Derived active datasets (WordPress DB + Panel Custom + Optional Demo)
  const products: SoftwareProduct[] = [
    ...wpProducts,
    ...customProducts,
    ...(clearedSections.products ? [] : PRODUCTS_DATA),
  ];

  const baseCourses: Course[] = [
    ...wpCourses,
    ...customCourses,
    ...(clearedSections.courses ? [] : COURSES_DATA),
  ];

  const courses: Course[] = baseCourses.map((c) => ({
    ...c,
    enrolled: enrolledIds.includes(c.id) || c.enrolled,
  }));

  const tools: AITool[] = [
    ...wpTools,
    ...customTools,
    ...AI_TOOLS_DATA,
  ];

  const articles: Article[] = [
    ...wpArticles,
    ...customArticles,
    ...(clearedSections.articles ? [] : ARTICLES_DATA),
  ];

  const activeAssignments: Assignment[] = wpRestUrl
    ? [
        ...assignments,
        ...(!clearedSections.ops && !wpUser?.assignments?.length
          ? ASSIGNMENTS_DATA.filter(
              (da) => !assignments.some((a) => a.id === da.id)
            )
          : []),
      ]
    : clearedSections.ops
    ? []
    : assignments;

  const activeTransactions: Transaction[] = wpRestUrl
    ? clearedSections.ops
      ? wpTransactions
      : [...wpTransactions, ...TRANSACTIONS_DATA]
    : clearedSections.ops
    ? []
    : TRANSACTIONS_DATA;

  const activeCourse =
    courses.find((c) => c.id === activeCourseId) || null;

  useEffect(() => {
    const root = document.documentElement;
    root.lang = lang;
    root.dir = lang === 'fa' ? 'rtl' : 'ltr';

    // Modern Light Mode & Dark Mode apply cleanly across both Public Website & LMS Panel
    root.classList.toggle('dark', theme === 'dark');

    const resolvedCustomFontName =
      siteConfig.customFontName.trim() || 'IramoCustomFont';
    const activeFontStack =
      siteConfig.fontFamily === 'custom'
        ? `'${resolvedCustomFontName}', 'IramoCustomFont', 'Vazirmatn', system-ui, sans-serif`
        : FONT_STACKS[siteConfig.fontFamily] || FONT_STACKS.vazirmatn;
    root.style.setProperty('--font-fa', activeFontStack);

    // Dynamically load custom @font-face stylesheet when custom font is selected
    const customFontLinkId = 'iramo-dynamic-custom-font-css';
    let customFontLink = document.getElementById(
      customFontLinkId
    ) as HTMLLinkElement | null;
    if (siteConfig.fontFamily === 'custom') {
      const pluginBase = wpRoot?.dataset.pluginUrl || '';
      const fallbackCssUrl = pluginBase
        ? `${pluginBase.replace(/\/$/, '')}/assets/fonts/custom-font.css`
        : '/fonts/custom-font.css';
      const resolvedCssUrl =
        (siteConfig.customFontCssUrl || '').trim() || fallbackCssUrl;
      if (!customFontLink) {
        customFontLink = document.createElement('link');
        customFontLink.id = customFontLinkId;
        customFontLink.rel = 'stylesheet';
        document.head.appendChild(customFontLink);
      }
      if (customFontLink.getAttribute('href') !== resolvedCssUrl) {
        customFontLink.setAttribute('href', resolvedCssUrl);
      }
    } else if (customFontLink) {
      customFontLink.remove();
    }

    // Apply 60-30-10 dynamic color theme tokens
    applyThemeColorVariables(siteConfig.themeColors, theme);

    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          lang,
          theme,
          enrolledIds,
          completedLessons,
          user: currentUser,
          siteConfig,
          clearedSections,
          customArticles,
          customCourses,
          customProducts,
          customTools,
        })
      );
    } catch {
      // Ignore storage errors
    }
  }, [
    lang,
    theme,
    enrolledIds,
    completedLessons,
    currentUser,
    siteConfig,
    clearedSections,
    customArticles,
    customCourses,
    customProducts,
    customTools,
  ]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const handleNavigatePage = (page: SitePage) => {
    if (page === 'lms' && !currentUser) {
      setAuthModalOpen(true);
      return;
    }
    setSitePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenCourseInPanel = (courseId: string) => {
    if (!currentUser) {
      setPendingCourseAfterAuth(courseId);
      setAuthModalOpen(true);
      return;
    }
    setSitePage('lms');
    setActiveSection('course');
    setActiveCourseId(courseId);
  };

  const postWpEndpoint = (
    endpoint: string,
    payload: Record<string, unknown>,
    nonceOverride?: string
  ) => {
    if (!wpRestUrl) return;
    const base = wpRestUrl.replace(/\/$/, '');
    const activeNonce = nonceOverride || wpNonce;
    fetch(`${base}/${endpoint.replace(/^\//, '')}`, {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
        ...(activeNonce ? { 'X-WP-Nonce': activeNonce } : {}),
      },
      body: JSON.stringify(payload),
    }).catch(() => {});
  };

  const handleLoginSuccess = (user: UserProfile) => {
    setCurrentUser(user);
    if (user.nonce) setWpNonce(user.nonce);
    if (Array.isArray(user.enrolled)) setEnrolledIds(user.enrolled);
    if (Array.isArray(user.completed)) setCompletedLessons(user.completed);
    if (Array.isArray(user.transactions)) setWpTransactions(user.transactions);
    if (Array.isArray(user.assignments)) setAssignments(user.assignments);
    setSitePage('lms');
    setActiveSection('course');
    if (pendingCourseAfterAuth) {
      setActiveCourseId(pendingCourseAfterAuth);
      setPendingCourseAfterAuth(null);
    }
  };

  const handleLogout = () => {
    if (wpRestUrl) {
      postWpEndpoint('auth/logout', {});
    }
    setCurrentUser(null);
    setActiveCourseId(null);
    setSitePage('home');
  };

  const handleToggleLessonComplete = (lessonId: string) => {
    const willComplete = !completedLessons.includes(lessonId);
    setCompletedLessons((prev) =>
      willComplete
        ? [...prev, lessonId]
        : prev.filter((id) => id !== lessonId)
    );
    postWpEndpoint('progress', {
      lesson_id: lessonId,
      completed: willComplete,
    });
  };

  const handleEnrollCourse = (courseId: string) => {
    setEnrolledIds((prev) =>
      prev.includes(courseId) ? prev : [...prev, courseId]
    );
    postWpEndpoint('enroll', { course_id: courseId });
  };

  const handleSubmitAssignment = (assignmentId: string, url: string) => {
    setAssignments((prev) =>
      prev.map((a) =>
        a.id === assignmentId
          ? { ...a, status: 'submitted', submittedUrl: url }
          : a
      )
    );
    postWpEndpoint('assignments/submit', {
      assignment_id: assignmentId,
      url,
    });
  };

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleUpdateSiteConfig = (nextCfg: SiteConfig) => {
    setSiteConfig(nextCfg);
    if (wpRestUrl && currentUser?.isAdmin) {
      postWpEndpoint('admin/settings', nextCfg as unknown as Record<string, unknown>);
    }
  };

  const handleClearDemoSection = (
    section: 'all' | 'products' | 'courses' | 'tools' | 'articles' | 'ops'
  ) => {
    if (section === 'all') {
      setClearedSections({
        products: true,
        courses: true,
        articles: true,
        ops: true,
      });
      setSiteConfig((prev) => ({
        ...prev,
        quickTips: prev.quickTips.filter((t) => !t.isDemo),
      }));
      setActiveCourseId(null);
      if (wpRestUrl && currentUser?.isAdmin) {
        postWpEndpoint('admin/settings', { demoCleared: true });
      }
    } else if (section !== 'tools') {
      setClearedSections((prev) => ({ ...prev, [section]: true }));
      if (section === 'articles') {
        setSiteConfig((prev) => ({
          ...prev,
          quickTips: prev.quickTips.filter((t) => !t.isDemo),
        }));
      }
    }
  };

  const handleRestoreDemoData = () => {
    setClearedSections({});
    setSiteConfig((prev) => {
      const existingIds = new Set(prev.quickTips.map((t) => t.id));
      const missingDemos = DEFAULT_QUICK_TIPS.filter((t) => !existingIds.has(t.id));
      return {
        ...prev,
        quickTips: [...missingDemos, ...prev.quickTips],
      };
    });
    if (wpRestUrl && currentUser?.isAdmin) {
      postWpEndpoint('admin/settings', { demoCleared: false });
    }
  };

  const handleAddCustomArticle = (article: Article) => {
    setCustomArticles((prev) => [article, ...prev]);
  };

  const handleAddCustomCourse = (course: Course) => {
    setCustomCourses((prev) => [course, ...prev]);
    setEnrolledIds((prev) => [...prev, course.id]);
  };

  const handleAddCustomProduct = (product: SoftwareProduct) => {
    setCustomProducts((prev) => [product, ...prev]);
  };

  const handleAddCustomTool = (tool: AITool) => {
    setCustomTools((prev) => [tool, ...prev]);
  };

  const latestEnrolledCourses = courses.filter((c) => c.enrolled);

  // Render Public iRamoAi Website (Modern Light & Dark Modes supported)
  if (sitePage !== 'lms' || !currentUser) {
    return (
      <>
        <WebsiteShell
          lang={lang}
          theme={theme}
          onToggleLang={() => setLang((l) => (l === 'fa' ? 'en' : 'fa'))}
          onToggleTheme={() =>
            setTheme((t) => (t === 'light' ? 'dark' : 'light'))
          }
          activePage={sitePage}
          onNavigate={handleNavigatePage}
          currentUser={currentUser}
          onOpenAuth={() => setAuthModalOpen(true)}
          siteConfig={siteConfig}
          wpRestUrl={wpRestUrl}
        >
          {sitePage === 'home' && (
            <WebsiteHomeView
              lang={lang}
              brandTitle={siteConfig.brandTitle}
              products={products}
              courses={courses}
              onNavigate={handleNavigatePage}
              onOpenMarketplaceWithFilter={(query, task) => {
                setMarketplaceInit({ query, task });
                handleNavigatePage('ai-marketplace');
              }}
              onOpenProductDemo={(prodId) => {
                setSelectedProductId(prodId);
                handleNavigatePage('products');
              }}
            />
          )}

          {sitePage === 'products' && (
            <ProductsDemoView
              lang={lang}
              products={products}
              courses={courses}
              selectedProductId={selectedProductId}
              onSelectProduct={setSelectedProductId}
              onOpenCourseInPanel={handleOpenCourseInPanel}
            />
          )}

          {sitePage === 'ai-marketplace' && (
            <div className="max-w-[1460px] mx-auto px-4 sm:px-6 py-10">
              <AIToolsView
                key={`${marketplaceInit.query}-${marketplaceInit.task}`}
                lang={lang}
                tools={tools}
                initialQuery={marketplaceInit.query}
                initialTask={marketplaceInit.task}
              />
            </div>
          )}

          {sitePage === 'courses' && (
            <PublicCoursesView
              lang={lang}
              courses={courses}
              onOpenCourseInPanel={handleOpenCourseInPanel}
              onEnterPanel={() => handleNavigatePage('lms')}
            />
          )}

          {sitePage === 'articles' && (
            <ArticlesView
              lang={lang}
              articles={articles}
              quickTips={siteConfig.quickTips}
              featuredProduct={products[0] || null}
              authChannels={siteConfig.authChannels}
              wpRestUrl={wpRestUrl}
              onOpenCourseInPanel={handleOpenCourseInPanel}
              onNavigateToProducts={() => handleNavigatePage('products')}
            />
          )}

          {sitePage === 'services' && (
            <ServicesConsultationView lang={lang} wpRestUrl={wpRestUrl} />
          )}
        </WebsiteShell>

        <AuthModal
          open={authModalOpen}
          onClose={() => {
            setAuthModalOpen(false);
            setPendingCourseAfterAuth(null);
          }}
          lang={lang}
          brandTitle={siteConfig.brandTitle}
          authChannels={siteConfig.authChannels}
          wpRestUrl={wpRestUrl}
          wpNonce={wpNonce}
          onLoginSuccess={handleLoginSuccess}
        />

        <CommandPalette
          open={searchOpen}
          onClose={() => setSearchOpen(false)}
          lang={lang}
          courses={courses}
          tools={tools}
          onSelectCourse={(c) => handleOpenCourseInPanel(c.id)}
          onSelectTool={() => handleNavigatePage('ai-marketplace')}
        />
      </>
    );
  }

  // Render Authenticated User Dashboard
  return (
    <div className="min-h-screen lg:h-screen lg:overflow-hidden flex bg-[#F8FAFC] dark:bg-[#050C0A] text-slate-900 dark:text-slate-100 transition-colors duration-200">
      <Sidebar
        lang={lang}
        theme={theme}
        currentUser={currentUser}
        activeSection={activeSection}
        onSelectSection={setActiveSection}
        latestCourses={latestEnrolledCourses}
        onOpenCourse={(c) => setActiveCourseId(c.id)}
        onOpenStudyPlanner={() => setStudyPlannerOpen(true)}
        onBackToWebsite={() => handleNavigatePage('home')}
        onLogout={handleLogout}
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
        completedLessons={completedLessons}
      />

      <div className="flex-1 flex flex-col min-w-0 lg:h-screen lg:overflow-hidden">
        <TopBar
          lang={lang}
          theme={theme}
          activeSection={activeSection}
          onToggleLang={() => setLang((l) => (l === 'fa' ? 'en' : 'fa'))}
          onToggleTheme={() =>
            setTheme((t) => (t === 'light' ? 'dark' : 'light'))
          }
          onOpenSearch={() => setSearchOpen(true)}
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
          notifications={notifications}
          onMarkAllRead={handleMarkAllRead}
        />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="max-w-[1460px] mx-auto">
            {activeSection === 'home' && (
              <HomeDashboardView
                lang={lang}
                currentUser={currentUser}
                courses={courses}
                completedLessons={completedLessons}
                transactions={activeTransactions}
                onOpenCourse={(c) => setActiveCourseId(c.id)}
                onNavigate={setActiveSection}
              />
            )}

            {activeSection === 'course' && (
              <CourseLibraryView
                lang={lang}
                courses={courses}
                completedLessons={completedLessons}
                onOpenCourse={(c) => setActiveCourseId(c.id)}
                onEnrollCourse={handleEnrollCourse}
                onGoToWpExport={() => setActiveSection('wp-export')}
              />
            )}

            {activeSection === 'ai-tools' && (
              <AIToolsView lang={lang} tools={tools} />
            )}

            {activeSection === 'assignments' && (
              <AssignmentsView
                lang={lang}
                assignments={activeAssignments}
                courses={courses}
                onSubmitAssignment={handleSubmitAssignment}
              />
            )}

            {activeSection === 'bot-connect' && (
              <BotConnectView
                lang={lang}
                telegramBotUsername={siteConfig.authChannels.telegramBotUsername}
                baleBotUsername={siteConfig.authChannels.baleBotUsername}
                initialTelegramId={currentUser.telegramId}
                initialBalePhone={currentUser.balePhone}
                initialPrefs={currentUser.botPrefs}
                wpRestUrl={wpRestUrl}
                wpNonce={wpNonce}
                onUpdateBotBinding={(data) =>
                  setCurrentUser((prev) => (prev ? { ...prev, ...data } : prev))
                }
              />
            )}

            {activeSection === 'transactions' && (
              <TransactionsView lang={lang} transactions={activeTransactions} />
            )}

            {activeSection === 'content-manager' && (
              <ContentManagerView
                lang={lang}
                siteConfig={siteConfig}
                onUpdateSiteConfig={handleUpdateSiteConfig}
                products={products}
                courses={courses}
                tools={tools}
                articles={articles}
                onClearDemoSection={handleClearDemoSection}
                onRestoreDemoData={handleRestoreDemoData}
                onAddCustomArticle={handleAddCustomArticle}
                onAddCustomCourse={handleAddCustomCourse}
                onAddCustomProduct={handleAddCustomProduct}
                onAddCustomTool={handleAddCustomTool}
              />
            )}

            {activeSection === 'wp-export' && (
              <WordPressExportView lang={lang} />
            )}
          </div>
        </main>
      </div>

      <CommandPalette
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        lang={lang}
        courses={courses}
        tools={tools}
        onSelectCourse={(c) => setActiveCourseId(c.id)}
        onSelectTool={() => setActiveSection('ai-tools')}
      />

      <CoursePlayerModal
        course={activeCourse}
        lang={lang}
        completedLessons={completedLessons}
        onToggleLessonComplete={handleToggleLessonComplete}
        onEnrollCourse={handleEnrollCourse}
        onClose={() => setActiveCourseId(null)}
      />

      <StudyPlannerModal
        open={studyPlannerOpen}
        onClose={() => setStudyPlannerOpen(false)}
        lang={lang}
        courses={courses}
        completedLessons={completedLessons}
        assignments={activeAssignments}
        onOpenCourse={(c) => setActiveCourseId(c.id)}
      />
    </div>
  );
}
