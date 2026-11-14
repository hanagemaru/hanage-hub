import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const flag = process.argv[2];
if (flag !== 'default' && flag !== 'putt') throw new Error('Expected default or putt');
const sitemap = readFileSync('out/sitemap.xml', 'utf8');
const ja = readFileSync('out/games/putt/index.html', 'utf8');
const en = readFileSync('out/en/games/putt/index.html', 'utf8');
const oldUrl = 'https://putt.hanage.app/';
const newUrl = 'https://hanage.app/games/putt/play/';
const sweeperOldUrl = 'https://mcsweeper.hanage.app/';
const sweeperNewUrl = 'https://hanage.app/games/multicolor-sweeper/play/';
for (const page of [ja, en]) {
  assert.equal(page.includes(newUrl), flag === 'putt', 'Putt CTA must obey flag');
  assert.equal(page.includes(oldUrl), flag === 'default', 'Old CTA must remain by default');
  assert.ok(page.includes(sweeperOldUrl) === false || !page.includes(sweeperNewUrl));
  const playButton = page.match(/<a\b[^>]*class="buttonPrimary"[^>]*>/);
  assert.ok(playButton, 'Game detail page needs a primary play link');
  if (flag === 'putt') {
    assert.ok(playButton[0].includes(`href="${newUrl}"`), 'Published Putt uses hub game URL');
    assert.doesNotMatch(playButton[0], /target="_blank"/, 'Hub game must open in same tab');
  } else {
    assert.ok(playButton[0].includes(`href="${oldUrl}"`), 'Legacy Putt link stays unchanged');
    assert.match(playButton[0], /target="_blank"/, 'Old subdomain keeps its separate tab');
  }
}
assert.equal(sitemap.includes(newUrl), flag === 'putt', 'Sitemap Putt play route must obey flag');
assert.ok(!sitemap.includes('https://hanage.app/en/games/putt/play/'), 'No invalid English game play route');
assert.ok(!sitemap.includes(sweeperNewUrl), 'Sweeper must remain unchanged');
console.log(`PASS: hub links and sitemap use ${flag} route policy, without dead alternate paths`);
