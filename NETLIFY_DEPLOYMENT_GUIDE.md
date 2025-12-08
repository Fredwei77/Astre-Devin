# 🚀 Netlify 部署指南

## 📋 部署前检查

### ✅ 安全检查已完成
- ✅ OpenRouter API 密钥已移除
- ✅ Supabase 密钥已配置为环境变量
- ✅ Stripe 密钥已配置为环境变量
- ✅ 所有敏感信息已保护

---

## 🔧 部署步骤

### 1. 准备 Git 仓库

```bash
# 初始化 Git（如果还没有）
git init

# 添加所有文件
git add .

# 提交
git commit -m "Ready for Netlify deployment - Security fixes applied"

# 推送到 GitHub
git remote add origin https://github.com/your-username/your-repo.git
git push -u origin main
```

### 2. 连接到 Netlify

1. 登录 Netlify: https://app.netlify.com
2. 点击 "Add new site" → "Import an existing project"
3. 选择 "GitHub" 并授权
4. 选择你的仓库

### 3. 配置构建设置

在 Netlify 部署配置中：

```
Build command: (留空或填 echo 'Static site')
Publish directory: .
```

### 4. 配置环境变量 ⚠️ 重要！

在 Netlify Dashboard → Site settings → Environment variables 中添加：

#### Stripe 配置
```
VITE_STRIPE_PUBLISHABLE_KEY = pk_test_your_publishable_key_here
```
**注意**: 从 Stripe Dashboard 获取你的实际可发布密钥

#### Supabase 配置
```
VITE_SUPABASE_URL = https://izkcgqvxecfxqtgxpmaj.supabase.co
VITE_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml6a2NncXZ4ZWNmeHF0Z3hwbWFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQwMzMzMzIsImV4cCI6MjA3OTYwOTMzMn0.wQEjV2MKXjSmsWUK14Shcg9QCCjGnbH564BbkrLPYms
```

⚠️ **注意**: Supabase Anon Key 是公开的，设计上就是要在前端使用的，但仍建议通过环境变量管理。

### 5. 部署

点击 "Deploy site" 按钮，Netlify 会自动：
1. 克隆你的仓库
2. 应用环境变量
3. 部署静态文件
4. 生成 URL

---

## 🔒 安全最佳实践

### 已实施的安全措施

1. **API 密钥保护**
   - ✅ OpenRouter API 密钥已移除
   - ✅ 使用后端代理访问 AI API
   - ✅ 前端不存储私密密钥

2. **环境变量**
   - ✅ 敏感配置通过环境变量管理
   - ✅ 不在代码中硬编码密钥
   - ✅ .gitignore 已配置

3. **安全头**
   - ✅ netlify.toml 中配置了安全头
   - ✅ 防止 XSS 攻击
   - ✅ 防止点击劫持

### 需要注意的密钥类型

#### ✅ 可以在前端使用（公开密钥）
- Stripe Publishable Key (`pk_test_` 或 `pk_live_`)
- Supabase Anon Key
- Google Maps API Key（如果有）

#### ❌ 绝对不能在前端使用（私密密钥）
- Stripe Secret Key (`sk_test_` 或 `sk_live_`)
- OpenRouter API Key (`sk-or-v1-`)
- Supabase Service Role Key
- 任何 `SECRET` 或 `PRIVATE` 标记的密钥

---

## 🌐 后端服务器配置

### 如果需要后端功能

你的项目需要后端服务器来：
1. 处理 AI API 调用（OpenRouter）
2. 处理支付（Stripe）
3. 管理用户认证

#### 选项1: 部署到 Heroku/Railway/Render

```bash
# 部署 server.js 到后端平台
# 配置环境变量：
OPENROUTER_API_KEY=sk-or-v1-your-key
STRIPE_SECRET_KEY=sk_test_your-key
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-service-key
```

#### 选项2: 使用 Netlify Functions

创建 `netlify/functions/ai-proxy.js`:

```javascript
exports.handler = async (event) => {
  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: event.body
  });
  
  return {
    statusCode: 200,
    body: await response.text()
  };
};
```

然后更新 `netlify.toml`:

```toml
[[redirects]]
  from = "/api/ai/*"
  to = "/.netlify/functions/ai-proxy"
  status = 200
```

---

## 📊 部署后验证

### 1. 检查网站访问
```
访问: https://your-site.netlify.app
检查: 所有页面正常加载
```

### 2. 测试核心功能
```
□ 页面导航正常
□ 语言切换正常
□ 用户登录/注册
□ 支付测试页面
```

### 3. 检查控制台
```
F12 → Console
确认: 无严重错误
```

### 4. 测试响应式
```
□ 桌面端显示正常
□ 平板端显示正常
□ 移动端显示正常
```

---

## 🔄 更新部署

### 自动部署
每次推送到 GitHub 主分支，Netlify 会自动重新部署：

```bash
git add .
git commit -m "Update feature"
git push origin main
```

### 手动部署
在 Netlify Dashboard → Deploys → Trigger deploy

---

## ⚠️ 常见问题

### Q: 环境变量不生效？
A: 
1. 检查变量名是否正确（必须以 `VITE_` 开头）
2. 重新部署网站
3. 清除浏览器缓存

### Q: API 调用失败？
A:
1. 检查后端服务器是否运行
2. 检查 CORS 配置
3. 检查 API 密钥是否正确

### Q: 支付功能不工作？
A:
1. 确认 Stripe 密钥已配置
2. 检查是否使用测试模式
3. 查看浏览器控制台错误

---

## 📞 技术支持

### 问题排查步骤
1. 检查 Netlify 部署日志
2. 检查浏览器控制台
3. 检查环境变量配置
4. 查看 Netlify Functions 日志

### 有用的链接
- Netlify 文档: https://docs.netlify.com
- Netlify 环境变量: https://docs.netlify.com/environment-variables/overview/
- Netlify Functions: https://docs.netlify.com/functions/overview/

---

## ✅ 部署检查清单

### 部署前
- [x] 安全扫描完成
- [x] 密钥已移除/保护
- [x] .gitignore 已配置
- [x] netlify.toml 已创建
- [ ] Git 仓库已推送

### 部署中
- [ ] Netlify 项目已创建
- [ ] 环境变量已配置
- [ ] 构建设置已配置
- [ ] 首次部署成功

### 部署后
- [ ] 网站可访问
- [ ] 核心功能测试
- [ ] 响应式测试
- [ ] 性能检查

---

## 🎉 完成！

部署完成后，你的网站将在：
```
https://your-site-name.netlify.app
```

或者你可以配置自定义域名。

---

**祝部署顺利！** 🚀

如有问题，请查看 Netlify 部署日志或联系技术支持。
