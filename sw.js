const CACHE_NAME = 'litereader-cache-v1';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './sw.js',
  './icons/icon-192x192.svg',
  './icons/icon-512x512.svg',
  'https://cdn.tailwindcss.com',
  'https://cdn.staticfile.net/react/18.2.0/umd/react.production.min.js',
  'https://cdn.staticfile.net/react-dom/18.2.0/umd/react-dom.production.min.js',
  'https://cdn.staticfile.net/babel-standalone/7.23.5/babel.min.js',
  'https://cdn.staticfile.net/pdf.js/3.11.174/pdf.min.js',
  'https://cdn.staticfile.net/pdf.js/3.11.174/pdf.worker.min.js',
  'https://cdn.staticfile.net/mammoth/1.6.0/mammoth.browser.min.js',
  'https://unpkg.com/lucide@latest'
];

// 安装 Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(ASSETS_TO_CACHE);
      })
      .then(() => self.skipWaiting())
  );
});

// 激活 Service Worker
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
    .then(() => self.clients.claim())
  );
});

// 处理资源请求
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // 如果缓存中有资源，直接返回
        if (response) {
          return response;
        }
        // 否则从网络获取
        return fetch(event.request)
          .then((response) => {
            // 检查响应是否有效
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            // 克隆响应
            const responseToCache = response.clone();
            // 将响应添加到缓存
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });
            return response;
          });
      })
  );
});
