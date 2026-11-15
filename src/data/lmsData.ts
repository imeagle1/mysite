import {
  courseAiImg,
  courseBotImg,
  courseHesabyarImg,
  courseVideomiImg,
  heroDeskImg,
  servicesNeuralImg,
} from '../assets/media';
import {
  AICategoryMeta,
  AITool,
  Assignment,
  BiText,
  Course,
  NotificationItem,
  Transaction,
} from '../types/lms';

export interface SoftwareProduct {
  id: string;
  slug: string;
  name: BiText;
  category: BiText;
  tagline: BiText;
  description: BiText;
  accent: 'emerald' | 'blue' | 'amber' | 'indigo';
  thumbnail: string;
  priceToman: number;
  priceUsd: number;
  billingLabel: BiText;
  highlights: { fa: string[]; en: string[] };
  demoMetrics: { label: BiText; value: { fa: string; en: string } }[];
  linkedCourseId?: string;
}

export const PRODUCTS_DATA: SoftwareProduct[] = [
  {
    id: 'prod-ai-suite',
    slug: 'ai-tools-suite',
    name: { fa: 'مجموعه ابزارهای AI', en: 'iRamo AI Tools Suite' },
    category: { fa: 'بهره وری و هوش مصنوعی', en: 'AI Productivity' },
    tagline: {
      fa: 'دسترسی یکجا به ابزارهای کدنویسی، پرامپت و اتوماسیون هوشمند',
      en: 'Curated workflow tools for prompt architecture, audio & analytics.',
    },
    description: {
      fa: 'دسترسی متمرکز به ابزارهای پرکاربرد روزانه بدون نیاز به اشتراک‌های متعدد دلاری، با رابط کاربری فارسی و انگلیسی و پرامپت‌های آماده.',
      en: 'Unified access to specialized AI productivity tools organized by task, input format, and desired output.',
    },
    accent: 'amber',
    thumbnail: courseAiImg,
    priceToman: 1450000,
    priceUsd: 32,
    billingLabel: { fa: 'دسترسی کامل دایرکتوری', en: 'Full Suite Access' },
    highlights: {
      fa: [
        'موتور پیشنهادگر ابزار بر اساس نیاز کاربر (مشابه topai.tools)',
        'ابزار تبدیل ویس جلسات فارسی به جزوه آموزشی',
        'معمار پرامپت برای دریافت خروجی JSON بدون خطا',
      ],
      en: [
        'Task, Input, and Output live filtering engine',
        'Persian/English lecture transcription & study summaries',
        'Deterministic JSON prompt blueprint generator',
      ],
    },
    demoMetrics: [
      { label: { fa: 'ابزارهای فعال', en: 'Active Tools' }, value: { fa: '۲۴+ ابزار', en: '24+ Tools' } },
      { label: { fa: 'مسیرهای کاری', en: 'Workflows' }, value: { fa: '۵ دسته', en: '5 Tracks' } },
      { label: { fa: 'شورتکد وردپرس', en: 'WP Shortcode' }, value: { fa: 'آماده نصب', en: 'Ready' } },
    ],
    linkedCourseId: 'ai-mastery-zero-to-pro',
  },
  {
    id: 'prod-edu-bot',
    slug: 'edu-bot',
    name: { fa: 'ربات آموزشی تلگرام و بله', en: 'iRamo Academy Bot' },
    category: { fa: 'ربات‌سازی و ووکامرس', en: 'Bots & Commerce' },
    tagline: {
      fa: 'مدیریت هوشمند دوره‌ها، تحویل لایسنس و ورود دو مرحله‌ای (OTP)',
      en: 'Automated course delivery, license dispatch & bot OTP login.',
    },
    description: {
      fa: 'پلاگین و ربات اختصاصی برای سایت‌های وردپرسی که بلافاصله بعد از خرید در ووکامرس، لینک دانلود، کلید لایسنس و دعوت‌نامه کانال دوره را در تلگرام و بله ارسال می‌کند.',
      en: 'Connects directly to WordPress WooCommerce to deliver course access, license keys, and zero-cost OTP codes via Telegram and Bale.',
    },
    accent: 'blue',
    thumbnail: courseBotImg,
    priceToman: 2290000,
    priceUsd: 49,
    billingLabel: { fa: 'پرداخت یک‌باره + سورس PHP', en: 'One-Time License' },
    highlights: {
      fa: [
        'پشتیبانی همزمان از api.telegram.org و tapi.bale.ai',
        'احراز هویت دو مرحله‌ای بدون هزینه پیامک',
        'ارسال فوری فرم‌های مشاوره المنتور پرو به ادمین',
      ],
      en: [
        'Unified Telegram & Bale Bot API client',
        'Zero-cost two-factor OTP authentication',
        'Instant Elementor Pro form lead alerts with inline buttons',
      ],
    },
    demoMetrics: [
      { label: { fa: 'سرعت تحویل', en: 'Order Dispatch' }, value: { fa: 'زیر ۲ ثانیه', en: '< 1.5s' } },
      { label: { fa: 'پیام‌رسان‌ها', en: 'Messengers' }, value: { fa: 'تلگرام و بله', en: 'Telegram + Bale' } },
      { label: { fa: 'سازگاری', en: 'Compatibility' }, value: { fa: 'وردپرس و ووکامرس', en: 'WP 6.x / Woo' } },
    ],
    linkedCourseId: 'telegram-bale-bot-engineering',
  },
  {
    id: 'prod-hesabyar',
    slug: 'hesabyar',
    name: { fa: 'حسابیار هوشمند', en: 'Hesabyar Smart Finance' },
    category: { fa: 'مالی و اتوماسیون', en: 'FinTech & Automation' },
    tagline: {
      fa: 'ربات هوشمند مالی و حسابداری روزانه متصل به تلگرام و بله',
      en: 'AI bookkeeping bot & financial ledger synced with Telegram & Bale.',
    },
    description: {
      fa: 'فیش‌های بانکی و فاکتورها را برای ربات ارسال کنید تا به‌صورت خودکار در ترازنامه دسته‌بندی شوند، سود و زیان ماهانه محاسبه شود و خروجی اکسل آماده دریافت کنید.',
      en: 'Forward payment receipts to your bot for automatic OCR categorization, cashflow analytics, and accountant-ready Excel exports.',
    },
    accent: 'emerald',
    thumbnail: courseHesabyarImg,
    priceToman: 2800000,
    priceUsd: 64,
    billingLabel: { fa: 'لایسنس سالانه + پشتیبانی', en: 'Annual Pro License' },
    highlights: {
      fa: [
        'استخراج خودکار مبلغ، تاریخ و شماره پیگیری از عکس فیش',
        'ارسال گزارش تراز روزانه هر شب در تلگرام و بله',
        'همگام‌سازی مستقیم با سفارش‌های ووکامرس',
      ],
      en: [
        'Instant receipt OCR parsing for amounts and references',
        'Automated nightly P&L summaries in Telegram & Bale',
        'Direct WooCommerce order revenue synchronization',
      ],
    },
    demoMetrics: [
      { label: { fa: 'دقت استخراج فیش', en: 'Receipt OCR Accuracy' }, value: { fa: '۹۸٫۴٪', en: '98.4%' } },
      { label: { fa: 'زمان ثبت تراکنش', en: 'Entry Latency' }, value: { fa: '۲٫۱ ثانیه', en: '2.1s' } },
      { label: { fa: 'خروجی گزارش', en: 'Export Formats' }, value: { fa: 'اکسل و پی‌دی‌اف', en: 'XLSX / PDF' } },
    ],
    linkedCourseId: 'hesabyar-smart-finance',
  },
  {
    id: 'prod-videomi',
    slug: 'videomi-ai',
    name: { fa: 'استودیو Videomi AI', en: 'Videomi AI Studio' },
    category: { fa: 'تولید محتوای ویدیویی', en: 'Video AI' },
    tagline: {
      fa: 'تولید ویدیوهای آموزشی، دوبله دوزبانه و زیرنویس خودکار',
      en: 'Automated instructional video creation, voice dubbing & captions.',
    },
    description: {
      fa: 'متن درس یا مقاله خود را وارد کنید و خروجی ویدیویی با اسلایدهای پویا، صداگذاری طبیعی و زیرنویس فارسی/انگلیسی تحویل بگیرید.',
      en: 'Turn lesson scripts into polished educational videos with studio narration and stylized bilingual captions.',
    },
    accent: 'indigo',
    thumbnail: courseVideomiImg,
    priceToman: 1890000,
    priceUsd: 42,
    billingLabel: { fa: 'اشتراک ۶ ماهه استودیو', en: '6-Month Studio Plan' },
    highlights: {
      fa: [
        'زیرنویس هوشمند دوزبانه فارسی و انگلیسی با همگام‌سازی دقیق',
        'تبدیل ویدیوهای طولانی دوره به کلیپ‌های معرفی ۹:۱۶',
        'بهینه‌سازی حجم خروجی برای پخش سریع در پنل آموزشی',
      ],
      en: [
        'Frame-accurate bilingual Persian & English captions',
        'Auto-repurposing long lectures into 9:16 social teasers',
        'Web-optimized MP4 encoding for fast streaming',
      ],
    },
    demoMetrics: [
      { label: { fa: 'نسبت تصویر', en: 'Aspect Ratios' }, value: { fa: '۱۶:۹ و ۹:۱۶', en: '16:9 / 9:16' } },
      { label: { fa: 'کاهش حجم', en: 'Compression' }, value: { fa: '۶۲٪ کمتر', en: '-62%' } },
      { label: { fa: 'زیرنویس', en: 'Caption Langs' }, value: { fa: 'فارسی و انگلیسی', en: 'FA / EN' } },
    ],
    linkedCourseId: 'videomi-ai-production',
  },
];

