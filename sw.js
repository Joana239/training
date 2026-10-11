const CACHE='trainingsplan-v16';
const FILES=['./','./index.html','./manifest.json','./icon-192.png','./icon-512.png','./apple-touch-icon.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  const isPage=e.request.mode==='navigate'||e.request.url.endsWith('/')||e.request.url.endsWith('.html');
  e.respondWith(caches.open(CACHE).then(async c=>{
    if(isPage){
      try{const r=await fetch(e.request,{cache:'no-store'});if(r&&r.ok)c.put(e.request,r.clone());return r}
      catch(err){return (await c.match(e.request,{ignoreSearch:true}))||(await c.match('./index.html'))}
    }
    const hit=await c.match(e.request,{ignoreSearch:true});
    if(hit)return hit;
    try{const r=await fetch(e.request);if(r&&r.ok)c.put(e.request,r.clone());return r}catch(err){return hit}
  }));
});
