// routes/vendor.js
const express = require("express");
const router = express.Router();
const axios = require("axios");
const Campaign = require("../models/communicationLog");

// Helper: 90% success simulation
function simulateDeliveryStatus() {
  return Math.random() < 0.9 ? "SENT" : "FAILED";
}

// POST /send-message – INSTANT delivery
router.post("/send-message", async (req, res) => {
  const { messages } = req.body;

  if (!Array.isArray(messages)) {
    return res.status(400).json({ error: "messages must be an array" });
  }

  try {
    // Send all messages instantly
    await Promise.all(
      messages.map(async (msg) => {
        const status = simulateDeliveryStatus();

        await axios.post(`${BACKEND_URL}/vendor/delivery-receipt`, {
          customerId: msg.customerId,
          campaignId: msg.campaignId,
          status,
          messageText: msg.messageText,
        });
      })
    );

    res.json({ success: true, message: "All deliveries processed instantly" });
  } catch (err) {
    console.error("Instant delivery failed:", err.message);
    res
      .status(500)
      .json({ error: "Something went wrong during instant delivery" });
  }
});

// POST /delivery-receipt
router.post("/delivery-receipt", async (req, res) => {
  const { campaignId, customerId, status, messageText } = req.body;

  if (!campaignId || !customerId || !status) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const campaign = await Campaign.findById(campaignId);
    if (!campaign) {
      return res.status(404).json({ error: "Campaign not found" });
    }

    const msg = campaign.messageStatus.find(
      (m) => m.customerId.toString() === customerId
    );

    if (!msg) {
      return res.status(404).json({ error: "Customer not found in campaign" });
    }

    msg.deliveryStatus = status;
    msg.success = status === "SENT";
    msg.timestamp = new Date();
    if (messageText) msg.messageText = messageText;
    campaign.sentCount = campaign.messageStatus.filter(
      (m) => m.deliveryStatus === "SENT"
    ).length;
    campaign.failedCount = campaign.messageStatus.filter(
      (m) => m.deliveryStatus === "FAILED"
    ).length;
    campaign.previewCount = campaign.messageStatus.length;
    await campaign.save();
    await campaign.save();

    res.status(200).json({ message: "Delivery status updated successfully" });
  } catch (err) {
    console.error("Receipt Error:", err.message);
    res.status(500).json({ error: "Something went wrong" });
  }
});

module.exports = router;
