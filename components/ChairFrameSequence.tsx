'use client';
import {useEffect,useRef} from 'react';
/** Bounded frame cache; draw the closest ready render while the latest target decodes. */
export default function ChairFrameSequence({kind='chair'}:{kind?:'chair'|'bicycle'}){
 const count=kind==='bicycle'?120:144,width=kind==='bicycle'?1100:1080,height=kind==='bicycle'?800:864,folder=kind==='bicycle'?'bicycle-colors':'chair-cinematic';
 const host=useRef<HTMLDivElement>(null),canvas=useRef<HTMLCanvasElement>(null);
 useEffect(()=>{
  const node=host.current,out=canvas.current,section=node?.closest<HTMLElement>('[data-scroll-scene]');if(!node||!out||!section||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  const ctx=out.getContext('2d',{alpha:true});if(!ctx)return;
  const mobile=matchMedia('(max-width:767px)').matches,limit=mobile?10:16,cache=new Map<number,ImageBitmap>(),pending=new Set<number>(),blobs=new Map<number,Blob>(),fetching=new Map<number,Promise<Blob>>(),failed=new Set<number>();
  let dead=false,near=false,suspended=false,warming=false,target=0,drawn=-1,raf=0,direction=1;
  const trim=()=>{while(cache.size>limit){const victim=[...cache.keys()].filter(i=>i!==drawn).sort((a,b)=>Math.abs(b-target)-Math.abs(a-target))[0];if(victim===undefined)break;cache.get(victim)?.close();cache.delete(victim)}};
  const blobFor=(i:number)=>{if(blobs.has(i))return Promise.resolve(blobs.get(i)!);if(fetching.has(i))return fetching.get(i)!;const job=fetch(`/assets/${folder}/${mobile?'mobile/':''}${String(i).padStart(4,'0')}.webp`,{cache:'force-cache'}).then(r=>{if(!r.ok)throw Error('frame');return r.blob()}).then(blob=>{if(!dead)blobs.set(i,blob);return blob}).finally(()=>fetching.delete(i));fetching.set(i,job);return job};
  const warm=async()=>{if(warming||dead||!near||suspended)return;warming=true;const from=target;for(let n=2;n<=36;n+=2){if(dead||!near||suspended)break;const i=from+n*direction;if(i>=0&&i<count)await blobFor(i).catch(()=>{});}warming=false};
  const load=async(i:number)=>{if(i<0||i>=count||dead||cache.has(i)||pending.has(i)||pending.size>=2||failed.has(i))return;pending.add(i);try{const image=await createImageBitmap(await blobFor(i));if(dead||!near){image.close();return}cache.set(i,image);trim()}catch{failed.add(i)}finally{pending.delete(i);schedule()}};
  const tick=()=>{raf=0;if(dead||!near||suspended)return;const nearest=cache.has(target)?target:[...cache.keys()].sort((a,b)=>Math.abs(a-target)-Math.abs(b-target))[0];if(nearest!==undefined&&nearest!==drawn){const image=cache.get(nearest)!;ctx.clearRect(0,0,width,height);ctx.drawImage(image,0,0,width,height);drawn=nearest;node.dataset.frame=String(nearest);node.dataset.ready='true'}void load(target);for(let d=1;d<=4;d++){void load(target+d*direction);void load(target-d*direction)}void warm()};
  function schedule(){if(!raf&&near&&!dead&&!suspended)raf=requestAnimationFrame(tick)}
  const progress=(e:Event)=>{const n=Math.round(Math.max(0,Math.min(1,(e as CustomEvent<number>).detail))*(count-1));if(n!==target)direction=n>target?1:-1;target=n;node.dataset.targetFrame=String(n);schedule()};
  const observer=new IntersectionObserver(entries=>{near=entries[0].isIntersecting;node.dataset.near=String(near);if(near){target=Math.round(Number(node.dataset.progress??0)*(count-1));schedule()}else{cancelAnimationFrame(raf);raf=0;for(const [i,image] of cache){image.close();cache.delete(i)}}},{rootMargin:'250px 0px'});observer.observe(section);node.addEventListener('chair-progress',progress);const dialog=(e:Event)=>{suspended=!!(e as CustomEvent<boolean>).detail;if(suspended){for(const image of cache.values())image.close();cache.clear()}else schedule()};window.addEventListener('studio-dialog',dialog);
  return()=>{dead=true;observer.disconnect();cancelAnimationFrame(raf);node.removeEventListener('chair-progress',progress);window.removeEventListener('studio-dialog',dialog);for(const image of cache.values())image.close();blobs.clear()};
 },[kind,count,width,height,folder]);
 return <div ref={host} className={`chair-frame-sequence ${kind==='bicycle'?'bicycle-frame-sequence':''}`} data-chair-sequence data-frame-count={count} data-ready="false" data-frame="0"><picture><source media="(max-width:767px)" srcSet={`/assets/${folder}/mobile/0000.webp`}/><img loading="lazy" src={`/assets/${folder}/0000.webp`} width={width} height={height} alt={kind==='bicycle'?'Electric bicycle finish demo':'Lounge chair cinematic quality demo'}/></picture><canvas ref={canvas} width={width} height={height} role="img" aria-label="Rendered 3D quality demo: camera movement, materials and product detail"/></div>;
}
