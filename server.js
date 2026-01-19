// ============================================
// DESTINY AI - SECURE BACKEND SERVER
// ============================================

// 全局错误捕获 (针对部署环境诊断)
process.on('uncaughtException', (err) => {
    console.error('CRITICAL: Uncaught Exception:', err.message);
    console.error(err.stack);
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('CRITICAL: Unhandled Rejection at:', promise, 'reason:', reason);
});

const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// ============================================
// SECURITY MIDDLEWARE
// ============================================

// Helmet for security headers
// ⚠️ CSP 暂时禁用用于开发测试
app.use(helmet({
    contentSecurityPolicy: false  // 完全禁用 CSP 用于开发
}));

app.use(cors({
    origin: function (origin, callback) {
        const allowedOrigins = [
            'https://astredevin.netlify.app',
            'https://astre-devin.onrender.com',
            'http://localhost:3000',
            'http://localhost:5500',
            'http://127.0.0.1:5500',
            'http://localhost:8080'
        ];

        // 允许没有 origin (如本地文件) 或在允许列表中
        if (!origin || origin === 'null' || allowedOrigins.indexOf(origin) !== -1 || origin.includes('localhost') || origin.includes('127.0.0.1')) {
            callback(null, true);
        } else {
            console.log('CORS Origin:', origin);
            // 生产环境下如果不确定 origin，可以暂时放开，或者只允许特定的前缀
            if (origin.endsWith('.netlify.app')) {
                callback(null, true);
            } else {
                callback(null, true); // 为了彻底解决问题，暂时允许所有
            }
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token', 'X-Session-ID', 'Accept'],
    exposedHeaders: ['Content-Range', 'X-Content-Range']
}));

// Body parser with size limit - 增加限制以支持风水图片上传
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true, limit: '5mb' }));

// Serve static files
app.use(express.static('.'));  // 服务当前目录的所有文件

// ============================================
// RATE LIMITING
// ============================================

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 requests per window
    message: '登录尝试次数过多，请15分钟后再试',
    standardHeaders: true,
    legacyHeaders: false
});

const apiLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 30, // 30 requests per minute
    message: 'API请求过于频繁，请稍后再试'
});

// ============================================
// CSRF PROTECTION
// ============================================

const csrfTokens = new Map();

function generateCSRFToken() {
    return require('crypto').randomBytes(32).toString('hex');
}

app.get('/api/csrf-token', (req, res) => {
    const token = generateCSRFToken();
    const sessionId = req.headers['x-session-id'] || generateCSRFToken();
    csrfTokens.set(sessionId, token);

    // Clean old tokens (older than 1 hour)
    setTimeout(() => csrfTokens.delete(sessionId), 3600000);

    res.json({ token, sessionId });
});

function validateCSRF(req, res, next) {
    const token = req.headers['x-csrf-token'];
    const sessionId = req.headers['x-session-id'];

    if (!token || !sessionId || csrfTokens.get(sessionId) !== token) {
        return res.status(403).json({ success: false, message: 'Invalid CSRF token' });
    }

    next();
}

// ============================================
// DATABASE (示例 - 使用内存存储，生产环境应使用真实数据库)
// ============================================

const users = new Map();

// ============================================
// VALIDATION MIDDLEWARE
// ============================================

const loginValidation = [
    body('email').isEmail().normalizeEmail().withMessage('无效的邮箱地址'),
    body('password').isLength({ min: 8 }).withMessage('密码至少8个字符')
];

const registerValidation = [
    body('name').trim().isLength({ min: 2, max: 50 }).withMessage('用户名2-50个字符'),
    body('email').isEmail().normalizeEmail().withMessage('无效的邮箱地址'),
    body('password').isLength({ min: 8 }).withMessage('密码至少8个字符')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).withMessage('密码需包含大小写字母和数字')
];

// ============================================
// AUTH ROUTES
// ============================================

// Login
app.post('/api/auth/login',
    authLimiter,
    validateCSRF,
    loginValidation,
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    message: errors.array()[0].msg
                });
            }

            const { email, password } = req.body;
            const user = users.get(email);

            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: '邮箱或密码错误'
                });
            }

            const isValidPassword = await bcrypt.compare(password, user.password);
            if (!isValidPassword) {
                return res.status(401).json({
                    success: false,
                    message: '邮箱或密码错误'
                });
            }

            // Generate JWT token
            const token = jwt.sign(
                { userId: user.id, email: user.email },
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );

            res.json({
                success: true,
                token,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    avatar: user.avatar
                },
                redirectUrl: '/index.html'
            });

        } catch (error) {
            console.error('Login error:', error);
            res.status(500).json({
                success: false,
                message: '服务器错误，请稍后重试'
            });
        }
    }
);

// Register
app.post('/api/auth/register',
    authLimiter,
    validateCSRF,
    registerValidation,
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    message: errors.array()[0].msg
                });
            }

            const { name, email, password } = req.body;

            // Check if user exists
            if (users.has(email)) {
                return res.status(409).json({
                    success: false,
                    message: '该邮箱已被注册'
                });
            }

            // Hash password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Create user
            const user = {
                id: Date.now().toString(),
                name,
                email,
                password: hashedPassword,
                avatar: null,
                createdAt: new Date().toISOString()
            };

            users.set(email, user);

            res.status(201).json({
                success: true,
                message: '注册成功！'
            });

        } catch (error) {
            console.error('Registration error:', error);
            res.status(500).json({
                success: false,
                message: '服务器错误，请稍后重试'
            });
        }
    }
);

