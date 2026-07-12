import { Router } from 'express';
import { getStats, getMatches, getPlayerProfile } from '../controllers/statsController';

const router = Router();

// GET /api/player/:steamId -> реальный Steam-профиль + список игр + CS2 часы
router.get('/player/:steamId', getPlayerProfile);

// GET /api/stats/:steamId
router.get('/stats/:steamId', getStats);

// GET /api/matches/:steamId
router.get('/matches/:steamId', getMatches);

export default router;
