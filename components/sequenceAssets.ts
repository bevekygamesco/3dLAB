/** Compressed renders are shared by intro warming and players. No quality conversion. */
const jobs=new Map<string,Promise<Blob>>();
export function sequenceBlob(url:string){
 let job=jobs.get(url);if(!job){job=fetch(url,{cache:'force-cache'}).then(r=>{if(!r.ok)throw Error(`Frame ${r.status}`);return r.blob()}).catch(e=>{jobs.delete(url);throw e});jobs.set(url,job)}return job;
}
export function sequenceUrl(kind:'chair'|'bicycle',mobile:boolean,i:number){return `/assets/${kind==='chair'?'chair-cinematic':'bicycle-colors'}/${mobile?'mobile/':''}${String(i).padStart(4,'0')}.webp`}

let warming:Promise<void>|undefined;
export function warmSequenceAssets(mobile:boolean){
 if(warming)return warming;
 warming=(async()=>{
  for(const kind of ['chair','bicycle'] as const){
   const count=kind==='chair'?144:120;
   for(let i=0;i<count;i++){
    if(document.hidden)break;
    await sequenceBlob(sequenceUrl(kind,mobile,i)).catch(()=>{});
    await new Promise<void>(resolve=>setTimeout(resolve,20));
   }
  }
 })();return warming;
}
