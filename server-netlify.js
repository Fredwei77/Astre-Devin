// ============================================
// Destiny AI Server - Netlify Functions 版本
// ============================================

const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Stripe = require('stripe');

const app = express();

// ============================================
// 环境变量配置
// ============================================
const JWT_SECRET = process.env.JWT_SECRET;
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const FRONTEND_URL = process.env.FRONTEND_URL || 'https://astredevin.netlify.app';

// 初始化服务
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
const stripe = Stripe(STRIPE_SECRET_KEY);

// ============================================
// 中间件配置
// ============================================
app.use(cors({
    origin: [FRONTEND_URL, 'http://localhost:3000', 'http://localhost:5173'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ============================================
// 基础路由
// ============================================
app.get('/', (req, res) => {
    res.json({
        message: '🚀 Destiny AI Backend (Netlify Functions)',
        status: 'success',
        timestamp: new Date().toISOString(),
        platform: 'netlify-functions',
        env: process.env.NODE_ENV || 'development'
    });
});

app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        platform: 'netlify-functions',
        timestamp: new Date().toISOString(),
        services: {
            supabase: !!SUPABASE_URL,
            stripe: !!STRIPE_SECRET_KEY,
            openrouter: !!OPENROUTER_API_KEY,
            jwt: !!JWT_SECRET
        }
    });
});

// ============================================
// 认证中间件
// ============================================
const authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({ success: false, message: '需要访问令牌' });
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(403).json({ success: false, message: '无效的访问令牌' });
    }
};

// ============================================
// API 路由
// ============================================

// 用户注册
app.post('/api/register', async (req, res) => {
    try {
        const { email, password, username } = req.body;

        if (!email || !password || !username) {
            return res.status(400).json({
                success: false,
                message: '邮箱、密码和用户名都是必需的'
            });
        }

        // 检查用户是否已存在
        const { data: existingUser } = await supabase
            .from('users')
            .select('id')
            .eq('email', email)
            .single();

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: '用户已存在'
            });
        }

        // 加密密码
        const hashedPassword = await bcrypt.hash(password, 12);

        // 创建用户
        const { data, error } = await supabase
            .from('users')
            .insert([{
                email,
                password: hashedPassword,
                username,
                created_at: new Date().toISOString()
            }])
            .select()
            .single();

        if (error) throw error;

        // 生成JWT令牌
        const token = jwt.sign(
            { userId: data.id, email: data.email },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            success: true,
            message: '注册成功',
            token,
            user: {
                id: data.id,
                email: data.email,
                username: data.username
            }
        });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            success: false,
            message: '注册失败',
            error: error.message
        });
    }
});

// 用户登录
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: '邮箱和密码都是必需的'
            });
        }

        // 查找用户
        const { data: user, error } = await supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .single();

        if (error || !user) {
            return res.status(400).json({
                success: false,
                message: '用户不存在'
            });
        }

        // 验证密码
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(400).json({
                success: false,
                message: '密码错误'
            });
        }

        // 生成JWT令牌
        const token = jwt.sign(
            { userId: user.id, email: user.email },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            success: true,
            message: '登录成功',
            token,
            user: {
                id: user.id,
                email: user.email,
                username: user.username
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: '登录失败',
            error: error.message
        });
    }
});

// AI 占卜接口
app.post('/api/divination', authenticateToken, async (req, res) => {
    try {
        const { question, type = 'general' } = req.body;

        if (!question) {
            return res.status(400).json({
                success: false,
                message: '请输入您的问题'
            });
        }

        // 调用OpenRouter API
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'anthropic/claude-3.5-sonnet',
                messages: [{
                    role: 'user',
                    content: `作为专业的占卜师，请为以下问题进行${type}占卜：${question}`
                }],
                max_tokens: 1000
            })
        });

        const aiResponse = await response.json();

        if (!response.ok) {
            throw new Error(aiResponse.error?.message || 'AI服务暂时不可用');
        }

        const result = aiResponse.choices[0].message.content;

        // 保存占卜记录
        const { error: saveError } = await supabase
            .from('divination_records')
            .insert([{
                user_id: req.user.userId,
                question,
                result,
                type,
                created_at: new Date().toISOString()
            }]);

        if (saveError) {
            console.error('Save record error:', saveError);
        }

        res.json({
            success: true,
            result,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('Divination error:', error);
        res.status(500).json({
            success: false,
            message: '占卜服务暂时不可用',
            error: error.message
        });
    }
});

