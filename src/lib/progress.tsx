import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';

// Progression de l'apprenant, persistée dans localStorage.

export interface LessonResult {
  stars: 1 | 2 | 3;
  completedAt: string;
}

export interface ProgressState {
  xp: number;
  streakCount: number;
  lastActiveDay: string | null;
  lessons: Record<string, LessonResult>;
  kidsStars: number;
  kidsGames: Record<string, LessonResult>;
}

const STORAGE_KEY = 'alif-progress-v1';

const emptyState: ProgressState = {
  xp: 0,
  streakCount: 0,
  lastActiveDay: null,
  lessons: {},
  kidsStars: 0,
  kidsGames: {},
};

function load(): ProgressState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyState;
    return { ...emptyState, ...(JSON.parse(raw) as ProgressState) };
  } catch {
    return emptyState;
  }
}

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

function yesterday(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
}

interface ProgressApi {
  state: ProgressState;
  completeLesson: (id: string, xp: number, stars: 1 | 2 | 3, kids?: boolean) => void;
  reset: () => void;
}

const ProgressContext = createContext<ProgressApi | null>(null);

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ProgressState>(load);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const completeLesson = useCallback((id: string, xp: number, stars: 1 | 2 | 3, kids = false) => {
    setState((prev) => {
      const day = today();
      const streakCount =
        prev.lastActiveDay === day
          ? prev.streakCount
          : prev.lastActiveDay === yesterday()
            ? prev.streakCount + 1
            : 1;
      const result: LessonResult = { stars, completedAt: new Date().toISOString() };
      const bucket = kids ? 'kidsGames' : 'lessons';
      const existing = prev[bucket][id];
      // On garde le meilleur score ; l'XP n'est gagnée qu'à la première réussite.
      const gainedXp = existing ? 0 : xp;
      return {
        ...prev,
        xp: prev.xp + gainedXp,
        streakCount,
        lastActiveDay: day,
        [bucket]: {
          ...prev[bucket],
          [id]: existing && existing.stars >= stars ? existing : result,
        },
        kidsStars: kids && !existing ? prev.kidsStars + stars : prev.kidsStars,
      };
    });
  }, []);

  const reset = useCallback(() => setState(emptyState), []);

  const api = useMemo(() => ({ state, completeLesson, reset }), [state, completeLesson, reset]);

  return <ProgressContext.Provider value={api}>{children}</ProgressContext.Provider>;
}

export function useProgress(): ProgressApi {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error('useProgress doit être utilisé sous <ProgressProvider>');
  return ctx;
}
