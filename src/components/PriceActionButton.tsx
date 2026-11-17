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

  // Principled 60-30-10 tokens driven by Color Manager (defaults to classic Light Mode Emerald & Warm Amber)
  const variantClasses =
    variant === 'emerald'
      ? 'bg-[var(--iramo-primary)] hover:bg-[var(--iramo-primary-hover)] text-[var(--iramo-primary-fg)] shadow-sm shadow-black/10 hover:shadow-md'
      : 'bg-[var(--iramo-accent)] hover:bg-[var(--iramo-accent-hover)] text-[var(--iramo-accent-fg)] shadow-sm shadow-black/10 hover:shadow-md';

  const sizeClasses =
    size === 'md'
      ? 'px-3.5 sm:px-4 py-2.5 text-xs sm:text-[13px] rounded-xl gap-2 sm:gap-2.5'
      : 'px-3 sm:px-3.5 py-2 text-[11px] sm:text-xs rounded-xl gap-1.5 sm:gap-2';

  return (
    <button
      type="button"
      onClick={onClick}
      className={`group/price relative inline-flex items-center justify-between max-w-full min-w-0 font-bold transition-[background-color,box-shadow,transform] duration-150 active:scale-[0.98] cursor-pointer whitespace-nowrap ${
        fullWidth ? 'w-full' : ''
      } ${sizeClasses} ${variantClasses}`}
    >
      <span className="inline-flex items-center gap-1.5 min-w-0">
        {isFree ? (
          <Sparkles className="w-3.5 h-3.5 shrink-0" />
        ) : (
          <ShoppingBag className="w-3.5 h-3.5 shrink-0" />
        )}
        <span className="tabular-nums truncate">{priceLabel}</span>
      </span>

      {ctaLabel && (
        <span className="inline-flex items-center gap-1 ps-2 border-s border-current/20 font-extrabold shrink-0">
          <span>{isFa ? ctaLabel.fa : ctaLabel.en}</span>
          {isFa ? (
            <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover/price:-translate-x-0.5 shrink-0" />
          ) : (
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/price:translate-x-0.5 shrink-0" />
          )}
        </span>
      )}
    </button>
  );
};
