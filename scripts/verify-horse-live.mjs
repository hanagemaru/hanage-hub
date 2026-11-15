/** Smoke against live horse Worker: signed ticket, replay, ranking, privacy deletion. */
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {randomUUID,randomBytes} from 'node:crypto';
import {generateRandomHorseSession} from '../game/src/random-horse-session.js';
import {CURRENT_HORSE_GENERATOR_VERSION,seededRandom} from '../game/src/random-horse-stage.js';
import {newGame,place} from '../game/src/core.js';
import {findPlayablePlacement} from '../game/src/game-assistance.js';
import {horseScore} from '../game/src/horse-score.js';
const root='https://hanage.app/games/horse-pedigree/play/';
const pedigree=JSON.parse(readFileSync('game/data/horse-pedigree.v1.json','utf8'));
const fameSnapshot=JSON.parse(readFileSync('game/data/horse-fame-2026-10.v1.json','utf8'));
const identity={playerId:randomUUID(),credential:randomBytes(32).toString('base64url')};
const auth='Bearer '+identity.playerId+'.'+identity.credential;
const wait=ms=>new Promise(resolve=>setTimeout(resolve,ms));
const probe=async (path,validator)=>{
 let last;
 for(let i=0;i<15;i++){
  try{
   const response=await fetch(root+path,{cache:'no-store',signal:AbortSignal.timeout(15000)});
   if(await validator(response))return;
   last='HTTP '+response.status+' '+path;
  }catch(error){last=String(error);}
  await wait(2200);
 }
 throw Error('Live Worker not ready: '+last);
};
async function api(endpoint,method='GET',body=null,origin=null){
 const response=await fetch(root+'api/'+endpoint,{
  method,headers:{
   Authorization:auth,
   ...(body?{'Content-Type':'application/json'}:{}),
   ...(origin?{Origin:origin}:{})
  },...(body?{body:JSON.stringify(body)}:{}),
  cache:'no-store',signal:AbortSignal.timeout(30000)
 });
 const result=await response.json();
 return {status:response.status,result};
}
await probe('',async r=>r.ok&&(await r.text()).includes('競走馬血統ならべ'));
await probe('src/app.js',async r=>r.ok&&(await r.text()).includes('cardFace'));
await probe('sports-card.css',async r=>r.ok&&(await r.text()).includes('horse'));
await probe('data/horse-pedigree.v1.json',async r=>r.ok&&(await r.json()).horses.length>=872);
await probe('data/horse-media.v1.json',async r=>r.ok&&Object.keys((await r.json()).horses).length>=350);
await probe('api/health',async r=>r.ok&&(await r.json()).ok===true);
await probe('api/rankings?difficulty=easy',async r=>r.ok&&Array.isArray((await r.json()).entries));
const seed='release-'+Date.now().toString(36);
const generated=generateRandomHorseSession(pedigree,seed,{
 version:CURRENT_HORSE_GENERATOR_VERSION,difficulty:'easy',fameSnapshot
});
const payload={stageId:generated.descriptor.stageId,seed,difficulty:'easy',horseIds:generated.descriptor.cardIds,
 generatorVersion:generated.descriptor.generatorVersion};
const start=await api('runs','POST',payload);
assert.equal(start.status,200,'signed run failed: '+JSON.stringify(start.result));
assert.ok(start.result.ticket);
const state=newGame(generated.stage,seededRandom('deck:'+seed));
let k=0;
while(!state.complete){
 const move=findPlayablePlacement(state);
 assert.ok(move,'no valid next card');
 state.elapsed=600+k*700;
 assert.equal(place(state,move.cardId,move.anchorId,move.relation).ok,true);
 k++;
}
state.elapsed=15000;
const score=horseScore(state);
const record={
 submissionId:randomUUID(),displayName:'HorseSmoke',runTicket:start.result.ticket,...payload,
 elapsedMs:score.timeMs,scoreMs:score.totalMs,actions:state.actions
};
try{
 const forbidden=await api('records','POST',record,'https://example.invalid');
 assert.equal(forbidden.status,403,'cross-origin write must be blocked');
 const tamper=await api('records','POST',{...record,scoreMs:score.totalMs-15000});
 assert.equal(tamper.status,422,'impossible score must be blocked');
 const accepted=await api('records','POST',record);
 assert.equal(accepted.status,200,'score was not accepted: '+JSON.stringify(accepted.result));
 assert.equal(accepted.result.accepted,true);
 const ranking=await api('rankings?difficulty=easy&limit=100');
 assert.equal(ranking.status,200);
 assert.ok(ranking.result.yourBest,'smoke record is absent from ranking');
 console.log('HORSE_PRODUCTION_SMOKE_SUCCESS: pages, game JS/CSS/data, health, signed run, tampering blocked, ranking');
}finally{
 const deleted=await api('player','DELETE');
 assert.equal(deleted.status,200,'could not remove smoke player: '+JSON.stringify(deleted.result));
 const refreshed=await api('rankings?difficulty=easy&limit=100');
 assert.equal(refreshed.result.yourBest,null,'test ranking record not deleted');
 console.log('HORSE_PRODUCTION_SMOKE_CLEANUP_SUCCESS: temporary player deleted');
}
for(const url of ['https://hanage.app/games/putt/','https://hanage.app/games/multicolor-sweeper/']){
 const res=await fetch(url,{cache:'no-store',signal:AbortSignal.timeout(20000)});
 assert.equal(res.status,200,'previously published game hub page changed: '+url);
}
console.log('HORSE_EXISTING_GAMES_UNCHANGED');
