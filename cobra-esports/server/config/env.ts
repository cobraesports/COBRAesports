export const env = {
  port: process.env.PORT || '5000',
  sessionSecret: process.env.SESSION_SECRET || 'change_me_to_a_random_string',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',

  steamApiKey: process.env.STEAM_API_KEY || '',
  steamReturnUrl: process.env.STEAM_RETURN_URL || 'http://localhost:5000/api/auth/steam/return',
  steamRealm: process.env.STEAM_REALM || 'http://localhost:5000/',

  cs2StatsApiUrl: process.env.CS2_STATS_API_URL || '',
  cs2StatsApiKey: process.env.CS2_STATS_API_KEY || '',

  // FACEIT Data API — полностью отдельный источник данных, не связан со Steam.
  faceitApiUrl: process.env.FACEIT_API_URL || 'https://open.faceit.com/data/v4',
  faceitApiKey: process.env.FACEIT_API_KEY || '',
};

if (!env.steamApiKey) {
  console.info(
    '[config] STEAM_API_KEY is not set; /api/auth/steam returns 503, and ' +
      '/api/player/:steamId, /api/stats/:steamId will return 503 / statsPublic=false ' +
      'instead of real Steam data until it is configured.'
  );
}

if (!env.cs2StatsApiUrl) {
  console.info(
    '[config] CS2_STATS_API_URL is not set; match history (/api/matches/:steamId) and rating history ' +
      'return empty arrays — no third-party match provider connected. Core CS2 stats still come live from Steam.'
  );
}

if (!env.faceitApiKey) {
  console.info('[config] FACEIT_API_KEY is not set; /api/faceit/:steamId returns 503 until it is configured.');
}
