(()=>{"use strict";
const $=id=>document.getElementById(id),canvas=$("c"),ctx=canvas.getContext("2d");
const overlay=$("overlay"),stageGrid=$("stageGrid"),restartBtn=$("restart"),selectBtn=$("select"),pauseBtn=$("pause"),brakeBtn=$("brake"),gasBtn=$("gas");
const lapRead=$("lapRead"),jamRead=$("jamRead"),speedRead=$("speedRead"),assistRead=$("assistRead"),stateText=$("stateText"),eventText=$("eventText"),progressFill=$("progressFill"),dangerFill=$("dangerFill"),stageTag=$("stageTag"),phaseTag=$("phaseTag"),centerMain=$("centerMain"),centerSub=$("centerSub"),notice=$("notice"),sub=$("sub");

const L=360,CAR=4.5,V0=27.8,S0=2,DELTA=4,R=220,CX=300,CY=300,SIM_SPEED=2.5,PLAYER_MAX=52/3.6,HILL=[52,126],CURVE=[160,222],TUNNEL=[266,326],MERGE_S=236;
const STAGES=[
 {name:"PHANTOM WAVE",short:"BASIC",desc:"ギミックなし。車間で渋滞波を吸収",n:22,laps:3,jamLimit:8.5,seed:true},
 {name:"ON-RAMP",short:"MERGE",desc:"側道から車が流入",n:19,laps:3,jamLimit:8.5,events:[{at:.4,cars:[false]},{at:1.1,cars:[false]},{at:1.8,cars:[false]},{at:2.3,cars:[false]}]},
 {name:"UPHILL TRUCK",short:"UPHILL",desc:"坂で大型車が失速",n:19,laps:3,jamLimit:8.5,hill:true,trucks:1},
 {name:"CURVE + TUNNEL",short:"TUNNEL",desc:"カーブとトンネルで速度差",n:19,laps:3,jamLimit:8.5,curve:true,tunnel:true},
 {name:"RUSH HOUR",short:"RUSH",desc:"坂・カーブ・トンネル・合流",n:20,laps:3,jamLimit:8.5,hill:true,curve:true,tunnel:true,trucks:1,events:[{at:.4,cars:[false]},{at:1.2,cars:[false]},{at:2.0,cars:[false]}]}
];
let stageIndex=0,cars=[],rampCars=[],player=null,started=false,running=false,paused=false,lastTs=0,totalDist=0,nextId=100,eventIndex=0,noticeTimer=0,autoBrake=false,failClock=0,resultShown=false;
const input={gas:false,brake:false};
function cfg(){return STAGES[stageIndex]} function clamp(v,a,b){return Math.max(a,Math.min(b,v))}
function forward(a,b){let d=b-a;while(d<0)d+=L;while(d>=L)d-=L;return d}
function angleAt(s){return-Math.PI/2+2*Math.PI*s/L}
function roadPoint(s,r=R){const a=angleAt(s);return{x:CX+r*Math.cos(a),y:CY+r*Math.sin(a),a}}
function inZone(s,z){return s>=z[0]&&s<=z[1]} function sortCars(){cars.sort((a,b)=>a.s-b.s)}
function gaps(){sortCars();const g=new Map();for(let i=0;i<cars.length;i++){const c=cars[i],lead=cars[(i+1)%cars.length];g.set(c,Math.max(.05,forward(c.s,lead.s)-CAR))}return g}
function showNotice(t){notice.textContent=t;notice.classList.add("show");noticeTimer=1.5}
function baseCar(i,s,v){return{id:i,s,v,player:i===0,truck:false,style:[.91,.96,1,1.03][i%4],cautious:i%4===0,jamLevel:0}}
function reset(i=stageIndex){
 stageIndex=i;const s=cfg();cars=[];rampCars=[];eventIndex=0;nextId=100;
 if(s.seed){
   const cluster=new Set([8,9,10,11,12,13,14]),small=5.5,totalGap=L-s.n*CAR,large=(totalGap-cluster.size*small)/(s.n-cluster.size),gs=[];
   for(let k=0;k<s.n;k++)gs.push(cluster.has(k)?small:large);
   let pos=0;
   for(let k=0;k<s.n;k++){
     let vk=cluster.has(k)?9:([6,7].includes(k)?17:27);
     const c=baseCar(k,pos,vk/3.6);if(cluster.has(k))c.jamLevel=.35;else if([6,7].includes(k))c.jamLevel=.18;cars.push(c);
     pos+=CAR+gs[k];
   }
 }else{
   for(let k=0;k<s.n;k++)cars.push(baseCar(k,k*L/s.n,24/3.6));
 }
 sortCars();if(s.trucks){for(let k=1;k<=s.trucks;k++){const idx=Math.floor(k*cars.length/(s.trucks+1));if(cars[idx]&&!cars[idx].player)cars[idx].truck=true}}
 player=cars.find(c=>c.player);started=false;running=true;paused=false;lastTs=0;totalDist=0;noticeTimer=0;autoBrake=false;failClock=0;resultShown=false;input.gas=input.brake=false;brakeBtn.classList.remove("held");gasBtn.classList.remove("held");pauseBtn.textContent="PAUSE";overlay.classList.add("hidden");
 stageTag.textContent=`STAGE ${stageIndex+1}/${STAGES.length} · ${s.short}`;sub.textContent=s.desc;render();
}
function neighborsAt(s){sortCars();let leader=cars.find(c=>c.s>s);if(!leader)leader=cars[0];const li=cars.indexOf(leader);return{follower:cars[(li-1+cars.length)%cars.length],leader}}
function queueRamp(types,label){for(let i=0;i<types.length;i++)rampCars.push({p:Math.max(.03,.50-i*.18),vp:.14,truck:types[i]});showNotice(label)}
function updateEvents(){const es=cfg().events||[];while(eventIndex<es.length&&totalDist>=es[eventIndex].at*L){const e=es[eventIndex];queueRamp(e.cars,"ON-RAMP");eventIndex++}}
function updateRamp(dt){if(!rampCars.length)return;rampCars.sort((a,b)=>b.p-a.p);for(let i=0;i<rampCars.length;i++){const rc=rampCars[i],ahead=rampCars[i-1];let lim=.94;if(ahead)lim=Math.min(lim,ahead.p-.14);if(rc.p<lim)rc.p=Math.min(lim,rc.p+rc.vp*dt)}
 const f=rampCars[0];if(f&&f.p>=.93){const m=neighborsAt(MERGE_S),back=forward(m.follower.s,MERGE_S)-CAR/2,front=forward(MERGE_S,m.leader.s)-CAR/2;if(back>6.5&&front>7){cars.push({id:nextId++,s:MERGE_S,v:Math.min(4.8,m.leader.v,m.follower.v+1),player:false,truck:f.truck,style:f.truck?.94:1,cautious:false,jamLevel:0});rampCars.shift();showNotice(f.truck?"TRUCK MERGED":"CAR MERGED")}}
}
function npcAccel(c,lead,gap){const s=cfg(),dv=c.v-lead.v,T=c.truck?1.28:1,A=c.truck?.30:.58,B=c.truck?1.02:1.25;let Vdes=c.truck?22/3.6:V0;
 if(s.hill&&inZone(c.s,HILL))Vdes=Math.min(Vdes,(c.truck?12:20*c.style)/3.6);
 if(s.curve&&inZone(c.s,CURVE))Vdes=Math.min(Vdes,((c.cautious?16:22)*c.style)/3.6);
 if(s.tunnel&&inZone(c.s,TUNNEL))Vdes=Math.min(Vdes,((c.cautious?17:22)*Math.min(1,c.style+.03))/3.6);
 const st=S0+Math.max(0,c.v*T+c.v*dv/(2*Math.sqrt(Math.max(.01,A*B))));return clamp(A*(1-Math.pow(c.v/Math.max(.8,Vdes),DELTA)-Math.pow(st/Math.max(.1,gap),2)),-5,2)}
function playerAccel(lead,gap){let manual=input.brake?-1.4:input.gas?1.2:-.03;if(cfg().hill&&inZone(player.s,HILL)&&manual>-.5)manual-=.18;if(player.v>=PLAYER_MAX&&manual>0)manual=0;const safe=npcAccel(player,lead,gap),closing=player.v>lead.v+.4;autoBrake=(gap<15.5||closing)&&safe<manual-.12;if(autoBrake)manual=Math.min(manual,safe);if(gap<3)manual=Math.min(manual,-5);return clamp(manual,-5,1.55)}
function stepPhysics(dt){sortCars();const gs=gaps(),acc=new Map();for(let i=0;i<cars.length;i++){const c=cars[i],lead=cars[(i+1)%cars.length],gap=gs.get(c);acc.set(c,c.player?playerAccel(lead,gap):npcAccel(c,lead,gap))}for(const c of cars)c.v=Math.max(0,c.v+acc.get(c)*dt);for(const c of cars)c.s=(c.s+c.v*dt)%L;totalDist+=player.v*dt}
function updateCongestion(dt){sortCars();const gs=gaps();for(let i=0;i<cars.length;i++){const c=cars[i],lead=cars[(i+1)%cars.length],km=c.v*3.6,gap=gs.get(c),closing=Math.max(0,(c.v-lead.v)*3.6),sp=clamp((24-km)/16,0,1),gp=clamp((17-gap)/9,0,1),cp=clamp(closing/8,0,1),raw=clamp(sp*(.28+.72*gp)+.12*cp,0,1),tau=raw>c.jamLevel?3.5:1.3;c.jamLevel+=(raw-c.jamLevel)*Math.min(1,dt/tau)}}
function jamStats(){sortCars();const gs=gaps(),levels=cars.map(c=>c.jamLevel),n=levels.length,w=Math.min(12,n);let best=0;if(n<=w)best=levels.reduce((a,b)=>a+b,0);else{const ext=levels.concat(levels.slice(0,w-1));let score=ext.slice(0,w).reduce((a,b)=>a+b,0);best=score;for(let i=1;i<n;i++){score+=ext[i+w-1]-ext[i-1];best=Math.max(best,score)}}return{gs,best,jamPct:clamp(best/cfg().jamLimit*100,0,100),playerK:player.v*3.6,gap:gs.get(player)}}
function update(realDt){if(!started){render();return}let rem=realDt*SIM_SPEED;while(rem>0){const dt=Math.min(.035,rem);updateEvents();updateRamp(dt);updateCongestion(dt);stepPhysics(dt);rem-=dt}const st=jamStats();failClock=st.best>=cfg().jamLimit?Math.min(.8,failClock+realDt):Math.max(0,failClock-realDt*1.2);if(totalDist>=cfg().laps*L){finish(true);return}if(failClock>=.8){finish(false);return}if(noticeTimer>0){noticeTimer-=realDt;if(noticeTimer<=0)notice.classList.remove("show")}render(st)}
function finish(ok){if(resultShown)return;running=false;resultShown=true;const st=jamStats(),last=stageIndex===STAGES.length-1;overlay.innerHTML=ok?`<div class="overlayCard"><h2 class="good">FINISH</h2><p>${cfg().name}</p><p>JAM ${Math.round(st.jamPct)}%</p><button id="nextBtn" class="mainBtn">${last?"STAGE SELECT":"NEXT STAGE"}</button></div>`:`<div class="overlayCard"><h2 class="bad">GRIDLOCK</h2><p>JAM LEVEL 100%</p><button id="retryBtn" class="mainBtn">RETRY</button></div>`;overlay.classList.remove("hidden");if(ok)$("nextBtn").onclick=()=>last?showStageSelect():reset(stageIndex+1);else $("retryBtn").onclick=()=>reset(stageIndex)}
function quadPoint(p0,p1,p2,t){const u=1-t;return{x:u*u*p0.x+2*u*t*p1.x+t*t*p2.x,y:u*u*p0.y+2*u*t*p1.y+t*t*p2.y}}
function rampGeom(){const ep=roadPoint(MERGE_S,R),a=ep.a,tx=-Math.sin(a),ty=Math.cos(a),rx=Math.cos(a),ry=Math.sin(a);return{p2:{x:ep.x,y:ep.y},p1:{x:ep.x-tx*70+rx*28,y:ep.y-ty*70+ry*28},p0:{x:ep.x-tx*145+rx*115,y:ep.y-ty*145+ry*115}}}
function arc(z,color,w=66){ctx.beginPath();ctx.arc(CX,CY,R,angleAt(z[0]),angleAt(z[1]));ctx.strokeStyle=color;ctx.lineWidth=w;ctx.stroke()}
function chev(s,r,color){const p=roadPoint(s,r);ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.a+Math.PI/2);ctx.strokeStyle=color;ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(-7,-8);ctx.lineTo(6,0);ctx.lineTo(-7,8);ctx.stroke();ctx.restore()}
function drawRoad(){const s=cfg();ctx.fillStyle="#cbd1c6";ctx.fillRect(0,0,600,600);ctx.beginPath();ctx.arc(CX,CY,R,0,Math.PI*2);ctx.strokeStyle="#596064";ctx.lineWidth=88;ctx.stroke();ctx.beginPath();ctx.arc(CX,CY,R,0,Math.PI*2);ctx.strokeStyle="#30343a";ctx.lineWidth=70;ctx.stroke();
 if(s.hill){arc(HILL,"rgba(173,118,40,.72)");for(const x of [66,83,100,117])chev(x,R,"#fff1c7")}
 if(s.curve){arc(CURVE,"rgba(111,79,145,.54)");ctx.beginPath();ctx.arc(CX,CY,R+43,angleAt(CURVE[0]),angleAt(CURVE[1]));ctx.strokeStyle="#f0c84b";ctx.lineWidth=9;ctx.stroke();for(const x of [168,181,194,207,219])chev(x,R+43,"#202020")}
 if(s.tunnel){arc(TUNNEL,"rgba(19,24,29,.94)",68);for(const edge of [TUNNEL[0],TUNNEL[1]]){const a=roadPoint(edge,R-46),b=roadPoint(edge,R+46);ctx.strokeStyle="#c7d0d6";ctx.lineWidth=9;ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke()}for(let x=TUNNEL[0]+8;x<TUNNEL[1]-4;x+=12)for(const rr of [R-25,R+25]){const p=roadPoint(x,rr);ctx.beginPath();ctx.arc(p.x,p.y,3,0,Math.PI*2);ctx.fillStyle="#f5e9aa";ctx.fill()}}
 if((s.events||[]).length){const rg=rampGeom();ctx.beginPath();ctx.moveTo(rg.p0.x,rg.p0.y);ctx.quadraticCurveTo(rg.p1.x,rg.p1.y,rg.p2.x,rg.p2.y);ctx.strokeStyle="#596568";ctx.lineWidth=40;ctx.stroke();ctx.beginPath();ctx.moveTo(rg.p0.x,rg.p0.y);ctx.quadraticCurveTo(rg.p1.x,rg.p1.y,rg.p2.x,rg.p2.y);ctx.strokeStyle="#354146";ctx.lineWidth=30;ctx.stroke()}
 ctx.setLineDash([24,20]);ctx.beginPath();ctx.arc(CX,CY,R,0,Math.PI*2);ctx.strokeStyle="#d8d3c1";ctx.lineWidth=3;ctx.stroke();ctx.setLineDash([])}
function drawRampCars(){if(!rampCars.length)return;const rg=rampGeom();for(const rc of rampCars){const p=quadPoint(rg.p0,rg.p1,rg.p2,clamp(rc.p,0,1)),p2=quadPoint(rg.p0,rg.p1,rg.p2,clamp(rc.p+.01,0,1));ctx.save();ctx.translate(p.x,p.y);ctx.rotate(Math.atan2(p2.y-p.y,p2.x-p.x));ctx.fillStyle=rc.truck?"#555":"#e9e3d6";ctx.strokeStyle="#3f7770";ctx.lineWidth=2;ctx.fillRect(rc.truck?-12:-9,rc.truck?-6:-5,rc.truck?24:18,rc.truck?12:10);ctx.strokeRect(rc.truck?-12:-9,rc.truck?-6:-5,rc.truck?24:18,rc.truck?12:10);ctx.restore()}}
function sev(l){return l<.20?null:l<.42?"#e7c64b":l<.68?"#e78b2f":"#d84735"} function ui(p){return p<35?"#2f8b57":p<58?"#c5a528":p<82?"#e78b2f":"#d84735"}
function drawCar(c){const p=roadPoint(c.s),sc=sev(c.jamLevel);ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.a+Math.PI/2);let fill=c.truck?"#555":"#e9e3d6";if(!c.player&&sc)fill=sc;if(c.player)fill="#2b64d8";ctx.fillStyle=fill;ctx.strokeStyle=c.player?(sc||"#fff"):"rgba(0,0,0,.45)";ctx.lineWidth=c.player?4:1.4;const w=c.truck?25:18,h=c.truck?12:10;ctx.fillRect(-w/2,-h/2,w,h);ctx.strokeRect(-w/2,-h/2,w,h);ctx.restore()}
function render(pre){const st=pre||jamStats();drawRoad();const pa=angleAt(player.s),ga=clamp(st.gap/L*Math.PI*2,0,Math.PI*.45);ctx.beginPath();ctx.arc(CX,CY,R,pa,pa+ga);ctx.strokeStyle="rgba(43,100,216,.22)";ctx.lineWidth=78;ctx.stroke();drawRampCars();for(const c of cars)drawCar(c);
 const raw=totalDist/L,lap=Math.min(cfg().laps,Math.floor(raw)+1),frac=raw%1,pct=Math.round(st.jamPct),col=ui(st.jamPct);lapRead.textContent=`LAP ${lap}/${cfg().laps}`;jamRead.textContent=`${pct}%`;jamRead.style.color=col;speedRead.textContent=st.playerK.toFixed(0);assistRead.textContent=autoBrake?"AUTO BRAKE":"km/h";progressFill.style.width=`${started?frac*100:0}%`;dangerFill.style.width=`${st.jamPct}%`;dangerFill.style.background=col;
 stateText.className="";if(!started){stateText.textContent="PRESS A PEDAL TO START";phaseTag.textContent="READY";centerMain.textContent=cfg().name;centerSub.textContent=cfg().seed?"前方に空間を作って波を吸収":"3周走り切る"}else if(st.jamPct>=82){stateText.textContent="CRITICAL";stateText.className="critical";phaseTag.textContent="DANGER";centerMain.textContent=`JAM ${pct}%`;centerSub.textContent="早めに車間を作る"}else if(st.jamPct>=55){stateText.textContent="JAM GROWING";stateText.className="warn";phaseTag.textContent="WARNING";centerMain.textContent=`JAM ${pct}%`;centerSub.textContent="波が成長中"}else{stateText.textContent="REACH 3 LAPS";phaseTag.textContent=autoBrake?"AUTO BRAKE":"RUNNING";centerMain.textContent=`LAP ${lap}`;centerSub.textContent=`JAM ${pct}%`}
 const es=cfg().events||[];eventText.textContent=es[eventIndex]?`NEXT MERGE: ${es[eventIndex].at.toFixed(1)} LAP`:cfg().seed?"NO ROAD GIMMICKS":""}
