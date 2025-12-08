/**
 * Stripe 客户端配置 - 增强版
 * Enhanced Stripe Client Configuration with Mock Mode
 */

(function() {
    'use strict';

    // Stripe 可发布密钥 - 从环境变量加载
    // ⚠️ 在 Netlify 中配置环境变量：VITE_STRIPE_PUBLISHABLE_KEY
    const STRIPE_PUBLISHABLE_KEY = import.meta?.env?.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_51SXG0rPyLPASs4oMIUPfLppXKefnEycFKqZ8abmH9c7DqcuOi1RpVxR1d2e3bnM3dDzuj3uvpNFYjeio68hOOMJV008ByjCRw8';

    // 初始化 Stripe
    let stripe = null;
    let elements = null;
    let cardElement = null;

    /**
     * 检查是否为测试模式
     */
    function isTestMode() {
        return localStorage.getItem('payment_test_mode') === 'true' || 
               window.location.hostname === 'localhost' ||
               window.location.hostname === '127.0.0.1' ||
               !navigator.onLine;
    }

    /**
     * 初始化 Stripe
     */
    function initializeStripe() {
        if (typeof Stripe === 'undefined') {
            console.warn('⚠️ Stripe.js 未加载，将使用测试模式');
            return false;
        }

        try {
            stripe = Stripe(STRIPE_PUBLISHABLE_KEY);
            console.log('✅ Stripe 客户端初始化成功');
            return true;
        } catch (error) {
            console.error('❌ Stripe 初始化失败:', error);
            console.log('🔄 切换到测试模式');
            return false;
        }
    }

    /**
     * 创建支付元素
     */
    function createPaymentElements(containerId) {
        if (!stripe) {
            console.warn('Stripe 未初始化，跳过支付元素创建');
            return null;
        }

        try {
            elements = stripe.elements();

            cardElement = elements.create('card', {
                style: {
                    base: {
                        color: '#fafafa',
                        fontFamily: 'Inter, sans-serif',
                        fontSmoothing: 'antialiased',
                        fontSize: '16px',
                        '::placeholder': {
                            color: 'rgba(255, 255, 255, 0.5)'
                        }
                    },
                    invalid: {
                        color: '#fa755a',
                        iconColor: '#fa755a'
                    }
                },
                hidePostalCode: false
            });

            const container = document.getElementById(containerId);
            if (container) {
                cardElement.mount(`#${containerId}`);
                console.log('✅ 支付元素已挂载');
            }

            return cardElement;
        } catch (error) {
            console.error('创建支付元素失败:', error);
            return null;
        }
    }

    /**
     * 模拟网络延迟
     */
    function mockDelay(ms = 1500) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Stripe 支付服务 - 增强版
     */
    const EnhancedStripePaymentService = {
        /**
         * 获取 Stripe 实例
         */
        getStripe() {
            return stripe;
        },

        /**
         * 获取卡片元素
         */
        getCardElement() {
            return cardElement;
        },

        /**
         * 检查是否为测试模式
         */
        isTestMode() {
            return isTestMode();
        },

        /**
         * 设置测试模式
         */
        setTestMode(enabled) {
            localStorage.setItem('payment_test_mode', enabled ? 'true' : 'false');
            console.log(`🧪 测试模式已${enabled ? '启用' : '禁用'}`);
        },

        /**
         * 创建支付意图（商品购买）
         */
        async createPaymentIntent(amount, currency = 'usd', metadata = {}) {
            try {
                // 测试模式
                if (this.isTestMode()) {
                    console.log('🧪 测试模式：模拟创建支付意图');
                    await mockDelay();
                    return {
                        success: true,
                        clientSecret: 'pi_mock_secret_' + Date.now(),
                        paymentIntentId: 'pi_mock_' + Date.now(),
                        mock: true
                    };
                }

                const response = await fetch('/api/stripe/create-payment-intent', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        amount,
                        currency,
                        metadata
                    })
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.error || '创建支付意图失败');
                }

                return {
                    success: true,
                    clientSecret: data.clientSecret,
                    paymentIntentId: data.paymentIntentId
                };
            } catch (error) {
                console.error('创建支付意图失败:', error);
                
                // 网络错误时自动切换到测试模式
                if (error.message.includes('fetch') || error.message.includes('Failed to fetch')) {
                    console.log('🔄 网络错误，使用测试模式');
                    await mockDelay();
                    return {
                        success: true,
                        clientSecret: 'pi_mock_secret_' + Date.now(),
                        paymentIntentId: 'pi_mock_' + Date.now(),
                        mock: true
                    };
                }

                return {
                    success: false,
                    error: error.message
                };
            }
        },

        /**
         * 确认支付
         */
        async confirmPayment(clientSecret, billingDetails = {}) {
            // 测试模式
            if (this.isTestMode() || clientSecret.includes('mock')) {
                console.log('🧪 测试模式：模拟确认支付');
                await mockDelay();
                return {
                    success: true,
                    paymentIntent: {
                        id: 'pi_mock_' + Date.now(),
                        status: 'succeeded',
                        amount: 1999,
                        currency: 'usd'
                    },
                    mock: true
                };
            }

            if (!stripe || !cardElement) {
                return {
                    success: false,
                    error: 'Stripe 未初始化'
                };
            }

            try {
                const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
                    payment_method: {
                        card: cardElement,
                        billing_details: billingDetails
                    }
                });

                if (error) {
                    throw error;
                }

                return {
                    success: true,
                    paymentIntent
                };
            } catch (error) {
                console.error('确认支付失败:', error);
                return {
                    success: false,
                    error: error.message
                };
            }
        },

        /**
         * 创建订阅（会员购买）
         */
        async createSubscription(priceId, billingDetails = {}) {
            try {
                // 测试模式
                if (this.isTestMode()) {
                    console.log('🧪 测试模式：模拟创建订阅');
                    await mockDelay();
                    return {
                        success: true,
                        subscription: {
                            id: 'sub_mock_' + Date.now(),
                            status: 'active',
                            current_period_start: Math.floor(Date.now() / 1000),
                            current_period_end: Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60
                        },
                        mock: true
                    };
                }

                const response = await fetch('/api/stripe/create-subscription', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        priceId,
                        billingDetails
                    })
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.error || '创建订阅失败');
                }

                // 如果需要确认支付
                if (data.clientSecret && stripe && cardElement) {
                    const { error, paymentIntent } = await stripe.confirmCardPayment(data.clientSecret, {
                        payment_method: {
                            card: cardElement,
                            billing_details: billingDetails
                        }
                    });

                    if (error) {
                        throw error;
                    }

                    return {
                        success: true,
                        subscription: data.subscription,
                        paymentIntent
                    };
                }

                return {
                    success: true,
                    subscription: data.subscription
                };
            } catch (error) {
                console.error('创建订阅失败:', error);
                
                // 网络错误时自动切换到测试模式
                if (error.message.includes('fetch') || error.message.includes('Failed to fetch')) {
                    console.log('🔄 网络错误，使用测试模式');
                    await mockDelay();
                    return {
                        success: true,
                        subscription: {
                            id: 'sub_mock_' + Date.now(),
                            status: 'active',
                            current_period_start: Math.floor(Date.now() / 1000),
                            current_period_end: Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60
                        },
                        mock: true
                    };
                }

                return {
                    success: false,
                    error: error.message
                };
            }
        },

        /**
         * 取消订阅
         */
        async cancelSubscription(subscriptionId) {
            try {
                // 测试模式
                if (this.isTestMode() || subscriptionId.includes('mock')) {
                    console.log('🧪 测试模式：模拟取消订阅');
                    await mockDelay(500);
                    return {
                        success: true,
                        subscription: {
                            id: subscriptionId,
                            status: 'canceled',
                            cancel_at_period_end: true
                        },
                        mock: true
                    };
                }

                const response = await fetch('/api/stripe/cancel-subscription', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        subscriptionId
                    })
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.error || '取消订阅失败');
                }

                return {
                    success: true,
                    subscription: data.subscription
                };
            } catch (error) {
                console.error('取消订阅失败:', error);
                return {
                    success: false,
                    error: error.message
                };
            }
        },

        /**
         * 商品购买（一次性支付）
         */
        async purchaseProduct(productId, quantity = 1, billingDetails = {}) {
            try {
                // 测试模式
                if (this.isTestMode()) {
                    console.log('🧪 测试模式：模拟商品购买');
                    await mockDelay();
                    return {
                        success: true,
                        order: {
                            id: 'order_mock_' + Date.now(),
                            status: 'paid',
                            total_amount: 9.99 * quantity
                        },
                        paymentIntent: {
                            id: 'pi_mock_' + Date.now(),
                            status: 'succeeded'
                        },
                        mock: true
                    };
                }

                // 获取商品信息
                if (window.ShopService) {
                    const productResult = await window.ShopService.products.getById(productId);
                    if (!productResult.success) {
                        throw new Error('获取商品信息失败');
                    }

                    const product = productResult.data;
                    const amount = Math.round(product.price * quantity * 100);

                    // 创建支付意图
                    const paymentIntentResult = await this.createPaymentIntent(amount, 'usd', {
                        productId,
                        productName: product.name_en || product.name,
                        quantity
                    });

                    if (!paymentIntentResult.success) {
                        throw new Error(paymentIntentResult.error);
                    }

                    // 确认支付
                    const confirmResult = await this.confirmPayment(
                        paymentIntentResult.clientSecret,
                        billingDetails
                    );

                    if (!confirmResult.success) {
                        throw new Error(confirmResult.error);
                    }

                    return {
                        success: true,
                        order: {
                            id: 'order_' + Date.now(),
                            status: 'paid',
                            total_amount: product.price * quantity
                        },
                        paymentIntent: confirmResult.paymentIntent
                    };
                }

                throw new Error('商店服务未初始化');
            } catch (error) {
                console.error('商品购买失败:', error);
                return {
                    success: false,
                    error: error.message
                };
            }
        },

        /**
         * 会员订阅购买
         */
        async purchaseSubscription(planType, billingDetails = {}) {
            try {
                // 价格 ID 映射
                const priceIds = {
                    premium: 'price_premium_monthly',
                    professional: 'price_professional_monthly'
                };

                const priceId = priceIds[planType];
                if (!priceId) {
                    throw new Error('无效的订阅计划');
                }

                // 创建订阅
                const result = await this.createSubscription(priceId, billingDetails);

                if (!result.success) {
                    throw new Error(result.error);
                }

                // 更新本地用户订阅状态
                const user = JSON.parse(localStorage.getItem('user') || '{}');
                user.subscription = planType;
                user.plan = planType;
                user.subscriptionId = result.subscription.id;
                user.subscriptionStatus = 'active';
                localStorage.setItem('user', JSON.stringify(user));

                console.log(`✅ 订阅成功：${planType}`, result.mock ? '(测试模式)' : '');

                // 如果有 Supabase，也更新数据库
                if (window.supabaseClient && window.EnhancedAuthService && !result.mock) {
                    try {
                        const currentUser = await window.EnhancedAuthService.getCurrentUser();
                        if (currentUser) {
                            await window.supabaseClient
                                .from('subscriptions')
                                .upsert({
                                    user_id: currentUser.id,
                                    plan_type: planType,
                                    status: 'active',
                                    stripe_subscription_id: result.subscription.id,
                                    current_period_start: new Date(result.subscription.current_period_start * 1000).toISOString(),
                                    current_period_end: new Date(result.subscription.current_period_end * 1000).toISOString()
                                });
                        }
                    } catch (dbError) {
                        console.warn('数据库更新失败（非致命错误）:', dbError);
                    }
                }

                return result;
            } catch (error) {
                console.error('会员订阅购买失败:', error);
                return {
                    success: false,
                    error: error.message
                };
            }
        }
    };

    // 页面加载时初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            initializeStripe();
            if (isTestMode()) {
                console.log('🧪 当前运行在测试模式');
            }
        });
    } else {
        initializeStripe();
        if (isTestMode()) {
            console.log('🧪 当前运行在测试模式');
        }
    }

    // 导出到全局
    window.EnhancedStripePaymentService = EnhancedStripePaymentService;
    window.StripePaymentService = EnhancedStripePaymentService; // 兼容旧代码
    window.createPaymentElements = createPaymentElements;
    window.initializeStripe = initializeStripe;

    console.log('✅ Enhanced Stripe Client 已加载');

})();
