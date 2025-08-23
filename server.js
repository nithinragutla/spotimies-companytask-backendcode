require("dotenv").config(); // <- MUST be first

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const chatRoutes = require("./routes/chatRoutes");
const faqRoutes = require("./routes/faqRoutes");

// Connect to database
connectDB();

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/chat", chatRoutes);
app.use("/api/faqs", faqRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
