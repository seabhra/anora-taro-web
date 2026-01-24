const CACHE_NAME = 'anora-taro-v5'; // Versão forçada para limpeza

// Lista de arquivos para cachear
// IMPORTANTE: Verifique se esses arquivos existem realmente nas pastas do seu projeto
const urlsToCache = [
  '/',
  '/index.html',
  '/favicon.ico',
  '/manifest.json',
  '/cards_images/back.jpg', 
  '/cards_images/marca_anora.png', 
  '/cards_images/zap.png',
  '/icons/icon-192.png',
  '/script.js',
];

// Instalação do Service Worker
self.addEventListener('install', (event) => {
  console.log('Service Worker: Instalando...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Cache aberto');

        // Mapeia cada URL e tenta adicionar individualmente.
        // Se um arquivo falhar (404), ele não trava a instalação dos outros.
        
        return Promise.all(
          urlsToCache.map(url => {
            return cache.add(url).catch(err => {
              console.error('Erro ao cachear arquivo (verifique o caminho):', url, err);
            });
          })
        );
      })
  );
  self.skipWaiting(); // Força ativação imediata
});

// Ativação e limpeza de caches antigos
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
  clients.claim(); // Assume o controle imediatamente
});

// Interceptação de requisições
self.addEventListener('fetch', (event) => {
  // 1. Verifica se é uma chamada de API
  // Se for API, buscamos na rede e NÃO cachearmos (para garantir respostas frescas do tarô)
  if (event.request.url.includes('/api/')) {
    event.respondWith(
      fetch(event.request)
        .catch(() => {
          // Opcional: Retornar algo se estiver totalmente offline e tentar usar a API
          return new Response(JSON.stringify({ error: 'Sem conexão para a API' }), {
            status: 503,
            headers: { 'Content-Type': 'application/json' }
          });
        })
    );
    return;
  }

  // 2. Para arquivos estáticos (imagens, html, css): Cache First
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Se achou no cache, retorna
        if (response) {
          return response;
        }

        // Se não achou, busca na rede
        return fetch(event.request).then((networkResponse) => {
          // Se a rede funcionou, salva no cache para a próxima vez
          // Clonamos a resposta porque ela só pode ser lida uma vez
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseClone);
            });
          }
          return networkResponse;
        });
      })
      .catch(() => {
        // Se falhar a rede e o cache (ex: navegação offline)
        if (event.request.destination === 'document') {
          return caches.match('/index.html');
        }
        return new Response('Offline: Recurso não disponível');
      })
  );

});
