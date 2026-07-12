export interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  category: 'Team' | 'Match' | 'Announcement';
}

export const mockNews: NewsItem[] = [
  {
    id: 'n1',
    title: 'AXO продлевает контракт с COBRA ESPORTS',
    excerpt: 'Звёздный AWPer остаётся в составе организации ещё на два года после успешного сезона.',
    date: '2026-05-30',
    category: 'Announcement',
  },
  {
    id: 'n2',
    title: 'COBRA ESPORTS выходит в плей-офф турнира',
    excerpt: 'Уверенная победа над MOUZ выводит команду в верхнюю сетку главного этапа.',
    date: '2026-06-14',
    category: 'Match',
  },
  {
    id: 'n3',
    title: 'Новый буткемп-центр для состава',
    excerpt: 'Организация открывает собственную тренировочную базу для подготовки к новому сезону.',
    date: '2026-06-20',
    category: 'Team',
  },
  {
    id: 'n4',
    title: 'Анонс нового мерча COBRA ESPORTS',
    excerpt: 'В магазине появится лимитированная коллекция джерси и аксессуаров.',
    date: '2026-06-25',
    category: 'Announcement',
  },
];
