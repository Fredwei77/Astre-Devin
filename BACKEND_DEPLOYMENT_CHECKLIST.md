# ✅ 后端部署检查清单

## 📋 部署前准备

### 1. 代码准备
- [ ] `server.js` 文件存在且完整
- [ ] `package.json` 依赖配置正确
- [ ] `.env.example` 已创建
- [ ] `.gitignore` 包含 `.env`
- [ ] `railway.json` 已创建（Railway）
- [ ] `Procfile` 已创建（Heroku/Render）

### 2. 环境变量准备
- [ ] OpenRouter API Key（新密钥）
- [ ] Stripe Secret Key
- [ ] Stripe Publishable Key
- [ ] Stripe Webhook Secret
- [ ] Supabase URL
- [ ] Supabase Service Key
- [ ] JWT Secret
- [ ] Frontend URL

### 3. 密钥轮换
- [ ] OpenRouter 旧密钥已失效
- [ ] 新 API 密钥已生成
- [ ] 所有密钥已记录在安全位置

---

## 🚂 Railway 部署步骤

### 步骤1: 创建项目
- [ ] 访问 https://railway.app
- [ ] 登录 GitHub 账号
- [ ] 点击 "New Project"
- [ ] 选择 "Deploy from GitHub repo"
- [ ] 选择仓库

### 步骤2: 配置环境变量
- [ ] NODE_ENV = production
- [ ] PORT = 3000
- [ ] FRONTEND_URL = https://astredevin.netlify.app
- [ ] OPENROUTER_API_KEY = (新密钥)
- [ ] STRIPE_SECRET_KEY = (你的密钥)
- [ ] STRIPE_PUBLISHABLE_KEY = (你的密钥)
- [ ] STRIPE_WEBHOOK_SECRET = (你的密钥)
- [ ] SUPABASE_URL = (你的 URL)
- [ ] SUPABASE_SERVICE_KEY = (你的密钥)
- [ ] JWT_SECRET = (生成的密钥)

### 步骤3: 部署
- [ ] 点击 "Deploy"
- [ ] 等待构建完成
- [ ] 检查部署日志
- [ ] 记录生成的 URL

### 步骤4: 验证
- [ ] 访问健康检查端点
- [ ] 测试 AI API 调用
- [ ] 检查 CORS 配置
- [ ] 验证数据库连接

---

## 🎨 Render 部署步骤

### 步骤1: 创建服务
- [ ] 访问 https://render.com
- [ ] 登录 GitHub 账号
- [ ] 点击 "New +" → "Web Service"
- [ ] 连接 GitHub 仓库

### 步骤2: 配置服务
- [ ] Name: destiny-ai-backend
- [ ] Environment: Node
- [ ] Build Command: npm install
- [ ] Start Command: npm start
- [ ] Plan: Free

### 步骤3: 配置环境变量
- [ ] 添加所有必需的环境变量
- [ ] 检查变量名拼写
- [ ] 确认值正确

### 步骤4: 部署
- [ ] 点击 "Create Web Service"
- [ ] 等待部署完成
- [ ] 检查日志
- [ ] 记录 URL

---

## 🧪 部署后测试

### 1. 健康检查
```bash
curl https://your-backend-url/api/health
```
- [ ] 返回 200 状态码
- [ ] 返回 JSON 格式
- [ ] 包含 status: "ok"

### 2. AI API 测试
```bash
curl -X POST https://your-backend-url/api/ai/chat \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"Hello"}]}'
```
- [ ] 返回 AI 响应
- [ ] 无错误信息
- [ ] 响应时间合理

### 3. CORS 测试
在浏览器控制台：
```javascript
fetch('https://your-backend-url/api/health')
  .then(r => r.json())
  .then(console.log)
```
- [ ] 无 CORS 错误
- [ ] 成功获取响应

### 4. 前端集成测试
- [ ] 打开 Netlify 网站
- [ ] 测试 AI 功能
- [ ] 检查控制台无错误
- [ ] 验证功能正常

