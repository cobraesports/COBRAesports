import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/useTheme';

export default function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      aria-label="Переключить тему"
      className={`relative flex items-center h-8 w-14 rounded-full transition-colors ${
        isDark ? 'bg-cobra-charcoal' : 'bg-cobra-red/10'
      }`}
    >
      <span
        className={`absolute h-6 w-6 rounded-full flex items-center justify-center transition-all ${
          isDark ? 'left-1 bg-cobra-yellow text-black shadow-neon-sm' : 'left-7 bg-cobra-red text-white'
        }`}
      >
        {isDark ? <Moon size={14} /> : <Sun size={14} />}
      </span>
    </button>
  );
}
