// System prompts based on user role
const { executeHRDatabaseQuery, formatQueryResult } = require('./hrQueryParser');
const EMPLOYEE_SYSTEM_PROMPT = `You are a helpful WinWire company information assistant for employees. 
You ONLY provide information about WinWire company, its services, products, and processes.

IMPORTANT RULES:
1. Only answer questions related to WinWire company information
2. Do NOT provide any database information, employee data, or internal HR data
3. Do NOT execute any queries or access internal systems
4. If asked about database, employee records, or internal systems, politely decline
5. Be professional and accurate in all responses
6. If you don't know specific WinWire information, say so honestly
7. Keep responses concise and helpful

WinWire Company Information:
- IT services and consulting firm
- Specializes in digital transformation, cloud solutions, and enterprise software
- Focuses on innovation and customer success
- Professional and secure environment

Remember: Only discuss WinWire company topics. Protect all confidential information.`;

const HR_SYSTEM_PROMPT = `You are an intelligent HR Database Assistant for WinWire company HR personnel.
You have DIRECT ACCESS to execute database queries and can answer HR questions immediately.

YOUR CAPABILITIES:
1. **DIRECT DATABASE QUERY EXECUTION** - You can execute queries and return actual results
2. You interpret database results and provide insights
3. You help with data analysis and reporting
4. You provide guidance on available database fields and collections
5. You help generate insights from employee data

IMPORTANT RULES:
1. Natural language queries are AUTOMATICALLY EXECUTED (e.g., "How many candidates?" executes a count)
2. You WILL return actual data results, not just guidance
3. Available Collections for queries:
   - "Candidates" - candidate information (name, email, position, status, date applied)
   - "Employees" - employee information (name, department, position, join date, status)
   - "Users" - user accounts (email, name, role, status)
   - "OnboardingSubmissions" - onboarding progress (status, dates, current step)

4. Filter by status, department, or other non-sensitive fields
5. Always emphasize data privacy and compliance
6. NEVER expose sensitive fields (passwords, SSN, salary, bank details, etc.)
7. Be professional and security-conscious

EXAMPLE QUERIES (I CAN EXECUTE):
- "How many candidates do we have?" → Returns actual count
- "Show me candidates in Active status" → Returns list of candidates
- "Find all employees in Engineering" → Returns engineering employees
- "Get statistics on candidates" → Returns breakdown by status
- "List all onboarding submissions" → Returns submissions with status

HOW I WORK:
1. You ask a question about employee, candidate, or onboarding data
2. I automatically identify and execute the appropriate database query
3. I return actual results from the database
4. I format the results in a readable way
5. I provide insights based on the data

For questions that are NOT database queries (HR advice, policies, etc.), I'll answer based on my knowledge.`;



// Function to get the appropriate system prompt based on role
function getSystemPrompt(userRole) {
  if (userRole === 'HR') {
    return HR_SYSTEM_PROMPT;
  }
  return EMPLOYEE_SYSTEM_PROMPT; // Default for EMPLOYEE or other roles
}

/**
 * Send a message to the Azure OpenAI chatbot via REST API
 * @param {string} userMessage - The user's message
 * @param {string} userRole - The user's role ('HR' or 'EMPLOYEE')
 * @param {Array} conversationHistory - Previous messages in the conversation (optional)
 * @returns {Promise<string>} - The assistant's response
 */
