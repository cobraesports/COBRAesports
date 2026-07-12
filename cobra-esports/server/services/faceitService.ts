import { env } from '../config/env';

// ---------------------------------------------------------------------------
// Отдельный провайдер статистики — FACEIT Data API (open.faceit.com/data/v4).
// НЕ смешивается со Steam: Steam остаётся источником аватара/ника/SteamID/часов CS2
// (см. services/steamService.ts), а этот файл отвечает только за FACEIT-данные
// (уровень, ELO, статистика, матчи). Никаких mock-данных — если данных нет,
// поля возвращаются пустыми/null, а не выдумываются.
// ---------------------------------------------------------------------------

const CS2_GAME_ID = 'cs2';

export interface FaceitPlayerSummary {
  playerId: string;
  nickname: string;
  avatar: string;
  country: string;
  faceitUrl: string;
  level: number;
  elo: number;
}

export interface FaceitStats {
  matches: number;
  winRate: number | null; // проценты, null если FACEIT не отдал Win Rate %
  wins: number | null;
  averageKD: number | null;
  averageHeadshots: number | null;
  longestWinStreak: number | null;
  recentResults: string[]; // например ['1','0','1'] — как отдаёт FACEIT (1 = победа)
}

export interface FaceitMatch {
  matchId: string;
  map: string | null;
  result: 'W' | 'L' | null;
  score: string | null;
  date: string | null;
  competition: string | null;
  teams: { faction1: string | null; faction2: string | null };
  eloChange: number | null; // FACEIT Data API не отдаёт дельту ELO за матч — всегда null, честно
}

export interface FaceitProfile {
  player: FaceitPlayerSummary;
  stats: FaceitStats;
  matches: FaceitMatch[];
}

class FaceitApiError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = 'FaceitApiError';
  }
}

function authHeaders(): Record<string, string> {
  return {
    Authorization: `Bearer ${env.faceitApiKey}`,
    Accept: 'application/json',
  };
}

function ensureConfigured() {
  if (!env.faceitApiKey) {
    throw new FaceitApiError('FACEIT_API_KEY is not configured', 503);
  }
}

/**
 * Читает тело ответа FACEIT при ошибке и логирует его целиком — коды 400/401/403
 * без тела почти не диагностируемы, а FACEIT обычно возвращает точное описание
 * проблемы в JSON (например { "errors": [{ "message": "...", "parameters": [...] }] }).
 */
async function throwFromErrorResponse(response: Response, context: string): Promise<never> {
  let bodyText = '';
  try {
    bodyText = await response.text();
  } catch {
    bodyText = '(не удалось прочитать тело ответа)';
  }
  console.error(`[faceitService] ${context}: FACEIT API ${response.status} ${response.statusText} — body: ${bodyText}`);
  throw new FaceitApiError(`FACEIT API responded with ${response.status}: ${bodyText}`, response.status);
}

/**
 * Ищет FACEIT-игрока по SteamID64 (game_player_id для game=cs2).
 * Возвращает null, если игрок с таким SteamID не привязан к FACEIT
 * (обычный кейс, а не ошибка — не у всех есть FACEIT-аккаунт).
 * Бросает FaceitApiError при отсутствии ключа или недоступности FACEIT API.
 */
export async function findPlayerBySteamId(steamId64: string): Promise<Record<string, any> | null> {
  ensureConfigured();

  const url = `${env.faceitApiUrl}/players?game=${CS2_GAME_ID}&game_player_id=${encodeURIComponent(steamId64)}`;

  let response: Response;
  try {
    response = await fetch(url, { headers: authHeaders() });
  } catch (err) {
    throw new FaceitApiError(`FACEIT API request failed: ${(err as Error).message}`);
  }

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    return throwFromErrorResponse(response, 'findPlayerBySteamId');
  }

  return (await response.json()) as Record<string, any>;
}

