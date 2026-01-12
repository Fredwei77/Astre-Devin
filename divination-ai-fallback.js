/**
 * 占卜页面AI服务回退增强模块
 * Enhanced AI Service Fallback for Divination Page
 */

(function () {
    'use strict';

    /**
     * 占卜页面AI服务状态监控器
     */
    class DivinationAIFallback {
        constructor() {
            this.isAIAvailable = false;
            this.isConfigLoaded = false;
            this.useMockData = false;
            this.lastFailureTime = 0;
            this.failureCount = 0;
            this.maxRetries = 3;

            this.init();
        }

        init() {
            // 监控配置加载状态
            this.checkConfigStatus();

            // 监控AI服务状态
            this.checkAIServiceStatus();

            // 设置定期检查
            this.setupPeriodicChecks();

            console.log('🔧 占卜页面AI服务回退监控器已初始化');
        }

        /**
         * 检查配置加载状态
         */
        checkConfigStatus() {
            const checkConfig = () => {
                if (typeof CONFIG !== 'undefined' && CONFIG.PROMPTS && CONFIG.PROMPTS.DIVINATION) {
                    this.isConfigLoaded = true;
                    console.log('✅ CONFIG已加载，占卜提示词可用');

                    // 检查是否设置为模拟模式
                    if (CONFIG.FEATURES && CONFIG.FEATURES.MOCK_MODE === true) {
                        this.useMockData = true;
                        console.log('🎭 配置设置为模拟模式');
                    }
                } else {
                    console.warn('⚠️ CONFIG或占卜提示词未加载');
                }
            };

            // 立即检查
            checkConfig();

            // 如果未加载，等待一段时间后再检查
            if (!this.isConfigLoaded) {
                setTimeout(checkConfig, 1000);
                setTimeout(checkConfig, 3000);
            }
        }

        /**
         * 检查AI服务状态
         */
        checkAIServiceStatus() {
            const checkAI = () => {
                if (window.aiService || window.AIService) {
                    this.isAIAvailable = true;
                    console.log('✅ AI服务已加载');

                    // 尝试测试连接
                    this.testAIConnection();
                } else {
                    console.warn('⚠️ AI服务未加载');
                    this.scheduleAIServiceCheck();
                }
            };

            // 立即检查
            checkAI();

            // DOM加载完成后再次检查
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', checkAI);
            }
        }

        /**
         * 测试AI连接
         */
        async testAIConnection() {
            try {
                if (!window.aiService && window.AIService) {
                    window.aiService = new window.AIService();
                }

                if (window.aiService && typeof window.aiService.testConnection === 'function') {
                    const result = await window.aiService.testConnection();
                    if (result.success) {
                        console.log('✅ AI服务连接测试成功');
                        this.failureCount = 0;
                    } else {
                        console.warn('⚠️ AI服务连接测试失败:', result.error);
                        this.handleAIFailure();
                    }
                }
            } catch (error) {
                console.error('❌ AI连接测试异常:', error);
                this.handleAIFailure();
            }
        }

        /**
         * 处理AI服务失败
         */
        handleAIFailure() {
            this.failureCount++;
            this.lastFailureTime = Date.now();

            if (this.failureCount >= this.maxRetries) {
                console.log(`🎭 AI服务连续失败${this.failureCount}次，切换到模拟数据模式`);
                this.useMockData = true;
                this.showFallbackNotification();
            }
        }

        /**
         * 显示回退通知
         */
        showFallbackNotification() {
            // 创建友好的提示
            const notification = document.createElement('div');
            notification.className = 'fixed top-4 right-4 bg-amber-500/90 text-white px-6 py-3 rounded-lg shadow-lg z-50';
            notification.innerHTML = `
                <div class="flex items-center space-x-2">
                    <div class="w-5 h-5 animate-spin">
                        ⚡
                    </div>
                    <div>
                        <div class="font-semibold" data-i18n="divination.fallback.title">${window.i18n ? window.i18n.t('divination.fallback.title') : 'Experience Mode'}</div>
                        <div class="text-sm opacity-90" data-i18n="divination.fallback.desc">${window.i18n ? window.i18n.t('divination.fallback.desc') : 'Currently using demo data'}</div>
                    </div>
                </div>
            `;

            document.body.appendChild(notification);

            // 5秒后自动隐藏
            setTimeout(() => {
                notification.remove();
            }, 5000);
        }

        /**
         * 安排AI服务检查
         */
        scheduleAIServiceCheck() {
            setTimeout(() => {
                this.checkAIServiceStatus();
            }, 2000);
        }

        /**
         * 设置定期检查
         */
        setupPeriodicChecks() {
            // 每30秒检查一次AI服务状态（如果正在使用模拟数据）
            setInterval(() => {
                if (this.useMockData && this.failureCount > 0) {
                    // 尝试恢复AI服务
                    const timeSinceLastFailure = Date.now() - this.lastFailureTime;
                    if (timeSinceLastFailure > 60000) { // 1分钟后重试
                        console.log('🔄 尝试恢复AI服务...');
                        this.failureCount = 0;
                        this.useMockData = false;
                        this.testAIConnection();
                    }
                }
            }, 30000);
        }

        /**
         * 增强的占卜分析方法
         */
        async performDivination(userData) {
            console.log('🔮 开始执行增强的占卜分析...');

            // 检查是否应该使用模拟数据
            if (this.shouldUseMockData()) {
                console.log('📊 使用模拟数据进行占卜分析');
                return await this.getMockDivinationData(userData);
            }

            // 尝试使用真实AI服务
            try {
                let aiService = window.aiService;
                if (!aiService && window.AIService) {
                    console.log('🔄 尝试创建新的 AIService 实例...');
                    aiService = new window.AIService();
                }

                if (!aiService) {
                    throw new Error(window.i18n ? window.i18n.t('divination.followup.initError') : 'AI service not initialized');
                }

                console.log('🤖 使用真实AI服务进行分析');
                const result = await aiService.analyzeDivination(userData);

                // 重置失败计数
                this.failureCount = 0;
                this.useMockData = false;

                return result;

            } catch (error) {
                console.error('❌ AI分析失败:', error);
                this.handleAIFailure();

                // 回退到模拟数据
                console.log('🎭 回退到模拟数据');
                return await this.getMockDivinationData(userData);
            }
        }

        /**
         * 检查是否应该使用模拟数据 - 修正：减少自动降级，优先尝试真实 AI
         */
        shouldUseMockData() {
            // 仅在配置明确开启模拟模式时才强制使用
            if (typeof CONFIG !== 'undefined' && CONFIG.FEATURES && CONFIG.FEATURES.MOCK_MODE === true) {
                return true;
            }

            // 如果是因为连续网络错误且短期内无法恢复
            if (this.useMockData && (Date.now() - this.lastFailureTime < 60000)) {
                return true;
            }

            return false;
        }

        /**
         * 获取增强的模拟占卜数据
         */
        async getMockDivinationData(userData) {
            // 获取当前语言 - 优先使用 i18n 实例
            const language = (window.i18n && window.i18n.currentLanguage) || localStorage.getItem('preferredLanguage') || 'zh';
            const isEnglish = language === 'en';

            console.log('[Divination Fallback] 生成模拟数据 - 当前语言:', language);

            // 根据用户输入生成更个性化的模拟数据
            const personalizedData = this.generatePersonalizedMockData(userData, isEnglish);

            // 模拟网络延迟
            await new Promise(resolve => setTimeout(resolve, 1500));

            console.log('✨ 生成个性化模拟数据:', personalizedData);
            return personalizedData;
        }

        /**
         * 根据用户数据生成个性化模拟数据
         */
        generatePersonalizedMockData(userData, isEnglish) {
            // Helper to get translated array
            const getSimulatedArray = (category) => {
                if (window.i18n) {
                    return [1, 2, 3, 4, 5].map(i => window.i18n.t(`analysis.simulation.${category}.${i}`));
                }
                // Fallback for initialization
                return isEnglish ?
                    [`Mock ${category} 1`, `Mock ${category} 2`, `Mock ${category} 3`, `Mock ${category} 4`, `Mock ${category} 5`] :
                    [`模拟${category} 1`, `模拟${category} 2`, `模拟${category} 3`, `模拟${category} 4`, `模拟${category} 5`];
            };

            // 基础模拟数据
            const baseData = {
                personality: getSimulatedArray('personality'),
                career: getSimulatedArray('career'),
                wealth: getSimulatedArray('wealth'),
                love: getSimulatedArray('love'),
                health: getSimulatedArray('health'),

                elements: {
                    wood: 70 + Math.floor(Math.random() * 20) - 10,
                    fire: 45 + Math.floor(Math.random() * 20) - 10,
                    earth: 80 + Math.floor(Math.random() * 20) - 10,
                    metal: 60 + Math.floor(Math.random() * 20) - 10,
                    water: 35 + Math.floor(Math.random() * 20) - 10
                },

                luckyColors: window.i18n ?
                    ['gold', 'silver', 'purple', 'green', 'orange'].map(color => window.i18n.t(`analysis.simulation.luckyColors.${color}`)) :
                    (isEnglish ? ['Golden', 'Silver', 'Purple', 'Green', 'Orange'] : ['金色', '银色', '紫色', '绿色', '橙色']),

                luckyNumbers: [3, 7, 9, 21, 36].map(n => n + Math.floor(Math.random() * 5)),

                zodiacAnalysis: window.i18n ?
                    window.i18n.t('analysis.simulation.zodiacAnalysis') :
                    (isEnglish ? 'Your zodiac traits show... [fallback]' : '您的生肖特质显示... [回退]'),

                yearForecast: window.i18n ?
                    window.i18n.t('analysis.simulation.yearForecast').replace('{year}', new Date().getFullYear()) :
                    (isEnglish ? `${new Date().getFullYear()} shows... [fallback]` : `${new Date().getFullYear()}年显示... [回退]`)
            };

            // 根据用户生日或姓名调整某些数值（如果有的话）
            if (userData.birthDate || userData.name) {
                // 简单的个性化调整
                const hash = this.simpleHash(userData.birthDate || userData.name || 'default');
                baseData.elements.wood = Math.max(20, Math.min(100, baseData.elements.wood + (hash % 30) - 15));
                baseData.elements.fire = Math.max(20, Math.min(100, baseData.elements.fire + ((hash * 7) % 30) - 15));
            }

            return baseData;
        }

        /**
         * 简单哈希函数用于个性化
         */
        simpleHash(str) {
            let hash = 0;
            for (let i = 0; i < str.length; i++) {
                const char = str.charCodeAt(i);
                hash = ((hash << 5) - hash) + char;
                hash = hash & hash; // 转换为32位整数
            }
            return Math.abs(hash);
        }

        /**
         * 获取服务状态
         */
        getStatus() {
            return {
                isAIAvailable: this.isAIAvailable,
                isConfigLoaded: this.isConfigLoaded,
                useMockData: this.useMockData,
                failureCount: this.failureCount,
                mode: this.shouldUseMockData() ? 'Mock Data' : 'Real AI'
            };
        }
    }

    /**
     * 初始化回退系统
     */
    function initializeFallbackSystem() {
        // 创建全局实例
        window.divinationAIFallback = new DivinationAIFallback();

        // 替换现有的占卜分析方法（如果存在）
        if (window.main && typeof window.main.performAnalysis === 'function') {
            const originalMethod = window.main.performAnalysis.bind(window.main);

            window.main.performAnalysis = async function (userData) {
                try {
                    return await window.divinationAIFallback.performDivination(userData);
                } catch (error) {
                    console.error('增强占卜分析失败:', error);
                    return originalMethod(userData);
                }
            };

            console.log('✅ 已替换主占卜分析方法为增强版本');
        }

        console.log('🚀 占卜页面AI服务回退系统已初始化');
    }

    // 页面加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeFallbackSystem);
    } else {
        initializeFallbackSystem();
    }

    // 也可以立即初始化（防止DOMContentLoaded已经触发）
    setTimeout(initializeFallbackSystem, 100);

})();