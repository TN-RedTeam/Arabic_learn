import { useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import { findKidsGame } from '../../data/course';
import { useProgress } from '../../lib/progress';
import { rewardsForFinishing } from '../../data/stickers';
import { LessonPlayer } from '../../features/LessonPlayer';
import { worldColors } from './KidsHome';

export function KidsGame() {
  const { gameId } = useParams();
  const { state, completeLesson } = useProgress();
  const found = gameId ? findKidsGame(gameId) : null;
  // Ce que la victoire va débloquer, figé par jeu : recalculé quand on change
  // de jeu (la route /kids/jeu/:id ne re-monte pas le composant), mais pas
  // quand le score s'enregistre — la révélation doit rester affichée.
  const rewardsRef = useRef<{ gameId: string; rewards: ReturnType<typeof rewardsForFinishing> } | null>(null);
  if (gameId && rewardsRef.current?.gameId !== gameId) {
    rewardsRef.current = { gameId, rewards: rewardsForFinishing(state, gameId) };
  }

  if (!found) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center gap-4 p-6 text-center">
        <p className="text-6xl">🙈</p>
        <p className="text-xl font-black">Oups, ce jeu n'existe pas !</p>
        <Link to="/kids" className="rounded-2xl bg-amber-500 px-8 py-4 text-lg font-extrabold text-white shadow-lg">
          Retour aux mondes
        </Link>
      </div>
    );
  }

  const { game, world } = found;
  const colors = worldColors[world.color] ?? worldColors.orange;

  return (
    <div className="min-h-dvh" style={{ background: `linear-gradient(180deg, ${colors.soft}, #fdfaf3)` }}>
      <LessonPlayer
        key={game.id}
        title={`${game.emoji} ${game.title_fr}`}
        exercises={game.exercises}
        xp={10}
        variant="kids"
        accent={colors.main}
        mascot={world.mascot}
        rewards={rewardsRef.current?.rewards ?? []}
        exitTo="/kids"
        onFinish={(stars) => completeLesson(game.id, 10, stars, true)}
      />
    </div>
  );
}
