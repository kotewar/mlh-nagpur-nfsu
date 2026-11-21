import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { runInNewContext } from 'node:vm';

class Element {
  constructor(tag = 'div') {
    this.tag = tag;
    this.children = [];
    this.listeners = {};
    this.textContent = '';
    this.className = '';
    this.classes = new Set();
    this.classList = { add: (name) => this.classes.add(name) };
  }
  append(...nodes) { this.children.push(...nodes); }
  replaceChildren(...nodes) { this.children = nodes; }
  setAttribute() {}
  addEventListener(name, listener) { this.listeners[name] = listener; }
  click() { if (!this.disabled) this.listeners.click?.(); }
}

function descendants(node, predicate) {
  return node.children.flatMap((child) => [
    ...(predicate(child) ? [child] : []),
    ...descendants(child, predicate),
  ]);
}

test('previews reading levels and scores the interactive quiz without an API', async () => {
  const ids = ['research-form', 'source', 'status', 'results', 'empty', 'demo', 'level'];
  const nodes = Object.fromEntries(ids.map((id) => [`#${id}`, new Element()]));
  nodes['#level'].value = 'beginner';
  const document = {
    querySelector: (selector) => nodes[selector],
    createElement: (tag) => new Element(tag),
    createTextNode: (text) => Object.assign(new Element('text'), { textContent: text }),
  };
  const script = await readFile(new URL('../public/app.js', import.meta.url), 'utf8');
  runInNewContext(script, { document });
  assert.match(nodes['#source'].value, /Fictional Classroom Study/);
  nodes['#demo'].click();
  assert.equal(nodes['#results'].hidden, false);
  assert.equal(nodes['#empty'].hidden, true);
  assert.match(nodes['#status'].textContent, /MOCK DEMO \/ BEGINNER/);

  const quizzes = descendants(nodes['#results'], (node) => node.className === 'quiz-question');
  assert.equal(quizzes.length, 3);
  const first = descendants(quizzes[0], (node) => node.tag === 'button');
  first[0].click();
  assert.ok(first[0].classes.has('incorrect'));
  assert.ok(first[1].classes.has('correct'));
  assert.ok(first.every((button) => button.disabled));
  first[1].click();
  descendants(quizzes[1], (node) => node.tag === 'button')[2].click();
  descendants(quizzes[2], (node) => node.tag === 'button')[0].click();
  assert.ok(descendants(nodes['#results'], (node) =>
    node.textContent === '2 correct out of 3 answered. Study complete!').length);

  nodes['#level'].value = 'expert';
  let prevented = false;
  nodes['#research-form'].listeners.submit({ preventDefault: () => { prevented = true; } });
  assert.ok(prevented);
  assert.match(nodes['#status'].textContent, /EXPERT/);
  assert.ok(descendants(nodes['#results'], (node) =>
    node.textContent.includes('causal identification')).length);
  assert.equal(descendants(nodes['#results'], (node) => node.tag === 'button' && node.disabled).length, 0);
});
