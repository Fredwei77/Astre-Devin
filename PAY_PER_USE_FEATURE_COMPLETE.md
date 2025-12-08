# 按次付费功能完成报告

## 任务概述
为三个AI功能页面添加按次付费试用逻辑，允许免费用户通过单次付费体验AI功能。

## 定价方案

### 按次付费价格
- **AI占卜**: $0.99/次
- **风水分析**: $1.99/次
- **易经智慧**: $2.99/次

### 订阅方案（无限使用）
- **高级版**: $19.99/月
- **专业版**: $49.99/月

## 完成内容

### 1. 订阅管理器增强 ✅
**文件**: `subscription-manager.js`

#### 新增按次付费配置
```javascript
this.payPerUse = {
    divination: {
        price: 0.99,
        name: 'AI占卜',
        nameEn: 'AI Divination'
    },
    fengshui: {
        price: 1.99,
        name: '风水分析',
        nameEn: 'Feng Shui Analysis'
    },
    iching: {
        price: 2.99,
        name: '易经智慧',
        nameEn: 'I-Ching Wisdom'
    }
};
```

#### 新增核心方法

##### `showUpgradePrompt(feature, serviceType)`
- 增强版升级提示，支持显示按次付费选项
- 如果提供 `serviceType`，会在顶部显示按次付费卡片
- 显示价格、服务名称和立即支付按钮
- 下方显示订阅方案对比

##### `processPayPerUse(serviceType)`
- 处理按次付费流程
- 显示支付处理动画
- 模拟支付（实际应调用支付API）
- 支付成功后授予单次使用权限

##### `showPaymentProcessing(payInfo, isEnglish)`
- 显示支付处理中的模态框
- 包含加载动画和提示文字

##### `showPaymentSuccess(payInfo, isEnglish)`
- 显示支付成功的模态框
- 提示用户可以开始使用服务
- 点击继续后刷新页面

##### `grantSingleUse(serviceType)`
- 授予单次使用权限
- 存储在 localStorage: `singleUse_${serviceType}`
- 计数器递增

##### `hasSingleUse(serviceType)`
- 检查是否有单次使用权限
- 返回 true/false

##### `consumeSingleUse(serviceType)`
- 消耗单次使用权限
- 计数器递减
- 返回是否成功消耗

##### `canUseService(serviceType)`
- 综合检查是否可以使用服务
- 优先检查订阅权限
- 其次检查单次使用权限
- 返回: `{ allowed: boolean, type: 'subscription' | 'singleUse' | 'none' }`

### 2. AI服务权限检查更新 ✅
**文件**: `ai-service.js`

#### `analyzeDivination()` 方法
```javascript
// 检查订阅权限或按次付费权限
const access = window.subscriptionManager.canUseService('divination');

if (!access.allowed) {
    // 显示升级提示（包含按次付费选项）
    window.subscriptionManager.showUpgradePrompt('AI占卜分析', 'divination');
    return this.getMockResponse('divination');
}

// 如果是单次使用，消耗权限
if (access.type === 'singleUse') {
    window.subscriptionManager.consumeSingleUse('divination');
}
```

#### `analyzeFengShui()` 方法
```javascript
// 检查订阅权限或按次付费权限
const access = window.subscriptionManager.canUseService('fengshui');

if (!access.allowed) {
    // 显示升级提示（包含按次付费选项）
    window.subscriptionManager.showUpgradePrompt('AI风水分析', 'fengshui');
    return this.getMockResponse('fengshui');
}

// 如果是单次使用，消耗权限
if (access.type === 'singleUse') {
    window.subscriptionManager.consumeSingleUse('fengshui');
}
```

#### `analyzeIChing()` 方法
```javascript
// 检查订阅权限或按次付费权限
const access = window.subscriptionManager.canUseService('iching');

if (!access.allowed) {
    // 显示升级提示（包含按次付费选项）
    window.subscriptionManager.showUpgradePrompt('AI易经解读', 'iching');
    return this.getMockResponse('iching');
}

// 如果是单次使用，消耗权限
if (access.type === 'singleUse') {
    window.subscriptionManager.consumeSingleUse('iching');
}
```

### 3. 翻译键更新 ✅
**文件**: `translations.js`

添加了按次付费相关的翻译键（英文、简体中文、繁体中文）：

