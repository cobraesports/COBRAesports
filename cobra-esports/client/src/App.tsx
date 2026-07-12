import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LoadingSkeleton from './components/LoadingSkeleton';

const Home = lazy(() => import('./pages/Home'));
const Player = lazy(() => import('./pages/Player'));
const Statistics = lazy(() => import('./pages/Statistics'));
const Team = lazy(() => import('./pages/Team'));
const News = lazy(() => import('./pages/News'));
const Matches = lazy(() => import('./pages/Matches'));
const Media = lazy(() => import('./pages/Media'));
const Shop = lazy(() => import('./pages/Shop'));
const Admin = lazy(() => import('./pages/Admin'));

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-1">
            <Suspense fallback={<div className="max-w-7xl mx-auto px-6 py-10"><LoadingSkeleton className="h-72 w-full" /></div>}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/player" element={<Player />} />
                <Route path="/statistics" element={<Statistics />} />
                <Route path="/team" element={<Team />} />
                <Route path="/news" element={<News />} />
                <Route path="/matches" element={<Matches />} />
                <Route path="/media" element={<Media />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/admin" element={<Admin />} />
              </Routes>
            </Suspense>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </ThemeProvider>
  );
}
