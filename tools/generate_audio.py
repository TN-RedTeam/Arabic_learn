#!/usr/bin/env python3
"""Génère l'audio natif de tous les textes arabes du contenu pédagogique.

Parcourt src/data/content/*.json, extrait chaque chaîne arabe susceptible
d'être prononcée par l'app, puis génère un MP3 par chaîne avec une voix
neuronale arabe (Microsoft Edge TTS, gratuit) dans public/audio/.
Un manifeste src/data/audio_manifest.json associe chaque texte à son fichier.

Cas particulier : pour une lettre isolée (ex. « ب »), on prononce son NOM
(« باء ») — prononcer le caractère seul donne un résultat aléatoire.

Usage :
    pip install edge-tts
    python tools/generate_audio.py            # génère les fichiers manquants
    python tools/generate_audio.py --force    # regénère tout
    python tools/generate_audio.py --list-voices
"""

import argparse
import asyncio
import hashlib
import json
import re
import sys
from pathlib import Path

try:
    import edge_tts
except ImportError:
    sys.exit("edge-tts manquant : pip install edge-tts")

ROOT = Path(__file__).resolve().parent.parent
CONTENT_DIR = ROOT / "src" / "data" / "content"
AUDIO_DIR = ROOT / "public" / "audio"
MANIFEST = ROOT / "src" / "data" / "audio_manifest.json"

VOICE = "ar-SA-ZariyahNeural"  # voix féminine claire ; voir --list-voices
RATE = "-15%"  # légèrement ralenti pour l'apprentissage
CONCURRENCY = 4

ARABIC_RE = re.compile(r"[؀-ۿ]")
LATIN_RE = re.compile(r"[A-Za-zÀ-ÿ]")


def is_mostly_arabic(text: str) -> bool:
    """Vrai pour un texte essentiellement arabe. Une phrase française qui cite
    une lettre (« ت a 2 points… ») ne doit pas être prononcée par la voix arabe."""
    arabic = len(ARABIC_RE.findall(text))
    latin = len(LATIN_RE.findall(text))
    return arabic > 0 and arabic >= latin


def letter_names() -> dict[str, str]:
    """char → nom de la lettre (أَلِف، باء…), depuis alphabet.json."""
    data = json.loads((CONTENT_DIR / "alphabet.json").read_text(encoding="utf-8"))
    return {entry["char"]: entry["name_ar"] for entry in data.get("letters", [])}


def collect_texts() -> dict[str, str]:
    """Retourne {texte affiché → texte à prononcer} pour tout le contenu."""
    names = letter_names()
    spoken: dict[str, str] = {}

    def add(text: str | None):
        if not text or not is_mostly_arabic(text):
            return
        text = text.strip()
        # Lettre isolée → on prononce son nom.
        pronounce = names.get(text, text)
        # Les points de suspension perturbent la synthèse.
        pronounce = re.sub(r"[.…]{2,}", " ", pronounce).strip()
        spoken[text] = pronounce

    def walk_exercise(ex: dict):
        add(ex.get("letter"))
        add(ex.get("word"))
        add(ex.get("ar"))
        add(ex.get("tts"))
        for opt in ex.get("options", []) or []:
            add(opt)
        for pair in ex.get("pairs", []) or []:
            add(pair.get("left"))
            add(pair.get("right"))
        for token in ex.get("tokens", []) or []:
            add(token)
        answer = ex.get("answer")
        if isinstance(answer, list):
            add(" ".join(answer))
            for token in answer:
                add(token)
        elif isinstance(answer, str):
            add(answer)

    for path in sorted(CONTENT_DIR.glob("*.json")):
        data = json.loads(path.read_text(encoding="utf-8"))
        lessons = data.get("lessons", [])
        for world in data.get("worlds", []):
            lessons.extend(world.get("games", []))
        for lesson in lessons:
            for ex in lesson.get("exercises", []):
                walk_exercise(ex)
        # Alphabet interactif : caractère + nom de chaque lettre.
        for entry in data.get("letters", []):
            add(entry["char"])
            add(entry["name_ar"])

    return spoken


def filename_for(pronounce: str) -> str:
    return hashlib.sha1(pronounce.encode("utf-8")).hexdigest()[:12] + ".mp3"


async def synthesize(pronounce: str, dest: Path, semaphore: asyncio.Semaphore):
    async with semaphore:
        for attempt in range(3):
            try:
                tts = edge_tts.Communicate(pronounce, VOICE, rate=RATE)
                await tts.save(str(dest))
                if dest.stat().st_size > 0:
                    return
            except Exception as exc:  # noqa: BLE001 — on retente puis on signale
                if attempt == 2:
                    print(f"  ÉCHEC {pronounce!r}: {exc}", file=sys.stderr)
                await asyncio.sleep(1.5 * (attempt + 1))


async def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--force", action="store_true", help="regénérer les fichiers existants")
    parser.add_argument("--list-voices", action="store_true", help="lister les voix arabes")
    args = parser.parse_args()

    if args.list_voices:
        voices = await edge_tts.list_voices()
        for voice in voices:
            if voice["Locale"].startswith("ar"):
                print(f'{voice["ShortName"]:32} {voice["Gender"]}')
        return

    AUDIO_DIR.mkdir(parents=True, exist_ok=True)
    texts = collect_texts()
    manifest = {text: filename_for(pron) for text, pron in texts.items()}

    todo = [
        (pron, AUDIO_DIR / manifest[text])
        for text, pron in texts.items()
        if args.force or not (AUDIO_DIR / manifest[text]).exists()
    ]
    # Plusieurs textes peuvent partager la même prononciation → dédoublonner.
    todo = list({dest: (pron, dest) for pron, dest in todo}.values())

    print(f"{len(texts)} textes arabes, {len(todo)} fichiers à générer (voix {VOICE}).")
    semaphore = asyncio.Semaphore(CONCURRENCY)
    await asyncio.gather(*(synthesize(pron, dest, semaphore) for pron, dest in todo))

    # Ne référencer que les fichiers réellement présents.
    manifest = {t: f for t, f in manifest.items() if (AUDIO_DIR / f).exists()}
    # Supprimer les fichiers orphelins (contenu retiré ou filtré).
    for orphan in set(f.name for f in AUDIO_DIR.glob("*.mp3")) - set(manifest.values()):
        (AUDIO_DIR / orphan).unlink()
        print(f"  orphelin supprimé : {orphan}")
    MANIFEST.write_text(
        json.dumps(manifest, ensure_ascii=False, indent=1, sort_keys=True) + "\n",
        encoding="utf-8",
    )
    total = sum(f.stat().st_size for f in AUDIO_DIR.glob("*.mp3"))
    print(f"Manifeste : {MANIFEST.relative_to(ROOT)} ({len(manifest)} entrées).")
    print(f"Audio : {AUDIO_DIR.relative_to(ROOT)} ({total / 1e6:.1f} Mo).")


if __name__ == "__main__":
    asyncio.run(main())
