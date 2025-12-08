# Supabase API Key 修复指南

## ❌ 问题诊断

测试页面显示错误：
```
❌ 登录失败: Invalid API key
```

**原因**: 当前使用的Supabase API密钥不正确或不完整。

## 🔧 解决方案

### 步骤1: 获取正确的API密钥

1. 访问你的Supabase项目Dashboard：
   ```
   https://supabase.com/dashboard/project/izkcgqvxecfxqtgxpmaj
   ```

2. 点击左侧菜单的 **Settings** (设置图标 ⚙️)

3. 点击 **API**

4. 在 **Project API keys** 部分，找到：
   - **Project URL**: `https://izkcgqvxecfxqtgxpmaj.supabase.co`
   - **anon public**: 这是你需要的密钥（一个很长的JWT token）

5. 复制 **anon public** 密钥（应该以 `eyJ` 开头）

### 步骤2: 更新配置文件

#### 方法A: 更新 .env 文件（推荐）

打开 `.env` 文件，找到这一行：
```env
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_xTJzj4zYlpEUvlM6nJQNFA_mZB93ggy
```

替换为你从Dashboard复制的完整密钥：
```env
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml6a2NncXZ4ZWNmeHF0Z3hwbWFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM1NjI5NzcsImV4cCI6MjA0OTEzODk3N30.你的实际密钥
```

#### 方法B: 直接更新JavaScript文件

如果不使用.env文件，需要更新以下两个文件：

**1. supabase-client.js**
```javascript
const SUPABASE_ANON_KEY = '你从Dashboard复制的完整密钥';
```

**2. supabase-init.js**
```javascript
const SUPABASE_CONFIG = {
    url: 'https://izkcgqvxecfxqtgxpmaj.supabase.co',
    anonKey: '你从Dashboard复制的完整密钥'
};
```

### 步骤3: 验证密钥格式

正确的anon key应该：
- ✅ 以 `eyJ` 开头
- ✅ 包含两个点号 `.`
- ✅ 长度约为200-300个字符
- ✅ 是一个完整的JWT token

错误的格式示例：
- ❌ `sb_publishable_xxx` （这不是完整的JWT）
- ❌ 太短的字符串
- ❌ 不包含点号的字符串

### 步骤4: 重新测试

1. 保存所有修改的文件
2. 刷新浏览器页面（Ctrl+F5 强制刷新）
3. 重新运行测试：
   ```bash
   test-supabase.bat
   ```

## 🔍 如何验证密钥是否正确

### 在浏览器控制台测试

打开浏览器控制台（F12），运行：

```javascript
// 测试连接
const testClient = supabase.createClient(
    'https://izkcgqvxecfxqtgxpmaj.supabase.co',
    '你的anon密钥'
);

// 尝试获取会话
testClient.auth.getSession().then(result => {
    if (result.error) {
        console.error('❌ 密钥错误:', result.error.message);
    } else {
        console.log('✅ 密钥正确！');
    }
});
```

## 📋 完整的配置检查清单

- [ ] 已访问Supabase Dashboard
- [ ] 已找到Settings → API页面
- [ ] 已复制完整的anon public密钥
- [ ] 密钥以`eyJ`开头
- [ ] 已更新.env文件或JavaScript文件
- [ ] 已保存所有文件
- [ ] 已刷新浏览器
- [ ] 测试页面不再显示"Invalid API key"错误

## 🚨 安全提醒

1. **anon key** 是公开密钥，可以在前端使用
2. **service_role key** 是私密密钥，**绝对不要**在前端使用
3. 不要将密钥提交到公开的Git仓库
4. 使用.env文件并将其添加到.gitignore

## 🆘 仍然无法解决？

### 检查项目状态

1. 确认Supabase项目是否处于活跃状态
2. 检查项目是否已暂停（免费计划长期不用会暂停）
3. 确认项目URL是否正确

### 重新生成密钥

如果密钥确实有问题，可以在Dashboard中：
1. Settings → API
2. 点击 **Reset API keys**（谨慎操作！）
3. 重新复制新的密钥

### 创建新项目

如果以上都不行，考虑：
1. 在Supabase创建一个新项目
2. 获取新项目的URL和密钥
3. 更新所有配置文件

## 📞 获取帮助

如果问题持续存在：
1. 检查Supabase状态页面：https://status.supabase.com/
2. 查看Supabase文档：https://supabase.com/docs
3. 访问Supabase Discord社区

---

**更新日期**: 2024-12-07  
**问题**: Invalid API key  
**状态**: 待修复
