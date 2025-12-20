// Simple test to verify prompts endpoint
const http = require('http');

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/prompts',
  method: 'GET'
};

const req = http.request(options, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const json = JSON.parse(data);
    console.log('✅ Prompts API Working!');
    console.log('Total:', json.totalPrompts);
    console.log('Categories:', json.categories.join(', '));
    process.exit(0);
  });
});

req.on('error', e => {
  console.log('❌ Error:', e.message);
  process.exit(1);
});

req.end();
