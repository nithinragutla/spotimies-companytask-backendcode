// services/aiService.js
const { GoogleGenAI } = require('@google/genai');
const dotenv = require('dotenv');
dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const getAIResponse = async (messages) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: messages,
    });
    return response.text;
  } catch (error) {
    console.error('Error fetching AI response:', error);
    throw new Error('Failed to get AI response');
  }
};

module.exports = { getAIResponse };
