// Mascottes cartoon du mode enfants, dessinées en SVG.

interface MascotProps {
  className?: string;
}

export function CatMascot({ className }: MascotProps) {
  return (
    <svg viewBox="0 0 120 120" className={className} aria-hidden>
      <ellipse cx="60" cy="108" rx="30" ry="6" fill="rgba(0,0,0,0.08)" />
      {/* oreilles */}
      <polygon points="30,38 40,10 52,34" fill="#f59e0b" />
      <polygon points="90,38 80,10 68,34" fill="#f59e0b" />
      <polygon points="34,34 41,16 49,32" fill="#fbcfe8" />
      <polygon points="86,34 79,16 71,32" fill="#fbcfe8" />
      {/* tête */}
      <circle cx="60" cy="58" r="34" fill="#fbbf24" />
      {/* joues */}
      <circle cx="38" cy="66" r="7" fill="#fb923c" opacity="0.55" />
      <circle cx="82" cy="66" r="7" fill="#fb923c" opacity="0.55" />
      {/* yeux */}
      <circle cx="47" cy="54" r="6.5" fill="#1c2b33" />
      <circle cx="73" cy="54" r="6.5" fill="#1c2b33" />
      <circle cx="49" cy="52" r="2.2" fill="#fff" />
      <circle cx="75" cy="52" r="2.2" fill="#fff" />
      {/* museau */}
      <polygon points="60,62 55,68 65,68" fill="#f472b6" />
      <path d="M60 68 Q60 74 52 75 M60 68 Q60 74 68 75" stroke="#1c2b33" strokeWidth="2.4" fill="none" strokeLinecap="round" />
      {/* moustaches */}
      <path d="M30 60 L14 56 M30 66 L14 68 M90 60 L106 56 M90 66 L106 68" stroke="#1c2b33" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function CamelMascot({ className }: MascotProps) {
  return (
    <svg viewBox="0 0 120 120" className={className} aria-hidden>
      <ellipse cx="60" cy="110" rx="32" ry="6" fill="rgba(0,0,0,0.08)" />
      {/* bosse */}
      <ellipse cx="60" cy="92" rx="30" ry="18" fill="#d29a3d" />
      {/* cou + tête */}
      <rect x="50" y="42" width="20" height="46" rx="10" fill="#dfb15e" />
      <ellipse cx="60" cy="38" rx="24" ry="20" fill="#dfb15e" />
      {/* oreilles */}
      <ellipse cx="40" cy="24" rx="6" ry="9" fill="#d29a3d" transform="rotate(-20 40 24)" />
      <ellipse cx="80" cy="24" rx="6" ry="9" fill="#d29a3d" transform="rotate(20 80 24)" />
      {/* touffe */}
      <circle cx="60" cy="18" r="8" fill="#b97f2e" />
      {/* yeux */}
      <circle cx="50" cy="36" r="5.5" fill="#1c2b33" />
      <circle cx="70" cy="36" r="5.5" fill="#1c2b33" />
      <circle cx="51.8" cy="34.4" r="1.9" fill="#fff" />
      <circle cx="71.8" cy="34.4" r="1.9" fill="#fff" />
      {/* museau souriant */}
      <ellipse cx="60" cy="50" rx="13" ry="8" fill="#f3e3bf" />
      <path d="M53 50 Q60 56 67 50" stroke="#1c2b33" strokeWidth="2.4" fill="none" strokeLinecap="round" />
      <circle cx="55" cy="47" r="1.6" fill="#1c2b33" />
      <circle cx="65" cy="47" r="1.6" fill="#1c2b33" />
    </svg>
  );
}

export function OwlMascot({ className }: MascotProps) {
  return (
    <svg viewBox="0 0 120 120" className={className} aria-hidden>
      <ellipse cx="60" cy="110" rx="28" ry="6" fill="rgba(0,0,0,0.08)" />
      {/* corps */}
      <ellipse cx="60" cy="68" rx="34" ry="40" fill="#7c3aed" />
      <ellipse cx="60" cy="78" rx="22" ry="26" fill="#a78bfa" />
      {/* aigrettes */}
      <polygon points="34,34 28,14 46,26" fill="#7c3aed" />
      <polygon points="86,34 92,14 74,26" fill="#7c3aed" />
      {/* yeux */}
      <circle cx="46" cy="52" r="14" fill="#fff" />
      <circle cx="74" cy="52" r="14" fill="#fff" />
      <circle cx="46" cy="52" r="7" fill="#1c2b33" />
      <circle cx="74" cy="52" r="7" fill="#1c2b33" />
      <circle cx="48.5" cy="49.5" r="2.4" fill="#fff" />
      <circle cx="76.5" cy="49.5" r="2.4" fill="#fff" />
      {/* bec */}
      <polygon points="60,60 54,68 66,68" fill="#f59e0b" />
      {/* ailes */}
      <ellipse cx="28" cy="72" rx="9" ry="20" fill="#6d28d9" transform="rotate(12 28 72)" />
      <ellipse cx="92" cy="72" rx="9" ry="20" fill="#6d28d9" transform="rotate(-12 92 72)" />
      {/* pattes */}
      <path d="M50 106 l-4 6 M50 106 l4 6 M70 106 l-4 6 M70 106 l4 6" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

export function FennecMascot({ className }: MascotProps) {
  return (
    <svg viewBox="0 0 120 120" className={className} aria-hidden>
      <ellipse cx="60" cy="108" rx="30" ry="6" fill="rgba(0,0,0,0.08)" />
      {/* grandes oreilles */}
      <polygon points="26,48 30,6 54,36" fill="#f4a261" />
      <polygon points="94,48 90,6 66,36" fill="#f4a261" />
      <polygon points="32,44 34,16 50,36" fill="#fde8d7" />
      <polygon points="88,44 86,16 70,36" fill="#fde8d7" />
      {/* tête */}
      <ellipse cx="60" cy="66" rx="34" ry="30" fill="#f4a261" />
      <ellipse cx="60" cy="76" rx="22" ry="17" fill="#fde8d7" />
      {/* yeux */}
      <circle cx="46" cy="60" r="6" fill="#1c2b33" />
      <circle cx="74" cy="60" r="6" fill="#1c2b33" />
      <circle cx="48" cy="58" r="2" fill="#fff" />
      <circle cx="76" cy="58" r="2" fill="#fff" />
      {/* truffe + sourire */}
      <ellipse cx="60" cy="72" rx="4.5" ry="3.5" fill="#1c2b33" />
      <path d="M60 76 Q60 82 52 83 M60 76 Q60 82 68 83" stroke="#1c2b33" strokeWidth="2.4" fill="none" strokeLinecap="round" />
    </svg>
  );
}

export function Mascot({ name, className }: { name: string; className?: string }) {
  switch (name) {
    case 'cat':
      return <CatMascot className={className} />;
    case 'camel':
      return <CamelMascot className={className} />;
    case 'owl':
      return <OwlMascot className={className} />;
    default:
      return <FennecMascot className={className} />;
  }
}
