/**
 * Stripe 客户端配置
 * Stripe Client Configuration
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
     * 初始化 Stripe
     */
    function initializeStripe() {
        if (typeof Stripe === 'undefined') {
            console.error('❌ Stripe.js 未加载');
            return false;
        }

        try {
            stripe = Stripe(STRIPE_PUBLISHABLE_KEY);
            console.log('✅ Stripe 客户端初始化成功');
            return true;
        } catch (error) {
            console.error('❌ Stripe 初始化失败:', error);
            return false;
        }
    }

    /**
     * 创建支付元素
     */
    function createPaymentElements(containerId) {
        if (!stripe) {
            console.error('Stripe 未初始化');
            return null;
        }

        try {
            // 创建 Elements 实例
            elements = stripe.elements();

            // 创建卡片元素
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

            // 挂载到容器
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
     * Stripe 支付服务
     */
    const StripePaymentService = {
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
         * 创建支付意图（商品购买）
         */
        async createPaymentIntent(amount, currency = 'usd', metadata = {}) {
            try {
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
                // 1. 创建客户和订阅
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

                // 2. 如果需要确认支付
                if (data.clientSecret) {
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
         * 获取订阅状态
         */
        async getSubscriptionStatus(subscriptionId) {
            try {
                const response = await fetch(`/api/stripe/subscription/${subscriptionId}`);
                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.error || '获取订阅状态失败');
                }

                return {
                    success: true,
                    subscription: data.subscription
                };
            } catch (error) {
                console.error('获取订阅状态失败:', error);
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
                // 1. 获取商品信息
                const productResult = await window.ShopService.products.getById(productId);
                if (!productResult.success) {
                    throw new Error('获取商品信息失败');
                }

                const product = productResult.data;
                const amount = Math.round(product.price * quantity * 100); // 转换为分

                // 2. 创建支付意图
                const paymentIntentResult = await this.createPaymentIntent(amount, 'usd', {
                    productId,
                    productName: product.name_en || product.name,
                    quantity
                });

                if (!paymentIntentResult.success) {
                    throw new Error(paymentIntentResult.error);
                }

                // 3. 确认支付
                const confirmResult = await this.confirmPayment(
                    paymentIntentResult.clientSecret,
                    billingDetails
                );

                if (!confirmResult.success) {
                    throw new Error(confirmResult.error);
                }

                // 4. 创建订单记录
                const orderResult = await window.ShopService.orders.create({
                    total_amount: product.price * quantity,
                    payment_method: 'stripe',
                    payment_status: 'paid',
                    stripe_payment_intent_id: confirmResult.paymentIntent.id,
                    ...billingDetails
                });

                return {
                    success: true,
                    order: orderResult.data,
                    paymentIntent: confirmResult.paymentIntent
                };
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
                    premium: 'price_premium_monthly', // 需要在 Stripe Dashboard 创建
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

                // 如果有 Supabase，也更新数据库
                if (window.supabaseClient && window.EnhancedAuthService) {
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
        document.addEventListener('DOMContentLoaded', initializeStripe);
    } else {
        initializeStripe();
    }

    // 导出到全局
    window.StripePaymentService = StripePaymentService;
    window.createPaymentElements = createPaymentElements;
    window.initializeStripe = initializeStripe;

})();
