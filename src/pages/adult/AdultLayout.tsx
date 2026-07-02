import { Link, NavLink, Outlet } from 'react-router-dom';
import { useProgress } from '../../lib/progress';

const tabs = [
  { to: '/app', label: 'Parcours', icon: '🗺️', end: true },
  { to: '/app/alphabet', label: 'Alphabet', icon: '🔤', end: false },
  { to: '/app/profil', label: 'Profil', icon: '👤', end: false },
];

export function AdultLayout() {
  const { state } = useProgress();

  return (
    <div className="min-h-dvh pb-20 md:pb-0">
      <header className="sticky top-0 z-20 border-b border-black/5 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3">
          <Link to="/" className="flex items-center gap-2 text-lg font-black">
            <span className="font-arabic flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-xl text-white">ا</span>
            <span className="hidden sm:inline">Alif</span>
          </Link>
          <nav className="hidden gap-1 md:flex">
            {tabs.map((t) => (
              <NavLink
                key={t.to}
                to={t.to}
                end={t.end}
                className={({ isActive }) =>
                  `rounded-full px-4 py-2 text-sm font-bold transition ${
                    isActive ? 'bg-brand-100 text-brand-800' : 'text-ink/60 hover:bg-black/5'
                  }`
                }
              >
                {t.icon} {t.label}
              </NavLink>
            ))}
          </nav>
          <div className="flex items-center gap-3 text-sm font-extrabold">
            <span className="flex items-center gap-1 rounded-full bg-orange-100 px-3 py-1.5 text-orange-700" title="Série de jours consécutifs">
              🔥 {state.streakCount}
            </span>
            <span className="flex items-center gap-1 rounded-full bg-brand-100 px-3 py-1.5 text-brand-800" title="Points d'expérience">
              ⚡ {state.xp} XP
            </span>
          </div>
        </div>
      </header>

      <Outlet />

      {/* Navigation mobile en bas d'écran */}
      <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-black/5 bg-white/95 backdrop-blur md:hidden">
        <div className="mx-auto flex max-w-md justify-around py-2">
          {tabs.map((t) => (
            <NavLink
              key={t.to}
              to={t.to}
              end={t.end}
              className={({ isActive }) =>
                `flex flex-col items-center rounded-xl px-4 py-1 text-xs font-bold ${
                  isActive ? 'text-brand-700' : 'text-ink/50'
                }`
              }
            >
              <span className="text-xl">{t.icon}</span>
              {t.label}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
}
