import { ThemeMode } from '../types/lms';

export type ColorPresetId =
  | 'emerald-classic'
  | 'logo-blue'
  | 'royal-slate'
  | 'teal-indigo'
  | 'custom';

export type BorderIntensity = 'subtle' | 'balanced' | 'defined';

export interface ThemeColorConfig {
  preset: ColorPresetId;
  primaryHex: string;
  accentHex: string;
  lightCanvasHex: string;
  borderIntensity: BorderIntensity;
}

export interface ColorPresetMeta {
  id: Exclude<ColorPresetId, 'custom'>;
  nameFa: string;
  nameEn: string;
  descFa: string;
  descEn: string;
  primaryHex: string;
  accentHex: string;
  lightCanvasHex: string;
}

export const DEFAULT_THEME_COLORS: ThemeColorConfig = {
  preset: 'emerald-classic',
  primaryHex: '#059669',
  accentHex: '#FFBA00',
  lightCanvasHex: '#F8FAFC',
  borderIntensity: 'subtle',
};

export const COLOR_PRESETS: ColorPresetMeta[] = [
  {
    id: 'emerald-classic',
    nameFa: 'نسخه اول روشن (زمردی و طلایی FFBA00)',
    nameEn: 'Classic Light (Emerald & #FFBA00 Gold)',
    descFa: 'پالت متعادل ۶۰-۳۰-۱۰ با پس‌زمینه روشن، سبز فیروزه‌ای و طلایی خالص FFBA00',
    descEn: 'Balanced 60-30-10 palette with crisp slate canvas, emerald & pure #FFBA00 gold CTA',
    primaryHex: '#059669',
    accentHex: '#FFBA00',
    lightCanvasHex: '#F8FAFC',
  },
  {
    id: 'logo-blue',
    nameFa: 'آبی لوگو iRamoAi (تک‌رنگ مدرن)',
    nameEn: 'iRamoAi Logo Blue (Unified)',
    descFa: 'هماهنگ با لوگوی آبی برند بدون تداخل رنگ سبز',
    descEn: 'Clean monochromatic azure aligned directly with the iRamoAi icon',
    primaryHex: '#1677FF',
    accentHex: '#1677FF',
    lightCanvasHex: '#F8FAFC',
  },
  {
    id: 'royal-slate',
    nameFa: 'آبی لاجوردی و فیروزه‌ای روشن',
    nameEn: 'Corporate Royal & Sky',
    descFa: 'ترکیب رسمی و مهندسی برای پلتفرم‌های نرم‌افزاری و سازمانی',
    descEn: 'Enterprise-grade royal blue with calm sky highlights',
    primaryHex: '#1D4ED8',
    accentHex: '#0284C7',
    lightCanvasHex: '#F8FAFC',
  },
  {
    id: 'teal-indigo',
    nameFa: 'تیل مدرن و طلایی ملایم',
    nameEn: 'Modern Teal & Gold',
    descFa: 'پالت آرام و متمایز برای دوره‌های آموزشی و ابزارهای AI',
    descEn: 'Calm modern teal paired with clean #FFBA00 gold accents',
    primaryHex: '#0D9488',
    accentHex: '#FFBA00',
    lightCanvasHex: '#F8FAFC',
  },
];

