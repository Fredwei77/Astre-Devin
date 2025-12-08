# 🚀 完整部署指南 - 前端 + 后端

## 📋 部署概述

九筮项目包含两部分：
1. **前端** - 静态网站（Netlify）
2. **后端** - Node.js 服务器（Railway/Render）

---

## 🎯 部署流程

### 阶段1: 前端部署（Netlify）✅

#### 步骤1: 推送代码到 GitHub
```bash
git init
git add .
git commit -m "Ready for deployment"
git remote add origin https://github.com/your-username/your-repo.git
git push -u origin main
```

#### 步骤2: 连接 Netlify
1. 访问 https://app.netlify.com/projects/astredevin/overview
2. Import from GitHub
3. 选择仓库

#### 步骤3: 配置环境变量
在 Netlify Dashboard → Environment variables:
```
VITE_STRIPE_PUBLISHABLE_KEY = pk_test_your-key
VITE_SUPABASE_URL = https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY = your-anon-key
```

#### 步骤4: 部署
点击 "Deploy site"

**前端 URL**: `https://astredevin.netlify.app`

---

### 阶段2: 后端部署（Railway）⏳

#### 步骤1: 创建 Railway 项目
1. 访问 https://railway.app
2. New Project → Deploy from GitHub
3. 选择同一个仓库

#### 步骤2: 配置环境变量
在 Railway Dashboard → Variables:
```
NODE_ENV = production
PORT = 3000
FRONTEND_URL = https://astredevin.netlify.app
OPENROUTER_API_KEY = sk-or-v1-your-new-key
STRIPE_SECRET_KEY = sk_test_your-key
STRIPE_PUBLISHABLE_KEY = pk_test_your-key
STRIPE_WEBHOOK_SECRET = whsec_your-secret
SUPABASE_URL = https://your-project.supabase.co
SUPABASE_SERVICE_KEY = your-service-key
JWT_SECRET = your-random-secret
```

#### 步骤3: 部署
Railway 自动部署

**后端 URL**: `https://your-app.railway.app`

---

### 阶段3: 连接前后端⏳

#### 步骤1: 更新 netlify.toml
```toml
[[redirects]]
  from = "/api/*"
  to = "https://your-app.railway.app/api/:splat"
  status = 200
  force = true
```

#### 步骤2: 重新部署前端
```bash
git add netlify.toml
git commit -m "Connect backend"
git push origin main
```

Netlify 自动重新部署

---

## 🧪 测试验证

### 1. 前端测试
```
访问: https://astredevin.netlify.app
检查: 
□ 页面正常加载
□ 导航栏正常
□ 语言切换正常
```

### 2. 后端测试
```bash
curl https://your-app.railway.app/api/health
```
预期: `{"status":"ok"}`

### 3. 集成测试
```
访问前端网站
测试 AI 功能
检查控制台无错误
```

---

## 📊 部署状态

### 前端（Netlify）
- [ ] 代码已推送
- [ ] 项目已创建
- [ ] 环境变量已配置
- [ ] 部署成功
- [ ] 网站可访问

### 后端（Railway）
- [ ] 项目已创建
- [ ] 环境变量已配置
- [ ] 部署成功
- [ ] API 可访问
- [ ] 健康检查通过

### 集成
- [ ] netlify.toml 已更新
- [ ] 前端重新部署
- [ ] API 调用成功
- [ ] 功能测试通过

---

## 🔒 安全检查

### 密钥管理
- [x] OpenRouter 旧密钥已移除
- [ ] OpenRouter 新密钥已配置
- [x] Supabase 密钥通过环境变量
- [x] Stripe 密钥通过环境变量
- [ ] JWT Secret 已生成

### 代码安全
- [x] 无密钥泄露
- [x] .env 未提交
- [x] .gitignore 已配置
- [x] 安全头已配置

---

## 📝 快速命令

### 前端部署
```bash
# 使用部署脚本
deploy-to-netlify.bat

# 或手动
git add .
git commit -m "Deploy"
git push origin main
```

### 后端部署
```bash
# 使用部署脚本
deploy-backend.bat

# 或手动
# 在 Railway/Render Dashboard 操作
```

### 测试
```bash
# 前端
start https://astredevin.netlify.app

# 后端健康检查
curl https://your-app.railway.app/api/health

# 本地测试
npm start
```

---

## 🚨 常见问题

### Q: 前端部署成功但功能不工作？
A: 检查环境变量是否配置，特别是 Supabase 和 Stripe 密钥

### Q: 后端部署失败？
A: 
1. 检查 package.json 是否完整
2. 验证环境变量是否正确
3. 查看部署日志

### Q: API 调用 CORS 错误？
A: 
1. 确认 FRONTEND_URL 正确
2. 检查 netlify.toml 重定向配置
3. 验证后端 CORS 设置

### Q: OpenRouter API 调用失败？
A: 
1. 确认新密钥已配置
2. 检查账户余额
3. 验证密钥权限

---

## 📚 相关文档

### 前端部署
- [Netlify 部署指南](NETLIFY_DEPLOYMENT_GUIDE.md)
- [部署总结](DEPLOYMENT_SUMMARY.md)
- [安全审计报告](SECURITY_AUDIT_REPORT.md)

### 后端部署
- [后端部署指南](BACKEND_DEPLOYMENT_GUIDE.md)
- [部署检查清单](BACKEND_DEPLOYMENT_CHECKLIST.md)
- [环境变量示例](.env.example)

### 测试
- [测试总结](TEST_SUMMARY.md)
- [最终测试报告](FINAL_TEST_REPORT.md)

---

## 🎯 部署时间线

### 第1天: 前端部署
- ✅ 安全检查完成
- ✅ 代码推送到 GitHub
- ⏳ Netlify 配置和部署
- ⏳ 环境变量配置
- ⏳ 基础功能测试

### 第2天: 后端部署
- ⏳ 选择部署平台
- ⏳ 配置环境变量
- ⏳ 部署后端服务器
- ⏳ API 测试
- ⏳ 连接前后端

### 第3天: 集成测试
- ⏳ 完整功能测试
- ⏳ 性能测试
- ⏳ 安全测试
- ⏳ 用户验收测试

---

## ✅ 最终检查清单

### 部署前
- [x] 安全审计完成
- [x] 密钥已保护
- [x] 文档已准备
- [ ] 团队已通知

### 部署中
- [ ] 前端部署成功
- [ ] 后端部署成功
- [ ] 环境变量配置
- [ ] 集成测试通过

### 部署后
- [ ] 监控已设置
- [ ] 日志已配置
- [ ] 备份已准备
- [ ] 文档已更新

---

## 🎉 部署完成

### 你的网站
- **前端**: https://astredevin.netlify.app
- **后端**: https://your-app.railway.app
- **状态**: ⏳ 部署中

### 下一步
1. 完成后端部署
2. 测试所有功能
3. 监控系统状态
4. 收集用户反馈

---

## 📞 需要帮助？

### 文档
- 查看相关部署文档
- 阅读常见问题
- 参考检查清单

### 支持
- Netlify: https://docs.netlify.com
- Railway: https://docs.railway.app
- Render: https://render.com/docs

---

**祝部署顺利！** 🚀

---

*最后更新: 2024-12-08*
