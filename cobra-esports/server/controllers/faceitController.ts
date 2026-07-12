import { Request, Response } from 'express';
import { getFaceitProfileBySteamId, getFaceitProfileByNickname, FaceitApiError } from '../services/faceitService';
import { env } from '../config/env';

function faceitNotConfigured(res: Response) {
  return res.status(503).json({
    connected: false,
    message: 'FACEIT API is not configured. Set FACEIT_API_KEY in server/.env.',
  });
}

function handleFaceitError(err: unknown, res: Response, action: string) {
  if (err instanceof FaceitApiError) {
    console.error(`[faceitController] ${action}: FACEIT API error:`, err.message);
    return res.status(err.status === 503 ? 503 : 502).json({
      connected: false,
      message: 'FACEIT API is currently unavailable. Please try again later.',
    });
  }

  console.error(`[faceitController] ${action}: unexpected error:`, err);
  res.status(500).json({ connected: false, message: `Failed to ${action}` });
}

/**
 * GET /api/faceit/:steamId
 * Отдельный провайдер статистики FACEIT — не связан со Steam-роутами/контроллерами.
 * Ответ:
 *   200 { connected: true, provider: 'FACEIT', player, stats, matches }
 *   200 { connected: false, message: 'FACEIT profile not found' }  — нет привязанного FACEIT-аккаунта
 *   503 { connected: false, message: '...' }                        — FACEIT_API_KEY не настроен
 *   404 { connected: false, message: '...' }                        — некорректный steamId (пустой и т.п.)
 *   502 { connected: false, message: '...' }                        — FACEIT API недоступен/ошибка сети
 * Сервер при этом никогда не падает — все ошибки FACEIT перехватываются здесь.
 */
export async function getFaceitStats(req: Request, res: Response) {
  const { steamId } = req.params;

  if (!steamId) {
    return res.status(404).json({ connected: false, message: 'steamId is required' });
  }

  if (!env.faceitApiKey) {
    return faceitNotConfigured(res);
  }

  try {
    const profile = await getFaceitProfileBySteamId(steamId);

    if (!profile) {
      return res.status(404).json({
        connected: false,
        message: 'FACEIT profile not found',
      });
    }

    res.json({
      connected: true,
      provider: 'FACEIT',
      player: {
        nickname: profile.player.nickname,
        level: profile.player.level,
        elo: profile.player.elo,
        country: profile.player.country,
      },
      stats: profile.stats,
      matches: profile.matches,
    });
  } catch (err) {
    handleFaceitError(err, res, 'load FACEIT stats');
  }
}

/**
 * GET /api/faceit/player/:nickname
 * Профиль игрока FACEIT по нику: nickname, avatar, country, faceit_level, elo, games, winrate.
 */
export async function getFaceitPlayerByNickname(req: Request, res: Response) {
  const { nickname } = req.params;

  if (!nickname) {
    return res.status(404).json({ connected: false, message: 'nickname is required' });
  }

  if (!env.faceitApiKey) {
    return faceitNotConfigured(res);
  }

  try {
    const profile = await getFaceitProfileByNickname(nickname);

    if (!profile) {
      return res.status(404).json({
        connected: false,
        message: 'FACEIT profile not found',
      });
    }

    res.json({
      connected: true,
      provider: 'FACEIT',
      nickname: profile.player.nickname,
      avatar: profile.player.avatar,
      country: profile.player.country,
      faceit_level: profile.player.level,
      elo: profile.player.elo,
      games: profile.stats.matches,
      winrate: profile.stats.winRate,
    });
  } catch (err) {
    handleFaceitError(err, res, 'load FACEIT player');
  }
}

/**
 * GET /api/faceit/matches/:nickname
 * Последние матчи игрока: карта, дата, результат, команды, счёт, изменение ELO (если доступно).
 */
export async function getFaceitMatchesByNickname(req: Request, res: Response) {
  const { nickname } = req.params;

  if (!nickname) {
    return res.status(404).json({ connected: false, message: 'nickname is required' });
  }

  if (!env.faceitApiKey) {
    return faceitNotConfigured(res);
  }

  try {
    const profile = await getFaceitProfileByNickname(nickname);

    if (!profile) {
      return res.status(404).json({
        connected: false,
        message: 'FACEIT profile not found',
      });
    }

    res.json({
      connected: true,
      provider: 'FACEIT',
      matches: profile.matches,
    });
  } catch (err) {
    handleFaceitError(err, res, 'load FACEIT matches');
  }
}
