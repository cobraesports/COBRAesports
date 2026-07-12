import { env } from '../config/env';

export const CS2_APP_ID = 730;

export interface SteamProfileSummary {
  steamId: string;
  nickname: string;
  avatar: string;
  profileUrl: string;
  onlineStatus: 'online' | 'offline';
}

export interface SteamOwnedGame {
  appid: number;
  name: string;
  playtimeForeverMinutes: number;
  playtimeForeverHours: number;
  playtime2WeeksMinutes: number;
  iconUrl: string | null;
}

export interface SteamCS2RawStats {
  [statName: string]: number;
}

/**
 * Получает публичный профиль Steam (ник, аватар, статус) через Steam Web API.
 * Используется cs2StatsService, чтобы дополнить статистику актуальным
 * ником/аватаром, даже если сам провайдер статистики их не отдаёт.
 *
 * Ключ читается ТОЛЬКО из process.env (через config/env.ts). Если ключ не задан
 * или запрос не удался — возвращает null, вызывающий код должен сам фолбэкнуться на mock.
 */
export async function getSteamProfile(steamId64: string): Promise<SteamProfileSummary | null> {
  if (!env.steamApiKey) {
    return null;
  }

  try {
    const url = `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${env.steamApiKey}&steamids=${steamId64}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Steam API responded with ${response.status}`);
    }

    const json = (await response.json()) as {
      response?: { players?: Array<Record<string, any>> };
    };
    const player = json.response?.players?.[0];

    if (!player) {
      return null;
    }

    return {
      steamId: player.steamid,
      nickname: player.personaname,
      avatar: player.avatarfull,
      profileUrl: player.profileurl,
      onlineStatus: player.personastate === 1 ? 'online' : 'offline',
    };
  } catch (err) {
    console.error('[steamService] getSteamProfile failed:', (err as Error).message);
    return null;
  }
}

/**
 * Получает список игр, которыми владеет пользователь (IPlayerService/GetOwnedGames).
 * ВАЖНО: сработает только если у пользователя в приватности Steam включено
 * "Показывать список игр" (Game details = Public). Иначе Steam вернёт пустой response.
 * Возвращает null при отсутствии ключа или ошибке запроса — вызывающий код должен
 * обработать это как "данные недоступны", а не подставлять моковые игры.
 */
export async function getOwnedGames(steamId64: string): Promise<SteamOwnedGame[] | null> {
  if (!env.steamApiKey) {
    return null;
  }

  try {
    const url =
      `https://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/` +
      `?key=${env.steamApiKey}&steamid=${steamId64}&include_appinfo=1&include_played_free_games=1&format=json`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Steam API responded with ${response.status}`);
    }

    const json = (await response.json()) as {
      response?: { game_count?: number; games?: Array<Record<string, any>> };
    };
    const games = json.response?.games;

    if (!games) {
      // Профиль приватный (game details скрыты) либо у аккаунта нет игр.
      return [];
    }

    return games.map((g) => ({
      appid: g.appid,
      name: g.name ?? `App ${g.appid}`,
      playtimeForeverMinutes: g.playtime_forever ?? 0,
      playtimeForeverHours: Math.round(((g.playtime_forever ?? 0) / 60) * 10) / 10,
      playtime2WeeksMinutes: g.playtime_2weeks ?? 0,
      iconUrl: g.img_icon_url
        ? `https://media.steampowered.com/steamcommunity/public/images/apps/${g.appid}/${g.img_icon_url}.jpg`
        : null,
    }));
  } catch (err) {
    console.error('[steamService] getOwnedGames failed:', (err as Error).message);
    return null;
  }
}

/**
 * Достаёт из списка игр запись про CS2 (appid 730) и возвращает часы в игре.
 * Возвращает null, если список игр недоступен (приватный профиль/нет ключа/ошибка).
 * Возвращает 0, если список доступен, но CS2 в нём нет (игра не куплена/не запускалась).
 */
export async function getCS2PlaytimeHours(steamId64: string): Promise<number | null> {
  const games = await getOwnedGames(steamId64);
  if (games === null) return null;
  const cs2 = games.find((g) => g.appid === CS2_APP_ID);
  return cs2 ? cs2.playtimeForeverHours : 0;
}

/**
 * Получает "сырую" статистику CS2 игрока через ISteamUserStats/GetUserStatsForGame.
 * Это единственная реальная (не сторонняя платная) статистика по CS2, которую отдаёт
 * официальный Steam Web API: total_kills, total_deaths, total_wins, total_damage_done,
 * total_kills_headshot, total_rounds_played, total_mvps, total_time_played и т.д.
 * Требует, чтобы у пользователя статистика по игре была публичной, иначе Steam
 * отвечает 403/500 — в этом случае возвращаем null.
 */
export async function getCS2RawStats(steamId64: string): Promise<SteamCS2RawStats | null> {
  if (!env.steamApiKey) {
    return null;
  }

  try {
    const url =
      `https://api.steampowered.com/ISteamUserStats/GetUserStatsForGame/v0002/` +
      `?appid=${CS2_APP_ID}&key=${env.steamApiKey}&steamid=${steamId64}`;
    const response = await fetch(url);

    if (!response.ok) {
      // Steam отвечает 403/500, если статистика игрока по CS2 приватная.
      throw new Error(`Steam API responded with ${response.status}`);
    }

    const json = (await response.json()) as {
      playerstats?: { stats?: Array<{ name: string; value: number }> };
    };
    const stats = json.playerstats?.stats;

    if (!stats) {
      return null;
    }

    const map: SteamCS2RawStats = {};
    for (const s of stats) {
      map[s.name] = s.value;
    }
    return map;
  } catch (err) {
    console.error('[steamService] getCS2RawStats failed:', (err as Error).message);
    return null;
  }
}
