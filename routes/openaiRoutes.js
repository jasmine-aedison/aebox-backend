const express = require("express");
const { chatWithOpenAI } = require("../controllers/openaiController");

const router = express.Router();

router.post("/chat", chatWithOpenAI);

module.exports = router;
