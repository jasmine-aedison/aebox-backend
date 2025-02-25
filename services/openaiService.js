const { OpenAI } = require("openai");
require("dotenv").config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Ensure this loads properly
  organization: "org-o0r0vcdw7pnnjrv0ndzZTi1K",
  project: "proj_TeqetxOCJeSRv5aGsvj77G2s",
});


const generateResponse = async (prompt) => {
  try {
    console.log("API Key:", process.env.OPENAI_API_KEY);
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error("OpenAI API Error:", error.response?.data || error.message);
    throw new Error("Check API Key & Permissions.");
  }
};

module.exports = { generateResponse };
