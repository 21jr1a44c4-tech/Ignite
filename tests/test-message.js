const http = require('http');

const testMessage = {
  message: 'Tell me about WinWire',
  conversationHistory: []
};

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/chatbot/message',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': JSON.stringify(testMessage).length
  }
};

const req = http.request(options, (res) => {
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('Response Status:', res.statusCode);
    console.log('Response Data:', data);
    try {
      const parsed = JSON.parse(data);
      console.log('\nParsed Response:');
      console.log(JSON.stringify(parsed, null, 2));
    } catch (e) {
      console.log('Could not parse response as JSON');
    }
  });
});

req.on('error', (e) => {
  console.error('Request Error:', e.message);
});

req.write(JSON.stringify(testMessage));
req.end();
