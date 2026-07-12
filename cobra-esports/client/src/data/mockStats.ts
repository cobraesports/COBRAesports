export interface StatSummary {
  hltvRating: number;
  kd: number;
  adr: number;
  kast: number;
  headshotPercent: number;
  winRate: number;
  matches: number;
  kills: number;
  deaths: number;
  assists: number;
  clutches: number;
  aces: number;
  mvp: number;
}

export interface MapStat {
  map: string;
  winRate: number;
  matches: number;
}

export interface WeaponStat {
  weapon: string;
  kills: number;
  accuracy: number;
}

export interface RatingPoint {
  match: number;
  rating: number;
}

export interface RadarPoint {
  stat: string;
  value: number;
}

export interface RecentMatch {
  opponent: string;
  map: string;
  result: 'W' | 'L';
  score: string;
  rating: number;
  date: string;
}

export interface ActivityItem {
  type: 'match' | 'achievement' | 'news';
  text: string;
  date: string;
}

export interface PlayerStats {
  summary: StatSummary;
  favoriteMaps: MapStat[];
  favoriteWeapons: WeaponStat[];
  ratingHistory: RatingPoint[];
  radar: RadarPoint[];
  recentMatches: RecentMatch[];
  recentActivity: ActivityItem[];
}

export const mockStats: PlayerStats = {
  summary: {
    hltvRating: 1.28,
    kd: 1.34,
    adr: 84.6,
    kast: 74.2,
    headshotPercent: 58,
    winRate: 63,
    matches: 214,
    kills: 4821,
    deaths: 3598,
    assists: 962,
    clutches: 187,
    aces: 12,
    mvp: 96,
  },
  favoriteMaps: [
    { map: 'Mirage', winRate: 71, matches: 48 },
    { map: 'Inferno', winRate: 64, matches: 39 },
    { map: 'Ancient', winRate: 60, matches: 33 },
    { map: 'Nuke', winRate: 55, matches: 27 },
    { map: 'Anubis', winRate: 58, matches: 22 },
  ],
  favoriteWeapons: [
    { weapon: 'AWP', kills: 1820, accuracy: 42 },
    { weapon: 'AK-47', kills: 1210, accuracy: 27 },
    { weapon: 'M4A1-S', kills: 640, accuracy: 25 },
    { weapon: 'Desert Eagle', kills: 310, accuracy: 19 },
  ],
  ratingHistory: [
    { match: 1, rating: 1.05 },
    { match: 2, rating: 1.12 },
    { match: 3, rating: 0.98 },
    { match: 4, rating: 1.31 },
    { match: 5, rating: 1.22 },
    { match: 6, rating: 1.45 },
    { match: 7, rating: 1.18 },
    { match: 8, rating: 1.36 },
    { match: 9, rating: 1.28 },
    { match: 10, rating: 1.52 },
  ],
  radar: [
    { stat: 'Aim', value: 88 },
    { stat: 'Positioning', value: 79 },
    { stat: 'Utility', value: 70 },
    { stat: 'Clutch', value: 84 },
    { stat: 'Consistency', value: 76 },
    { stat: 'Game Sense', value: 82 },
  ],
  recentMatches: [
    { opponent: 'Natus Vincere', map: 'Mirage', result: 'W', score: '16-12', rating: 1.42, date: '2026-06-28' },
    { opponent: 'FaZe Clan', map: 'Inferno', result: 'L', score: '13-16', rating: 0.91, date: '2026-06-24' },
    { opponent: 'Vitality', map: 'Ancient', result: 'W', score: '16-9', rating: 1.55, date: '2026-06-19' },
    { opponent: 'G2 Esports', map: 'Nuke', result: 'W', score: '16-14', rating: 1.18, date: '2026-06-14' },
    { opponent: 'MOUZ', map: 'Anubis', result: 'L', score: '10-16', rating: 0.85, date: '2026-06-09' },
  ],
  recentActivity: [
    { type: 'match', text: 'Победа над Natus Vincere на Mirage', date: '2026-06-28' },
    { type: 'achievement', text: 'Получил MVP матча против Vitality', date: '2026-06-19' },
    { type: 'news', text: 'AXO продлил контракт с COBRA ESPORTS', date: '2026-05-30' },
  ],
};
