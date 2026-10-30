const fs=require('fs'),vm=require('vm'),assert=require('assert'),ts=require(process.cwd()+'/node_modules/typescript');
for(const reduced of [false,true]){
 let state='idle',slot=0,effectRan=false,y=4000,focused=false;const refs=[],handlers={},events=[],frames=[],dataset={};
 const target={querySelector:()=>({focus(){focused=true}}),scrollIntoView(o){assert.equal(o.behavior,'instant');y=1000}};
 const document={documentElement:{dataset},getElementById:id=>id==='experience'?target:null,addEventListener(n,f){handlers[n]=f},removeEventListener(){}};
 const window={scrollTo(o){y=o.top},addEventListener(n,f){handlers[n]=f},removeEventListener(){},dispatchEvent(e){events.push(e.type)}};
 const ctx={exports:{},require(n){if(n==='react')return {useState:()=>[state,v=>state=v],useRef:v=>refs[slot++]??(refs[slot-1]={current:v}),useEffect:f=>{if(!effectRan){effectRan=true;f()}}};return {jsx:(type,props)=>({type,props}),jsxs:(type,props)=>({type,props})}},window,document,history:{scrollRestoration:'auto'},Event:class{constructor(type){this.type=type}},CustomEvent:class{constructor(type,o){this.type=type;this.detail=o.detail}},matchMedia:()=>({matches:reduced}),requestAnimationFrame:f=>{frames.push(f);return 1},cancelAnimationFrame(){},console};
 vm.createContext(ctx);vm.runInContext(ts.transpileModule(fs.readFileSync('components/SectionNavigation.tsx','utf8'),{compilerOptions:{target:ts.ScriptTarget.ES2020,module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX}}).outputText,ctx);
 const render=()=>{slot=0;return ctx.exports.default()};render();assert.equal(y,0,'refresh starts at top');handlers['studio-navigate']({detail:'experience'});
 if(reduced){assert.equal(y,1000);assert.equal(dataset.navigating,undefined);assert.deepEqual(events,['studio-navigation-start','studio-navigation-land','studio-navigation-end']);continue}
 assert.equal(y,0,'destination stays unchanged until cover finishes');assert.equal(state,'cover');let blocked=false;handlers.wheel({preventDefault(){blocked=true}});assert(blocked);
 const cover=render().props.children[0];cover.props.onAnimationEnd({target:cover,currentTarget:cover});assert.equal(y,1000);assert(focused);assert.deepEqual(events,['studio-navigation-start','studio-navigation-land']);while(frames.length)frames.shift()();assert.equal(state,'reveal');
 const reveal=render().props.children[0];reveal.props.onAnimationEnd({target:reveal,currentTarget:reveal});assert.equal(state,'idle');assert.equal(dataset.navigating,undefined);assert.deepEqual(events,['studio-navigation-start','studio-navigation-land','studio-navigation-end']);
}
console.log('PASS: reset to top, paint cover before teleport, navigation events, input shield, reveal completion, reduced motion');
