/* Cache product images and rendered frames only; HTML/JS/API responses stay fresh. */
importScripts('/asset-cache-manifest.js');
const PREFIX='configlab-assets-',NAME=PREFIX+self.ASSET_CACHE_VERSION;
const allowed=new Set(self.ASSET_CACHE_URLS),pending=new Map();
self.addEventListener('install',event=>event.waitUntil(self.skipWaiting()));
self.addEventListener('activate',event=>event.waitUntil((async()=>{for(const key of await caches.keys())if(key.startsWith(PREFIX)&&key!==NAME)await caches.delete(key);await self.clients.claim()})()));
async function asset(path,keepAlive=()=>{}){
 if(pending.has(path))return (await pending.get(path)).clone();
 const job=(async()=>{const cache=await caches.open(NAME).catch(()=>null),hit=cache?await cache.match(path).catch(()=>undefined):undefined;if(hit)return hit;const response=await fetch(path,{cache:'no-cache'});if(cache&&response.ok&&response.type==='basic'){keepAlive(cache.put(path,response.clone()).catch(()=>{}))}return response})();
 pending.set(path,job);try{return (await job).clone()}finally{pending.delete(path)}
}
self.addEventListener('fetch',event=>{const url=new URL(event.request.url);if(event.request.method==='GET'&&url.origin===self.location.origin&&allowed.has(url.pathname)&&!event.request.headers.has('range'))event.respondWith(asset(url.pathname,promise=>event.waitUntil(promise)))});
self.addEventListener('message',event=>{if(event.data?.type!=='WARM_ASSETS')return;const urls=[...new Set(event.data.urls)].filter(path=>allowed.has(path));let next=0;const writes=[];const worker=async()=>{while(next<urls.length){try{await asset(urls[next++],promise=>writes.push(promise))}catch{}}};event.waitUntil(Promise.all([worker(),worker(),worker()]).then(()=>Promise.all(writes)).finally(()=>event.ports[0]?.postMessage({done:true})))});
