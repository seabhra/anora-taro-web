// Anora Tarô versão WS 3

const CACHE_NAME = 'anora-taro-v2'; 

const urlsToCache = [
  '/',
  '/public/index.html',
  '/public/script.js',
  '/favicon.ico',
  '/manifest.json',
 '/public/cards_images/back.jpg',
  '/public/cards_images/marca_anora.png',
  '/public/cards_images/zap.png',
  '/public/icons/icon-192.png'
  
];

// Instalação do Service Worker
self.addEventListener('install', (event) => {
  console.log('Service Worker: Instalando...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Cache aberto');
        return cache.addAll(urlsToCache);
      })
      .catch((error) => {
        console.error('Service Worker: Falha ao cachear arquivos:', error);
      })
  );
  self.skipWaiting();
});

// Ativação do Service Worker
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Ativando...');
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME)
          .map((key) => {
            console.log('Service Worker: Removendo cache antigo:', key);
            return caches.delete(key);
          })
      );
    })
  );
  clients.claim();
});

// Interceptação de requisições
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Se já estiver no cache, retorna
        if (response) {
          return response;
        }
        
        // Se não, busca na rede
        return fetch(event.request)
          .then((networkResponse) => {
            
            // --- CORREÇÃO AQUI ---
            // Verifica se é um GET, SE O STATUS É 200 (Sucesso Completo)
            // Isso impede de cachear status 206 (Parcial) e evita o erro
            if (event.request.method === 'GET' && networkResponse.status === 200) {
              const responseClone = networkResponse.clone();
              caches.open(CACHE_NAME)
                .then((cache) => {
                  cache.put(event.request, responseClone);
                });
            }
            return networkResponse;
          })
          .catch(() => {
            // Se falhar e for a página principal, retorna o index (Offline support)
            if (event.request.destination === 'document') {
              return caches.match('/index.html');
            }
            return new Response('Offline: Recurso não disponível', { status: 404 });
          });
      })
  );
});
