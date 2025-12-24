// Subscription Manager - 订阅管理系统
// 管理用户订阅状态和权限

class SubscriptionManager {
    constructor() {
        this.plans = {
            free: {
                name: 'Free',
                price: 0,
                features: {
                    mockDataOnly: true,
                    aiEnabled: false,
                    dailyLimit: 3,
                    advancedFeatures: false
                }
            },
            premium: {
                name: 'Premium',
                price: 29.99,
                features: {
                    mockDataOnly: false,
                    aiEnabled: true,
                    dailyLimit: -1, // unlimited
                    advancedFeatures: true,
                    expertConsultations: 2 // per month
                }
            },
            professional: {
                name: 'Professional',
                price: 299.99,
                features: {
                    mockDataOnly: false,
                    aiEnabled: true,
                    dailyLimit: -1, // unlimited
                    advancedFeatures: true,
                    expertConsultations: -1, // unlimited
                    apiAccess: true,
                    customReports: true,
                    prioritySupport: true
                }
            }
        };

        // 按次付费价格
        this.payPerUse = {
            divination: {
                price: 0.99,
                name: 'AI占卜',
                nameEn: 'AI Divination',
                url: 'divination.html'
            },
            fengshui: {
                price: 1.99,
                name: '风水分析',
                nameEn: 'Feng Shui Analysis',
                url: 'fengshui.html'
            },
            iching: {
                price: 2.99,
                name: '易经智慧',
                nameEn: 'I-Ching Wisdom',
                url: 'iching.html'
            }
        };
    }

    /**
     * 获取当前用户的订阅计划
     */
    getCurrentPlan() {
        // 从localStorage获取用户信息
        const userStr = localStorage.getItem('user');
        if (!userStr) {
            return 'free';
        }

        try {
            const user = JSON.parse(userStr);
            return user.subscription || user.plan || 'free';
        } catch (e) {
            console.error('Error parsing user data:', e);
            return 'free';
        }
    }

    /**
     * 检查用户是否有权限使用AI功能 - 修正：默认允许使用，由后端处理额度
     */
    canUseAI() {
        // 只有 premium 和 professional 计划允许直接使用 AI
        const plan = this.getCurrentPlan();
        return plan === 'premium' || plan === 'professional';
    }

    /**
     * 检查用户是否只能使用模拟数据 - 修正：不再强制降级
     */
    isMockDataOnly() {
        const plan = this.getCurrentPlan();
        // 只有 free 计划用户强制使用模拟数据
        return plan === 'free';
    }

    /**
     * 获取用户的每日使用限制
     */
    getDailyLimit() {
        const plan = this.getCurrentPlan();
        return this.plans[plan]?.features.dailyLimit || 0;
    }

    /**
     * 检查今日使用次数
     */
    checkDailyUsage() {
        const today = new Date().toDateString();
        const usageKey = `usage_${today}`;
        const usage = parseInt(localStorage.getItem(usageKey) || '0');
        const limit = this.getDailyLimit();

        if (limit === -1) {
            return { allowed: true, remaining: -1 };
        }

        return {
            allowed: usage < limit,
            used: usage,
            remaining: Math.max(0, limit - usage),
            limit: limit
        };
    }

    /**
     * 增加今日使用次数
     */
    incrementDailyUsage() {
        const today = new Date().toDateString();
        const usageKey = `usage_${today}`;
        const usage = parseInt(localStorage.getItem(usageKey) || '0');
        localStorage.setItem(usageKey, (usage + 1).toString());
    }

