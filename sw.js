const CACHE_NAME = 'litereader-v1';

// 这里列出了你 index.html 中引用的所有外部资源
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  // 核心库
  'https://cdn.tailwindcss.com',
  'https://cdn.staticfile.net/react/18.2.0/umd/react.production.min.js',
  'https://cdn.staticfile.net/react-dom/18.2.0/umd/react-dom.production.min.js',
  'https://cdn.staticfile.net/babel-standalone/7.23.5/babel.min.js',
  // PDF & Word 解析
  'https://cdn.staticfile.net/pdf.js/3.11.174/pdf.min.js',
  'https://cdn.staticfile.net/pdf.js/3.11.174/pdf.worker.min.js', // 重要：PDF worker
  'https://cdn.staticfile.net/mammoth/1.6.0/mammoth.browser.min.js',
  // 图标库
  'https://unpkg.com/lucide@latest',
  // 字体 (Google Fonts)
  'https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@300;400;500;700&family=Noto+Serif+SC:wght@300;400;700&display=swap'
];

// 安装事件：下载并缓存所有资源
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Service Worker: Caching files');
      // 使用 addAll 可能会因为某个 CDN 失败而导致全部失败，
      // 这里使用容错处理，确保能缓存多少是多少
      return Promise.all(
        ASSETS_TO_CACHE.map(url => {
            return cache.add(url).catch(err => console.error('缓存失败:', url, err));
        })
      );
    })
  );
  self.skipWaiting();
});

// 激活事件：清理旧缓存
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// 拦截网络请求：优先使用缓存，没有再走网络
self.addEventListener('fetch', (event) => {
  // 忽略非 GET 请求或 chrome-extension 协议
  if (event.request.method !== 'GET' || event.request.url.startsWith('chrome-extension')) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).then((response) => {
        // 如果是 CDN 资源或本站资源，动态添加到缓存中
        if (!response || response.status !== 200 || response.type !== 'basic' && response.type !== 'cors') {
          return response;
        }
        
        // 复制响应流放入缓存
        const responseToCache = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });

        return response;
      });
    })
  );
});