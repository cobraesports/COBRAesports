export interface UpcomingMatch {
  id: string;
  opponent: string;
  tournament: string;
  date: string;
  format: string;
}

export interface PastMatch {
  id: string;
  opponent: string;
  result: 'W' | 'L';
  score: string;
  date: string;
  map: string;
}

export interface TournamentResult {
  id: string;
  tournament: string;
  placement: string;
  date: string;
  prize: string;
}

export const upcomingMatches: UpcomingMatch[] = [
  { id: 'u1', opponent: 'Astralis', tournament: 'ESL Pro League', date: '2026-07-14', format: 'BO3' },
  { id: 'u2', opponent: 'Cloud9', tournament: 'BLAST Premier', date: '2026-07-21', format: 'BO1' },
  { id: 'u3', opponent: 'Heroic', tournament: 'IEM Cologne Qualifier', date: '2026-07-29', format: 'BO3' },
];

export const pastMatches: PastMatch[] = [
  { id: 'p1', opponent: 'Natus Vincere', result: 'W', score: '16-12', date: '2026-06-28', map: 'Mirage' },
  { id: 'p2', opponent: 'FaZe Clan', result: 'L', score: '13-16', date: '2026-06-24', map: 'Inferno' },
  { id: 'p3', opponent: 'Vitality', result: 'W', score: '16-9', date: '2026-06-19', map: 'Ancient' },
  { id: 'p4', opponent: 'G2 Esports', result: 'W', score: '16-14', date: '2026-06-14', map: 'Nuke' },
  { id: 'p5', opponent: 'MOUZ', result: 'L', score: '10-16', date: '2026-06-09', map: 'Anubis' },
];

export const tournamentResults: TournamentResult[] = [
  { id: 't1', tournament: 'IEM Katowice 2026', placement: '3-4 место', date: '2026-02', prize: '$50,000' },
  { id: 't2', tournament: 'ESL Pro League Season 21', placement: '1 место', date: '2026-04', prize: '$100,000' },
  { id: 't3', tournament: 'BLAST Spring Finals', placement: '2 место', date: '2026-05', prize: '$40,000' },
];
