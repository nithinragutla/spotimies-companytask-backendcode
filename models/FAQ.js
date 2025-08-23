const mongoose = require("mongoose");

const faqSchema = new mongoose.Schema({
  question: String,
  answer: String,
  source: { type: String, default: "manual" }, // manual | pdf
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("FAQ", faqSchema);