```javascript
// 英文
'payPerUse.title': 'Pay Per Use',
'payPerUse.or': 'or',
'payPerUse.payNow': 'Pay Now',
'payPerUse.singleUse': 'Single Use',
'payPerUse.processing': 'Processing Payment',
'payPerUse.pleaseWait': 'Please wait...',
'payPerUse.success': 'Payment Successful!',
'payPerUse.canUseNow': 'You can now use',
'payPerUse.continue': 'Continue',
'payPerUse.divination': 'AI Divination',
'payPerUse.fengshui': 'Feng Shui Analysis',
'payPerUse.iching': 'I-Ching Wisdom',

// 简体中文
'payPerUse.title': '按次付费',
'payPerUse.or': '或者',
'payPerUse.payNow': '立即支付',
'payPerUse.singleUse': '单次使用',
'payPerUse.processing': '正在处理支付',
'payPerUse.pleaseWait': '请稍候...',
'payPerUse.success': '支付成功！',
'payPerUse.canUseNow': '您现在可以使用',
'payPerUse.continue': '继续',
'payPerUse.divination': 'AI占卜',
'payPerUse.fengshui': '风水分析',
'payPerUse.iching': '易经智慧',

// 繁体中文
'payPerUse.title': '按次付費',
'payPerUse.or': '或者',
'payPerUse.payNow': '立即支付',
'payPerUse.singleUse': '單次使用',
'payPerUse.processing': '正在處理支付',
'payPerUse.pleaseWait': '請稍候...',
'payPerUse.success': '支付成功！',
'payPerUse.canUseNow': '您現在可以使用',
'payPerUse.continue': '繼續',
'payPerUse.divination': 'AI占卜',
'payPerUse.fengshui': '風水分析',
'payPerUse.iching': '易經智慧',
```

## 用户体验流程

### 免费用户首次使用流程

1. **访问功能页面**
   - 用户访问占卜/风水/易经页面
   - 填写必要信息

2. **点击分析按钮**
   - 系统检测到免费用户
   - 显示升级/按次付费提示模态框

3. **选择按次付费**
   - 模态框顶部显示金色按次付费卡片
   - 显示价格和服务名称
   - 点击"立即支付"按钮

4. **支付处理**
   - 显示支付处理中动画
   - 模拟支付流程（2秒）
   - 实际应调用支付API

5. **支付成功**
   - 显示支付成功提示
   - 授予单次使用权限
   - 点击"继续"刷新页面

6. **使用AI功能**
   - 再次点击分析按钮
   - 系统检测到单次使用权限
   - 调用真实AI API
   - 消耗单次使用权限
   - 返回完整AI分析结果

7. **再次使用**
   - 如果再次点击分析
   - 权限已消耗，再次显示付费提示

### 订阅用户使用流程

1. **访问功能页面**
   - 用户访问占卜/风水/易经页面
   - 系统检测到订阅用户

2. **直接使用**
   - 填写信息后点击分析
   - 直接调用真实AI API
   - 无需付费，无限使用

## UI设计特点

### 按次付费卡片
- 金色渐变背景 (`from-mystic-gold/20 to-yellow-400/20`)
- 金色边框 (`border-2 border-mystic-gold`)
- 大号价格显示 (`text-3xl font-bold`)
- 醒目的支付按钮
- 位于模态框顶部，优先展示

### 订阅方案卡片
- 半透明背景 (`bg-white/5`)
- 金色边框 (`border border-mystic-gold/30`)
- 功能列表清晰展示
- 位于按次付费卡片下方

### 分隔线
- 使用"或者"文字分隔
- 灰色半透明样式
- 清晰区分两种选择

### 支付处理动画
- 旋转的加载圈
- 金色主题
- 简洁的提示文字

### 支付成功提示
- 绿色成功图标 (✅)
- 绿色标题文字
- 金色继续按钮

## 数据存储

### localStorage 键名

#### 单次使用权限
- `singleUse_divination` - AI占卜单次使用次数
- `singleUse_fengshui` - 风水分析单次使用次数
- `singleUse_iching` - 易经智慧单次使用次数

#### 用户订阅信息
- `user` - JSON格式，包含 `subscription` 字段

#### 每日使用限制
- `usage_${today}` - 今日使用次数（免费用户）

## 技术实现细节

### 权限检查优先级
1. 检查是否为订阅用户（premium/professional）
2. 检查是否有单次使用权限
3. 都没有则显示付费提示

### 权限消耗时机
- 在调用AI API之前检查权限
- 权限验证通过后立即消耗
- 确保一次付费只能使用一次

### 支付流程（当前为模拟）
```javascript
// 当前实现（模拟）
setTimeout(() => {
    this.grantSingleUse(serviceType);
    this.showPaymentSuccess(payInfo, isEnglish);
}, 2000);

// 实际应该调用支付API
// const result = await paymentAPI.charge({
//     amount: payInfo.price,
//     service: serviceType,
//     userId: currentUser.id
// });
```

## 下一步集成建议

### 1. 支付网关集成
推荐使用 Stripe 或 PayPal：

```javascript
async processPayPerUse(serviceType) {
    const payInfo = this.payPerUse[serviceType];
    
    // 创建 Stripe Checkout Session
    const stripe = Stripe('your_publishable_key');
    const response = await fetch('/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            service: serviceType,
            price: payInfo.price
        })
    });
    
    const session = await response.json();
    
    // 重定向到 Stripe Checkout
    const result = await stripe.redirectToCheckout({
        sessionId: session.id
    });
}
```

