import { useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  RadarChart, PolarGrid, PolarAngleAxis, Radar,
  BarChart, Bar,
} from 'recharts';
import {
  Target, Crosshair, Percent, Trophy, Skull, Users, Zap,
  Map as MapIcon, RefreshCw, ThumbsUp, ThumbsDown,
} from 'lucide-react';
import { useTheme } from '../context/useTheme';
import { fetchPlayerStats, fetchPlayerMatches, LivePlayerStats, PerformancePoint, MatchItem } from '../api/stats';
import { getFaceitPlayer, getFaceitMatches, FaceitPlayerResponse, FaceitMatch } from '../api/faceit';
import { mockStats } from '../data/mockStats';
import { mockPlayer } from '../data/mockPlayer';
import StatCard from '../components/StatCard';
import MatchCard from '../components/MatchCard';
import FaceitProfileCard from '../components/FaceitProfileCard';
import FaceitMatchCard from '../components/FaceitMatchCard';
import LoadingSkeleton from '../components/LoadingSkeleton';

const AXO_STEAM_ID = mockPlayer.steamId64;
// FACEIT ищется по нику — используем Steam-ник как лучшее предположение.
// Если реальный FACEIT-ник другой, карточка честно покажет "профиль не найден".
// Реальный ник игрока на FACEIT (отличается от Steam-ника "AXO", который используется
// как отображаемое имя команды/бренда).
const AXO_FACEIT_NICKNAME = 'PAZETKO';
const AXO_CLUB_NICKNAME = mockPlayer.nickname; // "AXO" — показываем как подпись под FACEIT-ником

