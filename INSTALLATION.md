# Destiny AI - 安装和部署指南

## 快速开始

### 1. 安装依赖

```bash
# 安装 Node.js 依赖
npm install

# 或使用 yarn
yarn install
```

### 2. 配置环境变量

```bash
# 复制环境变量模板
cp .env.example .env

# 编辑 .env 文件，填入实际值
# 必须配置：
# - JWT_SECRET (生成随机密钥)
# - OPENROUTER_API_KEY (你的 OpenRouter API 密钥)
```

### 3. 启动服务器

```bash
# 开发模式（自动重启）
npm run dev

# 生产模式
npm start
```

### 4. 访问应用

打开浏览器访问：`http://localhost:3000`

## 详细配置

### 生成安全密钥

```bash
# 生成 JWT_SECRET
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# 生成 SESSION_SECRET
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 数据库配置（可选）

如果使用 PostgreSQL：

```bash
# 安装 PostgreSQL 驱动
npm install pg

# 在 .env 中配置数据库连接
DB_HOST=localhost
DB_PORT=5432
DB_NAME=destinyai
DB_USER=postgres
DB_PASSWORD=your-password
```

### Redis 配置（可选，用于会话存储）

```bash
# 安装 Redis 客户端
npm install redis

# 在 .env 中配置
REDIS_URL=redis://localhost:6379
```

## 生产部署

### 使用 PM2

```bash
# 安装 PM2
npm install -g pm2

# 启动应用
pm2 start server.js --name destiny-ai

# 查看日志
pm2 logs destiny-ai

# 重启
pm2 restart destiny-ai

# 停止
pm2 stop destiny-ai
```

### 使用 Docker

```bash
# 构建镜像
docker build -t destiny-ai .

# 运行容器
docker run -d -p 3000:3000 --env-file .env destiny-ai
```

### Nginx 反向代理

```nginx
server {
    listen 80;
    server_name yourdomain.com;

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
}
```

### HTTPS 配置（Let's Encrypt）

```bash
# 安装 Certbot
sudo apt-get install certbot python3-certbot-nginx

# 获取证书
sudo certbot --nginx -d yourdomain.com

# 自动续期
sudo certbot renew --dry-run
```

## 安全检查清单

- [ ] 已撤销旧的 API 密钥
- [ ] 已配置强随机 JWT_SECRET
- [ ] 已启用 HTTPS
- [ ] 已配置防火墙规则
- [ ] 已设置速率限制
- [ ] 已配置 CORS 白名单
- [ ] 已启用日志记录
- [ ] 已配置备份策略
- [ ] 已运行安全扫描 (`npm audit`)
- [ ] 已更新所有依赖到最新版本

## 监控和日志

### 应用日志

```bash
# 使用 PM2 查看日志
pm2 logs destiny-ai

# 或使用 Winston 日志库
npm install winston
```

### 性能监控

```bash
# 安装 PM2 监控
pm2 install pm2-server-monit

# 查看监控面板
pm2 monit
```

## 故障排查

### 端口被占用

```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac
lsof -i :3000
kill -9 <PID>
```

### 依赖安装失败

```bash
# 清除缓存
npm cache clean --force

# 删除 node_modules 重新安装
rm -rf node_modules package-lock.json
npm install
```

### API 连接失败

1. 检查 `.env` 文件是否正确配置
2. 确认 OPENROUTER_API_KEY 有效
3. 检查网络连接
4. 查看服务器日志

## 性能优化

### 启用 Gzip 压缩

```javascript
const compression = require('compression');
app.use(compression());
```

### 启用缓存

```javascript
const apicache = require('apicache');
let cache = apicache.middleware;
app.use(cache('5 minutes'));
```

### 数据库连接池

```javascript
const { Pool } = require('pg');
const pool = new Pool({
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000
});
```

## 支持

如有问题，请查看：
- [GitHub Issues](https://github.com/your-repo/issues)
- [文档](https://docs.destinyai.com)
- [Discord 社区](https://discord.gg/destinyai)