### 2. 后端API端点

#### 创建支付会话
```
POST /api/create-checkout-session
Body: { service: 'divination', price: 0.99 }
Response: { sessionId: 'cs_xxx' }
```

#### 验证支付
```
POST /api/verify-payment
Body: { sessionId: 'cs_xxx', userId: 'user_xxx' }
Response: { success: true, credits: 1 }
```

#### 授予使用权限
```
POST /api/grant-credit
Body: { userId: 'user_xxx', service: 'divination' }
Response: { success: true, remaining: 1 }
```

### 3. 数据库表设计

#### payments 表
```sql
CREATE TABLE payments (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    service_type VARCHAR(50),
    amount DECIMAL(10,2),
    status VARCHAR(20),
    stripe_session_id VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW()
);
```

#### user_credits 表
```sql
CREATE TABLE user_credits (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    service_type VARCHAR(50),
    credits INT DEFAULT 0,
    updated_at TIMESTAMP DEFAULT NOW()
);
```

### 4. Webhook 处理
```javascript
// 处理 Stripe webhook
app.post('/webhook', async (req, res) => {
    const sig = req.headers['stripe-signature'];
    const event = stripe.webhooks.constructEvent(
        req.body, sig, webhookSecret
    );
    
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        
        // 授予用户使用权限
        await grantUserCredit(
            session.client_reference_id,
            session.metadata.service
        );
    }
    
    res.json({ received: true });
});
```

## 测试建议

### 1. 免费用户测试
```javascript
// 清除所有权限
localStorage.removeItem('user');
localStorage.removeItem('singleUse_divination');
localStorage.removeItem('singleUse_fengshui');
localStorage.removeItem('singleUse_iching');

// 测试流程
// 1. 访问占卜页面
// 2. 点击分析按钮
// 3. 验证显示按次付费选项
// 4. 点击"立即支付"
// 5. 验证支付处理动画
// 6. 验证支付成功提示
// 7. 刷新页面后再次分析
// 8. 验证调用真实AI
// 9. 第三次分析验证权限已消耗
```

### 2. 按次付费测试
```javascript
// 手动授予单次使用权限
localStorage.setItem('singleUse_divination', '1');

// 测试流程
// 1. 访问占卜页面
// 2. 点击分析按钮
// 3. 验证直接调用AI（不显示付费提示）
// 4. 验证权限被消耗
// 5. 再次分析验证显示付费提示
```

### 3. 订阅用户测试
```javascript
// 设置为高级版用户
localStorage.setItem('user', JSON.stringify({
    subscription: 'premium'
}));

// 测试流程
// 1. 访问任意功能页面
// 2. 多次使用AI功能
// 3. 验证无需付费
// 4. 验证无使用限制
```

### 4. 价格显示测试
- [ ] 验证占卜页面显示 $0.99
- [ ] 验证风水页面显示 $1.99
- [ ] 验证易经页面显示 $2.99
- [ ] 验证中英文切换正确
- [ ] 验证繁体中文显示正确

### 5. UI测试
- [ ] 验证按次付费卡片样式正确
- [ ] 验证金色主题一致
- [ ] 验证支付处理动画流畅
- [ ] 验证支付成功提示显示正确
- [ ] 验证移动端响应式

## 文件清单

### 修改的文件
1. `subscription-manager.js` - 添加按次付费功能
2. `ai-service.js` - 更新权限检查逻辑
3. `translations.js` - 添加按次付费翻译键

### 无需修改的文件
- `divination.html` - 已有 subscription-manager.js 引用
- `fengshui.html` - 已有 subscription-manager.js 引用
- `iching.html` - 已有 subscription-manager.js 引用
- `index.html` - 已有 subscription-manager.js 引用

## 价格对比

### 单次使用成本
- AI占卜: $0.99/次
- 风水分析: $1.99/次
- 易经智慧: $2.99/次
- **总计**: $5.97（使用3次，每个功能1次）

### 订阅成本
- 高级版: $19.99/月（无限使用）
- 专业版: $49.99/月（无限使用 + 商业功能）

### 价值主张
- 如果用户每月使用超过4次，订阅更划算
- 按次付费适合偶尔使用的用户
- 订阅适合频繁使用的用户

## 总结

按次付费功能已完成，实现了：
- ✅ AI占卜 $0.99/次
- ✅ 风水分析 $1.99/次
- ✅ 易经智慧 $2.99/次
- ✅ 完整的支付流程UI
- ✅ 权限管理系统
- ✅ 三语翻译支持
- ✅ 优雅的用户体验

当前为模拟支付，实际部署时需要集成真实支付网关（Stripe/PayPal）。

所有功能已实现并可以开始测试！
