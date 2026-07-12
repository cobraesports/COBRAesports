const passport = require('passport');
const SteamStrategy = require('passport-steam').Strategy;

const STEAM_API_KEY = process.env.STEAM_API_KEY;

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});

if (STEAM_API_KEY) {
  passport.use(
    new SteamStrategy(
      {
        returnURL: process.env.STEAM_RETURN_URL || 'http://localhost:5000/api/auth/steam/return',
        realm: process.env.STEAM_REALM || 'http://localhost:5000/',
        apiKey: STEAM_API_KEY,
      },
      (_identifier, profile, done) => {
        const user = {
          steamId: profile._json.steamid,
          nickname: profile._json.personaname,
          avatar: profile._json.avatarfull,
          profileUrl: profile._json.profileurl,
          onlineState: profile._json.personastate,
        };
        return done(null, user);
      }
    )
  );
}

module.exports = passport;
