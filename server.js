import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';

const files = new Map([
  ['/', ['index.html', 'text/html; charset=utf-8']],
  ['/app.js', ['app.js', 'text/javascript; charset=utf-8']],
  ['/style.css', ['style.css', 'text/css; charset=utf-8']],
]);

function json(response, status, body) {
  response.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
  response.end(JSON.stringify(body));
}

export function createApp() {
  return createServer(async (request, response) => {
    response.setHeader('X-Content-Type-Options', 'nosniff');
    response.setHeader('Referrer-Policy', 'no-referrer');
    response.setHeader('Cache-Control', 'no-store');
    response.setHeader('Content-Security-Policy', "default-src 'self'; style-src 'self'; script-src 'self'; connect-src 'self'; base-uri 'none'; frame-ancestors 'none'; form-action 'self'");
    try {
      const path = new URL(request.url, 'http://localhost').pathname;
      if (!files.has(path)) return json(response, 404, { error: 'Not found.' });
      if (request.method !== 'GET' && request.method !== 'HEAD') {
        response.setHeader('Allow', 'GET, HEAD');
        return json(response, 405, { error: 'Method not allowed.' });
      }
      const [name, type] = files.get(path);
      const content = await readFile(new URL(`./public/${name}`, import.meta.url));
      response.writeHead(200, { 'Content-Type': type });
      response.end(request.method === 'HEAD' ? undefined : content);
    } catch (error) {
      console.error(`[PaperPulse] Could not serve the requested file: ${error.message}`);
      json(response, 500, { error: 'Could not load the requested page.' });
    }
  });
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const port = Number(process.env.PORT || 3000);
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error('PORT must be an integer between 1 and 65535.');
  }
  const app = createApp();
  app.listen(port, '127.0.0.1', () => console.log(`PaperPulse is ready at http://localhost:${port}`));
  app.on('error', (error) => {
    console.error(`PaperPulse could not start: ${error.message}`);
    process.exitCode = 1;
  });
}
