(()=>{"use strict";
const $=id=>document.getElementById(id),canvas=$("c"),ctx=canvas.getContext("2d");
const overlay=$("overlay"),restartBtn=$("restart"),pauseBtn=$("pause"),brakeBtn=$("brake"),gasBtn=$("gas");
const lapRead=$("lapRead"),jamRead=$("jamRead"),stateText=$("stateText"),eventText=$("eventText"),progressFill=$("progressFill"),dangerFill=$("dangerFill"),phaseTag=$("phaseTag"),centerMain=$("centerMain"),centerSub=$("centerSub"),notice=$("notice"),speedRead=$("speedRead"),assistRead=$("assistRead");

const L=360,CAR=4.5,V0=27.8,S0=2,DELTA=4,R=220,CX=300,CY=300,SIM_SPEED=2.5,PLAYER_MAX=52/3.6;
const TOTAL_LAPS=3,JAM_SCORE_LIMIT=8.5,FAIL_CONFIRM=.60;
const HILL=[52,126],CURVE=[160,222],TUNNEL=[266,326],MERGE_S=236;
const EVENTS=[
 {at:.55*L,label:"ON-RAMP +1",cars:[false]},
 {at:1.16*L,label:"ON-RAMP +2",cars:[false,false]},
 {at:1.72*L,label:"TRUCK MERGING",cars:[true]},
 {at:2.16*L,label:"RUSH +2",cars:[false,false]},
 {at:2.58*L,label:"FINAL RUSH +3",cars:[false,true,false]}
];

let cars=[],rampCars=[],player=null,started=false,running=true,paused=false,lastTs=0,simTime=0,totalDist=0,nextId=100,eventIndex=0,merged=0,noticeTimer=0,autoBrake=false,failClock=0,resultShown=false;
const input={gas:false,brake:false};

function clamp(v,a,b){return Math.max(a,Math.min(b,v))}
function forward(a,b){let d=b-a;while(d<0)d+=L;while(d>=L)d-=L;return d}
function angleAt(s){return-Math.PI/2+2*Math.PI*s/L}
function roadPoint(s,r=R){const a=angleAt(s);return{x:CX+r*Math.cos(a),y:CY+r*Math.sin(a),a}}
function inZone(s,z){return s>=z[0]&&s<=z[1]}
function sortCars(){cars.sort((a,b)=>a.s-b.s)}
function gaps(){sortCars();const g=new Map();for(let i=0;i<cars.length;i++){const c=cars[i],lead=cars[(i+1)%cars.length];g.set(c,Math.max(.05,forward(c.s,lead.s)-CAR))}return g}
function showNotice(t){notice.textContent=t;notice.classList.add("show");noticeTimer=1.45}

function reset(){
  cars=[];rampCars=[];const N=22,initial=24/3.6;
  for(let i=0;i<N;i++)cars.push({id:i,s:i*L/N,v:initial,player:i===0,truck:false,style:[.91,.96,1,1.03][i%4],cautious:i%4===0,jamLevel:0});
  player=cars[0];sortCars();const ti=Math.floor(cars.length*.47);if(cars[ti]&&!cars[ti].player)cars[ti].truck=true;
  started=false;running=true;paused=false;lastTs=0;simTime=0;totalDist=0;nextId=100;eventIndex=0;merged=0;noticeTimer=0;autoBrake=false;failClock=0;resultShown=false;
  input.gas=input.brake=false;brakeBtn.classList.remove("held");gasBtn.classList.remove("held");pauseBtn.textContent="PAUSE";overlay.classList.add("hidden");render();
}

function neighborsAt(s){
  sortCars();let leader=cars.find(c=>c.s>s);if(!leader)leader=cars[0];
  const li=cars.indexOf(leader),follower=cars[(li-1+cars.length)%cars.length];
  return{follower,leader};
}
function canMerge(){
  const {follower,leader}=neighborsAt(MERGE_S),back=forward(follower.s,MERGE_S)-CAR/2,front=forward(MERGE_S,leader.s)-CAR/2;
  return{ok:back>6.5&&front>7.0,follower,leader};
}
function queueRamp(types,label){
  for(let i=0;i<types.length;i++)rampCars.push({id:`r${eventIndex}-${i}-${nextId}`,p:Math.max(.03,.50-i*.18),vp:.14,waiting:false,truck:types[i]});
  showNotice(label);
}
function updateEvents(){
  while(eventIndex<EVENTS.length&&totalDist>=EVENTS[eventIndex].at){const e=EVENTS[eventIndex];queueRamp(e.cars,e.label);eventIndex++}
}
function updateRamp(dt){
  if(!rampCars.length)return;
  rampCars.sort((a,b)=>b.p-a.p);
  for(let i=0;i<rampCars.length;i++){
    const rc=rampCars[i],ahead=rampCars[i-1];let limit=.94;if(ahead)limit=Math.min(limit,ahead.p-.14);
    if(rc.p<limit)rc.p=Math.min(limit,rc.p+rc.vp*dt);rc.waiting=rc.p>=.93;
  }
  const front=rampCars[0];
  if(front&&front.p>=.93){
    const m=canMerge();
    if(m.ok){
      cars.push({id:nextId++,s:MERGE_S,v:Math.min(4.8,m.leader.v,m.follower.v+1.0),player:false,truck:front.truck,style:front.truck?.94:1,cautious:false,jamLevel:0});
      rampCars.shift();merged++;showNotice(front.truck?"TRUCK MERGED":"CAR MERGED");
    }
  }
}

function npcAccel(c,lead,gap){
  const dv=c.v-lead.v,T=c.truck?1.28:1.0,A=c.truck?.30:.58,B=c.truck?1.02:1.25;
  let Vdes=c.truck?22/3.6:V0;
  if(inZone(c.s,HILL)){const cap=c.truck?12/3.6:(20*c.style)/3.6;Vdes=Math.min(Vdes,cap)}
  if(inZone(c.s,CURVE)){const cap=(c.cautious?16:22)*c.style/3.6;Vdes=Math.min(Vdes,cap)}
  if(inZone(c.s,TUNNEL)){const cap=(c.cautious?17:22)*Math.min(1,c.style+.03)/3.6;Vdes=Math.min(Vdes,cap)}
  const sStar=S0+Math.max(0,c.v*T+c.v*dv/(2*Math.sqrt(Math.max(.01,A*B))));
  return clamp(A*(1-Math.pow(c.v/Math.max(.8,Vdes),DELTA)-Math.pow(sStar/Math.max(.1,gap),2)),-5,2);
}
function playerAccel(lead,gap){
  let manual=input.brake?-1.4:input.gas?1.2:-.03;
  if(inZone(player.s,HILL)&&manual>-.5)manual-=.18;
  if(player.v>=PLAYER_MAX&&manual>0)manual=0;
  const safe=npcAccel(player,lead,gap),closing=player.v>lead.v+.4;
  autoBrake=(gap<15.5||closing)&&safe<manual-.12;
  if(autoBrake)manual=Math.min(manual,safe);
  if(gap<3.0)manual=Math.min(manual,-5);
  return clamp(manual,-5,1.55);
}
function accelStep(dt){
  sortCars();const gs=gaps(),acc=new Map();
  for(let i=0;i<cars.length;i++){
    const c=cars[i],lead=cars[(i+1)%cars.length],gap=gs.get(c);
    acc.set(c,c.player?playerAccel(lead,gap):npcAccel(c,lead,gap));
  }
  for(const c of cars)c.v=Math.max(0,c.v+acc.get(c)*dt);
  for(const c of cars)c.s=(c.s+c.v*dt)%L;
  totalDist+=player.v*dt;
}

function updateCongestion(dt){
  sortCars();const gs=gaps(),n=cars.length;
  for(let i=0;i<n;i++){
    const c=cars[i],lead=cars[(i+1)%n],km=c.v*3.6,gap=gs.get(c),closing=Math.max(0,(c.v-lead.v)*3.6);
    const speedPressure=clamp((24-km)/16,0,1);
    const gapPressure=clamp((17-gap)/9,0,1);
    const closingPressure=clamp(closing/8,0,1);
    const raw=clamp(speedPressure*(.28+.72*gapPressure)+.12*closingPressure,0,1);
    const tau=raw>c.jamLevel?3.2:1.7;
    c.jamLevel+= (raw-c.jamLevel)*Math.min(1,dt/tau);
  }
}
function jamStats(){
  sortCars();const gs=gaps(),n=cars.length,windowSize=Math.min(12,n),levels=cars.map(c=>c.jamLevel);
  let bestScore=0;
  if(n<=windowSize){
    bestScore=levels.reduce((a,b)=>a+b,0);
  }else{
    const ext=levels.concat(levels.slice(0,windowSize-1));
    let score=ext.slice(0,windowSize).reduce((a,b)=>a+b,0);
    bestScore=score;
    for(let i=1;i<n;i++){
      score+=ext[i+windowSize-1]-ext[i-1];
      if(score>bestScore)bestScore=score;
    }
  }
  return{
    gs,
    bestScore,
    jamPct:clamp(bestScore/JAM_SCORE_LIMIT*100,0,100),
    playerK:player.v*3.6,
    gap:gs.get(player)
  };
}

function update(realDt){
  if(!started){render();return}
  let rem=realDt*SIM_SPEED;
  while(rem>0){
    const dt=Math.min(.035,rem);
    simTime+=dt;updateEvents();updateRamp(dt);updateCongestion(dt);accelStep(dt);rem-=dt;
  }
  const st=jamStats();
  failClock=st.bestScore>=JAM_SCORE_LIMIT?Math.min(FAIL_CONFIRM,failClock+realDt):Math.max(0,failClock-realDt*1.2);
  if(totalDist>=TOTAL_LAPS*L){finish(true);return}
  if(failClock>=FAIL_CONFIRM){finish(false);return}
  if(noticeTimer>0){noticeTimer-=realDt;if(noticeTimer<=0)notice.classList.remove("show")}
  render(st);
}
function finish(ok){
  if(resultShown)return;running=false;resultShown=true;const st=jamStats();
  overlay.innerHTML=ok
    ?`<div class="overlayCard"><h2 class="good">FINISH</h2><p>3周完走。渋滞を限界未満に抑えました。</p><p>FINISH JAM <b>${Math.round(st.jamPct)}%</b></p><button id="again">PLAY AGAIN</button></div>`
    :`<div class="overlayCard"><h2 class="bad">GRIDLOCK</h2><p>渋滞の波が限界まで成長しました。</p><p>JAM LEVEL <b>100%</b></p><button id="again">RETRY</button></div>`;
  overlay.classList.remove("hidden");$("again").onclick=reset;
}

function quadPoint(p0,p1,p2,t){const u=1-t;return{x:u*u*p0.x+2*u*t*p1.x+t*t*p2.x,y:u*u*p0.y+2*u*t*p1.y+t*t*p2.y}}
function rampGeom(){
  const ep=roadPoint(MERGE_S,R),a=ep.a,tx=-Math.sin(a),ty=Math.cos(a),rx=Math.cos(a),ry=Math.sin(a);
  return{p2:{x:ep.x,y:ep.y},p1:{x:ep.x-tx*70+rx*28,y:ep.y-ty*70+ry*28},p0:{x:ep.x-tx*145+rx*115,y:ep.y-ty*145+ry*115}};
}
function drawArcZone(z,color,width=66){
  ctx.beginPath();ctx.arc(CX,CY,R,angleAt(z[0]),angleAt(z[1]));ctx.strokeStyle=color;ctx.lineWidth=width;ctx.stroke();
}
function drawChevron(s,r,color,size=12){
  const p=roadPoint(s,r);ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.a+Math.PI/2);
  ctx.strokeStyle=color;ctx.lineWidth=5;ctx.lineCap="square";ctx.beginPath();ctx.moveTo(-size*.55,-size*.65);ctx.lineTo(size*.45,0);ctx.lineTo(-size*.55,size*.65);ctx.stroke();ctx.restore();
}
function drawHill(){
  drawArcZone(HILL,"rgba(173,118,40,.72)",66);
  for(const s of [66,83,100,117])drawChevron(s,R,"#fff1c7",13);
  for(const s of [58,74,90,106,122]){
    const a=angleAt(s),p=roadPoint(s,R-47);ctx.save();ctx.translate(p.x,p.y);ctx.rotate(a);
    ctx.fillStyle="#7b5525";ctx.beginPath();ctx.moveTo(0,-6);ctx.lineTo(8,6);ctx.lineTo(-8,6);ctx.closePath();ctx.fill();ctx.restore();
  }
}
function drawCurve(){
  drawArcZone(CURVE,"rgba(111,79,145,.54)",66);
  ctx.beginPath();ctx.arc(CX,CY,R+43,angleAt(CURVE[0]),angleAt(CURVE[1]));ctx.strokeStyle="#f0c84b";ctx.lineWidth=9;ctx.stroke();
  for(const s of [168,181,194,207,219])drawChevron(s,R+43,"#202020",10);
  for(const s of [173,190,207])drawChevron(s,R,"#f3e3ff",11);
}
function drawTunnelPortal(s){
  const a=angleAt(s),inner=roadPoint(s,R-46),outer=roadPoint(s,R+46);
  ctx.save();ctx.strokeStyle="#c7d0d6";ctx.lineWidth=9;ctx.beginPath();ctx.moveTo(inner.x,inner.y);ctx.lineTo(outer.x,outer.y);ctx.stroke();
  ctx.strokeStyle="#252c33";ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(inner.x,inner.y);ctx.lineTo(outer.x,outer.y);ctx.stroke();ctx.restore();
}
function drawTunnel(){
  drawArcZone(TUNNEL,"rgba(19,24,29,.94)",68);
  drawTunnelPortal(TUNNEL[0]);drawTunnelPortal(TUNNEL[1]);
  for(let s=TUNNEL[0]+8;s<TUNNEL[1]-4;s+=12){
    for(const rr of [R-25,R+25]){
      const p=roadPoint(s,rr);ctx.beginPath();ctx.arc(p.x,p.y,3.2,0,Math.PI*2);ctx.fillStyle="#f5e9aa";ctx.fill();
    }
  }
}
function drawRamp(){
  const rg=rampGeom();
  ctx.beginPath();ctx.moveTo(rg.p0.x,rg.p0.y);ctx.quadraticCurveTo(rg.p1.x,rg.p1.y,rg.p2.x,rg.p2.y);ctx.strokeStyle="#596568";ctx.lineWidth=40;ctx.stroke();
  ctx.beginPath();ctx.moveTo(rg.p0.x,rg.p0.y);ctx.quadraticCurveTo(rg.p1.x,rg.p1.y,rg.p2.x,rg.p2.y);ctx.strokeStyle="#354146";ctx.lineWidth=30;ctx.stroke();
  ctx.setLineDash([10,8]);ctx.beginPath();ctx.moveTo(rg.p0.x,rg.p0.y);ctx.quadraticCurveTo(rg.p1.x,rg.p1.y,rg.p2.x,rg.p2.y);ctx.strokeStyle="#d8d3c1";ctx.lineWidth=2;ctx.stroke();ctx.setLineDash([]);
  for(const t of [.18,.38,.58]){const p=quadPoint(rg.p0,rg.p1,rg.p2,t),p2=quadPoint(rg.p0,rg.p1,rg.p2,t+.02);ctx.save();ctx.translate(p.x,p.y);ctx.rotate(Math.atan2(p2.y-p.y,p2.x-p.x));ctx.fillStyle="#e8f3ee";ctx.beginPath();ctx.moveTo(8,0);ctx.lineTo(-5,-5);ctx.lineTo(-5,5);ctx.closePath();ctx.fill();ctx.restore()}
}
function drawRoad(){
  ctx.fillStyle="#cbd1c6";ctx.fillRect(0,0,600,600);
  ctx.beginPath();ctx.arc(CX,CY,R,0,Math.PI*2);ctx.strokeStyle="#596064";ctx.lineWidth=88;ctx.stroke();
  ctx.beginPath();ctx.arc(CX,CY,R,0,Math.PI*2);ctx.strokeStyle="#30343a";ctx.lineWidth=70;ctx.stroke();
  drawHill();drawCurve();drawTunnel();drawRamp();
  ctx.setLineDash([24,20]);ctx.beginPath();ctx.arc(CX,CY,R,0,Math.PI*2);ctx.strokeStyle="#d8d3c1";ctx.lineWidth=3;ctx.stroke();ctx.setLineDash([]);
}
function drawRampCars(){
  const rg=rampGeom();
  for(const rc of rampCars){
    const p=quadPoint(rg.p0,rg.p1,rg.p2,clamp(rc.p,0,1)),p2=quadPoint(rg.p0,rg.p1,rg.p2,clamp(rc.p+.01,0,1));
    ctx.save();ctx.translate(p.x,p.y);ctx.rotate(Math.atan2(p2.y-p.y,p2.x-p.x));ctx.fillStyle=rc.truck?"#555":"#e9e3d6";ctx.strokeStyle="#3f7770";ctx.lineWidth=2;
    ctx.fillRect(rc.truck?-12:-9,rc.truck?-6:-5,rc.truck?24:18,rc.truck?12:10);ctx.strokeRect(rc.truck?-12:-9,rc.truck?-6:-5,rc.truck?24:18,rc.truck?12:10);ctx.restore();
  }
}
function severityColor(level){
  if(level<.20)return null;
  if(level<.42)return "#e7c64b";
  if(level<.68)return "#e78b2f";
  return "#d84735";
}
function drawCar(c,st){
  const p=roadPoint(c.s),sev=severityColor(c.jamLevel);
  ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.a+Math.PI/2);
  let fill=c.truck?"#555":"#e9e3d6";
  if(!c.player&&sev)fill=sev;
  if(c.player)fill="#2b64d8";
  ctx.fillStyle=fill;
  ctx.strokeStyle=c.player?(sev||"#fff"):"rgba(0,0,0,.45)";
  ctx.lineWidth=c.player?4:1.4;
  const w=c.truck?25:18,h=c.truck?12:10;
  ctx.fillRect(-w/2,-h/2,w,h);ctx.strokeRect(-w/2,-h/2,w,h);
  ctx.restore();
}

