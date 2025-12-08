/**
 * 风水商品购物UI - 完整电商功能 (多语言支持)
 * Feng Shui Shop UI - Complete E-commerce (i18n Support)
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
                // 检查 ShopService 是否可用
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
         * 渲染商品列表
         */
        renderProducts(products) {
            const container = document.getElementById('productsGrid');
            if (!container) return;

            container.innerHTML = products.map(product => `
                <div class="bg-white/5 rounded-lg p-4 text-center hover:bg-white/10 transition-all product-card" 
                     data-product-id="${product.id}">
                    ${product.image_url ? `
                        <div class="w-full h-32 mb-3 flex items-center justify-center">
                            <img src="${product.image_url}" alt="${product.name_en || product.name}" 
                                 class="max-w-full max-h-full object-contain rounded-lg">
                        </div>
                    ` : `
                        <div class="text-4xl mb-3">${product.icon || '🎁'}</div>
                    `}
                    <h4 class="font-semibold mb-1">${product.name_en || product.name}</h4>
                    <p class="text-xs text-moon-silver mb-3">${product.description}</p>
                    ${product.stock > 0 ? `
                        <div class="text-mystic-gold font-semibold text-lg mb-2">
                            ${product.original_price ? `
                                <span class="line-through text-sm text-moon-silver mr-2">$${product.original_price}</span>
                            ` : ''}
                            $${product.price}
                        </div>
                        <div class="text-xs text-moon-silver mb-3">库存: ${product.stock}</div>
                        <div class="flex gap-2">
                            <button onclick="shopUI.addToCart('${product.id}')" 
                                    class="flex-1 bg-mystic-gold/20 text-mystic-gold px-3 py-2 rounded-lg text-sm font-medium hover:bg-mystic-gold/30 transition-colors">
                                <i class="fas fa-cart-plus mr-1"></i> 加入购物车
                            </button>
                            <button onclick="shopUI.buyNow('${product.id}')" 
                                    class="flex-1 bg-mystic-gold text-deep-navy px-3 py-2 rounded-lg text-sm font-medium hover:bg-yellow-400 transition-colors">
                                立即购买
                            </button>
                        </div>
                    ` : `
                        <div class="text-red-400 font-semibold">暂时缺货</div>
                    `}
                </div>
            `).join('');
        }

        /**
         * 加载购物车
         */
        async loadCart() {
            try {
                // 检查服务是否可用
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
         * 添加到购物车 - 支持多语言
         */
        async addToCart(productId) {
            try {
                // 检查服务是否可用
                if (!window.ShopService || !window.supabaseClient) {
                    const msg = this.getCurrentLanguage() === 'en' 
                        ? 'Shop features require database configuration' 
                        : '商店功能需要配置数据库，请查看设置指南';
                    this.showToast(msg, 'info');
                    return;
                }

                const user = await window.EnhancedAuthService?.getCurrentUser();
                if (!user) {
                    const msg = this.getCurrentLanguage() === 'en' ? 'Please login first' : '请先登录';
                    this.showToast(msg, 'info');
                    setTimeout(() => {
                        window.location.href = 'login.html';
                    }, 1500);
                    return;
                }

                const result = await ShopService.cart.add(productId, 1);
                if (result.success) {
                    const msg = this.getCurrentLanguage() === 'en' ? 'Added to cart' : '已添加到购物车';
                    this.showToast(msg, 'success');
                    await this.loadCart();
                } else {
                    const prefix = this.getCurrentLanguage() === 'en' ? 'Add failed: ' : '添加失败: ';
                    this.showToast(prefix + result.error, 'error');
                }
            } catch (error) {
                console.log('添加到购物车失败:', error.message);
                const msg = this.getCurrentLanguage() === 'en' ? 'Feature temporarily unavailable' : '功能暂时不可用';
                this.showToast(msg, 'info');
            }
        }

        /**
         * 立即购买 - 支持多语言
         */
        async buyNow(productId) {
            // 检查服务是否可用
            if (!window.ShopService || !window.supabaseClient) {
                const msg = this.getCurrentLanguage() === 'en' 
                    ? 'Shop features require database configuration' 
                    : '商店功能需要配置数据库，请查看设置指南';
                this.showToast(msg, 'info');
                return;
            }

            const user = await window.EnhancedAuthService?.getCurrentUser();
            if (!user) {
                const msg = this.getCurrentLanguage() === 'en' ? 'Please login first' : '请先登录';
                this.showToast(msg, 'info');
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 1500);
                return;
            }

            try {
                const result = await ShopService.products.getById(productId);
                if (!result.success) {
                    const msg = this.getCurrentLanguage() === 'en' ? 'Failed to get product info' : '获取商品信息失败';
                    this.showToast(msg, 'error');
                    return;
                }

                this.selectedProduct = result.data;
                this.showCheckoutModal([{ product: result.data, quantity: 1 }]);
            } catch (error) {
                console.log('立即购买失败:', error.message);
                const msg = this.getCurrentLanguage() === 'en' ? 'Feature temporarily unavailable' : '功能暂时不可用';
                this.showToast(msg, 'info');
            }
        }

        /**
         * 查看购物车 - 支持多语言
         */
        async viewCart() {
            // 检查服务是否可用
            if (!window.ShopService || !window.supabaseClient) {
                const msg = this.getCurrentLanguage() === 'en' 
                    ? 'Shop features require database configuration' 
                    : '商店功能需要配置数据库，请查看设置指南';
                this.showToast(msg, 'info');
                return;
            }

            const user = await window.EnhancedAuthService?.getCurrentUser();
            if (!user) {
                const msg = this.getCurrentLanguage() === 'en' ? 'Please login first' : '请先登录';
                this.showToast(msg, 'info');
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 1500);
                return;
            }

            await this.loadCart();
            this.showCartModal();
        }

        /**
         * 显示购物车模态框
         */
        showCartModal() {
            if (this.cart.length === 0) {
                this.showToast('购物车是空的', 'info');
                return;
            }

            const modal = document.createElement('div');
            modal.id = 'cartModal';
            modal.className = 'fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4';
            
            const cartItems = this.cart.map(item => {
                const product = item.products;
                const subtotal = (product.price * item.quantity).toFixed(2);
                return `
                    <div class="flex items-center gap-4 bg-white/5 rounded-lg p-4">
                        ${product.image_url ? `
                            <img src="${product.image_url}" alt="${product.name_en || product.name}" 
                                 class="w-16 h-16 object-cover rounded-lg">
                        ` : `
                            <div class="text-3xl">${product.icon || '🎁'}</div>
                        `}
                        <div class="flex-1">
                            <h4 class="font-semibold">${product.name_en || product.name}</h4>
                            <p class="text-sm text-moon-silver">$${product.price} × ${item.quantity}</p>
                        </div>
                        <div class="flex items-center gap-2">
                            <button onclick="shopUI.updateCartQuantity('${item.id}', ${item.quantity - 1})" 
                                    class="bg-white/10 text-moon-silver w-8 h-8 rounded hover:bg-white/20">-</button>
                            <span class="w-8 text-center">${item.quantity}</span>
                            <button onclick="shopUI.updateCartQuantity('${item.id}', ${item.quantity + 1})" 
                                    class="bg-white/10 text-moon-silver w-8 h-8 rounded hover:bg-white/20">+</button>
                        </div>
                        <div class="text-mystic-gold font-semibold">$${subtotal}</div>
                        <button onclick="shopUI.removeFromCart('${item.id}')" 
                                class="text-red-400 hover:text-red-300">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                `;
            }).join('');

            const total = this.cart.reduce((sum, item) => sum + (item.products.price * item.quantity), 0).toFixed(2);

            modal.innerHTML = `
                <div class="bg-gradient-to-br from-deep-navy to-mystic-purple rounded-xl p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto border-2 border-mystic-gold/30">
                    <div class="flex justify-between items-center mb-6">
                        <h2 class="text-2xl font-serif font-bold text-mystic-gold">购物车</h2>
                        <button onclick="shopUI.closeModal('cartModal')" class="text-moon-silver hover:text-mystic-gold text-2xl">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>

                    <div class="space-y-4 mb-6">
                        ${cartItems}
                    </div>

                    <div class="bg-mystic-gold/10 rounded-lg p-4 border border-mystic-gold/30 mb-6">
                        <div class="flex justify-between text-lg font-bold">
                            <span class="text-mystic-gold">总计:</span>
                            <span class="text-mystic-gold">$${total}</span>
                        </div>
                    </div>

                    <div class="flex gap-4">
                        <button onclick="shopUI.proceedToCheckout()" 
                                class="flex-1 bg-mystic-gold text-deep-navy px-6 py-3 rounded-lg font-semibold hover:bg-yellow-400 transition-colors">
                            去结算
                        </button>
                        <button onclick="shopUI.closeModal('cartModal')"
                                class="flex-1 bg-white/10 text-moon-silver px-6 py-3 rounded-lg font-semibold hover:bg-white/20 transition-colors">
                            继续购物
                        </button>
                    </div>
                </div>
            `;

            document.body.appendChild(modal);
            modal.addEventListener('click', (e) => {
                if (e.target === modal) this.closeModal('cartModal');
            });
        }

        /**
         * 更新购物车商品数量
         */
        async updateCartQuantity(cartItemId, newQuantity) {
            try {
                const result = await ShopService.cart.updateQuantity(cartItemId, newQuantity);
                if (result.success) {
                    await this.loadCart();
                    this.closeModal('cartModal');
                    this.showCartModal();
                }
            } catch (error) {
                console.error('更新数量失败:', error);
            }
        }

        /**
         * 从购物车删除
         */
        async removeFromCart(cartItemId) {
            if (!confirm('确定要删除这个商品吗？')) return;

            try {
                const result = await ShopService.cart.remove(cartItemId);
                if (result.success) {
                    await this.loadCart();
                    this.closeModal('cartModal');
                    if (this.cart.length > 0) {
                        this.showCartModal();
                    }
                }
            } catch (error) {
                console.error('删除失败:', error);
            }
        }

        /**
         * 进入结算流程
         */
        async proceedToCheckout() {
            this.closeModal('cartModal');
            const items = this.cart.map(item => ({
                product: item.products,
                quantity: item.quantity
            }));
            this.showCheckoutModal(items);
        }

        /**
         * 显示结算模态框
         */
        async showCheckoutModal(items) {
            await this.loadAddresses();

            const total = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
            const shippingFee = 10.00;
            const grandTotal = (total + shippingFee).toFixed(2);

            const modal = document.createElement('div');
            modal.id = 'checkoutModal';
            modal.className = 'fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4';
            
            const itemsHtml = items.map(item => `
                <div class="flex items-center gap-3 text-sm">
                    ${item.product.image_url ? `
                        <img src="${item.product.image_url}" alt="${item.product.name_en || item.product.name}" 
                             class="w-12 h-12 object-cover rounded">
                    ` : `
                        <span class="text-2xl">${item.product.icon || '🎁'}</span>
                    `}
                    <span class="flex-1">${item.product.name_en || item.product.name}</span>
                    <span class="text-moon-silver">×${item.quantity}</span>
                    <span class="text-mystic-gold">$${(item.product.price * item.quantity).toFixed(2)}</span>
                </div>
            `).join('');

            const addressOptions = this.addresses.map(addr => `
                <option value="${addr.id}">${addr.recipient_name} - ${addr.address}</option>
            `).join('');

            modal.innerHTML = `
                <div class="bg-gradient-to-br from-deep-navy to-mystic-purple rounded-xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto border-2 border-mystic-gold/30">
                    <div class="flex justify-between items-center mb-6">
                        <h2 class="text-2xl font-serif font-bold text-mystic-gold">确认订单</h2>
                        <button onclick="shopUI.closeModal('checkoutModal')" class="text-moon-silver hover:text-mystic-gold text-2xl">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>

                    <!-- 订单商品 -->
                    <div class="bg-white/10 rounded-lg p-4 mb-6">
                        <h3 class="font-semibold mb-3">订单商品</h3>
                        <div class="space-y-2">
                            ${itemsHtml}
                        </div>
                    </div>

                    <!-- 收货地址 -->
                    <form id="checkoutForm" class="space-y-4">
                        <div>
                            <div class="flex justify-between items-center mb-2">
                                <label class="block text-moon-silver">收货地址</label>
                                <button type="button" onclick="shopUI.showAddAddressForm()" 
                                        class="text-mystic-gold text-sm hover:underline">
                                    <i class="fas fa-plus mr-1"></i>新增地址
                                </button>
                            </div>
                            ${this.addresses.length > 0 ? `
                                <select name="addressId" required
                                    class="w-full bg-white/10 border border-moon-silver/30 rounded-lg px-4 py-2 text-warm-white">
                                    ${addressOptions}
                                </select>
                            ` : `
                                <div id="newAddressForm" class="space-y-3">
                                    <input type="text" name="recipientName" required placeholder="收货人姓名"
                                        class="w-full bg-white/10 border border-moon-silver/30 rounded-lg px-4 py-2 text-warm-white">
                                    <input type="tel" name="recipientPhone" required placeholder="联系电话"
                                        class="w-full bg-white/10 border border-moon-silver/30 rounded-lg px-4 py-2 text-warm-white">
                                    <textarea name="address" required rows="2" placeholder="详细地址"
                                        class="w-full bg-white/10 border border-moon-silver/30 rounded-lg px-4 py-2 text-warm-white"></textarea>
                                    <div class="grid grid-cols-3 gap-2">
                                        <input type="text" name="city" placeholder="城市"
                                            class="bg-white/10 border border-moon-silver/30 rounded-lg px-4 py-2 text-warm-white">
                                        <input type="text" name="province" placeholder="省份"
                                            class="bg-white/10 border border-moon-silver/30 rounded-lg px-4 py-2 text-warm-white">
                                        <input type="text" name="postalCode" placeholder="邮编"
                                            class="bg-white/10 border border-moon-silver/30 rounded-lg px-4 py-2 text-warm-white">
                                    </div>
                                </div>
                            `}
                        </div>

                        <div>
                            <label class="block text-moon-silver mb-2">备注（可选）</label>
                            <textarea name="notes" rows="2" placeholder="特殊要求或备注"
                                class="w-full bg-white/10 border border-moon-silver/30 rounded-lg px-4 py-2 text-warm-white"></textarea>
                        </div>

                        <!-- 订单摘要 -->
                        <div class="bg-mystic-gold/10 rounded-lg p-4 border border-mystic-gold/30">
                            <div class="flex justify-between mb-2">
                                <span class="text-moon-silver">商品总价:</span>
                                <span class="text-warm-white">$${total.toFixed(2)}</span>
                            </div>
                            <div class="flex justify-between mb-2">
                                <span class="text-moon-silver">运费:</span>
                                <span class="text-warm-white">$${shippingFee.toFixed(2)}</span>
                            </div>
                            <div class="flex justify-between text-lg font-bold border-t border-mystic-gold/30 pt-2 mt-2">
                                <span class="text-mystic-gold">总计:</span>
                                <span class="text-mystic-gold">$${grandTotal}</span>
                            </div>
                        </div>

                        <!-- 提交按钮 -->
                        <div class="flex gap-4">
                            <button type="submit" 
                                    class="flex-1 bg-mystic-gold text-deep-navy px-6 py-3 rounded-lg font-semibold hover:bg-yellow-400 transition-colors">
                                确认下单
                            </button>
                            <button type="button" onclick="shopUI.closeModal('checkoutModal')"
                                    class="flex-1 bg-white/10 text-moon-silver px-6 py-3 rounded-lg font-semibold hover:bg-white/20 transition-colors">
                                取消
                            </button>
                        </div>
                    </form>
                </div>
            `;

            document.body.appendChild(modal);

            // 绑定表单提交
            document.getElementById('checkoutForm').addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleCheckout(e.target, items, grandTotal);
            });

            modal.addEventListener('click', (e) => {
                if (e.target === modal) this.closeModal('checkoutModal');
            });
        }

        /**
         * 处理结算
         */
        async handleCheckout(form, items, totalAmount) {
            try {
                const formData = new FormData(form);
                
                let orderData = {
                    total_amount: totalAmount,
                    shipping_fee: 10.00,
                    notes: formData.get('notes'),
                    status: 'pending'
                };

                // 如果选择了已有地址
                if (formData.get('addressId')) {
                    const address = this.addresses.find(a => a.id === formData.get('addressId'));
                    if (address) {
                        orderData = {
                            ...orderData,
                            recipient_name: address.recipient_name,
                            recipient_phone: address.recipient_phone,
                            shipping_address: address.address,
                            shipping_city: address.city,
                            shipping_province: address.province,
                            shipping_postal_code: address.postal_code
                        };
                    }
                } else {
                    // 使用新地址
                    orderData = {
                        ...orderData,
                        recipient_name: formData.get('recipientName'),
                        recipient_phone: formData.get('recipientPhone'),
                        shipping_address: formData.get('address'),
                        shipping_city: formData.get('city'),
                        shipping_province: formData.get('province'),
                        shipping_postal_code: formData.get('postalCode')
                    };
                }

                // 验证必填字段
                if (!orderData.recipient_name || !orderData.recipient_phone || !orderData.shipping_address) {
                    throw new Error('请填写完整的收货信息');
                }

                // 关闭确认订单模态框
                this.closeModal('checkoutModal');

                // 显示 Stripe 支付页面
                this.showStripePayment(items, totalAmount, orderData);

            } catch (error) {
                console.error('结算失败:', error);
                alert('结算失败: ' + error.message);
            }
        }

        /**
         * 显示 Stripe 支付页面
         */
        showStripePayment(items, totalAmount, orderData) {
            const modal = document.createElement('div');
            modal.id = 'stripePaymentModal';
            modal.className = 'fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4';
            
            modal.innerHTML = `
                <div class="bg-gradient-to-br from-deep-navy to-mystic-purple rounded-xl p-8 max-w-md w-full border-2 border-mystic-gold/30">
                    <div class="flex justify-between items-center mb-6">
                        <h2 class="text-2xl font-serif font-bold text-mystic-gold">支付</h2>
                        <button onclick="shopUI.closeModal('stripePaymentModal')" class="text-moon-silver hover:text-mystic-gold text-2xl">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>

                    <!-- 订单摘要 -->
                    <div class="mb-6 p-4 bg-mystic-gold/10 rounded-lg border border-mystic-gold/30">
                        <div class="flex justify-between items-center">
                            <span class="text-lg font-semibold">总计:</span>
                            <span class="text-2xl font-bold text-mystic-gold">$${totalAmount.toFixed(2)}</span>
                        </div>
                    </div>

                    <form id="stripePaymentForm" class="space-y-4">
                        <!-- Stripe 卡片元素 -->
                        <div>
                            <label class="block text-moon-silver mb-2">支付信息</label>
                            <div id="card-element-checkout" style="background: rgba(255, 255, 255, 0.1); border: 1px solid rgba(255, 255, 255, 0.3); border-radius: 8px; padding: 12px;"></div>
                            <div id="card-errors-checkout" class="text-red-400 text-sm mt-2"></div>
                        </div>

                        <!-- 安全提示 -->
                        <div style="background: rgba(46, 125, 50, 0.2); border: 1px solid #2e7d32; color: #4caf50; border-radius: 8px; padding: 12px; font-size: 14px;">
                            <i class="fas fa-lock mr-2"></i>
                            安全支付由 Stripe 提供保护
                        </div>

                        <!-- 提交按钮 -->
                        <button type="submit" id="submitStripePayment"
                            class="w-full bg-mystic-gold text-deep-navy py-3 rounded-lg font-semibold hover:bg-yellow-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                            <span id="buttonTextCheckout">支付 $${totalAmount.toFixed(2)}</span>
                            <span id="spinnerCheckout" class="hidden">
                                <i class="fas fa-spinner fa-spin"></i> 处理中...
                            </span>
                        </button>
                    </form>

                    <p class="text-xs text-moon-silver text-center mt-4">
                        测试卡号: 4242 4242 4242 4242
                    </p>
                </div>
            `;

            document.body.appendChild(modal);

            // 初始化 Stripe 元素
            setTimeout(() => {
                if (window.createPaymentElements) {
                    const cardElement = window.createPaymentElements('card-element-checkout');
                    
                    if (cardElement) {
                        cardElement.on('change', (event) => {
                            const displayError = document.getElementById('card-errors-checkout');
                            if (event.error) {
                                displayError.textContent = event.error.message;
                            } else {
                                displayError.textContent = '';
                            }
                        });
                    }
                }

                // 绑定表单提交
                document.getElementById('stripePaymentForm').addEventListener('submit', async (e) => {
                    e.preventDefault();
                    await this.processStripePayment(items, totalAmount, orderData);
                });
            }, 100);

            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal('stripePaymentModal');
                }
            });
        }

        /**
         * 处理 Stripe 支付
         */
        async processStripePayment(items, totalAmount, orderData) {
            const submitButton = document.getElementById('submitStripePayment');
            const buttonText = document.getElementById('buttonTextCheckout');
            const spinner = document.getElementById('spinnerCheckout');

            submitButton.disabled = true;
            buttonText.classList.add('hidden');
            spinner.classList.remove('hidden');

            try {
                // 1. 创建支付意图
                const amount = Math.round(totalAmount * 100); // 转换为分
                const paymentIntentResult = await window.StripePaymentService.createPaymentIntent(
                    amount,
                    'usd',
                    {
                        orderType: 'product',
                        itemCount: items.length
                    }
                );

                if (!paymentIntentResult.success) {
                    throw new Error(paymentIntentResult.error);
                }

                // 2. 确认支付
                const confirmResult = await window.StripePaymentService.confirmPayment(
                    paymentIntentResult.clientSecret,
                    {
                        name: orderData.recipient_name,
                        email: (await window.EnhancedAuthService.getCurrentUser()).email
                    }
                );

                if (!confirmResult.success) {
                    throw new Error(confirmResult.error);
                }

                // 3. 支付成功，创建订单
                orderData.payment_method = 'stripe';
                orderData.payment_status = 'paid';
                orderData.stripe_payment_intent_id = confirmResult.paymentIntent.id;
                orderData.status = 'confirmed';

                const result = await ShopService.orders.create(orderData);

                if (result.success) {
                    // 创建订单明细
                    await this.createOrderItems(result.data.id, items);

                    // 清空购物车
                    await ShopService.cart.clear();

                    // 显示成功消息
                    this.closeModal('stripePaymentModal');
                    this.showSuccessMessage(result.data.order_number);
                    await this.loadCart();
                } else {
                    throw new Error('创建订单失败: ' + result.error);
                }

            } catch (error) {
                console.error('支付失败:', error);
                alert('支付失败: ' + error.message);
            } finally {
                submitButton.disabled = false;
                buttonText.classList.remove('hidden');
                spinner.classList.add('hidden');
            }
        }

        /**
         * 创建订单明细
         */
        async createOrderItems(orderId, items) {
            try {
                const client = window.supabaseClient;
                const orderItems = items.map(item => ({
                    order_id: orderId,
                    product_id: item.product.id,
                    product_name: item.product.name_en || item.product.name,
                    product_price: item.product.price,
                    quantity: item.quantity,
                    subtotal: (item.product.price * item.quantity).toFixed(2)
                }));

                await client.from('order_items').insert(orderItems);
            } catch (error) {
                console.error('创建订单明细失败:', error);
            }
        }

        /**
         * 加载收货地址
         */
        async loadAddresses() {
            try {
                const result = await ShopService.addresses.getAll();
                if (result.success) {
                    this.addresses = result.data || [];
                }
            } catch (error) {
                console.error('加载地址失败:', error);
            }
        }

        /**
         * 显示添加地址表单
         */
        showAddAddressForm() {
            // 这里可以扩展为独立的地址管理界面
            alert('地址管理功能开发中...');
        }

        /**
         * 显示成功消息
         */
        showSuccessMessage(orderNumber) {
            const message = document.createElement('div');
            message.className = 'fixed top-20 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-8 py-4 rounded-lg shadow-2xl z-50';
            message.innerHTML = `
                <div class="text-center">
                    <div class="text-3xl mb-2">✅</div>
                    <div class="font-bold mb-1">订单创建成功！</div>
                    <div class="text-sm">订单号: ${orderNumber}</div>
                    <div class="text-xs mt-2">我们会尽快处理您的订单</div>
                </div>
            `;

            document.body.appendChild(message);

            setTimeout(() => {
                message.remove();
            }, 5000);
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
         * 关闭模态框
         */
        closeModal(modalId) {
            const modal = document.getElementById(modalId);
            if (modal) {
                modal.remove();
            }
        }

        /**
         * 设置事件监听
         */
        setupEventListeners() {
            // 查看购物车按钮
            const viewCartBtn = document.getElementById('viewCartBtn');
            if (viewCartBtn) {
                viewCartBtn.addEventListener('click', () => this.viewCart());
            }

            // ESC键关闭模态框
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    this.closeModal('cartModal');
                    this.closeModal('checkoutModal');
                }
            });
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
