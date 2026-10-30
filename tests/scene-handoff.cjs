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
 tick(1);wheel(24000);assert.equal(dataset.sceneOwner,'experience');assert.equal(y,1000);now+=200;wheel(24000);assert.equal(roots[0].dataset.playing,'true');assert.equal(y,1000);
 // Menu click during frame preparation releases all scenes and clears stale wheel intent.
 dataset.navigating='true';send('studio-navigation-start');assert.equal(dataset.sceneOwner,undefined);assert(roots.every(r=>!r.dataset.wheelOwned));y=roots[2].top;send('scroll');send('studio-navigation-land',{detail:'mobility'});assert.equal(dataset.sceneOwner,'mobility');assert.equal(roots[2].dataset.phase,'0');assert.equal(roots[2].dataset.playing,'false');delete dataset.navigating;send('studio-navigation-end',{detail:'mobility'});
 for(const resolve of ready)resolve();await Promise.resolve();await Promise.resolve();tick(1000);send('scroll');assert.equal(y,roots[2].top,'old chair work cannot pull navigation back');assert.equal(dataset.sceneOwner,'mobility');
 // A very large next gesture belongs only to the destination, with a stable anchor.
 now+=200;wheel(40000);assert.equal(roots[2].dataset.phase,'1');assert.equal(roots[0].dataset.playing,'false');assert.equal(y,roots[2].top);
 // Navigation out to an ordinary section stays free, even after late scroll callbacks.
 dataset.navigating='true';send('studio-navigation-start');y=5100;send('scroll');send('studio-navigation-land',{detail:'projects'});delete dataset.navigating;send('studio-navigation-end',{detail:'projects'});send('scroll');tick(1);assert.equal(y,5100);assert.equal(dataset.sceneOwner,undefined);
 // Scrollbar dragging is still an explicit bypass.
 now+=200;y=1000;send('experience:experience-chapter-request',{detail:0});assert.equal(dataset.sceneOwner,'experience');send('mousedown',{clientX:1201});y=6000;send('scroll');tick(1);assert.equal(y,6000);assert.equal(dataset.sceneOwner,undefined);
 console.log('PASS: three-scene ownership, navigation during decode, stale callbacks, first-frame landing, 40,000px wheel, ordinary destination, scrollbar bypass');
})().catch(e=>{console.error(e);process.exitCode=1});
