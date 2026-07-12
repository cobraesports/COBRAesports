import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { useTheme } from '../context/useTheme';

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: LucideIcon;
  suffix?: string;
  delay?: number;
}

export default function StatCard({ label, value, icon: Icon, suffix = '', delay = 0 }: StatCardProps) {
  const { isDark } = useTheme();

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ y: -4 }}
      className={`rounded-2xl p-5 glass border transition-shadow ${
        isDark
          ? 'bg-cobra-charcoal/60 border-cobra-yellow/10 hover:shadow-neon-sm'
          : 'bg-white/70 border-cobra-red/10 hover:shadow-crimson'
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <span className={`text-xs uppercase tracking-wider ${isDark ? 'text-cobra-white/50' : 'text-black/50'}`}>
          {label}
        </span>
        {Icon && <Icon size={16} className={isDark ? 'text-cobra-yellow' : 'text-cobra-red'} />}
      </div>
      <div className={`text-2xl font-display font-bold ${isDark ? 'text-cobra-white' : 'text-black'}`}>
        {value}
        <span className="text-base font-medium opacity-60">{suffix}</span>
      </div>
    </motion.div>
  );
}
