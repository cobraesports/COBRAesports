// Тонкая обёртка над сервисом, как того требует архитектура services/ + api/.
export {
  fetchPlayerStats,
  fetchPlayerMatches,
  type LivePlayerStats,
  type PerformancePoint,
  type MatchItem,
} from '../services/cs2StatsService';
