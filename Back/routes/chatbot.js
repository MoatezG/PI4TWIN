const express = require('express');
const router = express.Router();
const Provider = require('../models/Provider');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post('/', async (req, res) => {
  const { question, providerId } = req.body;
  if (!question || !providerId) return res.status(400).json({ error: 'Missing question or providerId' });

  try {
    // Fetch provider info
    const provider = await Provider.findById(providerId).lean();
    if (!provider) return res.status(404).json({ error: 'Provider not found' });

    // Compose prompt
    const prompt = `
You are an assistant for a food provider platform. Answer user questions about this provider, their services, or policies.
Provider Info:
Name: ${provider.businessName}
Location: ${provider.location}
Categories: ${provider.categories.join(', ')}
Policies: ${provider.policies || 'N/A'}
Other Info: ${provider.description || 'N/A'}

User question: ${question}
`;

    // Call Gemini (Google Generative AI)
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent(prompt);
    const aiAnswer = result.response.text().trim();

    res.json({ answer: aiAnswer });

  } catch (err) {
    console.error('Chatbot error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;