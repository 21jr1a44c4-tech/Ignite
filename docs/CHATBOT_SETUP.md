# WinWire Chatbot Integration Guide

## Overview
This integration adds an Azure OpenAI-powered chatbot to your Ignite project. The chatbot is restricted to provide information only about WinWire company using a strict system prompt.

## Features
✅ **Azure Foundry Integration** - Uses your deployed GPT-4o-mini model  
✅ **Strict System Prompt** - Only answers WinWire-related questions  
✅ **Multi-turn Conversations** - Maintains conversation history  
✅ **Streaming Support** - Real-time response streaming available  
✅ **React Component** - Ready-to-use chat UI widget  
✅ **Security** - API key authentication, configurable restrictions  

## Backend Setup

### 1. Install Dependencies
```bash
cd backend
npm install @azure/openai
```

### 2. Configure Environment Variables
Update your `.env` file with Azure OpenAI credentials:

```env
# Azure OpenAI Configuration
AZURE_OPENAI_ENDPOINT=https://winbuild1-theignite-ai-foundry.cognitiveservices.azure.com/
AZURE_OPENAI_API_KEY=your-api-key-here
AZURE_OPENAI_DEPLOYMENT=gpt-4o-mini
AZURE_OPENAI_API_VERSION=2024-12-01-preview
```

### 3. Files Created/Modified

**New Files:**
- `backend/utils/chatbotService.js` - Core chatbot logic with Azure OpenAI integration
- `backend/routes/chatbot.routes.js` - API endpoints for chatbot
- `backend/.env.example` - Environment variables template

**Modified Files:**
- `backend/server.js` - Added chatbot routes
- `backend/package.json` - Added @azure/openai dependency

## API Endpoints

### POST `/api/chatbot/message`
Send a message to the chatbot and get a response.

**Request:**
```json
{
  "message": "Tell me about WinWire",
  "conversationHistory": [
    {
      "role": "user",
      "content": "What is WinWire?"
    },
    {
      "role": "assistant",
      "content": "WinWire is an IT services company..."
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Tell me about WinWire",
  "response": "WinWire is a leading IT services and consulting firm...",
  "timestamp": "2024-12-20T10:30:00Z"
}
```

### POST `/api/chatbot/stream`
Get real-time streamed responses (Server-Sent Events).

**Request:**
```json
{
  "message": "Tell me about WinWire",
  "conversationHistory": []
}
```

### GET `/api/chatbot/health`
Check if the chatbot service is available.

**Response:**
```json
{
  "status": "available",
  "configured": true,
  "endpoint": "https://winbuild1-theignite-ai-foundry.cognitiveservices.azure.com/"
}
```

## Frontend Setup

### 1. Component Integration
The `WinWireChat` component is already integrated in `frontend/src/App.js`.

### 2. Usage
The chat widget appears as a floating button in the bottom-right corner of your application. No additional setup required!

### 3. Customization

**Modify System Prompt:**
Edit `backend/utils/chatbotService.js`, update the `WINWIRE_SYSTEM_PROMPT`:

```javascript
const WINWIRE_SYSTEM_PROMPT = `You are a helpful WinWire company information assistant.
// ... customize your prompt here ...`;
```

**Customize Component:**
Edit `frontend/src/components/WinWireChat.js` to modify:
- Colors and styling
- Chat behavior
- Message handling
- UI elements

**Customize Styles:**
Edit `frontend/src/components/WinWireChat.css` for visual adjustments.

## System Prompt (Strict Mode)

The chatbot uses a strict system prompt that:
1. **Only discusses WinWire** - Rejects off-topic questions
2. **Provides accurate info** - Based on company information
3. **Maintains professionalism** - Professional tone
4. **Limits scope** - Won't answer personal or external questions

Example blocked questions:
- "Tell me a joke" → Politely redirected
- "How do I cook pasta?" → Not WinWire related
- "What's your opinion on politics?" → Strictly blocked

## Testing

### Test Backend Endpoint
```bash
curl -X POST http://localhost:5000/api/chatbot/message \
  -H "Content-Type: application/json" \
  -d '{
    "message": "What is WinWire?",
    "conversationHistory": []
  }'
```

### Test Health Check
```bash
curl http://localhost:5000/api/chatbot/health
```

### Test Frontend
1. Start your frontend: `npm start` from `frontend/` directory
2. Look for the 💬 button in bottom-right corner
3. Click to open chat
4. Try asking: "Tell me about WinWire"

## Error Handling

**Missing API Key:**
```json
{
  "status": "not-configured",
  "configured": false,
  "endpoint": null
}
```

**API Error:**
```json
{
  "success": false,
  "error": "Failed to get response from chatbot. Please try again.",
  "details": "Azure OpenAI API error details (development only)"
}
```

## Security Considerations

1. **API Key Protection:**
   - Never commit `.env` files
   - Use `.env.example` as template
   - Rotate keys regularly

2. **Rate Limiting:**
   - Consider adding rate limiting middleware for production
   - Monitor API usage

3. **Input Validation:**
   - Backend validates message length
   - System prompt prevents jailbreaks
   - Conversation history is limited to 10 messages

## Production Deployment

1. **Update Environment Variables:**
   ```env
   NODE_ENV=production
   AZURE_OPENAI_ENDPOINT=https://your-production-endpoint.cognitiveservices.azure.com/
   AZURE_OPENAI_API_KEY=production-api-key
   ```

2. **Add Rate Limiting:**
   ```javascript
   const rateLimit = require('express-rate-limit');
   const chatbotLimiter = rateLimit({
     windowMs: 15 * 60 * 1000,
     max: 100 // 100 requests per 15 minutes
   });
   app.use('/api/chatbot', chatbotLimiter);
   ```

3. **Monitor Logs:**
   - Log all chatbot interactions
   - Monitor API costs
   - Track error rates

## Troubleshooting

**Issue:** "Failed to load resource: 500 (Internal Server Error)"
- Check `.env` file has correct Azure credentials
- Verify API key is valid
- Check MongoDB connection

**Issue:** Chatbot not responding
- Verify `AZURE_OPENAI_ENDPOINT` is correct
- Check `AZURE_OPENAI_API_KEY` is valid
- Ensure `AZURE_OPENAI_DEPLOYMENT` matches your model name
- Check API version compatibility

**Issue:** Chat window not appearing
- Clear browser cache
- Check console for JavaScript errors
- Verify `WinWireChat` is imported in `App.js`

## Next Steps

1. ✅ Configure Azure credentials in `.env`
2. ✅ Install dependencies: `npm install`
3. ✅ Start backend: `npm run dev` (from backend)
4. ✅ Start frontend: `npm start` (from frontend)
5. ✅ Test chatbot via UI or API
6. ✅ Customize system prompt as needed
7. ✅ Deploy to production

## Additional Resources

- [Azure OpenAI Documentation](https://learn.microsoft.com/en-us/azure/ai-services/openai/)
- [OpenAI API Reference](https://platform.openai.com/docs/api-reference/chat/create)
- [Express.js Guide](https://expressjs.com/)
- [React Documentation](https://react.dev/)

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review Azure OpenAI logs
3. Check backend console output
4. Verify `.env` configuration