function jamUiColor(pct){
  if(pct<35)return"#2f8b57";
  if(pct<58)return"#c5a528";
  if(pct<82)return"#e78b2f";
  return"#d84735";
}
function render(pre){
  const st=pre||jamStats();drawRoad();
  const pa=angleAt(player.s),ga=clamp(st.gap/L*Math.PI*2,0,Math.PI*.45);
  ctx.beginPath();ctx.arc(CX,CY,R,pa,pa+ga);ctx.strokeStyle="rgba(43,100,216,.22)";ctx.lineWidth=78;ctx.stroke();
  drawRampCars();for(const c of cars)drawCar(c,st);

  const rawLap=totalDist/L,lapNum=Math.min(TOTAL_LAPS,Math.floor(rawLap)+1),lapFrac=rawLap%1,pct=Math.round(st.jamPct),uiColor=jamUiColor(st.jamPct);
  lapRead.textContent=`LAP ${lapNum}/${TOTAL_LAPS}`;jamRead.textContent=`${pct}%`;jamRead.style.color=uiColor;
  progressFill.style.width=`${started?lapFrac*100:0}%`;dangerFill.style.width=`${st.jamPct}%`;dangerFill.style.background=uiColor;
  speedRead.textContent=st.playerK.toFixed(0);assistRead.textContent=autoBrake?"AUTO BRAKE":"km/h";

  stateText.className="";
  if(!started){
    stateText.textContent="PRESS A PEDAL TO START";phaseTag.textContent="READY";centerMain.textContent="3 LAPS";centerSub.textContent="JAM 100%でGRIDLOCK";
  }else if(st.jamPct>=82){
    stateText.textContent="CRITICAL";stateText.className="critical";phaseTag.textContent="DANGER";centerMain.textContent=`JAM ${pct}%`;centerSub.textContent="今のうちに車間を作る";
  }else if(st.jamPct>=55){
    stateText.textContent="JAM GROWING";stateText.className="warn";phaseTag.textContent="WARNING";centerMain.textContent=`JAM ${pct}%`;centerSub.textContent="波が成長中";
  }else if(st.jamPct>=30){
    stateText.textContent="DENSE";stateText.className="warn";phaseTag.textContent=autoBrake?"AUTO BRAKE":"RUNNING";centerMain.textContent=`LAP ${lapNum}`;centerSub.textContent=`JAM ${pct}% — 注意`;
  }else{
    stateText.textContent="REACH 3 LAPS";phaseTag.textContent=autoBrake?"AUTO BRAKE":"RUNNING";centerMain.textContent=`LAP ${lapNum}`;centerSub.textContent=`JAM ${pct}%`;
  }
  const next=EVENTS[eventIndex];eventText.textContent=next?`NEXT: ${(next.at/L).toFixed(1)} LAP / ${next.label}`:"FINAL LAP";
}
function setPedal(name,on){
  input[name]=on;(name==="gas"?gasBtn:brakeBtn).classList.toggle("held",on);
  if(on&&!started){started=true;showNotice("GO — 3周走り切れ")}
}
function bindPedal(btn,name){
  btn.addEventListener("pointerdown",e=>{e.preventDefault();btn.setPointerCapture?.(e.pointerId);setPedal(name,true)});
  const up=e=>{e.preventDefault();setPedal(name,false)};
  btn.addEventListener("pointerup",up);btn.addEventListener("pointercancel",up);btn.addEventListener("lostpointercapture",()=>setPedal(name,false));
  btn.addEventListener("contextmenu",e=>e.preventDefault());btn.addEventListener("selectstart",e=>e.preventDefault());btn.addEventListener("dragstart",e=>e.preventDefault());
}
bindPedal(brakeBtn,"brake");bindPedal(gasBtn,"gas");
document.addEventListener("selectionchange",()=>{const s=window.getSelection?.();if(s&&s.anchorNode&&(brakeBtn.contains(s.anchorNode)||gasBtn.contains(s.anchorNode)))s.removeAllRanges()});
window.addEventListener("keydown",e=>{if(e.key==="ArrowLeft"||e.key===" "){e.preventDefault();setPedal("brake",true)}if(e.key==="ArrowRight"){e.preventDefault();setPedal("gas",true)}});
window.addEventListener("keyup",e=>{if(e.key==="ArrowLeft"||e.key===" ")setPedal("brake",false);if(e.key==="ArrowRight")setPedal("gas",false)});
restartBtn.onclick=reset;
pauseBtn.onclick=()=>{if(!started||!running)return;paused=!paused;pauseBtn.textContent=paused?"RESUME":"PAUSE";input.gas=input.brake=false;brakeBtn.classList.remove("held");gasBtn.classList.remove("held")};
function frame(ts){if(!lastTs)lastTs=ts;const dt=Math.min(.05,(ts-lastTs)/1000);lastTs=ts;if(running&&!paused)update(dt);requestAnimationFrame(frame)}
reset();requestAnimationFrame(frame);
})();
