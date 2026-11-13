import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import type {
  ArticulationEx,
  BubbleEx,
  BuildEx,
  ChoiceEx,
  Exercise,
  IntroLetterEx,
  IntroRuleEx,
  IntroWordEx,
  MatchEx,
  MemoryEx,
  TraceEx,
} from '../lib/content';
import { speakArabic } from '../lib/tts';
import { Bi, isArabic, isMostlyArabic, ProgressBar, SpeakerButton, Stars } from '../components/ui';
import { Mascot } from '../components/Mascots';

export type Variant = 'adult' | 'kids';

interface LessonPlayerProps {
  title: string;
  exercises: Exercise[];
  xp: number;
  variant: Variant;
  accent: string;
  exitTo: string;
  onFinish: (stars: 1 | 2 | 3) => void;
  /** Mascotte-coach affichée en mode enfants. */
  mascot?: string;
}

const COACH_PRAISE = ['Bravo ! 🎉', 'Super ! ⭐', 'Génial ! 🚀', 'Continue comme ça ! 💪', 'Trop fort ! 🌟'];
const COACH_CHEER = ['Essaie encore, tu y es presque !', 'Pas grave, on réessaie ! 💪', 'Courage, tu vas trouver !'];
const pickRandom = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function LessonPlayer({ title, exercises, xp, variant, accent, exitTo, onFinish, mascot }: LessonPlayerProps) {
  const [idx, setIdx] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [done, setDone] = useState(false);
  const [coach, setCoach] = useState('هَيّا — c’est parti !');

  const stars: 1 | 2 | 3 = mistakes === 0 ? 3 : mistakes <= 2 ? 2 : 1;

  useEffect(() => {
    if (done) onFinish(stars);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done]);

  const next = () => {
    if (idx + 1 >= exercises.length) setDone(true);
    else {
      setIdx(idx + 1);
      setCoach(pickRandom(COACH_PRAISE));
    }
  };
  const addMistake = () => {
    setMistakes((m) => m + 1);
    setCoach(pickRandom(COACH_CHEER));
  };

  const kids = variant === 'kids';

  if (done) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center gap-6 p-6 text-center animate-pop">
        {kids && <Confetti />}
        {kids && mascot && <Mascot name={mascot} className="h-28 w-28 animate-float" />}
        <div className={kids ? 'text-6xl' : 'text-7xl'}>{stars === 3 ? '🏆' : '🎉'}</div>
        <h2 className={`font-black ${kids ? 'text-4xl' : 'text-3xl'}`}>
          {kids ? 'Bravo, champion·ne !' : 'Leçon terminée !'}
        </h2>
        <Stars count={stars} size="text-5xl" />
        <p className="text-lg font-bold" style={{ color: accent }}>
          +{xp} XP
        </p>
        <Link
          to={exitTo}
          className="rounded-2xl px-10 py-4 text-lg font-extrabold text-white shadow-lg transition hover:scale-105 active:scale-95"
          style={{ backgroundColor: accent }}
        >
          Continuer
        </Link>
      </div>
    );
  }

  const exercise = exercises[idx];

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-2xl flex-col p-4 sm:p-6">
      <header className="flex items-center gap-4">
        <Link
          to={exitTo}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-black/5 text-lg font-bold text-ink/60 transition hover:bg-black/10"
          aria-label="Quitter la leçon"
        >
          ✕
        </Link>
        <ProgressBar value={idx / exercises.length} color={accent} />
        <span className="shrink-0 text-sm font-bold text-ink/50">
          {idx + 1}/{exercises.length}
        </span>
      </header>
      <p className={`mt-3 text-center font-bold text-ink/40 ${kids ? 'text-base' : 'text-sm'}`}>{title}</p>
      {kids && mascot && (
        <div className="mt-2 flex items-center justify-center gap-2">
          <Mascot name={mascot} className="h-12 w-12 shrink-0" />
          <span className="rounded-2xl rounded-bl-sm bg-white px-3 py-1.5 text-sm font-extrabold text-ink/70 shadow animate-pop" key={coach}>
            {coach}
          </span>
        </div>
      )}

      <main className="flex flex-1 flex-col justify-center py-6" key={idx}>
        <ExerciseView exercise={exercise} kids={kids} accent={accent} onNext={next} onMistake={addMistake} />
      </main>
    </div>
  );
}

interface ExerciseViewProps {
  exercise: Exercise;
  kids: boolean;
  accent: string;
  onNext: () => void;
  onMistake: () => void;
}

