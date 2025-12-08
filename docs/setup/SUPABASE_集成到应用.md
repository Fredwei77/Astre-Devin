# Supabase 集成到应用指南

## 🎉 当前状态

✅ Supabase配置完成  
✅ 数据库连接正常  
✅ 注册功能正常  
✅ 登录功能正常  
✅ 用户管理正常  

## 🎯 下一步：集成到实际应用

### 步骤1: 更新登录页面

#### 1.1 在 login.html 中添加Supabase脚本

在 `login.html` 的 `<head>` 标签中添加：

```html
<!-- Supabase Client -->
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
```

在 `</body>` 标签前添加：

```html
<!-- Supabase Integration -->
<script src="supabase-client.js"></script>
<script src="supabase-init.js"></script>
```

#### 1.2 更新 login.js 使用Supabase

在 `login.js` 中添加Supabase登录逻辑：

```javascript
// 使用Supabase登录
async function loginWithSupabase(email, password) {
    try {
        const result = await EnhancedAuthService.login(email, password);
        
        if (result.success) {
            console.log('✅ 登录成功');
            
            // 保存用户信息到localStorage（兼容现有代码）
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('userEmail', result.user.email);
            localStorage.setItem('userId', result.user.id);
            
            // 跳转到主页
            window.location.href = 'index.html';
        } else {
            console.error('❌ 登录失败:', result.error);
            alert('登录失败: ' + result.error);
        }
    } catch (error) {
        console.error('登录错误:', error);
        alert('登录失败，请重试');
    }
}
```

### 步骤2: 更新所有页面的认证检查

#### 2.1 在主要页面中添加Supabase脚本

需要更新的页面：
- `index.html`
- `divination.html`
- `fengshui.html`
- `iching.html`
- `profile.html`

在每个页面的 `<head>` 中添加：

```html
<!-- Supabase Client -->
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
```

在 `</body>` 前添加：

```html
<!-- Supabase Integration -->
<script src="supabase-client.js"></script>
<script src="supabase-init.js"></script>
```

#### 2.2 更新认证检查逻辑

在 `auth-service.js` 中添加Supabase检查：

```javascript
// 检查用户是否登录（支持Supabase）
async function isUserLoggedIn() {
    // 先检查Supabase会话
    if (window.EnhancedAuthService) {
        const user = await EnhancedAuthService.getCurrentUser();
        if (user) {
            return true;
        }
    }
    
    // 回退到localStorage检查（兼容性）
    return localStorage.getItem('isLoggedIn') === 'true';
}
```

### 步骤3: 保存占卜记录到数据库

#### 3.1 在占卜页面保存记录

在 `divination.html` 的结果显示后，添加保存功能：

```javascript
// 保存占卜记录
async function saveDivinationReading() {
    if (!window.DatabaseService) {
        console.warn('数据库服务未加载');
        return;
    }
    
    const result = await DatabaseService.saveReading(
        'divination',
        {
            birthDate: document.getElementById('birthDate').value,
            birthTime: document.getElementById('birthTime').value,
            birthPlace: document.getElementById('birthPlace').value,
            gender: document.getElementById('gender').value,
            categories: selectedCategories
        },
        {
            personality: analysisResults.personality,
            career: analysisResults.career,
            wealth: analysisResults.wealth,
            love: analysisResults.love,
            health: analysisResults.health,
            luckyColors: analysisResults.luckyColors,
            luckyNumbers: analysisResults.luckyNumbers
        }
    );
    
    if (result.success) {
        console.log('✅ 占卜记录已保存');
        alert('占卜记录已保存到您的账户');
    }
}
```

#### 3.2 在风水页面保存记录

类似地，在 `fengshui.html` 中保存风水分析记录。

#### 3.3 在易经页面保存记录

在 `iching.html` 中保存易经卦象记录。

### 步骤4: 在个人档案页面显示历史记录

#### 4.1 更新 profile.html

添加历史记录显示区域：

```html
<div class="readings-history">
    <h2>我的占卜记录</h2>
    <div id="readingsContainer">
        <!-- 动态加载记录 -->
    </div>
</div>
```

#### 4.2 加载历史记录

