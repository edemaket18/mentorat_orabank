/* eslint-disable array-callback-return */
/* eslint-disable no-restricted-globals */
 /* Service worker placed in public so it's served at root and not processed by CRA.
 *
 * Stratégie :
 * - Requêtes API (URL contenant "/api/") : jamais mises en cache, toujours réseau.
 *   C'est essentiel : les données de l'app (utilisateurs, mentorats...) changent
 *   sans arrêt et sont authentifiées, les servir depuis un cache serait faux et
 *   potentiellement dangereux (données d'un autre utilisateur restées en cache).
 * - Navigation (chargement de page) : réseau d'abord, secours sur le cache si
 *   hors-ligne, pour permettre au moins un affichage de la coquille de l'app.
 * - Fichiers statiques (JS/CSS/images/icônes) : cache d'abord avec mise à jour
 *   en arrière-plan (stale-while-revalidate), pour un chargement instantané et
 *   un fonctionnement hors-ligne réel une fois l'app visitée une première fois.
 */

const CACHE_NAME = 'mentorat-cache-v2';
const APP_SHELL = ['/', '/index.html', '/manifest.json'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) return caches.delete(cacheName);
        })
      )
    )
  );
  self.clients.claim();
});

const isApiRequest = (url) => url.pathname.includes('/api/');

const isStaticAsset = (url) =>
  url.origin === self.location.origin &&
  (url.pathname.startsWith('/static/') ||
    url.pathname.startsWith('/icons/') ||
    /\.(?:js|css|png|jpg|jpeg|svg|ico|woff2?)$/.test(url.pathname));

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return; // ne jamais intercepter POST/PUT/PATCH/DELETE

  const url = new URL(request.url);

  // Jamais de cache pour les appels API : toujours le réseau.
  if (isApiRequest(url)) {
    return;
  }

  // Fichiers statiques : cache d'abord, revalidation en arrière-plan.
  if (isStaticAsset(url)) {
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) =>
        cache.match(request).then((cached) => {
          const networkFetch = fetch(request)
            .then((response) => {
              if (response && response.status === 200) {
                cache.put(request, response.clone());
              }
              return response;
            })
            .catch(() => cached);
          return cached || networkFetch;
        })
      )
    );
    return;
  }

  // Navigation (pages HTML) : réseau d'abord, cache en secours si hors-ligne.
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          caches.open(CACHE_NAME).then((cache) => cache.put(request, response.clone()));
          return response;
        })
        .catch(() => caches.match(request).then((cached) => cached || caches.match('/index.html')))
    );
    return;
  }

  // Par défaut : réseau, avec secours cache si disponible.
  event.respondWith(
    fetch(request).catch(() => caches.match(request))
  );
});