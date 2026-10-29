/** Shared compressed assets survive closing the popup; decoded sheets stay bounded. */
const blobs=new Map<string,Promise<Blob>>();
export const atlasUrl=(mobile:boolean,finish:number,sheet:number)=>`/assets/chair-atlas/${mobile?'mobile':'desktop'}/${finish}/${sheet}.webp`;
export function getAtlasBlob(url:string){
 const hit=blobs.get(url);if(hit)return hit;
 const job=fetch(url,{cache:'force-cache'}).then(r=>{if(!r.ok)throw Error(`Atlas ${r.status}`);return r.blob()}).catch(error=>{blobs.delete(url);throw error});blobs.set(url,job);
 while(blobs.size>16)blobs.delete(blobs.keys().next().value!);return job;
}
let warming:Promise<void>|undefined;
export function warmViewerAssets(mobile:boolean){
 if(warming)return warming;
 const saveData=(navigator as Navigator&{connection?:{saveData?:boolean}}).connection?.saveData;
 const urls=[...Array.from({length:8},(_,i)=>atlasUrl(mobile,0,i)),...Array.from({length:4},(_,i)=>atlasUrl(mobile,i+1,0)),...Array.from({length:4},(_,i)=>Array.from({length:7},(_,j)=>atlasUrl(mobile,i+1,j+1))).flat()];
 let next=0;const worker=async()=>{while(next<(saveData?8:urls.length)){const url=urls[next++];await getAtlasBlob(url).catch(()=>{})}};
 warming=Promise.all([worker(),worker()]).then(()=>{});return warming;
}
