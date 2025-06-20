//routes/authorize.js
const express = require("express");
const passport = require("passport");
const session = require("express-session");
const router = express.Router();
const { Strategy } = require("passport-google-oauth20");

// Serialize user to session
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

// Set up Google OAuth strategy
console.log(
  "Using redirect URI:",
  `${process.env.BACKEND_URL}/auth/google/callback`
);
passport.use(
  new Strategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.BACKEND_URL}/auth/google/callback`,
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

router.get("/me", (req, res) => {
  console.log("SESSION:", req.session);
  res.json({
    loggedIn: req.isAuthenticated(),
    user: req.user || null,
    session: req.session,
  });
});
router.get("/logout", (req, res) => {
  req.logout(() => {
    res.redirect(process.env.FRONTEND_URL);
  });
});

module.exports = router;
