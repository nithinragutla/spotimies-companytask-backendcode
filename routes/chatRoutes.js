const express = require('express');
const { sendMessage, getChatHistory } = require('../controllers/chatController');

const router = express.Router();

router.post('/send', sendMessage);              // Send a message
router.get('/history/:userId', getChatHistory);    // Get chat history

module.exports = router;


