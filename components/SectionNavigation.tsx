'use client';
import {useEffect,useRef,useState} from 'react';
/** Paint-on cover, instant destination change, paint-off reveal. */
export default function SectionNavigation(){
 const [phase,setPhase]=useState<'idle'|'cover'|'reveal'>('idle');
 const active=useRef(false),destination=useRef(''),frame=useRef(0);
 useEffect(()=>{
  const reset=()=>{history.scrollRestoration='manual';window.scrollTo({top:0,left:0,behavior:'instant'})};
  reset();window.addEventListener('pageshow',reset);
  const move=(id:string)=>{
   const target=document.getElementById(id);if(!target||active.current)return;
   destination.current=id;active.current=true;document.documentElement.dataset.navigating='true';window.dispatchEvent(new Event('studio-navigation-start'));
   if(matchMedia('(prefers-reduced-motion: reduce)').matches){target.scrollIntoView({behavior:'instant',block:'start'});window.dispatchEvent(new CustomEvent('studio-navigation-land',{detail:id}));delete document.documentElement.dataset.navigating;window.dispatchEvent(new CustomEvent('studio-navigation-end',{detail:id}));active.current=false;return}
   setPhase('cover');
  };
  const navigate=(e:Event)=>move((e as CustomEvent<string>).detail);
  const click=(e:MouseEvent)=>{if(e.defaultPrevented||e.ctrlKey||e.metaKey||e.shiftKey||e.altKey||e.button!==0)return;const a=(e.target as Element).closest<HTMLAnchorElement>('a[href^="#"]');if(!a)return;const id=a.hash.slice(1);if(!id||!document.getElementById(id))return;e.preventDefault();move(id)};
  const wheel=(e:WheelEvent)=>{if(active.current&&!e.ctrlKey)e.preventDefault()};
  const touch=(e:TouchEvent)=>{if(active.current)e.preventDefault()};
  const key=(e:KeyboardEvent)=>{if(active.current&&['ArrowDown','ArrowUp','PageDown','PageUp','Home','End',' '].includes(e.key))e.preventDefault()};
  const drag=(e:DragEvent)=>{if((e.target as Element).closest('img,canvas'))e.preventDefault()};
  document.addEventListener('dragstart',drag);window.addEventListener('keydown',key,true);window.addEventListener('studio-navigate',navigate);document.addEventListener('click',click);window.addEventListener('wheel',wheel,{passive:false,capture:true});window.addEventListener('touchmove',touch,{passive:false});
  return()=>{document.removeEventListener('dragstart',drag);window.removeEventListener('keydown',key,true);cancelAnimationFrame(frame.current);window.removeEventListener('pageshow',reset);window.removeEventListener('studio-navigate',navigate);document.removeEventListener('click',click);window.removeEventListener('wheel',wheel,true);window.removeEventListener('touchmove',touch);delete document.documentElement.dataset.navigating};
 },[]);
 function covered(){
  const id=destination.current,target=document.getElementById(id);if(!target)return;
  target.scrollIntoView({behavior:'instant',block:'start'});
  window.dispatchEvent(new CustomEvent('studio-navigation-land',{detail:id}));
  const heading=target.querySelector<HTMLElement>('h1,h2');if(heading){heading.tabIndex=-1;heading.focus({preventScroll:true})}
  frame.current=requestAnimationFrame(()=>{frame.current=requestAnimationFrame(()=>setPhase('reveal'))});
 }
 return <div className={`section-wipe wipe-${phase}`} aria-hidden="true"><div className="wipe-paint" onAnimationEnd={e=>{if(e.target!==e.currentTarget)return;if(phase==='cover')covered();else if(phase==='reveal'){delete document.documentElement.dataset.navigating;window.dispatchEvent(new CustomEvent('studio-navigation-end',{detail:destination.current}));active.current=false;setPhase('idle')}}}><div className="wipe-wordmark"><span>3D CONFIG LAB</span><i/><small>A NEW PERSPECTIVE</small></div></div><div className="wipe-roller"><i/><span/></div></div>;
}
