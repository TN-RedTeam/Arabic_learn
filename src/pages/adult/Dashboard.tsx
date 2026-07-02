import { Link } from 'react-router-dom';
import { levels } from '../../data/course';
import { lessonCount } from '../../lib/content';
import { useProgress } from '../../lib/progress';
import { ProgressBar, Stars } from '../../components/ui';

export function Dashboard() {
  const { state } = useProgress();

  const doneIn = (ids: string[]) => ids.filter((id) => state.lessons[id]).length;

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-3xl font-black">Mon parcours</h1>
      <p className="mt-1 font-semibold text-ink/60">
        Avancez leçon par leçon — chaque étoile compte. مَرحَبًا بِك !
      </p>

      <div className="mt-8 space-y-10">
        {levels.map((level) => {
          const ids = level.modules.flatMap((m) => m.lessons.map((l) => l.id));
          const done = doneIn(ids);
          return (
            <section key={level.id}>
              <div className="flex items-center gap-3">
                <span
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-sm font-black text-white shadow"
                  style={{ backgroundColor: level.color }}
                >
                  {level.cefr}
                </span>
                <div className="min-w-0 flex-1">
                  <h2 className="text-xl font-black">{level.title_fr}</h2>
                  <p className="truncate text-sm font-semibold text-ink/55">{level.subtitle_fr}</p>
                </div>
                <span className="shrink-0 text-sm font-extrabold text-ink/50">
                  {done}/{lessonCount(level)}
                </span>
              </div>
              <div className="mt-3">
                <ProgressBar value={ids.length ? done / ids.length : 0} color={level.color} />
              </div>

              <div className="mt-4 space-y-4">
                {level.modules.map((module) => (
                  <div key={module.id} className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-black/5">
                    <div className="flex items-baseline justify-between gap-3">
                      <h3 className="font-black">
                        {module.icon} {module.title_fr}
                      </h3>
                      <span className="font-arabic shrink-0 text-lg text-ink/40">{module.title_ar}</span>
                    </div>
                    <ol className="mt-4 grid gap-2 sm:grid-cols-2">
                      {module.lessons.map((lesson, i) => {
                        const result = state.lessons[lesson.id];
                        const prevDone = i === 0 || Boolean(state.lessons[module.lessons[i - 1].id]);
                        const locked = !result && !prevDone;
                        return (
                          <li key={lesson.id}>
                            {locked ? (
                              <div className="flex items-center gap-3 rounded-2xl border border-dashed border-black/10 px-4 py-3 opacity-50">
                                <span className="text-lg">🔒</span>
                                <span className="truncate text-sm font-bold text-ink/60">{lesson.title_fr}</span>
                              </div>
                            ) : (
                              <Link
                                to={`/app/lecon/${lesson.id}`}
                                className="flex items-center gap-3 rounded-2xl border border-black/10 bg-white px-4 py-3 transition hover:-translate-y-0.5 hover:border-black/25 hover:shadow"
                              >
                                <span
                                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-black text-white"
                                  style={{ backgroundColor: result ? '#22c55e' : level.color }}
                                >
                                  {result ? '✓' : i + 1}
                                </span>
                                <span className="min-w-0 flex-1">
                                  <span className="block truncate text-sm font-bold">{lesson.title_fr}</span>
                                  <span className="text-xs font-semibold text-ink/45">+{lesson.xp} XP</span>
                                </span>
                                {result && <Stars count={result.stars} size="text-sm" />}
                              </Link>
                            )}
                          </li>
                        );
                      })}
                    </ol>
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </main>
  );
}
