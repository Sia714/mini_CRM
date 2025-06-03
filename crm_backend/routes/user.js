const express = require("express");
const router = express.Router();
const Customer = require("../models/customer");
const Order = require("../models/order");
const Segment = require("../models/segment");
const Campaign = require("../models/communicationLog");

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

// GET all customers
router.get("/customers", async (req, res) => {
  const data = await Customer.find();
  res.json(data);
});

// POST a new customer
router.post("/customers", async (req, res) => {
  const created = await Customer.create(req.body);
  res.json(created);
});

// GET all orders
router.get("/orders", async (req, res) => {
  try {
    const data = await Order.find().populate("customerId", "name"); // 👈 just name
    res.json(data);
  } catch (err) {
    console.error("Error fetching orders:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// POST a new order
router.post("/orders", async (req, res) => {
  const created = await Order.create(req.body);
  res.json(created);
});

// GET all segments
router.get("/segments", async (req, res) => {
  const data = await Segment.find();
  res.json(data);
});

// POST a new segment
router.post("/segments", async (req, res) => {
  const created = await Segment.create(req.body);
  res.json(created);
});

// GET all campaigns
router.get("/campaigns", async (req, res) => {
  const data = await Campaign.find()
    .populate("segmentId")
    .populate("messageStatus.customerId");
  res.json(data);
});

// POST a new campaign
router.post("/campaigns", async (req, res) => {
  const created = await Campaign.create(req.body);
  res.json(created);
});

module.exports = router;
