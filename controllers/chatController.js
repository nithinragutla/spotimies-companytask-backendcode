const Conversation = require("../models/conversation");
const FAQ = require("../models/FAQ");

// Send message and get response
// ✅ put this at the very top of chatController.js
const escapeRegex = (str) =>
  str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

exports.sendMessage = async (req, res) => {
  try {
    const { userId, message } = req.body;

    // 🔎 Fallback: keyword-based regex search
    const words = message
      .split(" ")
      .map(w => w.trim())
      .filter(w => w)
      .map(escapeRegex); // now escapeRegex is always defined

    const regexFaqs = await FAQ.find({
      $or: [
        { question: { $regex: words.join("|"), $options: "i" } },
        { answer: { $regex: words.join("|"), $options: "i" } }
      ]
    });

    const botReply = regexFaqs.length > 0
      ? regexFaqs.map(f => f.answer).join("\n") // ✅ merge fallback answers too
      : "I couldn't find relevant info in your resume/FAQ. Please try rephrasing your question.";

    res.json({ reply: botReply });

  } catch (err) {
    console.error("❌ Chat error:", err);
    res.status(500).json({ error: err.message });
  }
};



// Get chat history
exports.getChatHistory = async (req, res) => {
  try {
    const { userId } = req.params;

    const conversation = await Conversation.findOne({ userId });

    if (!conversation) {
      return res.json({
        userId,
        messages: [],
        message: "No chat history found."
      });
    }

    res.json(conversation);
  } catch (error) {
    console.error("❌ Get chat history error:", error);
    res.status(500).json({ error: error.message });
  }
};

