# 🚀 Netlify 部署操作指南

## 📋 项目信息

- **项目名称**: 九筮 (Astre-Devin)
- **GitHub 仓库**: https://github.com/Fredwei77/Astre-Devin
- **Netlify 项目**: https://app.netlify.com/projects/astredevin/overview

---

## 🎯 部署步骤（详细版）

### 步骤 1: 访问 Netlify 项目

1. 打开浏览器，访问：
   ```
   https://app.netlify.com/projects/astredevin/overview
   ```

2. 如果还没有登录，请先登录你的 Netlify 账号

---

### 步骤 2: 导入 GitHub 仓库

#### 方式 A: 如果项目已存在（推荐）

1. 在项目页面，点击 **"Site settings"**
2. 找到 **"Build & deploy"** → **"Continuous deployment"**
3. 点击 **"Link repository"**
4. 选择 **GitHub**
5. 授权 Netlify 访问你的 GitHub（如果还没授权）
6. 搜索并选择仓库：`Fredwei77/Astre-Devin`
7. 点击 **"Link repository"**

#### 方式 B: 创建新站点

1. 在 Netlify Dashboard，点击 **"Add new site"**
2. 选择 **"Import an existing project"**
3. 选择 **"Deploy with GitHub"**
4. 授权 Netlify 访问 GitHub
5. 搜索并选择：`Fredwei77/Astre-Devin`
6. 点击仓库进入配置页面

---

### 步骤 3: 配置构建设置

在部署配置页面，填写以下信息：

```
Branch to deploy: main
```

```
Build command: (留空)
或者填写: echo 'Static site - no build required'
```

```
Publish directory: .
```

```
Functions directory: (留空)
```

**说明**：
- 这是一个静态网站，不需要构建步骤
- 发布目录是根目录 `.`，包含所有 HTML/JS/CSS 文件

---

### 步骤 4: 配置环境变量 ⚠️ 重要！

这是最关键的步骤！

#### 4.1 进入环境变量设置

1. 在 Netlify 项目页面，点击 **"Site settings"**
2. 在左侧菜单，点击 **"Environment variables"**
3. 点击 **"Add a variable"** 或 **"Add environment variables"**

#### 4.2 添加 Stripe 配置

**变量 1: Stripe 可发布密钥**

```
Key: VITE_STRIPE_PUBLISHABLE_KEY
Value: pk_test_51SXG0rPyLPASs4oMIUPfLppXKefnEycFKqZ8abmH9c7DqcuOi1RpVxR1d2e3bnM3dDzuj3uvpNFYjeio68hOOMJV008ByjCRw8
```

**获取方式**：
1. 访问 https://dashboard.stripe.com/test/apikeys
2. 复制 "Publishable key"（以 `pk_test_` 开头）

#### 4.3 添加 Supabase 配置

**变量 2: Supabase URL**

```
Key: VITE_SUPABASE_URL
Value: https://izkcgqvxecfxqtgxpmaj.supabase.co
```

**变量 3: Supabase Anon Key**

```
Key: VITE_SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml6a2NncXZ4ZWNmeHF0Z3hwbWFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQwMzMzMzIsImV4cCI6MjA3OTYwOTMzMn0.wQEjV2MKXjSmsWUK14Shcg9QCCjGnbH564BbkrLPYms
```

**获取方式**：
1. 访问 https://supabase.com/dashboard
2. 选择你的项目
3. Settings → API
4. 复制 "Project URL" 和 "anon public" key

#### 4.4 环境变量总结

你应该添加这 3 个环境变量：

| Key | Value | 说明 |
|-----|-------|------|
| `VITE_STRIPE_PUBLISHABLE_KEY` | `pk_test_...` | Stripe 可发布密钥 |
| `VITE_SUPABASE_URL` | `https://...supabase.co` | Supabase 项目 URL |
| `VITE_SUPABASE_ANON_KEY` | `eyJhbGci...` | Supabase 匿名密钥 |

**⚠️ 重要提示**：
- 变量名必须以 `VITE_` 开头（Vite 框架要求）
- 不要有拼写错误
- 不要有多余的空格
- 保存后需要重新部署才能生效

---

### 步骤 5: 部署网站

#### 5.1 触发部署

**方式 A: 自动部署（推荐）**
1. 点击 **"Deploy site"** 按钮
2. Netlify 会自动从 GitHub 拉取代码并部署

**方式 B: 手动触发**
1. 进入 **"Deploys"** 标签
2. 点击 **"Trigger deploy"** → **"Deploy site"**

#### 5.2 等待部署完成

部署过程大约需要 1-3 分钟：

1. **Building**: 正在构建（对于静态站点很快）
2. **Deploying**: 正在部署文件
3. **Published**: 部署完成 ✅

你可以在 **"Deploys"** 页面查看实时日志。

---

### 步骤 6: 验证部署

#### 6.1 访问网站

部署完成后，Netlify 会提供一个 URL：

```
https://astredevin.netlify.app
```

或者类似：
```
https://random-name-123456.netlify.app
```

点击 URL 访问你的网站。

#### 6.2 测试核心功能

打开网站后，测试以下功能：

**基础功能**：
- [ ] 首页正常加载
- [ ] 导航栏显示正常
- [ ] 语言切换（中文/English）正常
- [ ] 页面跳转正常

