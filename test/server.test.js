import { test } from 'node:test';
import assert from 'node:assert/strict';
import { once } from 'node:events';
import { createApp } from '../server.js';

test('serves the mock app and assets without exposing arbitrary files', async (t) => {
  const server = createApp();
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  t.after(() => new Promise((resolve) => server.close(resolve)));
  const base = `http://127.0.0.1:${server.address().port}`;
  const page = await fetch(base);
  assert.equal(page.status, 200);
  assert.match(await page.text(), /GEMINI API CONCEPT \/ MOCK DEMO/);
  for (const asset of ['/app.js', '/style.css']) {
    const response = await fetch(`${base}${asset}`);
    assert.equal(response.status, 200);
    assert.ok((await response.text()).length > 100);
  }
  const head = await fetch(base, { method: 'HEAD' });
  assert.equal(head.status, 200);
  assert.equal(await head.text(), '');
  const missing = await fetch(`${base}/package.json`);
  assert.equal(missing.status, 404);
  const post = await fetch(base, { method: 'POST' });
  assert.equal(post.status, 405);
  assert.equal(post.headers.get('allow'), 'GET, HEAD');
});
