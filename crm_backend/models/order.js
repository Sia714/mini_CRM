const mongoose = require("mongoose");
const { Schema } = mongoose;
const { ObjectId } = mongoose.Schema.Types;

const orderSchema = new mongoose.Schema({
  product: { type: String },
  customerId: { type: ObjectId, ref: "Customers" },
  orderedOn: Date,
  price: Number,
  rating: Number,
  category: String,
});

module.exports = mongoose.model("Orders", orderSchema);
