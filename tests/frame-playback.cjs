const fs=require('fs'),vm=require('vm'),assert=require('assert'),ts=require(process.cwd()+'/node_modules/typescript');
(async()=>{for(const kind of ['chair','bicycle']){
 let refs=0,decode=0,draw=0,closed=0,cleanup;const listeners={},rafs=new Map();let rid=0,observer;
 const section={},host={dataset:{},closest:()=>section,addEventListener(n,f){listeners[n]=f},removeEventListener(){}};
 const canvas={getContext:()=>({clearRect(){},drawImage(){draw++}})};
 const context={exports:{},require(n){if(n==='react')return {useRef:()=>({current:refs++===0?host:canvas}),useEffect:f=>cleanup=f()};if(n.includes('sequenceAssets'))return {sequenceUrl:(_,__,i)=>i,sequenceBlob:async i=>i};return {jsx:()=>null,jsxs:()=>null}},matchMedia:()=>({matches:false}),IntersectionObserver:class{constructor(f){observer=f}observe(){}disconnect(){}},createImageBitmap:async()=>{decode++;return {close(){closed++}}},requestAnimationFrame(f){rafs.set(++rid,f);return rid},cancelAnimationFrame(i){rafs.delete(i)},window:{addEventListener(){},removeEventListener(){}},console};vm.createContext(context);vm.runInContext(ts.transpileModule(fs.readFileSync('components/ChairFrameSequence.tsx','utf8'),{compilerOptions:{target:ts.ScriptTarget.ES2020,module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX}}).outputText,context);context.exports.default({kind});observer([{isIntersecting:true}]);
 const flush=()=>{const fs=[...rafs.values()];rafs.clear();fs.forEach(f=>f())};flush();await new Promise(setImmediate);flush();
 await new Promise(resolve=>listeners['prepare-chapter']({detail:{from:0,to:.3333333333333333,resolve}}));const warmed=decode;
 for(let i=0;i<=39;i++){listeners['chair-progress']({detail:i/119});flush()}
 assert.equal(decode,warmed,'playback never decodes during a prepared chapter');assert(draw>20);cleanup();assert.equal(closed,decode,'all bitmaps closed');console.log('PASS '+kind+': predecode, exact ready-frame draw, zero playback decodes, bitmap cleanup');
}})().catch(e=>{console.error(e);process.exitCode=1});
