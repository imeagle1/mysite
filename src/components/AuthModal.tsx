import React, { useEffect, useRef, useState } from 'react';
import {
  Award,
  Bot,
  CheckCircle2,
  Lock,
  Mail,
  MessageCircle,
  RefreshCw,
  Send,
  Smartphone,
  Sparkles,
  User,
  X,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { resolveBrandLogo } from '../assets/media';
import { Lang } from '../types/lms';
import { toLocaleDigits } from '../utils/formatters';
import { AuthChannelsConfig, AuthMethodKey } from './ContentManagerView';

export interface UserProfile {
  name: string;
  email: string;
  telegramId?: string;
  balePhone?: string;
  phone?: string;
  authMethod: 'email' | 'telegram' | 'bale' | 'sms';
}

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
  lang: Lang;
  brandTitle?: string;
  authChannels: AuthChannelsConfig;
  onLoginSuccess: (user: UserProfile) => void;
}

function normalizeDigits(str: string): string {
  const persian = '۰۱۲۳۴۵۶۷۸۹';
  const arabic = '٠١٢٣٤٥٦٧٨٩';
  return str
    .split('')
    .map((ch) => {
      const pIdx = persian.indexOf(ch);
      if (pIdx >= 0) return String(pIdx);
      const aIdx = arabic.indexOf(ch);
      if (aIdx >= 0) return String(aIdx);
      return ch;
    })
    .join('')
    .replace(/\D/g, '');
}

interface OtpDigitBoxesProps {
  value: string;
  onChange: (val: string) => void;
  lang: Lang;
}

