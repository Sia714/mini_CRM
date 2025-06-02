const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const passport = require("passport");
const session = require("express-session");
const ensureLoggedIn = require("./middlewares/ensureLoggedIn");
const axios = require("axios");
const app = express();
dotenv.config();

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173", // your React frontend URL
    credentials: true,
  })
);

app.use(
  session({
    secret: process.env.SESSION_SECRET || "your_secret_key", // move to .env
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("ERROR:", err));

app.use("/auth", require("./routes/authorize"));
// app.use(ensureLoggedIn);
app.use("/vendor", require("./routes/vendor"));
app.use("/ai", require("./routes/ai"));
app.use("/customer", require("./routes/customer"));
app.use("/segment", require("./routes/segment"));
app.use("/user", require("./routes/user"));

app.listen(5000, () => console.log("Server running on port 5000"));
