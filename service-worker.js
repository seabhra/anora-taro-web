const CACHE_NAME = 'anora-taro-v2'; // Versão atualizada

const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/cards_images/back.jpg',
  '/cards_images/marca_anora.png',
  '/cards_images/zap.png'
];

// Instalação e Cache de arquivos estáticos
self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('📦 Arquivos estáticos mapeados para cache');
      return cache.addAll(urlsToCache);
    })
  );
});

// Ativação e Limpeza de caches antigos
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            console.log('🧹 Limpando cache antigo:', cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// Estratégia de busca inteligente
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // EXCEÇÃO: Se for uma chamada para a API, NÃO use o cache e NÃO intercepte
  // Isso evita erros de CORS e garante que a IA receba dados novos
  if (url.pathname.includes('/api/') || url.hostname.includes('groq.com')) {
    return; // Deixa o navegador lidar com a rede normalmente
  }

  event.respondWith(
    caches.match(event.request).then(response => {
      // Se estiver no cache, retorna. Se não, busca na rede.
      return response || fetch(event.request).catch(() => {
        // Se falhar a rede e for uma página, você poderia retornar uma página offline aqui
        console.log('🌐 Falha de rede e arquivo não está no cache.');
      });
    })
  );
});
