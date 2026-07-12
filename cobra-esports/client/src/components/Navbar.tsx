import { NavLink } from 'react-router-dom';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { useTheme } from '../context/useTheme';
import { useAuth } from '../context/useAuth';
import ThemeToggle from './ThemeToggle';
import logoRed from '../assets/cobra-logo-red.jpg';
import logoYellow from '../assets/cobra-logo-yellow.jpg';

const links = [
  { to: '/', label: 'Главная' },
  { to: '/player', label: 'Игрок' },
  { to: '/statistics', label: 'Статистика' },
  { to: '/team', label: 'Команда' },
  { to: '/admin', label: 'Admin' },
  { to: '/news', label: 'Новости' },
  { to: '/matches', label: 'Матчи' },
  { to: '/media', label: 'Медиа' },
  { to: '/shop', label: 'Магазин' },
];

export default function Navbar() {
  const { isDark } = useTheme();
  const { user, loginWithSteam, logout } = useAuth();
  const [open, setOpen] = useState(false);

  const accent = isDark ? 'text-cobra-yellow' : 'text-cobra-red';
  const logo = isDark ? logoYellow : logoRed;

  return (
    <header
      className={`sticky top-0 z-50 glass border-b ${
        isDark ? 'bg-cobra-black/80 border-cobra-yellow/10' : 'bg-cobra-bone/85 border-cobra-red/10'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        <NavLink to="/" className="flex items-center gap-2 font-display font-bold text-lg tracking-wide">
          <img src={logo} alt="COBRA ESPORTS" className="h-9 w-9 object-contain" />
          <span className={accent}>COBRA</span>
          <span className={isDark ? 'text-cobra-white' : 'text-black'}>ESPORTS</span>
        </NavLink>

        <nav className="hidden lg:flex items-center gap-6 font-medium text-sm">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `transition-colors hover:${isDark ? 'text-cobra-yellow' : 'text-cobra-red'} ${
                  isActive ? accent : isDark ? 'text-cobra-white/70' : 'text-black/70'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          <ThemeToggle />
          {user ? (
            <div className="flex items-center gap-2">
              <img src={user.avatar} alt={user.nickname} className="h-8 w-8 rounded-full" />
              <button
                onClick={logout}
                className={`text-sm font-semibold px-3 py-1.5 rounded-full border ${
                  isDark ? 'border-cobra-yellow text-cobra-yellow hover:bg-cobra-yellow/10' : 'border-cobra-red text-cobra-red hover:bg-cobra-red/10'
                }`}
              >
                Выйти
              </button>
            </div>
          ) : (
            <button
              onClick={loginWithSteam}
              className={`text-sm font-semibold px-4 py-2 rounded-full transition-all ${
                isDark
                  ? 'bg-cobra-yellow text-black shadow-neon-sm hover:shadow-neon'
                  : 'bg-cobra-red text-white shadow-crimson hover:brightness-110'
              }`}
            >
              Login with Steam
            </button>
          )}
        </div>

        <button className="lg:hidden" onClick={() => setOpen(!open)} aria-label="Меню">
          {open ? <X /> : <Menu />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className={`lg:hidden overflow-hidden border-t ${isDark ? 'border-cobra-yellow/10' : 'border-cobra-red/10'}`}
          >
            <div className="flex flex-col gap-1 p-4">
              {links.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `py-2 px-2 rounded-lg font-medium ${isActive ? accent : isDark ? 'text-cobra-white/80' : 'text-black/80'}`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
              <div className="flex items-center justify-between pt-3">
                <ThemeToggle />
                {user ? (
                  <button onClick={logout} className={accent}>Выйти</button>
                ) : (
                  <button onClick={loginWithSteam} className={`font-semibold ${accent}`}>
                    Login with Steam
                  </button>
                )}
              </div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
