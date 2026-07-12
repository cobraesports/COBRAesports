import { motion } from 'framer-motion';
import { useTheme } from '../context/useTheme';
import { upcomingMatches, pastMatches, tournamentResults } from '../data/mockMatches';
import MatchCard from '../components/MatchCard';

export default function Matches() {
  const { isDark } = useTheme();
  const sectionTitle = isDark ? 'text-white' : 'text-black';

  return (
    <div className={`min-h-[70vh] py-16 px-6 ${isDark ? 'bg-cobra-black' : 'bg-cobra-bone'}`}>
      <div className="max-w-5xl mx-auto space-y-14">
        <div className="text-center">
          <h1 className={`font-display text-4xl font-bold mb-3 ${sectionTitle}`}>Матчи</h1>
          <p className={isDark ? 'text-white/50' : 'text-black/50'}>Расписание и результаты COBRA ESPORTS</p>
        </div>

        <section>
          <h2 className={`font-display text-2xl font-bold mb-5 ${sectionTitle}`}>Upcoming Matches</h2>
          <div className="grid gap-3">
            {upcomingMatches.map((m, i) => (
              <MatchCard key={m.id} opponent={m.opponent} subtitle={`${m.tournament} · ${m.format}`} date={m.date} delay={i * 0.05} />
            ))}
          </div>
        </section>

        <section>
          <h2 className={`font-display text-2xl font-bold mb-5 ${sectionTitle}`}>Past Matches</h2>
          <div className="grid gap-3">
            {pastMatches.map((m, i) => (
              <MatchCard key={m.id} opponent={m.opponent} subtitle={m.map} date={m.date} result={m.result} score={m.score} delay={i * 0.05} />
            ))}
          </div>
        </section>

        <section>
          <h2 className={`font-display text-2xl font-bold mb-5 ${sectionTitle}`}>Tournament Results</h2>
          <div className="grid md:grid-cols-3 gap-5">
            {tournamentResults.map((t, i) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className={`rounded-2xl p-5 border ${isDark ? 'bg-cobra-charcoal/60 border-cobra-yellow/10' : 'bg-white border-cobra-red/10'}`}
              >
                <p className={`font-display font-bold ${sectionTitle}`}>{t.tournament}</p>
                <p className={`mt-2 text-2xl font-display font-bold ${isDark ? 'text-cobra-yellow' : 'text-cobra-red'}`}>{t.placement}</p>
                <p className={`text-sm mt-1 ${isDark ? 'text-white/50' : 'text-black/50'}`}>{t.date} · {t.prize}</p>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
