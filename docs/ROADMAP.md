# Alif — Feuille de route

> Application **web responsive** pour apprendre l'arabe littéraire (fusha),
> du grand débutant au niveau avancé, avec un espace enfants ludique.
> Stack : React + Vite + TypeScript + Tailwind CSS. Contenu piloté par JSON.

---

## 1. Vision & positionnement

**Le créneau :** Duolingo ne propose pas l'arabe comme langue cible pour les
francophones, et les apps généralistes (Memrise, Mondly, Busuu) le traitent en
surface. Il y a une vraie place pour un outil **dédié, sérieux et bien pensé**.

**Notre angle :**

- Un seul produit excellent, centré sur les spécificités de l'arabe :
  écriture RTL, lettres à 4 formes, harakat, sons difficiles (ع ح خ ق ض ظ ط)
  avec schémas d'articulation (مخارج الحروف).
- Pédagogie par paliers CECRL : lire → mots → phrases → grammaire → style.
- **Deux publics dans une même app** : parcours structuré type Babbel pour
  adultes/ados + univers ludique séparé pour les 4–10 ans.

**Public cible :** francophones débutants, diaspora arabe de 2e/3e génération,
personnes voulant accéder aux textes classiques, parents cherchant une
initiation pour leurs enfants.

## 2. État actuel (V2 — refonte web) ✅

- [x] Application web responsive (mobile-first, navigation adaptative).
- [x] Landing page de présentation avec choix du mode.
- [x] 5 niveaux CECRL (A0 → B2+), ~40 leçons, déblocage séquentiel.
- [x] Moteur d'exercices générique : découverte (lettre/mot/règle), QCM,
      traduction, écoute, association, construction de phrase, articulation.
- [x] Audio natif : MP3 pré-générés par voix neuronale arabe (edge-tts) pour
      les 337 textes du contenu, avec repli Web Speech API.
- [x] Alphabet interactif (28 lettres + hamza, 4 formes, audio).
- [x] Progression locale : XP, streak, étoiles, badges, reset.
- [x] Espace enfants : 5 mondes, 20 jeux, 5 mascottes SVG, étoiles,
      mascotte-coach qui réagit pendant le jeu, confettis de fin.
- [x] Vrais jeux : memory (paires émoji ↔ mot), bulles magiques (écoute et
      éclate), tracé des lettres au doigt (canvas avec validation du geste)
      — le tracé est aussi intégré au parcours adulte (module alphabet).
- [x] Album d'autocollants : 26 autocollants dérivés de la progression
      (1 par jeu, 1 doré par monde, la couronne finale), révélation surprise
      sur l'écran de victoire, album façon Panini avec emplacements vides.

## 3. Prochaines étapes

**V2.1 — Qualité du contenu**

- [ ] Relecture de tout le contenu par un(e) arabophone (voir 🟡 dans
      CURRICULUM.md).
- [ ] Enregistrements par un(e) locuteur/trice natif(ve) en studio (remplacer
      la voix de synthèse neuronale sur les leçons clés, ex. makharij).
- [ ] Révision espacée (SRS) : re-proposer les mots déjà vus.
- [ ] Tracé : sens et ordre du geste (animation du tracé modèle, détection
      de la direction), toutes les formes contextuelles.

**V3 — Comptes & synchronisation**

- [ ] Authentification (e-mail / OAuth) et sauvegarde cloud de la progression.
- [ ] Mode hors-ligne complet (PWA + service worker).
- [ ] Notifications de rappel (série quotidienne).

**V4 — Monétisation**

- [ ] Freemium : niveaux A0/A1 gratuits, abonnement pour B1+ et l'espace
      enfants complet.
- [ ] Tableau de bord parents (suivi des enfants).

## 4. Architecture

- **Contenu = données** : chaque module est un JSON dans `src/data/content/`
  (même schéma d'exercices pour adultes et enfants). `src/data/course.ts`
  assemble les niveaux.
- **Moteur générique** : `src/features/LessonPlayer.tsx` rend n'importe quelle
  suite d'exercices, avec un habillage `adult` ou `kids`.
- **Progression** : contexte React + localStorage (`src/lib/progress.tsx`),
  prête à être remplacée par une API distante en V3.
