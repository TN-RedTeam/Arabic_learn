import type { KidsWorld, Lesson, Letter, Level, Module } from '../lib/content';
import alphabetJson from './content/alphabet.json';
import makharijJson from './content/makharij.json';
import vocabularyJson from './content/vocabulary.json';
import vocab2Json from './content/vocab2.json';
import grammarJson from './content/grammar.json';
import grammarB1Json from './content/grammar_b1.json';
import advancedJson from './content/advanced.json';
import kidsJson from './content/kids.json';

// Assemblage du parcours : les fichiers JSON sont la source de vérité,
// on les organise ici en niveaux CECRL.

interface RawContentFile {
  module: { id: string; title_fr: string; title_ar: string; icon?: string };
  lessons: unknown[];
  letters?: unknown[];
}

function toModule(raw: unknown, icon: string): Module {
  const file = raw as RawContentFile;
  return {
    id: file.module.id,
    title_fr: file.module.title_fr,
    title_ar: file.module.title_ar,
    icon: file.module.icon ?? icon,
    lessons: file.lessons as Lesson[],
  };
}

export const letters: Letter[] = (alphabetJson as unknown as RawContentFile)
  .letters as unknown as Letter[];

export const levels: Level[] = [
  {
    id: 'level_a0',
    cefr: 'A0',
    title_fr: 'Grand débutant',
    subtitle_fr: "Lire et prononcer l'alphabet",
    color: '#0d9488',
    modules: [toModule(alphabetJson, '🔤'), toModule(makharijJson, '👄')],
  },
  {
    id: 'level_a1',
    cefr: 'A1',
    title_fr: 'Débutant',
    subtitle_fr: 'Premiers mots et phrases de survie',
    color: '#2563eb',
    modules: [toModule(vocabularyJson, '💬'), toModule(vocab2Json, '🗓️')],
  },
  {
    id: 'level_a2',
    cefr: 'A2',
    title_fr: 'Élémentaire',
    subtitle_fr: 'Les bases de la grammaire',
    color: '#7c3aed',
    modules: [toModule(grammarJson, '📚')],
  },
  {
    id: 'level_b1',
    cefr: 'B1',
    title_fr: 'Intermédiaire',
    subtitle_fr: 'Conjuguer et s’exprimer',
    color: '#db2777',
    modules: [toModule(grammarB1Json, '💬')],
  },
  {
    id: 'level_b2',
    cefr: 'B2+',
    title_fr: 'Avancé',
    subtitle_fr: 'Nuances, style et expressions',
    color: '#ea580c',
    modules: [toModule(advancedJson, '🎓')],
  },
];

export const kidsWorlds: KidsWorld[] = (kidsJson as { worlds: unknown[] })
  .worlds as unknown as KidsWorld[];

export function findLesson(id: string): { lesson: Lesson; module: Module; level: Level } | null {
  for (const level of levels) {
    for (const module of level.modules) {
      const lesson = module.lessons.find((l) => l.id === id);
      if (lesson) return { lesson, module, level };
    }
  }
  return null;
}

export function findKidsGame(id: string) {
  for (const world of kidsWorlds) {
    const game = world.games.find((g) => g.id === id);
    if (game) return { game, world };
  }
  return null;
}
