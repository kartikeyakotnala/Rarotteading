const express = require('express');
const bodyParser = require('body-parser');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.static('public'));

const apiKey = JSON.parse(fs.readFileSync('./google-ai-studio-api-key.json', 'utf8')).api_key;
const genAI = new GoogleGenerativeAI(apiKey);

app.post('/get-insight', async (req, res) => {
  const { question, cards } = req.body;
  const cardNames = cards.map(card => card.replace('.jpg', '').replace(/-/g, ' ')).join(', ');

  const prompt = `As an expert tarot reader, provide a concise and compelling interpretation for the following question: "${question}". The drawn cards are: ${cardNames}.`;

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    const result = await model.generateContent(prompt);
    const insight = result.response.text();
    res.json({ insight });
  } catch (error) {
    console.error('Error generating insight:', error);
    res.status(500).json({ insight: 'An error occurred while generating the insight.' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
