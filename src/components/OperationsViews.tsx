import React, { useState } from 'react';
import {
  Bot,
  Check,
  CheckCircle2,
  Copy,
  ExternalLink,
  KeyRound,
  Link2,
  RefreshCw,
  Send,
  ShieldCheck,
  Upload,
} from 'lucide-react';
import { Assignment, Course, Lang, Transaction } from '../types/lms';
import { formatPrice, toLocaleDigits } from '../utils/formatters';

/* 1. Assignments View */
interface AssignmentsViewProps {
  lang: Lang;
  assignments: Assignment[];
  courses: Course[];
  onSubmitAssignment: (assignmentId: string, url: string) => void;
}

export const AssignmentsView: React.FC<AssignmentsViewProps> = ({
  lang,
  assignments,
  courses,
  onSubmitAssignment,
}) => {
  const isFa = lang === 'fa';
  const [urls, setUrls] = useState<Record<string, string>>({});

  const getCourseTitle = (courseId: string) => {
    const c = courses.find((item) => item.id === courseId);
    if (!c) return courseId;
    return isFa ? c.title.fa : c.title.en;
  };

  return (
    <div className="space-y-4">
      <div className="rounded-2xl p-5 bg-white dark:bg-[#0B1613] border border-slate-200/80 dark:border-emerald-500/15">
        <h2 className="text-base font-bold text-slate-900 dark:text-white">
          {isFa ? 'تکالیف و پروژه‌های عملی' : 'Practical Labs & Assignments'}
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          {isFa
            ? 'لینک گیت‌هاب یا فایل پروژه خود را ارسال کنید تا توسط مدرس بررسی و در بله و تلگرام نمره‌دهی شود.'
            : 'Submit your GitHub repo or project file link for instructor review and instant Messenger feedback.'}
        </p>
      </div>

      <div className="space-y-3">
        {assignments.length === 0 ? (
          <div className="rounded-2xl p-8 text-center bg-white dark:bg-[#0B1613] border border-slate-200/80 dark:border-emerald-500/15 text-xs text-slate-500 dark:text-slate-400">
            {isFa
              ? 'در حال حاضر تکلیف یا پروژه فعالی برای شما ثبت نشده است.'
              : 'No active assignments or labs yet.'}
          </div>
        ) : (
          assignments.map((asg) => {
            const statusText =
              asg.status === 'graded'
                ? isFa
                  ? `نمره‌دهی شده · ${toLocaleDigits(asg.score ?? 0, lang)} از ${toLocaleDigits(asg.maxScore, lang)}`
                  : `Graded · ${asg.score}/${asg.maxScore}`
                : asg.status === 'submitted'
                ? isFa
                  ? 'ارسال شده (در انتظار بررسی)'
                  : 'Submitted · Pending Review'
                : isFa
                ? 'در انتظار ارسال'
                : 'Action Required';

            return (
              <div
                key={asg.id}
                className="rounded-2xl p-5 bg-white dark:bg-[#0B1613] border border-slate-200/80 dark:border-emerald-500/15 space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <p className="text-[11px] font-medium text-slate-500 dark:text-emerald-300/75 tabular-nums">
                      {getCourseTitle(asg.courseId)} ·{' '}
                      {isFa ? `مهلت: ${asg.dueDate.fa}` : `Due ${asg.dueDate.en}`}
                    </p>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                      {isFa ? asg.title.fa : asg.title.en}
                    </h3>
                  </div>
                  <span
                    className={`text-xs font-semibold tabular-nums shrink-0 ${
                      asg.status === 'graded'
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : asg.status === 'submitted'
                        ? 'text-blue-600 dark:text-sky-400'
                        : 'text-[#9A6E00] dark:text-[#FFBA00]'
                    }`}
                  >
                    {statusText}
                  </span>
                </div>

                {asg.feedback && (
                  <p className="text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-[#060E0B] p-3 rounded-xl border border-slate-200/70 dark:border-emerald-500/15">
                    {isFa ? asg.feedback.fa : asg.feedback.en}
                  </p>
                )}

                {asg.status === 'pending' && (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      const val = (urls[asg.id] || '').trim();
                      if (!val) return;
                      onSubmitAssignment(asg.id, val);
                    }}
                    className="flex flex-col sm:flex-row gap-2 pt-1"
                  >
                    <input
                      type="url"
                      required
                      value={urls[asg.id] || ''}
                      onChange={(e) =>
                        setUrls((prev) => ({ ...prev, [asg.id]: e.target.value }))
                      }
                      placeholder={
                        isFa
                          ? 'لینک گیت‌هاب یا فایل پروژه (https://...)'
                          : 'Paste project or GitHub URL (https://...)'
                      }
                      className="flex-1 px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#050C0A] border border-slate-200 dark:border-emerald-500/20 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                    />
                    <button
                      type="submit"
                      className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-[var(--iramo-accent)] hover:bg-[var(--iramo-accent-hover)] text-[var(--iramo-accent-fg)] text-xs font-bold cursor-pointer whitespace-nowrap transition-colors"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>{isFa ? 'ارسال تمرین' : 'Submit Lab'}</span>
                    </button>
                  </form>
                )}

                {asg.submittedUrl && (
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                    {isFa ? 'فایل ارسالی: ' : 'Submitted: '}
                    <span dir="ltr">{asg.submittedUrl}</span>
                  </p>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

/* 2. Telegram & Bale Bot Connect View */
interface BotConnectViewProps {
  lang: Lang;
  telegramBotUsername?: string;
  baleBotUsername?: string;
  initialTelegramId?: string;
  initialBalePhone?: string;
  initialPrefs?: {
    autoLicense: boolean;
    lessonAlerts: boolean;
    otpLogin: boolean;
  };
  wpRestUrl?: string;
  wpNonce?: string;
  onUpdateBotBinding?: (data: {
    telegramId?: string;
    balePhone?: string;
    prefs?: { autoLicense: boolean; lessonAlerts: boolean; otpLogin: boolean };
  }) => void;
}

export const BotConnectView: React.FC<BotConnectViewProps> = ({
  lang,
  telegramBotUsername = '@iRamoBot',
  baleBotUsername = '@iRamoBaleBot',
  initialTelegramId = '',
  initialBalePhone = '',
  initialPrefs,
  wpRestUrl,
  wpNonce,
  onUpdateBotBinding,
}) => {
  const isFa = lang === 'fa';
  const [tgHandle, setTgHandle] = useState(
    initialTelegramId || (!wpRestUrl ? '@amir_iramo' : '')
  );
  const [baleId, setBaleId] = useState(
    initialBalePhone || (!wpRestUrl ? '09120004412' : '')
  );
  const [otpSent, setOtpSent] = useState<'telegram' | 'bale' | null>(null);
  const [otpCode, setOtpCode] = useState('');
  const [botError, setBotError] = useState('');
  const [linkState, setLinkState] = useState<{
    platform: 'telegram' | 'bale';
    command: string;
    nonceId: string;
    deepLink: string;
    botUsername: string;
  } | null>(null);
  const [copiedCmd, setCopiedCmd] = useState(false);
  const [checkingLink, setCheckingLink] = useState(false);
  const [verifiedPlatform, setVerifiedPlatform] = useState<string[]>(() => {
    const initial: string[] = [];
    if (initialTelegramId || !wpRestUrl) initial.push('telegram');
    if (initialBalePhone) initial.push('bale');
    return initial;
  });
  const [prefs, setPrefs] = useState(
    initialPrefs || {
      autoLicense: true,
      lessonAlerts: true,
      otpLogin: true,
    }
  );

  const callWp = async (endpoint: string, payload: Record<string, unknown>) => {
    if (!wpRestUrl) return null;
    const base = wpRestUrl.replace(/\/$/, '');
    const res = await fetch(`${base}/${endpoint}`, {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
        ...(wpNonce ? { 'X-WP-Nonce': wpNonce } : {}),
      },
      body: JSON.stringify(payload),
    });
    const data = (await res.json().catch(() => ({}))) as {
      message?: string;
      command?: string;
      nonceId?: string;
      deepLink?: string;
      botUsername?: string;
      connected?: boolean;
      chatId?: string;
      username?: string;
      target?: string;
    };
    if (!res.ok) {
      throw new Error(data.message || 'Request failed');
    }
    return data;
  };

  const handleRequestLink = async (platform: 'telegram' | 'bale') => {
    setBotError('');
    if (!wpRestUrl) {
      setLinkState({
        platform,
        command: '/start IR-DEMO92',
        nonceId: 'demo',
        deepLink: platform === 'telegram' ? 'https://t.me/iRamoBot?start=IR-DEMO92' : 'https://ble.ir/iRamoBaleBot',
        botUsername: platform === 'telegram' ? telegramBotUsername : baleBotUsername,
      });
      return;
    }
    try {
      const res = await callWp('bot/request-link', { platform, intent: 'bind' });
      if (res?.command) {
        setLinkState({
          platform,
          command: res.command,
          nonceId: res.nonceId || '',
          deepLink: res.deepLink || '#',
          botUsername: res.botUsername || (platform === 'telegram' ? telegramBotUsername : baleBotUsername),
        });
      }
    } catch (err) {
      setBotError(err instanceof Error ? err.message : 'Failed to create link code');
    }
  };

  const handleCheckLink = async (platform: 'telegram' | 'bale') => {
    setBotError('');
    const target = platform === 'telegram' ? tgHandle.trim() : baleId.trim();
    if (!wpRestUrl) {
      if (!verifiedPlatform.includes(platform)) {
        setVerifiedPlatform((prev) => [...prev, platform]);
      }
      setLinkState(null);
      return;
    }
    try {
      setCheckingLink(true);
      const res = await callWp('bot/check-link', {
        platform,
        nonceId: linkState?.nonceId || '',
      });
      if (res?.connected) {
        const verifiedCid = res.chatId || res.target || target;
        if (verifiedCid) {
          if (platform === 'telegram') setTgHandle(verifiedCid);
          else setBaleId(verifiedCid);
        }
        if (!verifiedPlatform.includes(platform)) {
          setVerifiedPlatform((prev) => [...prev, platform]);
        }
        setLinkState(null);
        onUpdateBotBinding?.(
          platform === 'telegram'
            ? { telegramId: verifiedCid, prefs }
            : { balePhone: verifiedCid, prefs }
        );
      } else {
        setBotError(
          isFa
            ? 'کد اتصال هنوز در ربات ارسال نشده است. لطفاً دستور /start را در ربات ارسال کرده و دوباره بررسی کنید.'
            : 'Bot link not confirmed yet. Send /start with the code in the bot first.'
        );
      }
    } catch (err) {
      setBotError(err instanceof Error ? err.message : 'Verification check failed');
    } finally {
      setCheckingLink(false);
    }
  };

  const handleSendTestOtp = async (platform: 'telegram' | 'bale') => {
    setBotError('');
    const target = platform === 'telegram' ? tgHandle.trim() : baleId.trim();
    if (!target) {
      setBotError(
        isFa ? 'لطفاً آیدی یا شناسه چت عددی را وارد کنید.' : 'Enter handle or chat ID first.'
      );
      return;
    }
    if (wpRestUrl) {
      try {
        await callWp('auth/send-otp', { channel: platform, target });
        setOtpCode('');
        setOtpSent(platform);
      } catch (err) {
        setBotError(err instanceof Error ? err.message : 'Failed to reach bot');
      }
      return;
    }
    setOtpCode('');
    setOtpSent(platform);
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setBotError('');
    if (!otpSent || otpCode.trim().length < 6) {
      setBotError(
        isFa ? 'لطفاً کد تایید ۶ رقمی کامل را وارد کنید.' : 'Please enter the complete 6-digit OTP code.'
      );
      return;
    }
    const target = otpSent === 'telegram' ? tgHandle.trim() : baleId.trim();
    if (wpRestUrl) {
      try {
        await callWp('auth/verify-otp', {
          channel: otpSent,
          target,
          code: otpCode.trim(),
        });
        await callWp('bot/bind', { prefs });
      } catch (err) {
        setBotError(err instanceof Error ? err.message : 'Invalid verification code');
        return;
      }
    }
    if (!verifiedPlatform.includes(otpSent)) {
      setVerifiedPlatform((prev) => [...prev, otpSent]);
    }
    onUpdateBotBinding?.(
      otpSent === 'telegram'
        ? { telegramId: target, prefs }
        : { balePhone: target, prefs }
    );
    setOtpSent(null);
    setOtpCode('');
  };

  const togglePref = async (key: keyof typeof prefs) => {
    const next = { ...prefs, [key]: !prefs[key] };
    setPrefs(next);
    onUpdateBotBinding?.({ prefs: next });
    if (wpRestUrl) {
      callWp('bot/bind', { prefs: next }).catch(() => {});
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl p-6 bg-white dark:bg-[#0B1613] border border-slate-200/80 dark:border-emerald-500/15 space-y-2">
        <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
          <Bot className="w-4 h-4" />
          <span>
            {isFa
              ? 'پل یکپارچه تلگرام و پیام‌رسان بله'
              : 'Unified Telegram & Bale Bot API Sync'}
          </span>
        </div>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
          {isFa
            ? 'اتصال حساب کاربری به ربات‌های تلگرام و بله'
            : 'Connect Your Telegram & Bale Messengers'}
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300/80 leading-relaxed max-w-3xl">
          {isFa
            ? `با اتصال اکانت تلگرام یا پیام‌رسان بله (ابتدا /start را در ${telegramBotUsername} یا ${baleBotUsername} ارسال کنید)، دسترسی آنی به دوره‌ها، لایسنس محصولات و کد ورود دو مرحله‌ای برای شما ارسال می‌شود.`
            : 'Receive instant WooCommerce course unlocks, software license keys, new lesson alerts, and zero-cost OTP authentication directly in Telegram or Bale.'}
        </p>
      </div>

      {botError && (
        <div className="px-4 py-3 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 text-xs font-medium text-red-700 dark:text-red-300">
          {botError}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-2xl p-5 bg-white dark:bg-[#0B1613] border border-slate-200/80 dark:border-emerald-500/15 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              {isFa
                ? `ربات تلگرام (${telegramBotUsername})`
                : `Telegram Bot (${telegramBotUsername})`}
            </h3>
            <span
              className={`text-xs font-semibold inline-flex items-center gap-1 ${
                verifiedPlatform.includes('telegram')
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-[#9A6E00] dark:text-[#FFBA00]'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>
                {verifiedPlatform.includes('telegram')
                  ? isFa
                    ? 'متصل'
                    : 'Connected'
                  : isFa
                  ? 'نیاز به تایید'
                  : 'Unverified'}
              </span>
            </span>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <label className="text-xs text-slate-500 dark:text-slate-400 block">
                {isFa ? 'آیدی یا شناسه چت عددی تلگرام' : 'Telegram Username or Chat ID'}
              </label>
              <button
                type="button"
                onClick={() => handleRequestLink('telegram')}
                className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
              >
                <Link2 className="w-3 h-3" />
                <span>{isFa ? 'دریافت کد اتصال امن' : 'Get Link Code'}</span>
              </button>
            </div>
            <div className="flex flex-col min-[420px]:flex-row gap-2">
              <input
                type="text"
                dir="ltr"
                value={tgHandle}
                onChange={(e) => setTgHandle(e.target.value)}
                placeholder="@username or 123456789"
                className="flex-1 min-w-0 px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#050C0A] border border-slate-200 dark:border-emerald-500/20 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
              />
              <button
                type="button"
                onClick={() => handleSendTestOtp('telegram')}
                className="px-3.5 py-2 rounded-xl bg-slate-900 text-white dark:bg-emerald-500 dark:text-slate-950 text-xs font-bold cursor-pointer whitespace-nowrap"
              >
                {isFa ? 'ارسال کد ۶ رقمی' : 'Send 6-Digit OTP'}
              </button>
            </div>
          </div>
        </div>

        <div className="rounded-2xl p-5 bg-white dark:bg-[#0B1613] border border-slate-200/80 dark:border-emerald-500/15 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              {isFa
                ? `ربات پیام‌رسان بله (${baleBotUsername})`
                : `Bale Messenger Bot (${baleBotUsername})`}
            </h3>
            <span
              className={`text-xs font-semibold inline-flex items-center gap-1 ${
                verifiedPlatform.includes('bale')
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-[#9A6E00] dark:text-[#FFBA00]'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>
                {verifiedPlatform.includes('bale')
                  ? isFa
                    ? 'متصل'
                    : 'Connected'
                  : isFa
                  ? 'آماده تایید'
                  : 'Ready to Verify'}
              </span>
            </span>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <label className="text-xs text-slate-500 dark:text-slate-400 block">
                {isFa ? 'شماره موبایل یا شناسه عددی بله' : 'Bale Phone or Chat ID'}
              </label>
              <button
                type="button"
                onClick={() => handleRequestLink('bale')}
                className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
              >
                <Link2 className="w-3 h-3" />
                <span>{isFa ? 'دریافت کد اتصال امن' : 'Get Link Code'}</span>
              </button>
            </div>
            <div className="flex flex-col min-[420px]:flex-row gap-2">
              <input
                type="text"
                dir="ltr"
                value={baleId}
                onChange={(e) => setBaleId(e.target.value)}
                placeholder="09123456789 or chat_id"
                className="flex-1 min-w-0 px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#050C0A] border border-slate-200 dark:border-emerald-500/20 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
              />
              <button
                type="button"
                onClick={() => handleSendTestOtp('bale')}
                className="px-3.5 py-2 rounded-xl bg-[var(--iramo-accent)] hover:bg-[var(--iramo-accent-hover)] text-[var(--iramo-accent-fg)] text-xs font-bold cursor-pointer whitespace-nowrap transition-colors"
              >
                {isFa ? 'ارسال کد ۶ رقمی' : 'Send 6-Digit OTP'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {linkState && (
        <div className="rounded-2xl p-5 bg-slate-50 dark:bg-[#091511] border border-emerald-300 dark:border-emerald-500/35 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1 text-xs">
            <p className="font-bold text-slate-900 dark:text-white">
              {isFa
                ? `کد یکبارمصرف اتصال به ${linkState.botUsername} (اعتبار ۱۰ دقیقه):`
                : `One-time link command for ${linkState.botUsername} (10m expiry):`}
            </p>
            <p className="text-slate-600 dark:text-slate-300">
              {isFa
                ? 'دستور زیر را در ربات ارسال کنید و سپس دکمه «بررسی تایید ربات» را بزنید.'
                : 'Send this command in the bot and click Verify Link.'}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <code dir="ltr" className="px-3 py-1.5 rounded-xl bg-white dark:bg-[#050C0A] border border-emerald-300 dark:border-emerald-500/30 font-mono text-xs text-slate-900 dark:text-emerald-200">
              {linkState.command}
            </code>
            <button
              type="button"
              onClick={() => {
                navigator.clipboard?.writeText(linkState.command);
                setCopiedCmd(true);
                setTimeout(() => setCopiedCmd(false), 1500);
              }}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white dark:bg-emerald-500/15 border border-slate-200 dark:border-emerald-500/25 text-xs font-bold cursor-pointer"
            >
              {copiedCmd ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{isFa ? (copiedCmd ? 'کپی شد' : 'کپی دستور') : copiedCmd ? 'Copied' : 'Copy'}</span>
            </button>
            {linkState.deepLink && linkState.deepLink !== '#' && (
              <a
                href={linkState.deepLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>{isFa ? 'ورود به ربات' : 'Open Bot'}</span>
              </a>
            )}
            <button
              type="button"
              disabled={checkingLink}
              onClick={() => handleCheckLink(linkState.platform)}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[var(--iramo-accent)] text-[var(--iramo-accent-fg)] text-xs font-extrabold cursor-pointer disabled:opacity-60"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${checkingLink ? 'animate-spin' : ''}`} />
              <span>{isFa ? 'بررسی تایید ربات' : 'Verify Link'}</span>
            </button>
          </div>
        </div>
      )}

      {otpSent && (
        <form
          onSubmit={handleVerify}
          className="rounded-2xl p-5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-500/35 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        >
          <div className="space-y-1">
            <p className="text-xs font-bold text-slate-900 dark:text-white">
              {isFa
                ? `کد تایید ۶ رقمی به ${otpSent === 'bale' ? 'پیام‌رسان بله' : 'ربات تلگرام'} ارسال شد.`
                : `6-digit verification code sent via ${otpSent} bot.`}
            </p>
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              dir="ltr"
              maxLength={6}
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value)}
              placeholder="482916"
              className="w-32 px-3 py-2 rounded-xl bg-white dark:bg-[#050C0A] border border-emerald-400 text-xs text-center text-slate-900 dark:text-white focus:outline-none tabular-nums"
            />
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isFa ? 'تایید اتصال' : 'Confirm'}</span>
            </button>
          </div>
        </form>
      )}

      <div className="rounded-2xl p-5 bg-white dark:bg-[#0B1613] border border-slate-200/80 dark:border-emerald-500/15 space-y-3">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white">
          {isFa ? 'تنظیمات تحویل خودکار پیام‌رسان' : 'Automated Bot Delivery Rules'}
        </h3>
        <div className="divide-y divide-slate-100 dark:divide-emerald-500/10">
          {(
            [
              {
                key: 'autoLicense',
                fa: 'ارسال خودکار کلید لایسنس و لینک دانلود بلافاصله بعد از خرید ووکامرس',
                en: 'Deliver software license keys & download links immediately after WooCommerce checkout',
              },
              {
                key: 'lessonAlerts',
                fa: 'اطلاع‌رسانی انتشار جلسات جدید و نمره تکالیف در تلگرام و بله',
                en: 'Send notifications when new course lessons or assignment grades are posted',
              },
              {
                key: 'otpLogin',
                fa: 'فعال‌سازی ورود دو مرحله‌ای بدون نیاز به پیامک',
                en: 'Enable zero-cost two-factor OTP authentication via Messenger Bot',
              },
            ] as const
          ).map((item) => (
            <label
              key={item.key}
              className="py-3 flex items-center justify-between gap-4 text-xs text-slate-700 dark:text-slate-200 cursor-pointer"
            >
              <span>{isFa ? item.fa : item.en}</span>
              <input
                type="checkbox"
                checked={prefs[item.key]}
                onChange={() => togglePref(item.key)}
                className="w-4 h-4 rounded accent-emerald-500 cursor-pointer"
              />
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

/* 3. Transactions & Licenses View */
interface TransactionsViewProps {
  lang: Lang;
  transactions: Transaction[];
}

export const TransactionsView: React.FC<TransactionsViewProps> = ({
  lang,
  transactions,
}) => {
  const isFa = lang === 'fa';
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyLicense = (id: string, key: string) => {
    navigator.clipboard.writeText(key);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1600);
  };

  return (
    <div className="space-y-4">
      <div className="rounded-2xl p-5 bg-white dark:bg-[#0B1613] border border-slate-200/80 dark:border-emerald-500/15">
        <h2 className="text-base font-bold text-slate-900 dark:text-white">
          {isFa ? 'تراکنش‌ها و کلیدهای لایسنس نرم‌افزار' : 'Transactions & Software Licenses'}
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          {isFa
            ? 'تاریخچه سفارش‌های ووکامرس و کلیدهای فعال‌سازی نرم‌افزارهای حسابیار و پکیج‌های آموزشی.'
            : 'WooCommerce order history and active license keys synced with Telegram & Bale.'}
        </p>
      </div>

      <div className="rounded-2xl bg-white dark:bg-[#0B1613] border border-slate-200/80 dark:border-emerald-500/15 overflow-hidden">
        {transactions.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-500 dark:text-slate-400">
            {isFa
              ? 'هنوز هیچ سفارش یا لایسنسی برای حساب شما ثبت نشده است.'
              : 'No WooCommerce orders or software licenses found for your account yet.'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-start border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-emerald-500/15 text-[11px] font-semibold text-slate-500 dark:text-emerald-200/60 bg-slate-50/70 dark:bg-[#08110E]">
                  <th className="py-3 px-4 text-start">{isFa ? 'شماره فاکتور' : 'Invoice'}</th>
                  <th className="py-3 px-4 text-start">{isFa ? 'محصول / دوره' : 'Item'}</th>
                  <th className="py-3 px-4 text-start">{isFa ? 'تاریخ' : 'Date'}</th>
                  <th className="py-3 px-4 text-end">{isFa ? 'مبلغ' : 'Amount'}</th>
                  <th className="py-3 px-4 text-start">{isFa ? 'لایسنس / وضعیت' : 'License / Status'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-emerald-500/10 text-xs">
                {transactions.map((tx) => (
                  <tr
                    key={tx.id}
                    className="hover:bg-slate-50/70 dark:hover:bg-emerald-950/20 transition-colors"
                  >
                    <td className="py-3.5 px-4 tabular-nums font-medium text-slate-700 dark:text-slate-300 whitespace-nowrap">
                      {toLocaleDigits(tx.invoiceNo, lang)}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-white">
                      {isFa ? tx.item.fa : tx.item.en}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400 tabular-nums whitespace-nowrap">
                      {isFa ? tx.date.fa : tx.date.en}
                    </td>
                    <td className="py-3.5 px-4 text-end tabular-nums font-bold text-slate-900 dark:text-white whitespace-nowrap">
                      {formatPrice(tx.amountToman, tx.amountUsd, lang)}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {tx.licenseKey ? (
                        <button
                          type="button"
                          onClick={() => handleCopyLicense(tx.id, tx.licenseKey!)}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-emerald-500/15 dark:hover:bg-emerald-500/25 text-slate-800 dark:text-emerald-300 font-mono text-[11px] cursor-pointer"
                        >
                          <KeyRound className="w-3 h-3 text-[#FFBA00]" />
                          <span>{tx.licenseKey}</span>
                          {copiedId === tx.id ? (
                            <Check className="w-3 h-3 text-emerald-500" />
                          ) : (
                            <Copy className="w-3 h-3 opacity-60" />
                          )}
                        </button>
                      ) : (
                        <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                          {tx.status === 'paid'
                            ? isFa
                              ? 'پرداخت موفق · تحویل در ربات'
                              : 'Paid · Bot Delivered'
                            : isFa
                            ? 'در انتظار تکمیل پرداخت'
                            : 'Pending Payment'}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