function ExerciseView({ exercise, kids, accent, onNext, onMistake }: ExerciseViewProps) {
  switch (exercise.type) {
    case 'intro_letter':
    case 'intro_word':
    case 'intro_rule':
      return <IntroView ex={exercise} kids={kids} accent={accent} onNext={onNext} />;
    case 'articulation':
      return <ArticulationView ex={exercise} accent={accent} onNext={onNext} />;
    case 'mcq':
    case 'translate_choose':
    case 'listen_choose':
      return <ChoiceView ex={exercise} kids={kids} accent={accent} onNext={onNext} onMistake={onMistake} />;
    case 'match':
      return <MatchView ex={exercise} kids={kids} accent={accent} onNext={onNext} onMistake={onMistake} />;
    case 'build':
      return <BuildView ex={exercise} kids={kids} accent={accent} onNext={onNext} onMistake={onMistake} />;
    case 'trace':
      return <TraceView ex={exercise} kids={kids} accent={accent} onNext={onNext} onMistake={onMistake} />;
    case 'memory':
      return <MemoryView ex={exercise} kids={kids} accent={accent} onNext={onNext} />;
    case 'bubble':
      return <BubbleView ex={exercise} kids={kids} onNext={onNext} onMistake={onMistake} />;
  }
}

/** Pluie de confettis émoji (écran de fin, mode enfants). */
function Confetti() {
  const pieces = useMemo(
    () =>
      Array.from({ length: 18 }, (_, i) => ({
        left: Math.random() * 100,
        delay: Math.random() * 0.9,
        duration: 2.2 + Math.random() * 1.6,
        emoji: ['🎉', '⭐', '🎈', '✨', '🌟', '🎊'][i % 6],
      })),
    [],
  );
  return (
    <>
      {pieces.map((p, i) => (
        <span
          key={i}
          className="confetti text-3xl"
          style={{ left: `${p.left}%`, animationDuration: `${p.duration}s`, animationDelay: `${p.delay}s` }}
        >
          {p.emoji}
        </span>
      ))}
    </>
  );
}

function ContinueButton({ accent, onClick, label = 'Continuer' }: { accent: string; onClick: () => void; label?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="mt-8 w-full rounded-2xl py-4 text-lg font-extrabold text-white shadow-lg transition hover:brightness-110 active:scale-[0.98]"
      style={{ backgroundColor: accent }}
    >
      {label}
    </button>
  );
}

/* ---------- Introductions (lettre, mot, règle) ---------- */

