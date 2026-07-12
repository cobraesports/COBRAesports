const express = require('express');
const passport = require('passport');

const router = express.Router();

function ensureSteamConfigured(_req, res, next) {
  if (!process.env.STEAM_API_KEY) {
    return res.status(503).json({
      error: 'Steam login is not configured',
      message: 'Set STEAM_API_KEY in server/.env to enable Steam authentication.',
    });
  }
  return next();
}

router.get('/steam', ensureSteamConfigured, passport.authenticate('steam'));

router.get(
  '/steam/return',
  ensureSteamConfigured,
  passport.authenticate('steam', { failureRedirect: '/' }),
  (_req, res) => {
    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
    res.redirect(`${clientUrl}/`);
  }
);

router.get('/me', (req, res) => {
  if (req.user) {
    res.json({ authenticated: true, user: req.user });
  } else {
    res.json({ authenticated: false, user: null });
  }
});

router.post('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    req.session.destroy(() => {
      res.clearCookie('connect.sid');
      res.json({ success: true });
    });
  });
});

module.exports = router;