const OtpDigitBoxes: React.FC<OtpDigitBoxesProps> = ({ value, onChange, lang }) => {
  const length = 5;
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [focusedIdx, setFocusedIdx] = useState<number>(0);

  const digits = Array.from({ length }, (_, idx) => value[idx] || '');
  const isComplete = value.length === length;

  useEffect(() => {
    const timer = setTimeout(() => {
      inputRefs.current[0]?.focus();
    }, 120);
    return () => clearTimeout(timer);
  }, []);

  const handleDigitChange = (idx: number, raw: string) => {
    const cleaned = normalizeDigits(raw);
    if (!cleaned) {
      const arr = digits.slice();
      arr[idx] = '';
      onChange(arr.join(''));
      return;
    }

    // Handle full paste (e.g. 5 digits)
    if (cleaned.length > 1) {
      const sliced = cleaned.slice(0, length);
      onChange(sliced);
      const nextFocus = Math.min(sliced.length, length - 1);
      inputRefs.current[nextFocus]?.focus();
      return;
    }

    const arr = digits.slice();
    arr[idx] = cleaned[0];
    onChange(arr.join(''));
    if (idx < length - 1) {
      inputRefs.current[idx + 1]?.focus();
    }
  };

  const handleKeyDown = (idx: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (!digits[idx] && idx > 0) {
        e.preventDefault();
        const arr = digits.slice();
        arr[idx - 1] = '';
        onChange(arr.join(''));
        inputRefs.current[idx - 1]?.focus();
      }
    } else if (e.key === 'ArrowLeft' && idx > 0) {
      inputRefs.current[idx - 1]?.focus();
    } else if (e.key === 'ArrowRight' && idx < length - 1) {
      inputRefs.current[idx + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = normalizeDigits(e.clipboardData.getData('text')).slice(0, length);
    if (!pasted) return;
    onChange(pasted);
    const nextIdx = Math.min(pasted.length, length - 1);
    inputRefs.current[nextIdx]?.focus();
  };

  return (
    <div dir="ltr" className="flex items-center justify-center gap-2 sm:gap-3 py-1">
      {digits.map((digit, idx) => {
        const isFocused = focusedIdx === idx;
        const isFilled = Boolean(digit);

        return (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 10, scale: 0.92 }}
            animate={
              isComplete
                ? {
                    opacity: 1,
                    y: [0, -4, 0],
                    scale: [1, 1.06, 1],
                  }
                : { opacity: 1, y: 0, scale: isFocused ? 1.05 : 1 }
            }
            transition={
              isComplete
                ? { duration: 0.35, delay: idx * 0.055, ease: 'easeOut' }
                : { type: 'spring', stiffness: 450, damping: 28 }
            }
            className="relative"
          >
            {/* Active Halo Glow Ring */}
            {(isFocused || isComplete) && (
              <motion.span
                layoutId={isFocused && !isComplete ? 'otp-active-glow' : undefined}
                aria-hidden="true"
                className={`absolute -inset-1 rounded-2xl blur-sm pointer-events-none transition-opacity ${
                  isComplete
                    ? 'bg-emerald-400/35 dark:bg-emerald-400/30'
                    : 'bg-emerald-500/25 dark:bg-emerald-400/25'
                }`}
              />
            )}

            <div
              className={`relative w-11 h-13 sm:w-12 sm:h-14 rounded-xl border-2 flex items-center justify-center transition-colors ${
                isComplete
                  ? 'bg-emerald-50 dark:bg-emerald-500/15 border-emerald-500 text-emerald-700 dark:text-emerald-300 shadow-sm shadow-emerald-500/20'
                  : isFilled
                  ? 'bg-white dark:bg-[#0A1914] border-emerald-500/70 text-slate-900 dark:text-white'
                  : isFocused
                  ? 'bg-white dark:bg-[#081510] border-emerald-500 text-slate-900 dark:text-white'
                  : 'bg-slate-50 dark:bg-[#050C0A] border-slate-200 dark:border-emerald-500/20 text-slate-400'
              }`}
            >
              <input
                ref={(el) => {
                  inputRefs.current[idx] = el;
                }}
                type="text"
                inputMode="numeric"
                maxLength={5}
                value={digit}
                onFocus={() => setFocusedIdx(idx)}
                onChange={(e) => handleDigitChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                onPaste={handlePaste}
                aria-label={`Digit ${idx + 1}`}
                className="w-full h-full bg-transparent text-center text-lg sm:text-xl font-extrabold tabular-nums focus:outline-none text-transparent caret-emerald-500 selection:bg-transparent cursor-text"
              />

              {/* Animated Visual Digit Pop Overlay */}
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <AnimatePresence mode="popLayout">
                  {digit ? (
                    <motion.span
                      key={`${idx}-${digit}`}
                      initial={{ scale: 0.4, opacity: 0, y: 8 }}
                      animate={{ scale: 1, opacity: 1, y: 0 }}
                      exit={{ scale: 0.5, opacity: 0, y: -6 }}
                      transition={{ type: 'spring', stiffness: 520, damping: 24 }}
                      className="text-lg sm:text-xl font-extrabold tabular-nums text-slate-900 dark:text-white"
                    >
                      {toLocaleDigits(digit, lang)}
                    </motion.span>
                  ) : isFocused ? (
                    <motion.span
                      animate={{ opacity: [0.25, 1, 0.25] }}
                      transition={{ duration: 1.1, repeat: Infinity }}
                      className="w-0.5 h-5 rounded-full bg-emerald-500"
                    />
                  ) : (
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-emerald-500/25" />
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export const AuthModal: React.FC<AuthModalProps> = ({
  open,
  onClose,
  lang,
  brandTitle = 'iRamoAi',
  authChannels,
  onLoginSuccess,
}) => {
  const isFa = lang === 'fa';

  const enabledChannels: AuthMethodKey[] = (
    ['telegram', 'bale', 'sms', 'email'] as AuthMethodKey[]
  ).filter((k) => authChannels[k]);

  const resolveInitialChannel = (): AuthMethodKey => {
    if (authChannels[authChannels.defaultChannel]) {
      return authChannels.defaultChannel;
    }
    return enabledChannels[0] || 'email';
  };

  const [activeChannel, setActiveChannel] = useState<AuthMethodKey>(
    resolveInitialChannel()
  );
  const [mode, setMode] = useState<'login' | 'register'>('login');

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [botContact, setBotContact] = useState('');
  const [smsPhone, setSmsPhone] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [resendTimer, setResendTimer] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      setActiveChannel(resolveInitialChannel());
      if (!authChannels.allowRegistration) setMode('login');
      setOtpSent(false);
      setOtpCode('');
      setResendTimer(0);
      setError('');
    }
  }, [
    open,
    authChannels.telegram,
    authChannels.bale,
    authChannels.sms,
    authChannels.email,
    authChannels.defaultChannel,
    authChannels.allowRegistration,
  ]);

  useEffect(() => {
    if (!otpSent || resendTimer <= 0) return;
    const id = setInterval(() => {
      setResendTimer((t) => (t > 0 ? t - 1 : 0));
    }, 1000);
    return () => clearInterval(id);
  }, [otpSent, resendTimer]);

  if (!open) return null;

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email.includes('@') || password.length < 4) {
      setError(
        isFa
          ? 'لطفاً ایمیل معتبر و رمز عبور حداقل ۴ کاراکتری وارد کنید.'
          : 'Please enter a valid email and a password of at least 4 characters.'
      );
      return;
    }
    if (mode === 'register' && !name.trim()) {
      setError(
        isFa ? 'لطفاً نام و نام خانوادگی خود را وارد کنید.' : 'Please enter your full name.'
      );
      return;
    }
    onLoginSuccess({
      name: name.trim() || (isFa ? 'عضو آکادمی iRamoAi' : 'iRamoAi Member'),
      email: email.trim(),
      authMethod: 'email',
    });
    onClose();
  };

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (mode === 'register' && !name.trim()) {
      setError(
        isFa ? 'لطفاً نام و نام خانوادگی خود را وارد کنید.' : 'Please enter your full name.'
      );
      return;
    }
    if (activeChannel === 'sms') {
      const normalized = normalizeDigits(smsPhone);
      if (normalized.length < 10) {
        setError(
          isFa
            ? 'لطفاً شماره موبایل معتبر ۱۱ رقمی (مثلاً ۰۹۱۲۳۴۵۶۷۸۹) وارد کنید.'
            : 'Please enter a valid mobile phone number.'
        );
        return;
      }
    } else if (!botContact.trim()) {
      setError(
        isFa
          ? 'لطفاً شماره موبایل یا آیدی پیام‌رسان خود را وارد کنید.'
          : 'Please enter your phone number or messenger handle.'
      );
      return;
    }
    setOtpCode('');
    setOtpSent(true);
    setResendTimer(120);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (otpCode.trim().length < 5) {
      setError(
        isFa
          ? 'لطفاً هر ۵ رقم کد تایید ارسال‌شده را وارد کنید.'
          : 'Please enter the complete 5-digit verification code.'
      );
      return;
    }

    const displayName =
      name.trim() || (isFa ? 'عضو تاییدشده iRamoAi' : 'Verified iRamoAi Member');

    if (activeChannel === 'sms') {
      onLoginSuccess({
        name: displayName,
        email: 'member@iramo.ai',
        phone: normalizeDigits(smsPhone),
        authMethod: 'sms',
      });
    } else if (activeChannel === 'telegram') {
      onLoginSuccess({
        name: displayName,
        email: 'member@iramo.ai',
        telegramId: botContact.trim(),
        authMethod: 'telegram',
      });
    } else {
      onLoginSuccess({
        name: displayName,
        email: 'member@iramo.ai',
        balePhone: botContact.trim(),
        authMethod: 'bale',
      });
    }
    onClose();
  };

  const handleDemoLogin = () => {
    onLoginSuccess({
      name: isFa ? 'امیرحسین رامو' : 'Amirhossein R.',
      email: 'academy@iramo.ai',
      telegramId: '@amir_iramo',
      authMethod: enabledChannels[0] === 'email' ? 'email' : enabledChannels[0] || 'telegram',
    });
    onClose();
  };

  const channelMeta: Record<
    AuthMethodKey,
    { labelFa: string; labelEn: string; icon: React.ReactNode }
  > = {
    telegram: {
      labelFa: 'ربات تلگرام',
      labelEn: 'Telegram',
      icon: <Send className="w-3.5 h-3.5 shrink-0" />,
    },
    bale: {
      labelFa: 'پیام‌رسان بله',
      labelEn: 'Bale',
      icon: <MessageCircle className="w-3.5 h-3.5 shrink-0" />,
    },
    sms: {
      labelFa: 'پیامک موبایل',
      labelEn: 'SMS Code',
      icon: <Smartphone className="w-3.5 h-3.5 shrink-0" />,
    },
    email: {
      labelFa: 'ایمیل و رمز',
      labelEn: 'Email',
      icon: <Mail className="w-3.5 h-3.5 shrink-0" />,
    },
  };

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    const raw = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    return toLocaleDigits(raw, lang);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/55 dark:bg-slate-950/80 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={isFa ? 'ورود به حساب کاربری' : 'Account Sign In'}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="w-full max-w-3xl max-h-[92vh] flex flex-col overflow-hidden rounded-3xl bg-white dark:bg-[#08130F] border border-slate-200 dark:border-emerald-500/30 shadow-2xl text-slate-900 dark:text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex-1 overflow-y-auto iramo-inner-scroll grid grid-cols-1 md:grid-cols-12">
          {/* Brand & Value Side Panel */}
          <div className="md:col-span-5 p-6 sm:p-7 bg-gradient-to-br from-emerald-50/90 via-slate-50 to-amber-50/50 dark:from-[#0B2219] dark:via-[#071510] dark:to-[#050C0A] border-b md:border-b-0 md:border-e border-slate-200 dark:border-emerald-500/20 flex flex-col justify-between gap-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <img
                    src={resolveBrandLogo('header')}
                    alt={brandTitle}
                    referrerPolicy="no-referrer"
                    className="w-7 h-7 object-contain"
                  />
                  <span dir="ltr" className="text-base font-extrabold text-slate-900 dark:text-white">
                    {brandTitle.toLowerCase().endsWith('ai') && !brandTitle.includes('.') ? (
                      <>
                        {brandTitle.slice(0, -2)}
                        <span className="text-amber-500 dark:text-amber-400">
                          {brandTitle.slice(-2)}
                        </span>
                      </>
                    ) : (
                      brandTitle
                    )}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="md:hidden p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer"
                  aria-label={isFa ? 'بستن' : 'Close'}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2 pt-1">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-amber-600 dark:text-amber-400">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>
                    {isFa ? 'پنل یکپارچه کاربران و دانشجویان' : 'Unified Member Portal'}
                  </span>
                </span>
                <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white leading-snug text-balance">
                  {isFa
                    ? 'یک حساب کاربری برای تمام دوره‌ها، محصولات و ابزارهای AI'
                    : 'One Account for Every Course, Product & AI Tool'}
                </h2>
                <p className="text-xs text-slate-600 dark:text-slate-300/85 leading-relaxed">
                  {isFa
                    ? 'با ورود به حساب خود، به ویدیوهای آموزشی، لایسنس نرم‌افزارها، فایل‌های آپدیت و پشتیبانی مستقیم دسترسی خواهید داشت.'
                    : 'Access video courses, software license keys, product updates, and support in one clean workspace.'}
                </p>
              </div>

              <ul className="space-y-2.5 pt-2 text-xs text-slate-700 dark:text-slate-200">
                {[
                  {
                    fa: 'دسترسی دائمی به تمام دوره‌ها و جلسات تمرین',
                    en: 'Lifetime access to all enrolled courses',
                  },
                  {
                    fa: 'دریافت آنی کلید لایسنس و فایل آپدیت محصولات',
                    en: 'Instant software license keys & updates',
                  },
                  {
                    fa: 'صدور گواهینامه و همگام‌سازی خودکار با پیام‌رسان‌ها',
                    en: 'Certificates & instant notifications',
                  },
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{isFa ? item.fa : item.en}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl p-3 bg-white/80 dark:bg-[#050C0A]/80 border border-emerald-200 dark:border-emerald-500/20 flex items-center gap-2.5 text-[11px] text-emerald-700 dark:text-emerald-300/90 font-medium">
              <Award className="w-4 h-4 text-amber-500 shrink-0" />
              <span>
                {isFa
                  ? 'ورود سریع، رمزنگاری‌شده و تایید آنی هویت'
                  : 'Fast & verified account authentication'}
              </span>
            </div>
          </div>

          {/* Interactive Login / Signup Form Column */}
          <div className="md:col-span-7 p-6 sm:p-7 flex flex-col justify-between gap-5 bg-white dark:bg-[#08130F]">
            <div className="space-y-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                    {mode === 'login'
                      ? isFa
                        ? 'ورود به پنل کاربری'
                        : 'Sign In to Your Account'
                      : isFa
                      ? 'ساخت حساب کاربری جدید'
                      : 'Create New Account'}
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    {enabledChannels.length > 1
                      ? isFa
                        ? 'روش ورود مورد نظر خود را انتخاب کنید'
                        : 'Select your preferred sign-in method'
                      : isFa
                      ? 'اطلاعات خود را برای تایید هویت وارد کنید'
                      : 'Enter your details to verify and enter'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="hidden md:inline-flex p-1.5 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-emerald-950/60 cursor-pointer"
                  aria-label={isFa ? 'بستن' : 'Close'}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Clean Login / Register Switch (if enabled by Site Admin) */}
              {authChannels.allowRegistration && !otpSent && (
                <div className="grid grid-cols-2 gap-1 p-1 rounded-xl bg-slate-100 dark:bg-[#050C0A] border border-slate-200/80 dark:border-emerald-500/15">
                  <button
                    type="button"
                    onClick={() => {
                      setMode('login');
                      setError('');
                    }}
                    className={`py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                      mode === 'login'
                        ? 'bg-white dark:bg-emerald-500/20 text-slate-900 dark:text-emerald-300 shadow-xs'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {isFa ? 'ورود به حساب' : 'Sign In'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMode('register');
                      setError('');
                    }}
                    className={`py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                      mode === 'register'
                        ? 'bg-white dark:bg-emerald-500/20 text-slate-900 dark:text-emerald-300 shadow-xs'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {isFa ? 'ثبت‌نام جدید' : 'Sign Up'}
                  </button>
                </div>
              )}

              {/* Dynamic Channel Selector (Shows ONLY channels enabled by Admin) */}
              {enabledChannels.length > 1 && !otpSent && (
                <div className="flex flex-wrap gap-1.5 p-1 rounded-xl bg-slate-100/80 dark:bg-[#050C0A] border border-slate-200/80 dark:border-emerald-500/15">
                  {enabledChannels.map((ch) => {
                    const active = activeChannel === ch;
                    const meta = channelMeta[ch];
                    return (
                      <button
                        key={ch}
                        type="button"
                        onClick={() => {
                          setActiveChannel(ch);
                          setOtpSent(false);
                          setError('');
                        }}
                        className={`flex-1 min-w-[96px] flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                          active
                            ? 'bg-white dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/35 shadow-xs'
                            : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-transparent'
                        }`}
                      >
                        {meta.icon}
                        <span>{isFa ? meta.labelFa : meta.labelEn}</span>
                      </button>
                    );
                  })}
                </div>
              )}

              {error && (
                <div className="px-3.5 py-2.5 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 text-xs font-medium text-red-700 dark:text-red-300">
                  {error}
                </div>
              )}

              {/* Animated 5-Digit OTP Verification Step (SMS, Telegram or Bale) */}
              {activeChannel !== 'email' && otpSent ? (
                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/25 text-xs text-emerald-800 dark:text-emerald-200 leading-relaxed">
                    {activeChannel === 'sms'
                      ? isFa
                        ? `کد تایید ۵ رقمی به شماره ${toLocaleDigits(smsPhone, lang)} پیامک شد.`
                        : `A 5-digit verification code was sent to ${smsPhone}.`
                      : isFa
                      ? `کد تایید ۵ رقمی از طریق ${
                          activeChannel === 'telegram' ? 'ربات تلگرام' : 'پیام‌رسان بله'
                        } برای ${botContact} ارسال شد.`
                      : `A 5-digit code was sent via ${activeChannel} to ${botContact}.`}
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <label className="font-bold text-slate-700 dark:text-slate-200">
                        {isFa ? 'کد تایید را وارد کنید' : 'Enter 5-digit verification code'}
                      </label>
                      {resendTimer > 0 ? (
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 tabular-nums">
                          {isFa ? 'ارسال مجدد تا' : 'Resend in'} {formatTimer(resendTimer)}
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            setOtpCode('');
                            setResendTimer(120);
                          }}
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
                        >
                          <RefreshCw className="w-3 h-3" />
                          <span>{isFa ? 'ارسال مجدد کد' : 'Resend Code'}</span>
                        </button>
                      )}
                    </div>

                    <OtpDigitBoxes value={otpCode} onChange={setOtpCode} lang={lang} />
                  </div>

                  <div className="flex gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        setOtpSent(false);
                        setOtpCode('');
                      }}
                      className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-emerald-500/20 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white cursor-pointer"
                    >
                      {isFa ? 'تغییر شماره / آیدی' : 'Back'}
                    </button>
                    <button
                      type="submit"
                      className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-l from-[#1677FF] to-[#0D65E8] hover:brightness-105 text-white dark:from-amber-400 dark:to-orange-400 dark:text-slate-950 text-xs font-extrabold cursor-pointer shadow-md shadow-[#1677FF]/25 dark:shadow-amber-500/20"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{isFa ? 'تایید و ورود به پنل' : 'Verify & Enter'}</span>
                    </button>
                  </div>
                </form>
              ) : activeChannel === 'sms' ? (
                <form onSubmit={handleSendOtp} className="space-y-4">
                  {mode === 'register' && authChannels.allowRegistration && (
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block">
                        {isFa ? 'نام و نام خانوادگی' : 'Full Name'}
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 text-slate-400 absolute top-3 start-3" />
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder={isFa ? 'مثلاً: سارا محمدی' : 'Your full name...'}
                          className="w-full ps-9 pe-3 py-2.5 rounded-xl bg-slate-50 dark:bg-[#050C0A] border border-slate-200 dark:border-emerald-500/20 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                        />
                      </div>
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block">
                      {isFa ? 'شماره موبایل شما' : 'Mobile Phone Number'}
                    </label>
                    <div className="relative">
                      <Smartphone className="w-4 h-4 text-slate-400 absolute top-3 start-3" />
                      <input
                        type="tel"
                        dir="ltr"
                        value={smsPhone}
                        onChange={(e) => setSmsPhone(e.target.value)}
                        placeholder="09123456789"
                        className="w-full ps-9 pe-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#050C0A] border border-slate-200 dark:border-emerald-500/20 text-sm text-slate-900 dark:text-white tabular-nums focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-l from-[#1677FF] to-[#0D65E8] hover:brightness-105 text-white dark:from-amber-400 dark:to-orange-400 dark:text-slate-950 text-xs font-extrabold cursor-pointer shadow-md shadow-[#1677FF]/25 dark:shadow-amber-500/20"
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                    <span>
                      {mode === 'register'
                        ? isFa
                          ? 'ارسال کد ثبت‌نام پیامکی'
                          : 'Send Signup Code'
                        : isFa
                        ? 'دریافت کد تایید پیامکی'
                        : 'Send Verification Code'}
                    </span>
                  </button>
                </form>
              ) : activeChannel === 'telegram' || activeChannel === 'bale' ? (
                <form onSubmit={handleSendOtp} className="space-y-4">
                  {mode === 'register' && authChannels.allowRegistration && (
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block">
                        {isFa ? 'نام و نام خانوادگی' : 'Full Name'}
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 text-slate-400 absolute top-3 start-3" />
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder={isFa ? 'مثلاً: سارا محمدی' : 'Your full name...'}
                          className="w-full ps-9 pe-3 py-2.5 rounded-xl bg-slate-50 dark:bg-[#050C0A] border border-slate-200 dark:border-emerald-500/20 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                        />
                      </div>
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block">
                      {activeChannel === 'telegram'
                        ? isFa
                          ? 'آیدی تلگرام یا شماره موبایل متصل به تلگرام'
                          : 'Telegram Username or Phone'
                        : isFa
                        ? 'شماره موبایل یا شناسه پیام‌رسان بله'
                        : 'Bale Phone or Handle'}
                    </label>
                    <div className="relative">
                      <Bot className="w-4 h-4 text-slate-400 absolute top-3 start-3" />
                      <input
                        type="text"
                        dir="ltr"
                        value={botContact}
                        onChange={(e) => setBotContact(e.target.value)}
                        placeholder={
                          activeChannel === 'telegram' ? '@username' : '09123456789'
                        }
                        className="w-full ps-9 pe-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#050C0A] border border-slate-200 dark:border-emerald-500/20 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-l from-[#1677FF] to-[#0D65E8] hover:brightness-105 text-white dark:from-amber-400 dark:to-orange-400 dark:text-slate-950 text-xs font-extrabold cursor-pointer shadow-md shadow-[#1677FF]/25 dark:shadow-amber-500/20"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>
                      {activeChannel === 'telegram'
                        ? isFa
                          ? 'ارسال کد ورود در تلگرام'
                          : 'Send Code via Telegram'
                        : isFa
                        ? 'ارسال کد ورود در پیام‌رسان بله'
                        : 'Send Code via Bale'}
                    </span>
                  </button>
                </form>
              ) : (
                <form onSubmit={handleEmailSubmit} className="space-y-3.5">
                  {mode === 'register' && authChannels.allowRegistration && (
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block">
                        {isFa ? 'نام و نام خانوادگی' : 'Full Name'}
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 text-slate-400 absolute top-3 start-3" />
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder={isFa ? 'نام شما...' : 'Your full name...'}
                          className="w-full ps-9 pe-3 py-2.5 rounded-xl bg-slate-50 dark:bg-[#050C0A] border border-slate-200 dark:border-emerald-500/20 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                        />
                      </div>
                    </div>
                  )}

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block">
                      {isFa ? 'ایمیل' : 'Email Address'}
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute top-3 start-3" />
                      <input
                        type="email"
                        dir="ltr"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@domain.com"
                        className="w-full ps-9 pe-3 py-2.5 rounded-xl bg-slate-50 dark:bg-[#050C0A] border border-slate-200 dark:border-emerald-500/20 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block">
                      {isFa ? 'رمز عبور' : 'Password'}
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute top-3 start-3" />
                      <input
                        type="password"
                        dir="ltr"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full ps-9 pe-3 py-2.5 rounded-xl bg-slate-50 dark:bg-[#050C0A] border border-slate-200 dark:border-emerald-500/20 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-gradient-to-l from-[#1677FF] to-[#0D65E8] hover:brightness-105 text-white dark:from-amber-400 dark:to-orange-400 dark:text-slate-950 text-xs font-extrabold cursor-pointer shadow-md shadow-[#1677FF]/25 dark:shadow-amber-500/20"
                  >
                    {mode === 'login'
                      ? isFa
                        ? 'ورود به حساب کاربری'
                        : 'Sign In'
                      : isFa
                      ? 'ساخت حساب کاربری'
                      : 'Create Account'}
                  </button>
                </form>
              )}
            </div>

            {/* Quick Demo Preview Access */}
            <div className="pt-3 border-t border-slate-200/80 dark:border-emerald-500/15">
              <button
                type="button"
                onClick={handleDemoLogin}
                className="w-full py-2.5 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-500/10 dark:hover:bg-emerald-500/20 border border-emerald-200 dark:border-emerald-500/25 text-emerald-700 dark:text-emerald-300 text-xs font-bold transition-colors cursor-pointer"
              >
                {isFa
                  ? 'ورود سریع با حساب کاربری نمونه'
                  : 'Quick Preview with Sample Account'}
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
