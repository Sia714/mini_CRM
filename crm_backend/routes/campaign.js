const express = require("express");
const router = express.Router();
const communicationLog = require("../models/communicationLog");
const Customer = require("../models/customer");
const Segment = require("../models/segment");


router.get("/:segmentId", async (req, res) => {
  const segmentId = req.query;
  try {
    
    const campaigns = await communicationLog.find(._id:segmentId);
    const segmentName = await Segment.findById(segmentId);

    res.json({ name:segmentName, campaigns });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to compute audience" });
  }
});
