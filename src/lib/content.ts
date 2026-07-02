// Modèle de contenu pédagogique. Tout le contenu est piloté par les données
// (src/data/content/*.json), le moteur d'exercices est générique.

export type Exercise =
  | IntroLetterEx
  | IntroWordEx
  | IntroRuleEx
  | ArticulationEx
  | ChoiceEx
  | MatchEx
  | BuildEx;

export interface IntroLetterEx {
  type: 'intro_letter';
  letter: string;
  prompt_fr: string;
}

export interface IntroWordEx {
  type: 'intro_word';
  word: string;
  prompt_fr: string;
  emoji?: string;
}

export interface IntroRuleEx {
  type: 'intro_rule';
  prompt_fr: string;
  /** Exemple en arabe affiché en grand, optionnel. */
  ar?: string;
}

export interface ArticulationEx {
  type: 'articulation';
  letter: string;
  zone_fr: string;
  point_x: number;
  point_y: number;
  prompt_fr: string;
  audio?: string;
}

/** mcq, translate_choose et listen_choose partagent la même mécanique. */
export interface ChoiceEx {
  type: 'mcq' | 'translate_choose' | 'listen_choose';
  prompt_fr: string;
  options: string[];
  answer: string;
  /** Texte arabe à afficher en grand au-dessus de la question. */
  ar?: string;
  /** Texte à prononcer (listen_choose) ; sinon on prononce `answer`. */
  tts?: string;
  audio?: string;
  emoji?: string;
  /** Les options sont-elles en arabe ? (police + RTL) */
  options_ar?: boolean;
}

export interface MatchEx {
  type: 'match';
  prompt_fr: string;
  pairs: { left: string; right: string }[];
}

export interface BuildEx {
  type: 'build';
  prompt_fr: string;
  tokens: string[];
  answer: string[];
}

export interface Lesson {
  id: string;
  title_fr: string;
  xp: number;
  concept_fr?: string;
  icon?: string;
  exercises: Exercise[];
}

export interface Letter {
  char: string;
  name_ar: string;
  translit: string;
  sound_fr: string;
  connects_after: boolean;
  forms: { isolated: string; initial: string; medial: string; final: string };
}

export interface Module {
  id: string;
  title_fr: string;
  title_ar: string;
  icon: string;
  lessons: Lesson[];
}

export interface Level {
  id: string;
  cefr: string;
  title_fr: string;
  subtitle_fr: string;
  color: string;
  modules: Module[];
}

export interface KidsGame {
  id: string;
  title_fr: string;
  emoji: string;
  exercises: Exercise[];
}

export interface KidsWorld {
  id: string;
  title_fr: string;
  emoji: string;
  color: string;
  mascot: 'cat' | 'camel' | 'owl' | 'fennec';
  games: KidsGame[];
}

export function lessonCount(level: Level): number {
  return level.modules.reduce((n, m) => n + m.lessons.length, 0);
}

export function allLessons(levels: Level[]): { lesson: Lesson; module: Module; level: Level }[] {
  return levels.flatMap((level) =>
    level.modules.flatMap((module) => module.lessons.map((lesson) => ({ lesson, module, level }))),
  );
}
