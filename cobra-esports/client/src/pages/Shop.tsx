import { useTheme } from '../context/useTheme';
import { mockShop } from '../data/mockShop';
import ShopCard from '../components/ShopCard';

export default function Shop() {
  const { isDark } = useTheme();

  return (
    <div className={`min-h-[70vh] py-16 px-6 ${isDark ? 'bg-cobra-black' : 'bg-cobra-bone'}`}>
      <div className="max-w-6xl mx-auto">
        <div className="mb-12 text-center">
          <h1 className={`font-display text-4xl font-bold mb-3 ${isDark ? 'text-white' : 'text-black'}`}>Магазин</h1>
          <p className={isDark ? 'text-white/50' : 'text-black/50'}>Официальный мерч COBRA ESPORTS (тестовые товары)</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {mockShop.map((item, i) => (
            <ShopCard key={item.id} item={item} delay={i * 0.06} />
          ))}
        </div>
      </div>
    </div>
  );
}
