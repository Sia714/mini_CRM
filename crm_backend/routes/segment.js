const express = require("express");
const router = express.Router();
const Customer = require("../models/customer");
const mongoose = require("mongoose");
const axios = require("axios");
const Segment = require("../models/segment");
const CommunicationLog = require("../models/communicationLog");
const segment = require("../models/segment");

router.get("/getAllSegments", async (req, res) => {
  try {
    const segments = await Segment.find();
    res.json({ segments });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to compute audience" });
  }
});

function buildMongoQueryFromRules(rules) {
  const stack = [];
  let currentLogic = "$and"; // default logic
  let currentGroup = [];

  for (let rule of rules) {
    if (rule.logic) {
      // Push previous group to stack
      if (currentGroup.length > 0) {
        stack.push({ [currentLogic]: [...currentGroup] });
        currentGroup = [];
      }

      currentLogic = `$${rule.logic.toLowerCase()}`;
    } else {
      let val;
      if (rule.value === "true") val = true;
      else if (rule.value === "false") val = false;
      else if (!isNaN(Number(rule.value))) val = Number(rule.value);
      else val = rule.value;

      currentGroup.push({
        [rule.field]: {
          [`$${convertOp(rule.operator)}`]: val,
        },
      });
    }
  }

  // Push remaining group
  if (currentGroup.length > 0) {
    stack.push({ [currentLogic]: [...currentGroup] });
  }

  // Merge all groups with $and
  if (stack.length === 1) {
    return stack[0];
  } else {
    return { $and: stack };
  }
}

router.get("/preview", async (req, res) => {
  try {
    const rules = JSON.parse(decodeURIComponent(req.query.rules));
    const mongoQuery = buildMongoQueryFromRules(rules);
    const customers = await Customer.find(mongoQuery).limit(20); // or whatever your limit is
    res.json({ customers });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Preview fetch failed" });
  }
});

function convertOp(op) {
  return (
    {
      "<": "lt",
      "<=": "lte",
      ">": "gt",
      ">=": "gte",
      "=": "eq",
      "!=": "ne",
    }[op] || "eq"
  );
}

router.post("/", async (req, res) => {
  try {
    const rules = req.body.rules;
    if (!Array.isArray(rules)) {
      return res.status(400).json({ error: "Rules must be an array." });
    }
    const mongoQuery = buildMongoQueryFromRules(rules);
    const count = await Customer.countDocuments(mongoQuery);
    const newSegment = new Segment({
      segmentName: req.body.name, // you can modify this or take it from req.body
      createdBy: req.body.createdBy || null, // assuming you're adding auth later
      conditions: rules, // you can customize this structure
      previewCount: count,
    });

    await newSegment.save();
    res.json({ id: newSegment._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create segment" });
  }
});

router.get("/:segmentId", async (req, res) => {
  try {
    const { segmentId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(segmentId)) {
      return res.status(400).json({ error: "Invalid segmentId format" });
    }

    const reqCampaigns = await CommunicationLog.find({ segmentId })
      .sort({ createdAt: -1 }) // newest campaign first
      .lean();
    const seg = await segment.findById(segmentId);

    res.json({ segment: seg, campaigns: reqCampaigns });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/:segmentId/addCampaign", async (req, res) => {
  try {
    const { segmentId } = req.params;
    const { campaignObjective, createdBy, selectedMessage, messagesUsed } =
      req.body;

    // ✅ Validate and fetch segment
    const segment = await Segment.findById(segmentId);
    if (!segment) return res.status(404).json({ error: "Segment not found" });

    // ✅ Use segment conditions to filter customers
    const rules = segment.conditions;
    const mongoQuery = buildMongoQueryFromRules(rules);
    const customers = await Customer.find(mongoQuery);

    // 🛠️ Generate messages for matching customers only
    const messageStatus = customers.map((cust) => {
      const personalizedMessage = selectedMessage.replace(
        /\[NAME\]/g,
        cust.name || "friend"
      );

      return {
        customerId: cust._id,
        deliveryStatus: "PENDING",
        success: false,
        timestamp: new Date(),
        messageText: personalizedMessage,
      };
    });

    const sentCount = messageStatus.filter(
      (m) => m.deliveryStatus === "SENT"
    ).length;
    const failedCount = messageStatus.length - sentCount;

    const campaign = new CommunicationLog({
      segmentId,
      campaignObjective,
      createdBy,
      messagesUsed,
      sentCount,
      failedCount,
      messageSent: selectedMessage,
      previewCount: customers.length,
      messageStatus,
    });

    await campaign.save();

    // ✅ Trigger vendor API
    try {
      await axios.post("http://localhost:5000/vendor/send-message", {
        messages: messageStatus.map((msg) => ({
          customerId: msg.customerId,
          campaignId: campaign._id,
          messageText: msg.messageText,
        })),
      });
    } catch (err) {
      console.warn("Vendor API failed:", err.message);
      if (err.response) {
        console.warn("Response data:", err.response.data);
        console.warn("Status code:", err.response.status);
      } else if (err.request) {
        console.warn("No response received from vendor:", err.request);
      } else {
        console.warn("Axios config error:", err.message);
      }
    }

    res.status(201).json(campaign);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Failed to create campaign" });
  }
});

module.exports = router;
