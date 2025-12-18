/**
 * Stripe API 路由
 * Stripe API Routes
 */

const express = require('express');
const router = express.Router();
require('dotenv').config();

// 初始化 Stripe
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

/**
 * 创建支付意图（商品购买）
 * POST /api/stripe/create-payment-intent
 */
router.post('/create-payment-intent', async (req, res) => {
    try {
        const { amount, currency = 'usd', metadata = {} } = req.body;

        // 验证金额
        if (!amount || amount < 50) { // Stripe 最小金额 $0.50
            return res.status(400).json({
                error: '金额无效，最小金额为 $0.50'
            });
        }

        // 创建支付意图
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount), // 确保是整数
            currency,
            metadata,
            automatic_payment_methods: {
                enabled: true
            }
        });

        res.json({
            clientSecret: paymentIntent.client_secret,
            paymentIntentId: paymentIntent.id
        });
    } catch (error) {
        console.error('创建支付意图失败:', error);
        res.status(500).json({
            error: error.message
        });
    }
});

/**
 * 创建订阅（会员购买）
 * POST /api/stripe/create-subscription
 */
router.post('/create-subscription', async (req, res) => {
    try {
        const { priceId, billingDetails = {} } = req.body;

        if (!priceId) {
            return res.status(400).json({
                error: '价格 ID 不能为空'
            });
        }

        // 1. 创建或获取客户
        let customer;
        const { email, name } = billingDetails;

        if (email) {
            // 检查是否已存在客户
            const existingCustomers = await stripe.customers.list({
                email,
                limit: 1
            });

            if (existingCustomers.data.length > 0) {
                customer = existingCustomers.data[0];
            } else {
                // 创建新客户
                customer = await stripe.customers.create({
                    email,
                    name,
                    metadata: billingDetails
                });
            }
        } else {
            customer = await stripe.customers.create({
                name,
                metadata: billingDetails
            });
        }

        // 2. 创建订阅
        const subscription = await stripe.subscriptions.create({
            customer: customer.id,
            items: [{ price: priceId }],
            payment_behavior: 'default_incomplete',
            payment_settings: {
                save_default_payment_method: 'on_subscription'
            },
            expand: ['latest_invoice.payment_intent']
        });

        res.json({
            subscriptionId: subscription.id,
            clientSecret: subscription.latest_invoice.payment_intent.client_secret,
            subscription
        });
    } catch (error) {
        console.error('创建订阅失败:', error);
        res.status(500).json({
            error: error.message
        });
    }
});

/**
 * 取消订阅
 * POST /api/stripe/cancel-subscription
 */
router.post('/cancel-subscription', async (req, res) => {
    try {
        const { subscriptionId } = req.body;

        if (!subscriptionId) {
            return res.status(400).json({
                error: '订阅 ID 不能为空'
            });
        }

        // 取消订阅（在当前计费周期结束时）
        const subscription = await stripe.subscriptions.update(subscriptionId, {
            cancel_at_period_end: true
        });

        res.json({
            subscription
        });
    } catch (error) {
        console.error('取消订阅失败:', error);
        res.status(500).json({
            error: error.message
        });
    }
});

/**
 * 立即取消订阅
 * POST /api/stripe/cancel-subscription-now
 */
router.post('/cancel-subscription-now', async (req, res) => {
    try {
        const { subscriptionId } = req.body;

        if (!subscriptionId) {
            return res.status(400).json({
                error: '订阅 ID 不能为空'
            });
        }

        // 立即取消订阅
        const subscription = await stripe.subscriptions.cancel(subscriptionId);

        res.json({
            subscription
        });
    } catch (error) {
        console.error('立即取消订阅失败:', error);
        res.status(500).json({
            error: error.message
        });
    }
});

/**
 * 获取订阅状态
 * GET /api/stripe/subscription/:subscriptionId
 */
router.get('/subscription/:subscriptionId', async (req, res) => {
    try {
        const { subscriptionId } = req.params;

        const subscription = await stripe.subscriptions.retrieve(subscriptionId);

        res.json({
            subscription
        });
    } catch (error) {
        console.error('获取订阅状态失败:', error);
        res.status(500).json({
            error: error.message
        });
    }
});

/**
 * 获取客户的所有订阅
 * GET /api/stripe/customer/:customerId/subscriptions
 */
