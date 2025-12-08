# 🚀 Railway 部署完整指南

## 概览
本指南将帮你将 Destiny AI 后端部署到 Railway 平台。

## 前置要求

### 1. 账户准备
- ✅ Railway 账户: https://railway.app
- ✅ GitHub 账户（推荐用于代码同步）

### 2. 本地环境
- ✅ Node.js 18+ 
- ✅ npm 9+
- ✅ Git

## 🔧 快速部署

### 方法一：使用部署脚本（推荐）
```bash
# 运行自动部署脚本
deploy-railway.bat
```

### 方法二：手动部署

#### 1. 安装 Railway CLI
```bash
npm install -g @railway/cli
```

#### 2. 登录 Railway
```bash
railway login
```

#### 3. 初始化项目
```bash
# 在项目根目录运行
railway init
```

#### 4. 部署
```bash
railway up
```

## 📋 环境变量配置

部署完成后，需要在 Railway 控制台配置以下环境变量：

### 🔑 必需变量

```env
# 基础配置
NODE_ENV=production
PORT=3000
FRONTEND_URL=https://astredevin.netlify.app

# OpenRouter AI API
OPENROUTER_API_KEY=sk-or-v1-你的密钥

# Stripe 支付
STRIPE_SECRET_KEY=sk_test_你的密钥
STRIPE_PUBLISHABLE_KEY=pk_test_你的密钥
STRIPE_WEBHOOK_SECRET=whsec_你的密钥

# Supabase 数据库
SUPABASE_URL=https://你的项目.supabase.co
SUPABASE_SERVICE_KEY=你的服务密钥

# JWT 认证
JWT_SECRET=你的JWT密钥
```

### 🔧 配置步骤

1. **访问 Railway 控制台**
   - 打开 https://railway.app/dashboard
   - 选择你的项目

2. **进入变量设置**
   - 点击 "Variables" 标签页
   - 点击 "New Variable"

3. **添加环境变量**
   - 逐一添加上述变量
   - 确保值正确无误

## 🌐 域名设置

### 1. 获取部署URL
- 部署成功后，Railway 会提供一个自动生成的域名
- 格式通常为: `https://你的项目名-production.up.railway.app`

### 2. 自定义域名（可选）
- 在 Railway 控制台的 "Settings" → "Domains"
- 添加你的自定义域名
- 配置 DNS 记录

## 🔗 前后端连接

### 1. 更新前端配置
编辑前端项目的 API 配置文件，将后端 URL 更新为 Railway 域名：

```javascript
// api-config.js
const config = {
    apiUrl: 'https://你的项目名-production.up.railway.app'
};
```

### 2. 重新部署前端
- 将更新后的前端重新部署到 Netlify
- 确保前后端能正常通信

## 🧪 部署验证

### 1. 健康检查
```bash
curl https://你的Railway域名/health
```

### 2. 功能测试
- 访问前端网站
- 测试登录功能
- 测试 AI 占卜功能
- 测试支付功能

## 📊 监控和日志

### 1. 查看日志
```bash
railway logs
```

### 2. 实时监控
- Railway 控制台提供实时监控
- 查看 CPU、内存使用情况
- 监控请求响应时间

## 🔄 持续部署

### 1. GitHub 集成
- 连接 GitHub 仓库
- 启用自动部署
- 每次 push 自动重新部署

### 2. 手动重部署
```bash
railway up
```

## 🛠️ 故障排除

### 常见问题

#### 1. 部署失败
```bash
# 检查构建日志
railway logs --tail

# 检查依赖
npm install
```

#### 2. 环境变量错误
- 确保所有必需变量都已设置
- 检查变量名拼写
- 验证变量值格式

#### 3. 数据库连接失败
- 验证 Supabase 配置
- 检查 IP 白名单设置
- 确认服务密钥权限

#### 4. 跨域问题
- 确保 FRONTEND_URL 正确
- 检查 CORS 配置

### 调试命令
```bash
# 检查服务状态
railway status

# 查看项目信息
railway variables

# 重启服务
railway redeploy
```

## 📈 性能优化

### 1. 缓存配置
- 启用静态文件缓存
- 配置 API 响应缓存

### 2. 数据库优化
- 优化查询语句
- 添加适当索引
- 使用连接池

### 3. 监控告警
- 设置性能告警
- 监控错误率
- 配置自动扩容

## 🎯 下一步

1. **安全加固**
   - 定期更新依赖
   - 配置安全头
   - 启用 HTTPS

2. **备份策略**
   - 数据库定期备份
   - 代码版本管理
   - 配置文件备份

3. **扩展功能**
   - 添加更多 AI 模型
   - 优化用户体验
   - 增强支付功能

## 📞 支持

如果遇到问题，可以：
- 查看 Railway 官方文档
- 联系 Railway 支持团队
- 参考项目现有文档

---

✅ **部署完成检查清单**
- [ ] Railway CLI 已安装
- [ ] 项目已部署
- [ ] 环境变量已配置
- [ ] 域名已设置
- [ ] 前端已更新
- [ ] 功能测试通过
- [ ] 监控已启用