// Con señal: trae la última versión (revalida por ETag, no re-baja si no cambió).
// Sin señal o señal débil (>4 s): usa la copia guardada, satélite incluido.
const CACHE='lp-potreros-2825e1f8fa';
const FILES=['./','./manifest.webmanifest','./icon-180.png','./icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET')return;
  const nav=r.mode==='navigate';const key=nav?'./':r;
  const net=fetch(r,{cache:'no-cache'}).then(res=>{if(res.ok){const cp=res.clone();caches.open(CACHE).then(c=>c.put(key,cp));}return res;});
  const timeout=new Promise((_,rej)=>setTimeout(rej,4000));
  e.respondWith(Promise.race([net,timeout]).catch(()=>caches.match(key,{ignoreSearch:true}).then(c=>c||net)));});
