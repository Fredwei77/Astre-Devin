# Supabase 快速参考卡

## 🚀 快速开始

### 1. 创建数据库表（必须）
```bash
1. 访问: https://supabase.com/dashboard/project/izkcgqvxecfxqtgxpmaj
2. 点击: SQL Editor → New Query
3. 复制粘贴: supabase-schema.sql 的全部内容
4. 点击: Run
```

### 2. 测试连接
```bash
test-supabase.bat
```

### 3. 集成到页面
```html
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
<script src="supabase-client.js"></script>
<script src="supabase-init.js"></script>
```

## 📝 常用API

### 认证
```javascript
// 注册
await EnhancedAuthService.register(email, password, userData);

// 登录
await EnhancedAuthService.login(email, password);

// 登出
await EnhancedAuthService.logout();

// 获取当前用户
await EnhancedAuthService.getCurrentUser();
```

### 数据操作
```javascript
// 保存占卜记录
await DatabaseService.saveReading(type, inputData, resultData);

// 获取占卜记录
await DatabaseService.getUserReadings(limit, offset);

// 记录使用
await DatabaseService.recordUsage(usageType, metadata);

// 获取订阅
await DatabaseService.getUserSubscription();
```

## 🗄️ 数据库表

| 表名 | 用途 |
|------|------|
| profiles | 用户档案 |
| subscriptions | 订阅管理 |
| readings | 占卜记录 |
| usage_logs | 使用统计 |
| chat_history | 对话历史 |
| user_preferences | 偏好设置 |

## 🔐 环境变量

```env
NEXT_PUBLIC_SUPABASE_URL=https://izkcgqvxecfxqtgxpmaj.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 📂 文件位置

- `supabase-schema.sql` - 数据库结构
- `supabase-client.js` - 客户端封装
- `supabase-init.js` - 初始化脚本
- `test-supabase.html` - 测试页面
- `SUPABASE_SETUP.md` - 详细文档

## ⚡ 快速测试

```bash
# 启动测试
test-supabase.bat

# 测试项目
1. 连接状态 ✓
2. 用户注册 ✓
3. 用户登录 ✓
4. 获取用户 ✓
5. 用户登出 ✓
6. 保存记录 ✓
7. 获取记录 ✓
8. 记录使用 ✓
```

## 🎯 下一步

1. ⚠️ 执行SQL创建表
2. ⚠️ 运行测试验证
3. ⚠️ 集成到登录页面

---
**需要帮助？** 查看 `SUPABASE_SETUP.md`
