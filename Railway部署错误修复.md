# 🚨 Railway "页面偏离轨道" 错误修复

## 问题分析

"哦不！看起来页面偏离轨道了" 这个错误通常表示：
- 应用程序崩溃或无法启动
- 端口配置问题
- 环境变量缺失导致启动失败
- 依赖安装失败

## 🚑 立即修复步骤

### 1. 检查部署状态
在Railway控制台中：
1. 进入你的项目
2. 点击 "Deployments" 标签
3. 查看最新部署的状态（应该显示为失败或错误）

### 2. 查看详细错误日志
1. 点击失败的部署
2. 查看 "Build Logs" 和 "Deploy Logs"
3. 寻找红色的错误信息

### 3. 常见错误和解决方案

#### 错误A: 端口问题
```
Error: listen EADDRINUSE :::3000
或
Application failed to respond
```

**解决方案**: 检查server.js中的端口配置
```javascript
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});
```

#### 错误B: 环境变量问题
```
Cannot read properties of undefined
或
ValidationError: "xxx" is required
```

**解决方案**: 检查必需的环境变量
- NODE_ENV=production
- OPENROUTER_API_KEY
- JWT_SECRET
- STRIPE_SECRET_KEY

#### 错误C: 依赖安装失败
```
npm ERR! peer dep missing
或
Module not found
```

**解决方案**: 检查package.json依赖配置

## 🔧 快速修复方案

### 方案1: 重新配置环境变量

1. **删除所有现有变量**
   - Railway控制台 → Variables
   - 删除所有变量

2. **重新添加核心变量**
   ```
   NODE_ENV = production
   JWT_SECRET = 生成64位随机字符串
   OPENROUTER_API_KEY = sk-or-v1-你的密钥
   ```

3. **测试基本启动**
   - 先只添加这3个变量
   - 等待自动重新部署
   - 如果成功，再添加其他变量

### 方案2: 使用最小测试版本

1. **临时替换文件**
   ```bash
   # 重命名现有文件
   mv package.json package-full.json
   mv package-test.json package.json
   
   # 提交并推送
   git add .
   git commit -m "Fix: use minimal test version"
   git push
   ```

2. **观察部署结果**
   - 最小版本只有基本功能
   - 如果成功启动，说明原版本有特定问题
   - 然后逐步恢复功能

### 方案3: 检查Procfile和railway.json

确保项目根目录有正确配置：

**Procfile**:
```
web: node server.js
```

**railway.json**:
```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "nixpacks"
  },
  "deploy": {
    "startCommand": "npm start",
    "healthcheckPath": "/health"
  }
}
```

## 🎯 分步诊断流程

### 步骤1: 生成新的JWT密钥
```javascript
// 在浏览器控制台运行
const crypto = require('crypto') || window.crypto;
console.log(crypto.randomBytes(64).toString('hex'));
```

### 步骤2: 清理重新部署
1. Railway控制台 → Settings → 删除所有环境变量
2. 重新添加最基本的变量
3. 强制重新部署

### 步骤3: 如果仍然失败
- 考虑重新创建Railway项目
- 使用不同的部署分支
- 检查GitHub仓库是否有问题

## 💡 预防措施

### 本地测试
在推送到GitHub之前，先在本地测试：
```bash
npm install
npm start
```

### 环境变量验证
创建一个 `.env.example` 文件作为模板：
```env
NODE_ENV=production
OPENROUTER_API_KEY=sk-or-v1-your-key-here
JWT_SECRET=your-64-char-secret-here
STRIPE_SECRET_KEY=sk_test_your-key-here
```

## 🆘 如果问题持续

1. **收集错误信息**
   - 复制完整的部署日志
   - 截图错误页面
   - 记录当前环境变量设置

2. **尝试替代方案**
   - 使用Vercel部署
   - 尝试Render平台
   - 回到Heroku

---

**⚡ 立即行动建议**:
1. 先运行最小测试版本确认基础配置
2. 逐步添加环境变量观察哪个导致问题
3. 如果急需解决，考虑使用其他部署平台