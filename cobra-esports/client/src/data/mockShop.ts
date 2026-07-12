export interface ShopItem {
  id: string;
  name: string;
  category: 'Jersey' | 'Mousepad' | 'Sticker';
  price: number;
  description: string;
}

export const mockShop: ShopItem[] = [
  {
    id: 's1',
    name: 'COBRA ESPORTS Pro Jersey 2026',
    category: 'Jersey',
    price: 59.99,
    description: 'Официальное игровое джерси команды, дышащая ткань, вышитый логотип.',
  },
  {
    id: 's2',
    name: 'COBRA ESPORTS XL Mousepad',
    category: 'Mousepad',
    price: 24.99,
    description: 'Коврик 900x400мм с принтом логотипа кобры, прошитые края.',
  },
  {
    id: 's3',
    name: 'AXO Player Sticker Pack',
    category: 'Sticker',
    price: 6.99,
    description: 'Набор виниловых стикеров с автографом и логотипом AXO.',
  },
  {
    id: 's4',
    name: 'COBRA ESPORTS Away Jersey',
    category: 'Jersey',
    price: 54.99,
    description: 'Альтернативная расцветка джерси в светлой теме бренда.',
  },
];
