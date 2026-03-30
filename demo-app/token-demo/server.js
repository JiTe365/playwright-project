const http = require('http');
const fs = require('fs');
const path = require('path');

const HOST = '127.0.0.1';
const PORT = 3000;
const PUBLIC_DIR = path.join(__dirname, 'public');

function estimateTokens(text) {
  if (!text || !text.trim()) return 0;
  const words = text.trim().split(/\s+/).length;
  return Math.ceil(words * 1.3);
}

function json(res, statusCode, payload) {
  res.writeHead(statusCode, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(payload));
}

function serveFile(res, filePath, contentType = 'text/html; charset=utf-8') {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Not found');
      return;
    }

    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);

  if (req.method === 'GET' && url.pathname === '/') {
    return serveFile(res, path.join(PUBLIC_DIR, 'index.html'));
  }

  if (req.method === 'GET' && url.pathname === '/app.js') {
    return serveFile(
      res,
      path.join(PUBLIC_DIR, 'app.js'),
      'application/javascript; charset=utf-8'
    );
  }

  if (req.method === 'POST' && url.pathname === '/api/chat') {
    let body = '';

    req.on('data', (chunk) => {
      body += chunk;
    });

    req.on('end', () => {
      try {
        const parsed = JSON.parse(body || '{}');
        const prompt = String(parsed.prompt || '');
        const answer = `Playwright lets you automate browsers and assert behavior. You asked: ${prompt}`;
        const promptTokens = estimateTokens(prompt);
        const completionTokens = estimateTokens(answer);
        const totalTokens = promptTokens + completionTokens;

        return json(res, 200, {
          model: 'fake-gpt-local',
          answer,
          usage: {
            prompt_tokens: promptTokens,
            completion_tokens: completionTokens,
            total_tokens: totalTokens,
          },
        });
      } catch (error) {
        return json(res, 400, { error: 'Invalid JSON payload' });
      }
    });

    return;
  }

  res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end('Not found');
});

server.listen(PORT, HOST, () => {
  console.log(`Demo server running at http://${HOST}:${PORT}`);
});
