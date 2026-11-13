# Alif — Apprendre l'arabe (application web)

Application web **responsive** pour apprendre **l'arabe littéraire (fusha)**,
du grand débutant (A0) au niveau avancé (B2+), dans l'esprit de Babbel —
avec en plus un **espace enfants** ludique (mascottes cartoon, mondes colorés,
étoiles à collectionner).

> Cet outil aide à débuter et à pratiquer régulièrement.
> Il ne remplace pas un vrai cours avec un professeur.

## ✨ Fonctionnalités

**Parcours adultes (style Babbel)**

- 5 niveaux CECRL : **A0** (alphabet + prononciation) → **A1** (premiers mots)
  → **A2** (grammaire de base) → **B1** (conjugaison, s'exprimer) → **B2+**
  (formes dérivées, passif, subjonctif, expressions).
- ~40 leçons interactives : QCM, écoute, association de paires,
  construction de phrases, découverte de mots/règles.
- **Alphabet interactif** : les 28 lettres + hamza, avec les 4 formes
  (isolée / initiale / médiane / finale) et l'audio.
- **Points d'articulation (مخارج الحروف)** : schéma anatomique animé pour
  placer les sons difficiles (ع، ح، خ، ق…).
- **Audio natif inclus** : chaque texte arabe est enregistré avec une voix
  neuronale arabe (fichiers MP3 livrés avec l'app) — fonctionne sur tous les
  appareils, même sans voix arabe installée. La synthèse vocale du navigateur
  sert uniquement de repli.
- Progression persistée en local : XP, série quotidienne 🔥, étoiles ⭐,
  badges, déblocage séquentiel des leçons.

**Espace enfants (4–10 ans)**

- 5 mondes à explorer (école des lettres, animaux, couleurs & nombres,
  famille, nourriture) avec des mascottes SVG façon dessin animé qui
  encouragent l'enfant pendant le jeu.
- De vrais jeux : **bulles magiques** (écoute et éclate la bonne bulle),
  **memory** (retrouver les paires émoji ↔ mot), **tracé des lettres au
  doigt** (canvas avec validation du geste), mots illustrés par émojis.
- Récompenses : étoiles, confettis, interface géante et colorée, et un
  **album d'autocollants** façon Panini — un autocollant surprise par jeu
  terminé, un doré par monde complété, la couronne quand l'album est plein.

**Écriture (les deux modes)**

- Exercices de tracé au doigt sur gabarit pour les 29 lettres, intégrés aux
  leçons d'alphabet du parcours adulte comme aux jeux enfants.

## 🚀 Démarrer

Prérequis : [Node.js](https://nodejs.org) ≥ 20.

```bash
npm install
npm run dev       # serveur de développement (http://localhost:5173)
npm run build     # vérification TypeScript + build de production dans dist/
npm run preview   # sert le build de production en local
```

## 🔊 Régénérer l'audio

Les MP3 (`public/audio/`) sont générés par une voix neuronale arabe via
[edge-tts](https://github.com/rany2/edge-tts) (gratuit). Après avoir ajouté ou
modifié du contenu dans `src/data/content/`, il suffit de relancer :

```bash
pip install edge-tts
python tools/generate_audio.py            # génère les fichiers manquants
python tools/generate_audio.py --force    # regénère tout
python tools/generate_audio.py --list-voices  # autres voix arabes
```

Le script extrait automatiquement tous les textes arabes du contenu, produit
un MP3 par texte et met à jour `src/data/audio_manifest.json`. Les lettres
isolées sont prononcées par leur nom (« ب » → « باء »).

## 📦 Déploiement

Le build produit un site **100 % statique** (`dist/`) : il se déploie tel quel
sur GitHub Pages, Netlify, Vercel, ou n'importe quel serveur web. Le routage
utilise le hash (`/#/app`), donc **aucune configuration serveur** n'est requise.

## 🗂️ Structure

```
src/
  data/content/    # tout le contenu pédagogique en JSON (leçons, exercices)
  data/course.ts   # assemblage des niveaux CECRL et des mondes enfants
  lib/             # modèles, synthèse vocale, progression (localStorage)
  features/        # moteur d'exercices générique (adulte + enfants)
  components/      # mascottes SVG, composants UI
  pages/           # landing, parcours adulte, alphabet, profil, espace enfants
docs/              # curriculum pédagogique et feuille de route
```

Le contenu est **piloté par les données** : pour ajouter une leçon, il suffit
d'éditer un JSON dans `src/data/content/` (aucun code à toucher).

## 📚 Documentation

- [`docs/CURRICULUM.md`](docs/CURRICULUM.md) — programme pédagogique complet.
- [`docs/ROADMAP.md`](docs/ROADMAP.md) — feuille de route du produit.

## 🕰️ Historique

Ce dépôt hébergeait auparavant un prototype **Flutter** (mobile). Il a été
refondu en application web (React + Vite + TypeScript + Tailwind CSS) ; le
contenu pédagogique JSON d'origine a été intégralement conservé et étendu.
L'ancien code reste disponible dans l'historique git (branche `main`,
jusqu'au commit `b6d799f`).