/**
 * Пожизненная статистика игрока по CS2 (GET /players/{player_id}/stats/cs2).
 * Возвращает null, если у игрока ещё нет сыгранных матчей CS2 на FACEIT
 * (FACEIT в этом случае отвечает 404 — это не ошибка).
 */
export async function getPlayerStats(playerId: string): Promise<Record<string, any> | null> {
  ensureConfigured();

  const url = `${env.faceitApiUrl}/players/${encodeURIComponent(playerId)}/stats/${CS2_GAME_ID}`;

  let response: Response;
  try {
    response = await fetch(url, { headers: authHeaders() });
  } catch (err) {
    throw new FaceitApiError(`FACEIT API request failed: ${(err as Error).message}`);
  }

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    return throwFromErrorResponse(response, 'getPlayerStats');
  }

  return (await response.json()) as Record<string, any>;
}

/**
 * Последние матчи игрока по CS2 (GET /players/{player_id}/history?game=cs2).
 * Возвращает [] при отсутствии истории — не ошибка.
 */
export async function getPlayerMatchHistory(playerId: string, limit = 5): Promise<Record<string, any>[]> {
  ensureConfigured();

  const url =
    `${env.faceitApiUrl}/players/${encodeURIComponent(playerId)}/history` +
    `?game=${CS2_GAME_ID}&limit=${limit}`;

  let response: Response;
  try {
    response = await fetch(url, { headers: authHeaders() });
  } catch (err) {
    throw new FaceitApiError(`FACEIT API request failed: ${(err as Error).message}`);
  }

  if (response.status === 404) {
    return [];
  }

  if (!response.ok) {
    return throwFromErrorResponse(response, 'getPlayerMatchHistory');
  }

  const json = (await response.json()) as { items?: Record<string, any>[] };
  return json.items ?? [];
}

function mapMatchHistoryItem(item: Record<string, any>, playerId: string): FaceitMatch {
  let result: 'W' | 'L' | null = null;

  // Определяем победу/поражение игрока: ищем, в какой команде он был,
  // и сравниваем с faction, указанной как winner.
  try {
    const teams = item.teams as Record<string, { players?: Array<{ player_id: string }> }> | undefined;
    const winnerFaction = item.results?.winner as string | undefined;
    if (teams && winnerFaction) {
      for (const [factionKey, faction] of Object.entries(teams)) {
        const hasPlayer = faction.players?.some((p) => p.player_id === playerId);
        if (hasPlayer) {
          result = factionKey === winnerFaction ? 'W' : 'L';
          break;
        }
      }
    }
  } catch {
    result = null;
  }

  const score = item.results?.score
    ? Object.values(item.results.score as Record<string, number>).join(':')
    : null;

  return {
    matchId: item.match_id ?? '',
    map: item.voting?.map?.pick?.[0] ?? item.game_map ?? null,
    result,
    score,
    date: item.started_at ? new Date(item.started_at * 1000).toISOString() : null,
    competition: item.competition_name ?? null,
    teams: {
      faction1: item.teams?.faction1?.nickname ?? null,
      faction2: item.teams?.faction2?.nickname ?? null,
    },
    eloChange: null,
  };
}

/**
 * Общая сборка профиля (player + stats + matches) из "сырого" объекта игрока FACEIT,
 * независимо от того, как его нашли — по SteamID или по нику.
 */
