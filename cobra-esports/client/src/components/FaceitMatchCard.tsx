import { motion } from 'framer-motion';
import { useTheme } from '../context/useTheme';
import { FaceitMatch } from '../api/faceit';

function formatDate(iso: string | null) {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleDateString('ru-RU', { day: '2-digit', month: 'short' });
  } catch {
    return '—';
  }
}

export default function FaceitMatchCard({ match, delay = 0 }: { match: FaceitMatch; delay?: number }) {
  const { isDark } = useTheme();
  const isWin = match.result === 'W';
  const isLoss = match.result === 'L';

  const resultColor = isWin ? 'text-green-400' : isLoss ? 'text-red-400' : isDark ? 'text-white/40' : 'text-black/40';
  const resultBg = isWin ? 'bg-green-400/10' : isLoss ? 'bg-red-400/10' : isDark ? 'bg-white/5' : 'bg-black/5';
  const resultLabel = isWin ? 'WIN' : isLoss ? 'LOSS' : '—';

  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.35, delay }}
      className={`flex items-center justify-between rounded-xl p-4 border ${
        isDark ? 'bg-cobra-charcoal/50 border-cobra-yellow/10' : 'bg-white border-cobra-red/10'
      }`}
    >
      <div className="flex items-center gap-3">
        <span className={`px-2 py-1 rounded-md text-xs font-bold font-display ${resultColor} ${resultBg}`}>
          {resultLabel}
        </span>
        <div>
          <p className={`font-semibold ${isDark ? 'text-white' : 'text-black'}`}>{match.map ?? 'Unknown map'}</p>
          {(match.teams.faction1 || match.teams.faction2) && (
            <p className={`text-xs ${isDark ? 'text-white/40' : 'text-black/40'}`}>
              {match.teams.faction1 ?? '?'} vs {match.teams.faction2 ?? '?'}
            </p>
          )}
        </div>
      </div>
      <div className="text-right">
        {match.score && <p className={`font-display font-bold ${resultColor}`}>{match.score}</p>}
        <p className={`text-xs ${isDark ? 'text-white/40' : 'text-black/40'}`}>{formatDate(match.date)}</p>
        {match.eloChange !== null && (
          <p className={`text-xs font-semibold ${match.eloChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {match.eloChange >= 0 ? `+${match.eloChange}` : match.eloChange} Elo
          </p>
        )}
      </div>
    </motion.div>
  );
}
