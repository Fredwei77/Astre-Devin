# Supabase 后台数据库设置指南

## 概述

本项目使用Supabase作为后台数据库和认证系统，提供完整的用户管理、数据存储和实时功能。

## 已完成的配置

✅ Supabase项目已创建  
✅ API密钥已配置在.env文件  
✅ 数据库表结构已设计  
✅ 客户端集成代码已完成  

## 快速开始

### 1. 访问Supabase Dashboard

访问你的Supabase项目：
```
https://supabase.com/dashboard/project/izkcgqvxecfxqtgxpmaj
```

### 2. 创建数据库表

在Supabase Dashboard中：

1. 点击左侧菜单的 **SQL Editor**
2. 点击 **New Query**
3. 复制 `supabase-schema.sql` 文件的全部内容
4. 粘贴到SQL编辑器中
5. 点击 **Run** 执行SQL

这将创建以下表：
- `profiles` - 用户档案
- `subscriptions` - 订阅信息
- `readings` - 占卜记录
- `usage_logs` - 使用日志
- `chat_history` - AI对话历史
- `user_preferences` - 用户偏好设置

### 3. 验证表创建

在 **Table Editor** 中检查所有表是否已创建：

```
✓ profiles
✓ subscriptions
✓ readings
✓ usage_logs
✓ chat_history
✓ user_preferences
```

### 4. 配置认证

在 **Authentication** → **Providers** 中：

1. **Email** - 已启用（默认）
2. **Google OAuth** - 可选配置
3. **GitHub OAuth** - 可选配置

#### Email认证设置

- 确认邮件模板：**Authentication** → **Email Templates**
- 自定义邮件内容（可选）
- 设置重定向URL

### 5. 配置存储（可选）

如果需要上传用户头像：

1. 进入 **Storage**
2. 创建新bucket：`avatars`
3. 设置为公开访问
4. 配置RLS策略：

```sql
-- 允许用户上传自己的头像
CREATE POLICY "Users can upload own avatar"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- 允许所有人查看头像
CREATE POLICY "Avatars are publicly accessible"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'avatars');
```

## 集成到前端

### 1. 添加Supabase CDN

在HTML文件的`<head>`标签中添加：

```html
<!-- Supabase Client -->
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
```

### 2. 引入初始化脚本

在HTML文件的`</body>`标签前添加：

```html
<!-- Supabase Integration -->
<script src="supabase-client.js"></script>
<script src="supabase-init.js"></script>
```

### 3. 使用示例

#### 用户注册

```javascript
const result = await EnhancedAuthService.register(
    'user@example.com',
    'password123',
    {
        fullName: '张三',
        phone: '13800138000'
    }
);

if (result.success) {
    console.log('注册成功:', result.user);
} else {
    console.error('注册失败:', result.error);
}
```

#### 用户登录

```javascript
const result = await EnhancedAuthService.login(
    'user@example.com',
    'password123'
);

if (result.success) {
    console.log('登录成功:', result.user);
    // 跳转到主页
    window.location.href = 'index.html';
} else {
    console.error('登录失败:', result.error);
}
```

#### 保存占卜记录

```javascript
const result = await DatabaseService.saveReading(
    'divination',  // 类型：divination, fengshui, iching
    {
        birthDate: '1990-01-01',
        birthTime: '12:00',
        category: 'career'
    },
    {
        personality: ['...'],
        career: ['...'],
        luckyColors: ['gold', 'silver']
    }
);

if (result.success) {
    console.log('保存成功');
}
```

#### 获取用户占卜记录

```javascript
const result = await DatabaseService.getUserReadings(10, 0);

if (result.success) {
    console.log('占卜记录:', result.data);
    result.data.forEach(reading => {
        console.log(reading.type, reading.created_at);
    });
}
```

#### 记录使用次数

```javascript
await DatabaseService.recordUsage('divination', {
    category: 'career',
    duration: 120
});
```

## 数据库表结构

### profiles（用户档案）

| 字段 | 类型 | 说明 |
|------|------|------|
| id | UUID | 用户ID（关联auth.users） |
| email | TEXT | 邮箱 |
| full_name | TEXT | 全名 |
| avatar_url | TEXT | 头像URL |
| phone | TEXT | 电话 |
| birth_date | DATE | 出生日期 |
| birth_time | TIME | 出生时间 |
| birth_place | TEXT | 出生地点 |
| gender | TEXT | 性别 |
| language | TEXT | 语言偏好 |
| timezone | TEXT | 时区 |

### subscriptions（订阅）

