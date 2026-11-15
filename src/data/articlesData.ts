import {
  courseAiImg,
  courseBotImg,
  courseHesabyarImg,
  courseVideomiImg,
  servicesNeuralImg,
} from '../assets/media';
import { Article } from '../types/lms';

export const ARTICLES_DATA: Article[] = [
  {
    id: 'art-telegram-bale-woo',
    slug: 'telegram-bale-woocommerce-automation',
    title: {
      fa: 'معماری اتصال همزمان ربات تلگرام و بله به فروشگاه ووکامرس و المنتور پرو',
      en: 'Architecting Unified Telegram & Bale Bot Delivery for WooCommerce & Elementor Pro',
    },
    excerpt: {
      fa: 'چگونه با یک کد واحد و بدون افزونه‌های سنگین، بلافاصله بعد از پرداخت موفق کاربر، لینک دوره، کلید لایسنس و کد ورود دو مرحله‌ای را در تلگرام و بله ارسال کنیم.',
      en: 'How to dispatch course access, license keys, and zero-cost OTP verification across both Telegram and Bale from a single WordPress plugin.',
    },
    category: 'Bots',
    tags: {
      fa: ['ربات بله', 'ربات تلگرام', 'ووکامرس', 'المنتور پرو'],
      en: ['Telegram Bot', 'Bale Bot', 'WooCommerce', 'Elementor Pro'],
    },
    author: { fa: 'تیم مهندسی iRamo', en: 'iRamo Engineering' },
    publishedAt: { fa: '۱۸ آبان ۱۴۰۵', en: 'Nov 09, 2026' },
    readMinutes: 7,
    views: 2480,
    featured: true,
    isDemo: true,
    thumbnail: courseBotImg,
    relatedCourseId: 'telegram-bale-bot-engineering',
    sections: [
      {
        id: 'sec-1',
        heading: {
          fa: 'چرا اتصال همزمان تلگرام و بله مزیت رقابتی می‌سازد؟',
          en: 'Why Dual Messenger Delivery Matters',
        },
        body: {
          fa: 'در بازار ایران بخشی از دانشجویان و مشتریان روی پیام‌رسان بله و بخش دیگر روی تلگرام فعال هستند. چون ساختار API بله (tapi.bale.ai) شباهت بالایی به Bot API تلگرام دارد، می‌توانیم با یک لایه انتزاعی تمیز هر دو پیام‌رسان را همزمان پشتیبانی کنیم و هزینه ارسال پیامک تایید (OTP) را تقریباً به صفر برسانیم.',
          en: 'Because Bale Bot API (tapi.bale.ai) mirrors Telegram’s webhook and sendMessage contract, a single clean PHP bridge can serve both ecosystems reliably while eliminating SMS OTP expenses.',
        },
      },
      {
        id: 'sec-2',
        heading: {
          fa: 'اتصال به قلاب پرداخت ووکامرس و فرم المنتور پرو',
          en: 'Hooking WooCommerce Orders & Elementor Forms',
        },
        body: {
          fa: 'با استفاده از اکشن woocommerce_order_status_completed به محض تایید پرداخت درگاه، متادیتای دوره به حساب کاربر اضافه می‌شود و پیام تبریک همراه با دکمه شیشه‌ای ورود مستقیم به کلاس ارسال می‌گردد. همین سازوکار برای فرم‌های مشاوره المنتور پرو (elementor_pro/forms/new_record) نیز اجرا می‌شود.',
          en: 'Hooking into woocommerce_order_status_completed grants course access immediately and fires an inline-button notification. The same bridge captures Elementor Pro form submissions for instant lead triage.',
        },
      },
      {
        id: 'sec-3',
        heading: {
          fa: 'نکات امنیتی و نگهداری در هاست اشتراکی وردپرس',
          en: 'Security & Shared Hosting Best Practices',
        },
        body: {
          fa: 'توکن ربات‌ها نباید در کدهای فرانت‌اند قرار بگیرد. تمام درخواست‌های وبهوک در سرور وردپرس با هدر مخفی و nonce معتبر بررسی شده و خروجی‌های REST API تنها با احراز هویت کاربر ذخیره می‌شوند.',
          en: 'Never expose bot tokens in client-side JavaScript. Store tokens in wp_options, validate incoming webhooks, and authenticate progress updates with WordPress REST nonces.',
        },
      },
    ],
  },
  {
    id: 'art-hesabyar-ocr',
    slug: 'ai-financial-automation-hesabyar',
    title: {
      fa: 'خودکارسازی حسابداری روزانه و خواندن فیش‌های بانکی با هوش مصنوعی در حسابیار',
      en: 'Automating Daily Bookkeeping & Receipt Parsing with Hesabyar AI',
    },
    excerpt: {
      fa: 'آشنایی با جریان تبدیل تصاویر فیش واریزی و فاکتورها به ردیف‌های ساختاریافته ترازنامه و گزارش سود و زیان ماهانه.',
      en: 'Turn receipt photos and Telegram forwards into structured ledger rows and cashflow digests automatically.',
    },
    category: 'Finance',
    tags: {
      fa: ['حسابیار', 'هوش مصنوعی', 'اتوماسیون مالی', 'پایتون'],
      en: ['Hesabyar', 'FinTech AI', 'Automation'],
    },
    author: { fa: 'آرمین راد · معمار سیستم', en: 'Armin Rad' },
    publishedAt: { fa: '۱۴ آبان ۱۴۰۵', en: 'Nov 05, 2026' },
    readMinutes: 6,
    views: 1920,
    isDemo: true,
    thumbnail: courseHesabyarImg,
    relatedCourseId: 'hesabyar-financial-automation',
    sections: [
      {
        id: 'sec-1',
        heading: {
          fa: 'مسئله ثبت دستی فیش‌ها در کسب‌وکارهای آنلاین',
          en: 'Eliminating Manual Receipt Entry',
        },
        body: {
          fa: 'صاحبان کسب‌وکار روزانه ده‌ها رسید کارت‌به‌کارت و فاکتور دریافت می‌کنند که ثبت دستی آن‌ها زمان‌بر و مستعد خطاست. موتور پردازش حسابیار با دریافت تصویر یا متن فیش در ربات، مبلغ، تاریخ شمسی، شماره پیگیری و دسته‌بندی هزینه را با فرمت JSON دقیق استخراج می‌کند.',
          en: 'Manual entry of daily transfer slips wastes hours. Hesabyar parses receipts sent in Telegram/Bale into validated amount, date, reference ID, and expense category.',
        },
      },
      {
        id: 'sec-2',
        heading: {
          fa: 'خروجی اکسل و گزارش‌گیری آخر شب در پیام‌رسان',
          en: 'Nightly Executive Digests & Excel Export',
        },
        body: {
          fa: 'در پایان هر روز کاری، خلاصه مجموع درآمد، هزینه‌ها و تراز خالص به‌صورت خودکار برای مدیر ارسال می‌شود و فایل اکسل استاندارد برای ارائه به حسابدار آماده دانلود است.',
          en: 'At the end of each day, an automated revenue vs. expense digest arrives in your messenger alongside a clean Excel export.',
        },
      },
    ],
  },
  {
    id: 'art-wp-elementor-speed',
    slug: 'fast-wordpress-elementor-react-architecture',
    title: {
      fa: 'چطور یک پنل مدرن React را بدون افت سرعت داخل وردپرس و المنتور پرو اجرا کنیم؟',
      en: 'Embedding Fast React Interfaces Inside WordPress & Elementor Pro Without Bloat',
    },
    excerpt: {
      fa: 'مقایسه روش نصب پلاگین‌های متعدد سنگین با روش مدرن بارگذاری باندل Vite داخل ویجت اختصاصی المنتور پرو و قالب Canvas.',
      en: 'Why mounting a compiled Vite bundle inside a native Elementor widget outperforms heavy legacy LMS plugins.',
    },
    category: 'WordPress',
    tags: {
      fa: ['وردپرس', 'المنتور پرو', 'بهینه‌سازی سرعت', 'هوش مصنوعی'],
      en: ['WordPress', 'Elementor Pro', 'Performance'],
    },
    author: { fa: 'تیم مهندسی iRamo', en: 'iRamo Engineering' },
    publishedAt: { fa: '۱۰ آبان ۱۴۰۵', en: 'Nov 01, 2026' },
    readMinutes: 8,
    views: 3150,
    isDemo: true,
    thumbnail: servicesNeuralImg,
    relatedCourseId: 'ai-mastery-zero-to-pro',
    sections: [
      {
        id: 'sec-1',
        heading: {
          fa: 'مشکل تداخل استایل‌ها در پلاگین‌های قدیمی وردپرس',
          en: 'Avoiding CSS & Theme Conflicts',
        },
        body: {
          fa: 'بسیاری از قالب‌ها و پلاگین‌های آموزشی ده‌ها فایل CSS و جاوااسکریپت غیرضروری در کل صفحات لود می‌کنند. در معماری جدید iRamo، فایل‌های استایل و اسکریپت فقط زمانی لود می‌شوند که شورتکد یا ویجت المنتور در صفحه وجود داشته باشد.',
          en: 'Legacy LMS plugins load dozens of blocking scripts across every page. In our architecture, assets only enqueue on pages rendering the iRamo widget or shortcode.',
        },
      },
      {
        id: 'sec-2',
        heading: {
          fa: 'ساخت قالب تمام‌صفحه Canvas و کنترل از پیشخوان وردپرس',
          en: 'Elementor Canvas & Centralized WP Admin Settings',
        },
        body: {
          fa: 'با فعال‌سازی قالب Elementor Canvas و تنظیمات مرکزی در پیشخوان وردپرس، می‌توانید لوگو، رنگ تاکیدی، وضعیت منوها و پاکسازی داده‌های نمونه را بدون نیاز به کدنویسی کنترل کنید.',
          en: 'Combining Elementor Canvas with the iRamo WP Admin Settings panel gives you full visual control over branding, menus, and demo data cleanup.',
        },
      },
    ],
  },
  {
    id: 'art-prompt-engineering-json',
    slug: 'deterministic-prompt-architecture',
    title: {
      fa: 'اصول طراحی پرامپت‌های مهندسی و دریافت خروجی ساختاریافته بدون خطا',
      en: 'Deterministic Prompt Architecture for Production AI Workflows',
    },
    excerpt: {
      fa: 'چگونه با تعریف اسکیما، مثال‌های مرجع و نقش‌های دقیق، از مدل‌های هوش مصنوعی خروجی پایدار برای نرم‌افزار و وبسایت بگیریم.',
      en: 'Use schemas, few-shot anchors, and strict role framing to eliminate flaky LLM outputs in real apps.',
    },
    category: 'AI',
    tags: {
      fa: ['پرامپت‌نویسی', 'هوش مصنوعی', 'طراحی ایجنت'],
      en: ['Prompt Engineering', 'AI Agents', 'JSON'],
    },
    author: { fa: 'سارا کاظمی · پژوهشگر AI', en: 'Sara Kazemi' },
    publishedAt: { fa: '۵ آبان ۱۴۰۵', en: 'Oct 27, 2026' },
    readMinutes: 5,
    views: 1640,
    isDemo: true,
    thumbnail: courseAiImg,
    relatedCourseId: 'ai-mastery-zero-to-pro',
    sections: [
      {
        id: 'sec-1',
        heading: {
          fa: 'ساختار سه‌لایه در پرامپت‌های حرفه‌ای',
          en: 'The Three-Layer Prompt Contract',
        },
        body: {
          fa: 'هر پرامپت قابل اتکا در محیط واقعی از سه بخش تشکیل می‌شود: دستورالعمل سیستمی و محدودیت‌ها، نمونه ورودی-خروجی استاندارد و تعریف دقیق فیلدهای خروجی.',
          en: 'Reliable prompts combine strict system constraints, concrete input-output examples, and explicit output schema rules.',
        },
      },
    ],
  },
  {
    id: 'art-videomi-workflows',
    slug: 'videomi-ai-video-courses',
    title: {
      fa: 'تولید ویدیوهای معرفی محصول و زیرنویس دوزبانه خودکار در استودیو Videomi AI',
      en: 'Producing Product Reels & Bilingual Course Captions with Videomi AI',
    },
    excerpt: {
      fa: 'تبدیل سناریوی متنی به ویدیوی حرفه‌ای با نریشن فارسی طبیعی، تصویرسازی هماهنگ و تدوین سریع برای دوره‌ها.',
      en: 'Turn written scripts into polished product teasers with synced voiceovers and bilingual captions.',
    },
    category: 'Video',
    tags: {
      fa: ['تولید ویدیو', 'Videomi AI', 'تولید محتوا'],
      en: ['Videomi AI', 'Video Production', 'Captions'],
    },
    author: { fa: 'نیما فرهادی · تدوین و AI', en: 'Nima Farhadi' },
    publishedAt: { fa: '۱ آبان ۱۴۰۵', en: 'Oct 23, 2026' },
    readMinutes: 4,
    views: 1290,
    isDemo: true,
    thumbnail: courseVideomiImg,
    relatedCourseId: 'videomi-ai-production',
    sections: [
      {
        id: 'sec-1',
        heading: {
          fa: 'خط لوله سه‌مرحله‌ای تولید محتوای ویدیویی',
          en: 'Three-Step AI Video Pipeline',
        },
        body: {
          fa: 'از سناریوی خام تا فایل نهایی ریلز یا معرفی دوره تنها در چند دقیقه: نگارش هوک اولیه، تولید نریشن همگام و اعمال زیرنویس دوزبانه با رنگ برند.',
          en: 'Go from raw script to branded product teaser in minutes: hook scripting, synced narration, and styled bilingual subtitles.',
        },
      },
    ],
  },
];
