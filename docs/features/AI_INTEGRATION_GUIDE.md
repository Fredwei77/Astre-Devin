# Destiny AI - OpenRouter API 集成指南

## 📋 概述

本项目已成功集成 OpenRouter API，为占卜、风水、易经三大功能提供真实的 AI 智能分析。

## 🔑 配置步骤

### 1. 获取 OpenRouter API Key

1. 访问 [OpenRouter.ai](https://openrouter.ai/)
2. 注册账号并登录
3. 进入 API Keys 页面
4. 创建新的 API Key
5. 复制 API Key

### 2. 配置 API Key

打开 `config.js` 文件，找到以下行：

```javascript
OPENROUTER_API_KEY: 'YOUR_OPENROUTER_API_KEY_HERE',
```

将 `YOUR_OPENROUTER_API_KEY_HERE` 替换为你的实际 API Key：

```javascript
OPENROUTER_API_KEY: 'sk-or-v1-xxxxxxxxxxxxxxxxxxxxx',
```

### 3. 选择 AI 模型

在 `config.js` 中已配置使用 DeepSeek 和 Gemini 两个高性价比模型：

```javascript
// 功能专用模型配置
MODELS: {
    DIVINATION: 'deepseek/deepseek-chat',      // 占卜：DeepSeek
    FENGSHUI: 'google/gemini-pro-1.5',         // 风水：Gemini Pro
    ICHING: 'deepseek/deepseek-chat'           // 易经：DeepSeek
}
```

**推荐模型：**
- `deepseek/deepseek-chat` - DeepSeek Chat（推荐，$0.14/M tokens，强推理）
- `google/gemini-pro-1.5` - Gemini Pro 1.5（快速，$0.125/M tokens）
- `google/gemini-flash-1.5` - Gemini Flash 1.5（超快，$0.075/M tokens）

**为什么选择这两个模型？**
- **DeepSeek**: 推理能力强，适合复杂的命理分析和易经解读
- **Gemini**: 响应速度快，适合实时的风水分析
- **成本低**: 两者都是市场上性价比最高的模型

### 4. 模拟模式切换

开发测试时可以使用模拟模式，无需消耗 API 额度：

```javascript
FEATURES: {
    MOCK_MODE: false // false=使用真实API, true=使用模拟数据
}
```

## 🚀 功能说明

### 1. 占卜分析 (Divination)

**文件：** `divination.html`, `main.js`, `ai-service.js`

**功能：**
- 根据用户生辰八字进行命运分析
- 五行平衡计算
- 事业、财运、感情、健康建议
- 幸运元素推荐

**使用流程：**
1. 用户输入出生信息
2. 选择关注领域
3. 点击"分析我的命运"
4. AI 实时分析并返回结果

**API 调用：**
```javascript
const result = await aiService.analyzeDivination({
    birthDate: '1990-12-31',
    birthTime: '14:30',
    birthPlace: 'Beijing',
    gender: 'male',
    categories: ['career', 'wealth']
});
```

### 2. 风水分析 (Feng Shui)

**文件：** `fengshui.html`, `fengshui-ai.js`

**功能：**
- 罗盘方位分析
- 五行能量评估
- 空间布局优化建议
- 风水物品推荐

**使用流程：**
1. 旋转罗盘选择方位
2. 可选：上传房间照片
3. AI 分析当前方位风水
4. 获得优化建议

**API 调用：**
```javascript
const result = await fengShuiAI.analyzeSpace(direction, imageData);
```

### 3. 易经占卜 (I-Ching)

**文件：** `iching.html`, `iching-ai.js`

**功能：**
- 投币起卦
- 卦象解读
- 变爻分析
- 人生指导建议

**使用流程：**
1. 输入问题
2. 选择占卜方式（投币/数字/时间/语音）
3. 生成卦象
4. AI 解读卦象含义

**API 调用：**
```javascript
const result = await ichingAI.performDivination(
    question,
    hexagramLines,
    changingLines
);
```

## 📁 文件结构

```
destiny-ai/
├── config.js                 # API配置和提示词模板
├── ai-service.js            # AI服务核心类
├── fengshui-ai.js          # 风水AI集成
├── iching-ai.js            # 易经AI集成
├── main.js                 # 主应用逻辑（已更新）
├── divination.html         # 占卜页面（已更新）
├── fengshui.html          # 风水页面
├── iching.html            # 易经页面
└── index.html             # 首页（已更新）
```

## 🔧 技术细节

### AI Service 类

**核心方法：**

```javascript
class AIService {
    // 发送AI请求
    async sendRequest(systemPrompt, userPrompt, options)
    
    // 占卜分析
    async analyzeDivination(userData)
    
    // 风水分析
    async analyzeFengShui(spaceData)
    
    // 易经解读
    async analyzeIChing(questionData)
    
    // 测试连接
    async testConnection()
}
```

### 提示词工程

所有提示词模板在 `config.js` 的 `PROMPTS` 对象中定义：

```javascript
PROMPTS: {
    DIVINATION: {
        SYSTEM: '系统提示词...',
        USER: (data) => `用户提示词模板...`
    },
    FENGSHUI: { ... },
    ICHING: { ... }
}
```

### 错误处理

- API 失败自动回退到模拟数据
- 请求限流（最小间隔1秒）
- 超时控制（30秒）
- 最多重试3次

## 💰 成本估算

**OpenRouter 定价（参考）：**
- DeepSeek Chat: ~$0.14/百万tokens（推荐）
- Gemini Pro 1.5: ~$0.125/百万tokens（推荐）
- Gemini Flash 1.5: ~$0.075/百万tokens（最便宜）
- Claude 3.5 Sonnet: ~$3/百万tokens
- GPT-4 Turbo: ~$10/百万tokens

**单次请求估算（使用 DeepSeek + Gemini）：**
- 输入：~500 tokens
- 输出：~1000 tokens
- 成本：$0.0002 - $0.0003/次

**月度估算（1000次请求）：**
- DeepSeek + Gemini: ~$0.21（极低成本！）
- Claude 3.5: ~$4.5
- GPT-4: ~$15

**成本对比：**
使用 DeepSeek + Gemini 组合，成本仅为 Claude 的 1/20，GPT-4 的 1/70！

## 🧪 测试

### 测试 API 连接

在浏览器控制台运行：

```javascript
// 测试连接
aiService.testConnection().then(result => {
    console.log('API测试结果:', result);
});

// 测试占卜
aiService.analyzeDivination({
    birthDate: '1990-01-01',
    birthTime: '12:00',
    birthPlace: 'Beijing',
    gender: 'male',
    categories: ['career']
}).then(result => {
    console.log('占卜结果:', result);
});
```

### 切换模拟模式

开发时使用模拟数据：

```javascript
// config.js
FEATURES: {
    MOCK_MODE: true // 启用模拟模式
}
```

## 🐛 常见问题

### 1. API Key 无效

**错误：** `请在config.js中配置有效的OPENROUTER_API_KEY`

**解决：**
- 检查 API Key 是否正确复制
- 确认 API Key 未过期
- 验证账户余额充足

### 2. CORS 错误

**错误：** `Access-Control-Allow-Origin`

**解决：**
- OpenRouter 支持跨域请求
- 确保请求头包含 `HTTP-Referer`
- 检查浏览器控制台详细错误

### 3. 响应超时

**错误：** `Request timeout`

**解决：**
- 检查网络连接
- 增加 `API_TIMEOUT` 值
- 尝试更换模型

### 4. 返回格式错误

**错误：** `AI响应内容为空`

**解决：**
- 检查提示词是否要求 JSON 格式
- 查看 AI 原始响应
- 调整 `temperature` 参数

## 📊 监控和日志

### 启用详细日志

```javascript
// 在 ai-service.js 中
console.log('API请求:', {
    model: this.model,
    prompt: userPrompt,
    options: options
});

console.log('API响应:', data);
```

### 性能监控

```javascript
const startTime = Date.now();
const result = await aiService.analyzeDivination(data);
const duration = Date.now() - startTime;
console.log(`分析耗时: ${duration}ms`);
```

## 🔒 安全建议

1. **不要在前端暴露 API Key**
   - 生产环境应使用后端代理
   - 实现请求签名验证

2. **限制请求频率**
   - 已实现基础限流
   - 考虑添加用户级别限制

3. **验证用户输入**
   - 防止注入攻击
   - 限制输入长度

4. **监控 API 使用**
   - 设置预算警报
   - 记录异常请求

## 🚀 部署建议

### 开发环境
```bash
# 使用本地服务器
python -m http.server 8000
# 或
npx serve
```

### 生产环境

1. **使用环境变量**
```javascript
const API_KEY = process.env.OPENROUTER_API_KEY;
```

2. **实现后端代理**
```javascript
// 前端调用后端API
fetch('/api/divination', {
    method: 'POST',
    body: JSON.stringify(userData)
});

// 后端转发到OpenRouter
```

3. **启用缓存**
```javascript
// 缓存相同请求的结果
const cacheKey = JSON.stringify(userData);
if (cache.has(cacheKey)) {
    return cache.get(cacheKey);
}
```

## 📚 参考资源

- [OpenRouter 文档](https://openrouter.ai/docs)
- [Claude API 文档](https://docs.anthropic.com/)
- [GPT-4 API 文档](https://platform.openai.com/docs)
- [提示词工程指南](https://www.promptingguide.ai/)

## 🤝 支持

如有问题，请：
1. 查看浏览器控制台错误
2. 检查 API Key 配置
3. 尝试模拟模式测试
4. 查看 OpenRouter 状态页

---

**版本：** 1.0.0  
**更新日期：** 2024-12-04  
**作者：** Destiny AI Team
