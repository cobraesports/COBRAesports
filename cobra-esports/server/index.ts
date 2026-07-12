import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import session from 'express-session';
import passport from './config/passport';
import { env } from './config/env';

import authRoutes from './routes/auth';
import playerRoutes from './routes/player';
import statsRoutes from './routes/stats';
import faceitRoutes from './routes/faceit';

const app = express();

app.use(
  cors({
    origin: env.clientUrl,
    credentials: true,
  })
);
app.use(express.json());

app.use(
  session({
    secret: env.sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 дней
      httpOnly: true,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use('/api/auth', authRoutes);
app.use('/api/player', playerRoutes);

// Новая архитектура статистики CS2:
// GET /api/stats/:steamId   -> { player, performance }
// GET /api/matches/:steamId -> { matches }
app.use('/api', statsRoutes);

// Отдельный модуль FACEIT — независимый провайдер статистики, не связан со Steam.
// GET /api/faceit/:steamId -> { connected, provider: 'FACEIT', player, stats, matches }
app.use('/api/faceit', faceitRoutes);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'COBRA ESPORTS API' });
});

const port = Number(env.port);
app.listen(port, () => {
  console.log(`COBRA ESPORTS API запущен на http://localhost:${port}`);
});
