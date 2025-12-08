# 📤 GitHub 上传指南

## 📋 仓库信息

- **仓库名称**: Astre-Devin
- **仓库 URL**: https://github.com/Fredwei77/Astre-Devin
- **所有者**: Fredwei77

---

## 🚀 快速上传（推荐）

### 方式1: 使用自动化脚本

```bash
双击运行: upload-to-github.bat
按照提示操作
```

脚本会自动：
1. ✅ 检查 Git 安装
2. ✅ 初始化 Git 仓库
3. ✅ 添加所有文件
4. ✅ 提交更改
5. ✅ 推送到 GitHub

---

## 📝 手动上传步骤

### 步骤1: 检查 Git 安装

```bash
git --version
```

如果未安装，下载：https://git-scm.com/download/win

### 步骤2: 初始化 Git 仓库

```bash
# 在项目根目录打开命令行
cd C:\Users\user\Desktop\Destiny AI

# 初始化 Git
git init
```

### 步骤3: 配置 Git 用户信息（首次使用）

```bash
git config --global user.name "Fredwei77"
git config --global user.email "your-email@example.com"
```

### 步骤4: 添加文件

```bash
# 添加所有文件
git add .

# 查看状态
git status
```

### 步骤5: 提交更改

```bash
git commit -m "Initial commit - Ready for deployment"
```

### 步骤6: 连接远程仓库

```bash
git remote add origin https://github.com/Fredwei77/Astre-Devin.git
```

### 步骤7: 推送到 GitHub

```bash
# 设置主分支
git branch -M main

# 推送（首次推送使用 --force）
git push -u origin main --force
```

---

## 🔐 GitHub 身份验证

### 方式1: Personal Access Token（推荐）

#### 生成 Token

1. 访问 https://github.com/settings/tokens
2. 点击 "Generate new token" → "Generate new token (classic)"
3. 设置：
   - Note: `Astre-Devin Deployment`
   - Expiration: `90 days` 或 `No expiration`
   - Scopes: 勾选 `repo` (所有子选项)
4. 点击 "Generate token"
5. **立即复制 token**（只显示一次！）

#### 使用 Token

推送时输入：
- Username: `Fredwei77`
- Password: `粘贴你的 token`

#### 保存凭据（可选）

```bash
# Windows
git config --global credential.helper wincred

# 下次推送时输入 token，之后会自动保存
```

### 方式2: SSH 密钥

#### 生成 SSH 密钥

```bash
ssh-keygen -t ed25519 -C "your-email@example.com"
```

按 Enter 使用默认位置，设置密码（可选）

#### 添加到 GitHub

1. 复制公钥：
   ```bash
   cat ~/.ssh/id_ed25519.pub
   ```

2. 访问 https://github.com/settings/keys
3. 点击 "New SSH key"
4. 粘贴公钥，保存

#### 使用 SSH URL

```bash
git remote set-url origin git@github.com:Fredwei77/Astre-Devin.git
git push -u origin main
```

### 方式3: GitHub Desktop（最简单）

1. 下载 GitHub Desktop: https://desktop.github.com
2. 登录 GitHub 账号
3. File → Add Local Repository
4. 选择项目文件夹
5. Publish repository

---

## 📊 验证上传

### 1. 检查 GitHub 仓库

访问: https://github.com/Fredwei77/Astre-Devin

确认：
- [ ] 所有文件已上传
- [ ] README.md 显示正常
- [ ] 无敏感信息泄露

### 2. 检查文件数量

应该包含：
- [ ] HTML 文件（约15个）
- [ ] JavaScript 文件（约30个）
- [ ] CSS 文件（约5个）
- [ ] Markdown 文档（约20个）
- [ ] 配置文件（package.json, netlify.toml 等）

### 3. 检查 .gitignore

确认以下文件未上传：
- [ ] .env
- [ ] node_modules/
- [ ] *.log
- [ ] .DS_Store

---

## 🔄 更新代码

### 日常更新流程

```bash
# 1. 修改代码后
git add .

# 2. 提交更改
git commit -m "描述你的更改"

# 3. 推送到 GitHub
git push origin main
```

### 查看状态

```bash
# 查看修改的文件
git status

# 查看提交历史
git log --oneline

# 查看远程仓库
git remote -v
```

