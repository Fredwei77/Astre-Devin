# 登录页面安全优化指南

## 关键安全问题

### 1. API密钥泄露
**问题**: `config.js`中硬编码OpenRouter API密钥
```javascript
OPENROUTER_API_KEY: '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'
```

**解决方案**:
- 立即撤销该密钥
- 使用环境变量存储敏感信息
- API调用必须通过后端代理

### 2. 密码明文传输
**问题**: 密码直接发送到API
**解决方案**: 使用SHA-256哈希（已在优化代码中实现）

### 3. 缺少CSRF保护
**问题**: 无跨站请求伪造防护
**解决方案**: 添加CSRF令牌验证（已实现）

### 4. 无速率限制
**问题**: 可被暴力破解
**解决方案**: 客户端+服务端双重速率限制（已实现客户端）

## 后端必须实现的安全措施

```javascript
// 1. 密码加盐哈希（bcrypt）
const bcrypt = require('bcrypt');
const hashedPassword = await bcrypt.hash(password, 10);

// 2. JWT令牌
const jwt = require('jsonwebtoken');
const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '24h' });

// 3. HTTPS强制
app.use((req, res, next) => {
    if (!req.secure) return res.redirect('https://' + req.headers.host + req.url);
    next();
});

// 4. 速率限制
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5
});
app.use('/api/auth/login', limiter);
```

## 立即执行步骤

1. **撤销泄露的API密钥**
2. **删除config.js中的敏感信息**
3. **实现后端API代理**
4. **启用HTTPS**
5. **添加服务端验证**
