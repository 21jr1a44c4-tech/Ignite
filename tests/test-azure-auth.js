// Quick test to verify Azure API authentication
require('dotenv').config();

async function testAzureAuth() {
  const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
  const apiKey = process.env.AZURE_OPENAI_API_KEY;
  const deployment = process.env.AZURE_OPENAI_DEPLOYMENT;
  const apiVersion = process.env.AZURE_OPENAI_API_VERSION;

  console.log('Testing Azure Authentication...\n');
  console.log('Environment Variables:');
  console.log('- ENDPOINT:', endpoint);
  console.log('- DEPLOYMENT:', deployment);
  console.log('- API_VERSION:', apiVersion);
  console.log('- API_KEY length:', apiKey ? apiKey.length : 'NOT SET');
  console.log('- API_KEY first 10 chars:', apiKey ? apiKey.substring(0, 10) : 'NOT SET');
  console.log('');

  if (!endpoint || !apiKey || !deployment || !apiVersion) {
    console.error('❌ Missing environment variables!');
    process.exit(1);
  }

  const url = `${endpoint}/openai/deployments/${deployment}/chat/completions?api-version=${apiVersion}`;
  console.log('Full URL:', url.substring(0, 100) + '...\n');

  try {
    console.log('Sending test request to Azure...');
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': apiKey,
      },
      body: JSON.stringify({
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
      }),
    });

    console.log('Response Status:', response.status, response.statusText);

    const data = await response.text();
    console.log('Response Body:', data.substring(0, 500));

    if (response.ok) {
      console.log('\n✅ Authentication successful!');
      const jsonData = JSON.parse(data);
      if (jsonData.choices && jsonData.choices[0]) {
        console.log('✅ Got response:', jsonData.choices[0].message.content);
      }
    } else {
      console.log('\n❌ Authentication failed!');
      console.log('Error details:', data);
    }
  } catch (error) {
    console.error('❌ Request error:', error.message);
  }
}

testAzureAuth();
