import { Link } from 'react-router-dom';
import { kidsWorlds } from '../../data/course';
import { useProgress } from '../../lib/progress';
import { TOTAL_STICKERS, unlockedCount } from '../../data/stickers';
import { Mascot } from '../../components/Mascots';
import { Stars } from '../../components/ui';

export const worldColors: Record<string, { main: string; soft: string }> = {
  orange: { main: '#f97316', soft: '#ffedd5' },
  purple: { main: '#8b5cf6', soft: '#ede9fe' },
  sky: { main: '#0ea5e9', soft: '#e0f2fe' },
  green: { main: '#22c55e', soft: '#dcfce7' },
  pink: { main: '#ec4899', soft: '#fce7f3' },
};

export function KidsHome() {
  const { state } = useProgress();

  return (
    <div className="min-h-dvh bg-gradient-to-b from-sky-200 via-amber-50 to-amber-100">
      <header className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
        <Link
          to="/"
          className="flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 font-extrabold text-ink/70 shadow transition hover:bg-white"
        >
          ← Accueil
        </Link>
        <div className="flex items-center gap-2">
          <Link
            to="/kids/album"
            className="flex items-center gap-1 rounded-full bg-white/80 px-4 py-2 text-lg font-black text-amber-600 shadow transition hover:scale-105 hover:bg-white"
          >
            📔 <span className="text-sm">{unlockedCount(state)}/{TOTAL_STICKERS}</span>
          </Link>
          <span className="flex items-center gap-2 rounded-full bg-white/80 px-5 py-2 text-lg font-black text-amber-600 shadow">
            ⭐ {state.kidsStars}
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 pb-16">
        <div className="text-center">
          <h1 className="text-4xl font-black text-ink sm:text-5xl">
            L'aventure de l'arabe&nbsp;! <span className="font-arabic text-brand-700">هيّا</span>
          </h1>
          <p className="mt-2 text-lg font-bold text-ink/60">Choisis ton monde et pars à l'aventure 🚀</p>
        </div>

        <Link
          to="/kids/album"
          className="mx-auto mt-6 flex max-w-md items-center justify-between gap-3 rounded-3xl bg-gradient-to-r from-amber-300 to-yellow-200 px-6 py-4 shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl"
        >
          <span className="text-4xl">📔</span>
          <span className="flex-1 text-left">
            <span className="block text-lg font-black text-amber-900">Mon album d'autocollants</span>
            <span className="text-sm font-bold text-amber-800/70">
              {unlockedCount(state)}/{TOTAL_STICKERS} autocollants gagnés
            </span>
          </span>
          <span className="text-2xl font-black text-amber-700">→</span>
        </Link>

        <div className="mt-10 space-y-8">
          {kidsWorlds.map((world) => {
            const colors = worldColors[world.color] ?? worldColors.orange;
            return (
              <section
                key={world.id}
                className="relative overflow-hidden rounded-[2rem] bg-white/90 p-6 shadow-lg ring-4 sm:p-8"
                style={{ boxShadow: `0 10px 30px ${colors.main}33`, borderColor: colors.main, ['--tw-ring-color' as string]: colors.soft }}
              >
                <div className="flex items-center gap-4">
                  <Mascot name={world.mascot} className="h-20 w-20 shrink-0 animate-float sm:h-24 sm:w-24" />
                  <div>
                    <h2 className="text-2xl font-black sm:text-3xl" style={{ color: colors.main }}>
                      {world.emoji} {world.title_fr}
                    </h2>
                    <p className="font-bold text-ink/50">{world.games.length} jeux à découvrir</p>
                  </div>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-3">
                  {world.games.map((game) => {
                    const result = state.kidsGames[game.id];
                    return (
                      <Link
                        key={game.id}
                        to={`/kids/jeu/${game.id}`}
                        className="group rounded-3xl border-b-8 bg-white p-5 text-center shadow transition hover:-translate-y-1 hover:shadow-xl active:translate-y-0 active:border-b-4"
                        style={{ borderColor: colors.main, backgroundColor: result ? colors.soft : 'white' }}
                      >
                        <div className="text-5xl transition group-hover:animate-wiggle">{game.emoji}</div>
                        <div className="mt-2 text-lg font-black">{game.title_fr}</div>
                        <div className="mt-1">
                          {result ? (
                            <Stars count={result.stars} size="text-base" />
                          ) : (
                            <span className="text-sm font-extrabold" style={{ color: colors.main }}>
                              Jouer !
                            </span>
                          )}
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>

        <p className="mt-12 text-center font-bold text-ink/40">
          Tu veux le grand parcours ?{' '}
          <Link to="/app" className="text-brand-700 underline">
            Va dans l'espace des grands →
          </Link>
        </p>
      </main>
    </div>
  );
}
