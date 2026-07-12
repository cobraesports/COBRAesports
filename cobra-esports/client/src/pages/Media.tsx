import { motion } from 'framer-motion';
import { PlayCircle, Image as ImageIcon, Film } from 'lucide-react';
import { useTheme } from '../context/useTheme';

const highlights = ['Ace на Mirage vs NAVI', 'Clutch 1v4 vs Vitality', 'Победный раунд финала'];
const gallery = ['Буткемп 2026', 'Финал ESL Pro League', 'Студийная фотосессия состава'];
const videos = ['AXO — путь в про-сцену', 'Разбор игры на Inferno', 'День из жизни COBRA ESPORTS'];

export default function Media() {
  const { isDark } = useTheme();
  const cardClass = isDark ? 'bg-cobra-charcoal/60 border-cobra-yellow/10' : 'bg-white border-cobra-red/10';
  const accent = isDark ? 'text-cobra-yellow' : 'text-cobra-red';

  const Section = ({ title, icon: Icon, items }: { title: string; icon: any; items: string[] }) => (
    <section>
      <h2 className={`font-display text-2xl font-bold mb-5 flex items-center gap-2 ${isDark ? 'text-white' : 'text-black'}`}>
        <Icon className={accent} /> {title}
      </h2>
      <div className="grid md:grid-cols-3 gap-5">
        {items.map((item, i) => (
          <motion.div
            key={item}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.07 }}
            whileHover={{ y: -4 }}
            className={`rounded-2xl overflow-hidden border ${cardClass}`}
          >
            <div className={`h-36 flex items-center justify-center ${isDark ? 'bg-black/30' : 'bg-black/5'}`}>
              <Icon className={accent} size={32} />
            </div>
            <div className="p-4">
              <p className={isDark ? 'text-white' : 'text-black'}>{item}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );

  return (
    <div className={`min-h-[70vh] py-16 px-6 ${isDark ? 'bg-cobra-black' : 'bg-cobra-bone'}`}>
      <div className="max-w-6xl mx-auto space-y-14">
        <div className="text-center">
          <h1 className={`font-display text-4xl font-bold mb-3 ${isDark ? 'text-white' : 'text-black'}`}>Медиа</h1>
          <p className={isDark ? 'text-white/50' : 'text-black/50'}>Хайлайты, галерея и видео COBRA ESPORTS</p>
        </div>

        <Section title="Highlights" icon={PlayCircle} items={highlights} />
        <Section title="Gallery" icon={ImageIcon} items={gallery} />
        <Section title="Videos" icon={Film} items={videos} />
      </div>
    </div>
  );
}