export const COURSES_DATA: Course[] = [
  {
    id: 'ai-mastery-zero-to-pro',
    slug: 'ai-mastery',
    title: {
      fa: 'دوره جامع هوش مصنوعی از صفر تا پیشرفته',
      en: 'AI-Powered Systems & Engineering Mastery',
    },
    subtitle: {
      fa: 'مبانی، مهندسی پرامپت و ساخت ایجنت‌های واقعی کسب‌وکار',
      en: 'From core foundations to production AI workflows and agents.',
    },
    description: {
      fa: 'در این دوره گام‌به‌گام با معماری مدل‌های زبانی، اتصال API به وب‌سایت و ساخت جریان‌های خودکار بدون نیاز به دانش پیچیده ریاضی آشنا می‌شوید.',
      en: 'Master prompt engineering, API orchestration, and real-world business automation pipelines with hands-on projects.',
    },
    category: 'AI',
    format: 'Video',
    durationTier: 'long',
    totalDuration: { fa: '۱۲ ساعت و ۳۰ دقیقه', en: '12h 30m' },
    lessonCount: 6,
    moduleCount: 2,
    enrolled: true,
    featured: true,
    isNew: true,
    accentColor: 'amber',
    thumbnail: courseAiImg,
    instructor: { fa: 'امیرحسین رامو · مهندس هوش مصنوعی', en: 'Amirhossein Ramo · AI Architect' },
    priceToman: 3450000,
    priceUsd: 79,
    modules: [
      {
        id: 'm1',
        title: {
          fa: 'فصل اول: معماری پرامپت و کار با مدل‌های زبانی',
          en: 'Module 1: Prompt Architecture & LLM Foundations',
        },
        lessons: [
          {
            id: 'ai-l1',
            title: {
              fa: '۱. شناخت ساختار توکن‌ها و مهندسی سیستم پرامپت',
              en: '1. Token Mechanics & System Prompt Engineering',
            },
            duration: '24:15',
            durationMinutes: 24,
            type: 'video',
            isFreePreview: true,
            summary: {
              fa: 'نحوه طراحی دستور سیستمی استاندارد برای دریافت خروجی ساختاریافته و فارسی دقیق بدون خطا.',
              en: 'How to structure deterministic system prompts for clean JSON and multilingual output.',
            },
            keyTakeaways: {
              fa: [
                'تفکیک دستور سیستمی از ورودی کاربر برای امنیت بالا',
                'تنظیم دقیق پارامترها برای خروجی‌های تحلیلی و سازمانی',
                'الگوی سه‌بخشی نقش، محدودیت و فرمت خروجی',
              ],
              en: [
                'Separating system constraints from user inputs reliably',
                'Tuning temperature for analytical vs creative workflows',
                'Structuring schema-safe JSON responses',
              ],
            },
            codeSnippet: `const systemPrompt = {\n  role: "iRamo Financial Analyst",\n  outputFormat: "strict_json",\n  language: "fa-IR"\n};`,
            attachmentName: 'prompt-blueprints-v1.pdf',
          },
          {
            id: 'ai-l2',
            title: {
              fa: '۲. اتصال هوش مصنوعی به وب‌سایت و وردپرس با API',
              en: '2. Connecting AI Endpoints to WordPress via REST API',
            },
            duration: '38:40',
            durationMinutes: 39,
            type: 'lab',
            summary: {
              fa: 'پیاده‌سازی یک مسیر امن در PHP وردپرس برای فراخوانی مدل‌های هوش مصنوعی بدون افشای کلید دسترسی.',
              en: 'Building a secure server-side WordPress REST proxy so API keys remain protected.',
            },
            keyTakeaways: {
              fa: [
                'استفاده از register_rest_route در وردپرس',
                'بررسی دسترسی کاربر و امنیت درخواست‌ها',
                'کش کردن پاسخ‌ها برای کاهش هزینه سرور',
              ],
              en: [
                'Using register_rest_route safely in custom plugins',
                'Nonce & capability checks for logged-in students',
                'Response caching with WordPress Transients',
              ],
            },
            codeSnippet: `add_action('rest_api_init', function () {\n  register_rest_route('iramo/v1', '/assist', [\n    'methods' => 'POST',\n    'callback' => 'iramo_handle_ai_request',\n    'permission_callback' => fn() => is_user_logged_in()\n  ]);\n});`,
            attachmentName: 'wp-ai-proxy-starter.php',
          },
          {
            id: 'ai-l3',
            title: {
              fa: '۳. طراحی پایگاه دانش اختصاصی برای پشتیبانی مشتریان',
              en: '3. Building a Custom Knowledge Base (RAG) Support Agent',
            },
            duration: '45:10',
            durationMinutes: 45,
            type: 'video',
            summary: {
              fa: 'آموزش تبدیل فایل‌های پی‌دی‌اف، سرفصل دوره‌ها و مستندات حسابیار به پایگاه دانش جستجوپذیر.',
              en: 'Chunking course docs and product manuals into searchable semantic vectors.',
            },
            keyTakeaways: {
              fa: [
                'تقسیم‌بندی هوشمند اسناد فارسی',
                'جستجوی ترکیبی کلیدواژه و معنایی',
                'کاهش خطای مدل با ارجاع مستقیم به منبع',
              ],
              en: [
                'Bilingual semantic chunking strategies',
                'Hybrid keyword + embedding retrieval',
                'Source citation grounding',
              ],
            },
          },
        ],
      },
      {
        id: 'm2',
        title: {
          fa: 'فصل دوم: اتوماسیون و ایجنت‌های عملیاتی',
          en: 'Module 2: Production Agents & Workflow Automation',
        },
        lessons: [
          {
            id: 'ai-l4',
            title: {
              fa: '۴. طراحی ایجنت چندمرحله‌ای برای تحلیل سفارش‌های فروشگاه',
              en: '4. Multi-Step Agent for Order & Lead Triage',
            },
            duration: '32:00',
            durationMinutes: 32,
            type: 'video',
            summary: {
              fa: 'ایجاد جریان خودکار بررسی فرم مشاوره و دسته‌بندی خودکار پروژه برای تیم فنی.',
              en: 'Automating lead qualification and project scoping with structured tool calls.',
            },
            keyTakeaways: {
              fa: [
                'اتصال ابزارها به دیتابیس فروشگاه',
                'مدیریت خطا در درخواست‌های طولانی',
                'ارسال خلاصه مدیریتی به تلگرام و بله',
              ],
              en: [
                'Defining deterministic tool schemas',
                'Retry and fallback patterns',
                'Instant team notifications via Bot API',
              ],
            },
          },
          {
            id: 'ai-l5',
            title: {
              fa: '۵. کارگاه عملی: ساخت دستیار هوشمند داخل پنل کاربری',
              en: '5. Lab: Embedding an Interactive Study Assistant',
            },
            duration: '29:45',
            durationMinutes: 30,
            type: 'lab',
            summary: {
              fa: 'طراحی رابط کاربری مدرن راهنمای درسی با ری‌اکت و شورتکد اختصاصی وردپرس.',
              en: 'Building a responsive study companion drawer with clean UX.',
            },
            keyTakeaways: {
              fa: [
                'طراحی پنل واکنش‌گرا در موبایل و دسکتاپ',
                'ذخیره تاریخچه گفتگو در دیتابیس وردپرس',
                'بهینه‌سازی سرعت رندر پیام‌ها',
              ],
              en: [
                'Responsive drawer patterns',
                'Persisting student session history',
                'Streaming UI responsiveness',
              ],
            },
          },
          {
            id: 'ai-l6',
            title: {
              fa: '۶. پروژه نهایی و استقرار روی هاست وردپرس',
              en: '6. Capstone Deployment on WordPress Hosting',
            },
            duration: '26:20',
            durationMinutes: 26,
            type: 'reading',
            summary: {
              fa: 'چک‌لیست نهایی امنیت، کش، بهینه‌سازی سرعت لود و اتصال به دامنه‌های تولیدی.',
              en: 'Production security checklist, asset bundling, and hosting cache tuning.',
            },
            keyTakeaways: {
              fa: [
                'تنظیم هدرهای امنیتی و محدودیت درخواست',
                'هماهنگی با افزونه‌های کش بدون تداخل با پنل کاربری',
              ],
              en: [
                'Rate limiting REST endpoints',
                'Cache exclusion rules for user dashboards',
              ],
            },
          },
        ],
      },
    ],
  },
  {
    id: 'telegram-bale-bot-engineering',
    slug: 'telegram-bale-bots',
    title: {
      fa: 'مهندسی ربات‌های هوشمند تلگرام و بله متصل به وردپرس',
      en: 'Telegram & Bale Bot Architecture for WordPress',
    },
    subtitle: {
      fa: 'تحویل خودکار دوره، ورود با کد تایید و همگام‌سازی ووکامرس',
      en: 'Automated course delivery, OTP login, and WooCommerce webhooks.',
    },
    description: {
      fa: 'یاد بگیرید چگونه یک پل ارتباطی مشترک بین تلگرام و پیام‌رسان بله بسازید تا بلافاصله پس از خرید در ووکامرس، لایسنس و لینک کلاس برای کاربر ارسال شود.',
      en: 'Build a unified PHP webhook bridge supporting both api.telegram.org and tapi.bale.ai connected to WooCommerce.',
    },
    category: 'Bots',
    format: 'Workshop',
    durationTier: 'medium',
    totalDuration: { fa: '۵ ساعت و ۴۰ دقیقه', en: '5h 40m' },
    lessonCount: 4,
    moduleCount: 2,
    enrolled: true,
    featured: true,
    accentColor: 'blue',
    thumbnail: courseBotImg,
    instructor: { fa: 'مهدی کریمی · معماری ربات', en: 'Mehdi Karimi · Bot Architect' },
    priceToman: 2290000,
    priceUsd: 49,
    modules: [
      {
        id: 'bm1',
        title: {
          fa: 'فصل اول: معماری مشترک ربات تلگرام و بله',
          en: 'Module 1: Unified Telegram & Bale Bot API',
        },
        lessons: [
          {
            id: 'bot-l1',
            title: {
              fa: '۱. تنظیم وب‌هوک امن در هاست وردپرس و بله',
              en: '1. Configuring Secure Webhooks on WordPress Hosting',
            },
            duration: '28:10',
            durationMinutes: 28,
            type: 'video',
            isFreePreview: true,
            summary: {
              fa: 'تفاوت‌های ظریف پیام‌رسان بله و تلگرام و نحوه ساخت یک کلاینت مشترک.',
              en: 'Differences and shared patterns between Bale API and Telegram Bot API in PHP.',
            },
            keyTakeaways: {
              fa: [
                'ساختار مشترک ارسال پیام و دکمه‌های شیشه‌ای',
                'اعتبارسنجی توکن امنیتی وب‌هوک',
                'ثبت گزارش خطاها برای عیب‌یابی سریع',
              ],
              en: [
                'Shared sendMessage & inline keyboard wrappers',
                'Validating webhook secret headers',
                'Structured webhook diagnostics',
              ],
            },
            codeSnippet: `$endpoint = $platform === 'bale'\n  ? 'https://tapi.bale.ai/bot' . $token\n  : 'https://api.telegram.org/bot' . $token;`,
          },
          {
            id: 'bot-l2',
            title: {
              fa: '۲. اتصال به هوک‌های ووکامرس برای تحویل آنی دوره',
              en: '2. WooCommerce Order Hooks & Instant Delivery',
            },
            duration: '34:50',
            durationMinutes: 35,
            type: 'lab',
            summary: {
              fa: 'ارسال خودکار لینک دانلود نرم‌افزار حسابیار، لایسنس و دعوت‌نامه کانال خصوصی بلافاصله بعد از پرداخت موفق.',
              en: 'Triggering instant Telegram/Bale delivery when WooCommerce marks an order completed.',
            },
            keyTakeaways: {
              fa: [
                'استفاده از هوک تکمیل سفارش ووکامرس',
                'ساخت کلید لایسنس یکتا به ازای هر سفارش',
                'جلوگیری از ارسال تکراری پیام',
              ],
              en: [
                'Hooking into woocommerce_order_status_completed',
                'Generating unique per-order license keys',
                'Idempotency meta flags to avoid duplicate sends',
              ],
            },
          },
        ],
      },
      {
        id: 'bm2',
        title: {
          fa: 'فصل دوم: ورود دو مرحله‌ای و فرم مشاوره',
          en: 'Module 2: OTP Authentication & Consultation Alerts',
        },
        lessons: [
          {
            id: 'bot-l3',
            title: {
              fa: '۳. سیستم ارسال کد تایید از طریق ربات بله و تلگرام',
              en: '3. Bot-Based Two-Factor OTP Authentication',
            },
            duration: '25:15',
            durationMinutes: 25,
            type: 'video',
            summary: {
              fa: 'کاهش هزینه پیامک با ارسال کد ورود یک‌بارمصرف در ربات تلگرام یا بله کاربر.',
              en: 'Delivering zero-cost one-time login codes directly through user-linked bots.',
            },
            keyTakeaways: {
              fa: [
                'تولید کد ۵ رقمی با اعتبار ۵ دقیقه‌ای',
                'اتصال شناسه چت به پروفایل کاربر وردپرس',
              ],
              en: [
                'Generating 5-minute TTL transients in WordPress',
                'Linking Chat IDs to WP user meta securely',
              ],
            },
          },
          {
            id: 'bot-l4',
            title: {
              fa: '۴. ارسال هوشمند فرم سفارش پروژه با دکمه شیشه‌ای به ادمین',
              en: '4. Admin Lead Alerts with Inline Approval Buttons',
            },
            duration: '22:40',
            durationMinutes: 23,
            type: 'lab',
            summary: {
              fa: 'پاسخ سریع مدیر سایت به درخواست‌های مشاوره و ثبت پروژه مستقیماً از داخل ربات.',
              en: 'Handling callback_query actions from admin Telegram/Bale messages.',
            },
            keyTakeaways: {
              fa: [
                'مدیریت کلیک دکمه‌های شیشه‌ای در ربات',
                'به‌روزرسانی وضعیت درخواست در پیشخوان وردپرس',
              ],
              en: [
                'Handling callback_query payloads',
                'Updating WordPress CPT lead status remotely',
              ],
            },
          },
        ],
      },
    ],
  },
  {
    id: 'hesabyar-smart-finance',
    slug: 'hesabyar-automation',
    title: {
      fa: 'اتوماسیون مالی و مدیریت هوشمند کسب‌وکار با حسابیار',
      en: 'Hesabyar Financial Automation & AI Ledgers',
    },
    subtitle: {
      fa: 'گزارش‌گیری خودکار، صدور فاکتور و تحلیل جریان نقدینگی',
      en: 'Automated bookkeeping, smart invoicing, and cashflow analytics.',
    },
    description: {
      fa: 'راهنمای کامل راه‌اندازی و استفاده حرفه‌ای از ربات مالی حسابیار برای کسب‌وکارهای آنلاین، اتصال به اکسل و دریافت تراز روزانه در پیام‌رسان.',
      en: 'Deploy Hesabyar to track daily revenue, parse receipts with AI, and sync ledgers directly to your team dashboard.',
    },
    category: 'Finance',
    format: 'Project',
    durationTier: 'short',
    totalDuration: { fa: '۳ ساعت و ۱۵ دقیقه', en: '3h 15m' },
    lessonCount: 3,
    moduleCount: 1,
    enrolled: true,
    featured: true,
    accentColor: 'emerald',
    thumbnail: courseHesabyarImg,
    instructor: { fa: 'سارا محمدی · تحلیلگر مالی', en: 'Sara Mohammadi · FinTech Lead' },
    priceToman: 1650000,
    priceUsd: 35,
    modules: [
      {
        id: 'hm1',
        title: {
          fa: 'فصل اول: راه‌اندازی و اتوماسیون حسابیار',
          en: 'Module 1: Hesabyar Setup & Automated Ledgers',
        },
        lessons: [
          {
            id: 'hes-l1',
            title: {
              fa: '۱. نصب و فعال‌سازی لایسنس حسابیار روی سیستم و ربات',
              en: '1. Installing & Activating Your Hesabyar License',
            },
            duration: '18:20',
            durationMinutes: 18,
            type: 'video',
            isFreePreview: true,
            summary: {
              fa: 'معرفی معماری حسابیار، تعریف دسته‌بندی هزینه‌ها و اتصال حساب کاربری.',
              en: 'Setting up expense categories and connecting your Hesabyar workspace.',
            },
            keyTakeaways: {
              fa: [
                'مدیریت کلید لایسنس در پنل کاربری iRamo',
                'تعریف سرفصل‌های درآمد و هزینه استاندارد',
              ],
              en: [
                'Managing license keys from the iRamo dashboard',
                'Configuring standard revenue & expense accounts',
              ],
            },
          },
          {
            id: 'hes-l2',
            title: {
              fa: '۲. ثبت خودکار فاکتور از روی عکس فیش با هوش مصنوعی',
              en: '2. AI Receipt Parsing & Automated Ledger Entry',
            },
            duration: '27:40',
            durationMinutes: 28,
            type: 'lab',
            summary: {
              fa: 'تبدیل تصاویر فیش واریزی و رسیدهای بانکی به ردیف حسابداری دقیق در کمتر از ۳ ثانیه.',
              en: 'Extracting amounts, dates, and vendor names from receipt images.',
            },
            keyTakeaways: {
              fa: [
                'پاک‌سازی تصویر و استخراج اعداد فارسی و انگلیسی',
                'تطبیق خودکار با موجودی صندوق',
              ],
              en: [
                'OCR normalization for bilingual numerals',
                'Automated ledger reconciliation',
              ],
            },
          },
          {
            id: 'hes-l3',
            title: {
              fa: '۳. گزارش سود و زیان ماهانه و هشدار نقدینگی',
              en: '3. Monthly P&L Dashboards & Cashflow Alerts',
            },
            duration: '21:10',
            durationMinutes: 21,
            type: 'video',
            summary: {
              fa: 'ساخت داشبورد مدیریتی و ارسال خلاصه مالی پایان شب در تلگرام و بله.',
              en: 'Generating executive P&L summaries and scheduled Messenger digests.',
            },
            keyTakeaways: {
              fa: [
                'خروجی استاندارد اکسل و پی‌دی‌اف برای حسابدار',
                'تنظیم هشدار سررسید چک‌ها و اقساط',
              ],
              en: [
                'Standard Excel & PDF accountant exports',
                'Automated due-date reminders',
              ],
            },
          },
        ],
      },
    ],
  },
  {
    id: 'videomi-ai-production',
    slug: 'videomi-ai',
    title: {
      fa: 'تولید محتوای ویدیویی هوشمند با استودیو ویدیومی',
      en: 'Videomi AI: Automated Video Production Studio',
    },
    subtitle: {
      fa: 'از ایده و سناریو تا تدوین، دوبله و زیرنویس خودکار',
      en: 'From scriptwriting to AI avatars, dubbing, and dynamic captions.',
    },
    description: {
      fa: 'مسیر کامل تولید ویدیوهای آموزشی و تبلیغاتی با ابزارهای نسل جدید هوش مصنوعی بدون نیاز به دوربین و استودیو.',
      en: 'Create studio-grade educational and marketing videos using generative media pipelines.',
    },
    category: 'Video',
    format: 'Video',
    durationTier: 'medium',
    totalDuration: { fa: '۴ ساعت و ۵۰ دقیقه', en: '4h 50m' },
    lessonCount: 3,
    moduleCount: 1,
    enrolled: false,
    featured: false,
    isNew: true,
    accentColor: 'indigo',
    thumbnail: courseVideomiImg,
    instructor: { fa: 'آرمان شریفی · کارگردان دیجیتال', en: 'Arman Sharifi · Creative Director' },
    priceToman: 1890000,
    priceUsd: 42,
    modules: [
      {
        id: 'vm1',
        title: {
          fa: 'فصل اول: کارگردانی و تولید ویدیوی هوش مصنوعی',
          en: 'Module 1: AI Storyboarding & Video Pipelines',
        },
        lessons: [
          {
            id: 'vid-l1',
            title: {
              fa: '۱. سناریونویسی قلاب‌دار و ساخت استوری‌بورد سینمایی',
              en: '1. Hook Scripting & Visual Storyboarding',
            },
            duration: '22:00',
            durationMinutes: 22,
            type: 'video',
            isFreePreview: true,
            summary: {
              fa: 'طراحی سناریوهای ۳ ثانیه اول برای نرخ ماندگاری بالای مخاطب در شبکه‌های اجتماعی.',
              en: 'Crafting high-retention 3-second visual hooks for educational video.',
            },
            keyTakeaways: {
              fa: [
                'فرمول ۴ مرحله‌ای سناریوی آموزشی',
                'تولید پرامپت دقیق برای صحنه‌های پیوسته',
              ],
              en: [
                '4-step educational video script blueprint',
                'Consistent character & scene prompting',
              ],
            },
          },
          {
            id: 'vid-l2',
            title: {
              fa: '۲. کلون صدا و همگام‌سازی لب دوزبانه',
              en: '2. Bilingual Voice Cloning & Lip-Sync Dubbing',
            },
            duration: '31:15',
            durationMinutes: 31,
            type: 'lab',
            summary: {
              fa: 'تبدیل دوره‌های فارسی به انگلیسی با حفظ لحن طبیعی مدرس.',
              en: 'Translating and dubbing instructional videos while preserving voice timbre.',
            },
            keyTakeaways: {
              fa: [
                'تنظیم تنفس و مکث طبیعی در صداگذاری هوشمند',
                'ساخت زیرنویس داینامیک فارسی و انگلیسی',
              ],
              en: [
                'Natural pacing and cadence tuning',
                'Bilingual stylized caption generation',
              ],
            },
          },
          {
            id: 'vid-l3',
            title: {
              fa: '۳. اتوماسیون انتشار ویدیو در شبکه‌های اجتماعی',
              en: '3. Automated Multi-Channel Publishing',
            },
            duration: '19:40',
            durationMinutes: 20,
            type: 'video',
            summary: {
              fa: 'خروجی گرفتن با نسبت‌های ۹:۱۶ و ۱۶:۹ و زمان‌بندی خودکار انتشار.',
              en: 'Batch exporting 9:16 and 16:9 cuts with scheduled distribution.',
            },
            keyTakeaways: {
              fa: [
                'فشرده‌سازی بدون افت کیفیت برای وب',
                'ساخت کاور کلیک‌خور با هوش مصنوعی',
              ],
              en: [
                'Lossless web-ready video encoding',
                'High-CTR thumbnail generation',
              ],
            },
          },
        ],
      },
    ],
  },
  {
    id: 'wordpress-elementor-lms-pro',
    slug: 'wp-elementor-lms',
    title: {
      fa: 'ساخت پنل آموزشی اختصاصی روی وردپرس و المنتور پرو',
      en: 'Custom WordPress & Elementor Pro Academy Architecture',
    },
    subtitle: {
      fa: 'طراحی پلاگین سبک، شورتکد، ویجت اختصاصی و اتصال به ووکامرس',
      en: 'Build lightweight custom plugins, shortcodes, and Elementor widgets.',
    },
    description: {
      fa: 'آموزش دقیق چگونگی جایگذاری یک پنل یادگیری مدرن در سایت وردپرسی بدون سنگین کردن هاست و با پشتیبانی کامل از المنتور پرو.',
      en: 'Learn how to embed a crisp React or PHP-driven academy cleanly inside Elementor Pro Canvas templates.',
    },
    category: 'WordPress',
    format: 'Workshop',
    durationTier: 'short',
    totalDuration: { fa: '۲ ساعت و ۴۵ دقیقه', en: '2h 45m' },
    lessonCount: 2,
    moduleCount: 1,
    enrolled: true,
    featured: false,
    isNew: true,
    accentColor: 'emerald',
    thumbnail: courseAiImg,
    instructor: { fa: 'امیرحسین رامو · معمار وب', en: 'Amirhossein Ramo · Web Architect' },
    priceToman: 1450000,
    priceUsd: 32,
    modules: [
      {
        id: 'wpm1',
        title: {
          fa: 'فصل اول: ادغام با المنتور پرو و ووکامرس',
          en: 'Module 1: Elementor Pro Widget & Shortcode Integration',
        },
        lessons: [
          {
            id: 'wp-l1',
            title: {
              fa: '۱. ساخت ویجت اختصاصی المنتور و شورتکد [iramo_lms]',
              en: '1. Registering a Native Elementor Widget & [iramo_lms] Shortcode',
            },
            duration: '24:00',
            durationMinutes: 24,
            type: 'lab',
            isFreePreview: true,
            summary: {
              fa: 'تبدیل کدهای پنل آموزشی به یک افزونه مستقل وردپرس که هم با شورتکد و هم با کشیدن و رها کردن در المنتور پرو کار می‌کند.',
              en: 'Wrapping the academy dashboard into a clean WordPress plugin with native Elementor controls.',
            },
            keyTakeaways: {
              fa: [
                'ثبت دسته‌بندی iRamo در پنل ویجت‌های المنتور',
                'استفاده از قالب Elementor Canvas برای تمام‌صفحه شدن پنل',
              ],
              en: [
                'Registering custom Elementor widget categories',
                'Using Elementor Canvas for full-bleed dashboards',
              ],
            },
          },
          {
            id: 'wp-l2',
            title: {
              fa: '۲. همگام‌سازی پیشرفت دانشجو با دیتابیس وردپرس',
              en: '2. Persisting Student Progress via WP User Meta & REST API',
            },
            duration: '21:30',
            durationMinutes: 22,
            type: 'video',
            summary: {
              fa: 'ذخیره تیک دروس تکمیل‌شده و صدور گواهینامه در دیتابیس وردپرس با کمترین کوئری.',
              en: 'Lightweight lesson completion tracking via WordPress REST API and user_meta.',
            },
            keyTakeaways: {
              fa: [
                'امن‌سازی درخواست‌ها با توکن وردپرس',
                'کش هوشمند کوئری‌های دوره',
              ],
              en: [
                'Securing REST calls with X-WP-Nonce',
                'Zero-bloat database schema',
              ],
            },
          },
        ],
      },
    ],
  },
  {
    id: 'automation-workflows-n8n',
    slug: 'business-automation',
    title: {
      fa: 'اتوماسیون فرآیندهای فروش و CRM با هوش مصنوعی',
      en: 'Automating Sales Workflows & CRM Pipelines',
    },
    subtitle: {
      fa: 'اتصال فرم‌های سایت به گوگل شیت، تلگرام، بله و ایمیل مارکتینگ',
      en: 'Connect site forms, CRM leads, spreadsheets, and instant notifications.',
    },
    description: {
      fa: 'طراحی سیستم‌های خودکار جذب مشتری، پیگیری سبدهای خرید رهاشده و تولید گزارش‌های مدیریتی روزانه.',
      en: 'Eliminate repetitive manual tasks by chaining webhooks, AI classification, and CRM updates.',
    },
    category: 'Automation',
    format: 'Project',
    durationTier: 'short',
    totalDuration: { fa: '۱ ساعت و ۲۵ دقیقه', en: '1h 25m' },
    lessonCount: 2,
    moduleCount: 1,
    enrolled: false,
    featured: false,
    accentColor: 'amber',
    thumbnail: courseHesabyarImg,
    instructor: { fa: 'سارا محمدی · مهندس اتوماسیون', en: 'Sara Mohammadi · Automation Lead' },
    priceToman: 1250000,
    priceUsd: 29,
    modules: [
      {
        id: 'am1',
        title: {
          fa: 'فصل اول: خطوط لوله خودکار فروش',
          en: 'Module 1: Automated Sales Pipelines',
        },
        lessons: [
          {
            id: 'auto-l1',
            title: {
              fa: '۱. طراحی وب‌هوک فرم المنتور به CRM و تلگرام',
              en: '1. Routing Elementor Pro Forms to CRM & Bot Alerts',
            },
            duration: '20:15',
            durationMinutes: 20,
            type: 'lab',
            isFreePreview: true,
            summary: {
              fa: 'اتصال مستقیم فرم‌های المنتور پرو به جریان اتوماسیون بدون افزونه‌های جانبی سنگین.',
              en: 'Connecting Elementor Pro Form Webhook actions directly to automated triage.',
            },
            keyTakeaways: {
              fa: [
                'تنظیم ارسال وب‌هوک بعد از ثبت فرم در المنتور پرو',
                'امتیازدهی هوشمند به درخواست‌های مشاوره',
              ],
              en: [
                'Configuring Elementor Pro Webhook actions',
                'Automated lead scoring & routing',
              ],
            },
          },
          {
            id: 'auto-l2',
            title: {
              fa: '۲. پیگیری خودکار سبدهای خرید ناتمام ووکامرس',
              en: '2. Abandoned Cart Recovery via Messenger',
            },
            duration: '23:10',
            durationMinutes: 23,
            type: 'video',
            summary: {
              fa: 'ارسال یادآور مودبانه همراه با کد تخفیف اختصاصی بعد از ۲ ساعت به مشتری.',
              en: 'Sending personalized recovery reminders with time-limited coupon codes.',
            },
            keyTakeaways: {
              fa: [
                'زمان‌بندی خودکار در وردپرس',
                'افزایش نرخ تبدیل فروشگاه‌های آموزشی',
              ],
              en: [
                'Scheduling clean WP-Cron jobs',
                'Measuring conversion lift accurately',
              ],
            },
          },
        ],
      },
    ],
  },
];

