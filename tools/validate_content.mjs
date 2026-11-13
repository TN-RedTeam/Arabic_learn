#!/usr/bin/env node
// Validation du contenu pédagogique : structure des exercices, cohérence des
// réponses, intégrité de la table des lettres et couverture audio.
// Lancé par `npm test` — doit passer avant tout déploiement.

import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const CONTENT = join(ROOT, 'src', 'data', 'content');
const errors = [];
const err = (file, lesson, msg) => errors.push(`${file}${lesson ? ` › ${lesson}` : ''} : ${msg}`);

const ARABIC = /[؀-ۿ]/g;
const LATIN = /[A-Za-zÀ-ÿ]/g;
const isMostlyArabic = (t) => {
  const a = (t.match(ARABIC) ?? []).length;
  const l = (t.match(LATIN) ?? []).length;
  return a > 0 && a >= l;
};

const ALLOWED_KEYS = {
  intro_letter: ['type', 'letter', 'prompt_fr'],
  intro_word: ['type', 'word', 'prompt_fr', 'emoji'],
  intro_rule: ['type', 'prompt_fr', 'ar'],
  articulation: ['type', 'letter', 'zone_fr', 'point_x', 'point_y', 'prompt_fr', 'audio'],
  mcq: ['type', 'prompt_fr', 'options', 'answer', 'ar', 'tts', 'audio', 'emoji', 'options_ar'],
  translate_choose: ['type', 'prompt_fr', 'options', 'answer', 'ar', 'tts', 'audio', 'emoji', 'options_ar'],
  listen_choose: ['type', 'prompt_fr', 'options', 'answer', 'ar', 'tts', 'audio', 'emoji', 'options_ar'],
  match: ['type', 'prompt_fr', 'pairs'],
  build: ['type', 'prompt_fr', 'tokens', 'answer'],
  trace: ['type', 'letter', 'prompt_fr'],
  memory: ['type', 'prompt_fr', 'pairs'],
  bubble: ['type', 'prompt_fr', 'tts', 'options', 'answer'],
};

const manifest = JSON.parse(readFileSync(join(ROOT, 'src', 'data', 'audio_manifest.json'), 'utf8'));
const audioDir = join(ROOT, 'public', 'audio');
const spokenTexts = new Set();

function checkExercise(file, lessonId, ex, i) {
  const where = `${lessonId} #${i + 1} (${ex.type})`;
  const allowed = ALLOWED_KEYS[ex.type];
  if (!allowed) return err(file, where, `type d'exercice inconnu « ${ex.type} »`);
  for (const key of Object.keys(ex)) {
    if (!allowed.includes(key)) err(file, where, `clé inattendue « ${key} »`);
  }
  if (!ex.prompt_fr) err(file, where, 'prompt_fr manquant');

  if (['mcq', 'translate_choose', 'listen_choose'].includes(ex.type)) {
    if (!Array.isArray(ex.options) || ex.options.length < 2) err(file, where, 'moins de 2 options');
    else {
      if (new Set(ex.options).size !== ex.options.length) err(file, where, 'options en double');
      if (!ex.options.includes(ex.answer)) err(file, where, `réponse « ${ex.answer} » absente des options`);
      for (const o of ex.options) if (isMostlyArabic(o)) spokenTexts.add(o.trim());
    }
    const spoken = ex.tts ?? ex.answer;
    if (ex.type === 'listen_choose' && !isMostlyArabic(spoken ?? ''))
      err(file, where, `listen_choose sans texte arabe à prononcer (tts/answer : « ${spoken} »)`);
    if (spoken && isMostlyArabic(spoken)) spokenTexts.add(spoken.trim());
    if (ex.ar) spokenTexts.add(ex.ar.trim());
  }
  if (ex.type === 'trace') {
    if (!ex.letter) err(file, where, 'lettre à tracer manquante');
    else spokenTexts.add(ex.letter.trim());
  }
  if (ex.type === 'bubble') {
    if (!Array.isArray(ex.options) || ex.options.length < 2) err(file, where, 'moins de 2 bulles');
    else if (!ex.options.includes(ex.answer)) err(file, where, `réponse « ${ex.answer} » absente des bulles`);
    if (!isMostlyArabic(ex.tts ?? '')) err(file, where, 'bubble sans texte arabe à prononcer (tts)');
    else spokenTexts.add(ex.tts.trim());
    for (const o of ex.options ?? []) if (isMostlyArabic(o)) spokenTexts.add(o.trim());
  }
  if (ex.type === 'memory' || ex.type === 'match') {
    if (!Array.isArray(ex.pairs) || ex.pairs.length < 2) err(file, where, 'moins de 2 paires');
    else if (ex.type === 'memory') {
      const faces = ex.pairs.flatMap((p) => [p.left, p.right]);
      if (new Set(faces).size !== faces.length) err(file, where, 'cartes en double');
      for (const f of faces) if (isMostlyArabic(f)) spokenTexts.add(f.trim());
    }
  }
  if (ex.type === 'match') {
    if (!Array.isArray(ex.pairs) || ex.pairs.length < 2) err(file, where, 'moins de 2 paires');
    else {
      const lefts = ex.pairs.map((p) => p.left);
      const rights = ex.pairs.map((p) => p.right);
      if (new Set(lefts).size !== lefts.length) err(file, where, 'côté gauche en double');
      if (new Set(rights).size !== rights.length) err(file, where, 'côté droit en double');
      for (const l of lefts) if (isMostlyArabic(l)) spokenTexts.add(l.trim());
    }
  }
  if (ex.type === 'build') {
    if (!Array.isArray(ex.tokens) || !Array.isArray(ex.answer) || ex.answer.length === 0)
      err(file, where, 'tokens/answer invalides');
    else {
      const pool = [...ex.tokens];
      for (const t of ex.answer) {
        const k = pool.indexOf(t);
        if (k === -1) err(file, where, `token de réponse « ${t} » absent de la banque`);
        else pool.splice(k, 1);
      }
      for (const t of ex.tokens) spokenTexts.add(t.trim());
      spokenTexts.add(ex.answer.join(' ').trim());
    }
  }
  if (ex.type === 'intro_letter' || ex.type === 'articulation') {
    if (!ex.letter) err(file, where, 'lettre manquante');
    else spokenTexts.add(ex.letter.trim());
  }
  if (ex.type === 'articulation') {
    for (const k of ['point_x', 'point_y'])
      if (typeof ex[k] !== 'number' || ex[k] < 0 || ex[k] > 1) err(file, where, `${k} hors de [0,1]`);
  }
  if (ex.type === 'intro_word') {
    if (!ex.word) err(file, where, 'mot manquant');
    else spokenTexts.add(ex.word.trim());
  }
  if (ex.type === 'intro_rule' && ex.ar) spokenTexts.add(ex.ar.trim());
}