async function chatWithWinWireBot(userMessage, userRole = 'EMPLOYEE', conversationHistory = []) {
  try {
    // Validate input
    if (!userMessage || userMessage.trim().length === 0) {
      throw new Error('User message cannot be empty');
    }

    // Get appropriate system prompt based on role
    const systemPrompt = getSystemPrompt(userRole);

    // Build messages array
    const messages = [
      {
        role: 'system',
        content: systemPrompt,
      },
      ...conversationHistory,
      {
        role: 'user',
        content: userMessage,
      },
    ];

    // Build the API endpoint URL for Azure OpenAI
    // Format: {endpoint}/openai/deployments/{deployment-name}/chat/completions?api-version={api-version}
    const deploymentName = process.env.AZURE_OPENAI_DEPLOYMENT;
    const fullUrl = `${process.env.AZURE_OPENAI_ENDPOINT}/openai/deployments/${deploymentName}/chat/completions?api-version=${process.env.AZURE_OPENAI_API_VERSION}`;
    
    console.log('');
    console.log('═══════════════════════════════════════════════');
    console.log('🤖 WINWIRE CHATBOT REQUEST');
    console.log('═══════════════════════════════════════════════');
    console.log('User Role:', userRole);
    console.log('User Message:', userMessage);
    console.log('Deployment:', deploymentName);
    console.log('URL:', fullUrl.replace(process.env.AZURE_OPENAI_API_KEY, '****'));
    console.log('───────────────────────────────────────────────');

    // For HR users, try to execute database queries first
    if (userRole === 'HR') {
      console.log('🔍 Checking for HR database query...');
      try {
        const queryResult = await executeHRDatabaseQuery(userMessage);
        if (queryResult) {
          const formattedResult = formatQueryResult(queryResult);
          console.log('✅ HR Database query executed successfully');
          return formattedResult;
        }
      } catch (error) {
        console.log('⚠️  Database query failed, falling back to Azure OpenAI:', error.message);
      }
    }

    // Call Azure OpenAI API via REST API
    const response = await fetch(fullUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': process.env.AZURE_OPENAI_API_KEY,
      },
      body: JSON.stringify({
        messages: messages,
        max_tokens: 2048,
        temperature: 0.7,
        top_p: 0.95,
      }),
    });

    console.log('📊 Azure Response Status:', response.status, response.statusText);

    if (!response.ok) {
      const errorData = await response.text();
      console.error('❌ Azure API Error (Status ' + response.status + '):', errorData);
      throw new Error(`Azure API Error: ${response.status} - ${errorData}`);
    }

    const data = await response.json();
    console.log('✅ Successfully got response from Azure Foundry');

    // Extract and return the response
    if (data.choices && data.choices.length > 0) {
      console.log('✅ Got response from Azure');
      return data.choices[0].message.content;
    } else {
      throw new Error('No response from Azure OpenAI');
    }
  } catch (error) {
    console.error('❌ Chatbot Error:', error.message);
    throw error;
  }
}

/**
 * Stream a message to the Azure OpenAI chatbot (for real-time responses)
 * @param {string} userMessage - The user's message
 * @param {string} userRole - The user's role ('HR' or 'EMPLOYEE')
 * @param {Array} conversationHistory - Previous messages in the conversation (optional)
 * @returns {AsyncGenerator} - Stream of response chunks
 */
async function* streamChatWithWinWireBot(userMessage, userRole = 'EMPLOYEE', conversationHistory = []) {
  try {
    if (!userMessage || userMessage.trim().length === 0) {
      throw new Error('User message cannot be empty');
    }

    // Get appropriate system prompt based on role
    const systemPrompt = getSystemPrompt(userRole);

    const messages = [
      {
        role: 'system',
        content: systemPrompt,
      },
      ...conversationHistory,
      {
        role: 'user',
        content: userMessage,
      },
    ];

    // Build the API endpoint URL
    const endpoint = `${process.env.AZURE_OPENAI_ENDPOINT}/deployments/${process.env.AZURE_OPENAI_DEPLOYMENT}/chat/completions`;

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': process.env.AZURE_OPENAI_API_KEY,
      },
      body: JSON.stringify({
        messages: messages,
        max_tokens: 2048,
        temperature: 0.7,
        top_p: 0.95,
        stream: true,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`Azure API Error: ${response.status} - ${errorData}`);
    }

    // Read streaming response
    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') break;
            
            try {
              const parsed = JSON.parse(data);
              if (parsed.choices?.[0]?.delta?.content) {
                yield parsed.choices[0].delta.content;
              }
            } catch (e) {
              // Skip invalid JSON
            }
          }
        }
      }
    } finally {
      reader.releaseLock();
    }
  } catch (error) {
    console.error('❌ Stream Chatbot Error:', error.message);
    throw error;
  }
}

module.exports = {
  chatWithWinWireBot,
  streamChatWithWinWireBot,
  EMPLOYEE_SYSTEM_PROMPT,
  HR_SYSTEM_PROMPT,
  getSystemPrompt,
};
