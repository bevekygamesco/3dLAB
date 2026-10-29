// Exercise the real controller with deterministic geometry, clock and wheel input.
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),ts=require('typescript');
const source=ts.transpileModule(fs.readFileSync('components/ExperienceChapterMotion.tsx','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText;
for(const id of ['experience','mobility','materials']){
 let now=0,y=-1600,n=0,cleanup;const frames=new Map(),timers=new Map(),events={};
 const root={dataset:{count:id==='materials'?'5':'4'},style:{setProperty(){}},getBoundingClientRect:()=>({top:-y,bottom:4000-y,height:4000}),querySelector:()=>null,querySelectorAll:()=>[],setAttribute(){},addEventListener(){},removeEventListener(){}};
 const ctx={exports:{},require:name=>name==='react'?{useEffect:f=>cleanup=f()}:require('../components/cinematic/motionSettings.ts'),document:{getElementById:()=>root,querySelector:()=>null,querySelectorAll:()=>[root],documentElement:{clientWidth:1000}},matchMedia:()=>({matches:false}),innerHeight:1000,performance:{now:()=>now},requestAnimationFrame:f=>{frames.set(++n,f);return n},cancelAnimationFrame:n=>frames.delete(n),setTimeout:(f,ms)=>{timers.set(++n,{f,at:now+ms});return n},clearTimeout:n=>timers.delete(n),CustomEvent:class{},window:{addEventListener:(name,f)=>events[name]=f,removeEventListener(){},scrollTo:({top})=>{y=top}}};
 // Transpile settings as well, independent of Node's TypeScript support.
 const settings={exports:{}};vm.runInNewContext(ts.transpileModule(fs.readFileSync('components/cinematic/motionSettings.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText,settings);
 ctx.require=name=>name==='react'?{useEffect:f=>cleanup=f()}:settings.exports;
 Object.defineProperty(ctx,'scrollY',{get:()=>y});vm.runInNewContext(source,ctx);ctx.exports.default({id});
 const tick=ms=>{now+=ms;const pending=[...frames];frames.clear();pending.forEach(([,f])=>f(now));for(const [key,t] of [...timers])if(t.at<=now){timers.delete(key);t.f()}};
 const wheel=(dy,dx=0)=>{const e={deltaY:dy,deltaX:dx,deltaMode:0,type:'wheel',defaultPrevented:false,preventDefault(){this.defaultPrevented=true}};events.wheel(e);return e};
 tick(0);
 assert(wheel(5000).defaultPrevented,'oversized entry captured');assert.equal(y,0);assert.equal(root.dataset.phase,'0');
 wheel(5000);assert.equal(root.dataset.phase,'1');assert.equal(root.dataset.playing,'true');
 tick(250);for(let i=0;i<30;i++)wheel(5000);assert.equal(root.dataset.phase,'1','spam does not skip unfinished chapter');assert.equal(root.dataset.queued,'1');
 assert(wheel(.2).defaultPrevented);assert(wheel(.2,5).defaultPrevented);
 const pinned=y;y+=500;events.scroll();assert.equal(y,pinned,'native wheel drift cannot cancel chapter');assert.equal(root.dataset.playing,'true');
 tick(1000);assert.equal(root.dataset.playing,'false');tick(120);assert.equal(root.dataset.phase,'2','only next adjacent chapter starts');
 events.mousedown({clientX:1001});y=2300;events.scroll();tick(0);assert.equal(y,2300,'scrollbar remains free');assert.equal(root.dataset.playing,'false');assert.equal(root.dataset.queued,'0');events.mouseup();
 y=1000;events.scroll();tick(0);wheel(50);tick(1000);tick(120);assert.equal(root.dataset.phase,'2','wheel resumes step mode after scrollbar');
 cleanup();console.log(id+': oversized entry, spam, fractional input, drift protection, scrollbar bypass PASS');
}
