import { speakArabic } from '../lib/tts';

export function isArabic(text: string): boolean {
  return /[؀-ۿ]/.test(text);
}

/** Vrai si le texte est essentiellement en arabe (et pas une phrase française
 * qui cite une lettre arabe) : seul ce cas doit être prononcé. */
export function isMostlyArabic(text: string): boolean {
  const arabic = (text.match(/[؀-ۿ]/g) ?? []).length;
  const latin = (text.match(/[a-zA-ZÀ-ÿ]/g) ?? []).length;
  return arabic > 0 && arabic >= latin;
}

/** Affiche un texte en appliquant la police arabe (et lang/RTL) si nécessaire. */
export function Bi({ text, className = '' }: { text: string; className?: string }) {
  const ar = isArabic(text);
  return (
    <span lang={ar ? 'ar' : undefined} className={`${ar ? 'font-arabic' : ''} ${className}`}>
      {text}
    </span>
  );
}

export function Stars({ count, size = 'text-3xl' }: { count: number; size?: string }) {
  return (
    <span className={`${size} tracking-wider`} aria-label={`${count} étoiles sur 3`}>
      {[1, 2, 3].map((i) => (
        <span key={i} className={i <= count ? '' : 'opacity-25 grayscale'}>
          ⭐
        </span>
      ))}
    </span>
  );
}

export function SpeakerButton({
  text,
  big = false,
  label = 'Écouter',
}: {
  text: string;
  big?: boolean;
  label?: string;
}) {
  return (
    <button
      type="button"
      onClick={() => speakArabic(text)}
      className={
        big
          ? 'flex h-24 w-24 items-center justify-center rounded-3xl bg-brand-600 text-5xl text-white shadow-lg shadow-brand-600/30 transition hover:scale-105 hover:bg-brand-700 active:scale-95'
          : 'inline-flex items-center gap-2 rounded-full bg-brand-100 px-4 py-2 text-sm font-bold text-brand-800 transition hover:bg-brand-200 active:scale-95'
      }
      aria-label={label}
      title={label}
    >
      🔊
      {!big && <span>{label}</span>}
    </button>
  );
}

export function ProgressBar({ value, color = '#0d9488' }: { value: number; color?: string }) {
  return (
    <div className="h-3 w-full overflow-hidden rounded-full bg-black/10">
      <div
        className="h-full rounded-full transition-all duration-500"
        style={{ width: `${Math.round(value * 100)}%`, backgroundColor: color }}
      />
    </div>
  );
}
