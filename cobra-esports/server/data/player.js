// Базовые данные об игроке AXO. Если пользователь залогинен через Steam,
// его реальные Steam-поля (avatar/nickname/profileUrl/onlineState) подставляются поверх.
module.exports = {
  id: 'axo',
  steamId64: '76561199826590512',
  nickname: 'AXO',
  role: 'AWPer / Rifler',
  team: 'COBRA ESPORTS',
  profileUrl: `https://steamcommunity.com/profiles/76561199826590512`,
  avatar: null, // подставится реальный Steam avatar после логина, иначе fallback на фронте
  onlineStatus: 'offline',
  steamLevel: null,
  country: 'UA',
  joinedTeam: '2024-01-15',
};