const lessonIds = new Set();
function checkLessons(file, lessons) {
  for (const lesson of lessons) {
    if (!lesson.id) err(file, null, 'leçon sans id');
    if (lessonIds.has(lesson.id)) err(file, lesson.id, 'id de leçon en double');
    lessonIds.add(lesson.id);
    if (!lesson.title_fr) err(file, lesson.id, 'title_fr manquant');
    if (!Array.isArray(lesson.exercises) || lesson.exercises.length === 0)
      err(file, lesson.id, 'aucun exercice');
    else lesson.exercises.forEach((ex, i) => checkExercise(file, lesson.id, ex, i));
  }
}

for (const name of readdirSync(CONTENT).filter((f) => f.endsWith('.json'))) {
  const data = JSON.parse(readFileSync(join(CONTENT, name), 'utf8'));
  if (data.worlds) {
    for (const world of data.worlds) checkLessons(name, world.games ?? []);
  } else {
    checkLessons(name, data.lessons ?? []);
  }
  if (data.letters) {
    if (data.letters.length !== 29) err(name, null, `${data.letters.length} lettres au lieu de 29 (28 + hamza)`);
    const chars = new Set();
    for (const letter of data.letters) {
      if (chars.has(letter.char)) err(name, letter.char, 'lettre en double');
      chars.add(letter.char);
      for (const form of ['isolated', 'initial', 'medial', 'final'])
        if (!letter.forms?.[form]) err(name, letter.char, `forme « ${form} » manquante`);
      if (!letter.name_ar || !letter.translit || !letter.sound_fr)
        err(name, letter.char, 'nom/translittération/son manquant');
      spokenTexts.add(letter.char);
      spokenTexts.add(letter.name_ar);
    }
  }
}

// Couverture audio : tout texte prononçable doit avoir un MP3 natif.
let missingAudio = 0;
for (const text of spokenTexts) {
  const file = manifest[text];
  if (!file) {
    err('audio', null, `pas d'entrée manifeste pour « ${text} » — lancer tools/generate_audio.py`);
    missingAudio++;
  } else if (!existsSync(join(audioDir, file))) {
    err('audio', null, `fichier manquant ${file} pour « ${text} »`);
    missingAudio++;
  }
  if (missingAudio > 10) break; // inutile de lister des dizaines d'absences
}

if (errors.length) {
  console.error(`✗ ${errors.length} problème(s) de contenu :\n`);
  for (const e of errors) console.error('  - ' + e);
  process.exit(1);
}
console.log(`✓ Contenu valide : ${lessonIds.size} leçons, ${spokenTexts.size} textes arabes, audio complet.`);
