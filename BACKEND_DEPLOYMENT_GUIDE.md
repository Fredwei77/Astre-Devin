# 🚀 后端服务器部署指南

## 📋 概述

后端服务器用于：
- 处理 AI API 调用（OpenRouter）
- 处理支付（Stripe）
- 用户认证和授权
- 数据库操作（Supabase）

---

## 🎯 推荐部署平台

### 1. Railway (推荐) ⭐⭐⭐⭐⭐
- ✅ 免费额度充足
- ✅ 自动部署
- ✅ 简单易用
- ✅ 支持环境变量

### 2. Render ⭐⭐⭐⭐
- ✅ 免费层可用
- ✅ 自动 HTTPS
- ✅ 持续部署

### 3. Heroku ⭐⭐⭐
- ⚠️ 免费层已取消
- ✅ 成熟稳定
- ✅ 丰富插件

---

## 🚂 方案1: Railway 部署（推荐）

### 步骤1: 准备代码

确保你的项目根目录有以下文件：
- ✅ `server.js` - 后端服务器
- ✅ `package.json` - 依赖配置
- ✅ `.env.example` - 环境变量示例

### 步骤2: 创建 Railway 项目

1. 访问 https://railway.app
2. 使用 GitHub 账号登录
3. 点击 "New Project"
4. 选择 "Deploy from GitHub repo"
5. 选择你的仓库

### 步骤3: 配置环境变量

在 Railway Dashboard → Variables 中添加：

```env
# Node 环境
NODE_ENV=production
PORT=3000

# 前端 URL（你的 Netlify 网站）
FRONTEND_URL=https://astredevin.netlify.app

# OpenRouter AI API
OPENROUTER_API_KEY=sk-or-v1-your-new-key-here

# Stripe 支付
STRIPE_SECRET_KEY=sk_test_your-stripe-secret-key
STRIPE_PUBLISHABLE_KEY=pk_test_your-stripe-publishable-key
STRIPE_WEBHOOK_SECRET=whsec_your-webhook-secret

# Supabase 数据库
SUPABASE_URL=https://izkcgqvxecfxqtgxpmaj.supabase.co
SUPABASE_SERVICE_KEY=your-supabase-service-key

# JWT 密钥
JWT_SECRET=your-random-jwt-secret-key-here
```

### 步骤4: 部署

Railway 会自动：
1. 检测 Node.js 项目
2. 安装依赖 (`npm install`)
3. 启动服务器 (`npm start`)
4. 生成公开 URL

### 步骤5: 获取后端 URL

部署成功后，Railway 会提供一个 URL，例如：
```
https://your-app.railway.app
```

### 步骤6: 更新前端配置

在 Netlify 的 `netlify.toml` 中更新后端 URL：

```toml
[[redirects]]
  from = "/api/*"
  to = "https://your-app.railway.app/api/:splat"
  status = 200
  force = true
```

---

## 🎨 方案2: Render 部署

### 步骤1: 创建 Render 账号

1. 访问 https://render.com
2. 使用 GitHub 账号登录

### 步骤2: 创建 Web Service

1. 点击 "New +" → "Web Service"
2. 连接 GitHub 仓库
3. 配置：
   ```
   Name: destiny-ai-backend
   Environment: Node
   Build Command: npm install
   Start Command: npm start
   ```

### 步骤3: 配置环境变量

在 Environment 标签中添加所有环境变量（同 Railway）

### 步骤4: 部署

点击 "Create Web Service"，Render 会自动部署

---

## 💻 方案3: 本地开发 + Ngrok

### 适用场景
- 快速测试
- 开发调试
- 临时演示

### 步骤1: 安装 Ngrok

```bash
# Windows
choco install ngrok

# 或下载: https://ngrok.com/download
```

### 步骤2: 启动本地服务器

```bash
npm install
npm start
```

### 步骤3: 创建公开隧道

```bash
ngrok http 3000
```

Ngrok 会提供一个公开 URL：
```
https://abc123.ngrok.io
```

### 步骤4: 更新前端配置

使用 Ngrok URL 作为后端地址

⚠️ **注意**: Ngrok 免费版 URL 会变化，不适合生产环境

---

## 📝 环境变量详解

### 必需的环境变量

#### 1. OpenRouter API Key
```env
OPENROUTER_API_KEY=sk-or-v1-your-key
```

**获取方式**:
1. 访问 https://openrouter.ai
2. 登录账号
3. API Keys → Create new key
4. ⚠️ **重要**: 使用新密钥替换已泄露的旧密钥

#### 2. Stripe Keys
```env
STRIPE_SECRET_KEY=sk_test_your-key
STRIPE_PUBLISHABLE_KEY=pk_test_your-key
STRIPE_WEBHOOK_SECRET=whsec_your-secret
```

**获取方式**:
1. 访问 https://dashboard.stripe.com
2. Developers → API keys
3. 复制 Secret key 和 Publishable key
4. Webhooks → Add endpoint → 获取 Webhook secret

#### 3. Supabase Keys
```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-service-key
```

**获取方式**:
1. 访问 https://supabase.com/dashboard
2. Settings → API
3. 复制 URL 和 service_role key

