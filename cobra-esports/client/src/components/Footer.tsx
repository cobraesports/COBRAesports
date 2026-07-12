import { NavLink } from 'react-router-dom';
import { useTheme } from '../context/useTheme';
import logoRed from '../assets/cobra-logo-red.jpg';
import logoYellow from '../assets/cobra-logo-yellow.jpg';

export default function Footer() {
  const { isDark } = useTheme();
  const logo = isDark ? logoYellow : logoRed;

  return (
    <footer className={`border-t ${isDark ? 'border-cobra-yellow/10 bg-cobra-black' : 'border-cobra-red/10 bg-cobra-bone'}`}>
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <img src={logo} alt="COBRA ESPORTS" className="h-8 w-8 object-contain" />
            <span className="font-display font-bold">COBRA ESPORTS</span>
          </div>
          <p className={`text-sm ${isDark ? 'text-cobra-white/50' : 'text-black/50'}`}>
            Профессиональная организация по Counter-Strike 2.
          </p>
        </div>

        <div className="text-sm flex flex-col gap-2">
          <span className="font-semibold mb-1">Навигация</span>
          {['/player', '/statistics', '/matches', '/shop'].map((to) => (
            <NavLink key={to} to={to} className={isDark ? 'text-cobra-white/60 hover:text-cobra-yellow' : 'text-black/60 hover:text-cobra-red'}>
              {to.replace('/', '')}
            </NavLink>
          ))}
        </div>

        <div className="text-sm">
          <span className="font-semibold mb-1 block">Главный игрок</span>
          <p className={isDark ? 'text-cobra-white/60' : 'text-black/60'}>AXO — AWPer / Rifler</p>
        </div>
      </div>
      <div className={`text-center text-xs py-4 border-t ${isDark ? 'border-cobra-yellow/10 text-cobra-white/40' : 'border-cobra-red/10 text-black/40'}`}>
        © {new Date().getFullYear()} COBRA ESPORTS. Все права защищены.
      </div>
    </footer>
  );
}
