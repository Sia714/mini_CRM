const mongoose = require("mongoose");
const { Schema } = mongoose;
const { ObjectId } = mongoose.Schema.Types;

const campaignSchema = new Schema(
  {
    segmentId: { type: ObjectId, ref: "Segment" },
    campaignObjective: String,
    messagesUsed: [String], // array of AI-generated suggestions
    createdBy: String,
    sentCount: Number,
    failedCount: Number,
    previewCount: Number,
    messageSent: String,
    messageStatus: [
      {
        campaignId: { type: ObjectId, ref: "communicationLogs" },
        customerId: { type: ObjectId, ref: "Customers" }, // who was targeted
        deliveryStatus: { type: String, enum: ["SENT", "FAILED", "PENDING"] }, // simulated result
        success: { type: Boolean, default: false },
        timestamp: Date,
        messageText: String, // optional if you're sending unique ones
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("communicationLogs", campaignSchema);
