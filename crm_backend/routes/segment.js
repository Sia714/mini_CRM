const express = require("express");
const router = express.Router();
const Customer = require("../models/customer");
const mongoose = require("mongoose");
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

router.get("/", async (req, res) => {
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

router.post("/addSegment", async (req, res) => {
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
    const sortOptions = {
      createdAt: 1, // Ascending order for fieldName1
      // segmentName: -1, // Descending order for fieldName2
    };

    const reqCampaigns = await CommunicationLog.find({ segmentId })
      .populate("segmentId")
      .sort(sortOptions);
    const seg = await segment.findById(segmentId);

    res.json({ segment: seg, campaigns: reqCampaigns });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/:segmentId/addCampaign", async (req, res) => {
  try {
    const { segmentId, campaignObjective, createdBy } = req.body;

    // Validate segment exists
    const segment = await Segment.findById(segmentId);
    if (!segment) return res.status(404).json({ error: "Segment not found" });

    // Get customers for the segment — let's simulate by fetching customers matching conditions
    const customers = await Customer.find({});

    // Generate AI messages
    const messagesUsed = await generateAIMessages(campaignObjective);

    // Simulate message sending & delivery status for each customer
    const messageStatus = customers.map((cust) => {
      const deliveryStatus = simulateDeliveryStatus();
      return {
        customerId: cust._id,
        deliveryStatus,
        success: deliveryStatus === "SENT",
        timestamp: new Date(),
        messageText:
          messagesUsed[Math.floor(Math.random() * messagesUsed.length)],
      };
    });

    const sentCount = messageStatus.filter(
      (m) => m.deliveryStatus === "SENT"
    ).length;
    const failedCount = messageStatus.length - sentCount;

    // Save campaign
    const campaign = new Campaign({
      segmentId,
      campaignObjective,
      messagesUsed,
      createdBy,
      sentCount,
      failedCount,
      previewCount: 0,
      messageStatus,
    });

    await campaign.save();

    res.status(201).json(campaign);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
module.exports = router;
