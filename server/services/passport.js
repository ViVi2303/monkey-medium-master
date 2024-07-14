import env from "../config/env.js";
import passport from "passport";
import GoogleStrategy from "passport-google-oauth20";
GoogleStrategy.Strategy;

passport.use(
  new GoogleStrategy(
    {
      clientID: env.OAUTH_GOOGLE_CLIENT_ID,
      clientSecret: env.OAUTH_GOOGLE_CLIENT_SECRET,
      callbackURL: `${env.SERVER_HOST}:${env.SERVER_PORT}/${env.API_VERSION}/auth/google/callback`,
    },
    (accessToken, refreshToken, profile, done) => {
      try {
        const user = {
          fullname: profile._json.name,
          email: profile._json.email,
          avatar: profile._json.picture,
        };
        return done(null, user);
      } catch (error) {
        return done(err, null);
      }
    }
  )
);
