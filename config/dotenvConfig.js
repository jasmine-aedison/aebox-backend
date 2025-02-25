require('dotenv').config();

module.exports = {
  openAiApiKey: process.env.OPENAI_API_KEY,
  port: process.env.PORT || 5000,
};
