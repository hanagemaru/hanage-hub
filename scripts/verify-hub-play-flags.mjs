import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const flag = process.argv[2];
if (!['default', 'putt', 'both'].includes(flag)) throw new Error('Expected default, putt or both');
const sitemap = readFileSync('out/sitemap.xml', 'utf8');
const specs = [
  {
    slug: 'putt',
    old: 'https://putt.hanage.app/',
    live: 'https://hanage.app/games/putt/play/',
    enabled: flag !== 'default',
  },
  {
    slug: 'multicolor-sweeper',
    old: 'https://mcsweeper.hanage.app/',
    live: 'https://hanage.app/games/multicolor-sweeper/play/',
    enabled: flag === 'both',
  },
];
for (const game of specs) {
  for (const path of [`out/games/${game.slug}/index.html`, `out/en/games/${game.slug}/index.html`]) {
    const html = readFileSync(path, 'utf8');
    const button = html.match(/<a\b[^>]*class="buttonPrimary"[^>]*>/);
    assert.ok(button, `${path}: primary link missing`);
    const expected = game.enabled ? game.live : game.old;
    assert.ok(button[0].includes(`href="${expected}"`), `${path}: wrong game URL`);
    assert.match(button[0], /target="_blank"/, `${path}: games must open in separate tabs`);
    assert.match(button[0], /rel="noopener noreferrer"/, `${path}: secure external navigation`);
  }
  assert.equal(sitemap.includes(game.live), game.enabled, `Sitemap: ${game.slug}`);
  assert.ok(!sitemap.includes(`https://hanage.app/en/games/${game.slug}/play/`), 'No non-existent /en play path');
}
console.log(`PASS: ${flag} - Putt/Sweeper links open safely in separate tabs; sitemap only includes published game URLs`);
