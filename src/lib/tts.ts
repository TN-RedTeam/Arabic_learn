// Prononciation de l'arabe via la synthèse vocale du navigateur (Web Speech API).
// Aucun fichier audio n'est nécessaire : on cherche une voix arabe installée.

let cachedVoice: SpeechSynthesisVoice | null | undefined;

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

/** Prononce un texte arabe. Retourne false si aucune voix n'est disponible. */
export function speakArabic(text: string, rate = 0.85): boolean {
  if (!ttsAvailable()) return false;
  if (cachedVoice === undefined) cachedVoice = findArabicVoice();
  // Les voix se chargent parfois en différé : on retente à chaque appel tant
  // qu'aucune voix arabe n'a été trouvée.
  if (!cachedVoice) cachedVoice = findArabicVoice();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'ar-SA';
  utterance.rate = rate;
  if (cachedVoice) utterance.voice = cachedVoice;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
  return true;
}

// Précharge la liste des voix (Chrome la charge en asynchrone).
if (ttsAvailable()) {
  window.speechSynthesis.onvoiceschanged = () => {
    cachedVoice = findArabicVoice();
  };
}
