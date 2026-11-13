import type { ProgressState } from '../lib/progress';
import { kidsWorlds } from './course';

// Album d'autocollants du mode enfants.
//
// Tout est DÉRIVÉ de la progression (state.kidsGames) : un autocollant par
// jeu terminé, un autocollant doré par monde complété, la couronne quand
// l'album est plein. Rien à persister de plus, donc rien à désynchroniser.

export interface Sticker {
  id: string;
  emoji: string;
  name_fr: string;
  gold?: boolean;
}

/** Autocollant attaché à chaque jeu (id de jeu → autocollant). */
export const GAME_STICKERS: Record<string, Sticker> = {
  kids_let_01: { id: 'st_let_01', emoji: '🫧', name_fr: 'Bulle star' },
  kids_let_02: { id: 'st_let_02', emoji: '🎈', name_fr: 'Ballon fou' },
  kids_let_03: { id: 'st_let_03', emoji: '✏️', name_fr: 'Petit scribe' },
  kids_let_04: { id: 'st_let_04', emoji: '🖌️', name_fr: 'Artiste calligraphe' },
  kids_anim_01: { id: 'st_anim_01', emoji: '🐱', name_fr: 'Chat malin' },
  kids_anim_02: { id: 'st_anim_02', emoji: '🐘', name_fr: 'Éléphant géant' },
  kids_anim_03: { id: 'st_anim_03', emoji: '🐴', name_fr: 'Cheval rapide' },
  kids_anim_04: { id: 'st_anim_04', emoji: '🦊', name_fr: 'Roi du mémo' },
  kids_coul_01: { id: 'st_coul_01', emoji: '🎨', name_fr: 'Peintre en herbe' },
  kids_coul_02: { id: 'st_coul_02', emoji: '🔢', name_fr: 'Compteur magique' },
  kids_coul_03: { id: 'st_coul_03', emoji: '✋', name_fr: 'Haute-cinq' },
  kids_coul_04: { id: 'st_coul_04', emoji: '🧠', name_fr: 'Super mémoire' },
  kids_fam_01: { id: 'st_fam_01', emoji: '👨‍👩‍👧', name_fr: 'Famille unie' },
  kids_fam_02: { id: 'st_fam_02', emoji: '🤸', name_fr: 'Acrobate' },
  kids_fam_03: { id: 'st_fam_03', emoji: '🛏️', name_fr: 'Marchand de sable' },
  kids_fam_04: { id: 'st_fam_04', emoji: '🔑', name_fr: 'Gardien de la maison' },
  kids_miam_01: { id: 'st_miam_01', emoji: '🍓', name_fr: 'Croqueur de fruits' },
  kids_miam_02: { id: 'st_miam_02', emoji: '🥐', name_fr: 'Petit chef' },
  kids_miam_03: { id: 'st_miam_03', emoji: '😋', name_fr: 'Gourmand' },
  kids_miam_04: { id: 'st_miam_04', emoji: '🍽️', name_fr: 'Maître du goûter' },
};

/** Autocollant doré de chaque monde complété (id de monde → autocollant). */
export const WORLD_STICKERS: Record<string, Sticker> = {
  monde_lettres: { id: 'st_gold_lettres', emoji: '🦜', name_fr: "Perroquet d'or", gold: true },
  monde_animaux: { id: 'st_gold_animaux', emoji: '🦁', name_fr: "Lion d'or", gold: true },
  monde_couleurs: { id: 'st_gold_couleurs', emoji: '🌈', name_fr: "Arc-en-ciel d'or", gold: true },
  monde_famille: { id: 'st_gold_famille', emoji: '🏠', name_fr: "Maison d'or", gold: true },
  monde_miam: { id: 'st_gold_miam', emoji: '🍉', name_fr: "Pastèque d'or", gold: true },
};

export const CROWN_STICKER: Sticker = {
  id: 'st_crown',
  emoji: '👑',
  name_fr: 'Couronne du champion',
  gold: true,
};

export const TOTAL_STICKERS =
  Object.keys(GAME_STICKERS).length + Object.keys(WORLD_STICKERS).length + 1;

const gameDone = (state: ProgressState, gameId: string) => Boolean(state.kidsGames[gameId]);

export function worldComplete(state: ProgressState, worldId: string): boolean {
  const world = kidsWorlds.find((w) => w.id === worldId);
  return Boolean(world && world.games.every((g) => gameDone(state, g.id)));
}

export function albumComplete(state: ProgressState): boolean {
  return kidsWorlds.every((w) => worldComplete(state, w.id));
}

export function unlockedCount(state: ProgressState): number {
  let n = 0;
  for (const gameId of Object.keys(GAME_STICKERS)) if (gameDone(state, gameId)) n++;
  for (const worldId of Object.keys(WORLD_STICKERS)) if (worldComplete(state, worldId)) n++;
  if (albumComplete(state)) n++;
  return n;
}

/** Les autocollants que la PREMIÈRE réussite de ce jeu débloquerait. */
export function rewardsForFinishing(state: ProgressState, gameId: string): Sticker[] {
  if (gameDone(state, gameId)) return [];
  const after: ProgressState = {
    ...state,
    kidsGames: { ...state.kidsGames, [gameId]: { stars: 1, completedAt: '' } },
  };
  const rewards: Sticker[] = [];
  const sticker = GAME_STICKERS[gameId];
  if (sticker) rewards.push(sticker);
  const world = kidsWorlds.find((w) => w.games.some((g) => g.id === gameId));
  if (world && WORLD_STICKERS[world.id] && !worldComplete(state, world.id) && worldComplete(after, world.id))
    rewards.push(WORLD_STICKERS[world.id]);
  if (!albumComplete(state) && albumComplete(after)) rewards.push(CROWN_STICKER);
  return rewards;
}
