/**
 * Test script to verify chatbot database query improvements
 * Tests HR chatbot with various query patterns
 */

const BASE_URL = 'http://localhost:5000';
const CHATBOT_ENDPOINT = `${BASE_URL}/api/chatbot/message`;

// Test queries
const testQueries = [
  {
    message: 'how many total candidates',
    userRole: 'HR',
    description: 'Count total candidates'
  },
  {
    message: 'how many accepted offers',
    userRole: 'HR',
    description: 'Count accepted offers'
  },
  {
    message: 'show me all active employees',
    userRole: 'HR',
    description: 'Find active employees'
  },
  {
    message: 'employees in engineering',
    userRole: 'HR',
    description: 'Find engineering employees'
  },
  {
    message: 'onboarding in progress',
    userRole: 'HR',
    description: 'Find in-progress onboarding'
  },
  {
    message: 'candidates statistics',
    userRole: 'HR',
    description: 'Get candidate statistics'
  }
];

async function runTests() {
  console.log('');
  console.log('╔═══════════════════════════════════════════════════╗');
  console.log('║        CHATBOT DATABASE QUERY IMPROVEMENTS TEST    ║');
  console.log('╚═══════════════════════════════════════════════════╝');
  console.log('');

  for (const test of testQueries) {
    console.log('');
    console.log('───────────────────────────────────────────────────');
    console.log(`📋 Test: ${test.description}`);
    console.log(`💬 Query: "${test.message}"`);
    console.log(`👤 Role: ${test.userRole}`);
    console.log('───────────────────────────────────────────────────');

    try {
      const response = await fetch(CHATBOT_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: test.message,
          userRole: test.userRole,
          conversationHistory: []
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        console.log('✅ Response Status: SUCCESS');
        console.log('');
        console.log('📝 Response:');
        console.log(data.response);
        console.log('');
      } else {
        console.log('❌ Response Status: FAILED');
        console.log('Error:', data.error);
      }
    } catch (error) {
      console.log('❌ Request Failed');
      console.log('Error:', error.message);
    }

    // Wait between requests
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  console.log('');
  console.log('╔═══════════════════════════════════════════════════╗');
  console.log('║                  TEST COMPLETED                   ║');
  console.log('╚═══════════════════════════════════════════════════╝');
  console.log('');
}

runTests().catch(console.error);