export const ASSIGNMENTS_DATA: Assignment[] = [
  {
    id: 'asg-1',
    courseId: 'ai-mastery-zero-to-pro',
    title: {
      fa: 'پروژه عملی ۱: طراحی دستور سیستمی دقیق برای دستیار پشتیبانی',
      en: 'Lab 1: Build a Schema-Safe Support System Prompt',
    },
    dueDate: { fa: '۲۵ آبان ۱۴۰۵', en: 'Nov 16, 2026' },
    status: 'graded',
    score: 96,
    maxScore: 100,
    submittedUrl: 'https://github.com/iramo-student/support-prompt-v1',
    feedback: {
      fa: 'ساختار خروجی کاملاً استاندارد است و مدیریت خطای زبان فارسی عالی انجام شده.',
      en: 'Excellent schema constraint handling and clean bilingual fallback rules.',
    },
  },
  {
    id: 'asg-2',
    courseId: 'telegram-bale-bot-engineering',
    title: {
      fa: 'پروژه عملی ۲: اتصال وب‌هوک ربات بله به سفارش ووکامرس',
      en: 'Lab 2: Connect Bale Webhook to WooCommerce Order Hook',
    },
    dueDate: { fa: '۳۰ آبان ۱۴۰۵', en: 'Nov 21, 2026' },
    status: 'pending',
    maxScore: 100,
  },
  {
    id: 'asg-3',
    courseId: 'hesabyar-smart-finance',
    title: {
      fa: 'تمرین ۳: تعریف سرفصل‌های مالی و خروجی ترازنامه حسابیار',
      en: 'Lab 3: Configure Hesabyar Monthly P&L Categories',
    },
    dueDate: { fa: '۵ آذر ۱۴۰۵', en: 'Nov 26, 2026' },
    status: 'submitted',
    maxScore: 100,
    submittedUrl: 'https://iramo.ai/submissions/hesabyar-ledger-sample.xlsx',
  },
];

export const TRANSACTIONS_DATA: Transaction[] = [
  {
    id: 'tx-101',
    invoiceNo: 'IRM-1405-8412',
    item: {
      fa: 'دوره جامع هوش مصنوعی از صفر تا پیشرفته',
      en: 'AI-Powered Systems & Engineering Mastery',
    },
    type: 'course',
    amountToman: 3450000,
    amountUsd: 79,
    date: { fa: '۱۴ آبان ۱۴۰۵', en: 'Nov 05, 2026' },
    status: 'paid',
    botDelivered: true,
  },
  {
    id: 'tx-102',
    invoiceNo: 'IRM-1405-8390',
    item: {
      fa: 'نرم‌افزار حسابیار (نسخه تجاری + اتصال ربات)',
      en: 'Hesabyar Pro License + Bot Sync',
    },
    type: 'software',
    amountToman: 2800000,
    amountUsd: 64,
    date: { fa: '۲ آبان ۱۴۰۵', en: 'Oct 24, 2026' },
    status: 'paid',
    licenseKey: 'HSB-94F2-IRAMO-771A-8820',
    botDelivered: true,
  },
  {
    id: 'tx-103',
    invoiceNo: 'IRM-1405-8105',
    item: {
      fa: 'پکیج مهندسی ربات‌های تلگرام و بله',
      en: 'Telegram & Bale Bot Architecture Course',
    },
    type: 'course',
    amountToman: 2290000,
    amountUsd: 49,
    date: { fa: '۱۸ مهر ۱۴۰۵', en: 'Oct 10, 2026' },
    status: 'paid',
    botDelivered: true,
  },
];

export const AI_CATEGORIES_META: AICategoryMeta[] = [
  {
    id: 'AI Assistant',
    fa: 'دستیار هوشمند و گفتگو (LLM)',
    en: 'AI Assistant & LLM',
    headline: {
      fa: 'دستیاران هوشمند همه‌کاره و مدل‌های زبانی پیشرفته',
      en: 'Conversational AI & Frontier Assistants',
    },
    description: {
      fa: 'پلتفرم‌های گفتگومحور برای تحلیل فایل، ایده‌پردازی، خلاصه‌سازی اسناد، ترجمه و انجام کارهای روزانه با درک عمیق متن و تصویر.',
      en: 'General-purpose virtual assistants for reasoning, document analysis, brainstorming, and multimodal workflows.',
    },
    medianPrice: { fa: '۲۰ دلار/ماه (دارای پلن رایگان)', en: '$20/mo (Free tier)' },
  },
  {
    id: 'Art & Image',
    fa: 'تولید تصویر و طراحی گرافیک',
    en: 'Art & Image Generation',
    headline: {
      fa: 'تصاویر و آثار هنری خود را در چند ثانیه خلق کنید',
      en: 'Bring your visual art & design concepts to life',
    },
    description: {
      fa: 'سرویس‌های تبدیل متن به تصویر (Text-to-Image)، طراحی لوگو، ویرایش حرفه‌ای عکس و ساخت تصاویر تبلیغاتی با کیفیت استودیویی.',
      en: 'Platforms specializing in photorealistic text-to-image generation, concept art, and style-consistent graphics.',
    },
    medianPrice: { fa: '۱۰ دلار/ماه (دارای پلن رایگان)', en: '$10/mo' },
  },
  {
    id: 'Video Generation',
    fa: 'تولید و تدوین ویدیو',
    en: 'Video Generation & Editing',
    headline: {
      fa: 'تولید ویدیو از متن، عکس و ساخت تیزرهای سینمایی',
      en: 'Text-to-Video, Motion Control & Visual Storytelling',
    },
    description: {
      fa: 'پلتفرم‌های پیشرفته ساخت ویدیو از روی پرامپت متنی یا تصویر ثابت، کنترل حرکت دوربین، حذف پس‌زمینه و تدوین هوشمند.',
      en: 'AI video studios converting prompts and static images into high-frame-rate cinematic sequences.',
    },
    medianPrice: { fa: '۱۵ تا ۳۰ دلار/ماه', en: '$15–$30/mo' },
  },
  {
    id: '3D & Avatar',
    fa: 'مدل سه‌بعدی (3D) و آواتار',
    en: '3D Models & AI Avatars',
    headline: {
      fa: 'ساخت آبجکت‌های سه‌بعدی بازی و آواتارهای سخنگو',
      en: 'Production-Ready 3D Meshes & Talking Avatars',
    },
    description: {
      fa: 'ابزارهای تبدیل متن و عکس به مدل سه‌بعدی (FBX/GLB) برای بازی‌سازی و انیمیشن، همراه با پلتفرم‌های ساخت مجری و آواتار ویدیویی.',
      en: 'Generate textured 3D meshes for Unreal/Unity or lifelike multilingual speaking avatars.',
    },
    medianPrice: { fa: '۱۲ تا ۲۴ دلار/ماه', en: '$12–$24/mo' },
  },
  {
    id: 'Code Assistant',
    fa: 'کدنویسی و توسعه نرم‌افزار',
    en: 'Code Assistant & Developer Tools',
    headline: {
      fa: 'توسعه نرم‌افزار، دیباگ و طراحی UI با سرعت چندبرابر',
      en: 'AI Code Editors, Full-Stack Builders & Debugging',
    },
    description: {
      fa: 'محیط‌های برنامه‌نویسی هوشمند (AI IDE)، تکمیل خودکار کد، ساخت رابط کاربری از روی متن و بررسی امنیت پروژه.',
      en: 'AI-native editors and code generators with deep repository context and live UI preview.',
    },
    medianPrice: { fa: '۲۰ دلار/ماه (نسخه رایگان فعال)', en: '$20/mo (Free tier)' },
  },
  {
    id: 'Audio & Music',
    fa: 'صوت، دوبله و ساخت موسیقی',
    en: 'Audio, Voice & Music AI',
    headline: {
      fa: 'تبدیل متن به گفتار طبیعی، کلون صدا و آهنگ‌سازی کامل',
      en: 'Studio Voiceovers, Voice Cloning & Full Music Tracks',
    },
    description: {
      fa: 'پلتفرم‌های تولید صدای انسانی بدون لهجه رباتیک، تبدیل ویس به متن، حذف نویز و ساخت آهنگ کامل با خواننده و ساز.',
      en: 'Ultra-realistic text-to-speech, voice cloning, stem separation, and complete song generation.',
    },
    medianPrice: { fa: '۵ تا ۱۰ دلار/ماه', en: '$5–$10/mo' },
  },
  {
    id: 'Data & Finance',
    fa: 'تحلیل داده، اکسل و مالی',
    en: 'Data Analysis & Spreadsheets',
    headline: {
      fa: 'تحلیل فایل‌های اکسل، نمودارها و مدل‌های آماری بدون فرمول‌نویسی',
      en: 'Analyze CSVs, SQL & Financial Sheets in Plain Language',
    },
    description: {
      fa: 'ابزارهای تحلیل هوشمند جدول‌ها، استخراج روند فروش، رسم نمودارهای مدیریتی و تولید کدهای پایتون/SQL از روی سوالات متنی.',
      en: 'Turn raw Excel/CSV spreadsheets into interactive visualizations, forecasts, and statistical summaries.',
    },
    medianPrice: { fa: '۲۰ دلار/ماه', en: '$20/mo' },
  },
  {
    id: 'Automation & Agents',
    fa: 'اتوماسیون، ایجنت و چت‌بات',
    en: 'Automation & AI Agents',
    headline: {
      fa: 'اتصال اپلیکیشن‌ها و ساخت گردش‌کارهای خودکار هوشمند',
      en: 'No-Code Workflows, API Orchestration & Autonomous Agents',
    },
    description: {
      fa: 'پلتفرم‌های بصری برای اتصال صدها سرویس، ایمیل، تلگرام، CRM و اجرای خودکار وظایف با کمک ایجنت‌های AI.',
      en: 'Node-based and visual workflow platforms connecting SaaS tools, webhooks, and custom LLM agents.',
    },
    medianPrice: { fa: 'رایگان (متن‌باز) تا ۲۰ دلار', en: 'Free (Open Source) – $20/mo' },
  },
  {
    id: 'Writing & SEO',
    fa: 'نویسندگی، سئو و ساخت ارائه',
    en: 'Copywriting, SEO & Presentations',
    headline: {
      fa: 'تولید اسلاید ارائه، محتوای سئو و متن‌های بازاریابی',
      en: 'Instant Pitch Decks, SEO Articles & Marketing Copy',
    },
    description: {
      fa: 'سرویس‌های تبدیل ایده یا داکیومنت به اسلایدهای گرافیکی آماده ارائه (Pitch Deck)، بازنویسی حرفه‌ای متن و نگارش مقاله سئو.',
      en: 'Generate styled presentation decks, landing pages, and brand-aligned copy in seconds.',
    },
    medianPrice: { fa: '۸ تا ۱۵ دلار/ماه', en: '$8–$15/mo' },
  },
  {
    id: 'Research & Study',
    fa: 'پژوهش، جستجو و یادگیری',
    en: 'AI Search & Research',
    headline: {
      fa: 'جستجوی رفرنس‌دار وب و تحلیل صدها صفحه PDF و مقاله',
      en: 'Cited Web Search & Deep Document Synthesis',
    },
    description: {
      fa: 'موتورهای جستجوی هوشمند همراه با منبع دقیق و ابزارهای مطالعه که کتاب‌ها و مقالات پژوهشی را به خلاصه و پادکست تبدیل می‌کنند.',
      en: 'Real-time answer engines with inline citations and source-grounded notebook workspaces.',
    },
    medianPrice: { fa: 'رایگان تا ۲۰ دلار/ماه', en: 'Free – $20/mo' },
  },
];

