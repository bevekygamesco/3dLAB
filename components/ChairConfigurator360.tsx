'use client';
import {useEffect,useRef,useState} from 'react';
import {atlasUrl,getAtlasBlob,warmViewerAssets} from './viewerAssets';
export default function ChairConfigurator360({finish}:{finish:number}){
 const canvas=useRef<HTMLCanvasElement>(null),previous=useRef<HTMLCanvasElement>(null),host=useRef<HTMLDivElement>(null),angle=useRef(0),drag=useRef<{x:number;a:number}|null>(null),state=useRef({finish,index:0,direction:1});state.current.finish=finish;
 const [index,setIndex]=useState(0),schedule=useRef(()=>{});
 useEffect(()=>{
  const out=canvas.current,back=previous.current;if(!out||!back)return;const ctx=out.getContext('2d'),backCtx=back.getContext('2d');if(!ctx||!backCtx)return;
  const mobile=matchMedia('(max-width:767px)').matches,w=mobile?640:960,h=mobile?512:768;out.width=back.width=w;out.height=back.height=h;
  const cache=new Map<string,ImageBitmap>(),pending=new Set<string>(),failed=new Set<string>();let dead=false,raf=0,drawn='',drawnFinish=-1,fade:ReturnType<typeof setTimeout>;
  const load=async(f:number,c:number)=>{c=(c+8)%8;const key=`${f}/${c}`;if(dead||cache.has(key)||pending.has(key)||failed.has(key)||pending.size>=2)return;pending.add(key);try{const image=await createImageBitmap(await getAtlasBlob(atlasUrl(mobile,f,c)));if(dead){image.close();return}cache.set(key,image);const current=Math.floor(state.current.index/8);while(cache.size>3){const victim=[...cache.keys()].filter(k=>k!==`${state.current.finish}/${current}`).sort((a,b)=>{const score=(k:string)=>{const [m,n]=k.split('/').map(Number);return m!==state.current.finish?100:Math.min(Math.abs(n-current),8-Math.abs(n-current))};return score(b)-score(a)})[0];if(!victim)break;cache.get(victim)?.close();cache.delete(victim)}}catch{failed.add(key)/* Retain the last complete angle if an atlas is unavailable. */}finally{pending.delete(key);request()}};
  const draw=()=>{
   raf=0;if(dead)return;const {finish:f,index:i,direction}=state.current,c=Math.floor(i/8);let frame=i,key=`${f}/${c}`;
   if(!cache.has(key)){let best=Infinity;for(const k of cache.keys()){const [m,n]=k.split('/').map(Number);if(m!==f)continue;const start=n*8,end=Math.min(59,start+7);for(const v of [start,end,Math.max(start,Math.min(end,i))]){const d=Math.min(Math.abs(v-i),60-Math.abs(v-i));if(d<best){best=d;frame=v;key=k}}}}
   const image=cache.get(key),id=`${f}/${frame}`;
   if(image&&id!==drawn){if(drawnFinish!==f&&drawnFinish>=0){backCtx.clearRect(0,0,w,h);backCtx.drawImage(out,0,0);back.style.transition='none';back.style.opacity='1';requestAnimationFrame(()=>{if(dead)return;back.style.transition='opacity 280ms ease';back.style.opacity='0'});clearTimeout(fade);fade=setTimeout(()=>backCtx.clearRect(0,0,w,h),320)}
    const local=frame%8;ctx.clearRect(0,0,w,h);ctx.drawImage(image,(local%4)*w,Math.floor(local/4)*h,w,h,0,0,w,h);drawn=id;drawnFinish=f;if(host.current){host.current.dataset.finish=String(f);host.current.dataset.frame=String(frame);host.current.dataset.ready='true';host.current.dataset.decodedSheets=String(cache.size)}
   }
   void load(f,c);void load(f,c+direction);void load(f,c-direction);
  };
  function request(){if(!dead&&!raf)raf=requestAnimationFrame(draw)}schedule.current=request;request();void warmViewerAssets(mobile);
  return()=>{dead=true;cancelAnimationFrame(raf);clearTimeout(fade);schedule.current=()=>{};for(const image of cache.values())image.close()};
 },[]);
 useEffect(()=>{schedule.current()},[finish]);
 const turn=(v:number)=>{state.current.direction=v>=angle.current?1:-1;angle.current=v;const i=(Math.round(v)%60+60)%60;state.current.index=i;setIndex(i);schedule.current()};
 return <div ref={host} className="chair-turntable" role="slider" tabIndex={0} aria-label="Rotate chair 360 degrees" aria-valuemin={0} aria-valuemax={354} aria-valuenow={index*6} onKeyDown={e=>{if(['ArrowLeft','ArrowRight'].includes(e.key)){e.preventDefault();e.stopPropagation();turn(angle.current+(e.key==='ArrowRight'?1:-1))}}} onPointerDown={e=>{drag.current={x:e.clientX,a:angle.current};e.currentTarget.setPointerCapture(e.pointerId)}} onPointerMove={e=>{if(drag.current)turn(drag.current.a+(e.clientX-drag.current.x)/9)}} onPointerUp={()=>drag.current=null} onPointerCancel={()=>drag.current=null}><img className="turntable-poster" src="/assets/chair.webp" alt=""/><canvas ref={canvas}/><canvas ref={previous} className="turntable-previous" aria-hidden="true"/></div>;
}
