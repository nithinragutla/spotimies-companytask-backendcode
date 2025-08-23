const Conversation = require('../models/Conversation');
const FAQ = require('../models/FAQ');
const { getAIResponse } = require('../services/aiService');
const { similarity } = require('../utils/similarity');

exports.sendMessage = async (req, res) => {
  console.log("📩 sendMessage API called with body:", req.body);

  try {
    const { userId, message } = req.body;

    const faqs = await FAQ.find();
    let bestMatch = null;
    let highestScore = 0;

    faqs.forEach(faq => {
      const cleanText = str => str.toLowerCase().trim();
      const score = similarity(cleanText(message), cleanText(faq.question));
      if (score > highestScore) {
        highestScore = score;
        bestMatch = faq;
      }
    });

    let botReply;

    if (bestMatch && highestScore >= 0.85) {
  botReply = bestMatch.answer.trim();  // clean up spaces
} else {
  botReply = await getAIResponse([message]);
}


    let conversation = await Conversation.findOne({ userId });
    if (!conversation) {
      conversation = new Conversation({ userId, messages: [] });
    }

    conversation.messages.push({ sender: 'user', text: message });
    conversation.messages.push({ sender: 'bot', text: botReply });

    await conversation.save();

    res.json({ reply: botReply });
  } catch (err) {
    console.error("❌ Error in sendMessage:", err);
    res.status(500).json({ error: err.message });
  }
};


// 📜 Get chat history
exports.getHistory = async (req, res) => {
  try {
    const { userId } = req.params;
    const conversation = await Conversation.findOne({ userId });
    res.json(conversation ? conversation.messages : []);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
