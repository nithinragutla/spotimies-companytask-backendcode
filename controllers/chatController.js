const Conversation = require("../models/conversation");
const FAQ = require("../models/FAQ");

// Send message and get response
exports.sendMessage = async (req, res) => {
  try {
    const { userId, message } = req.body;
    if (!userId || !message) {
      return res.status(400).json({ error: "userId and message are required" });
    }

    // ✅ Save message into conversation
    let conversation = await Conversation.findOne({ userId });
    if (!conversation) {
      conversation = new Conversation({ userId, messages: [] });
    }

    conversation.messages.push({ sender: "user", text: message });
    
    // ✅ Try to find relevant FAQ (very simple search: text match)
    const faq = await FAQ.findOne({
      $or: [
        { question: { $regex: message, $options: "i" } },
        { answer: { $regex: message, $options: "i" } }
      ]
    });

    let botReply;
    if (faq) {
      botReply = faq.answer; // reply with saved answer from FAQ/PDF
    } else {
      botReply =
        "I can only answer questions related to the uploaded FAQ content. Please try again with a relevant query.";
    }

    // ✅ Save bot response
    conversation.messages.push({ sender: "bot", text: botReply });
    await conversation.save();

    res.json({ reply: botReply, conversation });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// Get chat history
exports.getHistory = async (req, res) => {
  try {
    const { userId } = req.params;
    const conversation = await Conversation.findOne({ userId });
    if (!conversation) return res.json({ messages: [] });
    res.json(conversation.messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
