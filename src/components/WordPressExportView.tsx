import React, { useState } from 'react';
import JSZip from 'jszip';
import {
  Check,
  Code2,
  Copy,
  Download,
  FileArchive,
  FileCode2,
  GitBranch,
  Layers,
  Package,
  Terminal,
} from 'lucide-react';
import {
  ELEMENTOR_TEMPLATE_JSON,
  GITHUB_ACTIONS_YML,
  WP_ADMIN_SETTINGS_PHP,
  WP_BOT_BRIDGE_PHP,
  WP_ELEMENTOR_WIDGETS_PHP,
  WP_PLUGIN_CORE_PHP,
  WP_THEME_CANVAS_TEMPLATE_PHP,
  WP_THEME_FOOTER_PHP,
  WP_THEME_FUNCTIONS_PHP,
  WP_THEME_HEADER_PHP,
  WP_THEME_INDEX_PHP,
  WP_THEME_STYLE_CSS,
} from '../data/wordpressPackage';
import { Lang } from '../types/lms';
import { toLocaleDigits } from '../utils/formatters';

interface WordPressExportViewProps {
  lang: Lang;
}

type CodeTab =
  | 'plugin'
  | 'admin'
  | 'elementor-widgets'
  | 'bridge'
  | 'theme-functions'
  | 'elementor-json'
  | 'github';

