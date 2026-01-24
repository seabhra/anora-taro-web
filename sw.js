

const CACHE_NAME = 'anora-taro-v7'; // Versão atualizada

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
  '/app.js',
];

// Instalação do Service Worker
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Instalando...');
  
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Cache aberto:', CACHE_NAME);

      // Mapeia cada URL e tenta adicionar individualmente.
      // Se um arquivo falhar (404), ele não trava a instalação dos outros.
      return Promise.all(
        urlsToCache.map((url) => {
          return cache.add(url).catch((err) => {
            // --- PONTO DE DEPURAÇÃO ---
            console.error('[Service Worker] Erro ao cachear arquivo (verifique o caminho):', url, err);
            
            // Se o DevTools estiver aberto, a execução vai PAUSAR aqui.
            // Isso permite ver exatamente qual erro aconteceu.
            // debugger; 
            
            // Não relançamos o erro para não quebrar o Promise.all
          });
        })
      );
    })
  );
  
  self.skipWaiting(); // Força ativação imediata do novo SW
});

// Ativação e limpeza de caches antigos
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Ativando...');
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => {
          console.log('[Service Worker] Removendo cache antigo:', key);
          return caches.delete(key);
        })
      );
    })
  );
  self.clients.claim(); // Assume o controle imediatamente
});

// Interceptação de requisições
self.addEventListener('fetch', (event) => {
  // 1. Verifica se é uma chamada de API
  // Mudança: Verificamos se NÃO é um método GET ou se contém /api/
  // Requisições POST de API nunca devem ser tratadas pelo cache do SW
  if (event.request.url.includes('/api/') || event.request.method !== 'GET') {
    event.respondWith(
      fetch(event.request).catch((err) => {
        console.error('[Service Worker] Erro na rede da API:', err);
        return new Response(JSON.stringify({ error: 'Sem conexão para a API' }), {
          status: 503,
          headers: { 'Content-Type': 'application/json' },
        });
      })
    );
    return;
  }

  // 2. Para arquivos estáticos (imagens, html, css): Cache First com fallback na rede
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Se achou no cache, retorna
      if (response) {
        return response;
      }

      // Se não achou, busca na rede
      return fetch(event.request)
        .then((networkResponse) => {
          // Se a rede funcionou, salva no cache para a próxima vez
          // Verificamos status 200 e tipo 'basic' para evitar cachear recursos de terceiros com erro
          if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseClone);
            });
          }
          return networkResponse;
        })
        .catch(() => {
          // Se falhar a rede e o cache (ex: navegação offline)
          if (event.request.destination === 'document') {
            return caches.match('/index.html');
          }
          // Retorna uma resposta básica para imagens quebradas offline
          return new Response('Offline: Recurso não disponível');
        });
    })
  );
});

