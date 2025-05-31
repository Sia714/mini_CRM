const mongoose = require("mongoose");
const { Schema } = mongoose;

const customerSchema = new mongoose.Schema(
  {
    name: String,
    mobile: String,
    email: String,
    gender: String,
    fullAddress: String,
    lastVisited: Date,
    totalSpent: Number,
    visits: Number,
    totalOrders: Number,
    lastRating: Number,
    category: String,
    isActive: Boolean,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Customers", customerSchema);
