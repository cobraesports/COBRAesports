import { mockPlayer, Player } from '../data/mockPlayer';
import { apiUrl } from '../config/api';

export interface SteamPlayerProfile {
  steamId: string;
  nickname: string;
  avatar: string | null;
  profileUrl: string;
  onlineStatus: 'online' | 'offline';
  games: Array<{ appid: number; name: string; playtimeForeverHours: number; iconUrl: string | null }> | null;
  gamesAvailable: boolean;
  cs2: { appid: number; hoursPlayed: number | null };
}

/**
 * Профиль игрока COBRA ESPORTS (team-метаданные + live Steam-поля).
 * Steam live fields подставляются сервером, если STEAM_API_KEY настроен.
 */
export async function getAxoProfile(): Promise<Player> {
  try {
    const res = await fetch(apiUrl('/api/player/axo'), { credentials: 'include' });
    if (!res.ok) throw new Error('bad response');
    const data = await res.json();
    return { ...mockPlayer, ...data };
  } catch {
    return mockPlayer;
  }
}

/**
 * GET /api/player/:steamId — реальные данные напрямую из Steam Web API:
 * ник, аватар, ссылка на профиль, список игр и часы в CS2.
 * Возвращает null, если backend недоступен или STEAM_API_KEY не настроен —
 * вызывающий код должен показать состояние "нет данных", а не выдумывать значения.
 */
export async function getSteamPlayerProfile(steamId: string): Promise<SteamPlayerProfile | null> {
  try {
    const res = await fetch(apiUrl(`/api/player/${steamId}`), { credentials: 'include' });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}
