const express = require('express');
const axoPlayer = require('../data/player');

const router = express.Router();

// GET /api/player/axo
router.get('/axo', async (_req, res) => {
  let liveData = {};

  const steamApiKey = process.env.STEAM_API_KEY;
  if (steamApiKey) {
    try {
      const url = `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${steamApiKey}&steamids=${axoPlayer.steamId64}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Steam API responded with ${response.status}`);
      }

      const json = await response.json();
      const player = json.response && Array.isArray(json.response.players)
        ? json.response.players[0]
        : null;

      if (player) {
        liveData = {
          avatar: player.avatarfull,
          nickname: player.personaname,
          profileUrl: player.profileurl,
          onlineStatus: player.personastate === 1 ? 'online' : 'offline',
        };
      }
    } catch (err) {
      console.error('[player] Steam profile fetch failed:', err.message);
    }
  }

  res.json({ ...axoPlayer, ...liveData });
});

module.exports = router;
