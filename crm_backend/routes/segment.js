const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Customer = require("../models/customer");
const Segment = require("../models/segment");

router.get("/preview", async (req, res) => {
  const rules = JSON.parse(req.query.rules);
  try {
    let mongoQuery = {};
    let tempGroup = [];

    for (let rule of rules) {
      if (rule.logic) {
        if (tempGroup.length > 0) {
          mongoQuery = { [`$${rule.logic.toLowerCase()}`]: [...tempGroup] };
          tempGroup = [];
        }
      } else {
        tempGroup.push({
          [rule.field]: {
            [`$${convertOp(rule.operator)}`]: parseFloat(rule.value),
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
    const customers = await Customer.find(mongoQuery).limit(10);
    res.json({ customers });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to compute audience" });
  }
});

function convertOp(op) {
  return (
    {
      "<": "lt",
      "<=": "lte",
      ">": "gt",
      ">=": "gte",
      "==": "eq",
    }[op] || "eq"
  );
}
router.post("/addSegment", async (req, res) => {
  const rules = req.body.rules; // you're sending { rules: [...] }

  try {
    let mongoQuery = {};
    let tempGroup = [];

    for (let rule of rules) {
      if (rule.logic) {
        if (tempGroup.length > 0) {
          mongoQuery = { [`$${rule.logic.toLowerCase()}`]: [...tempGroup] };
          tempGroup = [];
        }
      } else {
        tempGroup.push({
          [rule.field]: {
            [`$${convertOp(rule.operator)}`]: parseFloat(rule.value),
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
    const count = await Customer.countDocuments(mongoQuery);

    // Save to database
    const newSegment = new Segment({
      segmentName: req.name, // you can modify this or take it from req.body
      createdBy: req.user?._id || null, // assuming you're adding auth later
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

module.exports = router;