async function buildFaceitProfile(playerRaw: Record<string, any>): Promise<FaceitProfile> {
  const playerId: string = playerRaw.player_id;
  const cs2Game = playerRaw.games?.[CS2_GAME_ID];

  const player: FaceitPlayerSummary = {
    playerId,
    nickname: playerRaw.nickname ?? '',
    avatar: playerRaw.avatar ?? '',
    country: playerRaw.country ?? '',
    faceitUrl: playerRaw.faceit_url
      ? String(playerRaw.faceit_url).replace('{lang}', 'en')
      : `https://www.faceit.com/en/players/${playerRaw.nickname ?? ''}`,
    level: cs2Game?.skill_level ?? 0,
    elo: cs2Game?.faceit_elo ?? 0,
  };

  const [statsRaw, matches] = await Promise.all([getPlayerStats(playerId), getRecentMatches(playerId, 5)]);

  const lifetime = statsRaw?.lifetime ?? {};

  const stats: FaceitStats = {
    matches: lifetime.Matches ? Number(lifetime.Matches) : 0,
    winRate: lifetime['Win Rate %'] !== undefined ? Number(lifetime['Win Rate %']) : null,
    wins: lifetime.Wins !== undefined ? Number(lifetime.Wins) : null,
    averageKD: lifetime['Average K/D Ratio'] !== undefined ? Number(lifetime['Average K/D Ratio']) : null,
    averageHeadshots:
      lifetime['Average Headshots %'] !== undefined ? Number(lifetime['Average Headshots %']) : null,
    longestWinStreak:
      lifetime['Longest Win Streak'] !== undefined ? Number(lifetime['Longest Win Streak']) : null,
    recentResults: Array.isArray(lifetime['Recent Results']) ? lifetime['Recent Results'] : [],
  };

  return { player, stats, matches };
}

/**
 * Собирает полный FACEIT-профиль игрока по SteamID64: поиск игрока + статистика + матчи.
 * Возвращает null, если у игрока нет привязанного FACEIT-аккаунта (обычный кейс).
 * Бросает FaceitApiError при проблемах с ключом/доступностью FACEIT API —
 * контроллер должен поймать её и не уронить сервер.
 */
export async function getFaceitProfileBySteamId(steamId64: string): Promise<FaceitProfile | null> {
  const playerRaw = await findPlayerBySteamId(steamId64);
  if (!playerRaw) {
    return null;
  }
  return buildFaceitProfile(playerRaw);
}

/**
 * Ищет FACEIT-игрока по нику (GET /players?nickname=...).
 * Возвращает null, если игрока с таким ником нет на FACEIT (404 — не ошибка).
 */
export async function getPlayerByNickname(nickname: string): Promise<Record<string, any> | null> {
  ensureConfigured();

  const url = `${env.faceitApiUrl}/players?nickname=${encodeURIComponent(nickname)}`;

  let response: Response;
  try {
    response = await fetch(url, { headers: authHeaders() });
  } catch (err) {
    throw new FaceitApiError(`FACEIT API request failed: ${(err as Error).message}`);
  }

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    return throwFromErrorResponse(response, 'getPlayerByNickname');
  }

  return (await response.json()) as Record<string, any>;
}

/**
 * Последние матчи игрока в удобном для фронта формате (карта/дата/результат/команды/счёт/Elo).
 * ВАЖНО про eloChange: официальный FACEIT Data API v4 не отдаёт изменение ELO за конкретный
 * матч в истории (/players/{id}/history) — только текущий общий ELO игрока
 * (/players/{id}/games/cs2 -> faceit_elo). Поэтому eloChange всегда null:
 * это честное отсутствие данных, а не заглушка. Если понадобится точный дельта-ELO,
 * нужен отдельный сторонний трекер (например Leetify), который сам считает историю ELO.
 */
export async function getRecentMatches(playerId: string, limit = 5): Promise<FaceitMatch[]> {
  const history = await getPlayerMatchHistory(playerId, limit);
  return history.map((item) => mapMatchHistoryItem(item, playerId));
}

/**
 * Собирает FACEIT-профиль игрока по нику: поиск + lifetime-статистика.
 * Используется GET /api/faceit/player/:nickname.
 */
export async function getFaceitProfileByNickname(nickname: string): Promise<FaceitProfile | null> {
  const playerRaw = await getPlayerByNickname(nickname);
  if (!playerRaw) {
    return null;
  }
  return buildFaceitProfile(playerRaw);
}


export { FaceitApiError };
