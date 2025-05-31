const mongoose = require("mongoose");
const { Schema } = mongoose;
const { ObjectId } = mongoose.Schema.Types;

const segmentSchema = new mongoose.Schema(
  {
    segmentName: String,
    createdBy: { type: ObjectId, ref: "User" },
    conditions: [
      {
        visits: Number,
        lastVisited: Date,
        totalSpent: Number,
        averageRating: Number,
        lastRating: Number,
        mostInterested: String,
      },
    ],
    previewCount: Number,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Segments", segmentSchema);
