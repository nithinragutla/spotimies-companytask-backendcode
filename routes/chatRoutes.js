const express = require('express');
const { sendMessage, getHistory } = require('../controllers/chatController');

const router = express.Router();

router.post('/send', sendMessage);              // Send a message
router.get('/history/:userId', getHistory);    // Get chat history

module.exports = router;


