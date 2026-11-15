import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=path=>readFileSync(path,'utf8');
const url='https://hanage.app/games/horse-pedigree/play/';
for(const path of ['out/games/horse-pedigree/index.html','out/en/games/horse-pedigree/index.html']){
 const html=read(path);
 assert.match(html,/競走馬血統ならべ/);
 const play=html.match(/<a\b[^>]*class="buttonPrimary"[^>]*>/);
 assert.ok(play,path+' must have primary Play link');
 assert.ok(play[0].includes('href="'+url+'"'),path+' must point at the released game');
 assert.match(play[0],/target="_blank"/);
 assert.match(play[0],/rel="noopener noreferrer"/);
}
for(const path of ['out/games/horse-pedigree/how-to-play/index.html','out/en/games/horse-pedigree/how-to-play/index.html'])
 assert.match(read(path),/競走馬血統ならべ|Horse Pedigree Puzzle/);
const home=read('out/index.html');
assert.ok(home.includes('horse-pedigree/'),'new game must be visible on homepage');
const games=read('out/games/index.html');
assert.ok(games.includes('horse-pedigree/'),'new game must be present in game catalog');
const sitemap=read('out/sitemap.xml');
for(const route of ['/games/horse-pedigree/','/en/games/horse-pedigree/',
 '/games/horse-pedigree/how-to-play/','/en/games/horse-pedigree/how-to-play/',
 '/games/horse-pedigree/play/'])
 assert.ok(sitemap.includes('https://hanage.app'+route),'missing sitemap route '+route);
assert.ok(!sitemap.includes('/en/games/horse-pedigree/play/'));
console.log('HORSE_HUB_RELEASE_BUILD_VERIFIED: catalog, landing, how-to, new tab, sitemap, home');
