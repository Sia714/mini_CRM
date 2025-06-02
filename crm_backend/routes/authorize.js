const express = require("express");
const passport = require("passport");
const session = require("express-session");
const router = express.Router();
const { Strategy } = require("passport-google-oauth20");
const ensureLoggedIn = require("../middlewares/ensureLoggedIn");

// Serialize user to session
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

// Set up Google OAuth strategy
passport.use(
  new Strategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
    },
    (accessToken, refreshToken, profile, done) => {
      done(null, profile);
    }
  )
);

// Route to trigger login
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

// Callback URL Google redirects to
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/error",
    successRedirect: process.env.FRONTEND_URL, // or wherever
  })
);

router.get("/me", ensureLoggedIn, (req, res) => {
  const user = req.user;
  res.json({
    name: user.displayName,
    email: user.emails[0].value,
    photo: user.photos[0].value,
  });
});
router.get("/logout", (req, res) => {
  req.logout(() => {
    res.redirect(process.env.FRONTEND_URL);
  });
});

module.exports = router;
