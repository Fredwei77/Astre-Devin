# 🚀 GitHub + Railway 部署方案

## 概览
由于CLI登录问题，我们使用更简单的GitHub集成方式部署到Railway。

## 📋 部署步骤

### 步骤1: 准备GitHub仓库

#### 1.1 创建新仓库
1. 访问 https://github.com/new
2. 仓库名称: `destiny-ai-backend`
3. 设为私有仓库 (推荐)
4. 不要初始化README、.gitignore或license
5. 点击 "Create repository"

#### 1.2 准备项目文件
确保以下文件存在且配置正确：
- ✅ `package.json` - 包含依赖和启动脚本
- ✅ `server.js` - 主服务器文件
- ✅ `railway.json` - Railway配置
- ✅ `.gitignore` - 忽略node_modules等

### 步骤2: 上传代码到GitHub

#### 2.1 初始化Git仓库
```bash
cd "C:\Users\user\Desktop\Destiny AI"
git init
git add .
git commit -m "Initial commit: Destiny AI backend"
```

#### 2.2 连接远程仓库
```bash
git remote add origin https://github.com/你的用户名/destiny-ai-backend.git
git branch -M main
git push -u origin main
```

### 步骤3: 在Railway上部署

#### 3.1 访问Railway
1. 打开 https://railway.app/new
2. 使用GitHub账户登录

#### 3.2 创建新项目
1. 点击 "Deploy from GitHub repo"
2. 如果首次使用，点击 "Configure GitHub App"
3. 选择要连接的GitHub账户
4. 选择仓库权限 (建议选择指定仓库)

#### 3.3 选择仓库
1. 在仓库列表中找到 `destiny-ai-backend`
2. 点击 "Deploy"
3. Railway会自动检测Node.js项目并开始部署

### 步骤4: 配置环境变量

部署开始后，立即配置环境变量：

#### 4.1 进入项目设置
1. 在Railway仪表板中点击你的项目
2. 点击 "Variables" 标签

#### 4.2 添加环境变量
```env
NODE_ENV=production
FRONTEND_URL=https://astredevin.netlify.app
OPENROUTER_API_KEY=sk-or-v1-你的密钥
STRIPE_SECRET_KEY=sk_test_你的密钥
STRIPE_PUBLISHABLE_KEY=pk_test_你的密钥
STRIPE_WEBHOOK_SECRET=whsec_你的密钥
SUPABASE_URL=https://你的项目.supabase.co
SUPABASE_SERVICE_KEY=你的服务密钥
JWT_SECRET=你的64位随机字符串
```

### 步骤5: 监控部署

#### 5.1 查看部署日志
1. 在项目页面点击 "Deployments"
2. 选择最新的部署查看日志
3. 确认没有错误信息

#### 5.2 获取部署域名
1. 部署成功后，在 "Settings" → "Domains" 查看域名
2. 域名格式通常为: `https://项目名-production.up.railway.app`

## 🔄 后续更新部署

### 自动部署
- 每次push到GitHub main分支都会自动触发部署
- 无需手动操作

### 手动重新部署
1. 在Railway项目页面
2. 点击 "Deployments"
3. 点击 "Deploy Latest Commit"

## 🛠️ 故障排除

### 部署失败
1. 检查GitHub仓库是否包含所有必要文件
2. 确认package.json中的启动脚本正确
3. 查看部署日志获取具体错误信息

### 环境变量问题
1. 确认所有必需变量都已添加
2. 检查变量值格式是否正确
3. 变量更新后会自动重新部署

### 域名访问问题
1. 等待部署完全完成 (通常2-5分钟)
2. 检查服务是否正常启动
3. 确认防火墙和安全组配置

## ✅ 部署成功验证

### 检查项目状态
1. Railway项目显示为 "Active"
2. 域名可以正常访问
3. 访问 `/health` 端点返回成功

### 更新前端配置
1. 编辑前端项目的 `api-config.js`
2. 更新API URL为Railway域名
3. 重新部署前端到Netlify

## 💡 优势

### GitHub集成的好处
- ✅ 无需处理CLI登录问题
- ✅ 自动持续部署
- ✅ 版本控制和回滚
- ✅ 团队协作更方便
- ✅ 部署历史记录

### 安全性
- ✅ 私有仓库保护代码
- ✅ 环境变量安全存储
- ✅ HTTPS自动配置

---

## 🎯 下一步

1. **创建GitHub仓库** - 按步骤1操作
2. **上传代码** - 按步骤2操作  
3. **Railway部署** - 按步骤3操作
4. **配置变量** - 按步骤4操作
5. **验证部署** - 按步骤5操作

需要帮助完成任何步骤，请随时告诉我！