#!/usr/bin/env node

/**
 * OpenAI API Test Script
 * Tests the OpenAI API connection and gpt-4o-mini model
 *
 * Usage:
 *   node test-openai-api.js "Your API Key Here"
 *   or set OPENAI_API_KEY environment variable
 */

import https from 'https';

const apiKey = process.argv[2] || process.env.OPENAI_API_KEY;

if (!apiKey) {
  console.error('❌ Error: OpenAI API key not provided');
  console.error('Usage: node test-openai-api.js "sk-your-api-key"');
  console.error('Or set OPENAI_API_KEY environment variable');
  process.exit(1);
}

console.log('🚀 Testing OpenAI API with gpt-4o-mini model...\n');

const payload = JSON.stringify({
  model: 'gpt-4o-mini',
  messages: [
    {
      role: 'user',
      content: 'Say "Hello from CNA Voice Notes AI!" in exactly 5 words.'
    }
  ],
  temperature: 0.7,
  max_tokens: 100
});

const options = {
  hostname: 'api.openai.com',
  port: 443,
  path: '/v1/chat/completions',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(payload),
    'Authorization': `Bearer ${apiKey}`
  }
};

const req = https.request(options, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    try {
      const response = JSON.parse(data);

      if (res.statusCode === 200) {
        console.log('✅ API Connection: SUCCESS');
        console.log('✅ Model: gpt-4o-mini');
        console.log('✅ Response received\n');
        console.log('📝 Assistant Response:');
        console.log('---');
        console.log(response.choices[0].message.content);
        console.log('---\n');
        console.log('💰 Token Usage:');
        console.log(`   Input tokens: ${response.usage.prompt_tokens}`);
        console.log(`   Output tokens: ${response.usage.completion_tokens}`);
        console.log(`   Total tokens: ${response.usage.total_tokens}\n`);
        console.log('✨ Your API key is valid and working!');
        console.log('🎉 You can now use the chat application.\n');
      } else {
        console.error('❌ API Error:', res.statusCode);
        console.error('Response:', response);
      }
    } catch (error) {
      console.error('❌ Error parsing response:', error.message);
      console.error('Raw response:', data);
    }
  });
});

req.on('error', (error) => {
  console.error('❌ Network Error:', error.message);
  process.exit(1);
});

req.write(payload);
req.end();

