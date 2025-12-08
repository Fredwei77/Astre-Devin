# 🚀 Destiny AI - 快速启动指南

## ⚡ 3分钟快速开始

### 步骤 1: 获取 API Key (2分钟)

1. 访问 https://openrouter.ai/
2. 注册并登录
3. 点击 "API Keys" → "Create Key"
4. 复制生成的 API Key (格式: `sk-or-v1-...`)

### 步骤 2: 配置 API Key (30秒)

打开 `config.js` 文件，第6行：

```javascript
OPENROUTER_API_KEY: 'YOUR_OPENROUTER_API_KEY_HERE',
```

替换为你的 API Key：

```javascript
OPENROUTER_API_KEY: 'sk-or-v1-你的密钥',
```

### 步骤 3: 启动应用 (30秒)

**方法 1 - Python:**
```bash
python -m http.server 8000
```

**方法 2 - Node.js:**
```bash
npx serve
```

**方法 3 - 直接打开:**
双击 `index.html` (部分功能可能受限)

### 步骤 4: 测试 API

1. 打开浏览器访问: http://localhost:8000/test-api.html
2. 点击 "测试连接"
3. 看到 ✅ 表示成功！

## 🎯 开始使用

### 占卜分析
1. 访问 http://localhost:8000/divination.html
2. 输入出生信息
3. 选择关注领域
4. 点击"分析我的命运"
5. 等待AI分析（约10-15秒）

### 风水分析
1. 访问 http://localhost:8000/fengshui.html
2. 旋转罗盘选择方位
3. AI自动分析风水布局
4. 查看优化建议

### 易经占卜
1. 访问 http://localhost:8000/iching.html
2. 输入你的问题
3. 选择占卜方式
4. 投币起卦
5. 获得AI解读

## 🔧 模拟模式（免费测试）

不想消耗API额度？使用模拟模式！

编辑 `config.js` 第23行：

```javascript
MOCK_MODE: true  // 改为 true
```

模拟模式特点：
- ✅ 完全免费
- ✅ 即时响应
- ✅ 功能完整
- ❌ 结果固定（非真实AI）

## 💰 成本估算

| 模型 | 单次成本 | 1000次成本 |
|------|---------|-----------|
| DeepSeek Chat | $0.0002 | ~$0.21 | ⭐推荐
| Gemini Pro 1.5 | $0.0002 | ~$0.19 | ⭐推荐
| Gemini Flash 1.5 | $0.0001 | ~$0.11 | 💰最便宜
| Claude 3.5 Sonnet | $0.0045 | ~$4.5 |
| GPT-4 Turbo | $0.015 | ~$15 |

**当前配置**: DeepSeek + Gemini（极低成本，高性能）

**成本优势**:
- 比 Claude 便宜 20 倍
- 比 GPT-4 便宜 70 倍
- 1000次请求仅需 $0.20

## 🐛 常见问题

### Q: API Key 无效？
A: 检查是否正确复制，确认账户有余额

### Q: 响应很慢？
A: 正常，AI分析需要10-15秒

### Q: CORS 错误？
A: 使用本地服务器（python/npx serve），不要直接打开HTML

### Q: 想要更快的响应？
A: 已使用 Gemini Pro 1.5（风水功能），或切换到 Gemini Flash 1.5（更快）

### Q: 想要更强的推理能力？
A: 已使用 DeepSeek Chat（占卜和易经功能），推理能力强大

## 📚 详细文档

- 完整指南: `AI_INTEGRATION_GUIDE.md`
- 实施报告: `IMPLEMENTATION_REPORT.md`
- API测试: `test-api.html`

## 🆘 需要帮助？

1. 查看浏览器控制台（F12）
2. 使用测试工具 `test-api.html`
3. 尝试模拟模式测试
4. 检查 API Key 配置

---

**准备好了吗？开始你的命运探索之旅！** 🔮✨
