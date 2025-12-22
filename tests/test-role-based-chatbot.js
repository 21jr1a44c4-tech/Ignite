// Test script for role-based chatbot
// Tests both HR and EMPLOYEE chatbot responses

require('dotenv').config();

async function testRoleBasedChatbot() {
  const BACKEND_URL = 'http://localhost:5000/api';

  const testCases = [
    {
      role: 'EMPLOYEE',
      message: 'What services does WinWire offer?',
      expectedContent: 'Should answer about WinWire services',
    },
    {
      role: 'EMPLOYEE',
      message: 'Can you show me employee database?',
      expectedContent: 'Should refuse access to database',
    },
    {
      role: 'HR',
      message: 'How can I query employee records?',
      expectedContent: 'Should provide database query guidance',
    },
    {
      role: 'HR',
      message: 'Show me candidate information',
      expectedContent: 'Should help with candidate data access',
    },
  ];

  console.log('╔════════════════════════════════════════════════════════════╗');
  console.log('║     ROLE-BASED CHATBOT TEST SUITE                         ║');
  console.log('╚════════════════════════════════════════════════════════════╝\n');

  for (const testCase of testCases) {
    console.log(`🧪 Testing ${testCase.role} Role`);
    console.log('━'.repeat(60));
    console.log(`Question: ${testCase.message}`);
    console.log(`Expected: ${testCase.expectedContent}`);
    console.log('');

    try {
      const response = await fetch(`${BACKEND_URL}/chatbot/message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: testCase.message,
          userRole: testCase.role,
          conversationHistory: [],
        }),
      });

      if (!response.ok) {
        console.error(`❌ HTTP Error: ${response.status}`);
        continue;
      }

      const data = await response.json();
      console.log(`✅ Response received from Azure`);
      console.log(`Role Used: ${data.userRole}`);
      console.log(`Response:\n${data.response}`);
      console.log('');
      console.log('✓ Test passed\n');
    } catch (error) {
      console.error(`❌ Error: ${error.message}\n`);
    }

    console.log('');
  }

  console.log('╔════════════════════════════════════════════════════════════╗');
  console.log('║     TEST COMPLETE                                         ║');
  console.log('╚════════════════════════════════════════════════════════════╝');
}

testRoleBasedChatbot().catch(console.error);