---

## 🚨 常见问题

### Q: 推送时要求输入用户名密码？

A: GitHub 已不支持密码认证，需要使用：
1. Personal Access Token
2. SSH 密钥
3. GitHub Desktop

### Q: 推送失败：rejected (non-fast-forward)？

A: 远程仓库有更新，需要先拉取：
```bash
git pull origin main --rebase
git push origin main
```

或强制推送（谨慎使用）：
```bash
git push origin main --force
```

### Q: 文件太大无法推送？

A: GitHub 单文件限制 100MB，需要：
1. 使用 Git LFS
2. 删除大文件
3. 使用 .gitignore 忽略

### Q: 推送很慢？

A: 可能原因：
1. 网络问题 - 使用 VPN
2. 文件太多 - 检查 .gitignore
3. 历史记录太大 - 清理历史

### Q: 如何删除敏感信息？

A: 如果不小心上传了敏感信息：
```bash
# 从历史中删除文件
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch .env" \
  --prune-empty --tag-name-filter cat -- --all

# 强制推送
git push origin main --force
```

---

## 📁 .gitignore 配置

确保 `.gitignore` 包含：

```gitignore
# 环境变量
.env
.env.local
.env.production

# 依赖
node_modules/

# 日志
*.log
logs/

# 操作系统
.DS_Store
Thumbs.db

# IDE
.vscode/
.idea/

# 构建输出
dist/
build/

# 临时文件
*.tmp
tmp/
```

---

## 🔒 安全检查

### 上传前检查

- [ ] .env 文件未包含
- [ ] API 密钥已移除
- [ ] 敏感信息已保护
- [ ] .gitignore 已配置

### 上传后检查

- [ ] 访问 GitHub 仓库
- [ ] 搜索敏感关键词
- [ ] 检查提交历史
- [ ] 验证文件内容

### 搜索敏感信息

在 GitHub 仓库中搜索：
```
sk_
pk_
api_key
secret
password
token
```

如果发现敏感信息，立即：
1. 删除文件或修改内容
2. 轮换密钥
3. 清理 Git 历史

---

## 📊 Git 工作流程图

```
工作目录 → 暂存区 → 本地仓库 → 远程仓库
   ↓         ↓         ↓          ↓
 修改文件   git add   git commit  git push
```

### 常用命令

```bash
# 查看状态
git status

# 添加文件
git add <file>
git add .

# 提交
git commit -m "message"

# 推送
git push origin main

# 拉取
git pull origin main

# 查看日志
git log

# 查看差异
git diff
```

---

## 🎯 下一步

### 上传完成后

1. **验证仓库**
   - [ ] 访问 GitHub 仓库
   - [ ] 检查文件完整性
   - [ ] 确认无敏感信息

2. **连接 Netlify**
   - [ ] 在 Netlify 导入仓库
   - [ ] 配置环境变量
   - [ ] 部署前端

3. **连接 Railway**
   - [ ] 在 Railway 导入仓库
   - [ ] 配置环境变量
   - [ ] 部署后端

---

## 📞 需要帮助？

### Git 文档
- 官方文档: https://git-scm.com/doc
- 中文教程: https://www.liaoxuefeng.com/wiki/896043488029600

### GitHub 文档
- 官方文档: https://docs.github.com
- 身份验证: https://docs.github.com/en/authentication

### 视频教程
- Git 基础: https://www.youtube.com/watch?v=HVsySz-h9r4
- GitHub 使用: https://www.youtube.com/watch?v=nhNq2kIvi9s

---

## ✅ 上传检查清单

### 准备阶段
- [ ] Git 已安装
- [ ] GitHub 账号已登录
- [ ] .gitignore 已配置
- [ ] 敏感信息已移除

### 上传阶段
- [ ] Git 仓库已初始化
- [ ] 文件已添加
- [ ] 更改已提交
- [ ] 远程仓库已配置
- [ ] 代码已推送

### 验证阶段
- [ ] GitHub 仓库可访问
- [ ] 文件完整
- [ ] 无敏感信息
- [ ] README 显示正常

---

**准备好上传了吗？运行 `upload-to-github.bat` 开始！** 🚀

---

*最后更新: 2024-12-08*
