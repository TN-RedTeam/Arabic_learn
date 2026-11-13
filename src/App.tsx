import { HashRouter, Route, Routes } from 'react-router-dom';
import { ProgressProvider } from './lib/progress';
import { Landing } from './pages/Landing';
import { AdultLayout } from './pages/adult/AdultLayout';
import { Dashboard } from './pages/adult/Dashboard';
import { LessonPage } from './pages/adult/LessonPage';
import { AlphabetPage } from './pages/adult/AlphabetPage';
import { ProfilePage } from './pages/adult/ProfilePage';
import { KidsHome } from './pages/kids/KidsHome';
import { KidsGame } from './pages/kids/KidsGame';
import { KidsAlbum } from './pages/kids/KidsAlbum';

// HashRouter : l'app fonctionne servie depuis n'importe quel hébergement
// statique (GitHub Pages inclus) sans configuration de réécriture d'URL.

export function App() {
  return (
    <ProgressProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/app" element={<AdultLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="alphabet" element={<AlphabetPage />} />
            <Route path="profil" element={<ProfilePage />} />
          </Route>
          <Route path="/app/lecon/:lessonId" element={<LessonPage />} />
          <Route path="/kids" element={<KidsHome />} />
          <Route path="/kids/album" element={<KidsAlbum />} />
          <Route path="/kids/jeu/:gameId" element={<KidsGame />} />
          <Route path="*" element={<Landing />} />
        </Routes>
      </HashRouter>
    </ProgressProvider>
  );
}
