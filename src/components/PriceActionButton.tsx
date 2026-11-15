import React from 'react';
import { ArrowLeft, ArrowRight, ShoppingBag, Sparkles } from 'lucide-react';
import { Lang } from '../types/lms';
import { formatPrice } from '../utils/formatters';

interface PriceActionButtonProps {
  lang: Lang;
  priceToman: number;
  priceUsd: number;
  ctaLabel?: { fa: string; en: string };
  variant?: 'amber' | 'emerald';
  size?: 'sm' | 'md';
  onClick?: (e: React.MouseEvent) => void;
  fullWidth?: boolean;
}

export const PriceActionButton: React.FC<PriceActionButtonProps> = ({
  lang,
  priceToman,
  priceUsd,
  ctaLabel,
  variant = 'amber',
  size = 'sm',
  onClick,
  fullWidth = false,
}) => {
  const isFa = lang === 'fa';
  const isFree = priceToman === 0;
  const priceLabel = formatPrice(priceToman, priceUsd, lang);

  // Light mode uses the iRamoAi Logo Blue (#1677FF) for primary CTA buttons; Dark mode retains emerald/amber contrast.
  const variantClasses =
    variant === 'emerald'
      ? 'bg-emerald-600 hover:bg-emerald-700 text-white dark:bg-gradient-to-l dark:from-emerald-500 dark:via-emerald-400 dark:to-teal-400 dark:text-slate-950 shadow-md shadow-emerald-600/20 dark:shadow-emerald-500/20 hover:shadow-lg dark:hover:brightness-105'
      : 'bg-gradient-to-l from-[#1677FF] via-[#1D7AFC] to-[#0D65E8] text-white shadow-md shadow-[#1677FF]/25 hover:shadow-lg hover:shadow-[#1677FF]/35 hover:brightness-105 dark:from-amber-400 dark:via-amber-500 dark:to-orange-400 dark:text-slate-950 dark:shadow-amber-500/20 dark:hover:shadow-amber-500/35';

  const sizeClasses =
    size === 'md'
      ? 'px-4 py-2.5 text-xs sm:text-[13px] rounded-xl gap-2.5'
      : 'px-3.5 py-2 text-xs rounded-xl gap-2';

  return (
    <button
      type="button"
      onClick={onClick}
      className={`group/price relative inline-flex items-center justify-between font-bold transition-all duration-200 active:scale-[0.98] cursor-pointer whitespace-nowrap ${
        fullWidth ? 'w-full' : ''
      } ${sizeClasses} ${variantClasses}`}
    >
      <span className="inline-flex items-center gap-1.5">
        {isFree ? (
          <Sparkles className="w-3.5 h-3.5 shrink-0" />
        ) : (
          <ShoppingBag className="w-3.5 h-3.5 shrink-0" />
        )}
        <span className="tabular-nums">{priceLabel}</span>
      </span>

      {ctaLabel && (
        <span className="inline-flex items-center gap-1 ps-2 border-s border-white/25 dark:border-slate-950/15 font-extrabold">
          <span>{isFa ? ctaLabel.fa : ctaLabel.en}</span>
          {isFa ? (
            <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover/price:-translate-x-0.5" />
          ) : (
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/price:translate-x-0.5" />
          )}
        </span>
      )}
    </button>
  );
};
