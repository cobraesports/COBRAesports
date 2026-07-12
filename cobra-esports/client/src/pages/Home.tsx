import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trophy, BarChart3, Swords } from 'lucide-react';
import { useTheme } from '../context/useTheme';
import ParticlesBackground from '../components/ParticlesBackground';
import logoRed from '../assets/cobra-logo-red.jpg';
import logoYellow from '../assets/cobra-logo-yellow.jpg';

export default function Home() {
  const { isDark } = useTheme();
  const logo = isDark ? logoYellow : logoRed;
  const accent = isDark ? 'text-cobra-yellow' : 'text-cobra-red';

  return (
    <div>
      {/* HERO */}
      <section
        className={`relative overflow-hidden min-h-[88vh] flex items-center ${
          isDark ? 'bg-gradient-to-b from-cobra-black via-cobra-charcoal to-cobra-black' : 'bg-gradient-to-b from-white via-cobra-bone to-white'
        }`}
      >
        <ParticlesBackground />

        <div className="relative z-10 max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-10 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <span className={`inline-block text-xs font-semibold tracking-[0.2em] uppercase mb-4 ${accent}`}>
              Counter-Strike 2 Organization
            </span>
            <h1 className={`font-display text-5xl md:text-6xl font-bold leading-tight mb-6 ${isDark ? 'text-white' : 'text-black'}`}>
              МЫ — <span className={accent}>COBRA</span> ESPORTS
            </h1>
            <p className={`text-lg mb-8 max-w-md ${isDark ? 'text-white/60' : 'text-black/60'}`}>
              Возглавляемые AWPer'ом AXO, мы строим состав, который будет доминировать на профессиональной сцене CS2.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/player"
                className={`px-6 py-3 rounded-full font-semibold transition-all ${
                  isDark ? 'bg-cobra-yellow text-black shadow-neon hover:brightness-110' : 'bg-cobra-red text-white shadow-crimson hover:brightness-110'
                }`}
              >
                Join Team
              </Link>
              <Link
                to="/statistics"
                className={`px-6 py-3 rounded-full font-semibold border transition-all ${
                  isDark ? 'border-cobra-yellow text-cobra-yellow hover:bg-cobra-yellow/10' : 'border-cobra-red text-cobra-red hover:bg-cobra-red/10'
                }`}
              >
                Statistics
              </Link>
              <Link
                to="/matches"
                className={`px-6 py-3 rounded-full font-semibold border transition-all ${
                  isDark ? 'border-white/20 text-white hover:bg-white/5' : 'border-black/10 text-black hover:bg-black/5'
                }`}
              >
                Matches
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex justify-center"
          >
            <img
              src={logo}
              alt="COBRA ESPORTS logo"
              className={`w-64 h-64 md:w-80 md:h-80 object-contain animate-float ${isDark ? 'drop-shadow-[0_0_60px_rgba(245,211,0,0.35)]' : 'drop-shadow-[0_0_50px_rgba(161,17,47,0.25)]'}`}
            />
          </motion.div>
        </div>
      </section>

      {/* QUICK STATS STRIP */}
      <section className={`py-14 border-y ${isDark ? 'border-cobra-yellow/10 bg-cobra-charcoal/40' : 'border-cobra-red/10 bg-white'}`}>
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
          {[
            { icon: Trophy, label: 'Титулов', value: '3' },
            { icon: BarChart3, label: 'HLTV Rating AXO', value: '1.28' },
            { icon: Swords, label: 'Матчей сыграно', value: '214' },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              className="flex flex-col items-center gap-2"
            >
              <s.icon className={accent} size={28} />
              <span className={`font-display text-3xl font-bold ${isDark ? 'text-white' : 'text-black'}`}>{s.value}</span>
              <span className={`text-sm ${isDark ? 'text-white/50' : 'text-black/50'}`}>{s.label}</span>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
