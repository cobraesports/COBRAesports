import { motion } from 'framer-motion';
import { ExternalLink, Shield, Crosshair } from 'lucide-react';
import { useTheme } from '../context/useTheme';
import { Player } from '../data/mockPlayer';

const fallbackAvatar =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><rect width="100%" height="100%" fill="#222"/><text x="50%" y="50%" font-size="60" fill="#f5d300" text-anchor="middle" dy=".3em" font-family="sans-serif">AXO</text></svg>`
  );

export default function PlayerCard({ player }: { player: Player }) {
  const { isDark } = useTheme();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className={`relative overflow-hidden rounded-3xl p-8 max-w-md mx-auto border ${
        isDark
          ? 'bg-gradient-to-b from-cobra-charcoal to-cobra-black border-cobra-yellow/20 shadow-neon'
          : 'bg-white border-cobra-red/15 shadow-crimson'
      }`}
    >
      <div className="flex flex-col items-center text-center">
        <div className="relative mb-4">
          <img
            src={player.avatar || fallbackAvatar}
            alt={player.nickname}
            className={`h-28 w-28 rounded-full object-cover border-4 ${
              isDark ? 'border-cobra-yellow' : 'border-cobra-red'
            }`}
          />
          <span
            className={`absolute bottom-1 right-1 h-4 w-4 rounded-full border-2 ${
              isDark ? 'border-cobra-black' : 'border-white'
            } ${player.onlineStatus === 'online' ? 'bg-green-400' : 'bg-gray-500'}`}
          />
        </div>

        <h2 className={`font-display text-3xl font-bold ${isDark ? 'text-cobra-yellow' : 'text-cobra-red'}`}>
          {player.nickname}
        </h2>
        <p className={`text-sm mt-1 ${isDark ? 'text-cobra-white/60' : 'text-black/60'}`}>{player.role}</p>

        <div className={`mt-6 w-full grid grid-cols-2 gap-3 text-left text-sm ${isDark ? 'text-cobra-white/80' : 'text-black/80'}`}>
          <div className="flex items-center gap-2">
            <Shield size={16} className={isDark ? 'text-cobra-yellow' : 'text-cobra-red'} />
            <span>{player.team}</span>
          </div>
          <div className="flex items-center gap-2">
            <Crosshair size={16} className={isDark ? 'text-cobra-yellow' : 'text-cobra-red'} />
            <span>Lvl {player.steamLevel ?? '—'}</span>
          </div>
          <div className="col-span-2 truncate">SteamID64: {player.steamId64}</div>
          <div className="flex items-center gap-2">
            <span>CS2: {player.cs2Hours !== null ? `${player.cs2Hours} ч` : '—'}</span>
          </div>
          <div className="flex items-center gap-2">
            <span>Игр в библиотеке: {player.gamesCount ?? '—'}</span>
          </div>
          <a
            href={player.profileUrl}
            target="_blank"
            rel="noreferrer"
            className={`col-span-2 flex items-center gap-1 font-semibold ${isDark ? 'text-cobra-yellow' : 'text-cobra-red'}`}
          >
            Steam-профиль <ExternalLink size={14} />
          </a>
        </div>
      </div>
    </motion.div>
  );
}
