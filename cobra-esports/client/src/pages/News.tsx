import { useTheme } from '../context/useTheme';
import { mockNews } from '../data/mockNews';
import NewsCard from '../components/NewsCard';

export default function News() {
  const { isDark } = useTheme();

  return (
    <div className={`min-h-[70vh] py-16 px-6 ${isDark ? 'bg-cobra-black' : 'bg-cobra-bone'}`}>
      <div className="max-w-6xl mx-auto">
        <div className="mb-12 text-center">
          <h1 className={`font-display text-4xl font-bold mb-3 ${isDark ? 'text-white' : 'text-black'}`}>Новости</h1>
          <p className={isDark ? 'text-white/50' : 'text-black/50'}>Последние события из жизни COBRA ESPORTS</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockNews.map((item, i) => (
            <NewsCard key={item.id} item={item} delay={i * 0.06} />
          ))}
        </div>
      </div>
    </div>
  );
}
