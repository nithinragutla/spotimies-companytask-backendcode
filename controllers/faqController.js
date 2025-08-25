const FAQ = require("../models/FAQ");
const pdfParse = require("pdf-parse");

// ✅ Add FAQ manually
exports.addFAQ = async (req, res) => {
  try {
    const { question, answer } = req.body;
    if (!question || !answer) {
      return res.status(400).json({ error: "Question and answer are required" });
    }

    const faq = new FAQ({ question, answer, source: "manual" });
    await faq.save();

    res.json({ message: "FAQ added successfully", faq });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// ✅ Get all FAQs
exports.getFAQs = async (req, res) => {
  try {
    const faqs = await FAQ.find();
    res.json(faqs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// ✅ Upload PDF and extract text
// exports.uploadPDF = async (req, res) => {
//   try {
//     if (!req.file) return res.status(400).json({ error: "No file uploaded" });

//     const dataBuffer = req.file.buffer;
//     const pdfData = await pdfParse(dataBuffer);
exports.uploadPDF = async (req, res) => {
  try {
    console.log("Uploaded file:", req.file);  // 👈 add this line

    if (!req.file) return res.status(400).json({ error: "No file uploaded" });
    
    const dataBuffer = req.file.buffer;
    const pdfData = await pdfParse(dataBuffer);

    // Split PDF text into chunks (basic splitting by lines)
    const lines = pdfData.text.split("\n").filter(l => l.trim() !== "");

    // Save each line as FAQ (or text chunk)
    const faqs = await Promise.all(
      lines.map(async (line) => {
        const faq = new FAQ({
          question: line.substring(0, 50) + "...", // preview
          answer: line,
          source: "pdf"
        });
        return await faq.save();
      })
    );

    res.json({ message: "PDF processed and saved as FAQs", count: faqs.length });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
