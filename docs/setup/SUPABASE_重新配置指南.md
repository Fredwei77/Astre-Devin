# Supabase 重新配置完整指南

## 🎯 目标

解决"Invalid API key"错误，让Supabase正常工作。

## 📋 准备工作

### 选项A: 使用现有项目（推荐）

如果你有Supabase账号并能访问项目：

1. **访问Dashboard**
   ```
   https://supabase.com/dashboard/project/izkcgqvxecfxqtgxpmaj
   ```

2. **登录账号**
   - 使用你的Supabase账号登录
   - 如果忘记密码，点击"Forgot password"

3. **获取API密钥**
   - 点击左侧 **Settings** (⚙️)
   - 点击 **API**
   - 找到 **Project API keys** 部分
   - 复制 **anon public** 密钥

### 选项B: 创建新项目

如果无法访问现有项目，创建新的：

1. **访问Supabase**
   ```
   https://supabase.com
   ```

2. **注册/登录**
   - 使用GitHub账号登录（推荐）
   - 或使用邮箱注册

3. **创建新项目**
   - 点击 "New Project"
   - 填写项目信息：
     - Name: `destiny-ai` 或任意名称
     - Database Password: 设置一个强密码（保存好！）
     - Region: 选择离你最近的区域
   - 点击 "Create new project"
   - 等待项目创建（约2分钟）

4. **获取API密钥**
   - 项目创建完成后
   - 点击 Settings → API
   - 复制 **Project URL** 和 **anon public** 密钥

## 🔧 配置步骤

### 步骤1: 更新环境变量

打开 `.env` 文件，更新以下内容：

```env
# Supabase (数据库和认证)
# 从 Supabase Dashboard → Settings → API 获取
NEXT_PUBLIC_SUPABASE_URL=你的项目URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=你的anon密钥
```

**示例**:
```env
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijk.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprIiwicm9sZSI6ImFub24iLCJpYXQiOjE2MzM1NjI5NzcsImV4cCI6MjA0OTEzODk3N30.你的实际密钥
```

### 步骤2: 更新JavaScript配置

#### 2.1 更新 supabase-client.js

找到第7-9行，更新为：

```javascript
const SUPABASE_URL = '你的项目URL';
const SUPABASE_ANON_KEY = '你的anon密钥';
```

#### 2.2 更新 supabase-init.js

找到第10-13行，更新为：

```javascript
const SUPABASE_CONFIG = {
    url: '你的项目URL',
    anonKey: '你的anon密钥'
};
```

### 步骤3: 创建数据库表

1. **访问SQL Editor**
   - 在Supabase Dashboard中
   - 点击左侧 **SQL Editor**
   - 点击 **New Query**

2. **执行SQL脚本**
   - 打开项目中的 `supabase-schema.sql` 文件
   - 复制全部内容
   - 粘贴到SQL Editor
   - 点击 **Run** 执行

3. **验证表创建**
   - 点击左侧 **Table Editor**
   - 应该看到以下表：
     - profiles
     - subscriptions
     - readings
     - usage_logs
     - chat_history
     - user_preferences

### 步骤4: 测试连接

1. **保存所有文件**

2. **完全关闭浏览器**

3. **重新启动测试**
   ```bash
   test-supabase.bat
   ```

4. **验证结果**
   - ✅ 连接状态应显示"已连接"
   - ✅ 注册功能应该正常工作
   - ✅ 登录功能应该正常工作

## 🔍 验证清单

完成配置后，检查以下项目：

- [ ] 已获取正确的Project URL
- [ ] 已获取正确的anon public密钥
- [ ] 密钥以 `eyJ` 开头
- [ ] 密钥长度超过100个字符
- [ ] 已更新 .env 文件
- [ ] 已更新 supabase-client.js
- [ ] 已更新 supabase-init.js
- [ ] 已执行 supabase-schema.sql
- [ ] 已在Table Editor中看到所有表
- [ ] 已保存所有文件
- [ ] 已完全关闭并重新打开浏览器
- [ ] 测试页面不再显示"Invalid API key"

## 🎨 使用诊断工具

如果手动配置有困难，使用诊断工具：

```bash
diagnose-supabase.bat
```

诊断工具会：
1. 检查当前配置
2. 让你输入新的URL和密钥
3. 测试连接是否成功
4. 自动生成更新代码

## 📝 配置模板

### .env 模板
```env
# Supabase配置
NEXT_PUBLIC_SUPABASE_URL=https://你的项目ID.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.你的完整密钥
```

### supabase-client.js 模板
```javascript
const SUPABASE_URL = 'https://你的项目ID.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.你的完整密钥';
```

### supabase-init.js 模板
```javascript
const SUPABASE_CONFIG = {
    url: 'https://你的项目ID.supabase.co',
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.你的完整密钥'
};
```

## ⚠️ 常见错误

### 错误1: 密钥格式不正确
```
❌ 错误: sb_publishable_xxx
✅ 正确: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.xxx
```

### 错误2: 使用了service_role密钥
```
❌ 不要使用: service_role key (以 eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9 开头但role是service_role)
✅ 应该使用: anon public key (role是anon)
```

### 错误3: URL不正确
```
❌ 错误: http://localhost:54321
✅ 正确: https://你的项目ID.supabase.co
```

## 🆘 需要帮助？

### 如果无法访问Supabase Dashboard

1. **检查账号**
   - 确认你有Supabase账号
   - 尝试重置密码

2. **检查项目权限**
   - 确认你是项目所有者或有权限访问
   - 联系项目创建者

3. **创建新项目**
   - 如果无法访问现有项目
   - 按照"选项B"创建新项目

### 如果密钥仍然无效

1. **重新生成密钥**
   - Settings → API
   - 点击 "Reset API keys"
   - 重新复制密钥

2. **检查项目状态**
   - 确认项目未暂停
   - 确认项目未删除

3. **联系支持**
   - Supabase Discord: https://discord.supabase.com
   - Supabase Support: support@supabase.io

## 📞 快速支持

如果你在配置过程中遇到问题：

1. 截图当前错误信息
2. 确认你完成了哪些步骤
3. 说明卡在哪一步

我会帮你继续配置！

---

**创建日期**: 2024-12-07  
**版本**: 1.0.0  
**状态**: 待配置
