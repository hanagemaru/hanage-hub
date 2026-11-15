/**
 * Provision ONLY the game-specific D1 and write an ephemeral Wrangler config.
 * Uses the hub repository's already-configured Cloudflare Actions credentials.
 * This script never prints or stores API credentials.
 */
import {execFileSync} from 'node:child_process';
import {readFileSync,writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
const GAME=resolve(process.cwd(),'game');
const DATABASE='horse-pedigree-ranking';
const CONFIG=resolve(GAME,'wrangler.hub.jsonc');
const env={...process.env,WRANGLER_SEND_METRICS:'false'};
if(!env.CLOUDFLARE_API_TOKEN||!env.CLOUDFLARE_ACCOUNT_ID)
 throw Error('Hub repository Cloudflare credentials are missing');
const exec=(args)=>execFileSync('npx',['--yes','wrangler@4.148.0',...args],{cwd:GAME,env,encoding:'utf8',maxBuffer:5*1024*1024});
function list(){
 const output=exec(['d1','list','--json']);
 const result=JSON.parse(output);
 const items=Array.isArray(result)?result:result?.result;
 if(!Array.isArray(items))throw Error('Unrecognized Cloudflare D1 list format; refusing to provision');
 return items;
}
let db=list().find(db=>db.name===DATABASE);
if(!db){
 console.log('Creating separate game-only D1 database: '+DATABASE);
 exec(['d1','create',DATABASE,'--location','apac']);
 db=list().find(db=>db.name===DATABASE);
}
const uuid=db?.uuid||db?.id;
if(!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(uuid||''))
 throw Error('Dedicated D1 database UUID could not be confirmed; cancelling deployment');
const original=readFileSync(CONFIG,'utf8');
const marker='SET_DATABASE_ID_BEFORE_DEPLOY';
if(!original.includes(marker))throw Error('Expected placeholder missing; refusing to rewrite an unknown Wrangler config');
const out=original.replace(marker,uuid);
if(out.includes(marker))throw Error('Unexpected D1 config marker after replacement');
writeFileSync(CONFIG,out);
console.log('Separate D1 is ready, temporary Wrangler config bound to '+DATABASE+' ('+uuid+').');
