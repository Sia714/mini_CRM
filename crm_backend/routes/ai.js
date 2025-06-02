//routes/ai
const axios = require("axios");
const express = require("express");
const router = express.Router();
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const aiPrompt = require("../utils/aiPrompt");

router.post("/chat", async (req, res) => {
  try {
    const conditions = req.body.conditions;

    // Ask OpenRouter for multiple completions
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: aiPrompt(conditions) }],
        n: 4,
      },
      {
        headers: {
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    let replies = [];

    if (response.data.choices.length === 1) {
      // Handle single reply that contains a JSON array string
      const raw = response.data.choices[0].message.content;
      try {
        replies = JSON.parse(raw); // ✅ Now it's an actual string array
      } catch (err) {
        console.error("Failed to parse AI response as JSON array:", err);
        replies = [raw]; // fallback: treat as one message
      }
    } else {
      // Multiple completions case
      replies = response.data.choices.map((choice) => choice.message.content);
    }

    res.json({ replies }); // send all 4 messages
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: "Failed to get response from OpenRouter" });
  }
});

module.exports = router;
