# Shop UI 多语言支持修复指南

## 已完成的修复

已成功为 `shop-ui.js` 添加了以下多语言支持功能：

### 1. 核心多语言方法
```javascript
// 获取当前语言
getCurrentLanguage() {
    return localStorage.getItem('preferredLanguage') || 'zh';
}

// 获取翻译文本
t(key, fallback = '') {
    const lang = this.getCurrentLanguage();
    const translations = window.TRANSLATIONS?.[lang] || {};
    return translations[key] || fallback;
}
```

### 2. 语言切换监听
```javascript
// 在 init() 方法中添加
window.addEventListener('languageChanged', () => {
    this.loadProducts();
});
```

### 3. 已修复的方法

#### ✅ addToCart() - 添加到购物车
- 支持中英文提示消息
- "商店功能需要配置数据库" / "Shop features require database configuration"
- "请先登录" / "Please login first"
- "已添加到购物车" / "Added to cart"

#### ✅ buyNow() - 立即购买
- 支持中英文提示消息
- "获取商品信息失败" / "Failed to get product info"

#### ✅ viewCart() - 查看购物车
- 支持中英文提示消息

## 需要手动修复的部分

由于文件较大，以下方法需要手动添加多语言支持：

### 1. renderProducts() 方法
在第 70-120 行左右，需要修改：

```javascript
// 在方法开始处添加
const isEnglish = this.getCurrentLanguage() === 'en';

// 替换固定文本
const stockText = isEnglish ? 'Stock' : '库存';
const addToCartText = isEnglish ? 'Add to Cart' : '加入购物车';
const buyNowText = isEnglish ? 'Buy Now' : '立即购买';
const outOfStockText = isEnglish ? 'Out of Stock' : '暂时缺货';

// 使用多语言名称和描述
const name = isEnglish ? (product.name_en || product.name) : product.name;
const description = isEnglish ? (product.description_en || product.description) : product.description;
```

### 2. showCartModal() 方法
在第 278-350 行左右，需要修改：

```javascript
const isEnglish = this.getCurrentLanguage() === 'en';
const cartTitle = isEnglish ? 'Shopping Cart' : '购物车';
const totalText = isEnglish ? 'Total:' : '总计:';
const checkoutText = isEnglish ? 'Checkout' : '去结算';
const continueText = isEnglish ? 'Continue Shopping' : '继续购物';
```

### 3. showCheckoutModal() 方法
需要添加的翻译文本：
- "确认订单" / "Confirm Order"
- "订单商品" / "Order Items"
- "收货地址" / "Shipping Address"
- "新增地址" / "Add Address"
- "备注" / "Notes"
- "商品总价" / "Subtotal"
- "运费" / "Shipping"
- "总计" / "Total"
- "确认下单" / "Place Order"
- "取消" / "Cancel"

### 4. showStripePayment() 方法
需要添加的翻译文本：
- "支付" / "Payment"
- "支付信息" / "Payment Information"
- "安全支付由 Stripe 提供保护" / "Secure payment protected by Stripe"
- "处理中..." / "Processing..."

### 5. showSuccessMessage() 方法
需要添加的翻译文本：
- "订单创建成功！" / "Order created successfully!"
- "订单号" / "Order Number"
- "我们会尽快处理您的订单" / "We will process your order soon"

## 使用现有的翻译键

translations.js 中已有的商店相关翻译键：

```javascript
// 英文
'fengshui.shop.cart': 'Cart'
'fengshui.shop.addToCart': 'Add to Cart'
'fengshui.shop.buyNow': 'Buy Now'
'fengshui.shop.checkout': 'Checkout'
'fengshui.shop.continueShopping': 'Continue Shopping'
'fengshui.shop.emptyCart': 'Your cart is empty'

// 中文
'fengshui.shop.cart': '购物车'
'fengshui.shop.addToCart': '加入购物车'
'fengshui.shop.buyNow': '立即购买'
'fengshui.shop.checkout': '去结算'
'fengshui.shop.continueShopping': '继续购物'
'fengshui.shop.emptyCart': '购物车是空的'
```

## 快速修复方案

如果需要快速实现，可以使用 `shop-ui-i18n.js` 文件，它是一个简化版本，已经包含了基本的多语言支持。

要使用它：
1. 在 HTML 中将 `<script src="shop-ui.js"></script>` 改为 `<script src="shop-ui-i18n.js"></script>`
2. 确保在加载 shop-ui 之前已加载 `translations.js`

## 测试方法

1. 切换语言：
```javascript
localStorage.setItem('preferredLanguage', 'en'); // 英文
localStorage.setItem('preferredLanguage', 'zh'); // 中文
window.location.reload();
```

2. 触发语言切换事件：
```javascript
window.dispatchEvent(new Event('languageChanged'));
```

## 状态总结

✅ 已完成：
- 核心多语言方法
- 语言切换监听
- addToCart() 方法
- buyNow() 方法
- viewCart() 方法

⏳ 待完成：
- renderProducts() 方法
- showCartModal() 方法
- showCheckoutModal() 方法
- showStripePayment() 方法
- showSuccessMessage() 方法

建议：使用 `shop-ui-i18n.js` 作为参考，逐步完善 `shop-ui.js` 的多语言支持。
