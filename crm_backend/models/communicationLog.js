const mongoose = require("mongoose");
const { Schema } = mongoose;
const { ObjectId } = mongoose.Schema.Types;

const campaignSchema = new Schema(
  {
    segmentId: { type: ObjectId, ref: "Segment" },
    campaignObjective: String,
    messagesUsed: [String], // array of AI-generated suggestions
    createdBy: { type: ObjectId, ref: "User" },
    sentCount: Number,
    failedCount: Number,
    previewCount: Number,
    messageStatus: [
      {
        customerId: ObjectId, // who was targeted
        deliveryStatus: { type: String, enum: ["SENT", "FAILED"] }, // simulated result
        success: { type: Boolean, default: false },
        timestamp: Date,
        messageText: String, // optional if you're sending unique ones
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("communicationLog", campaignSchema);
