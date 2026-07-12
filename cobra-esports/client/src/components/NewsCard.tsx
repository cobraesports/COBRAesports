import { motion } from 'framer-motion';
import { useTheme } from '../context/useTheme';
import { NewsItem } from '../data/mockNews';

export default function NewsCard({ item, delay = 0 }: { item: NewsItem; delay?: number }) {
  const { isDark } = useTheme();

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ y: -4 }}
      className={`rounded-2xl p-6 border transition-shadow cursor-pointer ${
        isDark
          ? 'bg-cobra-charcoal/60 border-cobra-yellow/10 hover:shadow-neon-sm'
          : 'bg-white border-cobra-red/10 hover:shadow-crimson'
      }`}
    >
      <span
        className={`inline-block text-[11px] font-semibold uppercase tracking-wider px-2 py-1 rounded-full mb-3 ${
          isDark ? 'bg-cobra-yellow/10 text-cobra-yellow' : 'bg-cobra-red/10 text-cobra-red'
        }`}
      >
        {item.category}
      </span>
      <h3 className={`font-display text-lg font-bold mb-2 ${isDark ? 'text-cobra-white' : 'text-black'}`}>
        {item.title}
      </h3>
      <p className={`text-sm mb-3 ${isDark ? 'text-cobra-white/60' : 'text-black/60'}`}>{item.excerpt}</p>
      <span className={`text-xs ${isDark ? 'text-cobra-white/40' : 'text-black/40'}`}>{item.date}</span>
    </motion.article>
  );
}
