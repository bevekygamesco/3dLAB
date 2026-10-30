'use client';
import {useEffect,useRef} from 'react';
import {sequenceBlob,sequenceUrl} from './sequenceAssets';
/** Prepare a whole chapter before its clock starts; playback only draws decoded frames. */
export default function ChairFrameSequence({kind='chair'}:{kind?:'chair'|'bicycle'}){
 const count=kind==='bicycle'?120:144,width=kind==='bicycle'?1100:1080,height=kind==='bicycle'?800:864,folder=kind==='bicycle'?'bicycle-colors':'chair-cinematic';
 const host=useRef<HTMLDivElement>(null),canvas=useRef<HTMLCanvasElement>(null);
 useEffect(()=>{
  const node=host.current,out=canvas.current,section=node?.closest<HTMLElement>('[data-scroll-scene]');if(!node||!out||!section)return;
  const ctx=out.getContext('2d',{alpha:true});if(!ctx)return;
  const mobile=matchMedia('(max-width:767px)').matches,cache=new Map<number,ImageBitmap>(),pending=new Map<number,Promise<void>>();
  let dead=false,near=false,suspended=false,target=0,drawn=-1,raf=0,generation=0,preparing=false;
  const load=(i:number):Promise<void>=>{
   if(dead||i<0||i>=count||cache.has(i))return Promise.resolve();const hit=pending.get(i);if(hit)return hit;
   const job=(async()=>{const image=await createImageBitmap(await sequenceBlob(sequenceUrl(kind,mobile,i)));if(dead){image.close();return}cache.set(i,image)})().finally(()=>pending.delete(i));pending.set(i,job);return job;
  };
  const paint=()=>{raf=0;if(dead||!near||suspended)return;const image=cache.get(target);if(image&&drawn!==target){ctx.clearRect(0,0,width,height);ctx.drawImage(image,0,0,width,height);drawn=target;node.dataset.frame=String(target);node.dataset.ready='true'}else if(!image&&!preparing){const wanted=target;void load(wanted).then(()=>{if(wanted===target)schedule()}).catch(()=>{})}};
  function schedule(){if(!raf&&!dead&&near&&!suspended)raf=requestAnimationFrame(paint)}
  const prepare=async(e:Event)=>{
   const {from,to,resolve}=(e as CustomEvent<{from:number;to:number;resolve:()=>void}>).detail;const token=++generation;preparing=true;node.dataset.buffering='true';
   const lo=Math.max(0,Math.floor(Math.min(from,to)*(count-1))),hi=Math.min(count-1,Math.ceil(Math.max(from,to)*(count-1)));
   // Retain only this transition and the visible pose. Peak memory is one chapter.
   for(const [i,image] of cache)if((i<lo||i>hi)&&i!==drawn){image.close();cache.delete(i)}
   let next=lo;const worker=async()=>{while(!dead&&token===generation&&next<=hi){const i=next++;await load(i).catch(()=>{})}};
   try{await Promise.all([worker(),worker(),worker()])}finally{if(token===generation){preparing=false;node.dataset.buffering='false'}resolve();schedule()}
  };
  const progress=(e:Event)=>{target=Math.round(Math.max(0,Math.min(1,(e as CustomEvent<number>).detail))*(count-1));node.dataset.targetFrame=String(target);schedule()};
  const releaseFrames=()=>{for(const [i,image] of cache)if(i!==drawn){image.close();cache.delete(i)}};
  const observer=new IntersectionObserver(entries=>{near=entries[0].isIntersecting;if(near){target=Math.round(Number(node.dataset.progress??0)*(count-1));schedule()}else if(!preparing)releaseFrames()},{rootMargin:'600px 0px'});observer.observe(section);
  node.addEventListener('chair-progress',progress);node.addEventListener('prepare-chapter',prepare);
  const dialog=(e:Event)=>{suspended=!!(e as CustomEvent<boolean>).detail;if(suspended&&!preparing)releaseFrames();else if(!suspended)schedule()};window.addEventListener('studio-dialog',dialog);
  return()=>{dead=true;generation++;observer.disconnect();cancelAnimationFrame(raf);node.removeEventListener('chair-progress',progress);node.removeEventListener('prepare-chapter',prepare);window.removeEventListener('studio-dialog',dialog);for(const image of cache.values())image.close()};
 },[kind,count,width,height]);
 return <div ref={host} className={`chair-frame-sequence ${kind==='bicycle'?'bicycle-frame-sequence':''}`} data-chair-sequence data-frame-count={count} data-ready="false" data-frame="0"><picture><source media="(max-width:767px)" srcSet={`/assets/${folder}/mobile/0000.webp`}/><img loading="lazy" src={`/assets/${folder}/0000.webp`} width={width} height={height} alt={kind==='bicycle'?'Electric bicycle finish demo':'Lounge chair cinematic quality demo'}/></picture><canvas ref={canvas} width={width} height={height} role="img" aria-label="Rendered 3D quality demo: camera movement, materials and product detail"/></div>;
}