---

## 🔄 更新前端配置

### 1. 更新 netlify.toml
```toml
[[redirects]]
  from = "/api/*"
  to = "https://your-backend-url/api/:splat"
  status = 200
  force = true
```
- [ ] 替换为实际后端 URL
- [ ] 保存文件

### 2. 提交并部署
```bash
git add netlify.toml
git commit -m "Update backend URL"
git push origin main
```
- [ ] 代码已推送
- [ ] Netlify 自动部署
- [ ] 部署成功

### 3. 验证集成
- [ ] 访问 Netlify 网站
- [ ] 测试 API 调用
- [ ] 检查网络请求
- [ ] 确认后端响应

---

## 📊 监控设置

### Railway 监控
- [ ] 查看 Metrics 标签
- [ ] 设置告警（如果需要）
- [ ] 监控资源使用

### Render 监控
- [ ] 查看 Metrics 标签
- [ ] 检查响应时间
- [ ] 监控错误率

### 日志监控
- [ ] 定期查看日志
- [ ] 关注错误信息
- [ ] 监控 API 调用

---

## 🔒 安全检查

### 环境变量
- [ ] 所有密钥已配置
- [ ] 无密钥泄露
- [ ] .env 未提交到 Git

### API 密钥
- [ ] OpenRouter 新密钥已使用
- [ ] 旧密钥已失效
- [ ] Stripe 密钥正确

### CORS 配置
- [ ] 只允许信任的域名
- [ ] 前端 URL 正确
- [ ] 无安全漏洞

### 速率限制
- [ ] 已启用速率限制
- [ ] 限制合理
- [ ] 防止滥用

---

## 🚨 故障排查

### 部署失败
- [ ] 检查构建日志
- [ ] 验证 package.json
- [ ] 确认 Node 版本
- [ ] 检查依赖安装

### 运行时错误
- [ ] 查看应用日志
- [ ] 检查环境变量
- [ ] 验证 API 密钥
- [ ] 测试数据库连接

### CORS 错误
- [ ] 检查 FRONTEND_URL
- [ ] 验证 CORS 配置
- [ ] 确认请求头
- [ ] 测试不同域名

### API 调用失败
- [ ] 检查 API 密钥
- [ ] 验证请求格式
- [ ] 查看错误日志
- [ ] 测试端点

---

## 📝 部署记录

### 部署信息
- 部署平台: _______________
- 部署时间: _______________
- 后端 URL: _______________
- 部署人员: _______________

### 环境变量
- [ ] 所有变量已配置
- [ ] 变量值已验证
- [ ] 密钥已安全存储

### 测试结果
- [ ] 健康检查通过
- [ ] AI API 测试通过
- [ ] CORS 测试通过
- [ ] 前端集成通过

### 问题记录
- 问题1: _______________
- 解决方案: _______________
- 问题2: _______________
- 解决方案: _______________

---

## ✅ 最终确认

### 部署状态
- [ ] 后端服务器运行正常
- [ ] 所有 API 端点可访问
- [ ] 前端集成成功
- [ ] 监控已设置

### 安全状态
- [ ] 所有密钥已保护
- [ ] 无安全漏洞
- [ ] CORS 配置正确
- [ ] 速率限制启用

### 文档状态
- [ ] 部署文档完整
- [ ] URL 已记录
- [ ] 环境变量已备份
- [ ] 故障排查指南可用

---

## 🎉 部署完成

**后端服务器已成功部署！**

- ✅ 服务器运行正常
- ✅ API 功能完整
- ✅ 前端集成成功
- ✅ 安全措施到位

### 下一步
1. 监控服务器状态
2. 收集用户反馈
3. 优化性能
4. 定期维护

---

**部署日期**: _______________  
**部署人员**: _______________  
**状态**: ⬜ 成功 / ⬜ 失败  
**备注**: _______________
