// 超级简化版本 - 用于Railway部署测试
const express = require('express');
const app = express();

// 从环境变量获取端口，Railway会自动设置
const PORT = process.env.PORT || 3000;

// 基础中间件
app.use(express.json());

// 简单的根路由
app.get('/', (req, res) => {
    res.json({
        message: '🚀 Destiny AI Backend is ALIVE!',
        status: 'success',
        timestamp: new Date().toISOString(),
        port: PORT,
        env: process.env.NODE_ENV || 'development'
    });
});

// 健康检查
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        timestamp: new Date().toISOString()
    });
});

// 环境变量检查（不显示敏感信息）
app.get('/env-status', (req, res) => {
    res.json({
        NODE_ENV: !!process.env.NODE_ENV,
        PORT: !!process.env.PORT,
        FRONTEND_URL: !!process.env.FRONTEND_URL,
        envCount: Object.keys(process.env).length
    });
});

// 错误处理
app.use((err, req, res, next) => {
    console.error('Error:', err.message);
    res.status(500).json({ error: 'Server error', message: err.message });
});

// 启动服务器，绑定到所有接口
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🎯 Ultra-Minimal Server started successfully!`);
    console.log(`📍 Port: ${PORT}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`⏰ Started at: ${new Date().toISOString()}`);
    console.log(`🔧 Available routes:`);
    console.log(`   GET / - Basic info`);
    console.log(`   GET /health - Health check`);
    console.log(`   GET /env-status - Environment status`);
});

// 优雅关闭处理
process.on('SIGTERM', () => {
    console.log('Received SIGTERM, shutting down gracefully');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('Received SIGINT, shutting down gracefully');
    process.exit(0);
});

module.exports = app;