    /**
     * 显示按次付费或升级提示
     */
    showUpgradePrompt(feature = 'AI功能', serviceType = null) {
        const currentLang = localStorage.getItem('preferredLanguage') || 'zh';
        const isEnglish = currentLang === 'en';

        const messages = {
            title: isEnglish ? 'Upgrade Required' : '需要升级',
            message: isEnglish
                ? `${feature} is only available for Premium and Professional members.`
                : `${feature}仅对高级版和专业版会员开放。`,
            upgrade: isEnglish ? 'Upgrade Now' : '立即升级',
            payPerUse: isEnglish ? 'Pay Per Use' : '按次付费',
            cancel: isEnglish ? 'Cancel' : '取消',
            or: isEnglish ? 'or' : '或者'
        };

        // 获取按次付费信息
        let payPerUseInfo = null;
        if (serviceType && this.payPerUse[serviceType]) {
            payPerUseInfo = this.payPerUse[serviceType];
        }

        // 创建模态框
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black/80 backdrop-blur-sm z-[9999] flex items-center justify-center p-4';
        modal.innerHTML = `
            <div class="bg-gradient-to-br from-deep-navy to-jade-dark border-2 border-mystic-gold rounded-2xl p-8 max-w-md w-full">
                <div class="text-center mb-6">
                    <div class="text-6xl mb-4">🔒</div>
                    <h3 class="text-2xl font-bold text-mystic-gold mb-2">${messages.title}</h3>
                    <p class="text-moon-silver">${messages.message}</p>
                </div>
                
                ${payPerUseInfo ? `
                    <div class="bg-gradient-to-r from-mystic-gold/20 to-yellow-400/20 rounded-lg p-4 border-2 border-mystic-gold mb-4">
                        <div class="text-center">
                            <div class="text-mystic-gold font-bold text-lg mb-2">💰 ${messages.payPerUse}</div>
                            <div class="text-3xl font-bold text-mystic-gold mb-2">$${payPerUseInfo.price}</div>
                            <div class="text-sm text-moon-silver mb-3">${isEnglish ? payPerUseInfo.nameEn : payPerUseInfo.name} - ${isEnglish ? 'Single Use' : '单次使用'}</div>
                            <button onclick="window.subscriptionManager.processPayPerUse('${serviceType}')" 
                                    class="w-full bg-mystic-gold text-deep-navy py-3 rounded-lg font-semibold hover:bg-yellow-400 transition-colors">
                                ${isEnglish ? 'Pay Now' : '立即支付'}
                            </button>
                        </div>
                    </div>
                    
                    <div class="text-center text-moon-silver/60 text-sm my-4">${messages.or}</div>
                ` : ''}
                
                <div class="space-y-4 mb-6">
                    <div class="bg-white/5 rounded-lg p-4 border border-mystic-gold/30">
                        <div class="flex justify-between items-center mb-2">
                            <span class="font-semibold text-mystic-gold">${isEnglish ? 'Premium' : '高级版'}</span>
                            <span class="text-2xl font-bold text-mystic-gold">$29.99/${isEnglish ? 'mo' : '月'}</span>
                        </div>
                        <ul class="text-sm text-moon-silver space-y-1">
                            <li>✓ ${isEnglish ? 'Full AI Analysis' : '完整AI分析功能'}</li>
                            <li>✓ ${isEnglish ? 'Unlimited Usage' : '无限次数使用'}</li>
                            <li>✓ ${isEnglish ? 'Expert Consultations (2/mo)' : '专家咨询 (2次/月)'}</li>
                        </ul>
                    </div>
                    
                    <div class="bg-white/5 rounded-lg p-4 border border-mystic-gold/30">
                        <div class="flex justify-between items-center mb-2">
                            <span class="font-semibold text-mystic-gold">${isEnglish ? 'Professional' : '专业版'}</span>
                            <span class="text-2xl font-bold text-mystic-gold">$299.99/${isEnglish ? '3 mos' : '三个月'}</span>
                        </div>
                        <ul class="text-sm text-moon-silver space-y-1">
                            <li>✓ ${isEnglish ? 'All Premium Features' : '所有高级版功能'}</li>
                            <li>✓ ${isEnglish ? 'API Access' : 'API访问'}</li>
                            <li>✓ ${isEnglish ? 'Custom Reports' : '定制报告'}</li>
                            <li>✓ ${isEnglish ? 'Priority Support' : '优先支持'}</li>
                        </ul>
                    </div>
                </div>
                
                <div class="flex gap-4">
                    <button onclick="this.closest('.fixed').remove()" 
                            class="flex-1 bg-moon-silver/20 text-moon-silver py-3 rounded-lg font-semibold hover:bg-moon-silver/30 transition-colors">
                        ${messages.cancel}
                    </button>
                    <button onclick="if(window.statePreserver) window.statePreserver.saveCurrentPage(); window.location.href='payment.html'" 
                            class="flex-1 bg-mystic-gold text-deep-navy py-3 rounded-lg font-semibold hover:bg-yellow-400 transition-colors">
                        ${messages.upgrade}
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // 点击背景关闭
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }

    /**
     * 处理按次付费
     */
    async processPayPerUse(serviceType) {
        const currentLang = localStorage.getItem('preferredLanguage') || 'zh';
        const isEnglish = currentLang === 'en';
        const payInfo = this.payPerUse[serviceType];

        if (!payInfo) {
            console.error('Invalid service type:', serviceType);
            return;
        }

        // 保存当前页面状态，以便支付后恢复
        if (window.statePreserver) {
            window.statePreserver.saveCurrentPage();
        }

        // 关闭当前选择模态框
        const modal = document.querySelector('.fixed.inset-0:not(.payment-processing-modal)');
        if (modal) modal.remove();

        try {
            // 显示支付处理提示
            this.showPaymentProcessing(payInfo, isEnglish);

            // 1. 调用支付服务创建支付意图
            const paymentService = window.EnhancedStripePaymentService || window.StripePaymentService;
            if (!paymentService) throw new Error('Payment service not found');

            // 检查商品 ID 是否需要映射
            const productId = `product_${serviceType}`;

            // 2. 调用商品购买逻辑 (Stripe Client 处理弹窗和确认)
            // 注意：因为 purchaseProduct 内部可能已经处理了确认逻辑，我们在这里直接调用
            const result = await paymentService.purchaseProduct(productId, 1, {
                serviceType: serviceType,
                name: 'User', // 理想情况下从 auth 获取
                email: 'user@example.com'
            });

            // 关闭正在处理模态框
            const processingModal = document.querySelector('.payment-processing-modal');
            if (processingModal) processingModal.remove();

            if (result.success) {
                // 3. 授予一次使用权限
                this.grantSingleUse(serviceType);

                // 4. 显示支付成功提示
                this.showPaymentSuccess(payInfo, isEnglish);
            } else {
                throw new Error(result.error || 'Payment failed');
            }
        } catch (error) {
            console.error('Payment error:', error);
            const processingModal = document.querySelector('.payment-processing-modal');
            if (processingModal) processingModal.remove();

            if (window.showErrorMessage) {
                window.showErrorMessage(isEnglish ? 'Payment Failed' : '支付失败', error.message);
            } else {
                alert(error.message);
            }
        }
    }

    /**
     * 显示支付处理中
     */
    showPaymentProcessing(payInfo, isEnglish) {
        const modal = document.createElement('div');
        modal.className = 'payment-processing-modal fixed inset-0 bg-black/80 backdrop-blur-sm z-[9999] flex items-center justify-center p-4';
        modal.innerHTML = `
            <div class="bg-gradient-to-br from-deep-navy to-jade-dark border-2 border-mystic-gold rounded-2xl p-8 max-w-md w-full text-center">
                <div class="text-6xl mb-4">💳</div>
                <h3 class="text-2xl font-bold text-mystic-gold mb-2">${isEnglish ? 'Processing Payment' : '正在处理支付'}</h3>
                <p class="text-moon-silver mb-4">${isEnglish ? 'Please wait...' : '请稍候...'}</p>
                <div class="flex justify-center">
                    <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-mystic-gold"></div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    /**
     * 显示支付成功
     */
    showPaymentSuccess(payInfo, isEnglish) {
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black/80 backdrop-blur-sm z-[9999] flex items-center justify-center p-4';
        modal.innerHTML = `
            <div class="bg-gradient-to-br from-deep-navy to-jade-dark border-2 border-mystic-gold rounded-2xl p-8 max-w-md w-full text-center">
                <div class="text-6xl mb-4">✅</div>
                <h3 class="text-2xl font-bold text-green-400 mb-2">${isEnglish ? 'Payment Successful!' : '支付成功！'}</h3>
                <p class="text-moon-silver mb-4">
                    ${isEnglish ? `You can now use ${payInfo.nameEn}` : `您现在可以使用${payInfo.name}`}
                </p>
                <button onclick="window.subscriptionManager.handleContinueAfterPay('${payInfo.url}')" 
                        class="bg-mystic-gold text-deep-navy px-8 py-3 rounded-lg font-semibold hover:bg-yellow-400 transition-colors">
                    ${isEnglish ? 'Continue' : '继续'}
                </button>
            </div>
        `;
        document.body.appendChild(modal);
    }

    /**
     * 支付成功后的继续逻辑：尝试恢复状态并跳转
     */
    handleContinueAfterPay(targetUrl) {
        // 关闭当前页面的模态框
        const modal = document.querySelector('.fixed.inset-0');
        if (modal) modal.remove();

        const currentPath = window.location.pathname.split('/').pop() || 'index.html';

        if (currentPath === targetUrl) {
            // 如果已经在目标页面，尝试恢复状态
            if (window.statePreserver) {
                window.statePreserver.restoreCurrentPage();
            } else {
                window.location.reload();
            }
        } else {
            // 如果在不同页面（如从 payment.html 过来），跳转到对应页面
            // statePreserver 已经在跳转前保存了（如果是从 showUpgradePrompt 跳转的话）
            window.location.href = targetUrl;
        }
    }

    /**
     * 授予单次使用权限
     */
    grantSingleUse(serviceType) {
        const key = `singleUse_${serviceType}`;
        const count = parseInt(localStorage.getItem(key) || '0');
        localStorage.setItem(key, (count + 1).toString());
        console.log(`✅ 已授予 ${serviceType} 单次使用权限`);
    }

    /**
     * 检查是否有单次使用权限
     */
    hasSingleUse(serviceType) {
        const key = `singleUse_${serviceType}`;
        const count = parseInt(localStorage.getItem(key) || '0');
        return count > 0;
    }

    /**
     * 消耗单次使用权限
     */
    consumeSingleUse(serviceType) {
        const key = `singleUse_${serviceType}`;
        const count = parseInt(localStorage.getItem(key) || '0');
        if (count > 0) {
            localStorage.setItem(key, (count - 1).toString());
            console.log(`✅ 已消耗 ${serviceType} 单次使用权限，剩余: ${count - 1}`);
            return true;
        }
        return false;
    }

    /**
     * 检查用户是否为高级会员
     */
    isPremiumUser() {
        const plan = this.getCurrentPlan();
        return plan === 'premium' || plan === 'professional';
    }

    /**
     * 检查是否有任何类型的单次使用积分
     */
    hasSingleUseCredits() {
        const services = ['divination', 'fengshui', 'iching'];
        return services.some(service => this.hasSingleUse(service));
    }

    /**
     * 检查是否可以使用服务（包括订阅和按次付费）
     */
    canUseService(serviceType) {
        // 如果是订阅用户，直接允许
        if (this.canUseAI()) {
            return { allowed: true, type: 'subscription' };
        }

        // 检查是否有单次使用权限
        if (this.hasSingleUse(serviceType)) {
            return { allowed: true, type: 'singleUse' };
        }

        return { allowed: false, type: 'none' };
    }

    /**
     * 显示使用限制提示
     */
    showLimitReachedPrompt() {
        const currentLang = localStorage.getItem('preferredLanguage') || 'zh';
        const isEnglish = currentLang === 'en';
        const usage = this.checkDailyUsage();

        const messages = {
            title: isEnglish ? 'Daily Limit Reached' : '今日使用次数已达上限',
            message: isEnglish
                ? `You have used ${usage.used} of ${usage.limit} free readings today. Upgrade to Premium for unlimited access.`
                : `您今天已使用 ${usage.used}/${usage.limit} 次免费测算。升级到高级版即可无限使用。`,
            upgrade: isEnglish ? 'Upgrade Now' : '立即升级',
            cancel: isEnglish ? 'OK' : '知道了'
        };

        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black/80 backdrop-blur-sm z-[9999] flex items-center justify-center p-4';
        modal.innerHTML = `
            <div class="bg-gradient-to-br from-deep-navy to-jade-dark border-2 border-mystic-gold rounded-2xl p-8 max-w-md w-full">
                <div class="text-center mb-6">
                    <div class="text-6xl mb-4">⏰</div>
                    <h3 class="text-2xl font-bold text-mystic-gold mb-2">${messages.title}</h3>
                    <p class="text-moon-silver">${messages.message}</p>
                </div>
                
                <div class="flex gap-4">
                    <button onclick="this.closest('.fixed').remove()" 
                            class="flex-1 bg-moon-silver/20 text-moon-silver py-3 rounded-lg font-semibold hover:bg-moon-silver/30 transition-colors">
                        ${messages.cancel}
                    </button>
                    <button onclick="if(window.statePreserver) window.statePreserver.saveCurrentPage(); window.location.href='payment.html'" 
                            class="flex-1 bg-mystic-gold text-deep-navy py-3 rounded-lg font-semibold hover:bg-yellow-400 transition-colors">
                        ${messages.upgrade}
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }

    /**
     * 在页面上显示订阅状态
     */
    displaySubscriptionStatus() {
        const plan = this.getCurrentPlan();
        const planInfo = this.plans[plan];
        const usage = this.checkDailyUsage();
        const currentLang = localStorage.getItem('preferredLanguage') || 'zh';
        const isEnglish = currentLang === 'en';

        // 创建状态显示元素
        const statusBar = document.createElement('div');
        statusBar.className = 'fixed top-20 right-4 bg-gradient-to-r from-jade-dark to-deep-navy border border-mystic-gold/30 rounded-lg p-4 shadow-lg z-40 max-w-xs';
        statusBar.innerHTML = `
            <div class="flex items-center justify-between mb-2">
                <span class="text-sm font-semibold text-mystic-gold">${planInfo.name} Plan</span>
                ${plan === 'free' ? `<span class="text-xs bg-mystic-gold text-deep-navy px-2 py-1 rounded">${isEnglish ? 'Free' : '免费版'}</span>` : ''}
            </div>
            ${plan === 'free' ? `
                <div class="text-xs text-moon-silver mb-2">
                    ${isEnglish ? 'Today' : '今日使用'}: ${usage.used}/${usage.limit}
                </div>
                <button onclick="window.subscriptionManager.showUpgradePrompt()" 
                        class="w-full bg-mystic-gold text-deep-navy text-xs py-2 rounded font-semibold hover:bg-yellow-400 transition-colors">
                    ${isEnglish ? 'Upgrade to Unlock AI' : '升级解锁AI功能'}
                </button>
            ` : `
                <div class="text-xs text-green-400">
                    ✓ ${isEnglish ? 'AI Enabled' : 'AI功能已启用'}
                </div>
            `}
        `;

        document.body.appendChild(statusBar);

        // 5秒后自动隐藏
        setTimeout(() => {
            statusBar.style.opacity = '0';
            statusBar.style.transition = 'opacity 0.5s';
            setTimeout(() => statusBar.remove(), 500);
        }, 5000);
    }
}

// 创建全局实例
window.subscriptionManager = new SubscriptionManager();

// 页面加载时显示订阅状态
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        // 只在主要功能页面显示
        const showOnPages = ['divination.html', 'fengshui.html', 'iching.html'];
        const currentPage = window.location.pathname.split('/').pop();
        if (showOnPages.includes(currentPage)) {
            window.subscriptionManager.displaySubscriptionStatus();
        }
    });
} else {
    const showOnPages = ['divination.html', 'fengshui.html', 'iching.html'];
    const currentPage = window.location.pathname.split('/').pop();
    if (showOnPages.includes(currentPage)) {
        window.subscriptionManager.displaySubscriptionStatus();
    }
}

console.log('[SubscriptionManager] Initialized');
