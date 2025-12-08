// ============================================
// 最小测试版本 - 用于诊断Railway部署问题
// ============================================

const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// 基础中间件
app.use(express.json());

// 健康检查端点
app.get('/', (req, res) => {
    res.json({ 
        message: 'Destiny AI Backend is running!',
        timestamp: new Date().toISOString(),
        port: PORT,
        env: process.env.NODE_ENV || 'development'
    });
});

app.get('/health', (req, res) => {
    res.json({ 
        status: 'ok',
        uptime: process.uptime(),
        timestamp: new Date().toISOString()
    });
});

// 环境变量检查端点
app.get('/env-check', (req, res) => {
    const envStatus = {
        NODE_ENV: !!process.env.NODE_ENV,
        PORT: !!process.env.PORT,
        OPENROUTER_API_KEY: !!process.env.OPENROUTER_API_KEY,
        JWT_SECRET: !!process.env.JWT_SECRET,
        STRIPE_SECRET_KEY: !!process.env.STRIPE_SECRET_KEY,
        FRONTEND_URL: !!process.env.FRONTEND_URL
    };
    
    res.json({
        status: 'Environment Variables Check',
        variables: envStatus,
        allSet: Object.values(envStatus).every(Boolean)
    });
});

// 简单的API测试端点
app.get('/api/test', (req, res) => {
    res.json({
        success: true,
        message: 'API is working correctly',
        timestamp: new Date().toISOString()
    });
});

// 错误处理
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ 
        error: 'Internal server error',
        message: err.message 
    });
});

// 404处理
app.use((req, res) => {
    res.status(404).json({ 
        error: 'Not found',
        path: req.path 
    });
});

// 启动服务器
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Test Server running on port ${PORT}`);
    console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`⏰ Started at: ${new Date().toISOString()}`);
    
    // 输出环境变量状态
    console.log('🔧 Environment Variables:');
    console.log(`   NODE_ENV: ${process.env.NODE_ENV ? '✅' : '❌'}`);
    console.log(`   OPENROUTER_API_KEY: ${process.env.OPENROUTER_API_KEY ? '✅' : '❌'}`);
    console.log(`   JWT_SECRET: ${process.env.JWT_SECRET ? '✅' : '❌'}`);
    console.log(`   STRIPE_SECRET_KEY: ${process.env.STRIPE_SECRET_KEY ? '✅' : '❌'}`);
    console.log(`   FRONTEND_URL: ${process.env.FRONTEND_URL ? '✅' : '❌'}`);
});

module.exports = app;