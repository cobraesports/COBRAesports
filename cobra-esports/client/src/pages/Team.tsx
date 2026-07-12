import { motion } from 'framer-motion';
import { useTheme } from '../context/useTheme';
import { mockTeam } from '../data/mockTeam';

export default function Team() {
  const { isDark } = useTheme();

  return (
    <div className={`min-h-[70vh] py-16 px-6 ${isDark ? 'bg-cobra-black' : 'bg-cobra-bone'}`}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className={`font-display text-4xl font-bold mb-3 ${isDark ? 'text-white' : 'text-black'}`}>Состав</h1>
          <p className={isDark ? 'text-white/50' : 'text-black/50'}>Формирование ростера COBRA ESPORTS в процессе</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-5">
          {mockTeam.map((member, i) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -6 }}
              className={`rounded-2xl p-6 text-center border ${
                member.status === 'active'
                  ? isDark
                    ? 'bg-gradient-to-b from-cobra-charcoal to-cobra-black border-cobra-yellow/30 shadow-neon-sm'
                    : 'bg-white border-cobra-red/20 shadow-crimson'
                  : isDark
                  ? 'bg-cobra-charcoal/30 border-white/5 border-dashed'
                  : 'bg-white/40 border-black/10 border-dashed'
              }`}
            >
              <div
                className={`h-16 w-16 mx-auto rounded-full mb-4 flex items-center justify-center font-display font-bold text-xl ${
                  member.status === 'active'
                    ? isDark
                      ? 'bg-cobra-yellow text-black'
                      : 'bg-cobra-red text-white'
                    : isDark
                    ? 'bg-white/10 text-white/30'
                    : 'bg-black/5 text-black/30'
                }`}
              >
                {member.status === 'active' ? member.nickname.slice(0, 2) : '?'}
              </div>
              <p className={`font-display font-bold ${isDark ? 'text-white' : 'text-black'}`}>{member.nickname}</p>
              <p className={`text-xs mt-1 ${isDark ? 'text-white/50' : 'text-black/50'}`}>{member.role}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
