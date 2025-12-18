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
                        <div class="font-semibold">体验模式</div>
                        <div class="text-sm opacity-90">当前使用演示数据，体验完整功能</div>
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
                if (!window.aiService && window.AIService) {
                    window.aiService = new window.AIService();
                }

                if (!window.aiService) {
                    throw new Error('AI服务未初始化');
                }

                console.log('🤖 使用真实AI服务进行分析');
                const result = await window.aiService.analyzeDivination(userData);

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
            // 获取当前语言
            const language = localStorage.getItem('preferredLanguage') || 'zh';
            const isEnglish = language === 'en';

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
            // 基础模拟数据
            const baseData = {
                personality: isEnglish ? [
                    'Creative and intuitive thinker',
                    'Natural leadership potential',
                    'Strong sense of responsibility',
                    'Excellent adaptability',
                    'Good at interpersonal relationships'
                ] : [
                    '富有创造力和直觉思维',
                    '天生的领导潜能',
                    '强烈的责任感',
                    '适应能力出众',
                    '善于人际交往'
                ],

                career: isEnglish ? [
                    'Promising opportunities in creative fields',
                    'Leadership positions suit you well',
                    `${new Date().getFullYear()} brings financial growth`,
                    'Consider entrepreneurial ventures',
                    'International opportunities await'
                ] : [
                    '创意领域前景光明',
                    '领导职位很适合您',
                    `${new Date().getFullYear()}年财运提升`,
                    '可考虑创业发展',
                    '国际机遇在前方'
                ],

                wealth: isEnglish ? [
                    'Steady income growth expected',
                    'Be selective with investments',
                    'Benefactors will bring opportunities',
                    'Second half of year looks better',
                    'Avoid high-risk investments'
                ] : [
                    '收入稳步增长可期',
                    '投资需要精挑细选',
                    '贵人将带来机遇',
                    '下半年运势更佳',
                    '避免高风险投资'
                ],

                love: isEnglish ? [
                    'Loyal and committed relationships',
                    'Strong family bonds',
                    'Natural peacemaker',
                    'Attract supportive partners',
                    'Marriage prospects are positive'
                ] : [
                    '专一且深情的关系',
                    '家庭纽带紧密',
                    '天生的调解者',
                    '吸引支持型伴侣',
                    '婚姻前景积极'
                ],

                health: isEnglish ? [
                    'Overall health outlook is good',
                    'Manage work stress effectively',
                    'Regular exercise benefits you',
                    'Pay attention to digestive health',
                    'Maintain good sleep habits'
                ] : [
                    '整体健康前景良好',
                    '有效管理工作压力',
                    '定期运动对您有益',
                    '注意消化系统健康',
                    '保持良好睡眠习惯'
                ],

                elements: {
                    wood: 70 + Math.floor(Math.random() * 20) - 10,
                    fire: 45 + Math.floor(Math.random() * 20) - 10,
                    earth: 80 + Math.floor(Math.random() * 20) - 10,
                    metal: 60 + Math.floor(Math.random() * 20) - 10,
                    water: 35 + Math.floor(Math.random() * 20) - 10
                },

                luckyColors: isEnglish ?
                    ['Golden', 'Silver', 'Purple', 'Emerald', 'Amber'] :
                    ['金色', '银色', '紫色', '翡翠绿', '琥珀色'],

                luckyNumbers: [3, 7, 9, 21, 36].map(n => n + Math.floor(Math.random() * 5)),

                zodiacAnalysis: isEnglish ?
                    'Your zodiac traits reveal exceptional adaptability and wisdom. You excel in social interactions and have a natural ability to identify and seize opportunities.' :
                    '您的生肖特质显现出非凡的适应力和智慧。在社交互动中表现卓越，天生具备识别和把握机遇的能力。',

                yearForecast: isEnglish ?
                    `${new Date().getFullYear()} shows overall rising fortune, particularly in career and financial sectors. The first half requires steady foundation-building, while the second half promises breakthrough progress.` :
                    `${new Date().getFullYear()}年整体运势呈上升趋势，特别是在事业和财务领域。上半年需稳固根基，下半年将有突破性进展。`
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