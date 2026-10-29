'use client';
import {useEffect} from 'react';
import {motionSettings} from './cinematic/motionSettings';
const clamp=(v:number)=>Math.max(0,Math.min(1,v));
const ease=(v:number)=>v*v*(3-2*v);
/** Fixed-speed steps with one buffered intention; native scrollbar navigation stays free. */
export default function ExperienceChapterMotion({id='experience'}:{id?:string}){
 useEffect(()=>{
  const root=document.getElementById(id);if(!root)return;
  const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const count=Number(root.dataset.count??3),stops=id==='experience'?[0,.27,.62,1]:Array.from({length:count},(_,i)=>i/(count-1));
  const sequence=root.querySelector<HTMLElement>('[data-chair-sequence]'),buttons=Array.from(root.querySelectorAll<HTMLButtonElement>('[data-scene-jump]'));
  let progress=0,chapter=0,raf=0,scrollRaf=0,busy=false,settling=false,dead=false,pinY=0,started=0,queued=0,release=0,touchY=0,touchUsed=false;
  let wheelDirection=0,wheelDistance=0,lastWheel=0,scrollbarDragging=false;
  let settleTimer:ReturnType<typeof setTimeout>|undefined;
  root.dataset.chapterDriven='true';root.dataset.playing='false';root.dataset.queued='0';
  const geometry=()=>{const r=root.getBoundingClientRect();return {r,top:scrollY+r.top,distance:Math.max(1,r.height-innerHeight)}};
  const announce=(i:number)=>{chapter=i;root.dataset.phase=String(i);buttons.forEach((b,j)=>b.setAttribute('aria-pressed',String(i===j)));const edition=root.querySelector('.scene-edition');if(edition&&id!=='materials')edition.textContent=`DEMO / 0${i+1}`};
  const paint=(p:number)=>{
   progress=p;root.style.setProperty('--scene-p',String(p));
   if(id==='mobility'){const colors=[[13,19,22],[13,40,28],[57,18,23],[59,44,14]],k=Math.min(2,Math.floor(p*3)),t=ease(clamp(p*3-k));['r','g','b'].forEach((c,i)=>root.style.setProperty(`--finish-${c}`,String(colors[k][i]*(1-t)+colors[k+1][i]*t)))}
   if(id==='experience'){const k=Math.min(2,Math.max(0,stops.findIndex((v,i)=>i<3&&p<=stops[i+1]))),t=ease(clamp((p-stops[k])/(stops[k+1]-stops[k]))),x=[66,32,32,66];root.style.setProperty('--story-x',`${x[k]+(x[k+1]-x[k])*t}%`);root.style.setProperty('--story-scale',String(1+Math.sin(p*Math.PI)*.035));root.style.setProperty('--story-rise',`${Math.sin(p*Math.PI*2)*-8}px`);root.style.setProperty('--story-orbit',`${p*85-20}deg`);root.style.setProperty('--chapter-warm',String(Math.sin(p*Math.PI)*.6))}
   if(sequence){sequence.dataset.progress=String(p);sequence.dispatchEvent(new CustomEvent('chair-progress',{detail:p}))}
  };
  const clearQueue=()=>{queued=0;settling=false;clearTimeout(settleTimer);root.dataset.queued='0'};
  const cancel=()=>{cancelAnimationFrame(raf);busy=false;clearQueue();root.dataset.playing='false';root.setAttribute('aria-busy','false')};
  const leave=(direction:number)=>{cancel();release=direction;const g=geometry();window.scrollTo({top:direction>0?g.top+g.distance+80:g.top-80,behavior:'instant'})};
  const afterStep=()=>{
   busy=false;root.dataset.playing='false';root.setAttribute('aria-busy','false');settling=true;
   settleTimer=setTimeout(()=>{settling=false;const direction=queued;queued=0;root.dataset.queued='0';if(dead||!direction)return;const next=chapter+direction;if(next<0||next>=count)leave(direction);else play(next)},motionSettings.settleDurationMs);
  };
  const play=(i:number)=>{
   cancel();cancelAnimationFrame(scrollRaf);scrollRaf=0;release=0;const from=progress,to=stops[i];announce(i);const g=geometry();pinY=g.top+g.distance*i/(count-1);window.scrollTo({top:pinY,behavior:'instant'});
   if(Math.abs(to-from)<.0001){paint(to);return}
   started=performance.now();const duration=reducedMotion?1:id==='materials'?motionSettings.materialDurationMs:motionSettings.chapterDurationMs;
   busy=true;root.dataset.playing='true';root.setAttribute('aria-busy','true');
   const tick=(now:number)=>{if(dead)return;const t=clamp((now-started)/duration);paint(from+(to-from)*ease(t));if(t<1)raf=requestAnimationFrame(tick);else{paint(to);afterStep()}};raf=requestAnimationFrame(tick);
  };
  const handle=(direction:number,event:Event,amount=0)=>{
   if(event.defaultPrevented||document.querySelector('[role="dialog"],.cinematic-loader:not(.exit)'))return;
   const {r}=geometry(),now=performance.now();
   if(release===direction&&(direction>0?r.top<0:r.bottom>innerHeight))return;
   const inside=r.top<=3&&r.bottom>=innerHeight-3;
   // Capture the projected landing point, even for a wheel delta larger than
   // the viewport. A fast wheel must never leap over the first chapter.
   const reach=Math.max(90,amount);
   const approaching=direction>0?r.top>3&&r.top<=reach:r.bottom<innerHeight-3&&innerHeight-r.bottom<=reach;
   if(!inside&&!approaching)return;
   if(approaching){
    const gap=direction>0?r.top:innerHeight-r.bottom;
    const nearer=Array.from(document.querySelectorAll<HTMLElement>('[data-chapter-driven="true"]')).some(other=>{if(other===root)return false;const rect=other.getBoundingClientRect();const otherGap=direction>0?rect.top:innerHeight-rect.bottom;return otherGap>=-3&&otherGap<gap});
    if(nearer)return;
   }
   if(busy||settling){event.preventDefault();if(settling||event.type!=='wheel'||now-started>=motionSettings.queueIntentMs){queued=direction;root.dataset.queued=String(direction)}return}
   const next=approaching?(direction>0?0:count-1):chapter+direction;
   if(next<0||next>=count){release=direction;return}
   event.preventDefault();play(next);
  };
  const wheel=(e:WheelEvent)=>{
   if(e.defaultPrevented||e.ctrlKey||e.deltaY===0||scrollbarDragging||document.querySelector('[role="dialog"],.cinematic-loader:not(.exit)'))return;
   const direction=e.deltaY>0?1:-1,amount=Math.abs(e.deltaY)*(e.deltaMode===1?24:e.deltaMode===2?innerHeight:1),now=performance.now();
   const {r}=geometry(),inScene=r.top<=3&&r.bottom>=innerHeight-3;
   if(Math.abs(e.deltaX)>Math.abs(e.deltaY)){if((busy||settling)&&inScene)e.preventDefault();return}
   // Even sub-pixel trackpad tails must stay owned during a step. Letting them
   // scroll the document cancels the tween and can snap the scene backwards.
   if((busy||settling)&&inScene&&!document.querySelector('[role="dialog"],.cinematic-loader:not(.exit)'))e.preventDefault();
   if(now-lastWheel>motionSettings.wheelGestureGapMs||direction!==wheelDirection)wheelDistance=0;
   lastWheel=now;wheelDirection=direction;wheelDistance+=amount;
   if(wheelDistance<motionSettings.wheelIntentPx){if(inScene&&release!==direction)e.preventDefault();return}
   wheelDistance=0;
   // handle deliberately receives an unconsumed event; preventDefault above
   // only protects fractional input and does not mean another controller owns it.
   if(e.defaultPrevented){
    if(busy||settling){if(settling||now-started>=motionSettings.queueIntentMs){queued=direction;root.dataset.queued=String(direction)}return}
    return;
   }
   handle(direction,e,amount);
  };
  const scroll=()=>{if((busy||settling)&&!scrollbarDragging){if(Math.abs(scrollY-pinY)>=3)window.scrollTo({top:pinY,behavior:'instant'});return}if(busy||settling||queued)cancel();if(scrollRaf)return;scrollRaf=requestAnimationFrame(()=>{scrollRaf=0;if(busy||settling)return;const {r,distance}=geometry();if(r.top>innerHeight||r.bottom<0)return;const p=clamp(-r.top/distance);const i=Math.min(count-1,Math.round(p*(count-1)));announce(i);const segment=Math.min(count-2,Math.floor(p*(count-1))),t=p*(count-1)-segment;paint(stops[segment]+(stops[segment+1]-stops[segment])*t)})};
  const jump=(e:Event)=>{const i=(e as CustomEvent<number>).detail;if(i>=0&&i<count)play(i)};
  const key=(e:KeyboardEvent)=>{if(e.key==='Escape'){cancel();release=1;return}if((e.target as HTMLElement).closest('input,textarea,select,button,a,[contenteditable]'))return;if(['ArrowDown','PageDown',' '].includes(e.key))handle(e.shiftKey?-1:1,e);if(['ArrowUp','PageUp'].includes(e.key))handle(-1,e)};
  const pointer=(e:MouseEvent)=>{if(e.clientX>=document.documentElement.clientWidth){scrollbarDragging=true;cancel()}};
  const endPointer=()=>{scrollbarDragging=false};
  const startTouch=(e:TouchEvent)=>{touchY=e.touches[0]?.clientY??0;touchUsed=false};
  const moveTouch=(e:TouchEvent)=>{const d=touchY-(e.touches[0]?.clientY??touchY);if(touchUsed){const {r}=geometry();if(r.top<=3&&r.bottom>=innerHeight-3)e.preventDefault();return}if(Math.abs(d)<24){const {r}=geometry();if(r.top<=3&&r.bottom>=innerHeight-3)e.preventDefault();return}handle(d>0?1:-1,e,Math.abs(d));touchUsed=e.defaultPrevented};
  const dialog=(e:Event)=>{if((e as CustomEvent<boolean>).detail)cancel()};
  const resize=()=>{cancel();scroll()};
  paint(0);announce(0);scroll();window.addEventListener('wheel',wheel,{passive:false,capture:true});window.addEventListener('scroll',scroll,{passive:true});window.addEventListener('keydown',key);window.addEventListener('mousedown',pointer,true);window.addEventListener('mouseup',endPointer,true);window.addEventListener('blur',endPointer);window.addEventListener('touchstart',startTouch,{passive:true});window.addEventListener('touchmove',moveTouch,{passive:false});window.addEventListener('studio-dialog',dialog);window.addEventListener('resize',resize);root.addEventListener('experience-chapter-request',jump);
  return()=>{dead=true;cancel();cancelAnimationFrame(scrollRaf);delete root.dataset.chapterDriven;window.removeEventListener('wheel',wheel,true);window.removeEventListener('scroll',scroll);window.removeEventListener('keydown',key);window.removeEventListener('mousedown',pointer,true);window.removeEventListener('mouseup',endPointer,true);window.removeEventListener('blur',endPointer);window.removeEventListener('touchstart',startTouch);window.removeEventListener('touchmove',moveTouch);window.removeEventListener('studio-dialog',dialog);window.removeEventListener('resize',resize);root.removeEventListener('experience-chapter-request',jump)};
 },[id]);return null;
}