export const AI_TOOLS_DATA: AITool[] = [
  {
    id: 'tool-chatgpt',
    name: 'ChatGPT',
    provider: 'OpenAI',
    tagline: {
      fa: 'دستیار هوشمند همه‌کاره برای گفتگو، تحلیل فایل، کدنویسی و جستجوی وب',
      en: 'Multimodal conversational AI for reasoning, data analysis, voice & search.',
    },
    task: 'AI Assistant',
    subCategory: { fa: 'مدل زبانی و چت‌بات', en: 'AI Assistant' },
    input: 'Text',
    output: 'Text',
    pricing: 'Freemium',
    startingPrice: { fa: 'رایگان / Plus ۲۰ دلار', en: 'Free / $20 mo' },
    roles: ['Creator', 'Developer', 'Business', 'Analyst', 'Researcher'],
    verified: true,
    featured: true,
    hasApi: true,
    hasMobileApp: true,
    hasExtension: true,
    popularityScore: 99,
    usersCount: 2450,
    likes: 412,
    dislikes: 18,
    thumbnail: servicesNeuralImg,
    url: 'https://chatgpt.com',
    description: {
      fa: 'محبوب‌ترین پلتفرم هوش مصنوعی جهان از شرکت OpenAI با قابلیت درک متن، تصویر، فایل اکسل، اجرای کد و جستجوی زنده اینترنت.',
      en: 'OpenAI flagship assistant with web search, Canvas editing, image generation, and file analysis.',
    },
    longDescription: {
      fa: [
        'ChatGPT پیشرفته‌ترین دستیار گفتگومحور محصول OpenAI است که می‌تواند متن، تصویر، فایل PDF، کد و جداول اکسل را هم‌زمان درک و تحلیل کند.',
        'این پلتفرم امکاناتی مانند Canvas برای ویرایش مشترک کد و متن، Custom GPTها برای ساخت دستیارهای تخصصی و حالت صوتی زنده (Advanced Voice) را در اختیار کاربران قرار می‌دهد.',
      ],
      en: [
        'ChatGPT by OpenAI is a multimodal AI assistant capable of reasoning across text, images, spreadsheets, and real-time web searches.',
        'It includes Canvas collaborative editing, Python data analysis, voice conversations, and Custom GPTs tailored for specific business tasks.',
      ],
    },
    keyFeatures: {
      fa: [
        'تحلیل هم‌زمان متن، عکس، PDF و فایل اکسل',
        'محیط تعاملی Canvas برای نگارش و برنامه‌نویسی',
        'جستجوی زنده وب همراه با لینک منابع',
        'اپلیکیشن موبایل، دسکتاپ و API رسمی',
      ],
      en: [
        'Multimodal Vision, PDF & Spreadsheet Analysis',
        'Interactive Canvas Writing & Coding Space',
        'Real-Time Web Search with Citations',
        'iOS/Android Apps & Developer API',
      ],
    },
    whoIsItFor: {
      fa: [
        'توسعه‌دهندگان و برنامه‌نویسان',
        'تولیدکنندگان محتوا و بازاریابان',
        'پژوهشگران، دانشجویان و مدیران پروژه',
        'تحلیل‌گران داده و کسب‌وکارها',
      ],
      en: [
        'Software Engineers & Developers',
        'Content Creators & Marketers',
        'Students, Analysts & Founders',
        'Operations & Research Teams',
      ],
    },
    pricingDetails: {
      fa: 'نسخه رایگان دسترسی استاندارد به مدل‌های جدید را ارائه می‌دهد و اشتراک Plus با هزینه ۲۰ دلار ماهانه محدودیت‌های بالا و ابزارهای حرفه‌ای را باز می‌کند.',
      en: 'Free tier offers daily access to flagship models; Plus ($20/mo) unlocks extended limits, Deep Research, and custom GPT creation.',
    },
    likedFor: [
      { label: { fa: 'تنوع ابزارها در یک محیط', en: 'All-in-one versatility' }, count: 389, total: 412 },
      { label: { fa: 'پشتیبانی عالی از زبان فارسی', en: 'Strong multilingual fluency' }, count: 365, total: 412 },
      { label: { fa: 'اپلیکیشن موبایل سریع', en: 'Fast mobile app' }, count: 340, total: 412 },
    ],
    dislikedFor: [
      { label: { fa: 'محدودیت پیام در نسخه رایگان', en: 'Free tier usage caps' }, count: 14, total: 18 },
    ],
    steps: {
      fa: [
        'وارد وب‌سایت chatgpt.com شوید و حساب رایگان بسازید.',
        'فایل یا سوال خود را وارد کرده و در صورت نیاز جستجوی وب را فعال کنید.',
        'برای پروژه‌های تکراری از حالت Canvas یا GPT اختصاصی استفاده کنید.',
      ],
      en: [
        'Sign in at chatgpt.com with a free account.',
        'Paste your prompt or upload PDFs, images, or CSVs.',
        'Enable Search or Canvas for iterative coding and writing.',
      ],
    },
    samplePrompt: {
      fa: 'این گزارش فروش فصلی را بررسی کن، ۳ گلوگاه کاهش سود را مشخص کن و جدول برنامه اصلاحی ۹۰ روزه پیشنهاد بده.',
      en: 'Analyze this quarterly sales sheet, pinpoint the top 3 margin leaks, and output a 90-day action table.',
    },
  },
  {
    id: 'tool-claude',
    name: 'Claude',
    provider: 'Anthropic',
    tagline: {
      fa: 'دستیار هوشمند Anthropic مشهور به نگارش طبیعی، کدنویسی دقیق و پنجره زمینه وسیع',
      en: 'Anthropic AI assistant renowned for coding, Artifacts & nuanced writing.',
    },
    task: 'AI Assistant',
    subCategory: { fa: 'دستیار کد و نگارش عمیق', en: 'AI Assistant' },
    input: 'Document',
    output: 'Text',
    pricing: 'Freemium',
    startingPrice: { fa: 'رایگان / Pro ۲۰ دلار', en: 'Free / $20 mo' },
    roles: ['Developer', 'Creator', 'Researcher', 'Business'],
    verified: true,
    featured: true,
    hasApi: true,
    hasMobileApp: true,
    popularityScore: 98,
    usersCount: 1680,
    likes: 318,
    dislikes: 9,
    thumbnail: courseAiImg,
    url: 'https://claude.ai',
    description: {
      fa: 'سرویس هوش مصنوعی شرکت Anthropic با قابلیت پیش‌نمایش زنده کد و نمودار (Artifacts) و دقت بی‌نظیر در تحلیل متون طولانی.',
      en: 'Built by Anthropic with interactive Artifacts preview, long-context analysis, and top-tier coding benchmarks.',
    },
    longDescription: {
      fa: [
        'کلود (Claude) یکی از دقیق‌ترین مدل‌های هوش مصنوعی برای برنامه‌نویسی معماری‌های پیچیده، نگارش متون طبیعی بدون لحن کلیشه‌ای و بررسی اسناد چندصد صفحه‌ای است.',
        'قابلیت Artifacts در Claude به شما اجازه می‌دهد کدهای HTML/React، دیاگرام‌ها و اسناد تولیدشده را هم‌زمان در یک پنجره کناری به صورت زنده مشاهده و اجرا کنید.',
      ],
      en: [
        'Claude by Anthropic excels at software architecture, natural non-robotic prose, and analyzing large multi-document contexts.',
        'Its interactive Artifacts window renders live React components, SVG diagrams, and formatted documents right beside the chat.',
      ],
    },
    keyFeatures: {
      fa: [
        'پنجره زنده Artifacts برای اجرای آنی UI و دیاگرام',
        'نگارش بسیار طبیعی و روان به فارسی و انگلیسی',
        'تحلیل هم‌زمان فایل‌ها و پروژه‌های بزرگ (Projects)',
        'دقت بالا در معماری نرم‌افزار و دیباگ کد',
      ],
      en: [
        'Live Interactive Artifacts Sandbox',
        'Natural Nuanced Writing & Reasoning',
        'Projects Workspace for Shared Context',
        'High-Accuracy Full-Stack Coding',
      ],
    },
    whoIsItFor: {
      fa: [
        'مهندسان نرم‌افزار و طراحان فرانت‌اند',
        'نویسندگان، ویراستاران و استراتژیست‌های محتوا',
        'پژوهشگران تحلیل اسناد حقوقی و فنی',
      ],
      en: [
        'Software Architects & Engineers',
        'Writers & Content Strategists',
        'Legal & Technical Researchers',
      ],
    },
    pricingDetails: {
      fa: 'دارای نسخه رایگان برای تست روزانه و پلن Pro با هزینه ۲۰ دلار در ماه برای دسترسی کامل به مدل‌های Sonnet و Opus.',
      en: 'Free daily tier available; Pro ($20/mo) includes 5x higher limits and full model access.',
    },
    likedFor: [
      { label: { fa: 'کیفیت نگارش غیررباتیک', en: 'Natural writing tone' }, count: 298, total: 318 },
      { label: { fa: 'دقت بالا در کدنویسی React و پایتون', en: 'Coding & Artifacts UI' }, count: 285, total: 318 },
    ],
    steps: {
      fa: [
        'در سایت claude.ai وارد شوید و یک Project جدید بسازید.',
        'مستندات پروژه یا نمونه سبک نگارش خود را آپلود کنید.',
        'از ابزار برای تولید کد یا بازنویسی دقیق محتوا با Artifacts کمک بگیرید.',
      ],
      en: [
        'Create a workspace on claude.ai.',
        'Upload style guides or codebase files into Projects.',
        'Ask Claude to build interactive UI prototypes or refined copy.',
      ],
    },
  },
  {
    id: 'tool-perplexity',
    name: 'Perplexity AI',
    provider: 'Perplexity',
    tagline: {
      fa: 'موتور جستجوی هوشمند پاسخ‌گو با استناد دقیق و لینک زنده به منابع وب',
      en: 'Real-time AI answer engine with inline web citations and Deep Research.',
    },
    task: 'Research & Study',
    subCategory: { fa: 'موتور جستجوی هوشمند', en: 'Search Engine' },
    input: 'Prompt',
    output: 'Text',
    pricing: 'Freemium',
    startingPrice: { fa: 'رایگان / Pro ۲۰ دلار', en: 'Free / $20 mo' },
    roles: ['Researcher', 'Analyst', 'Business', 'Creator'],
    verified: true,
    featured: true,
    hasApi: true,
    hasMobileApp: true,
    hasExtension: true,
    popularityScore: 96,
    usersCount: 1420,
    likes: 264,
    dislikes: 11,
    thumbnail: heroDeskImg,
    url: 'https://perplexity.ai',
    description: {
      fa: 'جایگزین هوشمند جستجوی گوگل که ده‌ها صفحه وب را بررسی کرده و پاسخ خلاصه همراه با لینک دقیق هر منبع ارائه می‌دهد.',
      en: 'Combines live web crawling with frontier LLMs to deliver cited, hallucination-resistant research answers.',
    },
    longDescription: {
      fa: [
        'Perplexity یک موتور پاسخگوی هوشمند است که به جای نمایش لیستی از لینک‌های تبلیغاتی، به صورت لحظه‌ای وب را جستجو کرده و یک گزارش دقیق با ارجاع شماره‌گذاری‌شده به منابع معتبر تولید می‌کند.',
        'حالت Deep Research در این پلتفرم برای تحلیل بازار، مقایسه رقبا، بررسی مقالات علمی و پیگیری اخبار فناوری در چند دقیقه فوق‌العاده کاربردی است.',
      ],
      en: [
        'Perplexity replaces endless tab-hopping by searching dozens of live web sources and synthesizing a structured answer with clickable footnotes.',
        'Its Deep Research mode conducts multi-step investigations for market sizing, academic citations, and competitor intelligence.',
      ],
    },
    keyFeatures: {
      fa: [
        'جستجوی لحظه‌ای اینترنت با ذکر دقیق لینک منبع',
        'حالت Deep Research برای گزارش‌های تحلیلی جامع',
        'امکان فیلتر جستجو روی مقالات آکادمیک یا یوتیوب',
        'افزونه کروم و اپلیکیشن iOS / Android',
      ],
      en: [
        'Live Crawled Web Answers with Citations',
        'Autonomous Deep Research Reports',
        'Academic, Social & Video Search Scopes',
        'Chrome Extension & Mobile Apps',
      ],
    },
    whoIsItFor: {
      fa: [
        'پژوهشگران، دانشجویان و روزنامه‌نگاران',
        'تحلیل‌گران بازار و مشاوران کسب‌وکار',
        'تولیدکنندگان محتوای مستند و تحقیقی',
      ],
      en: [
        'Researchers & Students',
        'Market & Competitive Analysts',
        'Journalists & Content Creators',
      ],
    },
    pricingDetails: {
      fa: 'جستجوی نامحدود رایگان در حالت استاندارد و پلن Pro به قیمت ۲۰ دلار ماهانه با قابلیت انتخاب مدل و آپلود نامحدود فایل.',
      en: 'Unlimited quick searches free forever; Pro ($20/mo) unlocks unlimited Pro Searches and model selection.',
    },
    likedFor: [
      { label: { fa: 'ارائه لینک منبع برای هر جمله', en: 'Verifiable source citations' }, count: 251, total: 264 },
      { label: { fa: 'سرعت بسیار بالا در تحقیق', en: 'Speed of research' }, count: 230, total: 264 },
    ],
    steps: {
      fa: [
        'سوال تحقیقی خود را در perplexity.ai بنویسید.',
        'حوزه جستجو (Web / Academic / Social) را مشخص کنید.',
        'روی شماره‌های منبع کلیک کرده و یا گزارش را به PDF خروجی بگیرید.',
      ],
      en: [
        'Enter any research question on perplexity.ai.',
        'Toggle Pro Search or Academic focus.',
        'Verify footnotes or export the report as Markdown/PDF.',
      ],
    },
  },
  {
    id: 'tool-cursor',
    name: 'Cursor AI',
    provider: 'Anysphere',
    tagline: {
      fa: 'محبوب‌ترین محیط کدنویسی هوشمند جهان مبتنی بر VS Code با درک کامل پروژه',
      en: 'AI-first code editor built on VS Code with multi-file codebase editing.',
    },
    task: 'Code Assistant',
    subCategory: { fa: 'ادیتور و دستیار کدنویسی', en: 'Code Assistant' },
    input: 'Text',
    output: 'Code',
    pricing: 'Freemium',
    startingPrice: { fa: 'رایگان (Hobby) / ۲۰ دلار', en: 'Free / $20 mo' },
    roles: ['Developer'],
    verified: true,
    featured: true,
    hasExtension: true,
    popularityScore: 99,
    usersCount: 1890,
    likes: 342,
    dislikes: 12,
    thumbnail: courseAiImg,
    url: 'https://cursor.com',
    description: {
      fa: 'ویرایشگر کد اختصاصی با قابلیت پیش‌بینی هوشمند تغییرات بعدی، ویرایش هم‌زمان چندین فایل و چت مستقیم با کل مخزن کد.',
      en: 'Industry-leading AI IDE offering Composer multi-file edits, smart Tab autocomplete, and codebase Q&A.',
    },
    longDescription: {
      fa: [
        'Cursor یک ویرایشگر کد مدرن ساخته شده بر پایه VS Code است که تمام ساختار پروژه شما را ایندکس می‌کند و می‌تواند ویژگی‌های کامل نرم‌افزاری را در چندین فایل هم‌زمان پیاده‌سازی یا دیباگ کند.',
        'توسعه‌دهندگان از تمام افزونه‌ها و تم‌های قبلی VS Code خود به راحتی در Cursor استفاده کرده و سرعت کدنویسی خود را تا ۳ برابر افزایش می‌دهند.',
      ],
      en: [
        'Cursor forks VS Code and integrates frontier AI models directly into your editor workflow—predicting multi-line edits and refactoring across multiple files in one pass.',
        'Keep all your existing VS Code extensions while leveraging Agent mode, terminal command execution, and SOC-2 Privacy Mode.',
      ],
    },
    keyFeatures: {
      fa: [
        'حالت Agent برای ساخت و ویرایش هم‌زمان چند فایل',
        'پیش‌بینی هوشمند کد با کلید Tab',
        'سازگاری کامل با افزونه‌های VS Code',
        'حالت حریم خصوصی (Privacy Mode) بدون ذخیره کد',
      ],
      en: [
        'Multi-File Agent & Composer Edits',
        'Predictive Tab Multi-Line Autocomplete',
        '100% VS Code Extension Compatibility',
        'SOC-2 Privacy Mode Support',
      ],
    },
    whoIsItFor: {
      fa: [
        'برنامه‌نویسان فرانت‌اند، بک‌اند و فول‌استک',
        'توسعه‌دهندگان وردپرس، پایتون و ری‌اکت',
        'استارتاپ‌ها و تیم‌های فنی نرم‌افزار',
      ],
      en: [
        'Full-Stack & Frontend Developers',
        'WordPress, Python & TypeScript Engineers',
        'Startup Engineering Teams',
      ],
    },
    pricingDetails: {
      fa: 'پلن Hobby رایگان با ۲ هفته تست امکانات حرفه‌ای، و پلن Pro با قیمت ۲۰ دلار در ماه برای درخواست‌های سریع نامحدود.',
      en: 'Hobby tier is free with starter completions; Pro ($20/mo) provides fast premium model requests and unlimited Tab.',
    },
    likedFor: [
      { label: { fa: 'درک دقیق ارتباط بین فایل‌های پروژه', en: 'Deep multi-file context' }, count: 329, total: 342 },
      { label: { fa: 'سرعت خارق‌العاده قابلیت Tab', en: 'Smart Tab prediction' }, count: 315, total: 342 },
    ],
    steps: {
      fa: [
        'نرم‌افزار Cursor را برای ویندوز، مک یا لینوکس دانلود و نصب کنید.',
        'پوشه پروژه خود را باز کرده و با Ctrl+K یا Ctrl+L دستور تغییر را بنویسید.',
        'تغییرات پیشنهادی را به صورت Diff بررسی و تایید کنید.',
      ],
      en: [
        'Download Cursor for macOS, Windows, or Linux.',
        'Open your repository and press Cmd/Ctrl+L to prompt Agent mode.',
        'Review inline code diffs and accept changes with one click.',
      ],
    },
  },
  {
    id: 'tool-grok-imagine',
    name: 'Grok Imagine 2.0',
    provider: 'xAI',
    tagline: {
      fa: 'پلتفرم پرسرعت تولید تصویر و ویدیو از متن و عکس با موتور Aurora',
      en: 'Fast AI image & video creation powered by xAI Aurora engine.',
    },
    task: 'Video Generation',
    subCategory: { fa: 'تولید تصویر و ویدیو', en: 'Art & Video Generation' },
    input: 'Prompt',
    output: 'Video',
    pricing: 'Freemium',
    startingPrice: { fa: 'فریمیوم / ۲۹.۹۰ دلار', en: 'Freemium / $29.9 mo' },
    roles: ['Creator', 'Designer'],
    verified: true,
    hasMobileApp: true,
    popularityScore: 95,
    usersCount: 816,
    likes: 116,
    dislikes: 6,
    thumbnail: courseVideomiImg,
    url: 'https://grok.com',
    description: {
      fa: 'پلتفرم تولید محتوای بصری شرکت xAI که با سرعت بالا تصاویر و ویدیوهای واقعی همراه با صدا و فیزیک طبیعی خلق می‌کند.',
      en: 'High-speed image-to-video and text-to-video platform featuring realistic physics and synchronized audio.',
    },
    longDescription: {
      fa: [
        'Grok Imagine 2.0 پلتفرم گرافیکی و ویدیویی توسعه‌یافته بر پایه مدل Aurora است که امکان خلق هم‌زمان چندین خروجی تصویری و تبدیل سریع عکس به ویدیوی پویا را فراهم می‌کند.',
        'این سرویس سبک‌های متنوع فانتزی، رئالیستیک و علمی-تخیلی را همراه با همگام‌سازی صدا در چند ثانیه رندر می‌کند.',
      ],
      en: [
        'Grok Imagine 2.0 harnesses xAI’s Aurora engine to generate photorealistic visuals and dynamic videos with synchronized audio in seconds.',
        'Users can switch effortlessly between text-to-video and image-to-video variations.',
      ],
    },
    keyFeatures: {
      fa: [
        'تولید هم‌زمان تصویر و ویدیو با موتور Aurora',
        'تبدیل تصویر ثابت به ویدیوی متحرک واقعی',
        'تولید هماهنگ افکت صوتی روی ویدیو',
        'سرعت رندر آنی روی وب و اپلیکیشن موبایل',
      ],
      en: [
        'Aurora Engine Text & Image-to-Video',
        'Synchronized Audio & Realistic Physics',
        'Simultaneous Multi-Variation Outputs',
        'Web & Mobile App Access',
      ],
    },
    whoIsItFor: {
      fa: [
        'تولیدکنندگان محتوای شبکه‌های اجتماعی',
        'طراحان ایده‌های تبلیغاتی و کانسپت‌آرت',
        'سازندگان کلیپ‌های کوتاه خلاقانه',
      ],
      en: [
        'Social Content Creators',
        'Concept Designers & Art Directors',
        'Short-Form Video Marketers',
      ],
    },
    pricingDetails: {
      fa: 'دسترسی رایگان روزانه با محدودیت تعداد ساخت و پلن‌های پولی برای خروجی باکیفیت و حجم بالاتر.',
      en: 'Freemium daily generations available; paid tiers scale monthly video quotas and max resolution.',
    },
    likedFor: [
      { label: { fa: 'سرعت بالای رندرینگ', en: 'Real-time generation speed' }, count: 104, total: 116 },
      { label: { fa: 'طبیعی بودن حرکت سوژه‌ها', en: 'Natural motion physics' }, count: 96, total: 116 },
    ],
    steps: {
      fa: [
        'وارد بخش Imagine در پلتفرم grok.com شوید.',
        'توصیف صحنه یا تصویر اولیه خود را بارگذاری کنید.',
        'بین خروجی‌های پیشنهادی انتخاب و ویدیو را دانلود کنید.',
      ],
      en: [
        'Open Grok Imagine in browser or mobile app.',
        'Enter a scene prompt or upload a reference image.',
        'Pick your preferred variation and export MP4.',
      ],
    },
  },
  {
    id: 'tool-runway',
    name: 'Runway (Gen-3 / Gen-4)',
    provider: 'RunwayML',
    tagline: {
      fa: 'استودیوی استاندارد صنعت سینما برای تولید و ویرایش ویدیو با هوش مصنوعی',
      en: 'Industry-standard generative video suite with Motion Brush & Director Mode.',
    },
    task: 'Video Generation',
    subCategory: { fa: 'ویدیو سینمایی و ویرایش', en: 'Video Generation' },
    input: 'Video',
    output: 'Video',
    pricing: 'Freemium',
    startingPrice: { fa: 'رایگان آزمایشی / ۱۵ دلار', en: 'Free Trial / $15 mo' },
    roles: ['Creator', 'Designer', 'Business'],
    verified: true,
    hasApi: true,
    hasMobileApp: true,
    popularityScore: 96,
    usersCount: 1120,
    likes: 204,
    dislikes: 11,
    thumbnail: courseVideomiImg,
    url: 'https://runwayml.com',
    description: {
      fa: 'پلتفرم حرفه‌ای ساخت ویدیو از متن و عکس، کنترل دقیق حرکت دوربین، براش حرکت‌دهی بخش خاصی از تصویر و حذف پس‌زمینه.',
      en: 'Pro-grade AI filmmaking platform for text-to-video, video-to-video restyling, and camera control.',
    },
    longDescription: {
      fa: [
        'Runway یکی از پیشگامان تولید ویدیوی هوش مصنوعی در دنیاست که در پروژه‌های سینمایی، تیزرهای تبلیغاتی و تولید محتوای حرفه‌ای استفاده می‌شود.',
        'با ابزارهایی مانند Motion Brush می‌توانید تنها بخش مشخصی از تصویر را به حرکت درآورید و با Camera Control زاویه و حرکت دوربین را دقیقاً تنظیم کنید.',
      ],
      en: [
        'Runway powers professional filmmakers and commercial studios with Gen-3 Alpha & Gen-4 video synthesis models.',
        'Fine-tune shots with Motion Brush, Act-One character performance capture, and green-screen rotoscoping.',
      ],
    },
    keyFeatures: {
      fa: [
        'کنترل دقیق حرکت دوربین (Pan, Tilt, Zoom)',
        'ابزار Motion Brush برای حرکت‌دهی بخش انتخابی',
        'تبدیل ویدیوی واقعی به سبک‌های هنری مختلف',
        'حذف هوشمند پس‌زمینه و اشیاء مزاحم',
      ],
      en: [
        'Director Mode Camera Controls',
        'Selective Motion Brush Animation',
        'Video-to-Video Style Transfer',
        'AI Green Screen & Inpainting',
      ],
    },
    whoIsItFor: {
      fa: [
        'تدوین‌گران، کارگردانان و آژانس‌های تبلیغاتی',
        'موشن‌گرافیست‌ها و تولیدکنندگان تیزر',
        'یوتیوبرها و برندهای تجاری',
      ],
      en: [
        'Filmmakers & Creative Directors',
        'Motion Designers & Agencies',
        'Commercial Video Producers',
      ],
    },
    pricingDetails: {
      fa: 'دارای ۱۲۵ اعتبار رایگان اولیه و اشتراک‌های استاندارد از ۱۵ دلار در ماه برای خروجی 4K بدون واترمارک.',
      en: 'Includes 125 starter credits free; Standard plans start at $15/mo for watermark-free exports.',
    },
    likedFor: [
      { label: { fa: 'کنترل سینمایی روی دوربین و حرکت', en: 'Cinematic camera precision' }, count: 189, total: 204 },
      { label: { fa: 'ابزارهای تدوین یکجا در مرورگر', en: 'All-in-one browser studio' }, count: 174, total: 204 },
    ],
    steps: {
      fa: [
        'در runwayml.com وارد شوید و مدل Gen-3 / Gen-4 را انتخاب کنید.',
        'عکس کلیدی (Keyframe) یا متن سناریو را وارد کنید.',
        'مسیر حرکت دوربین را تعیین کرده و ویدیو را رندر بگیرید.',
      ],
      en: [
        'Launch a video session on runwayml.com.',
        'Upload a starting keyframe and describe the motion.',
        'Adjust camera axes and export high-bitrate MP4.',
      ],
    },
  },
  {
    id: 'tool-midjourney',
    name: 'Midjourney',
    provider: 'Midjourney Inc.',
    tagline: {
      fa: 'برترین موتور خلق تصاویر هنری، تبلیغاتی و رئالیستیک با جزئیات خیره‌کننده',
      en: 'Leading text-to-image platform for artistic, commercial & photorealistic visuals.',
    },
    task: 'Art & Image',
    subCategory: { fa: 'تولید تصویر و هنر', en: 'Art Generation' },
    input: 'Prompt',
    output: 'Image',
    pricing: 'Paid',
    startingPrice: { fa: 'اشتراک از ۱۰ دلار/ماه', en: 'From $10/mo' },
    roles: ['Designer', 'Creator', 'Business'],
    verified: true,
    popularityScore: 97,
    usersCount: 1940,
    likes: 356,
    dislikes: 15,
    thumbnail: heroDeskImg,
    url: 'https://midjourney.com',
    description: {
      fa: 'استاندارد طلایی طراحی گرافیک با هوش مصنوعی برای ساخت عکس‌های محصول، پوستر، طراحی رابط کاربری و تصاویر مفهومی.',
      en: 'Gold-standard AI image generator with Style References, Character Consistency, and high-res web editor.',
    },
    longDescription: {
      fa: [
        'Midjourney معروف‌ترین ابزار تولید تصویر با هوش مصنوعی است که به خاطر نورپردازی سینمایی، ترکیب‌بندی حرفه‌ای و کیفیت چاپ‌پذیر شناخته می‌شود.',
        'در نسخه وب جدید Midjourney بدون نیاز به دیسکورد، ابزارهای ویرایش بخشی از تصویر (Vary Region)، حفظ کاراکتر ثابت (Character Reference) و کپی استایل طراحی در دسترس شماست.',
      ],
      en: [
        'Midjourney leads generative art with unmatched lighting, composition, and aesthetic coherence across photography and illustration.',
        'Its dedicated web app offers Style References (--sref), Character Consistency (--cref), and regional inpainting.',
      ],
    },
    keyFeatures: {
      fa: [
        'کیفیت فوق‌العاده در عکاسی محصول و پرتره',
        'حفظ ثبات کاراکتر و سبک گرافیکی در چندین تصویر',
        'ویرایشگر وب برای تغییر جزئیات و بزرگنمایی',
        'پشتیبانی از نسبت‌های تصویر دلخواه',
      ],
      en: [
        'Photorealistic Commercial & Product Renders',
        'Style (--sref) & Character (--cref) Consistency',
        'Web-Based Inpainting & Upscaling Editor',
        'Custom Aspect Ratios & Remixing',
      ],
    },
    whoIsItFor: {
      fa: [
        'طراحان گرافیک و کارگردانان هنری',
        'تیم‌های تبلیغات، برندینگ و بسته‌بندی',
        'طراحان بازی، معماری و مد',
      ],
      en: [
        'Graphic Designers & Illustrators',
        'Branding & Advertising Studios',
        'Game Concept & UI Artists',
      ],
    },
    pricingDetails: {
      fa: 'پلن Basic از ۱۰ دلار در ماه آغاز می‌شود و پلن‌های Standard و Pro امکان تولید نامحدود در حالت Relax را می‌دهند.',
      en: 'Plans start at $10/mo (Basic) with Unlimited Relax mode starting on the $30/mo Standard tier.',
    },
    likedFor: [
      { label: { fa: 'زیبایی‌شناسی و نورپردازی بی‌رقیب', en: 'Unmatched visual aesthetics' }, count: 344, total: 356 },
      { label: { fa: 'قابلیت حفظ سبک در برندینگ', en: 'Style reference consistency' }, count: 312, total: 356 },
    ],
    steps: {
      fa: [
        'وارد وب‌اپلیکیشن midjourney.com شوید.',
        'پرامپت انگلیسی با ذکر موضوع، نورپردازی و لنز دوربین را بنویسید.',
        'تصویر منتخب را Upscale یا بخش‌های آن را ویرایش کنید.',
      ],
      en: [
        'Open midjourney.com web workspace.',
        'Describe subject, lighting, medium, and --ar aspect ratio.',
        'Upscale or paint-inpaint edits right in the browser.',
      ],
    },
  },
  {
    id: 'tool-meshy',
    name: 'Meshy AI',
    provider: 'Meshy',
    tagline: {
      fa: 'تبدیل متن و تصویر به مدل‌های سه‌بعدی (3D) آماده برای بازی و انیمیشن',
      en: 'AI 3D model & PBR texture generator from text prompts or images.',
    },
    task: '3D & Avatar',
    subCategory: { fa: 'مدل سه‌بعدی (3D)', en: '3D Generation' },
    input: 'Image',
    output: '3D Model',
    pricing: 'Freemium',
    startingPrice: { fa: 'رایگان / ۱۶ دلار/ماه', en: 'Free / $16 mo' },
    roles: ['Designer', 'Developer', 'Creator'],
    verified: true,
    hasApi: true,
    popularityScore: 93,
    usersCount: 684,
    likes: 112,
    dislikes: 5,
    thumbnail: courseBotImg,
    url: 'https://meshy.ai',
    description: {
      fa: 'ساخت سریع آبجکت‌های سه‌بعدی با تکسچر PBR و خروجی مستقیم برای موتورهای Unreal، Unity و نرم‌افزار Blender.',
      en: 'Generate textured 3D assets with clean topology and export directly to GLB, FBX, OBJ, or USDZ.',
    },
    longDescription: {
      fa: [
        'Meshy یک پلتفرم تخصصی تولید مدل‌های سه‌بعدی است که در کمتر از یک دقیقه از روی یک جمله یا یک عکس دو‌بعدی، مدل سه‌بعدی کامل همراه با بافت و متریال PBR تحویل می‌دهد.',
        'این ابزار همچنین امکان ریتاپولوژی هوشمند و آماده‌سازی کاراکتر برای استخوان‌بندی (Auto-Rigging) و انیمیشن را دارد.',
      ],
      en: [
        'Meshy empowers 3D artists and game developers to create detailed, PBR-textured 3D assets in under a minute from text or single images.',
        'Includes AI texturing, quad remeshing, auto-rigging, and one-click Blender/Unity plugins.',
      ],
    },
    keyFeatures: {
      fa: [
        'تبدیل متن و عکس به مدل 3D با بافت کامل',
        'خروجی استاندارد GLB، FBX، OBJ و Blender',
        'کاهش تعداد پلیگون‌ها (Remesh) با توپولوژی تمیز',
        'ریگ خودکار (Auto-Rig) برای کاراکترهای بازی',
      ],
      en: [
        'Text-to-3D & Image-to-3D Mesh Creation',
        'Full PBR Texture & Material Maps',
        'Smart Quad Remeshing & Clean Topology',
        'FBX, GLB, OBJ & Auto-Rigging Export',
      ],
    },
    whoIsItFor: {
      fa: [
        'بازی‌سازان (Unity و Unreal Engine)',
        'طراحان سه‌بعدی، موشن‌گرافیک و چاپ 3D',
        'فروشگاه‌های نیازمند نمایش سه‌بعدی محصول (AR)',
      ],
      en: [
        'Indie & Studio Game Developers',
        '3D Generalists & Blender Artists',
        'E-commerce AR/3D Showcase Teams',
      ],
    },
    pricingDetails: {
      fa: 'دارای اعتبار رایگان ماهانه (۲۰۰ کردیت) و اشتراک Pro با لایسنس تجاری از ۱۶ دلار در ماه.',
      en: '200 free monthly credits; Pro starts at $16/mo with full commercial rights.',
    },
    likedFor: [
      { label: { fa: 'سرعت ساخت مدل اولیه کاراکتر و آبجکت', en: 'Rapid 3D prototyping speed' }, count: 103, total: 112 },
      { label: { fa: 'کیفیت تکسچرهای PBR', en: 'PBR texture quality' }, count: 95, total: 112 },
    ],
    steps: {
      fa: [
        'وارد meshy.ai شوید و حالت Text-to-3D یا Image-to-3D را انتخاب کنید.',
        'عکس آبجکت را آپلود یا مشخصات آن را بنویسید.',
        'پس از بررسی نمای ۳۶۰ درجه، فایل FBX یا GLB را دانلود کنید.',
      ],
      en: [
        'Select Text-to-3D or Image-to-3D at meshy.ai.',
        'Upload an orthogonal reference image.',
        'Preview PBR shading and download GLB or FBX.',
      ],
    },
  },
  {
    id: 'tool-tripo3d',
    name: 'Tripo3D',
    provider: 'Tripo AI',
    tagline: {
      fa: 'تبدیل فوری عکس دو‌بعدی یا متن به مدل سه‌بعدی قابل استفاده در بازی‌سازی',
      en: 'Ultra-fast image-to-3D geometry reconstruction with animation rigging.',
    },
    task: '3D & Avatar',
    subCategory: { fa: 'ساخت مدل سه‌بعدی', en: '3D Generation' },
    input: 'Image',
    output: '3D Model',
    pricing: 'Freemium',
    startingPrice: { fa: 'فریمیوم / ۱۱.۹۴ دلار', en: 'Freemium / $11.94 mo' },
    roles: ['Designer', 'Developer'],
    verified: true,
    hasApi: true,
    popularityScore: 91,
    usersCount: 607,
    likes: 89,
    dislikes: 4,
    thumbnail: heroDeskImg,
    url: 'https://tripo3d.ai',
    description: {
      fa: 'موتور فوق‌سریع ساخت مش‌های سه‌بعدی دقیق از یک تصویر تک‌نما، همراه با ابزار ریگ و انیمیشن آماده.',
      en: 'Reconstructs crisp 3D meshes from single reference photos in seconds with export-ready rigging.',
    },
    longDescription: {
      fa: [
        'Tripo3D روی بازسازی دقیق هندسه و جزئیات سطوح از روی یک تصویر واحد تمرکز دارد و در کمتر از ۱۰ ثانیه پیش‌نمایش سه‌بعدی تولید می‌کند.',
      ],
      en: [
        'Tripo3D specializes in fast, clean 3D mesh reconstruction from single-angle images, complete with UV unwrapping and rigging tools.',
      ],
    },
    keyFeatures: {
      fa: [
        'ساخت پیش‌نمایش سه‌بعدی در زیر ۱۰ ثانیه',
        'بازسازی دقیق جزئیات هندسی از عکس تک‌نما',
        'اتصال مستقیم از طریق REST API برای توسعه‌دهندگان',
        'خروجی بهینه برای چاپ سه‌بعدی و موتورهای بازی',
      ],
      en: [
        'Sub-10-Second 3D Draft Generation',
        'High-Detail Single-Image Reconstruction',
        'Developer REST API & Webhooks',
        '3D Print & Game-Engine Ready Exports',
      ],
    },
    whoIsItFor: {
      fa: [
        'طراحان کاراکتر و محیط‌های سه‌بعدی',
        'توسعه‌دهندگان اپلیکیشن‌های AR/VR',
        'علاقه‌مندان به پرینت سه‌بعدی',
      ],
      en: [
        '3D Character & Prop Modelers',
        'AR/VR App Engineers',
        '3D Printing Makers',
      ],
    },
    pricingDetails: {
      fa: 'پلن رایگان با کردیت روزانه و اشتراک‌های پولی از ۱۱.۹۴ دلار در ماه.',
      en: 'Free daily credits; paid plans start around $11.94/mo for fast priority queues.',
    },
    steps: {
      fa: [
        'تصویر سوژه را در tripo3d.ai آپلود کنید.',
        'نسخه باکیفیت (Refine) و انیمیشن دلخواه را انتخاب کنید.',
        'مدل نهایی را با فرمت GLB یا OBJ دریافت کنید.',
      ],
      en: [
        'Upload a single reference photo on tripo3d.ai.',
        'Trigger High-Detail Refine or Auto-Rig.',
        'Export GLB, FBX, or STL.',
      ],
    },
  },
  {
    id: 'tool-elevenlabs',
    name: 'ElevenLabs',
    provider: 'ElevenLabs',
    tagline: {
      fa: 'واقع‌گرایانه‌ترین پلتفرم تبدیل متن به گفتار، دوبله ویدیو و کلون صدای انسانی',
      en: 'Studio-grade AI voice generator, dubbing & instant voice cloning.',
    },
    task: 'Audio & Music',
    subCategory: { fa: 'تبدیل متن به صوت و صداگذاری', en: 'Text-to-Speech' },
    input: 'Text',
    output: 'Audio',
    pricing: 'Freemium',
    startingPrice: { fa: 'رایگان / از ۵ دلار/ماه', en: 'Free / $5 mo' },
    roles: ['Creator', 'Business', 'Developer'],
    verified: true,
    featured: true,
    hasApi: true,
    hasMobileApp: true,
    popularityScore: 98,
    usersCount: 1580,
    likes: 294,
    dislikes: 8,
    thumbnail: servicesNeuralImg,
    url: 'https://elevenlabs.io',
    description: {
      fa: 'تولید نریشن طبیعی با احساسات واقعی به ده‌ها زبان (شامل فارسی)، دوبله خودکار ویدیوها و ساخت افکت صوتی.',
      en: 'Industry benchmark for lifelike speech synthesis, multilingual video dubbing, and Conversational Voice AI.',
    },
    longDescription: {
      fa: [
        'ElevenLabs پیشروترین پلتفرم هوش مصنوعی صدا در جهان است که متن‌های شما را با لحن کاملاً طبیعی، مکث‌های واقعی و احساسات انسانی به فایل صوتی استودیویی تبدیل می‌کند.',
        'با قابلیت Voice Cloning می‌توانید تنها با ۱ دقیقه نمونه صوتی، صدای اختصاصی خود را بسازید و با ابزار Dubbing ویدیوهای آموزشی را با حفظ صدای اصلی به زبان‌های دیگر دوبله کنید.',
      ],
      en: [
        'ElevenLabs delivers lifelike text-to-speech across 30+ languages with natural pacing, intonation, and emotion.',
        'Includes Instant & Professional Voice Cloning, AI Dubbing Studio, Sound Effects generation, and low-latency Conversational Voice APIs.',
      ],
    },
    keyFeatures: {
      fa: [
        'تبدیل متن به گفتار فوق‌طبیعی به زبان فارسی و انگلیسی',
        'شبیه‌سازی (کلون) صدا تنها با یک دقیقه نمونه صوتی',
        'دوبله خودکار ویدیو با حفظ لحن گوینده اصلی',
        'تولید افکت‌های صوتی و API بسیار کم‌تاخیر',
      ],
      en: [
        'Human-Like Multilingual Text-to-Speech',
        'Instant & Professional Voice Cloning',
        'End-to-End Video Dubbing Studio',
        'AI Sound Effects & Real-Time Voice API',
      ],
    },
    whoIsItFor: {
      fa: [
        'مدرسین دوره‌ها و سازندگان کتاب صوتی و پادکست',
        'یوتیوبرها و تیم‌های دوبله محتوا',
        'توسعه‌دهندگان دستیارهای تلفنی و صوتی AI',
      ],
      en: [
        'Course Instructors & Audiobook Producers',
        'YouTubers & Dubbing Studios',
        'Voice AI Agent Developers',
      ],
    },
    pricingDetails: {
      fa: 'دارای پلن رایگان دائمی (۱۰ هزار کاراکتر ماهانه) و پلن Starter با قیمت ۵ دلار در ماه.',
      en: 'Free forever tier (10k chars/mo); Starter ($5/mo) unlocks commercial rights and instant voice cloning.',
    },
    likedFor: [
      { label: { fa: 'طبیعی بودن لحن و تلفظ کلمات', en: 'Lifelike vocal realism' }, count: 281, total: 294 },
      { label: { fa: 'پشتیبانی دقیق از فارسی در مدل Multilingual', en: 'Multilingual v2 clarity' }, count: 256, total: 294 },
    ],
    steps: {
      fa: [
        'در elevenlabs.io وارد بخش Speech Synthesis شوید.',
        'مدل Eleven Multilingual v2 و صدای دلخواه خود را انتخاب کنید.',
        'متن را وارد کرده و فایل MP3 یا WAV استودیویی را دانلود کنید.',
      ],
      en: [
        'Open Speech Synthesis on elevenlabs.io.',
        'Choose Eleven Multilingual v2 and select or clone a voice.',
        'Generate and export studio-quality MP3/WAV audio.',
      ],
    },
  },
  {
    id: 'tool-suno',
    name: 'Suno AI',
    provider: 'Suno',
    tagline: {
      fa: 'ساخت آهنگ کامل همراه با خواننده، ملودی و تنظیم حرفه‌ای تنها با یک متن',
      en: 'Create full studio songs with vocals, lyrics & instrumentation from text.',
    },
    task: 'Audio & Music',
    subCategory: { fa: 'ساخت موسیقی و آهنگ', en: 'Music' },
    input: 'Prompt',
    output: 'Audio',
    pricing: 'Freemium',
    startingPrice: { fa: 'رایگان / ۸ دلار/ماه', en: 'Free / $8 mo' },
    roles: ['Creator', 'Designer'],
    verified: true,
    hasMobileApp: true,
    popularityScore: 95,
    usersCount: 1290,
    likes: 238,
    dislikes: 10,
    thumbnail: courseVideomiImg,
    url: 'https://suno.com',
    description: {
      fa: 'تولید موسیقی اورجینال، موسیقی متن ویدیو و ترانه‌های کامل در هر سبک موسیقی بدون نیاز به دانش آهنگ‌سازی.',
      en: 'Generate complete multi-minute songs, vocals, and royalty-free background tracks in seconds.',
    },
    longDescription: {
      fa: [
        'Suno AI می‌تواند تنها با دریافت موضوع یا شعر دلخواه شما، یک قطعه موسیقی کامل شامل صدای خواننده، سازبندی، میکس و مسترینگ را در سبک‌های پاپ، راک، سنتی، الکترونیک و بیکلام تولید کند.',
      ],
      en: [
        'Suno transforms simple prompts or custom lyrics into radio-ready tracks complete with vocals, harmonies, and studio instrumentation across any genre.',
      ],
    },
    keyFeatures: {
      fa: [
        'ساخت هم‌زمان ملودی، تنظیم و صدای خواننده',
        'امکان وارد کردن شعر اختصاصی (حتی فارسی)',
        'تولید موسیقی متن بیکلام بدون کپی‌رایت برای ویدیو',
        'قابلیت جداسازی لاین‌های صدا و ساز (Stems)',
      ],
      en: [
        'Full Vocals + Instrumentation Generation',
        'Custom Lyrics & Structure Tagging',
        'Royalty-Free Video Background Tracks',
        'Stem Separation & Track Extension',
      ],
    },
    whoIsItFor: {
      fa: [
        'تولیدکنندگان ویدیو و پادکست نیازمند موسیقی بدون کپی‌رایت',
        'هنرمندان، ترانه‌سرایان و آژانس‌های تبلیغاتی',
        'ساخت جینگل و موسیقی معرفی برند',
      ],
      en: [
        'Video Creators Needing Custom Soundtracks',
        'Songwriters & Musicians',
        'Ad Agencies & Brand Jingles',
      ],
    },
    pricingDetails: {
      fa: '۵۰ امتیاز رایگان روزانه (حدود ۱۰ آهنگ) در پلن Free و حق مالکیت تجاری با اشتراک Pro از ۸ دلار در ماه.',
      en: '50 free daily credits (~10 songs); Pro ($8/mo billed annually) includes commercial ownership.',
    },
    steps: {
      fa: [
        'در suno.com حالت Create و Custom Mode را باز کنید.',
        'سبک موسیقی (مثلاً Ambient Electronic یا Pop) و شعر یا حالت بیکلام را مشخص کنید.',
        'آهنگ تولیدشده را گوش داده و فایل صوتی یا ویدیویی را دانلود کنید.',
      ],
      en: [
        'Open Create -> Custom Mode on suno.com.',
        'Specify style tags or paste custom lyrics.',
        'Generate variations and download WAV/MP3.',
      ],
    },
  },
  {
    id: 'tool-heygen',
    name: 'HeyGen',
    provider: 'HeyGen',
    tagline: {
      fa: 'ساخت ویدیو با آواتار و مجری هوش مصنوعی همراه با همگام‌سازی لب (Lip-Sync)',
      en: 'AI spokesperson avatars and multilingual video translation with lip-sync.',
    },
    task: '3D & Avatar',
    subCategory: { fa: 'آواتار و مجری ویدیویی', en: 'Avatar' },
    input: 'Text',
    output: 'Video',
    pricing: 'Free Trial',
    startingPrice: { fa: 'تست رایگان / ۲۹ دلار/ماه', en: 'Free Trial / $29 mo' },
    roles: ['Creator', 'Business', 'Designer'],
    verified: true,
    hasApi: true,
    popularityScore: 94,
    usersCount: 970,
    likes: 178,
    dislikes: 12,
    thumbnail: courseBotImg,
    url: 'https://heygen.com',
    description: {
      fa: 'ساخت ویدیوهای آموزشی و معرفی محصول با مجریان کاملاً واقعی بدون نیاز به دوربین و استودیو، به همراه ترجمه ویدیو با تغییر حرکت لب.',
      en: 'Create studio-quality presenter videos from text scripts and translate existing videos with natural lip-sync.',
    },
    longDescription: {
      fa: [
        'HeyGen به شما امکان می‌دهد متن اسکریپت خود را به یک ویدیوی حرفه‌ای با مجری یا آواتار شخصی خودتان تبدیل کنید.',
        'ابزار Video Translate در HeyGen می‌تواند هر ویدیویی را به ده‌ها زبان دنیا ترجمه کند، طوری که صدای خود شما حفظ شود و حرکت لب‌ها دقیقاً با زبان جدید هماهنگ گردد.',
      ],
      en: [
        'HeyGen lets educators and marketers turn text scripts into polished talking-head videos using hyper-realistic stock or custom digital twin avatars.',
        'Its Video Translate feature clones your voice and matches lip movements automatically across 40+ languages.',
      ],
    },
    keyFeatures: {
      fa: [
        'ساخت آواتار دیجیتال شخصی از روی یک ویدیوی ۲ دقیقه‌ای',
        'ترجمه ویدیوهای آموزشی با Lip-Sync دقیق لب‌ها',
        'بیش از ۱۰۰ مجری آماده در پوشش‌ها و محیط‌های متنوع',
        'API خودکارسازی تولید ویدیوهای شخصی‌سازی‌شده',
      ],
      en: [
        'Custom Digital Twin Avatar Creation',
        'Lip-Synced Multilingual Video Translation',
        '100+ Studio Stock Presenters',
        'Streaming Avatar & Video Generation API',
      ],
    },
    whoIsItFor: {
      fa: [
        'مدرسین و تولیدکنندگان دوره‌های آموزشی',
        'تیم‌های فروش، بازاریابی و پشتیبانی مشتریان',
        'کسب‌وکارهای بین‌المللی برای بومی‌سازی ویدیوها',
      ],
      en: [
        'Online Course Creators & Educators',
        'B2B Sales & Marketing Teams',
        'Global Content Localization Teams',
      ],
    },
    pricingDetails: {
      fa: 'دارای پلن تست رایگان برای ساخت ۳ ویدیو و اشتراک Creator از ۲۹ دلار ماهانه.',
      en: 'Free plan includes 3 trial videos; Creator plan starts at $29/mo for unlimited standard avatars.',
    },
    steps: {
      fa: [
        'در heygen.com یک آواتار آماده انتخاب یا تصویر خودتان را بسازید.',
        'متن اسکریپت و صدای مورد نظر را جایگذاری کنید.',
        'روی Submit کلیک کنید تا ویدیو با کیفیت Full HD رندر شود.',
      ],
      en: [
        'Pick an avatar or record a 2-minute digital twin on heygen.com.',
        'Paste your script or upload an existing video to translate.',
        'Render and download 1080p MP4.',
      ],
    },
  },
  {
    id: 'tool-gamma',
    name: 'Gamma',
    provider: 'Gamma Tech',
    tagline: {
      fa: 'ساخت اسلاید ارائه (پاورپوینت)، داکیومنت و صفحه وب در ۳۰ ثانیه از روی متن',
      en: 'Create styled pitch decks, presentations & webpages from a prompt.',
    },
    task: 'Writing & SEO',
    subCategory: { fa: 'ساخت ارائه و پاورپوینت', en: 'Presentations' },
    input: 'Text',
    output: 'Presentation',
    pricing: 'Freemium',
    startingPrice: { fa: 'رایگان / ۸ دلار/ماه', en: 'Free / $8 mo' },
    roles: ['Business', 'Creator', 'Researcher'],
    verified: true,
    hasApi: true,
    popularityScore: 94,
    usersCount: 1180,
    likes: 215,
    dislikes: 7,
    thumbnail: heroDeskImg,
    url: 'https://gamma.app',
    description: {
      fa: 'جایگزین مدرن پاورپوینت؛ کافی است موضوع یا جزوه خود را وارد کنید تا اسلایدهای گرافیکی چیدمان‌شده با نمودار و تصویر بسازد.',
      en: 'Generates clean, responsive slide decks and documents with AI-sourced imagery and smart layouts.',
    },
    longDescription: {
      fa: [
        'Gamma وقت‌گیرترین بخش آماده کردن پاورپوینت و پروپوزال یعنی صفحه‌آرایی، انتخاب فونت، چیدمان کارت‌ها و پیدا کردن تصویر مناسب را کاملاً خودکار انجام می‌دهد.',
        'پشتیبانی مناسب از متن فارسی و خروجی مستقیم به فرمت PowerPoint (.pptx)، PDF و لینک تعاملی تحت وب از ویژگی‌های محبوب آن است.',
      ],
      en: [
        'Gamma eliminates manual slide formatting by turning rough outlines, notes, or URLs into cohesive presentations, reports, and microsites.',
        'Export cleanly to PowerPoint, PDF, Google Slides, or share as an interactive web deck.',
      ],
    },
    keyFeatures: {
      fa: [
        'تبدیل آنی متن یا فایل ورد به اسلایدهای گرافیکی',
        'پشتیبانی خوب از چیدمان راست‌به‌چپ (RTL) فارسی',
        'تولید خودکار تصاویر اسلایدها و نمودارهای مقایسه‌ای',
        'خروجی قابل ویرایش PowerPoint (.pptx) و PDF',
      ],
      en: [
        'Instant Outline-to-Deck Generation',
        'Smart Card Layouts, Tables & Charts',
        'Built-In AI Image Generation per Slide',
        'One-Click PPTX & PDF Exports',
      ],
    },
    whoIsItFor: {
      fa: [
        'مدیران استارتاپ برای ساخت Pitch Deck سرمایه‌گذار',
        'مدرسین، اساتید و دانشجویان برای ارائه کلاسی',
        'مشاوران و تیم‌های فروش برای تهیه پروپوزال',
      ],
      en: [
        'Startup Founders Building Pitch Decks',
        'Educators & Students',
        'Consultants & Sales Teams',
      ],
    },
    pricingDetails: {
      fa: 'شامل ۴۰۰ کردیت رایگان در زمان ثبت‌نام و پلن Plus به قیمت ۸ دلار ماهانه برای حذف واترمارک.',
      en: 'Starts with 400 free AI credits; Plus ($8/mo) removes Gamma branding and unlocks unlimited generation.',
    },
    steps: {
      fa: [
        'در gamma.app گزینه Generate یا Paste in text را انتخاب کنید.',
        'موضوع ارائه، تعداد اسلایدها و زبان (فارسی/انگلیسی) را برگزینید.',
        'تم بصری دلخواه را انتخاب و فایل PPTX نهایی را دریافت کنید.',
      ],
      en: [
        'Click Create New -> Generate on gamma.app.',
        'Enter your topic or paste raw notes and pick slide count.',
        'Pick a visual theme and export PPTX or share link.',
      ],
    },
  },
  {
    id: 'tool-julius',
    name: 'Julius AI',
    provider: 'Julius',
    tagline: {
      fa: 'دانشمند داده هوشمند برای تحلیل فایل‌های اکسل، CSV و رسم نمودارهای آماری',
      en: 'AI data analyst for Excel, CSV, SQL & statistical visualization.',
    },
    task: 'Data & Finance',
    subCategory: { fa: 'تحلیل داده و اکسل', en: 'Data Analysis' },
    input: 'Spreadsheet',
    output: 'Dashboard',
    pricing: 'Freemium',
    startingPrice: { fa: 'رایگان / ۲۰ دلار/ماه', en: 'Free / $20 mo' },
    roles: ['Analyst', 'Business', 'Researcher'],
    verified: true,
    hasMobileApp: true,
    popularityScore: 92,
    usersCount: 790,
    likes: 146,
    dislikes: 6,
    thumbnail: courseHesabyarImg,
    url: 'https://julius.ai',
    description: {
      fa: 'فایل اکسل یا دیتابیس خود را آپلود کنید و به زبان ساده سوال بپرسید تا تحلیل آماری، پاک‌سازی داده و نمودار حرفه‌ای تحویل بگیرید.',
      en: 'Chat with spreadsheets and databases to run Python/R statistical models and export publication-grade charts.',
    },
    longDescription: {
      fa: [
        'Julius AI نقش یک تحلیل‌گر داده و برنامه‌نویس پایتون را برای شما ایفا می‌کند؛ فایل‌های سنگین اکسل، CSV یا Google Sheets را بررسی کرده، خطاهای داده را تمیز می‌کند و نمودارهای دقیق رگرسیون، روند فروش و پیش‌بینی را رسم می‌کند.',
      ],
      en: [
        'Julius AI runs secure Python and R code behind the scenes so non-technical analysts can clean messy spreadsheets, run regressions, and build executive charts conversationally.',
      ],
    },
    keyFeatures: {
      fa: [
        'اتصال مستقیم به Excel، CSV، Google Sheets و Postgres',
        'اجرای خودکار کدهای تحلیلی Python و R در پس‌زمینه',
        'رسم نمودارهای تعاملی و خروجی گرافیکی آماده گزارش',
        'پاک‌سازی داده‌های تکراری و ناقص در چند ثانیه',
      ],
      en: [
        'Excel, CSV, Google Sheets & SQL Connectors',
        'Automated Python & R Statistical Modeling',
        'Interactive Charts & Forecast Visuals',
        'Instant Data Cleaning & Transformation',
      ],
    },
    whoIsItFor: {
      fa: [
        'تحلیل‌گران مالی، فروش و هوش تجاری (BI)',
        'پژوهشگران و دانشجویان برای تحلیل آماری پایان‌نامه',
        'مدیران فروشگاه‌های آنلاین و استارتاپ‌ها',
      ],
      en: [
        'Finance & Business Intelligence Analysts',
        'Academic Researchers & Grad Students',
        'Growth & E-commerce Leads',
      ],
    },
    pricingDetails: {
      fa: 'تا ۱۵ پیام تحلیل رایگان در ماه و اشتراک پایه با هزینه ۲۰ دلار برای فایل‌ها و تحلیل‌های نامحدود.',
      en: 'Free up to 15 monthly analyses; Paid tiers start at $20/mo for larger datasets and unlimited chats.',
    },
    steps: {
      fa: [
        'فایل اکسل یا CSV را در julius.ai آپلود کنید.',
        'سوال تحلیلی خود را بنویسید (مثلاً میانگین فروش ماهانه و پیش‌بینی فصل بعد).',
        'نمودارها و فایل اکسل پاک‌سازی‌شده را دانلود کنید.',
      ],
      en: [
        'Upload your CSV/XLSX dataset to julius.ai.',
        'Ask for trends, correlations, or cleaned columns.',
        'Download PNG charts or transformed Excel sheets.',
      ],
    },
  },
  {
    id: 'tool-n8n',
    name: 'n8n',
    provider: 'n8n GmbH',
    tagline: {
      fa: 'قدرتمندترین پلتفرم متن‌باز اتوماسیون گردش‌کار و ساخت ایجنت‌های AI',
      en: 'Open-source node-based workflow automation & AI agent orchestrator.',
    },
    task: 'Automation & Agents',
    subCategory: { fa: 'اتوماسیون و ایجنت AI', en: 'Automation' },
    input: 'Prompt',
    output: 'Workflow',
    pricing: 'Freemium',
    startingPrice: { fa: 'رایگان (Self-Host) / ۲۰ یورو', en: 'Free Self-Host / €20 mo' },
    roles: ['Developer', 'Business'],
    verified: true,
    featured: true,
    hasApi: true,
    isOpenSource: true,
    popularityScore: 97,
    usersCount: 1340,
    likes: 276,
    dislikes: 7,
    thumbnail: courseBotImg,
    url: 'https://n8n.io',
    description: {
      fa: 'ساخت جریان‌های خودکار بدون محدودیت بین تلگرام، بله، ووکامرس، ایمیل و مدل‌های هوش مصنوعی با امکان نصب رایگان روی سرور شخصی.',
      en: 'Visual workflow builder with 400+ integrations, native LangChain AI Agent nodes, and self-hosting freedom.',
    },
    longDescription: {
      fa: [
        'n8n محبوب‌ترین ابزار اتوماسیون برای تیم‌های فنی و مهندسان AI است که اجازه می‌دهد بدون هزینه‌های بالای اشتراک دلاری، ربات‌های تلگرام، پایگاه داده، وب‌هوک‌های وردپرس و مدل‌های زبانی را به هم متصل کنید.',
        'برخلاف ابزارهای بسته، می‌توانید نسخه کامل Community را روی سرور شخصی خودتان نصب کنید و از گره‌های اختصاصی AI Agent، حافظه چت و کد جاوااسکریپت/پایتون بهره ببرید.',
      ],
      en: [
        'n8n gives developers and automation teams full control over complex workflows with 400+ app nodes, custom HTTP/Webhook blocks, and native AI Agent orchestration.',
        'Self-host for free with Docker to keep sensitive data in-house while automating CRM, messaging bots, and RAG pipelines.',
      ],
    },
    keyFeatures: {
      fa: [
        'نصب رایگان و نامحدود روی سرور شخصی (Self-Hosted)',
        'نودهای اختصاصی AI Agent، حافظه گفتگو و Vector DB',
        'بیش از ۴۰۰ اتصال آماده (Telegram، WooCommerce، Sheets)',
        'پشتیبانی از کدهای سفارشی JavaScript و Python',
      ],
      en: [
        'Fair-Code Self-Hosting Freedom',
        'Native AI Agent, RAG & Memory Nodes',
        '400+ App Connectors & Custom Webhooks',
        'Inline JavaScript & Python Code Nodes',
      ],
    },
    whoIsItFor: {
      fa: [
        'توسعه‌دهندگان اتوماسیون و ربات‌های تلگرام/بله',
        'مهندسان سیستم‌های هوش مصنوعی سازمانی',
        'مدیران سایت‌های وردپرس و فروشگاه‌های آنلاین',
      ],
      en: [
        'Automation Engineers & Bot Builders',
        'AI Systems Architects',
        'Technical Startup Founders',
      ],
    },
    pricingDetails: {
      fa: 'نسخه نصب روی سرور شخصی (Self-Hosted) کاملاً رایگان است و نسخه ابری مدیریت‌شده از ۲۰ یورو در ماه شروع می‌شود.',
      en: 'Self-hosted Community Edition is free; Managed Cloud plans start at €20/mo.',
    },
    steps: {
      fa: [
        'n8n را با Docker روی سرور نصب یا از نسخه ابری n8n.io استفاده کنید.',
        'یک Trigger (مانند Webhook یا پیام تلگرام) اضافه کنید.',
        'نود AI Agent و خروجی نهایی را با کشیدن و رها کردن متصل کنید.',
      ],
      en: [
        'Deploy n8n via Docker or open n8n.io Cloud.',
        'Add a Webhook, Schedule, or Telegram Trigger.',
        'Connect an AI Agent node and downstream actions.',
      ],
    },
  },
  {
    id: 'tool-make',
    name: 'Make (Integromat)',
    provider: 'Make',
    tagline: {
      fa: 'پلتفرم بصری بدون نیاز به کدنویسی برای اتصال هزاران سرویس و اتوماسیون فروش',
      en: 'Visual drag-and-drop no-code platform to connect apps & AI workflows.',
    },
    task: 'Automation & Agents',
    subCategory: { fa: 'اتوماسیون بدون کد', en: 'No-Code Automation' },
    input: 'Text',
    output: 'Workflow',
    pricing: 'Freemium',
    startingPrice: { fa: 'رایگان / ۹ دلار/ماه', en: 'Free / $9 mo' },
    roles: ['Business', 'Creator', 'Analyst'],
    verified: true,
    hasApi: true,
    popularityScore: 93,
    usersCount: 1090,
    likes: 185,
    dislikes: 9,
    thumbnail: servicesNeuralImg,
    url: 'https://make.com',
    description: {
      fa: 'طراحی سناریوهای اتوماسیون با رابط بصری حباب‌دار و قیمت بسیار به‌صرفه‌تر از Zapier برای خودکارسازی بازاریابی و پشتیبانی.',
      en: 'Build, monitor, and scale multi-step app integrations visually without writing code.',
    },
    longDescription: {
      fa: [
        'Make یکی از خوش‌ساخت‌ترین ابزارهای No-Code برای خودکارسازی فرآیندهای کسب‌وکار است که بیش از ۱۸۰۰ اپلیکیشن از جمله OpenAI، تلگرام، گوگل‌شیت، جیمیل و ووکامرس را به صورت بصری به هم متصل می‌کند.',
      ],
      en: [
        'Make lets non-developers design intricate branching workflows using visual bubbles connecting 1,800+ apps with error handlers and routers.',
      ],
    },
    keyFeatures: {
      fa: [
        'رابط گرافیکی بسیار روان با شرط‌ها و حلقه‌ها (Routers)',
        'پشتیبانی از بیش از ۱۸۰۰ سرویس و وب‌هوک دلخواه',
        'هزینه اشتراک بسیار اقتصادی‌تر نسبت به رقبا',
        'قالب‌های آماده برای خودکارسازی شبکه‌های اجتماعی و CRM',
      ],
      en: [
        'Visual Scenario Canvas with Routers & Filters',
        '1,800+ Pre-Built App Integrations',
        'Cost-Effective Operation Quotas',
        'Ready-Made Marketing & CRM Templates',
      ],
    },
    whoIsItFor: {
      fa: [
        'تیم‌های بازاریابی دیجیتال و فروش',
        'کسب‌وکارهای بدون تیم برنامه‌نویسی',
        'فریلنسرها برای اتوماسیون ارسال گزارش و فاکتور',
      ],
      en: [
        'Marketing & Revenue Operations Teams',
        'No-Code Founders & Freelancers',
        'Customer Success Managers',
      ],
    },
    pricingDetails: {
      fa: 'دارای پلن رایگان تا ۱۰۰۰ عملیات در ماه و پلن Core با قیمت ۹ دلار ماهانه برای ۱۰ هزار عملیات.',
      en: 'Free plan includes 1,000 ops/month; Core starts at $9/mo for 10,000 operations.',
    },
    steps: {
      fa: [
        'در make.com یک Scenario جدید ایجاد کنید.',
        'ماژول مبدا (مثلاً فرم ثبت‌نام یا گوگل‌شیت) و ماژول هوش مصنوعی را بگذارید.',
        'سناریو را روی حالت Active قرار دهید تا ۲۴ ساعته اجرا شود.',
      ],
      en: [
        'Create a new Scenario on make.com.',
        'Link your trigger app, an OpenAI module, and target action.',
        'Toggle Scheduling ON to run automatically.',
      ],
    },
  },
  {
    id: 'tool-notebooklm',
    name: 'NotebookLM',
    provider: 'Google',
    tagline: {
      fa: 'دستیار هوشمند مطالعه اسناد و تبدیل جزوات و مقالات به پادکست صوتی تحلیلی',
      en: 'Source-grounded AI research notebook that turns docs into Audio Overviews.',
    },
    task: 'Research & Study',
    subCategory: { fa: 'پژوهش و یادگیری', en: 'Research & Education' },
    input: 'Document',
    output: 'Audio',
    pricing: 'Free',
    startingPrice: { fa: 'کاملاً رایگان', en: 'Free' },
    roles: ['Researcher', 'Creator', 'Analyst'],
    verified: true,
    hasMobileApp: true,
    popularityScore: 96,
    usersCount: 1510,
    likes: 288,
    dislikes: 5,
    thumbnail: courseAiImg,
    url: 'https://notebooklm.google.com',
    description: {
      fa: 'محصول رایگان گوگل که فقط از روی فایل‌های PDF، ویدیوهای یوتیوب و لینک‌های خودتان پاسخ می‌دهد و از تمام آن‌ها پادکست صوتی دو‌نفره می‌سازد.',
      en: 'Google’s zero-hallucination study assistant grounded strictly in your PDFs, YouTube links, and docs.',
    },
    longDescription: {
      fa: [
        'NotebookLM انقلابی در یادگیری و پژوهش ایجاد کرده است؛ کافی است ده‌ها فایل PDF، مقاله یا لینک یوتیوب را در یک دفترچه بارگذاری کنید تا بدون اطلاعات جعلی، دقیقاً با استناد به شماره صفحه منابع شما پاسخ دهد.',
        'مشهورترین قابلیت آن Audio Overview است که کل کتاب یا جزوه شما را به یک گفتگوی صوتی جذاب و قابل تعامل (حتی با پشتیبانی از فارسی) تبدیل می‌کند.',
      ],
      en: [
        'NotebookLM grounds every answer strictly inside the PDFs, Google Docs, web URLs, and YouTube videos you upload—showing exact inline source excerpts.',
        'Its signature Audio Overview transforms dense reports into engaging, natural podcast-style discussions.',
      ],
    },
    keyFeatures: {
      fa: [
        'پاسخگویی کاملاً مستند و بدون توهم فقط از منابع شما',
        'تبدیل جزوه و مقاله به پادکست صوتی (Audio Overview)',
        'پشتیبانی هم‌زمان از PDF، لینک سایت، یوتیوب و Google Docs',
        'تولید خودکار نقشه ذهنی (Mind Map)، راهنمای مطالعه و آزمون',
      ],
      en: [
        'Strict Source-Grounded Answers & Citations',
        'Interactive AI Podcast Audio Overviews',
        'PDF, YouTube, Web & Docs Ingestion',
        'Auto Study Guides, FAQs & Mind Maps',
      ],
    },
    whoIsItFor: {
      fa: [
        'دانشجویان، اساتید و پژوهشگران دانشگاهی',
        'مدیران برای مرور سریع گزارش‌های طولانی',
        'علاقه‌مندان به یادگیری عمیق و ساخت خلاصه صوتی',
      ],
      en: [
        'Students, Teachers & Researchers',
        'Executives Reviewing Dense Briefings',
        'Self-Learners & Knowledge Workers',
      ],
    },
    pricingDetails: {
      fa: 'استفاده از امکانات اصلی کاملاً رایگان با حساب گوگل و حجم بسیار سخاوتمندانه بارگذاری منابع است.',
      en: 'Completely free to use with a Google account; Plus tier available via Google One AI Premium.',
    },
    likedFor: [
      { label: { fa: 'کاملاً رایگان بدون افت کیفیت', en: 'Free with generous limits' }, count: 279, total: 288 },
      { label: { fa: 'پادکست صوتی از روی فایل PDF', en: 'Podcast Audio Overviews' }, count: 264, total: 288 },
    ],
    steps: {
      fa: [
        'وارد notebooklm.google.com شوید و یک Notebook بسازید.',
        'فایل‌های PDF، مقالات یا لینک‌های آموزشی خود را آپلود کنید.',
        'سوال خود را بپرسید یا روی Audio Overview کلیک کنید.',
      ],
      en: [
        'Create a notebook at notebooklm.google.com.',
        'Add up to 50 PDFs, docs, websites, or YouTube links.',
        'Generate a Mind Map, Study Guide, or Audio Overview.',
      ],
    },
  },
  {
    id: 'tool-v0-vercel',
    name: 'v0 by Vercel',
    provider: 'Vercel',
    tagline: {
      fa: 'تولید رابط کاربری مدرن وب، کامپوننت‌های React و وب‌اپلیکیشن از روی پرامپت',
      en: 'Generative UI & full-stack Next.js/Tailwind web builder by Vercel.',
    },
    task: 'Code Assistant',
    subCategory: { fa: 'طراحی وب و رابط کاربری', en: 'AI Website Builder' },
    input: 'Prompt',
    output: 'Code',
    pricing: 'Freemium',
    startingPrice: { fa: 'رایگان / ۲۰ دلار/ماه', en: 'Free / $20 mo' },
    roles: ['Developer', 'Designer', 'Business'],
    verified: true,
    hasApi: true,
    popularityScore: 95,
    usersCount: 1050,
    likes: 196,
    dislikes: 7,
    thumbnail: heroDeskImg,
    url: 'https://v0.dev',
    description: {
      fa: 'توصیف ایده صفحه فرود یا داشبورد خود را بنویسید تا بلافاصله با Tailwind CSS و React طراحی و پیش‌نمایش زنده شود.',
      en: 'Describe your UI or upload a Figma/screenshot mockup to generate production Tailwind & React components.',
    },
    longDescription: {
      fa: [
        'v0 ابزار هوش مصنوعی شرکت Vercel برای تبدیل ایده‌های متنی یا اسکرین‌شات طراحی به کدهای تمیز React، Next.js و Tailwind CSS با قابلیت پیش‌نمایش زنده در مرورگر و انتشار فوری روی وب است.',
      ],
      en: [
        'v0 generates responsive, accessible web interfaces from text prompts or uploaded screenshots and deploys them live to Vercel with a single click.',
      ],
    },
    keyFeatures: {
      fa: [
        'تبدیل متن یا عکس موکاپ به کد React و Tailwind',
        'پیش‌نمایش زنده و تعاملی داخل مرورگر',
        'انتشار مستقیم روی اینترنت تنها با یک کلیک',
        'خروجی استاندارد قابل استفاده در پروژه‌های واقعی',
      ],
      en: [
        'Text & Screenshot-to-React/Tailwind Code',
        'Live Interactive Browser Sandbox',
        'One-Click Production Deployment',
        'Clean Modular Component Export',
      ],
    },
    whoIsItFor: {
      fa: [
        'توسعه‌دهندگان فرانت‌اند و طراحان محصول',
        'استارتاپ‌ها برای ساخت سریع نمونه اولیه (MVP)',
        'طراحان رابط کاربری (UI/UX)',
      ],
      en: [
        'Frontend & Full-Stack Engineers',
        'UI/UX Designers Prototyping Live Apps',
        'Founders Launching MVPs Fast',
      ],
    },
    pricingDetails: {
      fa: 'دارای اعتبار رایگان ماهانه در پلن Free و اشتراک Premium به قیمت ۲۰ دلار در ماه.',
      en: 'Free monthly message credits included; Premium plans start at $20/mo.',
    },
    steps: {
      fa: [
        'وارد v0.dev شوید و توضیح صفحه یا داشبورد را بنویسید.',
        'طراحی تولیدشده را در پیش‌نمایش زنده بررسی و با پیام جدید اصلاح کنید.',
        'کد را کپی کرده یا مستقیماً Deploy کنید.',
      ],
      en: [
        'Open v0.dev and describe your layout or upload a mockup.',
        'Iterate on colors, spacing, and components via chat.',
        'Copy clean code or deploy straight to Vercel.',
      ],
    },
  },
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'n1',
    title: {
      fa: 'جلسه جدید دوره هوش مصنوعی منتشر شد',
      en: 'New AI Engineering Lesson Published',
    },
    detail: {
      fa: 'ویدیوی «طراحی پایگاه دانش اختصاصی» به فصل اول اضافه شد.',
      en: 'Module 1 lesson "Building a Custom RAG Agent" is now live.',
    },
    time: { fa: '۱۵ دقیقه پیش', en: '15m ago' },
    read: false,
    channel: 'lms',
  },
  {
    id: 'n2',
    title: {
      fa: 'ارسال موفق به ربات تلگرام',
      en: 'Telegram Bot Delivery Confirmed',
    },
    detail: {
      fa: 'دسترسی دوره و کلید لایسنس محصول خریداری‌شده به ربات تلگرام شما ارسال شد.',
      en: 'Your course access and product license key were delivered via @iRamoBot.',
    },
    time: { fa: '۲ ساعت پیش', en: '2h ago' },
    read: false,
    channel: 'telegram',
  },
  {
    id: 'n3',
    title: {
      fa: 'پاسخ تمرین شما در بله ثبت شد',
      en: 'Assignment Graded · 96/100',
    },
    detail: {
      fa: 'نمره ۹۶ از ۱۰۰ برای پروژه اول شما ثبت و در پیام‌رسان بله اطلاع‌رسانی شد.',
      en: 'Lab 1 graded 96/100 and synced with your Bale messenger.',
    },
    time: { fa: 'دیروز', en: 'Yesterday' },
    read: true,
    channel: 'bale',
  },
];
