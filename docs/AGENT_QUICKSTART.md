# Quick Setup Guide - Agentic AI Feature

## Step 1: Install Claude AI SDK

Run this command in your backend directory:

```bash
npm install @anthropic-ai/sdk
```

## Step 2: Update Environment Variables

Add this line to your `.env` file in the backend folder:

```
ANTHROPIC_API_KEY=your_api_key_here
```

**To get your API key:**
1. Go to https://console.anthropic.com/
2. Sign up or log in
3. Navigate to API Keys
4. Create a new API key
5. Copy and paste it into `.env`

## Step 3: Verify Installation

The agent files are already created:
- ✅ `/backend/agents/resumeAnalysisAgent.js` - The agent logic
- ✅ `/backend/routes/agent.routes.js` - API endpoints
- ✅ `/backend/server.js` - Updated to include agent routes

## Step 4: Start Your Server

```bash
npm run dev
```

You should see no errors. The agent is now active!

## Step 5: Test the Agent

### Option A: Using cURL (Command Line)
```bash
# First, get your auth token by logging in as HR
# Then use it in this request:

curl -X POST http://localhost:5000/api/agent/analyze-batch \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json"
```

### Option B: Using Postman
1. Create POST request to: `http://localhost:5000/api/agent/analyze-batch`
2. Set header: `Authorization: Bearer YOUR_TOKEN`
3. Click Send

### Option C: From Your Frontend
Add this to test in your browser console:
```javascript
const token = localStorage.getItem('token'); // Your auth token

fetch('/api/agent/analyze-batch', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
})
.then(res => res.json())
.then(data => console.log('Agent Analysis:', data))
.catch(err => console.error('Error:', err));
```

## Available Endpoints

### 1. Analyze Single Candidate
```
POST /api/agent/analyze-candidate/:submissionId
```

### 2. Batch Analyze All Pending
```
POST /api/agent/analyze-batch
```

### 3. Get Quick Insights
```
GET /api/agent/candidate-insights/:submissionId
```

### 4. Skill Matching
```
POST /api/agent/skill-match/:candidateId/:positionId
Body: {
  "positionDescription": "...",
  "requiredSkills": ["skill1", "skill2"]
}
```

### 5. Generate Feedback Report
```
POST /api/agent/generate-feedback/:submissionId
```

## What the Agent Does

The agent autonomously:
1. 🧠 Analyzes candidate profile
2. 🛠️ Extracts technical & soft skills
3. 📊 Assesses experience level
4. ✓ Validates credentials
5. 📝 Generates HR recommendations
6. 💡 Suggests next steps

**All without changing any existing functionality!**

## Troubleshooting

### Error: Cannot find module '@anthropic-ai/sdk'
**Solution:**
```bash
npm install @anthropic-ai/sdk
npm run dev
```

### Error: ANTHROPIC_API_KEY is not set
**Solution:**
1. Check your `.env` file has: `ANTHROPIC_API_KEY=your_key`
2. Restart server with `npm run dev`

### 401 Unauthorized
**Solution:**
- Make sure you're logged in as HR user
- Include valid JWT token in Authorization header
- Format: `Authorization: Bearer YOUR_TOKEN`

### Agent seems slow
- This is normal - Claude processes take 10-30 seconds
- Agent runs in background, doesn't block other requests
- First request is slower due to cold start

## Next Steps

1. ✅ Install SDK
2. ✅ Set API key
3. ✅ Start server
4. ✅ Test endpoints
5. 📌 [Optional] Update your frontend to show AI insights
6. 📌 [Optional] Store analysis results in database

## Architecture Overview

```
Your Existing HR App
        ↓
    [Agent Routes]
        ↓
  [Resume Analysis Agent]
        ↓
  [Claude API]
        ↓
  [Tool Execution]
        ├── Extract Skills
        ├── Assess Experience
        ├── Validate Credentials
        └── Generate Recommendations
        ↓
   [Structured Results]
        ↓
    JSON Response to HR
```

## Agentic AI Concepts Used

✓ **Tool Use** - Agent calls specialized functions
✓ **Autonomous Loops** - Continues until complete
✓ **Multi-Step Reasoning** - Plans and executes strategy
✓ **Structured Output** - Returns valid JSON schemas
✓ **Context Awareness** - Remembers analysis across steps

---

**Questions?** Check AGENTIC_AI_FEATURE.md for detailed documentation
