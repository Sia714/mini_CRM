const express = require("express");
const communicationLog = require("../models/communicationLog");
const Segment = require("../models/segment");
const router = express.Router();

router.get("/activity", async (req, res) => {
  try {
    const user = req.user; // assuming OAuth middleware sets this

    if (!user) return res.status(401).json({ error: "Unauthorized" });

    const [campaigns, segments] = await Promise.all([
      communicationLog.find({ createdBy: user.emails[0]?.value }),
      Segment.find({ createdBy: user.emails[0]?.value }),
    ]);

    res.json({
      user,
      campaigns,
      segments,
    });
  } catch (err) {
    console.error("Activity fetch error:", err);
    res.status(500).json({ error: "Server Error" });
  }
});
module.exports = router;
