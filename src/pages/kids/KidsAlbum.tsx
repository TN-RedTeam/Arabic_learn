import { Link } from 'react-router-dom';
import { kidsWorlds } from '../../data/course';
import { useProgress } from '../../lib/progress';
import {
  albumComplete,
  CROWN_STICKER,
  GAME_STICKERS,
  TOTAL_STICKERS,
  unlockedCount,
  WORLD_STICKERS,
  worldComplete,
} from '../../data/stickers';
import type { Sticker } from '../../data/stickers';
import { Mascot } from '../../components/Mascots';
import { worldColors } from './KidsHome';

const TILTS = ['-rotate-6', 'rotate-3', '-rotate-2', 'rotate-6', 'rotate-1', '-rotate-3'];

function StickerSlot({ sticker, unlocked, index }: { sticker: Sticker; unlocked: boolean; index: number }) {
  if (!unlocked) {
    return (
      <div className="flex aspect-square flex-col items-center justify-center rounded-3xl border-4 border-dashed border-black/15 bg-white/50 p-2">
        <span className="text-4xl text-black/20">?</span>
        <span className="mt-1 text-center text-[11px] font-extrabold text-black/25">À gagner !</span>
      </div>
    );
  }
  return (
    <div
      className={`flex aspect-square flex-col items-center justify-center rounded-3xl border-4 bg-white p-2 shadow-lg transition hover:scale-110 hover:rotate-0 ${
        TILTS[index % TILTS.length]
      } ${sticker.gold ? 'sticker-gold border-amber-400' : 'border-white'}`}
    >
      <span className="text-5xl drop-shadow">{sticker.emoji}</span>
      <span className="mt-1 text-center text-[11px] leading-tight font-black text-ink/70">{sticker.name_fr}</span>
    </div>
  );
}

export function KidsAlbum() {
  const { state } = useProgress();
  const unlocked = unlockedCount(state);
  const full = albumComplete(state);

  return (
    <div className="min-h-dvh bg-gradient-to-b from-amber-200 via-orange-100 to-amber-50">
      <header className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
        <Link
          to="/kids"
          className="flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 font-extrabold text-ink/70 shadow transition hover:bg-white"
        >
          ← Les mondes
        </Link>
        <span className="rounded-full bg-white/80 px-5 py-2 text-lg font-black text-amber-600 shadow">
          📔 {unlocked}/{TOTAL_STICKERS}
        </span>
      </header>

      <main className="mx-auto max-w-4xl px-4 pb-16">
        <div className="text-center">
          <h1 className="text-4xl font-black sm:text-5xl">Mon album d'autocollants</h1>
          <p className="mt-2 text-lg font-bold text-ink/60">
            {full
              ? 'Album complet, tu es un vrai champion ! 🎉'
              : 'Termine les jeux pour gagner des autocollants surprise !'}
          </p>
        </div>

        <div className="mt-8 space-y-6">
          {kidsWorlds.map((world) => {
            const colors = worldColors[world.color] ?? worldColors.orange;
            const gold = WORLD_STICKERS[world.id];
            const goldUnlocked = worldComplete(state, world.id);
            return (
              <section
                key={world.id}
                className="rounded-[2rem] bg-white/85 p-5 shadow-lg ring-4 sm:p-6"
                style={{ ['--tw-ring-color' as string]: colors.soft }}
              >
                <div className="mb-4 flex items-center gap-3">
                  <Mascot name={world.mascot} className="h-12 w-12 shrink-0" />
                  <h2 className="text-xl font-black" style={{ color: colors.main }}>
                    {world.emoji} {world.title_fr}
                  </h2>
                </div>
                <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
                  {world.games.map((game, i) => {
                    const sticker = GAME_STICKERS[game.id];
                    if (!sticker) return null;
                    return (
                      <StickerSlot
                        key={game.id}
                        sticker={sticker}
                        unlocked={Boolean(state.kidsGames[game.id])}
                        index={i}
                      />
                    );
                  })}
                  {gold && <StickerSlot sticker={gold} unlocked={goldUnlocked} index={4} />}
                </div>
              </section>
            );
          })}

          {/* La couronne finale */}
          <section className="rounded-[2rem] bg-gradient-to-r from-amber-100 to-yellow-100 p-6 text-center shadow-lg ring-4 ring-amber-200">
            <h2 className="text-xl font-black text-amber-700">🏅 Le trésor final</h2>
            <p className="mt-1 text-sm font-bold text-amber-800/60">Complète les 5 mondes pour le gagner !</p>
            <div className="mx-auto mt-4 w-32">
              <StickerSlot sticker={CROWN_STICKER} unlocked={full} index={1} />
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
