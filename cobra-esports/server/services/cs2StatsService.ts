import { getCS2RawStats, getSteamProfile, getCS2PlaytimeHours, SteamCS2RawStats } from './steamService';

// ---------------------------------------------------------------------------
// Реальные данные из официального Steam Web API (ISteamUserStats/GetUserStatsForGame,
// appid 730). Никаких mock/фейковых данных — если статистика игрока в CS2 приватная
// или Steam API недоступен, соответствующие поля возвращаются как null, а не
// подменяются выдуманными числами.
//
// ВАЖНО про ограничения официального API:
// Valve НЕ отдаёт публично HLTV-style "Rating 2.0" и "KAST" — это проприетарные
// метрики сторонних сервисов (HLTV/Leetify/FACEIT). Поэтому rating/kast здесь — null,
// available=false, вместо того чтобы что-то придумывать.
// ---------------------------------------------------------------------------

export interface PlayerStatsData {
  steamId: string;
  nickname: string;
  avatar: string | null;
  statsPublic: boolean; // false = профиль/статистика CS2 приватные, все числовые поля ниже = null

  kills: number | null;
  deaths: number | null;
  kd: number | null;

  headshotKills: number | null;
  headshotPercent: number | null;

  roundsPlayed: number | null;
  damageDone: number | null;
  adr: number | null; // average damage per round, посчитан из реальных damageDone/roundsPlayed

  wins: number | null;
  mvps: number | null;

  totalTimePlayedHours: number | null;

  // Проприетарные метрики, которых нет в официальном Steam API — честно null.
  rating: number | null;
  kast: number | null;
}

export interface MatchData {
  opponent: string;
  map: string;
  score: string;
  result: 'W' | 'L';
  date: string;
}

export interface PerformancePoint {
  date: string;
  rating: number;
}

function toNumber(v: number | undefined): number {
  return typeof v === 'number' && Number.isFinite(v) ? v : 0;
}

function buildStatsFromRaw(raw: SteamCS2RawStats): Omit<PlayerStatsData, 'steamId' | 'nickname' | 'avatar' | 'statsPublic'> {
  const kills = toNumber(raw.total_kills);
  const deaths = toNumber(raw.total_deaths);
  const headshotKills = toNumber(raw.total_kills_headshot);
  const roundsPlayed = toNumber(raw.total_rounds_played);
  const damageDone = toNumber(raw.total_damage_done);
  const wins = toNumber(raw.total_wins);
  const mvps = toNumber(raw.total_mvps);
  const totalTimePlayedSeconds = toNumber(raw.total_time_played);

  return {
    kills,
    deaths,
    kd: deaths > 0 ? Math.round((kills / deaths) * 100) / 100 : kills,

    headshotKills,
    headshotPercent: kills > 0 ? Math.round((headshotKills / kills) * 1000) / 10 : 0,

    roundsPlayed,
    damageDone,
    adr: roundsPlayed > 0 ? Math.round((damageDone / roundsPlayed) * 10) / 10 : 0,

    wins,
    mvps,

    totalTimePlayedHours: Math.round((totalTimePlayedSeconds / 3600) * 10) / 10,

    rating: null,
    kast: null,
  };
}

/**
 * Общая статистика игрока по CS2 — построена целиком из реальных данных Steam Web API.
 * Если STEAM_API_KEY не настроен или профиль/статистика игрока приватные,
 * числовые поля возвращаются как null и statsPublic=false — фронт должен
 * показать "нет данных", а не выдуманные цифры.
 */
export async function getPlayerStats(steamId: string): Promise<PlayerStatsData> {
  const [profile, raw] = await Promise.all([getSteamProfile(steamId), getCS2RawStats(steamId)]);

  const base = {
    steamId,
    nickname: profile?.nickname ?? steamId,
    avatar: profile?.avatar ?? null,
  };

  if (!raw) {
    return {
      ...base,
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

  return { ...base, statsPublic: true, ...buildStatsFromRaw(raw) };
}

/**
 * Часы, наигранные в CS2 (из библиотеки Steam, IPlayerService/GetOwnedGames).
 * Вынесено отдельной функцией, т.к. используется и /api/player/:steamId, и /api/stats/:steamId.
 */
export async function getCS2Hours(steamId: string): Promise<number | null> {
  return getCS2PlaytimeHours(steamId);
}

/**
 * История матчей. Официальный Steam Web API НЕ предоставляет публичную историю
 * матчей CS2 (это требует подключения к Game Coordinator и шэркодов, либо
 * стороннего провайдера вроде Leetify/FACEIT). Пока такой провайдер не подключён —
 * возвращаем пустой список вместо выдуманных матчей.
 */
export async function getPlayerMatches(_steamId: string): Promise<MatchData[]> {
  return [];
}

/**
 * История рейтинга для графика. Rating 2.0 — проприетарная метрика HLTV/Leetify,
 * недоступна через официальный Steam API. Пока сторонний провайдер не подключён —
 * возвращаем пустой массив вместо выдуманных точек.
 */
export async function getPlayerPerformance(_steamId: string): Promise<PerformancePoint[]> {
  return [];
}
