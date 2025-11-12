// Service worker with safer caching strategies:
// - Navigation (HTML) uses network-first with offline fallback
// - Static assets use cache-first where available
// - Do NOT return offline.html for JS/CSS module requests
const CACHE_NAME = 'pocket-playlist-v2';
const APP_SHELL = [
    // Keep offline and core static assets only. Avoid caching index.html on install to
    // prevent serving stale HTML that references removed hashed assets.
    '/offline.html',
    '/logo.svg'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
    );
    // Activate new SW immediately
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    // Cleanup old caches
    event.waitUntil(
        caches.keys().then((keys) => Promise.all(
            keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
        ))
    );
    self.clients.claim();
});

// Helper: is this a navigation/html request
function isNavigationRequest(request) {
    return request.mode === 'navigate' || (request.headers.get('accept') || '').includes('text/html');
}

self.addEventListener('fetch', (event) => {
    if (event.request.method !== 'GET') return;

    // Network-first for navigation: try network, fall back to cache -> offline.html
    if (isNavigationRequest(event.request)) {
        event.respondWith(
            fetch(event.request).then((response) => {
                // Update cache for navigations so subsequent offline visits can show latest HTML
                const copy = response.clone();
                caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy)).catch(() => { });
                return response;
            }).catch(() => caches.match(event.request).then(cached => cached || caches.match('/offline.html')))
        );
        return;
    }

    // For other requests (assets), prefer cache, otherwise fetch from network.
    // Do NOT substitute offline.html for missing JS/CSS modules — return network error instead.
    event.respondWith(
        caches.match(event.request).then((cached) => {
            if (cached) return cached;
            return fetch(event.request).then((response) => {
                // Optionally cache same-origin runtime assets
                try {
                    const reqUrl = new URL(event.request.url);
                    if (reqUrl.origin === self.location.origin) {
                        const copy = response.clone();
                        caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy)).catch(() => { });
                    }
                } catch (e) {
                    // noop
                }
                return response;
            }).catch(() => {
                // If an asset fails, do not return HTML as a module — just let the fetch fail and surface the error.
                return new Response(null, { status: 504, statusText: 'Gateway Timeout' });
            });
        })
    );
});