**用户功能**：
- [ ] 点击"登录/注册"按钮
- [ ] 登录页面正常显示
- [ ] Supabase 认证正常工作

**支付功能**：
- [ ] 访问支付测试页面
- [ ] Stripe 表单正常显示
- [ ] 测试卡片输入框正常

**AI 功能**：
- [ ] 占卜页面正常加载
- [ ] 易经页面正常加载
- [ ] 风水页面正常加载
- ⚠️ AI 功能需要后端服务器（下一步部署）

#### 6.3 检查浏览器控制台

按 `F12` 打开开发者工具，检查：

**Console 标签**：
- ✅ 应该看到：`Stripe 客户端初始化成功`
- ✅ 应该看到：`Supabase 客户端初始化成功`
- ❌ 不应该有红色错误（除了 AI API 相关的，因为后端还没部署）

**Network 标签**：
- 检查所有资源是否正常加载（200 状态码）
- 检查是否有 404 错误

---

## 🔧 高级配置（可选）

### 配置自定义域名

1. 在 Netlify 项目页面，点击 **"Domain settings"**
2. 点击 **"Add custom domain"**
3. 输入你的域名（例如：`www.yourdomain.com`）
4. 按照提示配置 DNS 记录

### 配置 HTTPS

Netlify 自动提供免费的 HTTPS 证书（Let's Encrypt）：
1. 在 **"Domain settings"** 中
2. 找到 **"HTTPS"** 部分
3. 点击 **"Verify DNS configuration"**
4. 等待证书自动配置（通常几分钟）

### 配置部署通知

1. 在 **"Site settings"** → **"Build & deploy"**
2. 找到 **"Deploy notifications"**
3. 添加邮件或 Slack 通知

---

## 🚨 常见问题排查

### 问题 1: 部署失败

**症状**：部署状态显示 "Failed"

**解决方案**：
1. 点击失败的部署，查看日志
2. 检查是否有文件缺失
3. 确认 GitHub 仓库连接正常
4. 尝试重新部署

### 问题 2: 环境变量不生效

**症状**：网站显示 "API key not found" 或类似错误

**解决方案**：
1. 检查环境变量名是否正确（必须以 `VITE_` 开头）
2. 检查是否有拼写错误
3. 保存环境变量后，**必须重新部署**
4. 清除浏览器缓存后重新访问

### 问题 3: 页面 404 错误

**症状**：刷新页面后显示 404

**解决方案**：
1. 检查 `netlify.toml` 文件是否包含重定向规则
2. 确认文件已提交到 Git
3. 重新部署

### 问题 4: Stripe 不工作

**症状**：支付表单不显示或报错

**解决方案**：
1. 检查 `VITE_STRIPE_PUBLISHABLE_KEY` 是否配置
2. 确认密钥以 `pk_test_` 开头（测试模式）
3. 检查浏览器控制台错误信息
4. 访问 https://dashboard.stripe.com/test/logs 查看 API 日志

### 问题 5: Supabase 认证失败

**症状**：无法登录或注册

**解决方案**：
1. 检查 `VITE_SUPABASE_URL` 和 `VITE_SUPABASE_ANON_KEY`
2. 访问 Supabase Dashboard 确认项目状态
3. 检查 Supabase 的 Authentication 设置
4. 确认邮件提供商已配置

---

## 📊 部署状态检查清单

### ✅ 部署前检查
- [x] GitHub 仓库已创建并推送代码
- [x] netlify.toml 配置文件已创建
- [x] .gitignore 已配置（.env 不会被上传）
- [x] 所有敏感信息已移除

### ✅ 部署中检查
- [ ] Netlify 项目已创建/连接
- [ ] GitHub 仓库已连接
- [ ] 构建设置已配置
- [ ] 环境变量已添加（3 个）
- [ ] 首次部署已触发

### ✅ 部署后检查
- [ ] 部署状态显示 "Published"
- [ ] 网站 URL 可访问
- [ ] 首页正常显示
- [ ] 导航功能正常
- [ ] 语言切换正常
- [ ] 浏览器控制台无严重错误
- [ ] Stripe 初始化成功
- [ ] Supabase 初始化成功

---

## 🎯 下一步：部署后端服务器

前端部署完成后，你需要部署后端服务器来支持：
- ✅ AI 功能（占卜、易经、风水）
- ✅ 支付处理
- ✅ 用户管理

**推荐平台**：Railway（免费额度充足，配置简单）

**部署指南**：参考 `BACKEND_DEPLOYMENT_GUIDE.md`

---

## 📞 需要帮助？

### Netlify 官方资源
- 文档：https://docs.netlify.com
- 社区：https://answers.netlify.com
- 状态：https://www.netlifystatus.com

### 项目文档
- [完整部署指南](COMPLETE_DEPLOYMENT_GUIDE.md)
- [后端部署指南](BACKEND_DEPLOYMENT_GUIDE.md)
- [安全审计报告](SECURITY_AUDIT_REPORT.md)
- [GitHub 上传成功](GITHUB_UPLOAD_SUCCESS.md)

---

## 🎉 恭喜！

如果所有检查都通过，你的前端已经成功部署到 Netlify！

**你的网站地址**：
```
https://astredevin.netlify.app
```

现在可以继续部署后端服务器了！🚀

---

**最后更新**: 2024-12-08  
**状态**: ✅ 准备就绪  
**下一步**: 部署后端到 Railway
