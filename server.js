// OpenClaw Gateway API
// Simple REST API for mobile app

import http from 'http';

const PORT = process.env.PORT || 3000;

// Demo responses for chat
const chatResponses = [
  "I'm here and ready to help! What would you like to work on?",
  "That's a great question. Let me think about that...",
  "I can help you with all sorts of tasks - just ask!",
  "As your AI companion, I'm always here for you. What's up?",
  "I'd be happy to help with that! Tell me more.",
  "Interesting! Let's explore that together.",
  "Great idea! Here's what I think...",
  "I'm excited to help you build something great!"
];

const server = http.createServer((req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');
  res.setHeader('Content-Type', 'application/json');
  
  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const path = req.url;
  console.log(`${req.method} ${path}`);

  // Health check
  if (path === '/health') {
    res.writeHead(200);
    res.end(JSON.stringify({ status: 'ok' }));
    return;
  }

  // Get models
  if (path === '/v1/models') {
    res.writeHead(200);
    res.end(JSON.stringify({
      data: [
        { id: 'main', name: 'MiniMax M2.5', object: 'model' },
        { id: 'fallback', name: 'Gemini Flash Lite', object: 'model' }
      ]
    }));
    return;
  }

  // Get agents
  if (path === '/v1/agents') {
    res.writeHead(200);
    res.end(JSON.stringify({
      agents: [
        { id: 'main', name: 'Bob', description: 'Your AI companion' }
      ]
    }));
    return;
  }

  // Chat completions
  if (path === '/v1/chat/completions') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        const userMessage = data.messages?.[data.messages.length - 1]?.content || '';
        
        // Select response based on message content
        let response = chatResponses[Math.floor(Math.random() * chatResponses.length)];
        
        if (userMessage.toLowerCase().includes('hello') || userMessage.toLowerCase().includes('hi')) {
          response = "Hey there! I'm Bob, your AI companion. What's on your mind?";
        } else if (userMessage.toLowerCase().includes('help')) {
          response = "I'm here to help! Whether it's coding, writing, brainstorming, or just chatting - I'm your AI companion.";
        } else if (userMessage.length > 50) {
          response = "That's a really interesting point. I'd love to dive deeper - tell me more about what you're thinking!";
        }
        
        res.writeHead(200);
        res.end(JSON.stringify({
          choices: [{
            message: { role: 'assistant', content: response },
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

  // 404
  res.writeHead(404);
  res.end(JSON.stringify({ error: 'Not found', path }));
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`OpenClaw Gateway API running on port ${PORT}`);
});
