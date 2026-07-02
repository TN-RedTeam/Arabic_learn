// Prononciation de l'arabe.
//
// 1. Priorité aux enregistrements natifs pré-générés (public/audio/*.mp3,
//    voix neuronale arabe — voir tools/generate_audio.py). Fonctionne sur
//    tous les appareils, même sans voix arabe installée.
// 2. Repli : synthèse vocale du navigateur (Web Speech API) si un texte
//    n'a pas de fichier audio.

import manifest from '../data/audio_manifest.json';

const audioFiles = manifest as Record<string, string>;
const audioBase = `${import.meta.env.BASE_URL}audio/`;
const cache = new Map<string, HTMLAudioElement>();
let current: HTMLAudioElement | null = null;

function playNative(text: string): boolean {
  const file = audioFiles[text.trim()];
  if (!file) return false;
  let audio = cache.get(file);
  if (!audio) {
    audio = new Audio(audioBase + file);
    cache.set(file, audio);
  }
  current?.pause();
  window.speechSynthesis?.cancel();
  current = audio;
  audio.currentTime = 0;
  // Si le fichier ne peut pas être lu (hors-ligne…), on bascule sur la synthèse.
  audio.play().catch(() => speakSynthetic(text));
  return true;
}

/* ---------- Repli : Web Speech API ---------- */

let cachedVoice: SpeechSynthesisVoice | null = null;

function findArabicVoice(): SpeechSynthesisVoice | null {
  const voices = window.speechSynthesis?.getVoices() ?? [];
  return (
    voices.find((v) => v.lang.toLowerCase().startsWith('ar-sa')) ??
    voices.find((v) => v.lang.toLowerCase().startsWith('ar')) ??
    null
  );
}

export function ttsAvailable(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

function speakSynthetic(text: string, rate = 0.85): boolean {
  if (!ttsAvailable()) return false;
  if (!cachedVoice) cachedVoice = findArabicVoice();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'ar-SA';
  utterance.rate = rate;
  if (cachedVoice) utterance.voice = cachedVoice;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
  return true;
}

/** Prononce un texte arabe. Retourne false si aucun moyen n'est disponible. */
export function speakArabic(text: string, rate = 0.85): boolean {
  if (playNative(text)) return true;
  return speakSynthetic(text, rate);
}

// Précharge la liste des voix de repli (Chrome la charge en asynchrone).
if (ttsAvailable()) {
  window.speechSynthesis.onvoiceschanged = () => {
    cachedVoice = findArabicVoice();
  };
}