| 字段 | 类型 | 说明 |
|------|------|------|
| id | UUID | 订阅ID |
| user_id | UUID | 用户ID |
| plan_type | TEXT | 套餐类型（free/basic/premium/vip） |
| status | TEXT | 状态（active/cancelled/expired/trial） |
| stripe_customer_id | TEXT | Stripe客户ID |
| stripe_subscription_id | TEXT | Stripe订阅ID |
| current_period_end | TIMESTAMP | 当前周期结束时间 |

### readings（占卜记录）

| 字段 | 类型 | 说明 |
|------|------|------|
| id | UUID | 记录ID |
| user_id | UUID | 用户ID |
| type | TEXT | 类型（divination/fengshui/iching） |
| input_data | JSONB | 输入数据 |
| result_data | JSONB | 结果数据 |
| is_favorite | BOOLEAN | 是否收藏 |
| notes | TEXT | 备注 |

### usage_logs（使用日志）

| 字段 | 类型 | 说明 |
|------|------|------|
| id | UUID | 日志ID |
| user_id | UUID | 用户ID |
| usage_type | TEXT | 使用类型 |
| metadata | JSONB | 元数据 |
| created_at | TIMESTAMP | 创建时间 |

## 行级安全策略（RLS）

所有表都启用了RLS，确保：
- ✅ 用户只能访问自己的数据
- ✅ 防止未授权访问
- ✅ 自动过滤查询结果

## 触发器

### 自动创建用户档案

当新用户注册时，自动创建：
- 用户档案（profiles）
- 用户偏好（user_preferences）
- 免费订阅（subscriptions）

### 自动更新时间戳

所有表的`updated_at`字段会自动更新。

## 监听认证状态变化

```javascript
// 监听登录事件
window.addEventListener('supabase:auth:signin', (event) => {
    console.log('用户已登录:', event.detail.user);
    // 更新UI
});

// 监听登出事件
window.addEventListener('supabase:auth:signout', () => {
    console.log('用户已登出');
    // 清理UI，跳转到登录页
});
```

## 环境变量

在`.env`文件中配置：

```env
# Supabase配置
NEXT_PUBLIC_SUPABASE_URL=https://izkcgqvxecfxqtgxpmaj.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 测试数据库连接

创建测试文件 `test-supabase.html`：

```html
<!DOCTYPE html>
<html>
<head>
    <title>Supabase测试</title>
    <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
</head>
<body>
    <h1>Supabase连接测试</h1>
    <button onclick="testConnection()">测试连接</button>
    <div id="result"></div>

    <script src="supabase-client.js"></script>
    <script src="supabase-init.js"></script>
    <script>
        async function testConnection() {
            const result = document.getElementById('result');
            result.innerHTML = '测试中...';

            try {
                const user = await EnhancedAuthService.getCurrentUser();
                if (user) {
                    result.innerHTML = `✅ 连接成功！当前用户: ${user.email}`;
                } else {
                    result.innerHTML = '✅ 连接成功！未登录';
                }
            } catch (error) {
                result.innerHTML = `❌ 连接失败: ${error.message}`;
            }
        }
    </script>
</body>
</html>
```

## 常见问题

### Q: 如何查看数据库中的数据？

A: 在Supabase Dashboard的 **Table Editor** 中可以直接查看和编辑数据。

### Q: 如何备份数据库？

A: 在 **Database** → **Backups** 中可以创建备份。

### Q: 如何重置数据库？

A: 在SQL Editor中执行：
```sql
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
```
然后重新运行 `supabase-schema.sql`。

### Q: RLS策略不生效？

A: 确保：
1. 表已启用RLS：`ALTER TABLE table_name ENABLE ROW LEVEL SECURITY;`
2. 策略已正确创建
3. 使用正确的认证token

### Q: 如何查看API使用情况？

A: 在 **Settings** → **API** → **Usage** 中查看。

## 安全建议

1. ✅ 永远不要在前端代码中暴露`service_role`密钥
2. ✅ 使用RLS保护所有表
3. ✅ 定期更新Supabase客户端库
4. ✅ 启用邮箱验证
5. ✅ 配置合理的密码策略
6. ✅ 监控异常登录活动

## 下一步

1. ✅ 执行SQL创建表结构
2. ✅ 在HTML页面中引入Supabase脚本
3. ✅ 测试用户注册和登录
4. ✅ 集成到现有的auth-service.js
5. ✅ 测试数据保存和读取

## 相关文件

- `supabase-schema.sql` - 数据库表结构
- `supabase-client.js` - Supabase客户端封装
- `supabase-init.js` - 初始化和集成代码
- `.env` - 环境变量配置

## 支持

如有问题，请参考：
- [Supabase官方文档](https://supabase.com/docs)
- [Supabase JavaScript客户端](https://supabase.com/docs/reference/javascript/introduction)
- [Row Level Security指南](https://supabase.com/docs/guides/auth/row-level-security)

---

**创建日期**: 2024-12-07  
**版本**: 1.0.0
