import { motion } from 'framer-motion';
import { useTheme } from '../context/useTheme';

interface MatchCardProps {
  opponent: string;
  subtitle: string;
  date: string;
  result?: 'W' | 'L';
  score?: string;
  delay?: number;
}

export default function MatchCard({ opponent, subtitle, date, result, score, delay = 0 }: MatchCardProps) {
  const { isDark } = useTheme();

  const resultColor =
    result === 'W' ? 'text-green-400' : result === 'L' ? 'text-red-400' : isDark ? 'text-cobra-yellow' : 'text-cobra-red';

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
      <div>
        <p className={`font-semibold ${isDark ? 'text-cobra-white' : 'text-black'}`}>vs {opponent}</p>
        <p className={`text-xs ${isDark ? 'text-cobra-white/50' : 'text-black/50'}`}>{subtitle}</p>
      </div>
      <div className="text-right">
        {score && <p className={`font-display font-bold ${resultColor}`}>{score}</p>}
        <p className={`text-xs ${isDark ? 'text-cobra-white/40' : 'text-black/40'}`}>{date}</p>
      </div>
    </motion.div>
  );
}
