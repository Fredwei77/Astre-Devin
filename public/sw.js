const CACHE_NAME = 'destiny-ai-v2';
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
    '/stripe-client-enhanced.js',
    '/subscription-manager.js',
    '/api-config.js'
];

// 安装时预缓存
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
});

// 激活时清理旧缓存
self.addEventListener('activate', (event) => {
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

// 拦截请求：优先从网络获取并更新缓存，失败时回退到缓存 (Network First for logic, Cache First for assets)
self.addEventListener('fetch', (event) => {
    // 对于 CDN 资源或静态资源，使用 Cache First 策略
    if (event.request.url.includes('cdnjs.cloudflare.com') ||
        event.request.url.includes('cdn.jsdelivr.net') ||
        event.request.url.match(/\.(png|jpg|jpeg|gif|svg|css|js)$/)) {

        event.respondWith(
            caches.match(event.request).then((cachedResponse) => {
                if (cachedResponse) return cachedResponse;

                return fetch(event.request).then((networkResponse) => {
                    return caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, networkResponse.clone());
                        return networkResponse;
                    });
                }).catch(() => {
                    // 如果网络和缓存都失败，显示占位（可选）
                });
            })
        );
    } else {
        // 对于 HTML 页面，使用 Network First
        event.respondWith(
            fetch(event.request).catch(() => {
                return caches.match(event.request);
            })
        );
    }
});
