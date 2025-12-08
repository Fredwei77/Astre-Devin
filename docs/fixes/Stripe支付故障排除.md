# 🔧 Stripe 支付故障排除指南

## 问题：支付失败 - Failed to fetch

### 可能的原因

1. **服务器未运行**
2. **Stripe SDK 未安装**
3. **Stripe 密钥配置错误**
4. **CORS 问题**
5. **API 路由未正确加载**

---

## 🚀 快速修复

### 方法 1: 运行自动修复脚本（推荐）

```bash
双击运行: fix-stripe-payment.bat
```

这将自动：
- ✅ 检查 Node.js
- ✅ 安装 Stripe SDK
- ✅ 验证配置
- ✅ 重启服务器
- ✅ 运行诊断

### 方法 2: 手动修复

#### 步骤 1: 安装 Stripe SDK

```bash
npm install stripe --save
```

#### 步骤 2: 验证 .env 配置

打开 `.env` 文件，确认包含：

```env
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
```

**注意**: 从 Stripe Dashboard 获取你的实际密钥

#### 步骤 3: 重启服务器

```bash
# 停止现有服务器 (Ctrl+C)
# 然后重新启动
npm start
```

#### 步骤 4: 测试 API

打开测试页面：
```
test-stripe-api.html
```

---

## 🔍 诊断工具

### 工具 1: API 直接测试

```bash
打开: test-stripe-api.html
```

功能：
- 测试服务器连接
- 测试支付 API
- 显示详细错误信息

### 工具 2: 完整诊断

```bash
打开: diagnose-stripe.html
```

功能：
- 检查服务器状态
- 检查 Stripe 路由
- 测试支付意图创建
- 检查配置

---

## 📋 详细排查步骤

### 1. 检查服务器是否运行

**Windows:**
```bash
tasklist | findstr node
```

**如果没有输出**，启动服务器：
```bash
npm start
```

### 2. 检查 Stripe SDK 是否安装

```bash
npm list stripe
```

**如果显示 "empty"**，安装：
```bash
npm install stripe --save
```

### 3. 检查 API 路由

打开浏览器访问：
```
http://localhost:3000/api/health
```

**应该看到**：
```json
{
  "status": "ok",
  "timestamp": "2024-..."
}
```

**如果看到 404**，检查 server.js 是否正确加载了路由。

### 4. 测试 Stripe API

使用 curl 或 Postman 测试：

```bash
curl -X POST http://localhost:3000/api/stripe/create-payment-intent \
  -H "Content-Type: application/json" \
  -d "{\"amount\": 1000, \"currency\": \"usd\"}"
```

**成功响应**：
```json
{
  "clientSecret": "pi_xxx_secret_xxx",
  "paymentIntentId": "pi_xxx"
}
```

**失败响应**：
```json
{
  "error": "错误信息"
}
```

### 5. 检查浏览器控制台

按 F12 打开开发者工具，查看：
- Network 标签：查看请求状态
- Console 标签：查看错误信息

---

## 🐛 常见错误及解决方案

### 错误 1: Failed to fetch

**原因**: 服务器未运行或 CORS 问题

**解决**:
1. 确认服务器正在运行
2. 通过 `http://localhost:3000` 访问，不要直接打开 HTML 文件
3. 检查 server.js 中的 CORS 配置

### 错误 2: Cannot find module 'stripe'

**原因**: Stripe SDK 未安装

**解决**:
```bash
npm install stripe --save
```

### 错误 3: Invalid API Key

**原因**: Stripe 密钥未配置或无效

**解决**:
1. 检查 `.env` 文件中的 `STRIPE_SECRET_KEY`
2. 确认密钥以 `sk_test_` 开头（测试环境）
3. 重启服务器使配置生效

### 错误 4: 404 Not Found

**原因**: API 路由未正确配置

**解决**:
1. 检查 `server.js` 中是否有：
   ```javascript
   const stripeRouter = require('./stripe-api');
   app.use('/api/stripe', stripeRouter);
   ```
2. 确认 `stripe-api.js` 文件存在
3. 重启服务器

### 错误 5: CORS Error

**原因**: 跨域请求被阻止

**解决**:
1. 不要直接打开 HTML 文件（file:// 协议）
2. 通过服务器访问：`http://localhost:3000/test-stripe-payment.html`
3. 或使用 Live Server 扩展

---

## ✅ 验证修复

### 测试清单

- [ ] 服务器正在运行（`npm start`）
- [ ] Stripe SDK 已安装（`npm list stripe`）
- [ ] .env 配置正确
- [ ] 可以访问 `http://localhost:3000/api/health`
- [ ] test-stripe-api.html 测试通过
- [ ] 可以创建支付意图

### 成功标志

当你看到以下内容时，说明修复成功：

1. **test-stripe-api.html** 显示：
   ```
   ✅ 服务器连接成功
   ✅ 支付意图创建成功
   ```

2. **浏览器控制台** 显示：
   ```
   ✅ Stripe 客户端初始化成功
   ✅ Stripe 服务初始化完成
   ```

3. **支付表单** 可以正常显示卡片输入框

---

## 🔄 完整重置流程

如果以上方法都不行，尝试完整重置：

### 步骤 1: 清理

```bash
# 停止服务器
taskkill /F /IM node.exe

# 删除 node_modules
rmdir /s /q node_modules

# 删除 package-lock.json
del package-lock.json
```

### 步骤 2: 重新安装

```bash
# 安装所有依赖
npm install

# 确认 Stripe 已安装
npm list stripe
```

### 步骤 3: 验证配置

```bash
# 检查 .env
type .env | findstr STRIPE
```

### 步骤 4: 启动测试

```bash
# 启动服务器
npm start

# 在另一个终端运行测试
start test-stripe-api.html
```

---

## 📞 获取帮助

如果问题仍然存在：

1. **查看服务器日志**
   - 服务器终端中的错误信息
   - 特别注意 Stripe 相关的错误

2. **查看浏览器控制台**
   - Network 标签中的请求详情
   - Console 标签中的错误信息

3. **运行诊断工具**
   ```bash
   diagnose-stripe.html
   ```

4. **检查 Stripe Dashboard**
   - https://dashboard.stripe.com/test/logs
   - 查看 API 请求日志

---

## 📚 相关文件

- `fix-stripe-payment.bat` - 自动修复脚本
- `test-stripe-api.html` - API 测试工具
- `diagnose-stripe.html` - 诊断工具
- `test-stripe-payment.html` - 完整测试页面
- `stripe-api.js` - 后端 API 路由
- `stripe-client.js` - 前端客户端
- `.env` - 配置文件

---

## ✨ 快速命令参考

```bash
# 安装依赖
npm install

# 安装 Stripe
npm install stripe --save

# 启动服务器
npm start

# 检查进程
tasklist | findstr node

# 停止服务器
taskkill /F /IM node.exe

# 测试 API
curl http://localhost:3000/api/health
```

---

## 🎯 下一步

修复成功后：

1. ✅ 运行 `test-stripe-payment.html` 完整测试
2. ✅ 测试会员订阅功能
3. ✅ 测试商品购买功能
4. ✅ 集成到实际页面

祝你修复顺利！🚀
