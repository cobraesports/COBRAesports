import { Request, Response } from 'express';
import * as cs2StatsService from '../services/cs2StatsService';
import { getSteamProfile, getOwnedGames } from '../services/steamService';
import { env } from '../config/env';

/**
 * GET /api/player/:steamId
 * Реальный профиль Steam + список игр + часы в CS2.
 * Никаких mock-данных: если STEAM_API_KEY не настроен или Steam API недоступен —
 * возвращает понятную ошибку (503/502), а не выдуманный профиль.
 */
export async function getPlayerProfile(req: Request, res: Response) {
  const { steamId } = req.params;

  if (!steamId) {
    return res.status(400).json({ error: 'steamId is required' });
  }

  if (!env.steamApiKey) {
    return res.status(503).json({
      error: 'Steam API is not configured',
      message: 'Set STEAM_API_KEY in server/.env to fetch real Steam data.',
    });
  }

  try {
    const [profile, games] = await Promise.all([getSteamProfile(steamId), getOwnedGames(steamId)]);

    if (!profile) {
      return res.status(502).json({
        error: 'Failed to fetch Steam profile',
        message: 'Steam API недоступен или steamId некорректен.',
      });
    }

    const cs2Game = games?.find((g) => g.appid === 730) ?? null;

    res.json({
      steamId: profile.steamId,
      nickname: profile.nickname,
      avatar: profile.avatar,
      profileUrl: profile.profileUrl,
      onlineStatus: profile.onlineStatus,
      games:
        games === null
          ? null // недоступно (нет ключа / ошибка запроса)
          : games.map((g) => ({
              appid: g.appid,
              name: g.name,
              playtimeForeverHours: g.playtimeForeverHours,
              iconUrl: g.iconUrl,
            })), // [] если профиль приватный (game details скрыты) — не ошибка
      gamesAvailable: games !== null,
      cs2: {
        appid: 730,
        hoursPlayed: cs2Game ? cs2Game.playtimeForeverHours : games !== null ? 0 : null,
      },
    });
  } catch (err) {
    console.error('[statsController] getPlayerProfile unexpected error:', err);
    res.status(500).json({ error: 'Failed to load player profile' });
  }
}

/**
 * GET /api/stats/:steamId
 * Возвращает { player, performance }. player построен из реальной статистики
 * Steam Web API (ISteamUserStats/GetUserStatsForGame, appid 730). Если статистика
 * игрока приватная, player.statsPublic=false и числовые поля равны null —
 * это НЕ ошибка запроса, а честное состояние "данных нет".
 */
export async function getStats(req: Request, res: Response) {
  const { steamId } = req.params;

  if (!steamId) {
    return res.status(400).json({ error: 'steamId is required' });
  }

  try {
    const [player, performance] = await Promise.all([
      cs2StatsService.getPlayerStats(steamId),
      cs2StatsService.getPlayerPerformance(steamId),
    ]);

    res.json({ player, performance });
  } catch (err) {
    console.error('[statsController] getStats unexpected error:', err);
    res.status(500).json({ error: 'Failed to load player stats' });
  }
}

/**
 * GET /api/matches/:steamId
 * Возвращает { matches }. Пока не подключён сторонний провайдер матч-истории
 * (Leetify/FACEIT) — matches всегда [], без выдуманных данных.
 */
export async function getMatches(req: Request, res: Response) {
  const { steamId } = req.params;

  if (!steamId) {
    return res.status(400).json({ error: 'steamId is required' });
  }

  try {
    const matches = await cs2StatsService.getPlayerMatches(steamId);
    res.json({ matches });
  } catch (err) {
    console.error('[statsController] getMatches unexpected error:', err);
    res.status(500).json({ error: 'Failed to load matches' });
  }
}
