import { Lang } from '../types/lms';

const PERSIAN_DIGITS = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];

export function toLocaleDigits(value: string | number, lang: Lang): string {
  const str = String(value);
  if (lang !== 'fa') return str;
  return str.replace(/\d/g, (d) => PERSIAN_DIGITS[Number(d)] ?? d);
}

export function formatNumber(value: number, lang: Lang): string {
  if (lang === 'fa') {
    return value.toLocaleString('fa-IR');
  }
  return value.toLocaleString('en-US');
}

export function formatPrice(
  priceToman: number,
  priceUsd: number,
  lang: Lang
): string {
  if (lang === 'fa') {
    return `${priceToman.toLocaleString('fa-IR')} تومان`;
  }
  return `$${priceUsd.toLocaleString('en-US')}`;
}
