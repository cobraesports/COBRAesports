export interface TeamMember {
  id: string;
  nickname: string;
  role: string;
  status: 'active' | 'coming-soon';
}

export const mockTeam: TeamMember[] = [
  { id: 'axo', nickname: 'AXO', role: 'AWPer / Rifler', status: 'active' },
  { id: 'slot-2', nickname: 'Coming Soon', role: 'Entry Fragger', status: 'coming-soon' },
  { id: 'slot-3', nickname: 'Coming Soon', role: 'IGL', status: 'coming-soon' },
  { id: 'slot-4', nickname: 'Coming Soon', role: 'Support', status: 'coming-soon' },
  { id: 'slot-5', nickname: 'Coming Soon', role: 'Lurker', status: 'coming-soon' },
];
