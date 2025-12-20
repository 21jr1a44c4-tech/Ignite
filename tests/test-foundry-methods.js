// Test different authentication methods for Microsoft Foundry
require('dotenv').config();

async function testFoundryAuth() {
  const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
  const apiKey = process.env.AZURE_OPENAI_API_KEY;
  const deployment = process.env.AZURE_OPENAI_DEPLOYMENT;
  const apiVersion = process.env.AZURE_OPENAI_API_VERSION;

  const url = `${endpoint}/deployments/${deployment}/chat/completions?api-version=${apiVersion}`;

  const testPayload = JSON.stringify({
    messages: [
      {
        role: 'system',
        content: 'You are a helpful assistant.',
      },
      {
        role: 'user',
        content: 'Say "Hello"',
      },
    ],
    max_tokens: 100,
    temperature: 0.7,
  });

  console.log('Testing Microsoft Foundry Authentication Methods\n');
  console.log('Endpoint:', endpoint);
  console.log('Deployment:', deployment);
  console.log('API Version:', apiVersion);
  console.log('');

  // Method 1: api-key header (current)
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('Method 1: api-key header');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': apiKey,
      },
      body: testPayload,
    });
    console.log('Status:', response.status, response.statusText);
    const data = await response.text();
    console.log('Response:', data.substring(0, 300));
    console.log('');
  } catch (error) {
    console.error('Error:', error.message);
    console.log('');
  }

  // Method 2: Authorization Bearer header
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('Method 2: Authorization Bearer header');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: testPayload,
    });
    console.log('Status:', response.status, response.statusText);
    const data = await response.text();
    console.log('Response:', data.substring(0, 300));
    console.log('');
  } catch (error) {
    console.error('Error:', error.message);
    console.log('');
  }

  // Method 3: x-api-key header
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('Method 3: x-api-key header');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
      },
      body: testPayload,
    });
    console.log('Status:', response.status, response.statusText);
    const data = await response.text();
    console.log('Response:', data.substring(0, 300));
    console.log('');
  } catch (error) {
    console.error('Error:', error.message);
    console.log('');
  }

  // Method 4: Check if endpoint itself needs to be different
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('Method 4: Checking endpoint without /deployments path');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  const altUrl = `${endpoint}/chat/completions?api-version=${apiVersion}`;
  console.log('Alt URL:', altUrl.substring(0, 100) + '...');
  try {
    const response = await fetch(altUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': apiKey,
      },
      body: testPayload,
    });
    console.log('Status:', response.status, response.statusText);
    const data = await response.text();
    console.log('Response:', data.substring(0, 300));
    console.log('');
  } catch (error) {
    console.error('Error:', error.message);
    console.log('');
  }
}

testFoundryAuth();
