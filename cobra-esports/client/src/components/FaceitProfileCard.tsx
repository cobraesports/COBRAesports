import { motion } from 'framer-motion';
import { Gauge, TrendingUp, Percent, Swords, AlertCircle } from 'lucide-react';
import { useTheme } from '../context/useTheme';
import { FaceitPlayerResponse } from '../api/faceit';

const fallbackAvatar =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><rect width="100%" height="100%" fill="#1a1a1a"/><text x="50%" y="50%" font-size="48" fill="#ff5500" text-anchor="middle" dy=".3em" font-family="sans-serif">F</text></svg>`
  );

interface FaceitProfileCardProps {
  data: FaceitPlayerResponse | null;
  loading: boolean;
  clubNickname?: string;
}

export default function FaceitProfileCard({ data, loading, clubNickname }: FaceitProfileCardProps) {
  const { isDark } = useTheme();

  const cardClass = `rounded-2xl p-6 border ${
    isDark ? 'bg-cobra-charcoal/50 border-cobra-yellow/10' : 'bg-white border-cobra-red/10'
  }`;

  if (loading) {
    return (
      <div className={`${cardClass} animate-pulse h-48`}>
        <div className={`h-4 w-32 rounded ${isDark ? 'bg-white/10' : 'bg-black/10'} mb-4`} />
        <div className={`h-3 w-full rounded ${isDark ? 'bg-white/5' : 'bg-black/5'}`} />
      </div>
    );
  }

  if (!data || !data.connected) {
    return (
      <div className={cardClass}>
        <div className="flex items-center gap-2 mb-2">
          <AlertCircle size={18} className={isDark ? 'text-cobra-yellow' : 'text-cobra-red'} />
          <h3 className={`font-display font-bold ${isDark ? 'text-white' : 'text-black'}`}>FACEIT профиль</h3>
        </div>
        <p className={`text-sm ${isDark ? 'text-white/50' : 'text-black/50'}`}>
          {data?.message === 'FACEIT profile not found'
            ? 'У этого игрока не найден привязанный FACEIT-аккаунт.'
            : 'FACEIT статистика временно недоступна. Попробуйте обновить страницу позже.'}
        </p>
      </div>
    );
  }

  const levelColor = isDark ? 'text-orange-400' : 'text-orange-600';

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={cardClass}
    >
      <div className="flex items-center gap-4 mb-5">
        <img
          src={data.avatar || fallbackAvatar}
          alt={data.nickname}
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = fallbackAvatar;
          }}
          className={`h-16 w-16 rounded-full object-cover border-2 ${
            isDark ? 'border-orange-400' : 'border-orange-500'
          }`}
        />
        <div>
          <p className={`text-xs uppercase tracking-wide ${isDark ? 'text-white/40' : 'text-black/40'}`}>FACEIT</p>
          <h3 className={`font-display text-xl font-bold ${isDark ? 'text-white' : 'text-black'}`}>
            {data.nickname}
          </h3>
          {clubNickname && (
            <p className={`text-xs font-semibold ${isDark ? 'text-cobra-yellow' : 'text-cobra-red'}`}>
              {clubNickname}
            </p>
          )}
          {data.country && (
            <p className={`text-xs ${isDark ? 'text-white/40' : 'text-black/40'}`}>{data.country.toUpperCase()}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="flex items-center gap-2">
          <Gauge size={16} className={levelColor} />
          <span className={isDark ? 'text-white/80' : 'text-black/80'}>
            Level <span className={`font-bold ${levelColor}`}>{data.faceit_level ?? '—'}</span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <TrendingUp size={16} className={levelColor} />
          <span className={isDark ? 'text-white/80' : 'text-black/80'}>
            ELO <span className="font-bold">{data.elo ?? '—'}</span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Percent size={16} className={levelColor} />
          <span className={isDark ? 'text-white/80' : 'text-black/80'}>
            Winrate <span className="font-bold">{data.winrate !== null && data.winrate !== undefined ? `${data.winrate}%` : '—'}</span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Swords size={16} className={levelColor} />
          <span className={isDark ? 'text-white/80' : 'text-black/80'}>
            Matches <span className="font-bold">{data.games ?? '—'}</span>
          </span>
        </div>
      </div>
    </motion.div>
  );
}
