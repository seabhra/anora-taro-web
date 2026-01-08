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

  // ---------------------------------------------------------------------------
  // EXCEÇÃO ROTA EXTERNA: Se a requisição for para a API do projeto Aurora Runas,
  // NÃO intercepte. Deixe o navegador buscar direto na rede para evitar erros de CORS.
  // ---------------------------------------------------------------------------
  if (event.request.url.includes('express-js-on-vercel-eta-lyart.vercel.app')) {
    return; // Não executa o respondWith, sai da função
  }

  // EXCEÇÃO ROTA INTERNA: Se for uma chamada para a API local ou Groq
  if (url.pathname.includes('/api/') || url.hostname.includes('groq.com')) {
    return; 
  }

  event.respondWith(
    caches.match(event.request).then(response => {
      // Se estiver no cache, retorna. Se não, busca na rede.
      return response || fetch(event.request).catch(error => {
        // Log de erro silencioso para não poluir o console do app
        console.log('🌐 Requisição de rede falhou e arquivo não está no cache.');
      });
    })
  );
});
