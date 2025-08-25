const mongoose = require("mongoose");

const faqSchema = new mongoose.Schema({
  question: String,
  answer: String,
  source: { type: String, default: "manual" }, // manual | pdf
  createdAt: { type: Date, default: Date.now }
});

// ✅ Add text index for better search across question & answer
faqSchema.index({ question: "text", answer: "text" });

module.exports = mongoose.model("FAQ", faqSchema);
