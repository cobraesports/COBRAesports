// Клиентские обёртки над отдельными FACEIT-роутами backend'а.
// Ключ FACEIT_API_KEY здесь никогда не фигурирует — он живёт только в server/.env
// и используется исключительно на backend (server/services/faceitService.ts).
import { apiUrl } from '../config/api';

export interface FaceitPlayerResponse {
  connected: boolean;
  provider?: 'FACEIT';
  message?: string;
  nickname?: string;
  avatar?: string;
  country?: string;
  faceit_level?: number;
  elo?: number;
  games?: number;
  winrate?: number | null;
}

export interface FaceitMatch {
  matchId: string;
  map: string | null;
  result: 'W' | 'L' | null;
  score: string | null;
  date: string | null;
  competition: string | null;
  teams: { faction1: string | null; faction2: string | null };
  eloChange: number | null;
}

export interface FaceitMatchesResponse {
  connected: boolean;
  provider?: 'FACEIT';
  message?: string;
  matches?: FaceitMatch[];
}

/**
 * GET /api/faceit/player/:nickname
 * connected:false — не ошибка сети, а состояние (нет ключа на сервере / профиль не найден /
 * FACEIT недоступен). UI должен показать message пользователю, не падая.
 */
export async function getFaceitPlayer(nickname: string): Promise<FaceitPlayerResponse> {
  try {
    const res = await fetch(apiUrl(`/api/faceit/player/${encodeURIComponent(nickname)}`), { credentials: 'include' });
    return await res.json();
  } catch {
    return { connected: false, message: 'Не удалось связаться с сервером' };
  }
}

/**
 * GET /api/faceit/matches/:nickname
 */
export async function getFaceitMatches(nickname: string): Promise<FaceitMatchesResponse> {
  try {
    const res = await fetch(apiUrl(`/api/faceit/matches/${encodeURIComponent(nickname)}`), { credentials: 'include' });
    return await res.json();
  } catch {
    return { connected: false, message: 'Не удалось связаться с сервером' };
  }
}
