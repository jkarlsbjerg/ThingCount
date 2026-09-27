// Offline support: network first (so new versions show up right away when online),
// falling back to the cached copy when offline.
const CACHE = 'thingcount-v2';

const PRECACHE = [
    './',
    'index.html',
    'manifest.json',
    'icons/icon-180.png',
    'icons/icon-192.png',
    'icons/icon-512.png',
];

// Libraries loaded by index.html from CDNs (cached so the app starts offline)
const PRECACHE_CDN = [
    'https://cdn.tailwindcss.com',
    'https://unpkg.com/react@18/umd/react.production.min.js',
    'https://unpkg.com/react-dom@18/umd/react-dom.production.min.js',
    'https://unpkg.com/@babel/standalone@7.23.6/babel.min.js',
];

self.addEventListener('install', event => {
    event.waitUntil((async () => {
        const cache = await caches.open(CACHE);
        await cache.addAll(PRECACHE);
        // cache.add() rejects cross-origin opaque responses, so fetch + put instead
        await Promise.all(PRECACHE_CDN.map(async url => {
            try {
                const request = new Request(url, { mode: 'no-cors' });
                await cache.put(request, await fetch(request));
            } catch (err) {}
        }));
        await self.skipWaiting();
    })());
});

self.addEventListener('activate', event => {
    event.waitUntil((async () => {
        const keys = await caches.keys();
        await Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)));
        await self.clients.claim();
    })());
});

self.addEventListener('fetch', event => {
    if (event.request.method !== 'GET') return;
    event.respondWith((async () => {
        const cache = await caches.open(CACHE);
        try {
            const response = await fetch(event.request);
            if (response.ok || response.type === 'opaque') {
                cache.put(event.request, response.clone());
            }
            return response;
        } catch (err) {
            const cached = await cache.match(event.request, { ignoreSearch: true });
            if (cached) return cached;
            throw err;
        }
    })());
});
