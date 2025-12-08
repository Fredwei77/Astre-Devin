# 🚀 Destiny AI 部署检查清单

## ⚠️ 紧急安全措施（立即执行）

- [ ] **撤销泄露的 API 密钥**
  - 访问 [OpenRouter Dashboard](https://openrouter.ai/keys)
  - 撤销密钥: `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`
  - 生成新密钥并保存到 `.env` 文件

- [ ] **删除敏感信息**
  - 已从 `config.js` 移除 API 密钥 ✓
  - 检查所有文件确保无硬编码密钥
  - 添加 `.env` 到 `.gitignore`

## 📋 部署前准备

### 1. 环境配置

- [ ] 复制 `.env.example` 为 `.env`
- [ ] 配置所有必需的环境变量：
  ```bash
  NODE_ENV=production
  PORT=3000
  FRONTEND_URL=https://yourdomain.com
  JWT_SECRET=<生成的随机密钥>
  SESSION_SECRET=<生成的随机密钥>
  OPENROUTER_API_KEY=<新的API密钥>
  ```

### 2. 依赖安装

- [ ] 安装 Node.js (v18+)
- [ ] 运行 `npm install`
- [ ] 运行 `npm audit fix` 修复安全漏洞

### 3. 代码更新

- [ ] 备份原文件已完成 ✓
  - `login.js.backup`
  - `login.html.backup`
  - `login.css.backup`

- [ ] 更新文件：
  - [ ] `login.js` - 应用优化代码
  - [ ] `login.html` - 添加 ARIA 标签
  - [ ] `config.js` - 移除敏感信息 ✓

### 4. 测试

- [ ] 运行单元测试: `npm test`
- [ ] 访问 `test-login.html` 运行功能测试
- [ ] 手动测试登录流程
- [ ] 测试注册流程
- [ ] 测试密码重置
- [ ] 测试速率限制
- [ ] 测试 CSRF 保护

## 🔒 安全配置

### SSL/TLS 证书

- [ ] 获取 SSL 证书（Let's Encrypt 或商业证书）
- [ ] 配置 HTTPS
- [ ] 强制 HTTP 重定向到 HTTPS
- [ ] 配置 HSTS 头

### 防火墙规则

- [ ] 只开放必要端口（80, 443）
- [ ] 配置 fail2ban 防止暴力破解
- [ ] 限制 SSH 访问

### 数据库安全

- [ ] 使用强密码
- [ ] 限制数据库访问 IP
- [ ] 启用数据库加密
- [ ] 配置定期备份

## 🚀 服务器部署

### 选项 A: 使用 PM2

```bash
# 安装 PM2
npm install -g pm2

# 启动应用
pm2 start server.js --name destiny-ai -i max

# 设置开机自启
pm2 startup
pm2 save

# 配置日志轮转
pm2 install pm2-logrotate
```

- [ ] PM2 已安装
- [ ] 应用已启动
- [ ] 开机自启已配置
- [ ] 日志轮转已配置

### 选项 B: 使用 Docker

```bash
# 构建镜像
docker build -t destiny-ai:latest .

# 运行容器
docker run -d \
  --name destiny-ai \
  -p 3000:3000 \
  --env-file .env \
  --restart unless-stopped \
  destiny-ai:latest
```

- [ ] Docker 镜像已构建
- [ ] 容器已运行
- [ ] 自动重启已配置

### 选项 C: 使用 Systemd

创建 `/etc/systemd/system/destiny-ai.service`:

```ini
[Unit]
Description=Destiny AI Server
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/var/www/destiny-ai
ExecStart=/usr/bin/node server.js
Restart=on-failure
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl enable destiny-ai
sudo systemctl start destiny-ai
```

- [ ] Systemd 服务已创建
- [ ] 服务已启用
- [ ] 服务已启动

## 🌐 Nginx 配置

创建 `/etc/nginx/sites-available/destiny-ai`:

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
    
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Rate limiting
    limit_req_zone $binary_remote_addr zone=login:10m rate=5r/m;
    location /api/auth/login {
        limit_req zone=login burst=3 nodelay;
        proxy_pass http://localhost:3000;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/destiny-ai /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

- [ ] Nginx 配置已创建
- [ ] SSL 证书已配置
- [ ] 安全头已添加
- [ ] 速率限制已配置
- [ ] Nginx 已重载

## 📊 监控和日志

### 应用监控

- [ ] 配置 PM2 监控或其他 APM 工具
- [ ] 设置错误告警
- [ ] 配置性能监控

### 日志管理

- [ ] 配置日志轮转
- [ ] 设置日志级别（生产环境使用 'error' 或 'warn'）
- [ ] 配置日志聚合（可选：ELK Stack, Papertrail）

### 健康检查

- [ ] 配置 `/api/health` 端点监控
- [ ] 设置 uptime 监控（UptimeRobot, Pingdom）
- [ ] 配置告警通知

## 🔄 备份策略

- [ ] 配置数据库自动备份
- [ ] 配置代码仓库备份
- [ ] 配置环境变量备份（加密存储）
- [ ] 测试恢复流程

## ✅ 最终检查

### 功能测试

- [ ] 登录功能正常
- [ ] 注册功能正常
- [ ] 密码重置正常
- [ ] OAuth 登录正常（如已配置）
- [ ] 会话管理正常
- [ ] 退出登录正常

### 安全测试

- [ ] HTTPS 正常工作
- [ ] CSRF 保护有效
- [ ] XSS 防护有效
- [ ] SQL 注入防护有效
- [ ] 速率限制有效
- [ ] 密码加密正常

### 性能测试

- [ ] 页面加载时间 < 3秒
- [ ] API 响应时间 < 500ms
- [ ] 并发用户测试通过
- [ ] 内存使用正常
- [ ] CPU 使用正常

### 可访问性测试

- [ ] 键盘导航正常
- [ ] 屏幕阅读器兼容
- [ ] ARIA 标签正确
- [ ] 对比度符合 WCAG 标准

## 📱 移动端测试

- [ ] iOS Safari 测试
- [ ] Android Chrome 测试
- [ ] 响应式布局正常
- [ ] 触摸交互正常

## 🌍 浏览器兼容性

- [ ] Chrome (最新版)
- [ ] Firefox (最新版)
- [ ] Safari (最新版)
- [ ] Edge (最新版)

## 📝 文档更新

- [ ] 更新 README.md
- [ ] 更新 API 文档
- [ ] 更新部署文档
- [ ] 更新变更日志

## 🎉 上线

- [ ] 所有检查项已完成
- [ ] 团队已通知
- [ ] 用户已通知（如需要）
- [ ] 监控已启用
- [ ] 备份已验证

## 📞 应急联系

- 技术负责人: ___________
- 运维负责人: ___________
- 安全负责人: ___________

## 🔙 回滚计划

如果出现问题：

1. 停止新服务
   ```bash
   pm2 stop destiny-ai
   # 或
   docker stop destiny-ai
   ```

2. 恢复备份文件
   ```bash
   cp login.js.backup login.js
   cp login.html.backup login.html
   cp login.css.backup login.css
   ```

3. 重启服务
   ```bash
   pm2 restart destiny-ai
   ```

4. 验证功能正常

---

**部署日期**: ___________  
**部署人员**: ___________  
**版本号**: v1.0.0-optimized
