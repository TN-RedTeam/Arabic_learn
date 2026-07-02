import { Link, useParams } from 'react-router-dom';
import { findLesson } from '../../data/course';
import { useProgress } from '../../lib/progress';
import { LessonPlayer } from '../../features/LessonPlayer';

export function LessonPage() {
  const { lessonId } = useParams();
  const { completeLesson } = useProgress();
  const found = lessonId ? findLesson(lessonId) : null;

  if (!found) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center gap-4 p-6 text-center">
        <p className="text-5xl">🤔</p>
        <p className="font-bold">Leçon introuvable.</p>
        <Link to="/app" className="rounded-2xl bg-brand-600 px-6 py-3 font-extrabold text-white">
          Retour au parcours
        </Link>
      </div>
    );
  }

  const { lesson, level } = found;

  return (
    <LessonPlayer
      key={lesson.id}
      title={lesson.title_fr}
      exercises={lesson.exercises}
      xp={lesson.xp}
      variant="adult"
      accent={level.color}
      exitTo="/app"
      onFinish={(stars) => completeLesson(lesson.id, lesson.xp, stars)}
    />
  );
}
