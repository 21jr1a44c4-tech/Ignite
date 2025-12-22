const { AzureOpenAI } = require('openai');
require('dotenv').config();

async function testChatbot() {
  try {
    console.log('Testing chatbot connection...');
    console.log('Endpoint:', process.env.AZURE_OPENAI_ENDPOINT);
    console.log('Deployment:', process.env.AZURE_OPENAI_DEPLOYMENT);
    console.log('API Version:', process.env.AZURE_OPENAI_API_VERSION);

    const baseURL = `${process.env.AZURE_OPENAI_ENDPOINT}/deployments/${process.env.AZURE_OPENAI_DEPLOYMENT}`;
    console.log('BaseURL:', baseURL);

    const client = new AzureOpenAI({
      apiVersion: process.env.AZURE_OPENAI_API_VERSION || '2024-12-01-preview',
      baseURL: baseURL,
      apiKey: process.env.AZURE_OPENAI_API_KEY,
    });

    const response = await client.chat.completions.create({
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: 'Say hello' },
      ],
      model: process.env.AZURE_OPENAI_DEPLOYMENT,
      max_tokens: 100,
    });

    console.log('✅ Success!');
    console.log('Response:', response.choices[0].message.content);
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Full error:', error);
  }
}

testChatbot();
