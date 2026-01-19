/**
 * 支付 UI 组件
 * Payment UI Components
 */

(function () {
    'use strict';

    /**
     * 显示支付表单（会员订阅）
     */
    window.showPaymentForm = function (planType) {
        const plans = {
            premium: {
                name: 'Premium',
                price: 19,
                priceId: 'price_premium_monthly'
            },
            professional: {
                name: 'Professional',
                price: 49,
                priceId: 'price_professional_monthly'
            }
        };

        const plan = plans[planType];
        if (!plan) {
            alert('无效的订阅计划');
            return;
        }

        const modal = document.createElement('div');
        modal.id = 'paymentModal';
        modal.className = 'fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4';

        const subtotal = plan.price;
        const tax = (subtotal * 0.07).toFixed(2);
        const total = (parseFloat(subtotal) + parseFloat(tax)).toFixed(2);

        modal.innerHTML = `
            <div class="bg-gradient-to-br from-deep-navy to-mystic-purple rounded-xl p-8 max-w-md w-full border-2 border-mystic-gold/30">
                <div class="flex justify-between items-center mb-6">
                    <h2 class="text-2xl font-serif font-bold text-mystic-gold" data-i18n="` + (planType === 'premium' ? 'payment.button.choosePremium' : 'payment.plan.professional') + `">${plan.name}</h2>
                    <button onclick="closePaymentModal()" class="text-moon-silver hover:text-mystic-gold text-2xl">
                        <i class="fas fa-times"></i>
                    </button>
                </div>

                <div class="mb-6 p-4 bg-mystic-gold/10 rounded-lg border border-mystic-gold/30 space-y-2">
                    <div class="flex justify-between items-center text-sm">
                        <span class="text-moon-silver" data-i18n="payment.price.subtotal">小计:</span>
                        <span class="font-medium">$${subtotal.toFixed(2)}</span>
                    </div>
                    <div class="flex justify-between items-center text-sm">
                        <span class="text-moon-silver" data-i18n="payment.price.tax">消费税 (7%):</span>
                        <span class="font-medium">$${tax}</span>
                    </div>
                    <div class="flex justify-between items-center pt-2 border-t border-mystic-gold/30">
                        <span class="text-lg font-semibold" data-i18n="payment.price.total">总计:</span>
                        <span class="text-2xl font-bold text-mystic-gold">$${total}/月</span>
                    </div>
                </div>

                <form id="subscriptionForm" class="space-y-4">
                    <!-- 姓名 -->
                    <div>
                        <label class="block text-moon-silver mb-2" data-i18n="payment.modal.name">姓名</label>
                        <input type="text" id="cardholderName" required
                            class="form-input" data-i18n-placeholder="payment.placeholder.name" placeholder="张三">
                    </div>

                    <!-- 邮箱 -->
                    <div>
                        <label class="block text-moon-silver mb-2" data-i18n="payment.modal.email">邮箱</label>
                        <input type="email" id="cardholderEmail" required
                            class="form-input" placeholder="your@email.com">
                    </div>

                    <!-- Stripe 卡片元素 -->
                    <div>
                        <label class="block text-moon-silver mb-2">支付信息</label>
                        <div id="card-element" class="form-input"></div>
                        <div id="card-errors" class="text-red-400 text-sm mt-2"></div>
                    </div>

                    <!-- 安全提示 -->
                    <div class="security-badge rounded-lg p-3 text-sm">
                        <i class="fas fa-lock mr-2"></i>
                        安全支付由 Stripe 提供保护
                    </div>

                    <!-- 提交按钮 -->
                    <button type="submit" id="submitPayment"
                        class="w-full bg-mystic-gold text-deep-navy py-3 rounded-lg font-semibold hover:bg-yellow-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                        <span id="buttonText">立即支付 $${total}</span>
                        <span id="spinner" class="hidden">
                            <i class="fas fa-spinner fa-spin"></i> 处理中...
                        </span>
                    </button>
                </form>

                <p class="text-xs text-moon-silver text-center mt-4">
                    订阅后将自动续费，可随时取消
                </p>
            </div>
        `;

        document.body.appendChild(modal);

        // 初始化 Stripe 元素
        setTimeout(async () => {
            const cardElement = await window.createPaymentElements('card-element');

            if (cardElement) {
                // 监听卡片输入错误
                cardElement.on('change', (event) => {
                    const displayError = document.getElementById('card-errors');
                    if (event.error) {
                        displayError.textContent = event.error.message;
                    } else {
                        displayError.textContent = '';
                    }
                });
            }

            // 绑定表单提交
            document.getElementById('subscriptionForm').addEventListener('submit', async (e) => {
                e.preventDefault();
                await handleSubscriptionSubmit(plan);
            });
        }, 100);

        // 点击背景关闭
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closePaymentModal();
            }
        });
    };

    /**
     * 处理订阅提交
     */
    async function handleSubscriptionSubmit(plan) {
        const submitButton = document.getElementById('submitPayment');
        const buttonText = document.getElementById('buttonText');
        const spinner = document.getElementById('spinner');

        // 禁用按钮
        submitButton.disabled = true;
        buttonText.classList.add('hidden');
        spinner.classList.remove('hidden');

        try {
            // 获取表单数据
            const name = document.getElementById('cardholderName').value;
            const email = document.getElementById('cardholderEmail').value;

            // 使用增强版支付服务
            const paymentService = window.EnhancedStripePaymentService || window.StripePaymentService;

            if (!paymentService) {
                throw new Error('支付服务未初始化');
            }

            // 创建订阅
            const result = await paymentService.purchaseSubscription(
                plan.name.toLowerCase(),
                { name, email }
            );

            if (result.success) {
                // 显示成功消息
                const mockNote = result.mock ? ' (测试模式)' : '';
                showSuccessMessage('订阅成功！' + mockNote, '欢迎成为 ' + plan.name + ' 会员');
                closePaymentModal();

                // 刷新页面或更新用户状态
                // 延迟刷新或恢复，给予用户看到成功消息的时间
                setTimeout(() => {
                    if (window.statePreserver) {
                        // 尝试恢复之前页面的状态
                        const savedState = JSON.parse(localStorage.getItem('saved_page_state') || '{}');
                        if (savedState && savedState.path && savedState.path !== 'payment.html') {
                            window.location.href = savedState.path;
                            return;
                        }
                    }
                    window.location.reload();
                }, 2000);
            } else {
                throw new Error(result.error);
            }
        } catch (error) {
            console.error('订阅失败:', error);
            showErrorMessage('订阅失败', error.message);
        } finally {
            // 恢复按钮
            submitButton.disabled = false;
            buttonText.classList.remove('hidden');
            spinner.classList.add('hidden');
        }
    }

    /**
     * 显示商品支付表单
     */
    window.showProductPaymentForm = function (product, quantity = 1) {
        const total = (product.price * quantity).toFixed(2);

        const modal = document.createElement('div');
        modal.id = 'paymentModal';
        modal.className = 'fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4';

        modal.innerHTML = `
            <div class="bg-gradient-to-br from-deep-navy to-mystic-purple rounded-xl p-8 max-w-md w-full border-2 border-mystic-gold/30">
                <div class="flex justify-between items-center mb-6">
                    <h2 class="text-2xl font-serif font-bold text-mystic-gold">购买商品</h2>
                    <button onclick="closePaymentModal()" class="text-moon-silver hover:text-mystic-gold text-2xl">
                        <i class="fas fa-times"></i>
                    </button>
                </div>

                <!-- 商品信息 -->
                <div class="mb-6 p-4 bg-white/5 rounded-lg space-y-2">
                    <div class="flex items-center gap-3 mb-3">
                        ${product.image_url ? `
                            <img src="${product.image_url}" alt="${product.name_en || product.name}" 
                                 class="w-16 h-16 object-cover rounded">
                        ` : `
                            <div class="text-3xl">${product.icon || '🎁'}</div>
                        `}
                        <div>
                            <h3 class="font-semibold">${product.name_en || product.name}</h3>
                            <p class="text-sm text-moon-silver">$${product.price} × ${quantity}</p>
                        </div>
                    </div>
                    <div class="flex justify-between items-center text-sm pt-2 border-t border-white/10">
                        <span class="text-moon-silver" data-i18n="payment.price.subtotal">小计:</span>
                        <span class="font-medium">$${(product.price * quantity).toFixed(2)}</span>
                    </div>
                    <div class="flex justify-between items-center text-sm">
                        <span class="text-moon-silver" data-i18n="payment.price.tax">消费税 (7%):</span>
                        <span class="font-medium">$${((product.price * quantity) * 0.07).toFixed(2)}</span>
                    </div>
                    <div class="flex justify-between items-center pt-2 border-t border-mystic-gold/30">
                        <span class="text-lg font-semibold" data-i18n="payment.price.total">总计:</span>
                        <span class="text-2xl font-bold text-mystic-gold">$${((product.price * quantity) * 1.07).toFixed(2)}</span>
                    </div>
                </div>

                <form id="productPaymentForm" class="space-y-4">
                    <!-- 姓名 -->
                    <div>
                        <label class="block text-moon-silver mb-2">姓名</label>
                        <input type="text" id="buyerName" required
                            class="form-input" placeholder="张三">
                    </div>

                    <!-- 邮箱 -->
                    <div>
                        <label class="block text-moon-silver mb-2">邮箱</label>
                        <input type="email" id="buyerEmail" required
                            class="form-input" placeholder="your@email.com">
                    </div>

                    <!-- Stripe 卡片元素 -->
                    <div>
                        <label class="block text-moon-silver mb-2">支付信息</label>
                        <div id="card-element-product" class="form-input"></div>
                        <div id="card-errors-product" class="text-red-400 text-sm mt-2"></div>
                    </div>

                    <!-- 安全提示 -->
                    <div class="security-badge rounded-lg p-3 text-sm">
                        <i class="fas fa-lock mr-2"></i>
                        安全支付由 Stripe 提供保护
                    </div>

                    <!-- 提交按钮 -->
                    <button type="submit" id="submitProductPayment"
                        class="w-full bg-mystic-gold text-deep-navy py-3 rounded-lg font-semibold hover:bg-yellow-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                        <span id="buttonTextProduct">立即支付 $${((product.price * quantity) * 1.07).toFixed(2)}</span>
                        <span id="spinnerProduct" class="hidden">
                            <i class="fas fa-spinner fa-spin"></i> 处理中...
                        </span>
                    </button>
                </form>
            </div>
        `;

        document.body.appendChild(modal);

        // 初始化 Stripe 元素
        setTimeout(async () => {
            const cardElement = await window.createPaymentElements('card-element-product');

            if (cardElement) {
                cardElement.on('change', (event) => {
                    const displayError = document.getElementById('card-errors-product');
                    if (event.error) {
                        displayError.textContent = event.error.message;
                    } else {
                        displayError.textContent = '';
                    }
                });
            }

            // 绑定表单提交
            document.getElementById('productPaymentForm').addEventListener('submit', async (e) => {
                e.preventDefault();
                await handleProductPaymentSubmit(product, quantity);
            });
        }, 100);

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closePaymentModal();
            }
        });
    };

    /**
     * 处理商品支付提交
     */
    async function handleProductPaymentSubmit(product, quantity) {
        const submitButton = document.getElementById('submitProductPayment');
        const buttonText = document.getElementById('buttonTextProduct');
        const spinner = document.getElementById('spinnerProduct');

        submitButton.disabled = true;
        buttonText.classList.add('hidden');
        spinner.classList.remove('hidden');

        try {
            const name = document.getElementById('buyerName').value;
            const email = document.getElementById('buyerEmail').value;

            const result = await window.StripePaymentService.purchaseProduct(
                product.id,
                quantity,
                { name, email }
            );

            if (result.success) {
                showSuccessMessage('购买成功！', '您的订单已确认');
                closePaymentModal();

                setTimeout(() => {
                    window.location.href = 'profile.html#orders';
                }, 2000);
            } else {
                throw new Error(result.error);
            }
        } catch (error) {
            console.error('购买失败:', error);
            alert('购买失败: ' + error.message);
        } finally {
            submitButton.disabled = false;
            buttonText.classList.remove('hidden');
            spinner.classList.add('hidden');
        }
    }

    /**
     * 关闭支付模态框
     */
    window.closePaymentModal = function () {
        const modal = document.getElementById('paymentModal');
        if (modal) {
            modal.remove();
        }
    };

    /**
     * 显示联系销售表单
     */
    window.showContactForm = function () {
        alert('请联系我们的销售团队：sales@destinyai.com');
    };

    /**
     * 显示成功消息
     */
    function showSuccessMessage(title, message) {
        const successModal = document.createElement('div');
        successModal.className = 'fixed top-20 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-8 py-4 rounded-lg shadow-2xl z-50 animate-bounce';
        successModal.innerHTML = `
            <div class="text-center">
                <div class="text-3xl mb-2">✅</div>
                <div class="font-bold mb-1">${title}</div>
                <div class="text-sm">${message}</div>
            </div>
        `;

        document.body.appendChild(successModal);

        setTimeout(() => {
            successModal.style.opacity = '0';
            successModal.style.transition = 'opacity 0.3s';
            setTimeout(() => successModal.remove(), 300);
        }, 3000);
    }

    /**
     * 显示错误消息
     */
    function showErrorMessage(title, message) {
        const errorModal = document.createElement('div');
        errorModal.className = 'fixed top-20 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-8 py-4 rounded-lg shadow-2xl z-50';
        errorModal.innerHTML = `
            <div class="text-center">
                <div class="text-3xl mb-2">❌</div>
                <div class="font-bold mb-1">${title}</div>
                <div class="text-sm">${message}</div>
            </div>
        `;

        document.body.appendChild(errorModal);

        setTimeout(() => {
            errorModal.style.opacity = '0';
            errorModal.style.transition = 'opacity 0.3s';
            setTimeout(() => errorModal.remove(), 300);
        }, 4000);
    }

    // 导出函数
    window.showSuccessMessage = showSuccessMessage;
    window.showErrorMessage = showErrorMessage;

})();
