import { motion } from 'framer-motion';
import { ShoppingCart } from 'lucide-react';
import { useTheme } from '../context/useTheme';
import { ShopItem } from '../data/mockShop';

export default function ShopCard({ item, delay = 0 }: { item: ShopItem; delay?: number }) {
  const { isDark } = useTheme();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ y: -6 }}
      className={`rounded-2xl overflow-hidden border ${
        isDark ? 'bg-cobra-charcoal/60 border-cobra-yellow/10' : 'bg-white border-cobra-red/10'
      }`}
    >
      <div
        className={`h-40 flex items-center justify-center font-display text-sm uppercase tracking-widest ${
          isDark ? 'bg-gradient-to-br from-cobra-black to-cobra-charcoal text-cobra-yellow/40' : 'bg-gradient-to-br from-cobra-bone to-white text-cobra-red/40'
        }`}
      >
        {item.category}
      </div>
      <div className="p-5">
        <h3 className={`font-display font-bold mb-1 ${isDark ? 'text-cobra-white' : 'text-black'}`}>{item.name}</h3>
        <p className={`text-sm mb-4 ${isDark ? 'text-cobra-white/50' : 'text-black/50'}`}>{item.description}</p>
        <div className="flex items-center justify-between">
          <span className={`font-display font-bold text-lg ${isDark ? 'text-cobra-yellow' : 'text-cobra-red'}`}>
            ${item.price.toFixed(2)}
          </span>
          <button
            className={`flex items-center gap-1 text-sm font-semibold px-3 py-2 rounded-full ${
              isDark ? 'bg-cobra-yellow text-black hover:shadow-neon-sm' : 'bg-cobra-red text-white hover:brightness-110'
            }`}
          >
            <ShoppingCart size={14} /> В корзину
          </button>
        </div>
      </div>
    </motion.div>
  );
}
