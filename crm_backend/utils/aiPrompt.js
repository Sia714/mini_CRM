// utils/aiPrompt.js

function aiPrompt(conditions = []) {
  return `
Generate 4 short, catchy, and engaging promotional messages for a marketing campaign. 

🧠 Goal: Re-engage customers and bring them back.
🎯 Rules:
- Messages should be personalized with placeholders like [NAME]
- Be creative and avoid repeating the same structure
- Do NOT include hardcoded offers; keep messages generic but impactful
- If some customer details are missing (like lastVisited or averageRating), ignore them
- Keep it within 1-2 lines per message
- and sometimes add a small discount.

🧾 Customer Conditions:
${JSON.stringify(conditions, null, 2)}

💬 Output format:
[
  "Hi [NAME], we miss you! Come check out what's new 😍",
  ...
]
  `.trim();
}

module.exports = aiPrompt;