router.get('/customer/:customerId/subscriptions', async (req, res) => {
    try {
        const { customerId } = req.params;

        const subscriptions = await stripe.subscriptions.list({
            customer: customerId,
            status: 'all',
            expand: ['data.default_payment_method']
        });

        res.json({
            subscriptions: subscriptions.data
        });
    } catch (error) {
        console.error('获取客户订阅失败:', error);
        res.status(500).json({
            error: error.message
        });
    }
});

/**
 * 创建价格（用于设置订阅计划）
 * POST /api/stripe/create-price
 */
router.post('/create-price', async (req, res) => {
    try {
        const { productName, amount, currency = 'usd', interval = 'month' } = req.body;

        // 1. 创建产品
        const product = await stripe.products.create({
            name: productName
        });

        // 2. 创建价格
        const price = await stripe.prices.create({
            product: product.id,
            unit_amount: Math.round(amount * 100), // 转换为分
            currency,
            recurring: {
                interval
            }
        });

        res.json({
            product,
            price
        });
    } catch (error) {
        console.error('创建价格失败:', error);
        res.status(500).json({
            error: error.message
        });
    }
});

/**
 * Webhook 处理
 * POST /api/stripe/webhook
 */
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
    const sig = req.headers['stripe-signature'];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event;

    try {
        // 验证 webhook 签名
        event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    } catch (err) {
        console.error('Webhook 签名验证失败:', err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // 处理事件
    try {
        switch (event.type) {
            case 'payment_intent.succeeded':
                const paymentIntent = event.data.object;
                console.log('✅ 支付成功:', paymentIntent.id);
                // 更新订单状态
                await handlePaymentSuccess(paymentIntent);
                break;

            case 'payment_intent.payment_failed':
                const failedPayment = event.data.object;
                console.log('❌ 支付失败:', failedPayment.id);
                await handlePaymentFailure(failedPayment);
                break;

            case 'customer.subscription.created':
                const newSubscription = event.data.object;
                console.log('✅ 订阅创建:', newSubscription.id);
                await handleSubscriptionCreated(newSubscription);
                break;

            case 'customer.subscription.updated':
                const updatedSubscription = event.data.object;
                console.log('🔄 订阅更新:', updatedSubscription.id);
                await handleSubscriptionUpdated(updatedSubscription);
                break;

            case 'customer.subscription.deleted':
                const deletedSubscription = event.data.object;
                console.log('❌ 订阅取消:', deletedSubscription.id);
                await handleSubscriptionDeleted(deletedSubscription);
                break;

            case 'invoice.payment_succeeded':
                const invoice = event.data.object;
                console.log('✅ 发票支付成功:', invoice.id);
                await handleInvoicePaymentSucceeded(invoice);
                break;

            case 'invoice.payment_failed':
                const failedInvoice = event.data.object;
                console.log('❌ 发票支付失败:', failedInvoice.id);
                await handleInvoicePaymentFailed(failedInvoice);
                break;

            default:
                console.log(`未处理的事件类型: ${event.type}`);
        }

        res.json({ received: true });
    } catch (error) {
        console.error('处理 webhook 事件失败:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * Webhook 事件处理函数
 */

async function handlePaymentSuccess(paymentIntent) {
    // 在这里更新数据库中的订单状态
    console.log('处理支付成功:', paymentIntent);
    // TODO: 更新 Supabase 订单状态
}

async function handlePaymentFailure(paymentIntent) {
    console.log('处理支付失败:', paymentIntent);
    // TODO: 通知用户支付失败
}

async function handleSubscriptionCreated(subscription) {
    console.log('处理订阅创建:', subscription);
    // TODO: 在 Supabase 中创建订阅记录
}

async function handleSubscriptionUpdated(subscription) {
    console.log('处理订阅更新:', subscription);
    // TODO: 更新 Supabase 订阅状态
}

async function handleSubscriptionDeleted(subscription) {
    console.log('处理订阅删除:', subscription);
    // TODO: 更新 Supabase 订阅状态为已取消
}

async function handleInvoicePaymentSucceeded(invoice) {
    console.log('处理发票支付成功:', invoice);
    // TODO: 记录支付历史
}

async function handleInvoicePaymentFailed(invoice) {
    console.log('处理发票支付失败:', invoice);
    // TODO: 通知用户支付失败
}

module.exports = router;
