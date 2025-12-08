/**
 * 风水商品购物UI - 多语言支持版
 * Feng Shui Shop UI - i18n Support
 */

(function() {
    'use strict';

    class ShopUI {
        constructor() {
            this.cart = [];
            this.selectedProduct = null;
            this.addresses = [];
            this.init();
        }

        async init() {
            await this.loadProducts();
            await this.loadCart();
            this.setupEventListeners();
            
            // 监听语言切换事件
            window.addEventListener('languageChanged', () => {
                this.loadProducts();
            });
        }

        /**
         * 获取当前语言
         */
        getCurrentLanguage() {
            return localStorage.getItem('preferredLanguage') || 'zh';
        }

        /**
         * 获取翻译文本
         */
        t(key, fallback = '') {
            const lang = this.getCurrentLanguage();
            const translations = window.TRANSLATIONS?.[lang] || {};
            return translations[key] || fallback;
        }

        /**
         * 加载商品
         */
        async loadProducts() {
            try {
                if (!window.ShopService || !window.supabaseClient) {
                    console.log('商店服务未初始化，使用默认商品');
                    this.renderDefaultProducts();
                    return;
                }

                const result = await ShopService.products.getAll();
                
                if (result.success && result.data && result.data.length > 0) {
                    this.renderProducts(result.data);
                } else {
                    console.log('数据库无商品，使用默认商品');
                    this.renderDefaultProducts();
                }
            } catch (error) {
                console.log('加载商品失败，使用默认商品:', error.message);
                this.renderDefaultProducts();
            }
        }

        /**
         * 渲染默认商品
         */
        renderDefaultProducts() {
            const defaultProducts = [
                { id: 'dragon', name: '龙雕像', name_en: 'Dragon Statue', description: '力量与保护象征', description_en: 'Power & protection symbol', price: 49.99, icon: '🐉', stock: 50 },
                { id: 'crystal', name: '水晶球', name_en: 'Crystal Sphere', description: '清晰与能量放大器', description_en: 'Clarity & energy amplifier', price: 39.99, icon: '💎', stock: 30 },
                { id: 'bracelet', name: '祈福手环', name_en: 'Prayer Bracelet', description: '祝福与灵性保护', description_en: 'Blessing & spiritual protection', price: 29.99, icon: '📿', stock: 100 },
                { id: 'compass', name: '罗盘', name_en: 'Feng Shui Compass', description: '专业罗盘工具', description_en: 'Professional Luopan tool', price: 89.99, icon: '🧭', stock: 20 },
                { id: 'mirror', name: '八卦镜', name_en: 'Bagua Mirror', description: '化解负能量', description_en: 'Deflect negative energy', price: 34.99, icon: '🪞', stock: 40 },
                { id: 'coins', name: '五帝钱币', name_en: 'Five Emperor Coins', description: '财富与繁荣符咒', description_en: 'Wealth & prosperity charm', price: 24.99, icon: '🪙', stock: 60 }
            ];
            this.renderProducts(defaultProducts);
        }

        /**
         * 渲染商品列表 - 支持多语言
         */
        renderProducts(products) {
            const container = document.getElementById('productsGrid');
            if (!container) return;

            const isEnglish = this.getCurrentLanguage() === 'en';

            container.innerHTML = products.map(product => {
                // 根据语言选择名称和描述
                const name = isEnglish ? (product.name_en || product.name) : product.name;
                const description = isEnglish ? (product.description_en || product.description) : product.description;
                const stockText = isEnglish ? 'Stock' : '库存';
                const addToCartText = isEnglish ? 'Add to Cart' : '加入购物车';
                const buyNowText = isEnglish ? 'Buy Now' : '立即购买';
                const outOfStockText = isEnglish ? 'Out of Stock' : '暂时缺货';
                
                return `
                <div class="bg-white/5 rounded-lg p-4 text-center hover:bg-white/10 transition-all product-card" 
                     data-product-id="${product.id}">
                    ${product.image_url ? `
                        <div class="w-full h-32 mb-3 flex items-center justify-center">
                            <img src="${product.image_url}" alt="${name}" 
                                 class="max-w-full max-h-full object-contain rounded-lg">
                        </div>
                    ` : `
                        <div class="text-4xl mb-3">${product.icon || '🎁'}</div>
                    `}
                    <h4 class="font-semibold mb-1">${name}</h4>
                    <p class="text-xs text-moon-silver mb-3">${description}</p>
                    ${product.stock > 0 ? `
                        <div class="text-mystic-gold font-semibold text-lg mb-2">
                            ${product.original_price ? `
                                <span class="line-through text-sm text-moon-silver mr-2">$${product.original_price}</span>
                            ` : ''}
                            $${product.price}
                        </div>
                        <div class="text-xs text-moon-silver mb-3">${stockText}: ${product.stock}</div>
                        <div class="flex gap-2">
                            <button onclick="shopUI.addToCart('${product.id}')" 
                                    class="flex-1 bg-mystic-gold/20 text-mystic-gold px-3 py-2 rounded-lg text-sm font-medium hover:bg-mystic-gold/30 transition-colors">
                                <i class="fas fa-cart-plus mr-1"></i> ${addToCartText}
                            </button>
                            <button onclick="shopUI.buyNow('${product.id}')" 
                                    class="flex-1 bg-mystic-gold text-deep-navy px-3 py-2 rounded-lg text-sm font-medium hover:bg-yellow-400 transition-colors">
                                ${buyNowText}
                            </button>
                        </div>
                    ` : `
                        <div class="text-red-400 font-semibold">${outOfStockText}</div>
                    `}
                </div>
            `;
            }).join('');
        }

        /**
         * 加载购物车
         */
        async loadCart() {
            try {
                if (!window.ShopService || !window.supabaseClient) {
                    this.updateCartCount(0);
                    return;
                }

                const user = await window.EnhancedAuthService?.getCurrentUser();
                if (!user) {
                    this.updateCartCount(0);
                    return;
                }

                const result = await ShopService.cart.get();
                if (result.success) {
                    this.cart = result.data || [];
                    this.updateCartCount(this.cart.length);
                }
            } catch (error) {
                console.log('加载购物车失败:', error.message);
                this.updateCartCount(0);
            }
        }

        /**
         * 更新购物车数量显示
         */
        updateCartCount(count) {
            const cartCountEl = document.getElementById('cartCount');
            if (cartCountEl) {
                cartCountEl.textContent = count;
            }
        }

        /**
         * 添加到购物车
         */
        async addToCart(productId) {
            try {
                if (!window.ShopService || !window.supabaseClient) {
                    this.showToast(this.t('fengshui.shop.needConfig', '商店功能需要配置数据库'), 'info');
                    return;
                }

                const user = await window.EnhancedAuthService?.getCurrentUser();
                if (!user) {
                    this.showToast(this.t('fengshui.shop.needLogin', '请先登录'), 'info');
                    setTimeout(() => {
                        window.location.href = 'login.html';
                    }, 1500);
                    return;
                }

                const result = await ShopService.cart.add(productId, 1);
                if (result.success) {
                    this.showToast(this.t('fengshui.shop.addedToCart', '已添加到购物车'), 'success');
                    await this.loadCart();
                } else {
                    this.showToast(this.t('fengshui.shop.addFailed', '添加失败') + ': ' + result.error, 'error');
                }
            } catch (error) {
                console.log('添加到购物车失败:', error.message);
                this.showToast(this.t('fengshui.shop.unavailable', '功能暂时不可用'), 'info');
            }
        }

        /**
         * 立即购买
         */
        async buyNow(productId) {
            // 跳转到完整结账流程
            this.showToast(this.t('fengshui.shop.goingToCheckout', '正在进入结账...'), 'info');
            setTimeout(() => {
                window.location.href = 'test-checkout-complete.html';
            }, 1000);
        }

        /**
         * 显示提示消息
         */
        showToast(message, type = 'info') {
            const colors = {
                success: 'bg-green-500',
                error: 'bg-red-500',
                info: 'bg-blue-500'
            };

            const toast = document.createElement('div');
            toast.className = `fixed top-20 left-1/2 transform -translate-x-1/2 ${colors[type]} text-white px-6 py-3 rounded-lg shadow-lg z-50`;
            toast.textContent = message;

            document.body.appendChild(toast);

            setTimeout(() => {
                toast.remove();
            }, 3000);
        }

        /**
         * 设置事件监听
         */
        setupEventListeners() {
            const viewCartBtn = document.getElementById('viewCartBtn');
            if (viewCartBtn) {
                viewCartBtn.addEventListener('click', () => {
                    this.showToast(this.t('fengshui.shop.cartDev', '购物车功能开发中...'), 'info');
                });
            }
        }
    }

    // 页面加载时初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            window.shopUI = new ShopUI();
        });
    } else {
        window.shopUI = new ShopUI();
    }

})();
