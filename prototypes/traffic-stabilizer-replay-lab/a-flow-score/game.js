(()=>{"use strict";
const $=id=>document.getElementById(id),canvas=$("c"),ctx=canvas.getContext("2d");
const overlay=$("overlay"),restartBtn=$("restart"),selectBtn=$("select"),pauseBtn=$("pause"),brakeBtn=$("brake"),gasBtn=$("gas");
const lapRead=$("lapRead"),jamRead=$("jamRead"),speedRead=$("speedRead"),assistRead=$("assistRead"),stateText=$("stateText"),eventText=$("eventText"),progressFill=$("progressFill"),dangerFill=$("dangerFill"),stageTag=$("stageTag"),phaseTag=$("phaseTag"),centerMain=$("centerMain"),centerSub=$("centerSub"),notice=$("notice"),sub=$("sub");

const L=360,CAR=4.5,V0=27.8,S0=2,DELTA=4,R=220,CX=300,CY=300,REGULAR_SIM_SPEED=3.75,TUTORIAL_SIM_SPEED=2.5,PLAYER_MAX=52/3.6;
const HILL=[48,132],HILL_UP=[48,88],HILL_DOWN=[88,132],CURVE=[156,224],TUNNEL=[266,326],WORKS=[18,48],MERGE_S=236;

function japanDayKey(){
  const d=new Date(Date.now()+9*60*60*1000);
  return [d.getUTCFullYear(),String(d.getUTCMonth()+1).padStart(2,"0"),String(d.getUTCDate()).padStart(2,"0")].join("-");
}
function hashText(str){
  let h=2166136261>>>0;
  for(let i=0;i<str.length;i++){h^=str.charCodeAt(i);h=Math.imul(h,16777619)}
  return h>>>0;
}
function rng32(seed){
  let a=seed>>>0;
  return()=>{a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}
}
function buildDailyConfig(){
  const key=japanDayKey(),rnd=rng32(hashText("traffic-stabilizer-"+key));
  const templates=[
    {label:"DENSE WAVE",n:22,jamLimit:9.0,seed:true},
    {label:"HAIRPIN",n:19,jamLimit:9.5,curve:true},
    {label:"HEAVY CLIMB",n:20,jamLimit:9.0,hill:true,trucks:2},
    {label:"MIXED PRESSURE",n:19,jamLimit:8.5,hill:true,curve:true,events:[
      {at:.8,cars:[false]},{at:1.8,cars:[false]},{at:2.8,cars:[false]},{at:3.8,cars:[false]}
    ]},
    {label:"TRUCK MERGE",n:19,jamLimit:9.2,hill:true,events:[
      {at:.8,cars:[false]},{at:1.8,cars:[true]},{at:2.8,cars:[false]},{at:3.8,cars:[true]}
    ]}
  ];
  const src=templates[Math.floor(rnd()*templates.length)],c=JSON.parse(JSON.stringify(src));
  c.name="DAILY CHALLENGE";c.short="DAILY";c.desc=key+" · "+src.label;c.laps=5;c.daily=true;c.pace=REGULAR_SIM_SPEED;c.dateKey=key;c.dailyLabel=src.label;
  if(c.events){
    const shift=(rnd()-.5)*.12;
    c.events=c.events.map((e,i)=>({...e,at:clamp(e.at+shift+(i%2?-.02:.02),.35,4.65),label:e.cars.some(Boolean)?"DAILY TRUCK":"DAILY MERGE"}));
  }
  return c;
}
function getStageRecords(){
  try{return JSON.parse(localStorage.getItem("trafficStabilizerStageRecords")||"{}")}catch(e){return{}}
}
function firstUnclearedStage(){
  const r=getStageRecords();
  for(let i=0;i<STAGES.length;i++)if(!r[String(i)]?.cleared)return i;
  return STAGES.length-1;
}
function saveStageRecord(index,time,jam){
  try{
    const all=getStageRecords(),key=String(index),old=all[key]||{};
    all[key]={cleared:true,bestTime:old.bestTime==null?time:Math.min(old.bestTime,time),bestJam:old.bestJam==null?jam:Math.min(old.bestJam,jam)};
    localStorage.setItem("trafficStabilizerStageRecords",JSON.stringify(all));
  }catch(e){}
}
function getDailyRecord(key=japanDayKey()){
  try{return JSON.parse(localStorage.getItem("trafficStabilizerDaily:"+key)||"{}")}catch(e){return{}}
}
function noteDailyAttempt(key){
  try{const r=getDailyRecord(key);r.attempts=(r.attempts||0)+1;localStorage.setItem("trafficStabilizerDaily:"+key,JSON.stringify(r))}catch(e){}
}
function saveDailyRecord(key,time,jam){
  try{
    const r=getDailyRecord(key);r.cleared=true;r.bestTime=r.bestTime==null?time:Math.min(r.bestTime,time);r.bestJam=r.bestJam==null?jam:Math.min(r.bestJam,jam);
    localStorage.setItem("trafficStabilizerDaily:"+key,JSON.stringify(r));
  }catch(e){}
}
function buildEndlessEvents(){
  const events=[];
  for(let lap=2;lap<=40;lap+=2)events.push({at:lap,cars:[false],label:"FLOW +1"});
  for(let lap=5;lap<=40;lap+=5)events.push({at:lap+.15,cars:[true],label:"TRUCK MERGE"});
  return events.sort((a,b)=>a.at-b.at);
}
const STAGES=[
 {name:"PHANTOM WAVE",short:"TUTORIAL",desc:"車間を作って渋滞波を吸収",n:22,laps:3,jamLimit:8.5,seed:true,tutorial:true,pace:TUTORIAL_SIM_SPEED},
 {name:"ON-RAMP",short:"MERGE",desc:"合流で増える密度に対応",n:19,laps:5,jamLimit:8.5,events:[
   {at:.4,cars:[false]},{at:1.2,cars:[false]},{at:2.0,cars:[false]},{at:2.8,cars:[false]},{at:3.6,cars:[false]},{at:4.3,cars:[false]}
 ]},
 {name:"HILL CREST",short:"HILL",desc:"上り→頂上→下り。大型車が上りで失速",n:19,laps:5,jamLimit:8.5,hill:true,trucks:1},
 {name:"HAIRPIN",short:"CURVE",desc:"急カーブで速度差が生まれる",n:19,laps:5,jamLimit:9.5,curve:true},
 {name:"TUNNEL",short:"TUNNEL",desc:"半透明の車列を先読みする",n:20,laps:5,jamLimit:8.5,tunnel:true},
 {name:"MIXED COURSE",short:"MIXED",desc:"坂・カーブ・合流を組み合わせる",n:19,laps:5,jamLimit:8.5,hill:true,curve:true,events:[
   {at:.8,cars:[false]},{at:1.8,cars:[false]},{at:2.8,cars:[false]},{at:3.8,cars:[false]}
 ]},
 {name:"RUSH HOUR",short:"RUSH",desc:"全要素＋高密度",n:20,laps:5,jamLimit:8.5,hill:true,curve:true,tunnel:true,trucks:1,events:[
   {at:.7,cars:[false]},{at:1.5,cars:[false]},{at:2.3,cars:[false]},{at:3.1,cars:[false]},{at:3.9,cars:[false]}
 ]},
 {name:"DENSE WAVE",short:"C2 WAVE",desc:"高密度の自然渋滞波を吸収",n:23,laps:5,jamLimit:9.0,seed:true},
 {name:"MERGE SURGE",short:"C2 MERGE",desc:"連続する2台合流をさばく",n:21,laps:5,jamLimit:8.5,events:[
   {at:.5,cars:[false,false]},{at:1.4,cars:[false,false]},{at:2.4,cars:[false,false]},{at:3.4,cars:[false,false]},{at:4.3,cars:[false,false]}
 ]},
 {name:"HEAVY CLIMB",short:"C2 HILL",desc:"2台のトラックが坂で流れを乱す",n:21,laps:5,jamLimit:9.0,hill:true,trucks:2},
 {name:"BLIND BEND",short:"C2 BLIND",desc:"ヘアピンと半透明トンネルを読む",n:20,laps:5,jamLimit:9.5,curve:true,tunnel:true},
 {name:"TRUCK MERGE",short:"C2 TRUCK",desc:"坂の途中へ大型車が流入",n:19,laps:5,jamLimit:9.2,hill:true,events:[
   {at:.8,cars:[false]},{at:1.8,cars:[true]},{at:2.8,cars:[false]},{at:3.8,cars:[true]}
 ]},
 {name:"PRESSURE LOOP",short:"C2 MIX",desc:"全要因が連続して現れる",n:21,laps:5,jamLimit:9.2,hill:true,curve:true,tunnel:true,trucks:1,events:[
   {at:.7,cars:[false]},{at:1.7,cars:[false]},{at:2.7,cars:[false]},{at:3.7,cars:[false]}
 ]},
 {name:"PEAK HOUR",short:"C2 FINAL",desc:"高密度・大型車・連続合流の総合面",n:21,laps:5,jamLimit:9.2,hill:true,curve:true,tunnel:true,trucks:2,pace:4.0,events:[
   {at:.6,cars:[false]},{at:1.4,cars:[false,false]},{at:2.3,cars:[true]},{at:3.2,cars:[false,false]},{at:4.1,cars:[true]}
 ]}
,
 {name:"WORK ZONE",short:"C3 WORKS",desc:"工事区間で生まれる速度差を吸収",n:20,laps:5,jamLimit:9.2,works:true},
 {name:"WORK TRUCK",short:"C3 TRUCK",desc:"工事区間＋低速トラック",n:20,laps:5,jamLimit:9.3,works:true,trucks:1},
 {name:"HILL WORKS",short:"C3 HILL",desc:"工事の直後に上り坂",n:20,laps:5,jamLimit:9.4,works:true,hill:true,trucks:1},
 {name:"WORK HAIRPIN",short:"C3 CURVE",desc:"工事区間＋急カーブ",n:20,laps:5,jamLimit:9.5,works:true,curve:true,trucks:1},
 {name:"TUNNEL WORKS",short:"C3 TUNNEL",desc:"工事区間＋半透明トンネル",n:22,laps:5,jamLimit:8.7,works:true,tunnel:true,trucks:1},
 {name:"CONSTRUCTION LOOP",short:"C3 MIX",desc:"工事・坂・カーブ・合流",n:19,laps:5,jamLimit:9.5,works:true,hill:true,curve:true,trucks:1,events:[
   {at:.8,cars:[false]},{at:1.8,cars:[false]},{at:2.8,cars:[false]},{at:3.8,cars:[false]}
 ]},
 {name:"DOUBLE BOTTLENECK",short:"C3 FINAL",desc:"工事＋坂＋大型車2台",n:21,laps:5,jamLimit:10.0,works:true,hill:true,trucks:2},

 {name:"DENSE MASTER",short:"C4 WAVE",desc:"高密度の自然渋滞波",n:24,laps:5,jamLimit:9.7,seed:true},
 {name:"CLIMB MASTER",short:"C4 HILL",desc:"大型車3台の上り坂",n:21,laps:5,jamLimit:8.5,hill:true,trucks:3},
 {name:"HAIRPIN MASTER",short:"C4 CURVE",desc:"高密度ヘアピンを安定させる",n:20,laps:5,jamLimit:9.5,curve:true},
 {name:"TRUCK MERGE MASTER",short:"C4 MERGE",desc:"坂で大型車合流を繰り返す",n:19,laps:5,jamLimit:9.2,hill:true,events:[
   {at:.8,cars:[false]},{at:1.8,cars:[true]},{at:2.8,cars:[false]},{at:3.8,cars:[true]}
 ]},
 {name:"DENSE WORKS",short:"C4 WORKS",desc:"高密度の工事区間＋トラック",n:21,laps:5,jamLimit:9.3,works:true,trucks:1},
 {name:"MERGE MASTER",short:"C4 PRESS",desc:"坂で連続する車・大型車合流",n:20,laps:5,jamLimit:9.8,hill:true,trucks:1,events:[
   {at:.6,cars:[false]},{at:1.4,cars:[true]},{at:2.2,cars:[false]},{at:3.0,cars:[true]},{at:3.8,cars:[false]}
 ]},
 {name:"FINAL WAVE",short:"C4 FINAL",desc:"高密度の渋滞波＋上り坂",n:22,laps:5,jamLimit:9.8,seed:true,hill:true,trucks:1}
];
const ENDLESS={
 name:"ENDLESS FLOW",short:"ENDLESS",desc:"JAM 100%まで何周走れるか",n:18,jamLimit:9.0,
 hill:true,curve:true,tunnel:true,endless:true,pace:REGULAR_SIM_SPEED,events:buildEndlessEvents()
};
let DAILY=buildDailyConfig();
const FLOW_ATTACK={name:"FLOW ATTACK",short:"SCORE",desc:"5周で最高FLOW SCOREを狙う",n:19,laps:5,jamLimit:9.0,hill:true,curve:true,flowAttack:true,pace:REGULAR_SIM_SPEED,events:[
 {at:.8,cars:[false],label:"FLOW +1"},{at:1.8,cars:[false],label:"FLOW +1"},{at:2.8,cars:[false],label:"FLOW +1"},{at:3.8,cars:[false],label:"FLOW +1"}
]};

let stageIndex=0,gameMode="campaign",cars=[],rampCars=[],player=null,started=false,running=false,paused=false,lastTs=0,totalDist=0,nextId=100,eventIndex=0,noticeTimer=0,autoBrake=false,failClock=0,resultShown=false,elapsedReal=0,maxJamPct=0,tutorialStep=0,attemptCounted=false,flowScore=0,flowMult=1,flowClock=0,maxFlowMult=1;
let trackRaw=[],trackCum=[],trackTotal=0;
const input={gas:false,brake:false};

function cfg(){return gameMode==="endless"?ENDLESS:gameMode==="daily"?DAILY:gameMode==="flow"?FLOW_ATTACK:STAGES[stageIndex]}
function clamp(v,a,b){return Math.max(a,Math.min(b,v))}
function forward(a,b){let d=b-a;while(d<0)d+=L;while(d>=L)d-=L;return d}
function inZone(s,z){return s>=z[0]&&s<=z[1]}
function zoneU(s,z){return inZone(s,z)?(s-z[0])/(z[1]-z[0]):-1}
function sortCars(){cars.sort((a,b)=>a.s-b.s)}
function gaps(){sortCars();const g=new Map();for(let i=0;i<cars.length;i++){const c=cars[i],lead=cars[(i+1)%cars.length];g.set(c,Math.max(.05,forward(c.s,lead.s)-CAR))}return g}
function showNotice(t){notice.textContent=t;notice.classList.add("show");noticeTimer=1.5}
function baseCar(i,s,v){return{id:i,s,v,player:i===0,truck:false,style:[.91,.96,1,1.03][i%4],cautious:i%4===0,jamLevel:0}}

function rawTrackPoint(t){
  const s=t*L,a=-Math.PI/2+2*Math.PI*t;
  let r=R;
  if(cfg().curve){
    const u=zoneU(s,CURVE);
    if(u>=0){
      const env=Math.sin(Math.PI*u);
      r+=48*env*Math.sin(2*Math.PI*u);
    }
  }
  let x=CX+r*Math.cos(a),y=CY+r*Math.sin(a);
  if(cfg().hill){
    const u=zoneU(s,HILL);
    if(u>=0){
      const e=Math.sin(Math.PI*u);
      x-=8*e;
      y-=5*e;
    }
  }
  return{x,y};
}
function buildTrack(){
  const N=900;trackRaw=[];trackCum=[0];trackTotal=0;
  for(let i=0;i<=N;i++)trackRaw.push(rawTrackPoint(i/N));
  for(let i=1;i<trackRaw.length;i++){
    const dx=trackRaw[i].x-trackRaw[i-1].x,dy=trackRaw[i].y-trackRaw[i-1].y;
    trackTotal+=Math.hypot(dx,dy);trackCum.push(trackTotal);
  }
}
function roadPoint(s,lateral=0){
  s=((s%L)+L)%L;
  const target=s/L*trackTotal;
  let lo=0,hi=trackCum.length-1;
  while(lo+1<hi){const mid=(lo+hi)>>1;if(trackCum[mid]<=target)lo=mid;else hi=mid}
  const p0=trackRaw[lo],p1=trackRaw[Math.min(lo+1,trackRaw.length-1)],seg=Math.max(.0001,trackCum[Math.min(lo+1,trackCum.length-1)]-trackCum[lo]),u=(target-trackCum[lo])/seg;
  const x=p0.x+(p1.x-p0.x)*u,y=p0.y+(p1.y-p0.y)*u,dx=p1.x-p0.x,dy=p1.y-p0.y,len=Math.max(.0001,Math.hypot(dx,dy)),a=Math.atan2(dy,dx),nx=-dy/len,ny=dx/len;
  return{x:x+nx*lateral,y:y+ny*lateral,a,nx,ny};
}
function strokeTrack(color,width,lateral=0,start=0,end=L){
  const steps=Math.max(12,Math.ceil((end-start)/2));
  ctx.beginPath();
  for(let i=0;i<=steps;i++){
    const s=start+(end-start)*i/steps,p=roadPoint(s,lateral);
    if(i===0)ctx.moveTo(p.x,p.y);else ctx.lineTo(p.x,p.y);
  }
  ctx.strokeStyle=color;ctx.lineWidth=width;ctx.lineCap="round";ctx.lineJoin="round";ctx.stroke();
}
function drawCrossBar(s,color,width=3,half=33){
  const p=roadPoint(s),a=p.a,nx=-Math.sin(a),ny=Math.cos(a);
  ctx.beginPath();ctx.moveTo(p.x-nx*half,p.y-ny*half);ctx.lineTo(p.x+nx*half,p.y+ny*half);ctx.strokeStyle=color;ctx.lineWidth=width;ctx.stroke();
}
function drawChevron(s,lateral,color,dir=1){
  const p=roadPoint(s,lateral);ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.a);
  ctx.strokeStyle=color;ctx.lineWidth=4;ctx.beginPath();
  const d=dir;ctx.moveTo(-7*d,-8);ctx.lineTo(6*d,0);ctx.lineTo(-7*d,8);ctx.stroke();ctx.restore();
}

function reset(i=stageIndex,nextMode=gameMode){
  gameMode=nextMode;if(gameMode==="campaign")stageIndex=i;if(gameMode==="daily")DAILY=buildDailyConfig();const s=cfg();buildTrack();cars=[];rampCars=[];eventIndex=0;nextId=100;
  if(s.seed){
    const cluster=new Set([8,9,10,11,12,13,14]),small=5.5,totalGap=L-s.n*CAR,large=(totalGap-cluster.size*small)/(s.n-cluster.size);
    let pos=0;
    for(let k=0;k<s.n;k++){
      const gap=cluster.has(k)?small:large,vk=cluster.has(k)?9:([6,7].includes(k)?17:27),c=baseCar(k,pos,vk/3.6);
      if(cluster.has(k))c.jamLevel=.35;else if([6,7].includes(k))c.jamLevel=.18;
      cars.push(c);pos+=CAR+gap;
    }
  }else{
    for(let k=0;k<s.n;k++)cars.push(baseCar(k,k*L/s.n,24/3.6));
  }
  sortCars();
  if(s.trucks){for(let k=1;k<=s.trucks;k++){const idx=Math.floor(k*cars.length/(s.trucks+1));if(cars[idx]&&!cars[idx].player)cars[idx].truck=true}}
  player=cars.find(c=>c.player);started=false;running=true;paused=false;lastTs=0;totalDist=0;noticeTimer=0;autoBrake=false;failClock=0;resultShown=false;elapsedReal=0;maxJamPct=0;tutorialStep=0;attemptCounted=false;flowScore=0;flowMult=1;flowClock=0;maxFlowMult=1;
  input.gas=input.brake=false;brakeBtn.classList.remove("held");gasBtn.classList.remove("held");pauseBtn.textContent="PAUSE";overlay.classList.add("hidden");
  stageTag.textContent=gameMode==="endless"?"ENDLESS FLOW":gameMode==="daily"?"DAILY CHALLENGE":gameMode==="flow"?"FLOW ATTACK":`STAGE ${stageIndex+1}/${STAGES.length} · ${s.short}`;sub.textContent=s.desc;render();
}
function neighborsAt(s){sortCars();let leader=cars.find(c=>c.s>s);if(!leader)leader=cars[0];const li=cars.indexOf(leader);return{follower:cars[(li-1+cars.length)%cars.length],leader}}
function queueRamp(types,label){for(let i=0;i<types.length;i++)rampCars.push({p:Math.max(.03,.50-i*.18),vp:.14,truck:types[i]});showNotice(label)}
function updateEvents(){const es=cfg().events||[];while(eventIndex<es.length&&totalDist>=es[eventIndex].at*L){const e=es[eventIndex];queueRamp(e.cars,e.label||"ON-RAMP");eventIndex++}}
function rampGeom(){
  const ep=roadPoint(MERGE_S),tx=Math.cos(ep.a),ty=Math.sin(ep.a),nx=-Math.sin(ep.a),ny=Math.cos(ep.a);
  return{p2:{x:ep.x,y:ep.y},p1:{x:ep.x-tx*72+nx*30,y:ep.y-ty*72+ny*30},p0:{x:ep.x-tx*145+nx*112,y:ep.y-ty*145+ny*112}};
}
function quadPoint(p0,p1,p2,t){const u=1-t;return{x:u*u*p0.x+2*u*t*p1.x+t*t*p2.x,y:u*u*p0.y+2*u*t*p1.y+t*t*p2.y}}
function updateRamp(dt){
  if(!rampCars.length)return;rampCars.sort((a,b)=>b.p-a.p);
  for(let i=0;i<rampCars.length;i++){const rc=rampCars[i],ahead=rampCars[i-1];let lim=.94;if(ahead)lim=Math.min(lim,ahead.p-.14);if(rc.p<lim)rc.p=Math.min(lim,rc.p+rc.vp*dt)}
  const f=rampCars[0];
  if(f&&f.p>=.93){
    const m=neighborsAt(MERGE_S),back=forward(m.follower.s,MERGE_S)-CAR/2,front=forward(MERGE_S,m.leader.s)-CAR/2;
    if(back>5.0&&front>5.5){
      cars.push({id:nextId++,s:MERGE_S,v:Math.min(4.8,m.leader.v,m.follower.v+1),player:false,truck:f.truck,style:f.truck?.94:1,cautious:false,jamLevel:0});
      rampCars.shift();showNotice(f.truck?"TRUCK MERGED":"CAR MERGED");
    }
  }
}

function npcAccel(c,lead,gap){
  const s=cfg(),dv=c.v-lead.v,T=c.truck?1.28:1,A=c.truck?.30:.58,B=c.truck?1.02:1.25;let Vdes=c.truck?22/3.6:V0;
  if(s.works&&inZone(c.s,WORKS))Vdes=Math.min(Vdes,(c.truck?13:(c.cautious?16:19)*c.style)/3.6);
  if(s.hill&&inZone(c.s,HILL_UP))Vdes=Math.min(Vdes,(c.truck?12:20*c.style)/3.6);
  if(s.curve&&inZone(c.s,CURVE))Vdes=Math.min(Vdes,((c.cautious?15:21)*c.style)/3.6);
  if(s.tunnel&&inZone(c.s,TUNNEL))Vdes=Math.min(Vdes,((c.cautious?17:22)*Math.min(1,c.style+.03))/3.6);
  const st=S0+Math.max(0,c.v*T+c.v*dv/(2*Math.sqrt(Math.max(.01,A*B))));
  return clamp(A*(1-Math.pow(c.v/Math.max(.8,Vdes),DELTA)-Math.pow(st/Math.max(.1,gap),2)),-5,2);
}
function playerAccel(lead,gap){
  let manual=input.brake?-1.4:input.gas?1.2:-.03;
  if(cfg().hill&&inZone(player.s,HILL_UP)&&manual>-.5)manual-=.18;
  if(player.v>=PLAYER_MAX&&manual>0)manual=0;
  const safe=npcAccel(player,lead,gap),closing=player.v>lead.v+.4;
  autoBrake=(gap<15.5||closing)&&safe<manual-.12;if(autoBrake)manual=Math.min(manual,safe);if(gap<3)manual=Math.min(manual,-5);
  return clamp(manual,-5,1.55);
}
function stepPhysics(dt){
  sortCars();const gs=gaps(),acc=new Map();
  for(let i=0;i<cars.length;i++){const c=cars[i],lead=cars[(i+1)%cars.length],gap=gs.get(c);acc.set(c,c.player?playerAccel(lead,gap):npcAccel(c,lead,gap))}
  for(const c of cars)c.v=Math.max(0,c.v+acc.get(c)*dt);
  for(const c of cars)c.s=(c.s+c.v*dt)%L;
  totalDist+=player.v*dt;
}
function updateCongestion(dt){
  sortCars();const gs=gaps();
  for(let i=0;i<cars.length;i++){
    const c=cars[i],lead=cars[(i+1)%cars.length],km=c.v*3.6,gap=gs.get(c),closing=Math.max(0,(c.v-lead.v)*3.6),sp=clamp((24-km)/16,0,1),gp=clamp((17-gap)/9,0,1),cp=clamp(closing/8,0,1),raw=clamp(sp*(.28+.72*gp)+.12*cp,0,1),tau=raw>c.jamLevel?3.5:1.3;
    c.jamLevel+=(raw-c.jamLevel)*Math.min(1,dt/tau);
  }
}
function jamStats(){
  sortCars();const gs=gaps(),levels=cars.map(c=>c.jamLevel),n=levels.length,w=Math.min(12,n);let best=0;
  if(n<=w)best=levels.reduce((a,b)=>a+b,0);
  else{const ext=levels.concat(levels.slice(0,w-1));let score=ext.slice(0,w).reduce((a,b)=>a+b,0);best=score;for(let i=1;i<n;i++){score+=ext[i+w-1]-ext[i-1];best=Math.max(best,score)}}
  return{gs,best,jamPct:clamp(best/cfg().jamLimit*100,0,100),playerK:player.v*3.6,gap:gs.get(player)};
}
function update(realDt){
  if(!started){render();return}
  elapsedReal+=realDt;
  let rem=realDt*(cfg().pace||REGULAR_SIM_SPEED);
  while(rem>0){const dt=Math.min(.035,rem);updateEvents();updateRamp(dt);updateCongestion(dt);stepPhysics(dt);rem-=dt}
  const st=jamStats();
  maxJamPct=Math.max(maxJamPct,st.jamPct);
  if(cfg().flowAttack){
    const speedQuality=clamp((st.playerK-12)/18,0,1),smoothQuality=clamp(1-st.jamPct/100,0,1);
    if(st.jamPct<45&&st.playerK>20)flowClock+=realDt;
    else if(st.jamPct>70)flowClock=0;
    else flowClock=Math.max(0,flowClock-realDt*.45);
    flowMult=1+Math.min(2,flowClock/10);
    maxFlowMult=Math.max(maxFlowMult,flowMult);
    const distanceStep=realDt*(cfg().pace||REGULAR_SIM_SPEED)*player.v;
    flowScore+=distanceStep*(.45+.55*speedQuality)*(.40+.60*smoothQuality)*flowMult*2;
  }
  if(cfg().tutorial){
    if(tutorialStep===0&&input.brake)tutorialStep=1;
    if(tutorialStep===1&&st.gap>=16)tutorialStep=2;
    if(tutorialStep===2&&st.jamPct<=45&&elapsedReal>4)tutorialStep=3;
  }
  failClock=st.best>=cfg().jamLimit?Math.min(.8,failClock+realDt):Math.max(0,failClock-realDt*1.2);
  if(!cfg().endless&&totalDist>=cfg().laps*L){finish(true);return}
  if(failClock>=.8){finish(false);return}
  if(noticeTimer>0){noticeTimer-=realDt;if(noticeTimer<=0)notice.classList.remove("show")}
  render(st);
}
function getEndlessBest(){
  try{return Number(localStorage.getItem("trafficStabilizerEndlessBest")||0)}catch(e){return 0}
}
function setEndlessBest(v){
  try{localStorage.setItem("trafficStabilizerEndlessBest",String(v))}catch(e){}
}
function getFlowBest(){try{return Number(localStorage.getItem("trafficStabilizerFlowBest")||0)}catch(e){return 0}}
function setFlowBest(v){try{localStorage.setItem("trafficStabilizerFlowBest",String(v))}catch(e){}}
function formatTime(sec){
  const m=Math.floor(sec/60),s=sec-m*60;
  return `${String(m).padStart(2,"0")}:${s.toFixed(1).padStart(4,"0")}`;
}
function finish(ok){
  if(resultShown)return;running=false;resultShown=true;const st=jamStats();
  if(cfg().endless){
    const laps=totalDist/L,oldBest=getEndlessBest(),isNew=laps>oldBest+.005,best=Math.max(oldBest,laps);
    if(isNew)setEndlessBest(best);
    overlay.innerHTML=`<div class="overlayCard"><h2 class="bad">GRIDLOCK</h2><p>ENDLESS FLOW</p><div class="endlessScore">${laps.toFixed(1)} LAPS</div>${isNew?'<div class="bestNote new">NEW PERSONAL BEST</div>':""}<div class="resultStats three"><div class="resultStat"><span>BEST</span><b>${best.toFixed(1)}</b></div><div class="resultStat"><span>MAX JAM</span><b>100%</b></div><div class="resultStat"><span>TIME</span><b>${formatTime(elapsedReal)}</b></div></div><div class="resultActions"><button id="retryBtn">RETRY</button><button id="modeBtn">MODE SELECT</button></div></div>`;
    overlay.classList.remove("hidden");
    $("retryBtn").onclick=()=>reset(0,"endless");$("modeBtn").onclick=showModeSelect;return;
  }
  if(cfg().flowAttack){
    const score=Math.round(flowScore),oldBest=getFlowBest(),isNew=score>oldBest,best=Math.max(score,oldBest);if(isNew)setFlowBest(best);
    overlay.innerHTML=`<div class="overlayCard"><h2 class="${ok?"good":"bad"}">${ok?"FLOW FINISH":"GRIDLOCK"}</h2><div class="flowScore">${score.toLocaleString()}</div>${isNew?'<div class="bestNote new">NEW FLOW BEST</div>':""}<div class="resultStats three"><div class="resultStat"><span>BEST</span><b>${best.toLocaleString()}</b></div><div class="resultStat"><span>MAX MULT</span><b>x${maxFlowMult.toFixed(1)}</b></div><div class="resultStat"><span>MAX JAM</span><b>${Math.round(maxJamPct)}%</b></div></div><div class="resultActions"><button id="retryBtn">RETRY</button><button id="modeBtn">MODE SELECT</button></div></div>`;
    overlay.classList.remove("hidden");$("retryBtn").onclick=()=>reset(0,"flow");$("modeBtn").onclick=showModeSelect;return;
  }
  if(cfg().daily){
    const key=cfg().dateKey,oldDaily=getDailyRecord(key);
    const newDailyTime=ok&&(!oldDaily.cleared||elapsedReal<(oldDaily.bestTime??Infinity)-.05),newDailyJam=ok&&(!oldDaily.cleared||maxJamPct<(oldDaily.bestJam??Infinity)-.2);
    if(ok)saveDailyRecord(key,elapsedReal,maxJamPct);
    const rec=getDailyRecord(key),dailyBest=(newDailyTime||newDailyJam)?'<div class="bestNote new">NEW DAILY BEST</div>':"";
    overlay.innerHTML=ok
      ?`<div class="overlayCard"><h2 class="good">DAILY CLEAR</h2><div class="dailyDate">${key}</div><div class="resultStats"><div class="resultStat"><span>MAX JAM</span><b>${Math.round(maxJamPct)}%</b></div><div class="resultStat"><span>TIME</span><b>${formatTime(elapsedReal)}</b></div></div><div class="dailyScore">BEST ${rec.bestTime!=null?formatTime(rec.bestTime):"--"} · JAM ${rec.bestJam!=null?Math.round(rec.bestJam)+"%":"--"} · ${rec.attempts||1} ATTEMPT(S)</div>${dailyBest}<div class="resultActions"><button id="retryBtn">RETRY</button><button id="modeBtn">MODE SELECT</button></div></div>`
      :`<div class="overlayCard"><h2 class="bad">DAILY GRIDLOCK</h2><div class="dailyDate">${key}</div><div class="dailyScore">${rec.attempts||1} ATTEMPT(S) TODAY</div><div class="resultActions"><button id="retryBtn">RETRY</button><button id="modeBtn">MODE SELECT</button></div></div>`;
    overlay.classList.remove("hidden");$("retryBtn").onclick=()=>reset(0,"daily");$("modeBtn").onclick=showModeSelect;return;
  }
  const last=stageIndex===STAGES.length-1,oldRec=getStageRecords()[String(stageIndex)]||null;
  const newTime=ok&&(!oldRec||elapsedReal<(oldRec.bestTime??Infinity)-.05),newJam=ok&&(!oldRec||maxJamPct<(oldRec.bestJam??Infinity)-.2);
  if(ok)saveStageRecord(stageIndex,elapsedReal,maxJamPct);
  const bestMsg=(newTime||newJam)?`<div class="bestNote new">NEW BEST${newTime&&newJam?" · TIME + JAM":newTime?" · TIME":" · JAM"}</div>`:"";
  overlay.innerHTML=ok
    ?`<div class="overlayCard"><h2 class="good">FINISH</h2><p>${cfg().name}</p><div class="resultStats"><div class="resultStat"><span>MAX JAM</span><b>${Math.round(maxJamPct)}%</b></div><div class="resultStat"><span>TIME</span><b>${formatTime(elapsedReal)}</b></div></div>${bestMsg}<button id="nextBtn" class="mainBtn">${last?"MODE SELECT":"NEXT STAGE"}</button></div>`
    :`<div class="overlayCard"><h2 class="bad">GRIDLOCK</h2><p>JAM LEVEL 100%</p><div class="resultStats"><div class="resultStat"><span>MAX JAM</span><b>100%</b></div><div class="resultStat"><span>TIME</span><b>${formatTime(elapsedReal)}</b></div></div><button id="retryBtn" class="mainBtn">RETRY</button></div>`;
  overlay.classList.remove("hidden");
  if(ok)$("nextBtn").onclick=()=>last?showModeSelect():reset(stageIndex+1,"campaign");else $("retryBtn").onclick=()=>reset(stageIndex,"campaign");
}

function drawWorkFeatures(){
  if(!cfg().works)return;
  strokeTrack("rgba(224,132,36,.34)",66,0,WORKS[0],WORKS[1]);
  for(let s=WORKS[0]+3;s<WORKS[1]-2;s+=6){
    for(const lat of [-29,29]){
      const p=roadPoint(s,lat);ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.a);
      ctx.fillStyle="#f28b22";ctx.strokeStyle="#f8e2bc";ctx.lineWidth=1;
      ctx.beginPath();ctx.moveTo(-4,-4);ctx.lineTo(5,0);ctx.lineTo(-4,4);ctx.closePath();ctx.fill();ctx.stroke();ctx.restore();
    }
  }
}
function drawHillTerrain(){
  if(!cfg().hill)return;
  strokeTrack("rgba(126,91,49,.22)",112,0,HILL[0],HILL[1]);
  for(const s of [54,64,74,84,96,108,120,130]){
    const p=roadPoint(s,48),q=roadPoint(s,-48);ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(q.x,q.y);ctx.strokeStyle="rgba(117,88,50,.28)";ctx.lineWidth=2;ctx.stroke();
  }
}
function drawRoadBase(){
  drawHillTerrain();
  strokeTrack("#596064",88);
  strokeTrack("#30343a",70);
}
function drawHillFeatures(){
  if(!cfg().hill)return;
  strokeTrack("rgba(173,118,40,.42)",66,0,HILL_UP[0],HILL_UP[1]);
  strokeTrack("rgba(103,137,92,.28)",66,0,HILL_DOWN[0],HILL_DOWN[1]);
  for(const s of [57,68,79])drawChevron(s,0,"#fff1c7",1);
  drawCrossBar(88,"#fff6d2",5,35);drawCrossBar(91,"rgba(255,246,210,.65)",2,30);
  for(const s of [99,110,121])drawChevron(s,0,"#e3f3d7",-1);
  const crest=roadPoint(89,46);ctx.beginPath();ctx.arc(crest.x,crest.y,7,0,Math.PI*2);ctx.fillStyle="#f6e3a3";ctx.fill();ctx.strokeStyle="#7b5e2e";ctx.lineWidth=2;ctx.stroke();
}
function drawCurveFeatures(){
  if(!cfg().curve)return;
  strokeTrack("rgba(111,79,145,.30)",66,0,CURVE[0],CURVE[1]);
  strokeTrack("#f0c84b",8,43,CURVE[0],CURVE[1]);
  for(const s of [164,176,188,200,212,222])drawChevron(s,43,"#202020",1);
}
function drawTunnel(){
  if(!cfg().tunnel)return;
  strokeTrack("rgba(19,24,29,.94)",68,0,TUNNEL[0],TUNNEL[1]);
  for(const edge of [TUNNEL[0],TUNNEL[1]])drawCrossBar(edge,"#c7d0d6",9,46);
  for(let s=TUNNEL[0]+8;s<TUNNEL[1]-4;s+=12){
    for(const lat of [-25,25]){const p=roadPoint(s,lat);ctx.beginPath();ctx.arc(p.x,p.y,3,0,Math.PI*2);ctx.fillStyle="#f5e9aa";ctx.fill()}
  }
}
function drawRamp(){
  if(!(cfg().events||[]).length)return;
  const rg=rampGeom();
  ctx.beginPath();ctx.moveTo(rg.p0.x,rg.p0.y);ctx.quadraticCurveTo(rg.p1.x,rg.p1.y,rg.p2.x,rg.p2.y);ctx.strokeStyle="#596568";ctx.lineWidth=40;ctx.stroke();
  ctx.beginPath();ctx.moveTo(rg.p0.x,rg.p0.y);ctx.quadraticCurveTo(rg.p1.x,rg.p1.y,rg.p2.x,rg.p2.y);ctx.strokeStyle="#354146";ctx.lineWidth=30;ctx.stroke();
  ctx.setLineDash([10,8]);ctx.beginPath();ctx.moveTo(rg.p0.x,rg.p0.y);ctx.quadraticCurveTo(rg.p1.x,rg.p1.y,rg.p2.x,rg.p2.y);ctx.strokeStyle="#d8d3c1";ctx.lineWidth=2;ctx.stroke();ctx.setLineDash([]);
}
function drawLaneMarks(){
  ctx.setLineDash([20,16]);strokeTrack("#d8d3c1",3);ctx.setLineDash([]);
}
function drawGapHighlight(st){
  const end=player.s+Math.min(st.gap,60);
  strokeTrack("rgba(43,100,216,.18)",78,0,player.s,end);
}
function drawRoad(){
  ctx.fillStyle="#cbd1c6";ctx.fillRect(0,0,600,600);
  drawRoadBase();drawWorkFeatures();drawHillFeatures();drawCurveFeatures();drawTunnel();drawRamp();drawLaneMarks();
}
function drawVehicleShape(x,y,a,truck,fill,stroke,lineWidth=1.4,alpha=1){
  ctx.save();ctx.globalAlpha*=alpha;ctx.translate(x,y);ctx.rotate(a);ctx.lineWidth=lineWidth;ctx.strokeStyle=stroke;ctx.fillStyle=fill;
  if(truck){
    ctx.fillRect(-14,-6,17,12);ctx.strokeRect(-14,-6,17,12);
    ctx.fillRect(4,-5,9,10);ctx.strokeRect(4,-5,9,10);
    ctx.fillStyle="rgba(220,235,240,.65)";ctx.fillRect(7,-4,4,8);
  }else{
    ctx.beginPath();ctx.moveTo(-9,-5);ctx.lineTo(5,-5);ctx.lineTo(9,-3);ctx.lineTo(9,3);ctx.lineTo(5,5);ctx.lineTo(-9,5);ctx.closePath();ctx.fill();ctx.stroke();
    ctx.fillStyle="rgba(220,235,240,.72)";ctx.fillRect(2,-3.6,3.8,7.2);
  }
  ctx.fillStyle="rgba(20,20,20,.65)";
  if(truck){ctx.fillRect(-10,-7,5,2);ctx.fillRect(-10,5,5,2);ctx.fillRect(7,-6,4,1.7);ctx.fillRect(7,4.3,4,1.7)}
  else{ctx.fillRect(-5,-6,4,1.5);ctx.fillRect(-5,4.5,4,1.5);ctx.fillRect(4,-6,3,1.5);ctx.fillRect(4,4.5,3,1.5)}
  ctx.restore();
}
function drawRampCars(){
  if(!rampCars.length)return;const rg=rampGeom();
  for(const rc of rampCars){
    const p=quadPoint(rg.p0,rg.p1,rg.p2,clamp(rc.p,0,1)),p2=quadPoint(rg.p0,rg.p1,rg.p2,clamp(rc.p+.01,0,1)),a=Math.atan2(p2.y-p.y,p2.x-p.x);
    drawVehicleShape(p.x,p.y,a,rc.truck,rc.truck?"#555":"#e9e3d6","#3f7770",2);
  }
}
function sev(l){return l<.20?null:l<.42?"#e7c64b":l<.68?"#e78b2f":"#d84735"}
function ui(p){return p<35?"#2f8b57":p<58?"#c5a528":p<82?"#e78b2f":"#d84735"}
function drawCar(c){
  const p=roadPoint(c.s),sc=sev(c.jamLevel);let fill=c.truck?"#555":"#e9e3d6";
  if(!c.player&&sc)fill=sc;if(c.player)fill="#2b64d8";
  const stroke=c.player?(sc||"#fff"):"rgba(0,0,0,.45)",alpha=(cfg().tunnel&&inZone(c.s,TUNNEL))?(c.player?.55:.34):1;
  drawVehicleShape(p.x,p.y,p.a,c.truck,fill,stroke,c.player?4:1.4,alpha);
}
function render(pre){
  const st=pre||jamStats();drawRoad();drawGapHighlight(st);drawRampCars();for(const c of cars)drawCar(c);
  const raw=totalDist/L,lap=cfg().endless?Math.floor(raw)+1:Math.min(cfg().laps,Math.floor(raw)+1),frac=raw%1,pct=Math.round(st.jamPct),col=ui(st.jamPct);
  lapRead.textContent=cfg().endless?`${lap}`:`${lap}/${cfg().laps}`;jamRead.textContent=`${pct}%`;jamRead.style.color=col;speedRead.textContent=st.playerK.toFixed(0);assistRead.textContent=autoBrake?"AUTO":"km/h";
  progressFill.style.width=`${started?frac*100:0}%`;dangerFill.style.width=`${st.jamPct}%`;dangerFill.style.background=col;
  stateText.className="stateText";
  if(!started){
    stateText.textContent="PRESS A PEDAL";phaseTag.textContent="READY";centerMain.textContent=cfg().name;
    centerSub.textContent=cfg().tutorial?"まずBRAKEを短く押して前に空間を作る":cfg().endless?"JAM 100%まで走り続ける":`${cfg().laps}周走り切る`;
  }
  else if(cfg().tutorial&&tutorialStep<3){
    stateText.textContent="TUTORIAL";phaseTag.textContent="GUIDE";
    if(tutorialStep===0){centerMain.textContent="BRAKE";centerSub.textContent="短く減速して前方に空間を作る"}
    else if(tutorialStep===1){centerMain.textContent="KEEP SPACE";centerSub.textContent="前方の車間が広がるまで少し待つ"}
    else{centerMain.textContent="ACCEL";centerSub.textContent="空間ができたら流れへ戻る"}
  }
  else if(cfg().tutorial&&tutorialStep===3&&totalDist<.7*L){
    stateText.textContent="WAVE WEAKENED";phaseTag.textContent="GOOD";centerMain.textContent="GOOD";centerSub.textContent="車間で渋滞波を吸収できた";
  }
  else if(st.jamPct>=82){stateText.textContent="CRITICAL";stateText.classList.add("critical");phaseTag.textContent="DANGER";centerMain.textContent="車間を作る";centerSub.textContent="渋滞波が限界に近い"}
  else if(st.jamPct>=55){stateText.textContent="JAM GROWING";stateText.classList.add("warn");phaseTag.textContent="WARNING";centerMain.textContent="波が成長中";centerSub.textContent="早めに減速して前方に空間"}
  else{stateText.textContent="RUNNING";phaseTag.textContent=autoBrake?"AUTO BRAKE":"RUNNING";centerMain.textContent="";centerSub.textContent=""}
  const es=cfg().events||[];
  if(cfg().flowAttack){
    stageTag.textContent="FLOW ATTACK · "+Math.round(flowScore).toLocaleString();
    eventText.textContent=`MULT x${flowMult.toFixed(1)} · KEEP JAM LOW, SPEED UP`;
  }else if(cfg().daily){
    stageTag.textContent="DAILY · "+cfg().dateKey;eventText.textContent=es[eventIndex]?`NEXT ${es[eventIndex].label||"MERGE"} @ ${es[eventIndex].at.toFixed(1)}L`:"TODAY";
  }else if(cfg().endless){
    const wave=Math.floor(raw/5)+1;stageTag.textContent=`ENDLESS · WAVE ${wave}`;
    eventText.textContent=es[eventIndex]?`NEXT ${es[eventIndex].label||"MERGE"} @ ${es[eventIndex].at.toFixed(1)}L`:`WAVE ${wave}`;
  }else{
    eventText.textContent=es[eventIndex]?`NEXT MERGE ${es[eventIndex].at.toFixed(1)}L`:cfg().works?"WORK ZONE":cfg().hill?"UP → CREST → DOWN":cfg().curve?"REAL CURVE":"";
  }
}
function clearTrafficStabilizerData(){
  try{
    const keys=[];
    for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);if(k&&k.startsWith("trafficStabilizer"))keys.push(k)}
    keys.forEach(k=>localStorage.removeItem(k));
  }catch(e){}
}
function showSettings(){
  running=false;input.gas=input.brake=false;brakeBtn.classList.remove("held");gasBtn.classList.remove("held");
  overlay.innerHTML=`<div class="overlayCard"><h2>SETTINGS</h2><div class="settingsList"><a class="settingsLink" href="https://hanage.app/privacy/" target="_blank" rel="noopener">PRIVACY POLICY</a><a class="settingsLink" href="https://hanage.app/terms/" target="_blank" rel="noopener">TERMS</a><button id="resetData" class="settingsAction danger">RESET LOCAL RECORDS</button></div><div class="settingsNote">Campaign / Daily / Endless の記録はこの端末のブラウザ内に保存されています。オンライン保存はまだ使用していません。</div><button id="backSettings" class="backBtn">← MODE SELECT</button><div class="versionNote">Traffic Stabilizer prototype v17</div></div>`;
  overlay.classList.remove("hidden");
  let armed=false;
  $("resetData").onclick=()=>{
    if(!armed){armed=true;$("resetData").textContent="TAP AGAIN TO RESET";return}
    clearTrafficStabilizerData();showModeSelect();
  };
  $("backSettings").onclick=showModeSelect;
}
function showModeSelect(){
  running=false;input.gas=input.brake=false;brakeBtn.classList.remove("held");gasBtn.classList.remove("held");
  const best=getEndlessBest(),flowBest=getFlowBest(),daily=buildDailyConfig(),dr=getDailyRecord(daily.dateKey),records=getStageRecords(),next=firstUnclearedStage();
  const count=ch=>{let n=0;for(let i=(ch-1)*7;i<ch*7;i++)if(records[String(i)]?.cleared)n++;return n};
  const allClear=Object.keys(records).filter(k=>records[k]?.cleared&&Number(k)<STAGES.length).length>=STAGES.length;
  overlay.innerHTML=`<div class="overlayCard"><h2>SELECT MODE</h2><div class="modeMenu"><button id="continue" class="modeBtn wide">${allClear?"CAMPAIGN COMPLETE · REPLAY":"CONTINUE CAMPAIGN"}<small>${allClear?"STAGE 28 · FINAL WAVE":`STAGE ${next+1} · ${STAGES[next].name}`}</small></button><button id="ch1" class="modeBtn">CHAPTER 1<small>${count(1)}/7 · BASIC</small></button><button id="ch2" class="modeBtn">CHAPTER 2<small>${count(2)}/7 · ADVANCED</small></button><button id="ch3" class="modeBtn">CHAPTER 3<small>${count(3)}/7 · WORKS</small></button><button id="ch4" class="modeBtn">CHAPTER 4<small>${count(4)}/7 · MASTER</small></button><button id="daily" class="modeBtn daily">DAILY<small>${daily.dateKey} · ${dr.cleared?"CLEAR":"NEW"}</small></button><button id="flow" class="modeBtn endless">FLOW ATTACK<small>BEST ${flowBest.toLocaleString()} · SCORE</small></button><button id="endless" class="modeBtn endless">ENDLESS<small>BEST ${best.toFixed(1)} LAPS</small></button><button id="settings" class="modeBtn wide">SETTINGS<small>PRIVACY · TERMS · LOCAL DATA</small></button></div></div>`;
  overlay.classList.remove("hidden");
  $("continue").onclick=()=>reset(allClear?STAGES.length-1:next,"campaign");
  $("ch1").onclick=()=>showChapter(1);$("ch2").onclick=()=>showChapter(2);$("ch3").onclick=()=>showChapter(3);$("ch4").onclick=()=>showChapter(4);$("daily").onclick=()=>reset(0,"daily");$("flow").onclick=()=>reset(0,"flow");$("endless").onclick=()=>reset(0,"endless");$("settings").onclick=showSettings;
}
function showChapter(chapter){
  running=false;const start=(chapter-1)*7,end=start+7;
  const titles=["BASIC FLOW","ADVANCED FLOW","ROAD WORKS","MASTER FLOW"];overlay.innerHTML=`<div class="overlayCard"><h2>CHAPTER ${chapter}</h2><div class="chapterTitle">${titles[chapter-1]}</div><div id="stageGrid" class="stageGrid compact"></div><button id="backModes" class="backBtn">← MODE SELECT</button></div>`;
  overlay.classList.remove("hidden");
  const g=$("stageGrid"),records=getStageRecords();
  STAGES.slice(start,end).forEach((s,j)=>{const idx=start+j,b=document.createElement("button"),rec=records[String(idx)];b.innerHTML=`${idx+1}. ${s.name}${s.tutorial?" · TUTORIAL":""}<small>${s.desc}</small>${rec?.cleared?`<span class="recordMark">✓ BEST ${formatTime(rec.bestTime)} · JAM ${Math.round(rec.bestJam)}%</span>`:""}`;b.onclick=()=>reset(idx,"campaign");g.appendChild(b)});
  $("backModes").onclick=showModeSelect;
}
function setPedal(name,on){input[name]=on;(name==="gas"?gasBtn:brakeBtn).classList.toggle("held",on);if(on&&!started){started=true;if(gameMode==="daily"&&!attemptCounted){noteDailyAttempt(cfg().dateKey);attemptCounted=true}showNotice(cfg().seed?"車間を作って波を吸収":"GO")}}
function bind(btn,name){
  btn.addEventListener("pointerdown",e=>{e.preventDefault();btn.setPointerCapture?.(e.pointerId);setPedal(name,true)});
  const up=e=>{e.preventDefault();setPedal(name,false)};
  btn.addEventListener("pointerup",up);btn.addEventListener("pointercancel",up);btn.addEventListener("lostpointercapture",()=>setPedal(name,false));
  btn.addEventListener("contextmenu",e=>e.preventDefault());btn.addEventListener("selectstart",e=>e.preventDefault());btn.addEventListener("dragstart",e=>e.preventDefault());
}
bind(brakeBtn,"brake");bind(gasBtn,"gas");
document.addEventListener("selectionchange",()=>{const s=window.getSelection?.();if(s&&s.anchorNode&&(brakeBtn.contains(s.anchorNode)||gasBtn.contains(s.anchorNode)))s.removeAllRanges()});
restartBtn.onclick=()=>reset(stageIndex,gameMode);selectBtn.onclick=showModeSelect;
pauseBtn.onclick=()=>{if(!started||!running)return;paused=!paused;pauseBtn.textContent=paused?"RESUME":"PAUSE";input.gas=input.brake=false;brakeBtn.classList.remove("held");gasBtn.classList.remove("held")};
function frame(ts){if(!lastTs)lastTs=ts;const dt=Math.min(.05,(ts-lastTs)/1000);lastTs=ts;if(running&&!paused)update(dt);requestAnimationFrame(frame)}
reset(0,"campaign");showModeSelect();requestAnimationFrame(frame);
})();