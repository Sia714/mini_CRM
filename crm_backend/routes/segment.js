const express = require("express");
const router = express.Router();
const Customer = require("../models/customer");
const mongoose = require("mongoose");
const axios = require("axios");
const Segment = require("../models/segment");
const CommunicationLog = require("../models/communicationLog");
const ensureLoggedIn = require("../middlewares/ensureLoggedIn");
const segment = require("../models/segment");

// router.use(ensureLoggedIn);

router.get("/debug", (req, res) => {
  res.json({
    loggedIn: req.isAuthenticated(),
    user: req.user || null,
    session: req.session,
  });
});

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
  let mongoQuery = {};
  let tempGroup = [];

  for (let rule of rules) {
    if (rule.logic) {
      if (tempGroup.length > 0) {
        mongoQuery = { [`$${rule.logic.toLowerCase()}`]: [...tempGroup] };
        tempGroup = [];
      }
    } else {
      let val;

      if (rule.value === "true") val = true;
      else if (rule.value === "false") val = false;
      else if (!isNaN(Number(rule.value))) val = Number(rule.value);
      else val = rule.value;

      tempGroup.push({
        [rule.field]: {
          [`$${convertOp(rule.operator)}`]: val,
        },
      });
    }
  }

  if (
    (!mongoQuery || Object.keys(mongoQuery).length === 0) &&
    tempGroup.length
  ) {
    mongoQuery = { $and: tempGroup };
  }

  return mongoQuery;
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

router.post("/:segmentId/", async (req, res) => {
  try {
    const { segmentId } = req.params;
    const { campaignObjective, createdBy, selectedMessage, messagesUsed } =
      req.body;

    // Validate segment exists
    const segment = await Segment.findById(segmentId);
    if (!segment) return res.status(404).json({ error: "Segment not found" });

    // Get customers for the segment — simulate this for now (you can later filter)
    const customers = await Customer.find({}); // Or match actual segment logic

    // Simulate delivery per customer
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
        messageText: personalizedMessage, // what user picked from AI options
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
      messagesUsed, // all 4 suggestions
      sentCount,
      failedCount,
      previewCount: 0,
      messageStatus,
    });
    console.log("REQ.BODY:", req.body);
    console.log("selectedMessage:", selectedMessage);
    await campaign.save();

    try {
      await axios.post("http://localhost:5000/vendor/send-message", {
        messages: messageStatus.map((msg) => ({
          customerId: msg.customerId,
          campaignId: campaign._id, // this line matters!
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
