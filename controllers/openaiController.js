const { generateResponse } = require("../services/openaiService");

const chatWithOpenAI = async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    const reply = await generateResponse(prompt);
    res.json({ reply });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { chatWithOpenAI };
