// Nombre de la caché
const CACHE_NAME = 'hilo-magico-v1';
const OFFLINE_URL = '/offline.html';

// Archivos a almacenar en caché
const urlsToCache = [
  '/',
  '/styles/main.css',
  '/js/main.js',
  '/img/logo.png',
  '/img/og-image.jpg',
  OFFLINE_URL
];

// Instalación del Service Worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache abierta');
        return cache.addAll(urlsToCache);
      })
  );
  self.skipWaiting();
});

// Estrategia: Cache First, luego red
self.addEventListener('fetch', event => {
  // No manejar solicitudes de navegación si no es una navegación
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .catch(() => caches.match(OFFLINE_URL))
    );
    return;
  }

  // Para otros recursos, usar estrategia cache-first
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Devolver respuesta en caché si existe
        if (response) {
          return response;
        }
        
        // Si no está en caché, hacer la petición
        return fetch(event.request).then(response => {
          // Verificar respuesta válida
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          // Clonar la respuesta para almacenarla en caché
          const responseToCache = response.clone();
          caches.open(CACHE_NAME)
            .then(cache => {
              cache.put(event.request, responseToCache);
            });

          return response;
        });
      })
  );
});

// Limpieza de cachés antiguas
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});
