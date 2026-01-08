const CACHE_NAME = 'anora-taro-v3'; // Versão atualizada para forçar o navegador a recarregar

const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/cards_images/back.jpg',
  '/cards_images/marca_anora.png',
  '/cards_images/zap.png'
];

// Instalação: Salva arquivos básicos no celular do usuário
self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('📦 Cache Anora Tarô atualizado');
      return cache.addAll(urlsToCache);
    })
  );
});

// Ativação: Remove caches de versões antigas
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            console.log('🧹 Removendo cache antigo:', cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// Interceptação de pedidos (Fetch)
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // 1. EXCEÇÃO PARA API INTERNA:
  // Se a requisição for para a sua própria API (/api/chat), 
  // o Service Worker NÃO deve intervir. Deixa ir direto pela internet.
  if (url.pathname.startsWith('/api/')) {
    return; // Sai da função e deixa o navegador tratar via rede
  }

  // 2. ESTRATÉGIA PARA OUTROS ARQUIVOS:
  // Tenta buscar no cache (offline), se não achar, busca na internet.
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