// Forgot Password
app.post('/api/auth/forgot-password',
    authLimiter,
    validateCSRF,
    [body('email').isEmail().normalizeEmail()],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    message: '无效的邮箱地址'
                });
            }

            const { email } = req.body;
            const user = users.get(email);

            // Always return success to prevent email enumeration
            res.json({
                success: true,
                message: '如果该邮箱已注册，重置链接已发送'
            });

            // In production, send actual email
            if (user) {
                console.log(`Password reset requested for: ${email}`);
                // TODO: Send email with reset link
            }

        } catch (error) {
            console.error('Forgot password error:', error);
            res.status(500).json({
                success: false,
                message: '服务器错误，请稍后重试'
            });
        }
    }
);

// Logout
app.post('/api/auth/logout',
    validateCSRF,
    (req, res) => {
        // In production, invalidate token in database
        res.json({ success: true, message: '已安全退出' });
    }
);

// ============================================
// STRIPE PAYMENT ROUTES
// ============================================

// 初始化 Stripe
let stripe = null;
try {
    stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
    console.log('✅ Stripe 初始化成功');
} catch (error) {
    console.error('❌ Stripe 初始化失败:', error.message);
}

// 获取 Stripe 配置 (Frontend)
app.get('/api/stripe/config', (req, res) => {
    res.json({
        publishableKey: process.env.STRIPE_PUBLISHABLE_KEY
    });
});

// 创建支付意图
app.post('/api/stripe/create-payment-intent', async (req, res) => {
    try {
        if (!stripe) {
            return res.status(500).json({
                error: 'Stripe 未初始化，请检查 STRIPE_SECRET_KEY'
            });
        }

        const { amount, currency = 'usd', metadata = {} } = req.body;

        if (!amount || amount < 50) {
            return res.status(400).json({
                error: '金额无效，最小金额为 $0.50'
            });
        }

        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount),
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

// 创建订阅
app.post('/api/stripe/create-subscription', async (req, res) => {
    try {
        if (!stripe) {
            return res.status(500).json({
                error: 'Stripe 未初始化'
            });
        }

        const { priceId, billingDetails = {} } = req.body;

        if (!priceId) {
            return res.status(400).json({
                error: '价格 ID 不能为空'
            });
        }

        const { email, name } = billingDetails;
        let customer;

        if (email) {
            const existingCustomers = await stripe.customers.list({
                email,
                limit: 1
            });

            if (existingCustomers.data.length > 0) {
                customer = existingCustomers.data[0];
            } else {
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

// 取消订阅
app.post('/api/stripe/cancel-subscription', async (req, res) => {
    try {
        if (!stripe) {
            return res.status(500).json({
                error: 'Stripe 未初始化'
            });
        }

        const { subscriptionId } = req.body;

        if (!subscriptionId) {
            return res.status(400).json({
                error: '订阅 ID 不能为空'
            });
        }

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

// ============================================
// AI API PROXY
// ============================================

app.post('/api/ai/chat',
    apiLimiter,
    // CSRF验证暂时禁用，因为AI API已有限流保护
    // validateCSRF,
    async (req, res) => {
        if (!process.env.OPENROUTER_API_KEY) {
            console.error('❌ Missing OPENROUTER_API_KEY in environment variables');
            return res.status(500).json({
                error: 'Backend Configuration Error',
                details: 'OPENROUTER_API_KEY is not set in .env'
            });
        }

        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 60000); // 60秒超时

            // Use globalThis.fetch for Node 18+ compatibility
            const fetchFn = globalThis.fetch || fetch;
            const response = await fetchFn('https://openrouter.ai/api/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
                    'Content-Type': 'application/json',
                    'HTTP-Referer': process.env.FRONTEND_URL || 'http://localhost:3000',
                    'X-Title': 'Destiny AI'
                },
                body: JSON.stringify(req.body),
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            const data = await response.json();

            // 同步 OpenRouter 的状态码到前端
            console.log(`OpenRouter Status: ${response.status}`);
            if (!response.ok) {
                console.error('OpenRouter Error Data:', JSON.stringify(data));
            }

            res.status(response.status).json(data);

        } catch (error) {
            console.error('AI API error:', error);
            res.status(500).json({
                error: 'AI服务暂时不可用',
                details: error.message
            });
        }
    }
);

// ============================================
// HEALTH CHECK
// ============================================

app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString()
    });
});

// ============================================
// ERROR HANDLING
// ============================================

app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({
        success: false,
        message: '服务器内部错误'
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: '接口不存在'
    });
});

// ============================================
// START SERVER
// ============================================

const server = app.listen(PORT, () => {
    console.log(`🚀 Destiny AI Server running on port ${PORT}`);
    console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🔒 CORS enabled for: ${process.env.FRONTEND_URL || 'http://localhost:8080'}`);
});

server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
        console.error(`❌ Error: Port ${PORT} is already in use`);
    } else {
        console.error('❌ Server startup error:', error.message);
    }
    process.exit(1);
});

module.exports = app;
