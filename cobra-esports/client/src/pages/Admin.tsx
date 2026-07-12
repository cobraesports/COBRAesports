import { useState } from 'react';
import { motion } from 'framer-motion';
import { Newspaper, Swords, Users, ShoppingBag, AlertTriangle } from 'lucide-react';
import { useTheme } from '../context/useTheme';

const tabs = [
  { id: 'news', label: 'Новости', icon: Newspaper },
  { id: 'matches', label: 'Матчи', icon: Swords },
  { id: 'players', label: 'Игроки', icon: Users },
  { id: 'shop', label: 'Товары', icon: ShoppingBag },
];

export default function Admin() {
  const { isDark } = useTheme();
  const [active, setActive] = useState('news');

  return (
    <div className={`min-h-[70vh] py-16 px-6 ${isDark ? 'bg-cobra-black' : 'bg-cobra-bone'}`}>
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className={`font-display text-4xl font-bold mb-3 ${isDark ? 'text-white' : 'text-black'}`}>Admin Panel</h1>
          <div
            className={`flex items-center gap-2 text-sm rounded-lg px-4 py-3 border ${
              isDark ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-300' : 'bg-red-500/10 border-red-500/30 text-red-700'
            }`}
          >
            <AlertTriangle size={16} />
            Панель пока без авторизации — доступна всем. Добавить проверку прав перед продакшн-релизом.
            {/* TODO: Connect real admin auth (roles/JWT) before production */}
          </div>
        </div>

        <div className="flex gap-2 mb-8 flex-wrap">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActive(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                active === tab.id
                  ? isDark
                    ? 'bg-cobra-yellow text-black'
                    : 'bg-cobra-red text-white'
                  : isDark
                  ? 'bg-cobra-charcoal text-white/60'
                  : 'bg-white text-black/60'
              }`}
            >
              <tab.icon size={16} /> {tab.label}
            </button>
          ))}
        </div>

        <motion.div
          key={active}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-2xl p-8 border ${isDark ? 'bg-cobra-charcoal/60 border-cobra-yellow/10' : 'bg-white border-cobra-red/10'}`}
        >
          <p className={`mb-4 ${isDark ? 'text-white/70' : 'text-black/70'}`}>
            Здесь появится форма добавления/редактирования: <strong>{tabs.find((t) => t.id === active)?.label}</strong>.
          </p>
          <p className={`text-sm ${isDark ? 'text-white/40' : 'text-black/40'}`}>
            // TODO: подключить формы + запись в БД / CMS + защиту маршрута middleware'ом ensureAuth.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
