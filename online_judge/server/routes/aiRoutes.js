import express from 'express';
import OpenAI from 'openai';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

router.post('/help', async (req, res) => {
  const { prompt, problemTitle, problemDescription } = req.body;

  const message = `
You are an AI companion helping a student understand a coding problem.

Problem Title: ${problemTitle}
Problem Description: ${problemDescription}
User's Question: ${prompt}

Respond in a friendly and helpful tone. Don't reveal the full code solution unless asked directly.
`;

  try {
    const response = await openai.chat.completions.create({
      messages: [{ role: 'user', content: message }],
      model: 'gpt-4o'
    });

    res.json({ response: response.choices[0].message.content });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'AI Companion failed to respond' });
  }
});

export default router;