function IntroView({
  ex,
  kids,
  accent,
  onNext,
}: {
  ex: IntroLetterEx | IntroWordEx | IntroRuleEx;
  kids: boolean;
  accent: string;
  onNext: () => void;
}) {
  const arabicText = ex.type === 'intro_letter' ? ex.letter : ex.type === 'intro_word' ? ex.word : ex.ar;
  const emoji = ex.type === 'intro_word' ? ex.emoji : undefined;

  useEffect(() => {
    if (arabicText) speakArabic(arabicText);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="animate-slide-up text-center">
      <p className="mb-2 text-sm font-extrabold uppercase tracking-widest" style={{ color: accent }}>
        {ex.type === 'intro_rule' ? '💡 À retenir' : kids ? '✨ Nouveau mot !' : 'Découverte'}
      </p>
      {emoji && <div className="mb-2 text-7xl">{emoji}</div>}
      {arabicText && (
        <button
          type="button"
          onClick={() => speakArabic(arabicText)}
          className="font-arabic mx-auto block rounded-3xl px-6 py-3 leading-normal transition hover:bg-black/5 active:scale-95"
          style={{ fontSize: ex.type === 'intro_letter' ? '6rem' : kids ? '4rem' : '3rem', color: accent }}
          title="Cliquer pour écouter"
        >
          {arabicText}
        </button>
      )}
      <p className={`mx-auto mt-4 max-w-lg whitespace-pre-line ${kids ? 'text-xl font-bold' : 'text-lg'} text-ink/80`}>
        {ex.prompt_fr}
      </p>
      {arabicText && (
        <div className="mt-5">
          <SpeakerButton text={arabicText} />
        </div>
      )}
      <ContinueButton accent={accent} onClick={onNext} label={kids ? "J'ai compris !" : 'Continuer'} />
    </div>
  );
}

/* ---------- Articulation (makharij) ---------- */

function ArticulationView({ ex, accent, onNext }: { ex: ArticulationEx; accent: string; onNext: () => void }) {
  useEffect(() => {
    speakArabic(ex.letter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="animate-slide-up text-center">
      <p className="mb-2 text-sm font-extrabold uppercase tracking-widest" style={{ color: accent }}>
        👄 Point d'articulation — {ex.zone_fr}
      </p>
      <div className="mx-auto flex max-w-md flex-col items-center gap-4 sm:flex-row sm:items-start">
        <HeadDiagram x={ex.point_x} y={ex.point_y} accent={accent} />
        <div className="flex-1">
          <button
            type="button"
            onClick={() => speakArabic(ex.letter)}
            className="font-arabic text-7xl transition hover:scale-110 active:scale-95"
            style={{ color: accent }}
            title="Écouter"
          >
            {ex.letter}
          </button>
          <div className="mt-2">
            <SpeakerButton text={ex.letter} />
          </div>
        </div>
      </div>
      <p className="mx-auto mt-4 max-w-lg text-left text-ink/80">{ex.prompt_fr}</p>
      <ContinueButton accent={accent} onClick={onNext} />
    </div>
  );
}

/** Profil de tête (coupe sagittale simplifiée) avec le point d'articulation. */
function HeadDiagram({ x, y, accent }: { x: number; y: number; accent: string }) {
  return (
    <svg viewBox="0 0 100 100" className="h-44 w-44 shrink-0 rounded-2xl bg-white shadow-sm ring-1 ring-black/5">
      {/* profil tourné vers la gauche */}
      <path
        d="M62 8 C40 8 26 22 25 38 C24.5 46 27 50 24 55 L20 61 C19 63 20 65 23 65 L27 66 L27 73 C27 77 30 79 34 78 L40 77 C42 82 44 88 44 94 L70 94 C72 76 78 66 80 52 C82 30 78 8 62 8 Z"
        fill="#fde8d7"
        stroke="#e0b090"
        strokeWidth="1.5"
      />
      {/* bouche */}
      <path d="M24 58 L38 57" stroke="#c47b5a" strokeWidth="1.8" strokeLinecap="round" />
      {/* langue */}
      <path d="M38 62 C32 62 28 60 26 58 C30 64 36 66 42 65 C46 64 48 62 48 60 C45 61 42 62 38 62 Z" fill="#f4a3a3" />
      {/* cavité gorge */}
      <path d="M52 60 C56 68 58 76 58 86" stroke="#e0b090" strokeWidth="1.5" fill="none" />
      {/* œil */}
      <circle cx="32" cy="38" r="2" fill="#1c2b33" />
      {/* point d'articulation */}
      <circle cx={x * 100} cy={y * 100} r="6" fill={accent} opacity="0.3">
        <animate attributeName="r" values="5;8;5" dur="1.6s" repeatCount="indefinite" />
      </circle>
      <circle cx={x * 100} cy={y * 100} r="3.2" fill={accent} />
    </svg>
  );
}

/* ---------- Choix (QCM, traduction, écoute) ---------- */

function ChoiceView({
  ex,
  kids,
  accent,
  onNext,
  onMistake,
}: {
  ex: ChoiceEx;
  kids: boolean;
  accent: string;
  onNext: () => void;
  onMistake: () => void;
}) {
  const [selected, setSelected] = useState<string | null>(null);
  const options = useMemo(() => shuffle(ex.options), [ex]);
  const isListen = ex.type === 'listen_choose';
  const spoken = ex.tts ?? ex.answer;

  useEffect(() => {
    if (isListen) speakArabic(spoken);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const answered = selected !== null;
  const correct = selected === ex.answer;

  const pick = (opt: string) => {
    if (answered) return;
    setSelected(opt);
    if (opt !== ex.answer) onMistake();
    else if (isMostlyArabic(opt)) speakArabic(opt);
  };

  return (
    <div className="animate-slide-up">
      <h3 className={`text-center font-extrabold ${kids ? 'text-2xl' : 'text-xl'}`}>{ex.prompt_fr}</h3>

      {ex.emoji && <div className="mt-4 text-center text-7xl">{ex.emoji}</div>}
      {ex.ar && (
        <p className="font-arabic mt-4 text-center text-4xl leading-relaxed" style={{ color: accent }}>
          {ex.ar}
        </p>
      )}
      {isListen && (
        <div className="mt-6 flex justify-center">
          <SpeakerButton text={spoken} big label="Réécouter" />
        </div>
      )}

      <div className={`mt-8 grid gap-3 ${options.every((o) => o.length <= 4) ? 'grid-cols-2' : 'grid-cols-1'}`}>
        {options.map((opt) => {
          const isAnswer = opt === ex.answer;
          const isPicked = opt === selected;
          let cls = 'border-black/10 bg-white hover:border-black/25';
          if (answered && isAnswer) cls = 'answer-correct border-green-500 bg-green-50 text-green-800';
          else if (answered && isPicked) cls = 'answer-wrong border-red-400 bg-red-50 text-red-700';
          else if (answered) cls = 'border-black/10 bg-white opacity-50';
          return (
            <button
              key={opt}
              type="button"
              onClick={() => pick(opt)}
              disabled={answered}
              className={`rounded-2xl border-2 px-4 py-4 font-bold shadow-sm transition active:scale-[0.98] ${cls} ${
                kids ? 'text-2xl' : 'text-lg'
              }`}
            >
              <Bi text={opt} className={isArabic(opt) ? (kids ? 'text-3xl' : 'text-2xl') : ''} />
            </button>
          );
        })}
      </div>

      {answered && (
        <div className={`mt-6 rounded-2xl p-4 text-center font-bold animate-pop ${correct ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-700'}`}>
          {correct ? (
            <span>{kids ? '🌟 Super !' : '✅ Correct !'}</span>
          ) : (
            <span>
              {kids ? '💪 Presque !' : '❌ Pas tout à fait.'} La bonne réponse : <Bi text={ex.answer} className="text-xl" />
            </span>
          )}
        </div>
      )}
      {answered && <ContinueButton accent={accent} onClick={onNext} />}
    </div>
  );
}

/* ---------- Association de paires ---------- */

function MatchView({
  ex,
  kids,
  accent,
  onNext,
  onMistake,
}: {
  ex: MatchEx;
  kids: boolean;
  accent: string;
  onNext: () => void;
  onMistake: () => void;
}) {
  const lefts = useMemo(() => shuffle(ex.pairs.map((p) => p.left)), [ex]);
  const rights = useMemo(() => shuffle(ex.pairs.map((p) => p.right)), [ex]);
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [matched, setMatched] = useState<Set<string>>(new Set());
  const [wrongPair, setWrongPair] = useState<[string, string] | null>(null);

  const complete = matched.size === ex.pairs.length;

  const pickLeft = (l: string) => {
    if (matched.has(l)) return;
    setSelectedLeft(l);
    if (isMostlyArabic(l)) speakArabic(l);
  };

  const pickRight = (r: string) => {
    if (!selectedLeft) return;
    const pair = ex.pairs.find((p) => p.left === selectedLeft);
    if (matched.size < ex.pairs.length && ex.pairs.some((p) => p.right === r && matched.has(p.left))) return;
    if (pair && pair.right === r) {
      setMatched((prev) => new Set(prev).add(selectedLeft));
      setSelectedLeft(null);
    } else {
      onMistake();
      setWrongPair([selectedLeft, r]);
      setTimeout(() => setWrongPair(null), 600);
      setSelectedLeft(null);
    }
  };

  const rightMatched = (r: string) => ex.pairs.some((p) => p.right === r && matched.has(p.left));

  const btnBase = `rounded-2xl border-2 px-3 py-3 font-bold shadow-sm transition active:scale-[0.97] ${kids ? 'text-xl' : ''}`;

  return (
    <div className="animate-slide-up">
      <h3 className={`text-center font-extrabold ${kids ? 'text-2xl' : 'text-xl'}`}>{ex.prompt_fr}</h3>
      <div className="mt-8 grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-3">
          {lefts.map((l) => {
            const ok = matched.has(l);
            const isSel = selectedLeft === l;
            const isWrong = wrongPair?.[0] === l;
            return (
              <button
                key={l}
                type="button"
                onClick={() => pickLeft(l)}
                disabled={ok}
                className={`${btnBase} ${
                  ok
                    ? 'border-green-400 bg-green-50 text-green-700 opacity-60'
                    : isWrong
                      ? 'answer-wrong border-red-400 bg-red-50'
                      : isSel
                        ? 'bg-white'
                        : 'border-black/10 bg-white hover:border-black/25'
                }`}
                style={isSel ? { borderColor: accent, boxShadow: `0 0 0 3px ${accent}33` } : undefined}
              >
                <Bi text={l} className={isArabic(l) ? 'text-2xl' : ''} />
              </button>
            );
          })}
        </div>
        <div className="flex flex-col gap-3">
          {rights.map((r) => {
            const ok = rightMatched(r);
            const isWrong = wrongPair?.[1] === r;
            return (
              <button
                key={r}
                type="button"
                onClick={() => pickRight(r)}
                disabled={ok || !selectedLeft}
                className={`${btnBase} ${
                  ok
                    ? 'border-green-400 bg-green-50 text-green-700 opacity-60'
                    : isWrong
                      ? 'answer-wrong border-red-400 bg-red-50'
                      : 'border-black/10 bg-white hover:border-black/25 disabled:opacity-60'
                }`}
              >
                <Bi text={r} className={isArabic(r) ? 'text-2xl' : ''} />
              </button>
            );
          })}
        </div>
      </div>
      {complete && (
        <div className="mt-6 rounded-2xl bg-green-100 p-4 text-center font-bold text-green-800 animate-pop">
          {kids ? '🌟 Toutes les paires trouvées !' : '✅ Toutes les paires sont associées !'}
        </div>
      )}
      {complete && <ContinueButton accent={accent} onClick={onNext} />}
    </div>
  );
}

/* ---------- Construction de phrase ---------- */

function BuildView({
  ex,
  kids,
  accent,
  onNext,
  onMistake,
}: {
  ex: BuildEx;
  kids: boolean;
  accent: string;
  onNext: () => void;
  onMistake: () => void;
}) {
  const bank = useMemo(() => shuffle(ex.tokens.map((t, i) => ({ t, i }))), [ex]);
  const [placed, setPlaced] = useState<{ t: string; i: number }[]>([]);
  const [checked, setChecked] = useState<null | boolean>(null);

  const usedIdx = new Set(placed.map((p) => p.i));

  const check = () => {
    const ok = placed.length === ex.answer.length && placed.every((p, k) => p.t === ex.answer[k]);
    setChecked(ok);
    if (ok) speakArabic(ex.answer.join(' '));
    else onMistake();
  };

  return (
    <div className="animate-slide-up">
      <h3 className={`text-center font-extrabold ${kids ? 'text-2xl' : 'text-xl'}`}>{ex.prompt_fr}</h3>

      {/* zone de construction (RTL) */}
      <div
        dir="rtl"
        className="mt-8 flex min-h-20 flex-wrap items-center gap-2 rounded-2xl border-2 border-dashed border-black/15 bg-white/60 p-4"
      >
        {placed.length === 0 && (
          <span dir="ltr" className="text-sm font-semibold text-ink/35">
            Touche les mots pour construire la phrase…
          </span>
        )}
        {placed.map((p, k) => (
          <button
            key={`${p.i}-${k}`}
            type="button"
            disabled={checked === true}
            onClick={() => {
              if (checked === true) return;
              setPlaced(placed.filter((_, j) => j !== k));
              setChecked(null);
            }}
            className="font-arabic rounded-xl bg-white px-4 py-2 text-2xl font-semibold shadow ring-1 ring-black/10 transition hover:bg-red-50 active:scale-95"
          >
            {p.t}
          </button>
        ))}
      </div>

      {/* banque de mots */}
      <div dir="rtl" className="mt-6 flex flex-wrap justify-center gap-2">
        {bank.map(({ t, i }) => (
          <button
            key={i}
            type="button"
            disabled={usedIdx.has(i) || checked === true}
            onClick={() => {
              setPlaced([...placed, { t, i }]);
              setChecked(null);
              speakArabic(t);
            }}
            className={`font-arabic rounded-xl px-4 py-2 text-2xl font-semibold shadow-sm ring-1 ring-black/10 transition active:scale-95 ${
              usedIdx.has(i) ? 'bg-black/5 text-transparent' : 'bg-white hover:-translate-y-0.5'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {checked === null && placed.length > 0 && (
        <ContinueButton accent={accent} onClick={check} label="Vérifier" />
      )}
      {checked === false && (
        <div className="mt-6 rounded-2xl bg-red-100 p-4 text-center font-bold text-red-700 animate-pop">
          {kids ? '💪 Essaie encore !' : '❌ Ce n’est pas ça.'} Réponse attendue :{' '}
          <span className="font-arabic text-2xl">{ex.answer.join(' ')}</span>
        </div>
      )}
      {checked === false && (
        <button
          type="button"
          onClick={() => {
            setPlaced([]);
            setChecked(null);
          }}
          className="mt-3 w-full rounded-2xl border-2 border-black/10 bg-white py-3 font-extrabold text-ink/70 transition hover:border-black/25"
        >
          Réessayer
        </button>
      )}
      {checked === false && <ContinueButton accent={accent} onClick={onNext} label="Passer" />}
      {checked === true && (
        <div className="mt-6 rounded-2xl bg-green-100 p-4 text-center font-bold text-green-800 animate-pop">
          {kids ? '🌟 Parfait !' : '✅ Exactement !'}
        </div>
      )}
      {checked === true && <ContinueButton accent={accent} onClick={onNext} />}
    </div>
  );
}

/* ---------- Tracé de lettre (écriture au doigt) ---------- */

const TRACE_SIZE = 300;

function TraceView({
  ex,
  kids,
  accent,
  onNext,
  onMistake,
}: {
  ex: TraceEx;
  kids: boolean;
  accent: string;
  onNext: () => void;
  onMistake: () => void;
}) {
  const guideRef = useRef<HTMLCanvasElement>(null);
  const drawRef = useRef<HTMLCanvasElement>(null);
  const glyphMask = useRef<Uint8ClampedArray | null>(null);
  const toleranceMask = useRef<Uint8ClampedArray | null>(null);
  const dprRef = useRef(1);
  const drawing = useRef(false);
  const [tries, setTries] = useState(0);
  const [result, setResult] = useState<null | 'ok' | 'retry'>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        await document.fonts.load('230px "Noto Naskh Arabic"', ex.letter);
      } catch {
        /* la police système fera l'affaire */
      }
      if (cancelled || !guideRef.current || !drawRef.current) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      dprRef.current = dpr;
      for (const canvas of [guideRef.current, drawRef.current]) {
        canvas.width = TRACE_SIZE * dpr;
        canvas.height = TRACE_SIZE * dpr;
      }
      // Gabarit gris de la lettre.
      const g = guideRef.current.getContext('2d')!;
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
      g.clearRect(0, 0, TRACE_SIZE, TRACE_SIZE);
      g.font = '230px "Noto Naskh Arabic", serif';
      g.textAlign = 'center';
      g.textBaseline = 'middle';
      g.fillStyle = '#d6d3d1';
      g.fillText(ex.letter, TRACE_SIZE / 2, TRACE_SIZE / 2 - 12);
      glyphMask.current = g.getImageData(0, 0, guideRef.current.width, guideRef.current.height).data;
      // Masque de tolérance : la lettre « épaissie » (un enfant ne trace pas au pixel près).
      const off = document.createElement('canvas');
      off.width = guideRef.current.width;
      off.height = guideRef.current.height;
      const o = off.getContext('2d')!;
      o.setTransform(dpr, 0, 0, dpr, 0, 0);
      o.font = '230px "Noto Naskh Arabic", serif';
      o.textAlign = 'center';
      o.textBaseline = 'middle';
      o.fillStyle = '#000';
      for (let dx = -12; dx <= 12; dx += 6)
        for (let dy = -12; dy <= 12; dy += 6) o.fillText(ex.letter, TRACE_SIZE / 2 + dx, TRACE_SIZE / 2 - 12 + dy);
      toleranceMask.current = o.getImageData(0, 0, off.width, off.height).data;
      // Contexte de dessin de l'utilisateur.
      const d = drawRef.current.getContext('2d')!;
      d.setTransform(dpr, 0, 0, dpr, 0, 0);
      d.lineWidth = 16;
      d.lineCap = 'round';
      d.lineJoin = 'round';
      d.strokeStyle = accent;
      speakArabic(ex.letter);
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ex]);

  const toLocal = (e: React.PointerEvent) => {
    const rect = drawRef.current!.getBoundingClientRect();
    return {
      x: ((e.clientX - rect.left) * TRACE_SIZE) / rect.width,
      y: ((e.clientY - rect.top) * TRACE_SIZE) / rect.height,
    };
  };

  const startStroke = (e: React.PointerEvent) => {
    if (result === 'ok') return;
    drawing.current = true;
    drawRef.current!.setPointerCapture?.(e.pointerId);
    const ctx = drawRef.current!.getContext('2d')!;
    const p = toLocal(e);
    ctx.beginPath();
    ctx.moveTo(p.x, p.y);
    ctx.lineTo(p.x + 0.1, p.y + 0.1);
    ctx.stroke();
  };
  const moveStroke = (e: React.PointerEvent) => {
    if (!drawing.current || result === 'ok') return;
    const ctx = drawRef.current!.getContext('2d')!;
    const p = toLocal(e);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
  };
  const endStroke = () => {
    drawing.current = false;
  };

  const clear = () => {
    const ctx = drawRef.current!.getContext('2d')!;
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, drawRef.current!.width, drawRef.current!.height);
    ctx.restore();
    setResult(null);
  };

  const check = () => {
    if (!glyphMask.current || !toleranceMask.current) return;
    const user = drawRef.current!
      .getContext('2d')!
      .getImageData(0, 0, drawRef.current!.width, drawRef.current!.height).data;
    let glyph = 0;
    let covered = 0;
    let userPx = 0;
    let inside = 0;
    for (let i = 3; i < user.length; i += 4) {
      const onGlyph = glyphMask.current[i] > 16;
      const onUser = user[i] > 16;
      if (onGlyph) {
        glyph++;
        if (onUser) covered++;
      }
      if (onUser) {
        userPx++;
        if (toleranceMask.current[i] > 16) inside++;
      }
    }
    const ok = userPx > 0 && glyph > 0 && covered / glyph >= 0.45 && inside / userPx >= 0.55;
    if (ok) {
      setResult('ok');
      speakArabic(ex.letter);
    } else {
      if (tries === 0) onMistake();
      setTries((t) => t + 1);
      setResult('retry');
    }
  };

  return (
    <div className="animate-slide-up text-center">
      <h3 className={`font-extrabold ${kids ? 'text-2xl' : 'text-xl'}`}>
        {ex.prompt_fr ?? '✍️ Trace la lettre avec ton doigt !'}
      </h3>
      <div className="mt-2 flex items-center justify-center gap-3">
        <span className="font-arabic text-3xl" style={{ color: accent }}>
          {ex.letter}
        </span>
        <SpeakerButton text={ex.letter} />
      </div>
      <div
        className="relative mx-auto mt-4 rounded-3xl border-4 border-dashed bg-white shadow-inner"
        style={{ width: TRACE_SIZE, height: TRACE_SIZE, maxWidth: '100%', borderColor: `${accent}55` }}
      >
        <canvas ref={guideRef} className="absolute inset-0 h-full w-full rounded-3xl" />
        <canvas
          ref={drawRef}
          className="absolute inset-0 h-full w-full rounded-3xl"
          style={{ touchAction: 'none' }}
          onPointerDown={startStroke}
          onPointerMove={moveStroke}
          onPointerUp={endStroke}
          onPointerLeave={endStroke}
        />
      </div>

      {result === 'ok' ? (
        <>
          <div className="mx-auto mt-4 max-w-sm rounded-2xl bg-green-100 p-3 text-center font-bold text-green-800 animate-pop">
            {kids ? '🌟 Magnifique tracé !' : '✅ Bien tracé !'}
          </div>
          <ContinueButton accent={accent} onClick={onNext} />
        </>
      ) : (
        <>
          {result === 'retry' && (
            <div className="mx-auto mt-4 max-w-sm rounded-2xl bg-amber-100 p-3 text-center font-bold text-amber-800 animate-pop">
              {kids ? '💪 Presque ! Repasse bien sur la lettre grise.' : 'Repasse plus précisément sur le gabarit gris.'}
            </div>
          )}
          <div className="mx-auto mt-4 flex max-w-sm gap-3">
            <button
              type="button"
              onClick={clear}
              className="flex-1 rounded-2xl border-2 border-black/10 bg-white py-3 font-extrabold text-ink/70 transition hover:border-black/25"
            >
              🧽 Effacer
            </button>
            <button
              type="button"
              onClick={check}
              className="flex-1 rounded-2xl py-3 font-extrabold text-white shadow-lg transition hover:brightness-110 active:scale-[0.98]"
              style={{ backgroundColor: accent }}
            >
              Vérifier
            </button>
          </div>
          {tries >= 2 && (
            <button type="button" onClick={onNext} className="mt-3 font-bold text-ink/50 underline">
              Continuer quand même
            </button>
          )}
        </>
      )}
    </div>
  );
}

/* ---------- Memory (retrouver les paires) ---------- */

function MemoryView({
  ex,
  kids,
  accent,
  onNext,
}: {
  ex: MemoryEx;
  kids: boolean;
  accent: string;
  onNext: () => void;
}) {
  const cards = useMemo(
    () =>
      shuffle(
        ex.pairs.flatMap((p, i) => [
          { id: `l${i}`, face: p.left, pair: i },
          { id: `r${i}`, face: p.right, pair: i },
        ]),
      ),
    [ex],
  );
  const [open, setOpen] = useState<string[]>([]);
  const [matched, setMatched] = useState<Set<number>>(new Set());
  const [locked, setLocked] = useState(false);

  const complete = matched.size === ex.pairs.length;

  const flip = (card: { id: string; face: string; pair: number }) => {
    if (locked || complete || matched.has(card.pair) || open.includes(card.id)) return;
    if (isMostlyArabic(card.face)) speakArabic(card.face);
    const next = [...open, card.id];
    setOpen(next);
    if (next.length < 2) return;
    setLocked(true);
    const [a, b] = next.map((id) => cards.find((c) => c.id === id)!);
    if (a.pair === b.pair) {
      setTimeout(() => {
        setMatched((prev) => new Set(prev).add(a.pair));
        setOpen([]);
        setLocked(false);
      }, 500);
    } else {
      setTimeout(() => {
        setOpen([]);
        setLocked(false);
      }, 950);
    }
  };

  return (
    <div className="animate-slide-up">
      <h3 className={`text-center font-extrabold ${kids ? 'text-2xl' : 'text-xl'}`}>{ex.prompt_fr}</h3>
      <div className={`mx-auto mt-6 grid max-w-md gap-3 ${cards.length <= 6 ? 'grid-cols-3' : 'grid-cols-4'}`}>
        {cards.map((card) => {
          const faceUp = open.includes(card.id) || matched.has(card.pair);
          return (
            <button
              key={card.id}
              type="button"
              onClick={() => flip(card)}
              className={`flex aspect-square items-center justify-center rounded-2xl border-b-4 font-black shadow transition active:scale-95 ${
                matched.has(card.pair) ? 'opacity-70' : ''
              }`}
              style={
                faceUp
                  ? { backgroundColor: 'white', borderColor: matched.has(card.pair) ? '#22c55e' : accent }
                  : { backgroundColor: accent, borderColor: 'rgba(0,0,0,0.25)' }
              }
            >
              {faceUp ? (
                <Bi
                  text={card.face}
                  className={`animate-pop ${isArabic(card.face) ? 'text-2xl' : 'text-4xl'}`}
                />
              ) : (
                <span className="text-3xl text-white/90">؟</span>
              )}
            </button>
          );
        })}
      </div>
      {complete && (
        <div className="mt-6 rounded-2xl bg-green-100 p-4 text-center font-bold text-green-800 animate-pop">
          {kids ? '🌟 Toutes les paires trouvées, bravo !' : '✅ Toutes les paires sont retrouvées !'}
        </div>
      )}
      {complete && <ContinueButton accent={accent} onClick={onNext} />}
    </div>
  );
}

/* ---------- Bulles magiques (écoute et éclate la bonne bulle) ---------- */

const BUBBLE_COLORS = ['#f97316', '#8b5cf6', '#0ea5e9', '#22c55e', '#ec4899', '#eab308'];

function BubbleView({
  ex,
  kids,
  onNext,
  onMistake,
}: {
  ex: BubbleEx;
  kids: boolean;
  onNext: () => void;
  onMistake: () => void;
}) {
  const bubbles = useMemo(() => shuffle(ex.options), [ex]);
  const [popped, setPopped] = useState(false);
  const [wrong, setWrong] = useState<Set<string>>(new Set());

  useEffect(() => {
    speakArabic(ex.tts);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pick = (opt: string) => {
    if (popped) return;
    if (opt === ex.answer) {
      setPopped(true);
      setTimeout(onNext, 1100);
    } else if (!wrong.has(opt)) {
      onMistake();
      setWrong((prev) => new Set(prev).add(opt));
    }
  };

  return (
    <div className="animate-slide-up text-center">
      <h3 className={`font-extrabold ${kids ? 'text-2xl' : 'text-xl'}`}>{ex.prompt_fr}</h3>
      <div className="mt-5 flex justify-center">
        <SpeakerButton text={ex.tts} big label="Réécouter" />
      </div>
      <div className="mx-auto mt-8 flex max-w-md flex-wrap items-center justify-center gap-5">
        {bubbles.map((opt, i) => {
          const isAnswer = opt === ex.answer;
          const missed = wrong.has(opt);
          return (
            <button
              key={opt}
              type="button"
              onClick={() => pick(opt)}
              disabled={missed}
              className={`bubble-float flex items-center justify-center rounded-full font-black text-white shadow-lg transition ${
                popped && isAnswer ? 'bubble-popped' : ''
              } ${missed ? 'opacity-30' : 'hover:scale-110 active:scale-95'}`}
              style={{
                width: kids ? 96 : 80,
                height: kids ? 96 : 80,
                background: `radial-gradient(circle at 30% 30%, #ffffff66, transparent 40%), ${BUBBLE_COLORS[i % BUBBLE_COLORS.length]}`,
                animationDelay: `${(i * 0.45) % 2}s`,
                animationDuration: `${2.6 + (i % 3) * 0.5}s`,
              }}
            >
              <Bi text={opt} className={isArabic(opt) ? 'text-4xl' : 'text-3xl'} />
            </button>
          );
        })}
      </div>
      {popped && (
        <div className="mt-6 inline-block rounded-2xl bg-green-100 px-6 py-3 font-bold text-green-800 animate-pop">
          {kids ? '🎉 POP ! Bien joué !' : '✅ Correct !'}
        </div>
      )}
    </div>
  );
}