export default function Statistics() {
  const { isDark } = useTheme();
  const accent = isDark ? '#f5d300' : '#a1112f';

  const [player, setPlayer] = useState<LivePlayerStats | null>(null);
  const [performance, setPerformance] = useState<PerformancePoint[]>([]);
  const [matches, setMatches] = useState<MatchItem[]>([]);
  const [faceitPlayer, setFaceitPlayer] = useState<FaceitPlayerResponse | null>(null);
  const [faceitMatches, setFaceitMatches] = useState<FaceitMatch[]>([]);
  const [faceitLoading, setFaceitLoading] = useState(true);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const loadAll = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    setFaceitLoading(true);
    try {
      const [statsRes, matchesRes, faceitPlayerRes, faceitMatchesRes] = await Promise.all([
        fetchPlayerStats(AXO_STEAM_ID),
        fetchPlayerMatches(AXO_STEAM_ID),
        getFaceitPlayer(AXO_FACEIT_NICKNAME),
        getFaceitMatches(AXO_FACEIT_NICKNAME),
      ]);
      setPlayer(statsRes.player);
      setPerformance(statsRes.performance);
      setMatches(matchesRes.matches);
      setFaceitPlayer(faceitPlayerRes);
      setFaceitMatches(faceitMatchesRes.matches ?? []);
      setLastUpdated(new Date());
    } finally {
      setLoading(false);
      setRefreshing(false);
      setFaceitLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  if (loading || !player) {
    return (
      <div className={`min-h-[70vh] py-16 px-6 ${isDark ? 'bg-cobra-black' : 'bg-cobra-bone'}`}>
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <LoadingSkeleton key={i} className="h-28" />
          ))}
        </div>
      </div>
    );
  }

  const fmt = (v: number | null, digits = 2) => (v === null ? '—' : v.toFixed(digits));
  const fmtInt = (v: number | null) => (v === null ? '—' : v);

  const cards = [
    { label: 'Rating', value: fmt(player.rating, 2), icon: Trophy },
    { label: 'K/D', value: fmt(player.kd, 2), icon: Crosshair },
    { label: 'ADR', value: fmt(player.adr, 1), icon: Target },
    { label: 'KAST', value: fmt(player.kast, 1), icon: Percent, suffix: player.kast === null ? '' : '%' },
    { label: 'Headshot %', value: fmtInt(player.headshotPercent), icon: Zap, suffix: player.headshotPercent === null ? '' : '%' },
    { label: 'Wins', value: fmtInt(player.wins), icon: ThumbsUp },
    { label: 'MVPs', value: fmtInt(player.mvps), icon: Users },
    { label: 'Hours in CS2', value: fmtInt(player.totalTimePlayedHours), icon: MapIcon },
    { label: 'Kills', value: fmtInt(player.kills), icon: Skull },
    { label: 'Deaths', value: fmtInt(player.deaths), icon: Skull },
  ];

  return (
    <div className={`min-h-screen py-16 px-6 ${isDark ? 'bg-cobra-black' : 'bg-cobra-bone'}`}>
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 flex flex-wrap items-end justify-between gap-4"
        >
          <div>
            <h1 className={`font-display text-4xl font-bold mb-2 ${isDark ? 'text-white' : 'text-black'}`}>
              Statistics Dashboard
            </h1>
            <p className={isDark ? 'text-white/50' : 'text-black/50'}>
              {player.nickname} · живые данные Steam Web API (CS2, appid 730)
            </p>
            {!player.statsPublic && (
              <p className={`text-xs mt-1 ${isDark ? 'text-cobra-yellow' : 'text-cobra-red'}`}>
                Статистика CS2 у этого игрока приватная (или STEAM_API_KEY не настроен на сервере) — показать реальные цифры нельзя.
              </p>
            )}
            {lastUpdated && (
              <p className={`text-xs mt-1 ${isDark ? 'text-white/30' : 'text-black/30'}`}>
                Обновлено: {lastUpdated.toLocaleTimeString()}
              </p>
            )}
          </div>

          <button
            onClick={() => loadAll(true)}
            disabled={refreshing}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-full font-semibold text-sm transition-all disabled:opacity-60 ${
              isDark ? 'bg-cobra-yellow text-black hover:shadow-neon-sm' : 'bg-cobra-red text-white hover:brightness-110'
            }`}
          >
            <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
            {refreshing ? 'Обновление…' : 'Refresh Stats'}
          </button>
        </motion.div>

        {/* FACEIT PROFILE CARD — отдельный провайдер, не смешан со Steam-статистикой выше */}
        <div className="mb-12 max-w-md">
          <h3 className={`font-display font-bold mb-4 ${isDark ? 'text-white' : 'text-black'}`}>FACEIT</h3>
          <FaceitProfileCard data={faceitPlayer} loading={faceitLoading} clubNickname={AXO_CLUB_NICKNAME} />
        </div>

        {/* STAT CARDS GRID */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-12">
          {cards.map((c, i) => (
            <StatCard key={c.label} label={c.label} value={c.value} icon={c.icon} suffix={c.suffix} delay={i * 0.03} />
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* RATING HISTORY (from getPlayerPerformance) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={`rounded-2xl p-6 border ${isDark ? 'bg-cobra-charcoal/60 border-cobra-yellow/10' : 'bg-white border-cobra-red/10'}`}
          >
            <h3 className={`font-display font-bold mb-4 ${isDark ? 'text-white' : 'text-black'}`}>Rating History</h3>
            {performance.length === 0 ? (
              <p className={`text-sm py-16 text-center ${isDark ? 'text-white/40' : 'text-black/40'}`}>
                Нет данных: Rating 2.0 не публикуется в официальном Steam API. Подключите провайдера
                (Leetify/FACEIT) через CS2_STATS_API_URL, чтобы получить историю рейтинга.
              </p>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={performance}>
                  <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#ffffff10' : '#00000010'} />
                  <XAxis dataKey="date" stroke={isDark ? '#ffffff40' : '#00000040'} fontSize={11} />
                  <YAxis stroke={isDark ? '#ffffff40' : '#00000040'} fontSize={12} domain={[0, 2]} />
                  <Tooltip contentStyle={{ background: isDark ? '#121317' : '#fff', border: 'none', borderRadius: 8 }} />
                  <Line type="monotone" dataKey="rating" stroke={accent} strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </motion.div>

          {/* RADAR CHART — доп. аналитика, пока локальный mock (не часть внешнего API) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={`rounded-2xl p-6 border ${isDark ? 'bg-cobra-charcoal/60 border-cobra-yellow/10' : 'bg-white border-cobra-red/10'}`}
          >
            <h3 className={`font-display font-bold mb-4 ${isDark ? 'text-white' : 'text-black'}`}>Performance Radar</h3>
            <ResponsiveContainer width="100%" height={220}>
              <RadarChart data={mockStats.radar}>
                <PolarGrid stroke={isDark ? '#ffffff20' : '#00000020'} />
                <PolarAngleAxis dataKey="stat" stroke={isDark ? '#ffffff60' : '#00000060'} fontSize={11} />
                <Radar dataKey="value" stroke={accent} fill={accent} fillOpacity={0.35} />
              </RadarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* MAP WIN RATE — доп. аналитика, пока локальный mock */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={`rounded-2xl p-6 border ${isDark ? 'bg-cobra-charcoal/60 border-cobra-yellow/10' : 'bg-white border-cobra-red/10'}`}
          >
            <h3 className={`font-display font-bold mb-4 flex items-center gap-2 ${isDark ? 'text-white' : 'text-black'}`}>
              <MapIcon size={18} /> Map Win Rate
            </h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={mockStats.favoriteMaps}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#ffffff10' : '#00000010'} />
                <XAxis dataKey="map" stroke={isDark ? '#ffffff40' : '#00000040'} fontSize={12} />
                <YAxis stroke={isDark ? '#ffffff40' : '#00000040'} fontSize={12} />
                <Tooltip contentStyle={{ background: isDark ? '#121317' : '#fff', border: 'none', borderRadius: 8 }} />
                <Bar dataKey="winRate" fill={accent} radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* WEAPON USAGE — доп. аналитика, пока локальный mock */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={`rounded-2xl p-6 border ${isDark ? 'bg-cobra-charcoal/60 border-cobra-yellow/10' : 'bg-white border-cobra-red/10'}`}
          >
            <h3 className={`font-display font-bold mb-4 ${isDark ? 'text-white' : 'text-black'}`}>Weapon Usage</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={mockStats.favoriteWeapons} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#ffffff10' : '#00000010'} />
                <XAxis type="number" stroke={isDark ? '#ffffff40' : '#00000040'} fontSize={12} />
                <YAxis dataKey="weapon" type="category" stroke={isDark ? '#ffffff40' : '#00000040'} fontSize={12} width={90} />
                <Tooltip contentStyle={{ background: isDark ? '#121317' : '#fff', border: 'none', borderRadius: 8 }} />
                <Bar dataKey="kills" fill={accent} radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* RECENT MATCHES (from getPlayerMatches) + local activity feed */}
        <div className="grid lg:grid-cols-2 gap-8">
          <div>
            <h3 className={`font-display font-bold mb-4 ${isDark ? 'text-white' : 'text-black'}`}>Recent Matches</h3>
            <div className="flex flex-col gap-3">
              {faceitMatches.length > 0 ? (
                faceitMatches.map((m, i) => <FaceitMatchCard key={m.matchId || i} match={m} delay={i * 0.05} />)
              ) : matches.length === 0 ? (
                <p className={`text-sm py-8 text-center ${isDark ? 'text-white/40' : 'text-black/40'}`}>
                  {faceitPlayer?.connected === false && faceitPlayer.message === 'FACEIT profile not found'
                    ? 'У этого игрока не найден привязанный FACEIT-аккаунт, а Steam API историю матчей не отдаёт.'
                    : 'Нет данных: официальный Steam API не отдаёт историю матчей CS2, а FACEIT сейчас недоступен.'}
                </p>
              ) : (
                matches.map((m, i) => (
                  <MatchCard
                    key={i}
                    opponent={m.opponent}
                    subtitle={m.map}
                    date={m.date}
                    result={m.result}
                    score={m.score}
                    delay={i * 0.05}
                  />
                ))
              )}
            </div>
          </div>

          <div>
            <h3 className={`font-display font-bold mb-4 ${isDark ? 'text-white' : 'text-black'}`}>Recent Activity</h3>
            <div className="flex flex-col gap-3">
              {mockStats.recentActivity.map((a, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className={`rounded-xl p-4 border text-sm ${isDark ? 'bg-cobra-charcoal/50 border-cobra-yellow/10 text-white/70' : 'bg-white border-cobra-red/10 text-black/70'}`}
                >
                  <p>{a.text}</p>
                  <span className={`text-xs ${isDark ? 'text-white/40' : 'text-black/40'}`}>{a.date}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
