//routes/ai
const axios = require("axios");
const express = require("express");
const router = express.Router();
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const ensureLoggedIn = require("../middlewares/ensureLoggedIn");
const aiPrompt = require("../utils/aiPrompt");
router.use(ensureLoggedIn);

router.post("/chat", async (req, res) => {
  try {
    const conditions = req.body.conditions;

    // Ask OpenRouter for multiple completions
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: aiPrompt(conditions) }],
        n: 4, // <--- ask for 4 message variations
      },
      {
        headers: {
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const replies = response.data.choices.map(
      (choice) => choice.message.content
    );

    res.json({ replies }); // send all 4 messages
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: "Failed to get response from OpenRouter" });
  }
});

module.exports = router;
