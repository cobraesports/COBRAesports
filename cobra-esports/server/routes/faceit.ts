import { Router } from 'express';
import { getFaceitStats, getFaceitPlayerByNickname, getFaceitMatchesByNickname } from '../controllers/faceitController';

const router = Router();

// GET /api/faceit/player/:nickname -> профиль FACEIT по нику (avatar, level, elo, winrate, games)
router.get('/player/:nickname', getFaceitPlayerByNickname);

// GET /api/faceit/matches/:nickname -> последние матчи FACEIT по нику
router.get('/matches/:nickname', getFaceitMatchesByNickname);

// GET /api/faceit/:steamId -> поиск FACEIT-профиля по SteamID64 (для связки со Steam-профилем)
router.get('/:steamId', getFaceitStats);

export default router;
