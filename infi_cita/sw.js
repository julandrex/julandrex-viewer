// Service hors ligne de remplacement (28/10/2026) : l'ancienne application de ce chemin est retirée.
// À la mise à jour, il efface UNIQUEMENT la copie locale de l'ancienne application de ce chemin, se désinstalle,
// puis recharge les pages ouvertes (qui affichent alors la page « lien remplacé »). Il ne touche pas aux copies du viewer principal.
const ANCIENNES = ['sec-2', 'julandrex-infi-cita-urg-v1'];
self.addEventListener('install', function(){ self.skipWaiting(); });
self.addEventListener('activate', function(e){
  e.waitUntil((async function(){
    try{ const ks = await caches.keys(); await Promise.all(ks.filter(function(k){ return ANCIENNES.indexOf(k) >= 0; }).map(function(k){ return caches.delete(k); })); }catch(x){}
    try{ await self.registration.unregister(); }catch(x){}
    try{ const cs = await self.clients.matchAll({ type: 'window' }); cs.forEach(function(c){ c.navigate(c.url); }); }catch(x){}
  })());
});