```javascript
async function loadUserReadings() {
    const result = await DatabaseService.getUserReadings(10, 0);
    
    if (result.success && result.data.length > 0) {
        const container = document.getElementById('readingsContainer');
        
        container.innerHTML = result.data.map(reading => `
            <div class="reading-card">
                <h3>${reading.type}</h3>
                <p>日期: ${new Date(reading.created_at).toLocaleString()}</p>
                <button onclick="viewReading('${reading.id}')">查看详情</button>
            </div>
        `).join('');
    }
}
```

### 步骤5: 记录使用统计

在每次使用功能时记录：

```javascript
// 占卜页面
await DatabaseService.recordUsage('divination', {
    category: selectedCategory,
    timestamp: new Date().toISOString()
});

// 风水页面
await DatabaseService.recordUsage('fengshui', {
    direction: currentDirection,
    timestamp: new Date().toISOString()
});

// 易经页面
await DatabaseService.recordUsage('iching', {
    hexagram: hexagramName,
    timestamp: new Date().toISOString()
});
```

### 步骤6: 实现订阅管理

#### 6.1 检查用户订阅状态

```javascript
async function checkUserSubscription() {
    const result = await DatabaseService.getUserSubscription();
    
    if (result.success) {
        const subscription = result.data;
        console.log('订阅类型:', subscription.plan_type);
        console.log('订阅状态:', subscription.status);
        
        // 根据订阅类型显示不同功能
        if (subscription.plan_type === 'free') {
            // 限制功能
            showUpgradePrompt();
        }
    }
}
```

#### 6.2 实现使用限制

```javascript
async function checkUsageLimit(usageType) {
    const subscription = await DatabaseService.getUserSubscription();
    
    // 免费用户限制
    const limits = {
        free: { divination: 3, fengshui: 3, iching: 3 },
        basic: { divination: 10, fengshui: 10, iching: 10 },
        premium: { divination: -1, fengshui: -1, iching: -1 } // 无限制
    };
    
    const userLimit = limits[subscription.data.plan_type][usageType];
    
    if (userLimit === -1) return true; // 无限制
    
    // 检查今日使用次数
    const today = new Date().toISOString().split('T')[0];
    const usage = await DatabaseService.getUserUsage(
        user.id,
        today + 'T00:00:00Z',
        today + 'T23:59:59Z'
    );
    
    const todayCount = usage.data.filter(u => u.usage_type === usageType).length;
    
    return todayCount < userLimit;
}
```

## 📋 集成清单

### 必须完成

- [ ] 在 login.html 中添加Supabase脚本
- [ ] 更新 login.js 使用Supabase登录
- [ ] 在所有主要页面添加Supabase脚本
- [ ] 更新认证检查逻辑
- [ ] 测试登录功能

### 推荐完成

- [ ] 实现占卜记录保存
- [ ] 实现风水记录保存
- [ ] 实现易经记录保存
- [ ] 在profile页面显示历史记录
- [ ] 实现使用统计记录

### 可选功能

- [ ] 实现订阅管理
- [ ] 实现使用限制
- [ ] 实现数据导出
- [ ] 实现记录分享
- [ ] 实现收藏功能

## 🧪 测试步骤

### 1. 测试登录集成

1. 访问 `login.html`
2. 使用测试账号登录
3. 验证跳转到主页
4. 检查用户菜单显示正确

### 2. 测试数据保存

1. 进行一次占卜
2. 检查数据是否保存到Supabase
3. 在Dashboard的Table Editor中验证

### 3. 测试历史记录

1. 访问个人档案页面
2. 检查是否显示历史记录
3. 点击查看详情

### 4. 测试使用统计

1. 多次使用功能
2. 在Dashboard中查看usage_logs表
3. 验证记录正确

## 🚀 快速开始

我已经为你准备了一个自动集成脚本。运行：

```bash
integrate-supabase.bat
```

这个脚本会：
1. 自动在所有页面添加Supabase脚本
2. 更新认证逻辑
3. 添加数据保存功能
4. 测试集成结果

## 📞 需要帮助？

如果在集成过程中遇到问题：
1. 检查浏览器控制台错误
2. 验证Supabase脚本已加载
3. 确认用户已登录
4. 查看Supabase Dashboard中的数据

---

**下一步**: 我可以帮你自动更新这些文件，还是你想手动集成？
