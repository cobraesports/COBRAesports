import { useEffect, useState } from 'react';
import { useTheme } from '../context/useTheme';
import { getAxoProfile, getSteamPlayerProfile } from '../api/player';
import { Player } from '../data/mockPlayer';
import PlayerCard from '../components/PlayerCard';
import LoadingSkeleton from '../components/LoadingSkeleton';

export default function PlayerPage() {
  const { isDark } = useTheme();
  const [player, setPlayer] = useState<Player | null>(null);

  useEffect(() => {
    getAxoProfile().then(async (base) => {
      setPlayer(base);
      // Дозагружаем реальные Steam-данные (список игр, часы в CS2) отдельным запросом,
      // чтобы карточка показалась сразу с team-метаданными, а часы/игры подтянулись следом.
      const steamData = await getSteamPlayerProfile(base.steamId64);
      if (steamData) {
        setPlayer((prev) =>
          prev
            ? {
                ...prev,
                nickname: steamData.nickname || prev.nickname,
                avatar: steamData.avatar || prev.avatar,
                profileUrl: steamData.profileUrl || prev.profileUrl,
                onlineStatus: steamData.onlineStatus,
                cs2Hours: steamData.cs2.hoursPlayed,
                gamesCount: steamData.games ? steamData.games.length : null,
              }
            : prev
        );
      }
    });
  }, []);

  return (
    <div className={`min-h-[70vh] py-16 px-6 ${isDark ? 'bg-cobra-black' : 'bg-cobra-bone'}`}>
      <div className="max-w-3xl mx-auto text-center mb-10">
        <h1 className={`font-display text-4xl font-bold mb-3 ${isDark ? 'text-white' : 'text-black'}`}>
          Профиль игрока
        </h1>
        <p className={isDark ? 'text-white/50' : 'text-black/50'}>
          Главная звезда состава COBRA ESPORTS
        </p>
      </div>

      {player ? <PlayerCard player={player} /> : <LoadingSkeleton className="h-96 w-full max-w-md mx-auto rounded-3xl" />}
    </div>
  );
}
