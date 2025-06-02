const express = require("express");
const router = express.Router();
const Customer = require("../models/customer");
const Order = require("../models/order");

router.post("/addCustomer", async (req, res) => {
  const data = req.body;
  try {
    // Create a new instance of the model with data
    const customer = new Customer({
      name: data.name,
      mobile: data.mobile,
      gender: data.gender,
      email: data.email,
      fullAddress: data.fullAddress,
      lastVisited: data.lastVisited,
      visits: data.visits,
      totalOrders: data.totalOrders,
      totalSpent: data.totalSpent,
      lastRating: data.lastRating,
      category: data.category,
      isActive: data.isActive,
    });

    await customer.save();

    // Send back success response
    res.status(201).json({ message: "Customer added successfully", customer });
  } catch (err) {
    console.error("❌ Registration error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/search", async (req, res) => {
  const query = req.query.query;
  try {
    console.log("Query:", req.query.query);
    const customers = await Customer.find({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { mobile: { $regex: query } },
      ],
    })
      .limit(10)
      .select("name mobile _id");

    res.json(customers);
  } catch (err) {
    console.error("Error searching customers:", err);
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/addOrder", async (req, res) => {
  const data = req.body;
  try {
    // Create a new instance of the model with data
    const order = new Order({
      product: data.product,
      customerId: data.customerId,
      orderedOn: data.orderedOn,
      price: data.price,
      rating: data.rating,
      category: data.category,
    });

    await order.save();

    const customer = await Customer.findById(data.customerId);
    const newLastVisited =
      new Date(data.orderedOn) > new Date(customer.lastVisited || 0)
        ? data.orderedOn
        : customer.lastVisited;
    const newLastRating = data.rating ?? customer.lastRating;

    await Customer.findByIdAndUpdate(data.customerId, {
      $set: {
        lastVisited: newLastVisited,
        lastRating: newLastRating,
      },
      $inc: { totalOrders: 1, totalSpent: data.price },
    });
    // Send back success response
    res.status(201).json({ message: "Order added successfully", customer });
  } catch (err) {
    console.error("❌ error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
