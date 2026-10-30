import {warmSequenceAssets} from './sequenceAssets';
import {atlasUrl,warmViewerAssets} from './viewerAssets';
let registration:Promise<ServiceWorker|null>|undefined;
const critical=['logo.svg','chair.webp','material-textures/sand-small.webp','material-textures/rose-small.webp','material-textures/leather-small.webp','material-textures/charcoal-small.webp','material-textures/greige-small.webp','material-textures/satin-metal-small.webp','architecture.webp','sneaker.webp','shutter.webp','work-0.webp','work-1.webp','work-2.webp','work-3.webp','work-4.webp',...Array.from({length:4},(_,i)=>`chair-finishes/${i+1}.webp`)];
export function primeAssets(){
 if(!registration)registration=(async()=>{if(!('serviceWorker' in navigator)||!window.isSecureContext)return null;try{await navigator.serviceWorker.register('/asset-cache-worker.js',{updateViaCache:'none'});const reg=await navigator.serviceWorker.ready;return reg.active}catch{return null}})();
 return registration;
}
function warm(worker:ServiceWorker,urls:string[]){return new Promise<void>(resolve=>{const channel=new MessageChannel();const timer=setTimeout(()=>{channel.port1.close();resolve()},8000);channel.port1.onmessage=()=>{clearTimeout(timer);channel.port1.close();resolve()};worker.postMessage({type:'WARM_ASSETS',urls},[channel.port2])})}
export async function warmIntro(onProgress:(n:number)=>void){
 const mobile=matchMedia('(max-width:767px)').matches,prefix=mobile?'mobile/':'';
 const urls=[...critical.map(p=>'/assets/'+p),`/assets/chair-cinematic/${prefix}0000.webp`,`/assets/bicycle-colors/${prefix}0000.webp`,atlasUrl(mobile,0,0),atlasUrl(mobile,0,1),atlasUrl(mobile,0,7)];
 const worker=await Promise.race([primeAssets(),new Promise<null>(resolve=>setTimeout(()=>resolve(null),2500))]);
 if(worker){await warm(worker,[...urls.slice(0,10),atlasUrl(mobile,0,0),atlasUrl(mobile,0,1),atlasUrl(mobile,0,7)]);onProgress(1);void warmViewerAssets(mobile);void warmSequenceAssets(mobile);return}
 void warmViewerAssets(mobile);void warmSequenceAssets(mobile);let done=0;await Promise.all(urls.map(src=>new Promise<void>(resolve=>{const image=new Image();image.onload=image.onerror=()=>{onProgress(++done/urls.length);resolve()};image.src=src})));
}
