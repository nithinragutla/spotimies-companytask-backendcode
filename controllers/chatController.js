// controllers/chatController.js
const Conversation = require('../models/Conversation');
const FAQ = require('../models/FAQ');

// send message
exports.sendMessage = async (req, res) => {
  try {
    const { userId, message } = req.body;

    // ✅ Step 1: Try FAQ search
    const faqs = await FAQ.find(
      { $text: { $search: message } },
      { score: { $meta: "textScore" } }
    ).sort({ score: { $meta: "textScore" } });

    let botReply;
    if (faqs.length > 0) {
      botReply = faqs[0].answer;
    } else {
      // fallback regex
      const escapeRegex = (str) =>
        str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

      const words = message
        .split(" ")
        .map(w => w.trim())
        .filter(Boolean)
        .map(escapeRegex);

      const regexFaqs = await FAQ.find({
        $or: [
          { question: { $regex: words.join("|"), $options: "i" } },
          { answer: { $regex: words.join("|"), $options: "i" } }
        ]
      });

      botReply = regexFaqs.length > 0
        ? regexFaqs.map(f => f.answer).join("\n")
        : "I couldn't find relevant info in your resume/FAQ. Please try rephrasing your question.";
    }

    // ✅ save conversation
        let conversation = await Conversation.findOne({ userId });
    if (!conversation) {
      conversation = new Conversation({
        userId,
        messages: [
          { sender: "user", text: message },
          { sender: "bot", text: botReply }
        ]
      });
    } else {
      conversation.messages.push({ sender: "user", text: message });
      conversation.messages.push({ sender: "bot", text: botReply });
    }
    await conversation.save();

    res.json({ reply: botReply });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// get history
exports.getChatHistory = async (req, res) => {
  try {
    const { userId } = req.params;
    const conversation = await Conversation.findOne({ userId });
    if (!conversation) return res.json({ messages: [] });
    res.json(conversation.messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch history" });
  }
};