function sanitizeHex(hex: string, fallback: string): string {
  const clean = (hex || '').trim();
  if (/^#[0-9a-fA-F]{6}$/.test(clean)) return clean.toUpperCase();
  if (/^#[0-9a-fA-F]{3}$/.test(clean)) {
    const r = clean[1];
    const g = clean[2];
    const b = clean[3];
    return `#${r}${r}${g}${g}${b}${b}`.toUpperCase();
  }
  return fallback;
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const safe = sanitizeHex(hex, '#059669');
  return {
    r: parseInt(safe.slice(1, 3), 16),
    g: parseInt(safe.slice(3, 5), 16),
    b: parseInt(safe.slice(5, 7), 16),
  };
}

function rgbToHex(r: number, g: number, b: number): string {
  const clamp = (n: number) => Math.max(0, Math.min(255, Math.round(n)));
  return (
    '#' +
    [clamp(r), clamp(g), clamp(b)]
      .map((x) => x.toString(16).padStart(2, '0'))
      .join('')
  );
}

function mixHex(hexA: string, hexB: string, weightB: number): string {
  const a = hexToRgb(hexA);
  const b = hexToRgb(hexB);
  const w = Math.max(0, Math.min(1, weightB));
  return rgbToHex(
    a.r * (1 - w) + b.r * w,
    a.g * (1 - w) + b.g * w,
    a.b * (1 - w) + b.b * w
  );
}

/** WCAG relative luminance check: ensures dark high-contrast text on bright gold/amber buttons, white text on emerald & blue buttons */
export function getContrastForeground(hex: string): string {
  const { r, g, b } = hexToRgb(hex);
  const toLinear = (c: number) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  const lum = 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
  return lum > 0.42 ? '#061A13' : '#FFFFFF';
}

export function applyThemeColorVariables(
  colorConfig: ThemeColorConfig | undefined,
  themeMode: ThemeMode
) {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  const cfg = colorConfig || DEFAULT_THEME_COLORS;

  const primary = sanitizeHex(cfg.primaryHex, DEFAULT_THEME_COLORS.primaryHex);
  const rawAccent = sanitizeHex(cfg.accentHex, DEFAULT_THEME_COLORS.accentHex);
  const accent = rawAccent === '#F59E0B' ? '#FFBA00' : rawAccent;
  const lightCanvas = sanitizeHex(
    cfg.lightCanvasHex,
    DEFAULT_THEME_COLORS.lightCanvasHex
  );

  const pRgb = hexToRgb(primary);
  const aRgb = hexToRgb(accent);

  if (themeMode === 'dark') {
    const darkPrimary =
      cfg.preset === 'emerald-classic'
        ? '#10B981'
        : mixHex(primary, '#FFFFFF', 0.14);
    const darkAccent =
      cfg.preset === 'emerald-classic'
        ? '#FFBA00'
        : accent === '#FFBA00'
        ? '#FFBA00'
        : mixHex(accent, '#FFFFFF', 0.08);
    const dpRgb = hexToRgb(darkPrimary);
    const daRgb = hexToRgb(darkAccent);

    root.style.setProperty('--iramo-canvas', '#050C0A');
    root.style.setProperty('--iramo-surface', '#0B1613');
    root.style.setProperty('--iramo-primary', darkPrimary);
    root.style.setProperty('--iramo-primary-hover', mixHex(darkPrimary, '#FFFFFF', 0.14));
    root.style.setProperty('--iramo-primary-fg', getContrastForeground(darkPrimary));
    root.style.setProperty('--iramo-primary-soft', `rgba(${dpRgb.r}, ${dpRgb.g}, ${dpRgb.b}, 0.14)`);
    root.style.setProperty('--iramo-primary-border', `rgba(${dpRgb.r}, ${dpRgb.g}, ${dpRgb.b}, 0.30)`);

    root.style.setProperty('--iramo-accent', darkAccent);
    root.style.setProperty('--iramo-accent-hover', mixHex(darkAccent, '#FFFFFF', 0.16));
    root.style.setProperty('--iramo-accent-fg', getContrastForeground(darkAccent));
    root.style.setProperty('--iramo-accent-soft', `rgba(${daRgb.r}, ${daRgb.g}, ${daRgb.b}, 0.16)`);
    root.style.setProperty('--iramo-accent-text', darkAccent);

    const darkBorderAlpha =
      cfg.borderIntensity === 'subtle'
        ? 0.14
        : cfg.borderIntensity === 'balanced'
        ? 0.20
        : 0.30;
    root.style.setProperty(
      '--iramo-card-border',
      `rgba(${dpRgb.r}, ${dpRgb.g}, ${dpRgb.b}, ${darkBorderAlpha})`
    );
    root.style.setProperty(
      '--iramo-card-border-hover',
      `rgba(${dpRgb.r}, ${dpRgb.g}, ${dpRgb.b}, 0.55)`
    );
    root.style.setProperty(
      '--iramo-card-shadow-hover',
      `0 14px 32px -8px rgba(${dpRgb.r}, ${dpRgb.g}, ${dpRgb.b}, 0.28), 0 4px 12px -4px rgba(${dpRgb.r}, ${dpRgb.g}, ${dpRgb.b}, 0.14)`
    );
  } else {
    root.style.setProperty('--iramo-canvas', lightCanvas);
    root.style.setProperty('--iramo-surface', '#FFFFFF');
    root.style.setProperty('--iramo-primary', primary);
    root.style.setProperty('--iramo-primary-hover', mixHex(primary, '#FFFFFF', 0.12));
    root.style.setProperty('--iramo-primary-fg', getContrastForeground(primary));
    root.style.setProperty('--iramo-primary-soft', `rgba(${pRgb.r}, ${pRgb.g}, ${pRgb.b}, 0.08)`);
    root.style.setProperty('--iramo-primary-border', `rgba(${pRgb.r}, ${pRgb.g}, ${pRgb.b}, 0.26)`);

    root.style.setProperty('--iramo-accent', accent);
    root.style.setProperty('--iramo-accent-hover', mixHex(accent, '#FFFFFF', 0.16));
    root.style.setProperty('--iramo-accent-fg', getContrastForeground(accent));
    root.style.setProperty('--iramo-accent-soft', `rgba(${aRgb.r}, ${aRgb.g}, ${aRgb.b}, 0.14)`);
    root.style.setProperty('--iramo-accent-text', primary);

    const lightBorderColor =
      cfg.borderIntensity === 'subtle'
        ? 'rgba(15, 23, 42, 0.08)'
        : cfg.borderIntensity === 'balanced'
        ? 'rgba(15, 23, 42, 0.13)'
        : 'rgba(15, 23, 42, 0.20)';

    root.style.setProperty('--iramo-card-border', lightBorderColor);
    // Turquoise-emerald hover border + matching back glow shadow (never gray)
    root.style.setProperty(
      '--iramo-card-border-hover',
      `rgba(${pRgb.r}, ${pRgb.g}, ${pRgb.b}, 0.48)`
    );
    root.style.setProperty(
      '--iramo-card-shadow-hover',
      `0 14px 28px -8px rgba(${pRgb.r}, ${pRgb.g}, ${pRgb.b}, 0.20), 0 4px 12px -4px rgba(${pRgb.r}, ${pRgb.g}, ${pRgb.b}, 0.12)`
    );
  }
}
