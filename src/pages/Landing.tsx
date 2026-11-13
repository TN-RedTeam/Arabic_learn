import { Link } from 'react-router-dom';
import { levels } from '../data/course';
import { lessonCount } from '../lib/content';
import { CatMascot, OwlMascot } from '../components/Mascots';

export function Landing() {
  const totalLessons = levels.reduce((n, l) => n + lessonCount(l), 0);

  return (
    <div className="min-h-dvh">
      {/* Hero */}
      <header className="relative overflow-hidden bg-gradient-to-br from-brand-800 via-brand-700 to-brand-600 text-white">
        <div aria-hidden className="font-arabic pointer-events-none absolute -top-10 -right-6 text-[16rem] leading-none text-white/10 select-none">
          ا
        </div>
        <div aria-hidden className="font-arabic pointer-events-none absolute bottom-0 left-4 text-[9rem] leading-none text-white/10 select-none">
          ب
        </div>
        <nav className="relative mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <div className="flex items-center gap-2 text-xl font-black">
            <span className="font-arabic flex h-10 w-10 items-center justify-center rounded-xl bg-white text-2xl text-brand-700">ا</span>
            Alif
          </div>
          <Link to="/app" className="rounded-full bg-white/15 px-5 py-2 text-sm font-bold backdrop-blur transition hover:bg-white/25">
            Commencer →
          </Link>
        </nav>
        <div className="relative mx-auto max-w-6xl px-6 pt-10 pb-20 text-center sm:pt-16">
          <h1 className="mx-auto max-w-3xl text-4xl leading-tight font-black sm:text-5xl">
            Apprenez l'arabe littéraire, <span className="text-sand-300">pas à pas</span>.
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-white/85">
            De la toute première lettre jusqu'aux textes avancés : un parcours structuré par niveaux
            (A0 → B2+), des exercices interactifs, la prononciation audio… et un univers dédié aux enfants.
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              to="/app"
              className="w-full rounded-2xl bg-white px-8 py-4 text-lg font-extrabold text-brand-800 shadow-xl transition hover:scale-105 active:scale-95 sm:w-auto"
            >
              🎯 Je commence mon parcours
            </Link>
            <Link
              to="/kids"
              className="w-full rounded-2xl bg-gradient-to-r from-amber-400 to-orange-400 px-8 py-4 text-lg font-extrabold text-white shadow-xl transition hover:scale-105 active:scale-95 sm:w-auto"
            >
              🧒 Espace enfants
            </Link>
          </div>
          <p className="mt-6 text-sm font-semibold text-white/60">
            {totalLessons} leçons interactives · 100 % gratuit · aucune inscription
          </p>
        </div>
      </header>

      {/* Les deux modes */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="text-center text-3xl font-black">Deux univers, une même langue</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <Link
            to="/app"
            className="group rounded-3xl bg-white p-8 shadow-sm ring-1 ring-black/5 transition hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-extrabold tracking-widest text-brand-600 uppercase">Adultes & ados</p>
                <h3 className="mt-2 text-2xl font-black">Le parcours structuré</h3>
              </div>
              <span className="font-arabic text-6xl text-brand-600/20 transition group-hover:text-brand-600/40">ع</span>
            </div>
            <ul className="mt-5 space-y-2 font-semibold text-ink/70">
              <li>📈 5 niveaux, du grand débutant (A0) à l'avancé (B2+)</li>
              <li>🔤 Alphabet complet + points d'articulation (مخارج)</li>
              <li>📚 Grammaire progressive : du nom à la voix passive</li>
              <li>✍️ Écriture : tracé des lettres guidé au doigt</li>
              <li>🔊 Voix arabe native sur chaque mot</li>
              <li>🔥 XP, séries quotidiennes et étoiles</li>
            </ul>
          </Link>
          <Link
            to="/kids"
            className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-300 via-orange-300 to-pink-300 p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="absolute -right-3 -bottom-3 flex">
              <CatMascot className="h-28 w-28 transition group-hover:animate-wiggle" />
              <OwlMascot className="-ml-6 h-28 w-28" />
            </div>
            <p className="text-sm font-extrabold tracking-widest text-orange-800 uppercase">Enfants 4–10 ans</p>
            <h3 className="mt-2 text-2xl font-black text-orange-950">L'aventure ludique</h3>
            <ul className="mt-5 max-w-[70%] space-y-2 font-semibold text-orange-950/80">
              <li>🦁 5 mondes, 5 mascottes qui encouragent</li>
              <li>🫧 Bulles à éclater, memory, tracé au doigt</li>
              <li>🎨 Mots illustrés : animaux, couleurs, famille…</li>
              <li>📔 Un album d'autocollants surprise à compléter</li>
            </ul>
          </Link>
        </div>
      </section>

      {/* Niveaux */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-center text-3xl font-black">Un chemin clair, niveau par niveau</h2>
          <p className="mx-auto mt-3 max-w-xl text-center font-semibold text-ink/60">
            Chaque niveau débloque le suivant. Vous savez toujours où vous en êtes et ce qui vous attend.
          </p>
          <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {levels.map((level, i) => (
              <li key={level.id} className="rounded-2xl border border-black/5 bg-sand-50 p-5">
                <span
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full text-sm font-black text-white"
                  style={{ backgroundColor: level.color }}
                >
                  {level.cefr}
                </span>
                <h3 className="mt-3 font-black">
                  {i + 1}. {level.title_fr}
                </h3>
                <p className="mt-1 text-sm font-semibold text-ink/60">{level.subtitle_fr}</p>
                <p className="mt-2 text-xs font-bold text-ink/40">{lessonCount(level)} leçons</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Méthode */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="text-center text-3xl font-black">Une méthode qui fait ses preuves</h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {[
            ['🧩', 'Des leçons courtes', 'De 5 à 15 minutes : découverte, puis exercices variés — QCM, écoute, association, construction de phrases.'],
            ['👄', 'La prononciation d’abord', 'Schémas d’articulation (مخارج الحروف) pour placer les sons difficiles : ع، ح، خ، ق…'],
            ['🔁', 'La régularité récompensée', 'XP, séries quotidiennes et étoiles : la motivation au service de la mémoire à long terme.'],
          ].map(([emoji, title, text]) => (
            <div key={title} className="rounded-3xl bg-white p-7 shadow-sm ring-1 ring-black/5">
              <div className="text-4xl">{emoji}</div>
              <h3 className="mt-3 text-lg font-black">{title}</h3>
              <p className="mt-2 font-semibold text-ink/60">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-black/5 bg-white py-8 text-center text-sm font-semibold text-ink/50">
        <p>
          Alif — apprendre l'arabe littéraire (العَرَبِيّة الفُصحى). Un outil d'entraînement qui complète,
          sans le remplacer, un cours avec un professeur.
        </p>
      </footer>
    </div>
  );
}
