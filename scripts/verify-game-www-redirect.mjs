import assert from 'node:assert/strict';
import router from '../src/workers/game-www-redirect.ts';

const test = (url, method = 'GET') => router.fetch(new Request(url, { method }));
for (const path of [
  '/games/putt/play',
  '/games/putt/play/',
  '/games/putt/play/assets/game.js',
  '/games/putt/play/api/rankings?board=x&lang=ja',
]) {
  const response = test('https://www.hanage.app' + path);
  assert.equal(response.status, 302);
  assert.equal(response.headers.get('location'), 'https://hanage.app' + path);
  assert.equal(response.headers.get('Cache-Control'), 'no-store');
}
for (const path of ['/games/putt/', '/games/multicolor-sweeper/play/', '/games/putt/play-other']) {
  assert.equal(test('https://www.hanage.app' + path).status, 404);
}
assert.equal(test('https://www.hanage.app/games/putt/play/api/records', 'POST').status, 405);
assert.equal(test('https://hanage.app/games/putt/play/').status, 404);
console.log('PASS: www Putt path-only canonical redirect, no effects on other pages, no writes, no caching');
