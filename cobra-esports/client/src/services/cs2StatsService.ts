import { apiUrl } from '../config/api';

// Обращается к backend-контракту, построенному на реальных данных Steam Web API:
//   GET /api/stats/:steamId   -> { player, performance }
//   GET /api/matches/:steamId -> { matches }
// Backend больше не подставляет mock-данные: если статистика приватная или
// STEAM_API_KEY не настроен, соответствующие поля приходят как null, а не выдумываются.
// Здесь остаётся только сетевой фолбэк на случай, если backend вообще не поднят —
// в этом случае UI должен показать "нет данных", поэтому фолбэк тоже возвращает null-поля,
// а не фейковые цифры.

export interface LivePlayerStats {
  steamId: string;
  nickname: string;
  avatar: string | null;
  statsPublic: boolean;

  kills: number | null;
  deaths: number | null;
  kd: number | null;

  headshotKills: number | null;
  headshotPercent: number | null;

  roundsPlayed: number | null;
  damageDone: number | null;
  adr: number | null;

  wins: number | null;
  mvps: number | null;

  totalTimePlayedHours: number | null;

  rating: number | null;
  kast: number | null;
}

export interface PerformancePoint {
  date: string;
  rating: number;
}

export interface MatchItem {
  opponent: string;
  map: string;
  score: string;
  result: 'W' | 'L';
  date: string;
}

interface StatsResponse {
  player: LivePlayerStats;
  performance: PerformancePoint[];
}

interface MatchesResponse {
  matches: MatchItem[];
}

function emptyPlayer(steamId: string): LivePlayerStats {
  return {
    steamId,
    nickname: steamId,
    avatar: null,
    statsPublic: false,
    kills: null,
    deaths: null,
    kd: null,
    headshotKills: null,
    headshotPercent: null,
    roundsPlayed: null,
    damageDone: null,
    adr: null,
    wins: null,
    mvps: null,
    totalTimePlayedHours: null,
    rating: null,
    kast: null,
  };
}

export async function fetchPlayerStats(steamId: string): Promise<StatsResponse> {
  try {
    const res = await fetch(apiUrl(`/api/stats/${steamId}`), { credentials: 'include' });
    if (!res.ok) throw new Error(`bad response: ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('[cs2StatsService] fetchPlayerStats: backend unreachable, showing empty state:', (err as Error).message);
    return { player: emptyPlayer(steamId), performance: [] };
  }
}

export async function fetchPlayerMatches(steamId: string): Promise<MatchesResponse> {
  try {
    const res = await fetch(apiUrl(`/api/matches/${steamId}`), { credentials: 'include' });
    if (!res.ok) throw new Error(`bad response: ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('[cs2StatsService] fetchPlayerMatches: backend unreachable, showing empty state:', (err as Error).message);
    return { matches: [] };
  }
}
