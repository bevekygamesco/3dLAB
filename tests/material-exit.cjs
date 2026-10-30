const fs=require('fs'),vm=require('vm'),assert=require('assert'),ts=require(process.cwd()+'/node_modules/typescript');
let now=1000,y=0,rid=0;const events=new Map(),frames=new Map(),timers=new Map(),ready=[];
function on(name,f){if(!events.has(name))events.set(name,[]);events.get(name).push(f)}
const send=(name,event={})=>{for(const f of events.get(name)||[])f(event)};
const roots=['experience','materials','mobility'].map((id,i)=>({id,top:1000+i*4500,dataset:{count:id==='materials'?'5':'4'},style:{setProperty(){}},setAttribute(){},querySelector(s){return s==='[data-chair-sequence]'&&id!=='materials'?{dataset:{},dispatchEvent(e){if(e.type==='prepare-chapter')ready.push(e.detail.resolve)}}:null},querySelectorAll:()=>[],getBoundingClientRect(){return {top:this.top-y,bottom:this.top+4000-y,height:4000}},addEventListener(name,f){on(id+':'+name,f)},removeEventListener(){}}));
const dataset={},context={exports:{},require:n=>n==='react'?{useEffect:f=>f()}:{motionSettings:{chapterDurationMs:760,materialDurationMs:420,settleDurationMs:120,queueIntentMs:180,wheelIntentPx:18,wheelGestureGapMs:160}},document:{documentElement:{dataset,clientWidth:1200},getElementById:id=>roots.find(r=>r.id===id),querySelector:()=>null,querySelectorAll:()=>roots},window:{addEventListener:on,removeEventListener(){},scrollTo(o){y=o.top}},innerHeight:800,performance:{now:()=>now},matchMedia:()=>({matches:false}),requestAnimationFrame:f=>{frames.set(++rid,f);return rid},cancelAnimationFrame:i=>frames.delete(i),setTimeout:f=>{timers.set(++rid,f);return rid},clearTimeout:i=>timers.delete(i),CustomEvent:class{constructor(type,o){this.type=type;this.detail=o.detail}},console};
Object.defineProperty(context,'scrollY',{get:()=>y});vm.createContext(context);vm.runInContext(ts.transpileModule(fs.readFileSync('components/ExperienceChapterMotion.tsx','utf8'),{compilerOptions:{target:ts.ScriptTarget.ES2020,module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX}}).outputText,context);for(const root of roots)context.exports.default({id:root.id});
function tick(ms){now+=ms;const fs=[...frames.values()];frames.clear();for(const f of fs)f(now)}
function wheel(delta){const e={type:'wheel',deltaY:delta,deltaX:0,deltaMode:0,defaultPrevented:false,preventDefault(){this.defaultPrevented=true}};send('wheel',e);return e}
(async()=>{
 tick(1);
 // Complete the last material before a delayed document-scroll callback arrives.
 send('materials:experience-chapter-request',{detail:4});
 assert.equal(roots[1].dataset.phase,'4');for(let i=0;i<4;i++){tick(100);wheel(200)}tick(21);
 for(const f of [...timers.values()])f();timers.clear();now+=1;
 assert(wheel(200).defaultPrevented);const exitY=y;
 assert.equal(dataset.sceneOwner,undefined,'last material releases ownership');
 for(let i=0;i<8;i++){send('scroll');tick(20);assert.equal(roots[1].dataset.phase,'4','exit callbacks must not restart material zero');assert.equal(dataset.sceneOwner,undefined,'no completed earlier section may recapture the exit');}
 now+=200;wheel(120);send('scroll');tick(1);assert.notEqual(dataset.sceneOwner,'materials','continued down-scroll stays released');assert.equal(y,exitY);
 // A deliberate reverse gesture can still return to the last material.
 now+=200;wheel(-120);assert.equal(dataset.sceneOwner,'materials');assert.equal(roots[1].dataset.phase,'4');
 console.log('PASS: final-material exit, delayed scroll callbacks, continued scrolling, deliberate reverse re-entry');
})().catch(e=>{console.error(e);process.exitCode=1});
