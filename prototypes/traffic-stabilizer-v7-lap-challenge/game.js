(()=>{"use strict";
const $=id=>document.getElementById(id),canvas=$("c"),ctx=canvas.getContext("2d");
const overlay=$("overlay"),restartBtn=$("restart"),pauseBtn=$("pause"),brakeBtn=$("brake"),gasBtn=$("gas");
const lapRead=$("lapRead"),jamRead=$("jamRead"),stateText=$("stateText"),eventText=$("eventText"),progressFill=$("progressFill"),dangerFill=$("dangerFill"),phaseTag=$("phaseTag"),centerMain=$("centerMain"),centerSub=$("centerSub"),notice=$("notice"),speedRead=$("speedRead"),assistRead=$("assistRead");
const L=360,CAR=4.5,V0=27.8,S0=2,DELTA=4,R=220,CX=300,CY=300,SIM_SPEED=1.5,PLAYER_MAX=52/3.6;
const TOTAL_LAPS=3,JAM_LIMIT=13,JAM_CORE_K=10,JAM_SLOW_K=18,JAM_CORE_GAP=11.5,JAM_SLOW_GAP=14.5,FAIL_CONFIRM=.55;
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
function showNotice(t){notice.textContent=t;notice.classList.add("show");noticeTimer=1.8}
function reset(){
 cars=[];rampCars=[];const N=22,initial=24/3.6;
 for(let i=0;i<N;i++)cars.push({id:i,s:i*L/N,v:initial,player:i===0,truck:false,style:[.91,.96,1,1.03][i%4],cautious:i%4===0});
 player=cars[0];sortCars();const ti=Math.floor(cars.length*.47);if(cars[ti]&&!cars[ti].player)cars[ti].truck=true;
 started=false;running=true;paused=false;lastTs=0;simTime=0;totalDist=0;nextId=100;eventIndex=0;merged=0;noticeTimer=0;autoBrake=false;failClock=0;resultShown=false;input.gas=input.brake=false;brakeBtn.classList.remove("held");gasBtn.classList.remove("held");pauseBtn.textContent="PAUSE";overlay.classList.add("hidden");render();
}
function neighborsAt(s){sortCars();let leader=cars.find(c=>c.s>s);if(!leader)leader=cars[0];const li=cars.indexOf(leader),follower=cars[(li-1+cars.length)%cars.length];return{follower,leader}}
function canMerge(){const {follower,leader}=neighborsAt(MERGE_S),back=forward(follower.s,MERGE_S)-CAR/2,front=forward(MERGE_S,leader.s)-CAR/2;return{ok:back>6.5&&front>7.0,follower,leader}}
function queueRamp(types,label){for(let i=0;i<types.length;i++)rampCars.push({id:`r${eventIndex}-${i}-${nextId}`,p:Math.max(.03,.50-i*.18),vp:.14,waiting:false,truck:types[i]});showNotice(label)}
function updateEvents(){while(eventIndex<EVENTS.length&&totalDist>=EVENTS[eventIndex].at){const e=EVENTS[eventIndex];queueRamp(e.cars,e.label);eventIndex++}}
function updateRamp(dt){
 if(!rampCars.length)return;rampCars.sort((a,b)=>b.p-a.p);
 for(let i=0;i<rampCars.length;i++){const rc=rampCars[i],ahead=rampCars[i-1];let limit=.94;if(ahead)limit=Math.min(limit,ahead.p-.14);if(rc.p<limit)rc.p=Math.min(limit,rc.p+rc.vp*dt);rc.waiting=rc.p>=.93}
 const front=rampCars[0];if(front&&front.p>=.93){const m=canMerge();if(m.ok){cars.push({id:nextId++,s:MERGE_S,v:Math.min(4.8,m.leader.v,m.follower.v+1.0),player:false,truck:front.truck,style:front.truck?.94:1,cautious:false});rampCars.shift();merged++;showNotice(front.truck?"TRUCK MERGED":"CAR MERGED")}}
}
function npcAccel(c,lead,gap){
 const dv=c.v-lead.v,T=c.truck?1.28:1.0,A=c.truck?.30:.58,B=c.truck?1.02:1.25;let Vdes=c.truck?22/3.6:V0;
 if(inZone(c.s,HILL)){const cap=c.truck?12/3.6:(20*c.style)/3.6;Vdes=Math.min(Vdes,cap)}
 if(inZone(c.s,CURVE)){const cap=(c.cautious?16:22)*c.style/3.6;Vdes=Math.min(Vdes,cap)}
 if(inZone(c.s,TUNNEL)){const cap=(c.cautious?17:22)*Math.min(1,c.style+.03)/3.6;Vdes=Math.min(Vdes,cap)}
 const sStar=S0+Math.max(0,c.v*T+c.v*dv/(2*Math.sqrt(Math.max(.01,A*B))));return clamp(A*(1-Math.pow(c.v/Math.max(.8,Vdes),DELTA)-Math.pow(sStar/Math.max(.1,gap),2)),-5,2)
}
function playerAccel(lead,gap){
 let manual=input.brake?-1.4:input.gas?1.2:-.03;
 if(inZone(player.s,HILL)&&manual>-.5)manual-=.18;if(player.v>=PLAYER_MAX&&manual>0)manual=0;
 const safe=npcAccel(player,lead,gap),closing=player.v>lead.v+.4;autoBrake=(gap<15.5||closing)&&safe<manual-.12;if(autoBrake)manual=Math.min(manual,safe);if(gap<3.0)manual=Math.min(manual,-5);return clamp(manual,-5,1.55)
}
function accelStep(dt){
 sortCars();const gs=gaps(),acc=new Map();for(let i=0;i<cars.length;i++){const c=cars[i],lead=cars[(i+1)%cars.length],gap=gs.get(c);acc.set(c,c.player?playerAccel(lead,gap):npcAccel(c,lead,gap))}
 for(const c of cars)c.v=Math.max(0,c.v+acc.get(c)*dt);
 for(const c of cars)c.s=(c.s+c.v*dt)%L;totalDist+=player.v*dt;
}
function jamStats(){
 sortCars();const gs=gaps(),n=cars.length,core=[],affected=[];for(let i=0;i<n;i++){const c=cars[i],k=c.v*3.6,g=gs.get(c);core[i]=k<JAM_CORE_K&&g<JAM_CORE_GAP;affected[i]=k<JAM_SLOW_K&&g<JAM_SLOW_GAP}
 const jamMembers=new Set();let largest=0;if(affected.every(Boolean)){if(core.some(Boolean)){for(const c of cars)jamMembers.add(c);largest=n}}else{
  let start=affected.findIndex(v=>!v);let seg=[];const flush=()=>{if(seg.length>=3&&seg.some(i=>core[i])){largest=Math.max(largest,seg.length);for(const i of seg)jamMembers.add(cars[i])}seg=[]};
  for(let step=1;step<=n;step++){const i=(start+step)%n;if(affected[i])seg.push(i);else flush()}flush();
 }
 return{gs,core,affected,jamMembers,largest,playerK:player.v*3.6,gap:gs.get(player)}
}
function update(realDt){
 if(!started){render();return}
 let rem=realDt*SIM_SPEED;while(rem>0){const dt=Math.min(.035,rem);simTime+=dt;updateEvents();updateRamp(dt);accelStep(dt);rem-=dt}
 const st=jamStats();failClock=st.largest>=JAM_LIMIT?Math.min(FAIL_CONFIRM,failClock+realDt):Math.max(0,failClock-realDt*2);
 if(totalDist>=TOTAL_LAPS*L){finish(true);return}if(failClock>=FAIL_CONFIRM){finish(false);return}
 if(noticeTimer>0){noticeTimer-=realDt;if(noticeTimer<=0)notice.classList.remove("show")}render(st)
}
function finish(ok){if(resultShown)return;running=false;resultShown=true;const st=jamStats();overlay.innerHTML=ok?`<div class="overlayCard"><h2 class="good">FINISH</h2><p>3周完走。最大渋滞を限界未満に抑えました。</p><button id="again">PLAY AGAIN</button></div>`:`<div class="overlayCard"><h2 class="bad">GRIDLOCK</h2><p>渋滞列が <b>${st.largest} / ${JAM_LIMIT}</b> まで成長しました。</p><button id="again">RETRY</button></div>`;overlay.classList.remove("hidden");$("again").onclick=reset}
function quadPoint(p0,p1,p2,t){const u=1-t;return{x:u*u*p0.x+2*u*t*p1.x+t*t*p2.x,y:u*u*p0.y+2*u*t*p1.y+t*t*p2.y}}
function rampGeom(){const ep=roadPoint(MERGE_S,R),a=ep.a,tx=-Math.sin(a),ty=Math.cos(a),rx=Math.cos(a),ry=Math.sin(a);return{p2:{x:ep.x,y:ep.y},p1:{x:ep.x-tx*70+rx*28,y:ep.y-ty*70+ry*28},p0:{x:ep.x-tx*145+rx*115,y:ep.y-ty*145+ry*115}}}
function drawZone(z,color,label){const a0=angleAt(z[0]),a1=angleAt(z[1]);ctx.beginPath();ctx.arc(CX,CY,R,a0,a1);ctx.strokeStyle=color;ctx.lineWidth=66;ctx.stroke();const m=roadPoint((z[0]+z[1])/2,R-2);ctx.save();ctx.translate(m.x,m.y);ctx.rotate(m.a+Math.PI/2);ctx.fillStyle="#fff";ctx.font="900 12px system-ui";ctx.textAlign="center";ctx.fillText(label,0,4);ctx.restore()}
function drawRoad(){ctx.fillStyle="#cbd1c6";ctx.fillRect(0,0,600,600);ctx.beginPath();ctx.arc(CX,CY,R,0,Math.PI*2);ctx.strokeStyle="#596064";ctx.lineWidth=86;ctx.stroke();ctx.beginPath();ctx.arc(CX,CY,R,0,Math.PI*2);ctx.strokeStyle="#30343a";ctx.lineWidth=70;ctx.stroke();drawZone(HILL,"rgba(194,140,61,.67)","UPHILL");drawZone(CURVE,"rgba(139,110,171,.67)","CURVE");drawZone(TUNNEL,"rgba(86,97,109,.82)","TUNNEL");const rg=rampGeom();ctx.beginPath();ctx.moveTo(rg.p0.x,rg.p0.y);ctx.quadraticCurveTo(rg.p1.x,rg.p1.y,rg.p2.x,rg.p2.y);ctx.strokeStyle="#596568";ctx.lineWidth=40;ctx.stroke();ctx.beginPath();ctx.moveTo(rg.p0.x,rg.p0.y);ctx.quadraticCurveTo(rg.p1.x,rg.p1.y,rg.p2.x,rg.p2.y);ctx.strokeStyle="#354146";ctx.lineWidth=30;ctx.stroke();ctx.fillStyle="#274e49";ctx.font="900 11px system-ui";ctx.fillText("ON-RAMP",Math.max(45,rg.p0.x-5),Math.min(570,rg.p0.y+18));ctx.setLineDash([24,20]);ctx.beginPath();ctx.arc(CX,CY,R,0,Math.PI*2);ctx.strokeStyle="#d8d3c1";ctx.lineWidth=3;ctx.stroke();ctx.setLineDash([])}
function drawRampCars(){const rg=rampGeom();for(const rc of rampCars){const p=quadPoint(rg.p0,rg.p1,rg.p2,clamp(rc.p,0,1)),p2=quadPoint(rg.p0,rg.p1,rg.p2,clamp(rc.p+.01,0,1));ctx.save();ctx.translate(p.x,p.y);ctx.rotate(Math.atan2(p2.y-p.y,p2.x-p.x));ctx.fillStyle=rc.truck?"#555":"#e9e3d6";ctx.strokeStyle="#3f7770";ctx.lineWidth=2;ctx.fillRect(rc.truck?-12:-9,rc.truck?-6:-5,rc.truck?24:18,rc.truck?12:10);ctx.strokeRect(rc.truck?-12:-9,rc.truck?-6:-5,rc.truck?24:18,rc.truck?12:10);ctx.restore()}}
function drawCar(c,st){const p=roadPoint(c.s),jam=st.jamMembers.has(c);ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.a+Math.PI/2);let fill="#e9e3d6";if(c.player)fill="#2b64d8";else if(jam)fill="#d84735";else if(c.truck)fill="#555";else if(c.v*3.6<18)fill="#e7a226";ctx.fillStyle=fill;ctx.strokeStyle=c.player&&jam?"#d84735":c.player?"#fff":"rgba(0,0,0,.45)";ctx.lineWidth=c.player?4:1.4;const w=c.truck?25:18,h=c.truck?12:10;ctx.fillRect(-w/2,-h/2,w,h);ctx.strokeRect(-w/2,-h/2,w,h);ctx.restore()}
function render(pre){
 const st=pre||jamStats();drawRoad();const pa=angleAt(player.s),ga=clamp(st.gap/L*Math.PI*2,0,Math.PI*.45);ctx.beginPath();ctx.arc(CX,CY,R,pa,pa+ga);ctx.strokeStyle="rgba(43,100,216,.22)";ctx.lineWidth=78;ctx.stroke();drawRampCars();for(const c of cars)drawCar(c,st);
 const rawLap=totalDist/L,lapNum=Math.min(TOTAL_LAPS,Math.floor(rawLap)+1),lapFrac=rawLap%1;lapRead.textContent=`LAP ${lapNum}/${TOTAL_LAPS}`;jamRead.textContent=`${st.largest} / ${JAM_LIMIT}`;progressFill.style.width=`${started?lapFrac*100:0}%`;dangerFill.style.width=`${Math.min(100,st.largest/JAM_LIMIT*100)}%`;speedRead.textContent=st.playerK.toFixed(0);assistRead.textContent=autoBrake?"AUTO BRAKE":"km/h";
 stateText.className="";if(!started){stateText.textContent="PRESS A PEDAL TO START";phaseTag.textContent="READY";centerMain.textContent="3 LAPS";centerSub.textContent="JAM 13でGRIDLOCK"}else if(st.largest>=7){stateText.textContent="JAM GROWING";stateText.className="warn";phaseTag.textContent="DANGER";centerMain.textContent=`JAM ${st.largest}`;centerSub.textContent="車間を作って波を弱める"}else{stateText.textContent="REACH 3 LAPS";phaseTag.textContent=autoBrake?"AUTO BRAKE":"RUNNING";centerMain.textContent=`LAP ${lapNum}`;centerSub.textContent=`JAM ${st.largest} / ${JAM_LIMIT}`}
 const next=EVENTS[eventIndex];eventText.textContent=next?`NEXT: ${(next.at/L).toFixed(1)} LAP / ${next.label}`:"FINAL LAP";
}
function setPedal(name,on){input[name]=on;(name==="gas"?gasBtn:brakeBtn).classList.toggle("held",on);if(on&&!started){started=true;showNotice("GO — 3周走り切れ")}}
function bindPedal(btn,name){btn.addEventListener("pointerdown",e=>{e.preventDefault();btn.setPointerCapture?.(e.pointerId);setPedal(name,true)});const up=e=>{e.preventDefault();setPedal(name,false)};btn.addEventListener("pointerup",up);btn.addEventListener("pointercancel",up);btn.addEventListener("lostpointercapture",()=>setPedal(name,false));btn.addEventListener("contextmenu",e=>e.preventDefault());btn.addEventListener("selectstart",e=>e.preventDefault());btn.addEventListener("dragstart",e=>e.preventDefault())}
bindPedal(brakeBtn,"brake");bindPedal(gasBtn,"gas");document.addEventListener("selectionchange",()=>{const s=window.getSelection?.();if(s&&s.anchorNode&&(brakeBtn.contains(s.anchorNode)||gasBtn.contains(s.anchorNode)))s.removeAllRanges()});
window.addEventListener("keydown",e=>{if(e.key==="ArrowLeft"||e.key===" "){e.preventDefault();setPedal("brake",true)}if(e.key==="ArrowRight"){e.preventDefault();setPedal("gas",true)}});window.addEventListener("keyup",e=>{if(e.key==="ArrowLeft"||e.key===" ")setPedal("brake",false);if(e.key==="ArrowRight")setPedal("gas",false)});
restartBtn.onclick=reset;pauseBtn.onclick=()=>{if(!started||!running)return;paused=!paused;pauseBtn.textContent=paused?"RESUME":"PAUSE";input.gas=input.brake=false;brakeBtn.classList.remove("held");gasBtn.classList.remove("held")};
function frame(ts){if(!lastTs)lastTs=ts;const dt=Math.min(.05,(ts-lastTs)/1000);lastTs=ts;if(running&&!paused)update(dt);requestAnimationFrame(frame)}
reset();requestAnimationFrame(frame);
})();