// 支付相关接口
// 支付相关接口
app.post('/api/stripe/create-payment-intent', authenticateToken, async (req, res) => {
    try {
        const { amount, currency = 'usd' } = req.body;

        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount * 100, // 转换为分
            currency,
            metadata: {
                userId: req.user.userId
            }
        });

        res.json({
            success: true,
            clientSecret: paymentIntent.client_secret
        });

    } catch (error) {
        console.error('Payment intent error:', error);
        res.status(500).json({
            success: false,
            message: '支付初始化失败',
            error: error.message
        });
    }
});

// 创建订阅
app.post('/api/stripe/create-subscription', authenticateToken, async (req, res) => {
    try {
        const { priceId, billingDetails = {} } = req.body;

        if (!priceId) {
            return res.status(400).json({ error: '价格 ID 不能为空' });
        }

        // 获取或创建客户
        let customer;
        const { email, name } = billingDetails;

        // 尝试从用户表中获取 stripe_customer_id
        const { data: user } = await supabase
            .from('users')
            .select('stripe_customer_id, email')
            .eq('id', req.user.userId)
            .single();

        if (user && user.stripe_customer_id) {
            customer = { id: user.stripe_customer_id };
        } else {
            // 创建新客户
            customer = await stripe.customers.create({
                email: email || user?.email || req.user.email,
                name: name || req.user.username,
                metadata: { userId: req.user.userId }
            });

            // 更新用户表
            await supabase
                .from('users')
                .update({ stripe_customer_id: customer.id })
                .eq('id', req.user.userId);
        }

        const subscription = await stripe.subscriptions.create({
            customer: customer.id,
            items: [{ price: priceId }],
            payment_behavior: 'default_incomplete',
            payment_settings: { save_default_payment_method: 'on_subscription' },
            expand: ['latest_invoice.payment_intent'],
            metadata: { userId: req.user.userId }
        });

        res.json({
            subscriptionId: subscription.id,
            clientSecret: subscription.latest_invoice.payment_intent.client_secret
        });
    } catch (error) {
        console.error('Create subscription error:', error);
        res.status(500).json({ error: error.message });
    }
});

// 取消订阅
app.post('/api/stripe/cancel-subscription', authenticateToken, async (req, res) => {
    try {
        const { subscriptionId } = req.body;
        if (!subscriptionId) return res.status(400).json({ error: 'Subscription ID required' });

        const subscription = await stripe.subscriptions.update(subscriptionId, {
            cancel_at_period_end: true
        });

        res.json({ subscription });
    } catch (error) {
        console.error('Cancel subscription error:', error);
        res.status(500).json({ error: error.message });
    }
});

// ============================================
// AI API PROXY
// ============================================

app.post('/api/ai/chat', async (req, res) => {
    console.log('--- AI Request Start (Netlify) ---');
    console.log('Method:', req.method);

    try {
        const apiKey = process.env.OPENROUTER_API_KEY;

        if (!apiKey) {
            console.error('Missing OPENROUTER_API_KEY');
            return res.status(500).json({
                error: 'Server configuration error: Missing API Key'
            });
        }

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 60000); // 60s timeout

        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
                'HTTP-Referer': process.env.FRONTEND_URL || 'https://astredevin.netlify.app',
                'X-Title': 'Destiny AI'
            },
            body: JSON.stringify(req.body),
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        const data = await response.json();

        // Sync OpenRouter status code
        console.log(`OpenRouter Status: ${response.status}`);

        if (!response.ok) {
            console.error('OpenRouter Error Data:', JSON.stringify(data));
        }

        res.status(response.status).json(data);

    } catch (error) {
        console.error('AI API error:', error);
        res.status(500).json({
            error: 'AI service temporarily unavailable',
            details: error.message
        });
    }
});

// ============================================
// 错误处理
// ============================================
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({
        success: false,
        message: '服务器内部错误',
        error: process.env.NODE_ENV === 'development' ? err.message : '服务暂时不可用'
    });
});

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: '接口不存在',
        path: req.path
    });
});

// ============================================
// 导出应用（用于Netlify Functions）
// ============================================
module.exports = app;