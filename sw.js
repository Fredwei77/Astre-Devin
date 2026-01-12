const CACHE_NAME = 'destiny-ai-v4';
const ASSETS_TO_CACHE = [
    '/',
    '/index.html',
    '/divination.html',
    '/fengshui.html',
    '/iching.html',
    '/profile.html',
    '/support.html',
    '/mystical-theme.css',
    '/user-menu.css',
    '/tooltip.css',
    '/translations.js',
    '/unified-i18n.js',
    '/config.js',
    '/main.js',
    '/ai-service.js',
    '/stripe-client-enhanced.js',
    '/subscription-manager.js',
    '/api-config.js'
];

// 安装时预缓存
self.addEventListener('install', (event) => {
    // 强制立即接管
    self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
});

// 激活时清理旧缓存
self.addEventListener('activate', (event) => {
    // 获取控制权
    event.waitUntil(clients.claim());
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// 拦截请求：优先从网络获取并更新缓存，失败时回退到缓存
self.addEventListener('fetch', (event) => {
    const url = event.request.url;
    const isHttp = url.startsWith('http://') || url.startsWith('https://');

    // 如果不是 HTTP 请求（如 chrome-extension），直接由浏览器处理，不进入 Service Worker 缓存逻辑
    if (!isHttp) return;

    // 对于 API 请求，始终 Network Only，不进缓存，避免干扰 AI 数据
    if (url.includes('/api/')) {
        return;
    }

    // 对于静态资源（图片、字体、第三方库），使用 Cache First 策略
    if (url.includes('cdnjs.cloudflare.com') ||
        url.includes('cdn.jsdelivr.net') ||
        url.match(/\.(png|jpg|jpeg|gif|svg|css)$/)) {

        event.respondWith(
            caches.match(event.request).then((cachedResponse) => {
                if (cachedResponse) return cachedResponse;

                return fetch(event.request).then((networkResponse) => {
                    return caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, networkResponse.clone());
                        return networkResponse;
                    });
                }).catch((err) => {
                    console.warn('[SW] Fetch failed for:', url, err);
                    return new Response('Network error', { status: 408, headers: { 'Content-Type': 'text/plain' } });
                });
            })
        );
    } else {
        // 对于 HTML 页面、JS 逻辑文件，使用 Network First
        // 确保逻辑更新能即时反映，同时在离线时有回退
        event.respondWith(
            fetch(event.request).then((networkResponse) => {
                // 如果是成功的响应，存入缓存
                if (networkResponse && networkResponse.status === 200) {
                    const responseClone = networkResponse.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, responseClone);
                    });
                }
                return networkResponse;
            }).catch((err) => {
                console.warn('[SW] Network First fetch failed:', url);
                return caches.match(event.request).then(response => {
                    return response || new Response('Offline', { status: 503 });
                });
            })
        );
    }
});
