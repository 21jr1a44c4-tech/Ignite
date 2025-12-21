const express = require('express');
const { chatWithWinWireBot, streamChatWithWinWireBot } = require('../utils/chatbotService');
const auth = require('../middleware/auth.middleware');

const router = express.Router();

/**
 * POST /api/chatbot/message
 * Send a message to the WinWire chatbot
 * Body: { message: string, userRole?: string, conversationHistory?: Array }
 * userRole: 'HR' or 'EMPLOYEE' (default: 'EMPLOYEE')
 */
router.post('/message', async (req, res) => {
  try {
    const { message, userRole = 'EMPLOYEE', conversationHistory = [] } = req.body;

    if (!message || message.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Message cannot be empty',
      });
    }

    // Validate user role
    const validRoles = ['HR', 'EMPLOYEE'];
    const role = validRoles.includes(userRole) ? userRole : 'EMPLOYEE';

    // Limit conversation history to last 10 messages to avoid token limits
    const limitedHistory = conversationHistory.slice(-10);

    const response = await chatWithWinWireBot(message, role, limitedHistory);

    res.json({
      success: true,
      message: message,
      userRole: role,
      response: response,
      timestamp: new Date(),
    });
  } catch (error) {
    console.error('Chatbot Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get response from chatbot. Please try again.',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

/**
 * POST /api/chatbot/stream
 * Stream a message to the WinWire chatbot (real-time response)
 * Body: { message: string, userRole?: string, conversationHistory?: Array }
 * userRole: 'HR' or 'EMPLOYEE' (default: 'EMPLOYEE')
 */
router.post('/stream', async (req, res) => {
  try {
    const { message, userRole = 'EMPLOYEE', conversationHistory = [] } = req.body;

    if (!message || message.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Message cannot be empty',
      });
    }

    // Validate user role
    const validRoles = ['HR', 'EMPLOYEE'];
    const role = validRoles.includes(userRole) ? userRole : 'EMPLOYEE';

    // Set headers for streaming
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const limitedHistory = conversationHistory.slice(-10);

    // Stream the response
    for await (const chunk of streamChatWithWinWireBot(message, role, limitedHistory)) {
      res.write(`data: ${JSON.stringify({ chunk: chunk })}\n\n`);
    }

    res.write('data: [DONE]\n\n');
    res.end();
  } catch (error) {
    console.error('Stream Chatbot Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to stream response from chatbot',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

/**
 * GET /api/chatbot/health
 * Check if chatbot service is available
 */
router.get('/health', (req, res) => {
  const isConfigured = !!(
    process.env.AZURE_OPENAI_ENDPOINT &&
    process.env.AZURE_OPENAI_API_KEY
  );

  res.json({
    status: isConfigured ? 'available' : 'not-configured',
    configured: isConfigured,
    endpoint: isConfigured ? process.env.AZURE_OPENAI_ENDPOINT : null,
    deployment: process.env.AZURE_OPENAI_DEPLOYMENT,
    apiVersion: process.env.AZURE_OPENAI_API_VERSION,
    apiKeyLength: process.env.AZURE_OPENAI_API_KEY ? process.env.AZURE_OPENAI_API_KEY.length : 0,
  });
});

module.exports = router;
