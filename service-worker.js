const CACHE_NAME = 'anora-taro-v4'; // Mudei para v4 para forçar limpeza imediata

// AQUI ESTAVA O PROBLEMA: Liste SOMENTE arquivos que realmente existem na pasta
// Se não tiver certeza, comente a lista e deixe vazio temporariamente para testar
const urlsToCache = [
  // '/' // Removi pois não há index.html
  // '/index.html', // Removi pois provavelmente é Anora_prompt.html
  // '/manifest.json', // Comente se estiver dando erro
  '/cards_images/back.jpg', // Verifique se este arquivo existe em localhost
  '/cards_images/marca_anora.png', 
  '/cards_images/zap.png'
];

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('📦 Tentando cachear...');
      
      // TRATAMENTO DE ERRO: Isso previne a falha se um arquivo 404
      return Promise.allSettled(urlsToCache.map(url => {
          return cache.add(url).catch(err => {
              console.warn(`⚠️ Falha ao cachear ${url}:`, err);
          });
      })).then(() => console.log('✅ Cache concluído (com ou sem falhas)'));
    })
  );
});

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

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // 1. BLOQUEIO DE API:
  // Se for para /api/ (seja localhost ou Vercel), não intervir
  if (url.pathname.startsWith('/api/')) {
    return; // Sai da função, deixa o browser fazer o fetch direto
  }

  // 2. CACHE DE ARQUIVOS ESTÁTICOS:
  event.respondWith(
    caches.match(event.request).then(response => {
      // Cache First Strategy: Tenta cache, se não tiver, busca rede
      if (response) {
        return response; 
      }
      return fetch(event.request).catch(() => {
          // Opcional: Retornar uma página offline customizada se falhar a rede
          return new Response('Sem conexão');
      });
    })
  );
});


