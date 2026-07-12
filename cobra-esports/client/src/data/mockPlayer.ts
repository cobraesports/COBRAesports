export interface Player {
  id: string;
  steamId64: string;
  nickname: string;
  role: string;
  team: string;
  profileUrl: string;
  avatar: string | null;
  onlineStatus: 'online' | 'offline' | string;
  steamLevel: number | null;
  country: string;
  joinedTeam: string;
  // Реальные данные из Steam Web API (GET /api/player/:steamId), null пока не загрузились
  // или недоступны (нет STEAM_API_KEY / приватный профиль).
  cs2Hours: number | null;
  gamesCount: number | null;
}

export const mockPlayer: Player = {
  id: 'axo',
  steamId64: '76561199826590512',
  nickname: 'AXO',
  role: 'AWPer / Rifler',
  team: 'COBRA ESPORTS',
  profileUrl: 'https://steamcommunity.com/profiles/76561199826590512',
  avatar: null,
  onlineStatus: 'offline',
  steamLevel: 42,
  country: 'UA',
  joinedTeam: '2024-01-15',
  cs2Hours: null,
  gamesCount: null,
};