function showStageSelect(){running=false;input.gas=input.brake=false;brakeBtn.classList.remove("held");gasBtn.classList.remove("held");overlay.innerHTML='<div class="overlayCard"><h2>STAGE SELECT</h2><div id="stageGrid" class="stageGrid"></div></div>';overlay.classList.remove("hidden");const g=$("stageGrid");STAGES.forEach((s,i)=>{const b=document.createElement("button");b.innerHTML=`${i+1}. ${s.name}<small>${s.desc}</small>`;b.onclick=()=>reset(i);g.appendChild(b)})}
function setPedal(name,on){input[name]=on;(name==="gas"?gasBtn:brakeBtn).classList.toggle("held",on);if(on&&!started){started=true;showNotice(cfg().seed?"車間を作って波を吸収":"GO")}}
function bind(btn,name){btn.addEventListener("pointerdown",e=>{e.preventDefault();btn.setPointerCapture?.(e.pointerId);setPedal(name,true)});const up=e=>{e.preventDefault();setPedal(name,false)};btn.addEventListener("pointerup",up);btn.addEventListener("pointercancel",up);btn.addEventListener("lostpointercapture",()=>setPedal(name,false));btn.addEventListener("contextmenu",e=>e.preventDefault());btn.addEventListener("selectstart",e=>e.preventDefault());btn.addEventListener("dragstart",e=>e.preventDefault())}
bind(brakeBtn,"brake");bind(gasBtn,"gas");document.addEventListener("selectionchange",()=>{const s=window.getSelection?.();if(s&&s.anchorNode&&(brakeBtn.contains(s.anchorNode)||gasBtn.contains(s.anchorNode)))s.removeAllRanges()});
restartBtn.onclick=()=>reset(stageIndex);selectBtn.onclick=showStageSelect;pauseBtn.onclick=()=>{if(!started||!running)return;paused=!paused;pauseBtn.textContent=paused?"RESUME":"PAUSE";input.gas=input.brake=false;brakeBtn.classList.remove("held");gasBtn.classList.remove("held")};
function frame(ts){if(!lastTs)lastTs=ts;const dt=Math.min(.05,(ts-lastTs)/1000);lastTs=ts;if(running&&!paused)update(dt);requestAnimationFrame(frame)}
reset(0);showStageSelect();requestAnimationFrame(frame);
})();