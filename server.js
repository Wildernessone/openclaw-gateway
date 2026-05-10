// OpenClaw REST API Proxy
// Converts REST API calls to OpenClaw WebSocket commands

import http from 'http';
import { WebSocket } from 'ws';

const PORT = process.env.PORT || 3000;
const GATEWAY_URL = process.env.GATEWAY_URL || 'ws://localhost:18789';
const API_TOKEN = process.env.API_TOKEN || 'token-7117030163d8e870e4f0b2b203b7a31b';

function createGatewayRequest(method, path, body = null) {
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(GATEWAY_URL, {
      headers: { 'Authorization': `Bearer ${API_TOKEN}` }
    });

    let responseData = '';
    
    ws.on('open', () => {
      // Send a simple request via WebSocket
      const request = JSON.stringify({
        jsonrpc: '2.0',
        method: method,
        params: { path, body },
        id: 1
      });
      ws.send(request);
    });

    ws.on('message', (data) => {
      responseData += data.toString();
    });

    ws.on('close', () => {
      try {
        const response = JSON.parse(responseData);
        resolve(response);
      } catch {
        resolve({ error: 'Failed to parse response' });
      }
    });

    ws.on('error', (err) => {
      reject(err);
    });

    setTimeout(() => {
      ws.close();
      reject(new Error('Request timeout'));
    }, 30000);
  });
}

// Simpler approach: Just echo the request and let the gateway handle it
const server = http.createServer(async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');
  
  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const path = req.url;
  
  console.log(`${req.method} ${path}`);

  // Health check
  if (path === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok' }));
    return;
  }

  // Get models
  if (path === '/v1/models' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      data: [
        { id: 'main', name: 'Main Agent', object: 'model' }
      ]
    }));
    return;
  }

  // Get agents
  if (path === '/v1/agents' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      agents: [
        { id: 'main', name: 'Bob', description: 'Your AI companion' }
      ]
    }));
    return;
  }

  // Chat completions
  if (path === '/v1/chat/completions' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', async () => {
      try {
        const data = JSON.parse(body);
        const userMessage = data.messages?.[data.messages.length - 1]?.content || 'Hello';
        
        // For demo, return a simple response
        // In production, this would call the actual OpenClaw
        const responses = [
          "I'm here and ready to help! What would you like to work on?",
          "That's a great question. Let me think about that...",
          "I can help you with all sorts of tasks - just ask!",
          "As your AI companion, I'm always here for you. What's up?",
          "I'd be happy to help with that! Tell me more."
        ];
        const response = responses[Math.floor(Math.random() * responses.length)];
        
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          choices: [{
            message: {
              role: 'assistant',
              content: response
            },
            finish_reason: 'stop'
          }],
          model: 'main'
        }));
      } catch (err) {
        res.writeHead(500);
        res.end(JSON.stringify({ error: err.message }));
      }
    });
    return;
  }

  // 404 for other endpoints
  res.writeHead(404);
  res.end(JSON.stringify({ error: 'Not found' }));
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`REST API proxy running on port ${PORT}`);
  console.log(`Forwarding to OpenClaw at ${GATEWAY_URL}`);
});
