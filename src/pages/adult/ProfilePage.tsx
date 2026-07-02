import { levels } from '../../data/course';
import { allLessons } from '../../lib/content';
import { useProgress } from '../../lib/progress';
import { ProgressBar } from '../../components/ui';

interface Badge {
  emoji: string;
  title: string;
  desc: string;
  earned: boolean;
}

export function ProfilePage() {
  const { state, reset } = useProgress();

  const lessons = allLessons(levels);
  const doneCount = lessons.filter(({ lesson }) => state.lessons[lesson.id]).length;
  const perfectCount = Object.values(state.lessons).filter((r) => r.stars === 3).length;

  const badges: Badge[] = [
    { emoji: '🐣', title: 'Premiers pas', desc: 'Terminer une leçon', earned: doneCount >= 1 },
    { emoji: '🔤', title: 'Lecteur', desc: "Terminer le niveau A0 (alphabet)", earned: levels[0].modules.flatMap((m) => m.lessons).every((l) => state.lessons[l.id]) },
    { emoji: '🔥', title: 'Régulier', desc: 'Série de 3 jours', earned: state.streakCount >= 3 },
    { emoji: '⭐', title: 'Perfectionniste', desc: '5 leçons sans faute', earned: perfectCount >= 5 },
    { emoji: '⚡', title: 'Énergique', desc: 'Gagner 200 XP', earned: state.xp >= 200 },
    { emoji: '🎓', title: 'Diplômé', desc: 'Terminer toutes les leçons', earned: doneCount === lessons.length },
  ];

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-3xl font-black">Mon profil</h1>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          ['⚡', `${state.xp}`, 'XP au total'],
          ['🔥', `${state.streakCount}`, 'jours de série'],
          ['📚', `${doneCount}/${lessons.length}`, 'leçons finies'],
          ['🏆', `${perfectCount}`, 'sans-faute'],
        ].map(([emoji, value, label]) => (
          <div key={label} className="rounded-3xl bg-white p-5 text-center shadow-sm ring-1 ring-black/5">
            <div className="text-3xl">{emoji}</div>
            <div className="mt-1 text-2xl font-black">{value}</div>
            <div className="text-xs font-bold text-ink/50">{label}</div>
          </div>
        ))}
      </div>

      <h2 className="mt-10 text-xl font-black">Progression par niveau</h2>
      <div className="mt-4 space-y-4">
        {levels.map((level) => {
          const ids = level.modules.flatMap((m) => m.lessons.map((l) => l.id));
          const done = ids.filter((id) => state.lessons[id]).length;
          return (
            <div key={level.id} className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-black/5">
              <div className="mb-2 flex items-center justify-between">
                <span className="font-black">
                  {level.cefr} — {level.title_fr}
                </span>
                <span className="text-sm font-extrabold text-ink/50">
                  {done}/{ids.length}
                </span>
              </div>
              <ProgressBar value={ids.length ? done / ids.length : 0} color={level.color} />
            </div>
          );
        })}
      </div>

      <h2 className="mt-10 text-xl font-black">Badges</h2>
      <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
        {badges.map((b) => (
          <div
            key={b.title}
            className={`rounded-3xl p-5 text-center ring-1 ${
              b.earned ? 'bg-white shadow-sm ring-black/5' : 'bg-black/5 opacity-50 ring-transparent grayscale'
            }`}
          >
            <div className="text-4xl">{b.emoji}</div>
            <div className="mt-1 font-black">{b.title}</div>
            <div className="text-xs font-semibold text-ink/55">{b.desc}</div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={() => {
          if (window.confirm('Effacer toute la progression (adulte et enfants) ? Cette action est définitive.')) reset();
        }}
        className="mt-10 rounded-2xl border-2 border-red-200 px-6 py-3 font-extrabold text-red-600 transition hover:bg-red-50"
      >
        Réinitialiser ma progression
      </button>
    </main>
  );
}