export const WordPressExportView: React.FC<WordPressExportViewProps> = ({
  lang,
}) => {
  const isFa = lang === 'fa';
  const [activeTab, setActiveTab] = useState<CodeTab>('plugin');
  const [copied, setCopied] = useState(false);
  const [zipLoading, setZipLoading] = useState<'theme' | 'plugin' | null>(null);

  const tabs: {
    id: CodeTab;
    label: string;
    filename: string;
    code: string;
    icon: React.ReactNode;
  }[] = [
    {
      id: 'plugin',
      label: 'iramo-ai-suite.php',
      filename: 'iramo-ai-suite.php',
      code: WP_PLUGIN_CORE_PHP,
      icon: <FileCode2 className="w-3.5 h-3.5" />,
    },
    {
      id: 'admin',
      label: 'admin-settings.php',
      filename: 'admin-settings.php',
      code: WP_ADMIN_SETTINGS_PHP,
      icon: <Layers className="w-3.5 h-3.5" />,
    },
    {
      id: 'elementor-widgets',
      label: 'elementor-widgets.php',
      filename: 'elementor-widgets.php',
      code: WP_ELEMENTOR_WIDGETS_PHP,
      icon: <Code2 className="w-3.5 h-3.5" />,
    },
    {
      id: 'bridge',
      label: 'bot-bridge.php',
      filename: 'bot-bridge.php',
      code: WP_BOT_BRIDGE_PHP,
      icon: <Terminal className="w-3.5 h-3.5" />,
    },
    {
      id: 'theme-functions',
      label: 'functions.php (قالب)',
      filename: 'functions.php',
      code: WP_THEME_FUNCTIONS_PHP,
      icon: <Package className="w-3.5 h-3.5" />,
    },
    {
      id: 'elementor-json',
      label: 'elementor-canvas.json',
      filename: 'iramo-canvas-template.json',
      code: ELEMENTOR_TEMPLATE_JSON,
      icon: <Code2 className="w-3.5 h-3.5" />,
    },
    {
      id: 'github',
      label: 'build-wordpress.yml',
      filename: 'build-wordpress-release.yml',
      code: GITHUB_ACTIONS_YML,
      icon: <GitBranch className="w-3.5 h-3.5" />,
    },
  ];

  const currentTab = tabs.find((t) => t.id === activeTab) || tabs[0];

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const handleDownloadSingle = (filename: string, content: string) => {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const triggerBlobDownload = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadThemeZip = async () => {
    setZipLoading('theme');
    try {
      const res = await fetch('/downloads/iramo-ai-theme.zip');
      if (res.ok && res.headers.get('content-type')?.includes('zip')) {
        const blob = await res.blob();
        triggerBlobDownload(blob, 'iramo-ai-theme.zip');
        return;
      }
      const zip = new JSZip();
      const folder = zip.folder('iramo-ai-theme');
      if (folder) {
        folder.file('style.css', WP_THEME_STYLE_CSS);
        folder.file('functions.php', WP_THEME_FUNCTIONS_PHP);
        folder.file('index.php', WP_THEME_INDEX_PHP);
        folder.file('header.php', WP_THEME_HEADER_PHP);
        folder.file('footer.php', WP_THEME_FOOTER_PHP);
        folder.file('page.php', WP_THEME_INDEX_PHP);
        folder.file('templates/template-canvas.php', WP_THEME_CANVAS_TEMPLATE_PHP);
        folder.file('elementor-templates/iramo-canvas-template.json', ELEMENTOR_TEMPLATE_JSON);
      }
      const blob = await zip.generateAsync({ type: 'blob' });
      triggerBlobDownload(blob, 'iramo-ai-theme.zip');
    } finally {
      setZipLoading(null);
    }
  };

  const handleDownloadPluginZip = async () => {
    setZipLoading('plugin');
    try {
      const res = await fetch('/downloads/iramo-ai-plugin.zip');
      if (res.ok && res.headers.get('content-type')?.includes('zip')) {
        const blob = await res.blob();
        triggerBlobDownload(blob, 'iramo-ai-plugin.zip');
        return;
      }
      const zip = new JSZip();
      const folder = zip.folder('iramo-ai-suite');
      if (folder) {
        folder.file('iramo-ai-suite.php', WP_PLUGIN_CORE_PHP);
        folder.file('includes/admin-settings.php', WP_ADMIN_SETTINGS_PHP);
        folder.file('includes/elementor-widgets.php', WP_ELEMENTOR_WIDGETS_PHP);
        folder.file('includes/bot-bridge.php', WP_BOT_BRIDGE_PHP);
        folder.file('elementor-templates/iramo-canvas-template.json', ELEMENTOR_TEMPLATE_JSON);
        folder.file(
          'assets/README.txt',
          'Run `npm run build:wp` or push to GitHub Actions (`.github/workflows/build-wordpress-release.yml`) to populate iramo-lms.js & iramo-lms.css in this folder automatically.'
        );
      }
      const blob = await zip.generateAsync({ type: 'blob' });
      triggerBlobDownload(blob, 'iramo-ai-plugin.zip');
    } finally {
      setZipLoading(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header + 1-Click ZIP Package Downloads */}
      <section className="rounded-2xl p-6 bg-white dark:bg-[#0B1613] border border-slate-200/80 dark:border-emerald-500/15 space-y-5">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-blue-600 dark:text-emerald-400 text-xs font-semibold">
            <Layers className="w-4 h-4" />
            <span>
              {isFa
                ? 'پکیج یکپارچه نصب قالب + افزونه + کامپایل خودکار گیت‌هاب'
                : 'Complete WordPress Theme + Plugin + GitHub Actions Suite'}
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
            {isFa
              ? 'دانلود مستقیم فایل‌های ZIP نصب قالب و افزونه وردپرس (همراه با پنل کنترل کامل)'
              : 'Download Installable Theme & Plugin ZIPs + GitHub CI Pipeline'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300/85 leading-relaxed max-w-4xl">
            {isFa
              ? 'هم قالب آماده RTL سازگار با المنتور پرو (iramo-ai-theme.zip) و هم افزونه کامل شامل پنل تنظیمات پیشخوان وردپرس، ۳ ویجت المنتور پرو، اتصال ووکامرس، ربات تلگرام/بله و دکمه پاکسازی داده‌های نمونه را می‌توانید یکجا دانلود کنید. همچنین با آپلود سورس روی گیت‌هاب، اکشن آماده گیت‌هاب فایل‌های کامپایل‌شده React را به‌صورت خودکار داخل زیپ افزونه می‌گذارد.'
              : 'Download both the Elementor-ready WordPress Theme ZIP and the modular Plugin ZIP (with Admin Control Panel, 3 Elementor widgets, Bot Bridge, and Demo Data Cleaner). Pushing to GitHub automatically compiles Vite assets into the final plugin ZIP.'}
          </p>
        </div>

        {/* Action Buttons Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          <button
            type="button"
            disabled={zipLoading !== null}
            onClick={handleDownloadThemeZip}
            className="flex items-center justify-between gap-3 p-4 rounded-xl bg-[var(--iramo-accent)] hover:bg-[var(--iramo-accent-hover)] text-[var(--iramo-accent-fg)] font-bold text-xs sm:text-sm shadow-sm transition-all cursor-pointer"
          >
            <span className="flex items-center gap-2.5 text-start">
              <FileArchive className="w-5 h-5 shrink-0" />
              <span>
                <span className="block font-extrabold">
                  {zipLoading === 'theme'
                    ? isFa
                      ? 'در حال بسته‌بندی...'
                      : 'Packaging...'
                    : isFa
                    ? 'دانلود قالب وردپرس (.zip)'
                    : 'Download WP Theme (.zip)'}
                </span>
                <span className="text-[11px] font-medium opacity-80">
                  iramo-ai-theme.zip
                </span>
              </span>
            </span>
            <Download className="w-4 h-4 shrink-0" />
          </button>

          <button
            type="button"
            disabled={zipLoading !== null}
            onClick={handleDownloadPluginZip}
            className="flex items-center justify-between gap-3 p-4 rounded-xl bg-gradient-to-l from-emerald-500 to-teal-400 text-slate-950 font-bold text-xs sm:text-sm shadow-md hover:brightness-105 transition-all cursor-pointer"
          >
            <span className="flex items-center gap-2.5 text-start">
              <Package className="w-5 h-5 shrink-0" />
              <span>
                <span className="block font-extrabold">
                  {zipLoading === 'plugin'
                    ? isFa
                      ? 'در حال بسته‌بندی...'
                      : 'Packaging...'
                    : isFa
                    ? 'دانلود افزونه اختصاصی (.zip)'
                    : 'Download WP Plugin (.zip)'}
                </span>
                <span className="text-[11px] font-medium opacity-80">
                  iramo-ai-plugin.zip
                </span>
              </span>
            </span>
            <Download className="w-4 h-4 shrink-0" />
          </button>

          <button
            type="button"
            onClick={() =>
              handleDownloadSingle('build-wordpress-release.yml', GITHUB_ACTIONS_YML)
            }
            className="flex items-center justify-between gap-3 p-4 rounded-xl bg-slate-900 dark:bg-[#050C0A] border border-slate-700 dark:border-emerald-500/30 text-white font-bold text-xs sm:text-sm hover:border-emerald-400 transition-colors cursor-pointer"
          >
            <span className="flex items-center gap-2.5 text-start">
              <GitBranch className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>
                <span className="block">
                  {isFa ? 'ورک‌فلوی بیلد گیت‌هاب' : 'GitHub Actions Workflow'}
                </span>
                <span className="text-[11px] font-normal text-slate-400">
                  {isFa ? 'کامپایل + ساخت ZIP خودکار' : 'Auto Compile & Release ZIPs'}
                </span>
              </span>
            </span>
            <Download className="w-4 h-4 text-emerald-400 shrink-0" />
          </button>
        </div>
      </section>

      {/* 3-Step GitHub + WordPress Install Roadmap */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-2xl p-5 bg-white dark:bg-[#0B1613] border border-slate-200/80 dark:border-emerald-500/15 space-y-2">
          <span className="text-xs font-bold tabular-nums text-[#9A6E00] dark:text-[#FFBA00]">
            {toLocaleDigits('01.', lang)}
          </span>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            {isFa ? 'کامپایل خودکار با گیت‌هاب (پیشنهادی)' : 'Auto-Compile via GitHub'}
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            {isFa
              ? 'کافی است کد پروژه را در یک مخزن گیت‌هاب قرار دهید؛ ورک‌فلوی آماده داخل پروژه دستور npm run package:wp را اجرا کرده و دو فایل آماده نصب iramo-ai-theme.zip و iramo-ai-plugin.zip را تحویل می‌دهد.'
              : 'Push the repo to GitHub; the included workflow runs `npm run package:wp` and outputs ready-to-upload theme & plugin ZIPs in Actions Artifacts.'}
          </p>
        </div>

        <div className="rounded-2xl p-5 bg-white dark:bg-[#0B1613] border border-slate-200/80 dark:border-emerald-500/15 space-y-2">
          <span className="text-xs font-bold tabular-nums text-emerald-600 dark:text-emerald-400">
            {toLocaleDigits('02.', lang)}
          </span>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            {isFa ? 'نصب قالب و افزونه در پیشخوان وردپرس' : 'Upload Theme & Plugin in WP'}
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            {isFa
              ? 'از بخش نمایش ← پوسته‌ها فایل قالب را و از بخش افزونه‌ها ← افزودن فایل افزونه را آپلود و فعال کنید. سپس منوی «تنظیمات iRamoAi» به پیشخوان وردپرس اضافه می‌شود.'
              : 'Upload iramo-ai-theme.zip in Appearance → Themes and iramo-ai-plugin.zip in Plugins → Add New.'}
          </p>
        </div>

        <div className="rounded-2xl p-5 bg-white dark:bg-[#0B1613] border border-slate-200/80 dark:border-emerald-500/15 space-y-2">
          <span className="text-xs font-bold tabular-nums text-blue-600 dark:text-sky-400">
            {toLocaleDigits('03.', lang)}
          </span>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            {isFa ? 'کنترل کامل و پاکسازی داده‌های نمونه' : 'Control Panel & Clean Demo'}
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            {isFa
              ? 'از منوی «تنظیمات iRamoAi» در وردپرس توکن ربات تلگرام/بله را وارد کرده و با یک کلیک داده‌های نمونه را پاک یا مجدد نصب کنید و صفحات را با المنتور پرو بچینید.'
              : 'Configure Telegram/Bale tokens, purge demo items with one click, and drag iRamo widgets inside Elementor Pro.'}
          </p>
        </div>
      </section>

      {/* Interactive Code Inspector */}
      <section className="rounded-2xl bg-[#07110E] border border-emerald-500/25 overflow-hidden text-slate-100">
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 bg-[#050C0A] border-b border-emerald-500/15">
          <div className="flex flex-wrap items-center gap-1.5">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-colors cursor-pointer whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/35'
                    : 'text-slate-400 hover:text-white border border-transparent'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => handleCopy(currentTab.code)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-medium text-slate-200 cursor-pointer"
            >
              {copied ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
              <span>
                {copied
                  ? isFa
                    ? 'کپی شد'
                    : 'Copied'
                  : isFa
                  ? 'کپی کد'
                  : 'Copy Code'}
              </span>
            </button>

            <button
              type="button"
              onClick={() =>
                handleDownloadSingle(currentTab.filename, currentTab.code)
              }
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[var(--iramo-accent)] hover:bg-[var(--iramo-accent-hover)] text-[var(--iramo-accent-fg)] text-xs font-bold cursor-pointer transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isFa ? 'دانلود فایل' : 'Download File'}</span>
            </button>
          </div>
        </div>

        <pre
          dir="ltr"
          className="p-5 text-xs font-mono text-emerald-100/90 overflow-x-auto max-h-[440px] leading-relaxed"
        >
          <code>{currentTab.code}</code>
        </pre>
      </section>
    </div>
  );
};
