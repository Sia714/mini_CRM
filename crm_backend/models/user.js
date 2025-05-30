const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new mongoose.Schema(
  {
    googleId: String,
    name: String,
    fullAddress: String,
    email: String,
    role: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