#### 4. JWT Secret
```env
JWT_SECRET=your-random-secret-key
```

**生成方式**:
```bash
# 使用 Node.js
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# 或使用在线工具
https://randomkeygen.com/
```

#### 5. Frontend URL
```env
FRONTEND_URL=https://astredevin.netlify.app
```

用于 CORS 配置，允许前端访问后端 API

---

## 🔧 后端代码优化

### 更新 CORS 配置

编辑 `server.js`，更新 CORS 设置：

```javascript
app.use(cors({
    origin: [
        process.env.FRONTEND_URL,
        'https://astredevin.netlify.app',
        'http://localhost:8080' // 开发环境
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token']
}));
```

### 添加健康检查端点

确保 `server.js` 有健康检查：

```javascript
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV
    });
});
```

---

## 🧪 测试后端部署

### 1. 健康检查

```bash
curl https://your-backend-url.railway.app/api/health
```

预期响应：
```json
{
  "status": "ok",
  "timestamp": "2024-12-08T...",
  "environment": "production"
}
```

### 2. AI API 测试

```bash
curl -X POST https://your-backend-url.railway.app/api/ai/chat \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [{"role": "user", "content": "Hello"}],
    "model": "deepseek/deepseek-chat"
  }'
```

### 3. 前端集成测试

在浏览器控制台：

```javascript
fetch('https://your-backend-url.railway.app/api/health')
  .then(r => r.json())
  .then(console.log)
```

---

## 🔄 更新前端配置

### 1. 更新 Netlify 重定向

编辑 `netlify.toml`:

```toml
[[redirects]]
  from = "/api/*"
  to = "https://your-backend-url.railway.app/api/:splat"
  status = 200
  force = true
```

### 2. 重新部署 Netlify

```bash
git add netlify.toml
git commit -m "Update backend URL"
git push origin main
```

Netlify 会自动重新部署

---

## 📊 监控和日志

### Railway 日志

1. Railway Dashboard → 你的项目
2. Deployments → 选择部署
3. 查看实时日志

### Render 日志

1. Render Dashboard → 你的服务
2. Logs 标签
3. 查看实时日志

### 常见日志

```
✅ Server running on port 3000
✅ Stripe initialized
✅ Database connected
❌ OpenRouter API error: Invalid key
```

---

## 🚨 常见问题

### Q: 部署后 502 Bad Gateway？

A: 检查：
1. 环境变量是否正确配置
2. PORT 变量是否设置
3. 依赖是否正确安装
4. 查看部署日志

### Q: CORS 错误？

A: 确保：
1. FRONTEND_URL 正确配置
2. CORS 配置包含你的 Netlify URL
3. 请求头正确

### Q: OpenRouter API 调用失败？

A: 检查：
1. OPENROUTER_API_KEY 是否正确
2. 密钥是否有效（未过期）
3. 账户余额是否充足

### Q: 数据库连接失败？

A: 验证：
1. SUPABASE_URL 正确
2. SUPABASE_SERVICE_KEY 有效
3. 网络连接正常

---

## 🔒 安全最佳实践

### 1. 环境变量
- ✅ 所有密钥通过环境变量配置
- ✅ 不在代码中硬编码
- ✅ 不提交到 Git

### 2. API 密钥
- ✅ 定期轮换密钥
- ✅ 使用最小权限原则
- ✅ 监控 API 使用情况

### 3. 速率限制
- ✅ 已配置 express-rate-limit
- ✅ 防止 API 滥用
- ✅ 保护服务器资源

### 4. 日志监控
- ✅ 记录所有 API 调用
- ✅ 监控错误率
- ✅ 设置告警

---

## 📋 部署检查清单

### 部署前
- [ ] 代码已推送到 GitHub
- [ ] package.json 依赖完整
- [ ] .env.example 已创建
- [ ] server.js 已优化

### 部署中
- [ ] 平台账号已创建
- [ ] 项目已创建
- [ ] 环境变量已配置
- [ ] 首次部署成功

### 部署后
- [ ] 健康检查通过
- [ ] API 测试通过
- [ ] 前端集成成功
- [ ] 日志监控正常

---

## 🎯 下一步

### 1. 立即执行
- [ ] 选择部署平台（推荐 Railway）
- [ ] 配置环境变量
- [ ] 部署后端服务器
- [ ] 更新前端配置

### 2. 优化改进
- [ ] 配置自动部署
- [ ] 设置监控告警
- [ ] 优化性能
- [ ] 添加日志分析

### 3. 持续维护
- [ ] 定期更新依赖
- [ ] 监控服务状态
- [ ] 优化 API 性能
- [ ] 收集用户反馈

---

## 📞 技术支持

### Railway
- 文档: https://docs.railway.app
- 社区: https://discord.gg/railway

### Render
- 文档: https://render.com/docs
- 支持: https://render.com/support

### 问题排查
1. 查看部署日志
2. 检查环境变量
3. 测试 API 端点
4. 查看错误信息

---

**祝部署顺利！** 🚀

如有问题，请查看日志或联系技术支持。
