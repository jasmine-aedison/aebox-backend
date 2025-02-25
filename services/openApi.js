
const OpenAI = require("openai");
const openai = new OpenAI({
  apiKey: "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",
});

const completion = openai.chat.completions.create({
  model: "gpt-4o-mini",
  store: true,
  messages: [
    {"role": "user", "content": "write a haiku about ai"},
  ],
});

completion.then((result) => console.log(result.choices[0].message));