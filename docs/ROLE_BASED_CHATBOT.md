# 🤖 Role-Based Chatbot System

## Overview

The WinWire chatbot now supports **role-based responses** with different capabilities for different user types.

---

## 🎯 Roles & Capabilities

### 👥 **EMPLOYEE Role**
**Purpose:** Company information assistant

**Allowed:**
- ✅ Ask about WinWire company information
- ✅ Learn about services and products
- ✅ Get information about company processes
- ✅ Professional questions about the company

**Not Allowed:**
- ❌ View employee database
- ❌ Access internal HR systems
- ❌ Query employee records
- ❌ Access confidential information

**Example Questions:**
```
"What services does WinWire offer?"
"Tell me about WinWire company values"
"What is digital transformation?"
```

---

### 💼 **HR Role**
**Purpose:** Database query and data analysis assistant

**Allowed:**
- ✅ Query employee data (safely)
- ✅ Access candidate information
- ✅ View onboarding status
- ✅ Generate HR insights and reports
- ✅ Understand database structure
- ✅ Data-driven decision making

**Guidance Provided:**
- How to structure database queries
- Available collections and fields
- Data filtering and analysis
- Employee data interpretation

**Example Questions:**
```
"How can I view all candidates?"
"Show me onboarding progress for new employees"
"What employee fields are available in the database?"
"How do I query candidates by status?"
```

---

## 🔧 Technical Implementation

### Frontend Changes

**File:** `frontend/src/components/WinWireChat.js`

The component now:
1. Reads user role from `localStorage` on mount
2. Sends role in every chatbot API request
3. Displays appropriate title based on role

```javascript
// Get user role from localStorage
useEffect(() => {
  const storedUser = localStorage.getItem('user');
  if (storedUser) {
    const user = JSON.parse(storedUser);
    setUserRole(user.role); // 'HR' or 'EMPLOYEE'
  }
}, []);

// Send role with every message
body: JSON.stringify({
  message: inputValue,
  userRole: userRole,  // ← Role sent to backend
  conversationHistory: conversationHistory,
})
```

### Backend Changes

**File:** `backend/utils/chatbotService.js`

Two system prompts manage behavior:

```javascript
const EMPLOYEE_SYSTEM_PROMPT = `...only WinWire info...`;
const HR_SYSTEM_PROMPT = `...database query guidance...`;

function getSystemPrompt(userRole) {
  if (userRole === 'HR') {
    return HR_SYSTEM_PROMPT;
  }
  return EMPLOYEE_SYSTEM_PROMPT;
}
```

**File:** `backend/routes/chatbot.routes.js`

Routes now accept and validate role:

```javascript
router.post('/message', async (req, res) => {
  const { message, userRole = 'EMPLOYEE', conversationHistory = [] } = req.body;
  
  // Validate role
  const validRoles = ['HR', 'EMPLOYEE'];
  const role = validRoles.includes(userRole) ? userRole : 'EMPLOYEE';
  
  // Pass role to chatbot service
  const response = await chatWithWinWireBot(message, role, limitedHistory);
});
```

---

## 📋 API Endpoints

### POST `/api/chatbot/message`

**Request:**
```json
{
  "message": "Your question here",
  "userRole": "HR",
  "conversationHistory": []
}
```

**Response:**
```json
{
  "success": true,
  "message": "Your question here",
  "userRole": "HR",
  "response": "Assistant response here...",
  "timestamp": "2025-12-20T10:30:00Z"
}
```

**userRole Options:**
- `"HR"` - HR personnel with database access guidance
- `"EMPLOYEE"` - Regular employees (company info only)
- Default: `"EMPLOYEE"` (if not provided)

---

### POST `/api/chatbot/stream`

Same as above but returns real-time streaming response.

---

## 🧪 Testing

### Run Role-Based Tests

```bash
# Test both HR and EMPLOYEE chatbot responses
node tests/test-role-based-chatbot.js
```

### Manual Testing

**Test 1: Employee Question (Company Info)**
```bash
curl -X POST http://localhost:5000/api/chatbot/message \
  -H "Content-Type: application/json" \
  -d '{
    "message": "What does WinWire do?",
    "userRole": "EMPLOYEE"
  }'
```

**Test 2: Employee Question (Database Access - Should Refuse)**
```bash
curl -X POST http://localhost:5000/api/chatbot/message \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Can you show me the employee database?",
    "userRole": "EMPLOYEE"
  }'
```

**Test 3: HR Question (Database Guidance - Should Allow)**
```bash
curl -X POST http://localhost:5000/api/chatbot/message \
  -H "Content-Type: application/json" \
  -d '{
    "message": "How do I query employee records?",
    "userRole": "HR"
  }'
```

---

## 🔐 Security Features

1. **Role Validation:** Backend validates role before processing
2. **System Prompt Enforcement:** Different prompts prevent unauthorized access
3. **No Direct Database Access:** HR gets guidance, not direct queries
4. **Conversation History:** Limited to 10 messages to prevent token abuse
5. **Error Handling:** Graceful failure if role is invalid

---

## 💡 How HR Can Use Database Guidance

Instead of direct database access, HR users can ask:

1. **Structure Questions:**
   - "What fields are in the employee collection?"
   - "What collections are available?"

2. **Query Guidance:**
   - "How do I find all candidates by status?"
   - "Show me how to filter employees by department"

3. **Data Analysis:**
   - "What insights can I get from onboarding data?"
   - "How can I analyze hiring trends?"

The chatbot provides guidance while keeping data secure.

---

## 🔄 User Role Assignment

### Where Role Comes From
- Stored in `localStorage` after login
- Retrieved from user profile in database
- Passed with every chatbot request

### Setting User Role (Backend)
When user logs in, role is set:
```javascript
// In login response
{
  token: "jwt_token",
  user: {
    _id: "user_id",
    email: "user@winwire.com",
    role: "HR",  // ← Set by admin
    name: "John Doe"
  }
}
```

### Verifying Role Works

1. Login as HR user
2. Open browser DevTools (F12)
3. Check Console → localStorage → user role
4. Send message to chatbot
5. Verify chatbot responds with HR guidance

---

## 📝 Future Enhancements

Potential improvements:
- [ ] Add "ADMIN" role with full system access
- [ ] Rate limiting per role
- [ ] Audit logging for HR database queries
- [ ] Role-based conversation history storage
- [ ] Custom prompts per department
- [ ] Restricted field access for sensitive HR data

---

## 🐛 Troubleshooting

### Chatbot Not Recognizing Role

**Issue:** Chatbot treats HR as EMPLOYEE

**Solution:**
1. Ensure user is logged in (check localStorage)
2. Verify role is correct in user profile
3. Check browser console for errors
4. Restart frontend (npm start)

### HR Not Getting Database Guidance

**Issue:** HR gets employee-only responses

**Solution:**
1. Verify role is "HR" in localStorage
2. Clear browser cache
3. Check backend logs for role validation
4. Test with `test-role-based-chatbot.js`

### Employees Can See Database Info

**Issue:** Security issue - employees accessing DB guidance

**Solution:**
1. Check system prompt in chatbotService.js
2. Verify EMPLOYEE_SYSTEM_PROMPT is restrictive
3. Test with `test-role-based-chatbot.js`
4. Check for hardcoded prompts

---

## 📞 Support

For questions about the role-based chatbot:
1. Review this documentation
2. Check backend/utils/chatbotService.js for prompts
3. Run tests/test-role-based-chatbot.js
4. Check browser console and backend logs

---

**Last Updated:** December 20, 2025
**Status:** ✅ Implemented and Ready

