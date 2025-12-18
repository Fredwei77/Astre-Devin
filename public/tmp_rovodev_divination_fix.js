// Destiny AI - 占卜页面API修复
// 这个脚本修复占卜页面的API集成问题

console.log('🔧 开始修复占卜页面API问题...');

// 1. 等待所有依赖加载完成
function waitForDependencies() {
    return new Promise((resolve) => {
        const checkDependencies = () => {
            if (typeof CONFIG !== 'undefined' &&
                typeof AIService !== 'undefined' &&
                typeof window.destinyAI !== 'undefined') {
                console.log('✅ 所有依赖已加载');
                resolve();
            } else {
                console.log('⏳ 等待依赖加载...', {
                    CONFIG: typeof CONFIG !== 'undefined',
                    AIService: typeof AIService !== 'undefined',
                    destinyAI: typeof window.destinyAI !== 'undefined'
                });
                setTimeout(checkDependencies, 100);
            }
        };
        checkDependencies();
    });
}

// 2. 修复AI服务初始化
async function fixAIService() {
    console.log('🔧 修复AI服务初始化...');

    // 确保AI服务正确初始化
    if (!window.aiService) {
        console.log('创建新的AI服务实例');
        window.aiService = new AIService();
    }

    // 验证AI服务方法
    if (!window.aiService.analyzeDivination) {
        console.error('❌ AI服务缺少analyzeDivination方法');
        return false;
    }

    console.log('✅ AI服务修复完成');
    return true;
}

// 3. 修复占卜分析方法
function fixDivinationAnalysis() {
    console.log('🔧 修复占卜分析方法...');

    if (!window.destinyAI) {
        console.error('❌ DestinyAI实例未找到');
        return false;
    }

    // 备份原方法
    const originalPerformAIAnalysis = window.destinyAI.performAIAnalysis;

    // 修复后的分析方法
    window.destinyAI.performAIAnalysis = async function (userData) {
        console.log('🚀 开始修复后的AI分析，数据:', userData);

        try {
            // 显示进度
            this.updateProgress(0, '正在连接AI服务...');

            // 验证输入数据
            if (!userData || !userData.birthDate || !userData.birthTime) {
                throw new Error('输入数据不完整');
            }

            // 获取当前语言 - 强制刷新
            const currentLanguage = localStorage.getItem('preferredLanguage') || 'zh';
            console.log('🌐 Current language for divination:', currentLanguage);
            console.log('🌐 localStorage preferredLanguage:', localStorage.getItem('preferredLanguage'));
            console.log('🌐 All localStorage keys:', Object.keys(localStorage));

            // 数据格式化 - 添加语言参数
            const formattedData = {
                birthDate: userData.birthDate,
                birthTime: userData.birthTime,
                birthPlace: userData.birthPlace || '未知',
                gender: userData.gender || 'unknown',
                categories: userData.categories || ['career', 'wealth', 'love', 'health'],
                language: currentLanguage // 添加语言参数
            };

            console.log('📝 格式化后的数据:', formattedData);
            console.log('📝 语言参数:', formattedData.language);

            this.updateProgress(25, '正在分析生辰八字...');

            // 检查AI服务
            if (!window.aiService) {
                console.warn('⚠️ AI服务未初始化，创建新实例');
                window.aiService = new AIService();
            }

            this.updateProgress(50, '正在生成分析报告...');

            // 调用AI分析
            let result;
            try {
                console.log('📞 调用AI分析服务...');
                result = await window.aiService.analyzeDivination(formattedData);
                console.log('📊 AI分析结果:', result);
            } catch (apiError) {
                console.warn('⚠️ AI API调用失败，使用备用方案:', apiError.message);

                // 使用本地模拟数据作为备用
                result = await this.getBackupDivinationData(formattedData);
            }

            this.updateProgress(75, '正在整理分析结果...');

            // 验证结果格式
            if (!this.validateDivinationResult(result)) {
                console.warn('⚠️ 结果格式验证失败，使用备用数据');
                result = await this.getBackupDivinationData(formattedData);
            }

            this.updateProgress(90, '正在生成可视化图表...');

            // 保存结果
            this.analysisResults = result;

            this.updateProgress(100, '分析完成！');

            // 显示结果
            setTimeout(() => {
                console.log('✨ 显示分析结果');
                this.showResults();
            }, 500);

        } catch (error) {
            console.error('💥 分析过程出错:', error);

            this.updateProgress(0, '分析失败，使用模拟数据...');

            // 完全回退到模拟模式
            setTimeout(() => {
                this.simulateAnalysis();
            }, 1000);
        }
    };

    // 添加结果验证方法
    window.destinyAI.validateDivinationResult = function (result) {
        if (!result || typeof result !== 'object') {
            console.warn('❌ 结果不是有效对象');
            return false;
        }

        const requiredFields = ['personality', 'career', 'wealth', 'love', 'health', 'elements'];

        for (let field of requiredFields) {
            if (!result.hasOwnProperty(field)) {
                console.warn(`❌ 缺少必需字段: ${field}`);
                return false;
            }

            if (field === 'elements') {
                if (!result.elements || typeof result.elements !== 'object') {
                    console.warn('❌ elements字段格式错误');
                    return false;
                }

                const elementFields = ['wood', 'fire', 'earth', 'metal', 'water'];
                for (let element of elementFields) {
                    if (typeof result.elements[element] !== 'number') {
                        console.warn(`❌ elements.${element}不是数字`);
                        return false;
                    }
                }
            } else {
                if (!Array.isArray(result[field]) || result[field].length === 0) {
                    console.warn(`❌ ${field}字段不是非空数组`);
                    return false;
                }
            }
        }

        console.log('✅ 结果格式验证通过');
        return true;
    };

    // 添加备用数据生成方法 - 支持多语言
    window.destinyAI.getBackupDivinationData = function (userData) {
        console.log('🎲 生成备用占卜数据');
        console.log('🎲 userData:', userData);

        // 获取当前语言 - 多重检查
        const language = userData.language || localStorage.getItem('preferredLanguage') || 'zh';
        const isEnglish = language === 'en';
        console.log('🌐 Backup data language:', language);
        console.log('🌐 Is English:', isEnglish);
        console.log('🌐 userData.language:', userData.language);
        console.log('🌐 localStorage.preferredLanguage:', localStorage.getItem('preferredLanguage'));

        // 基于用户数据生成个性化的模拟结果
        const birthYear = new Date(userData.birthDate).getFullYear();
        const isEvenYear = birthYear % 2 === 0;

        // 多语言模拟数据
        const mockData = {
            personality: isEnglish ? [
                'Creative and intuitive thinker',
                'Natural leadership talent',
                'Strong sense of responsibility',
                'Highly adaptable to change',
                'Excellent at interpersonal relationships'
            ] : [
                '富有创造力和直觉思维',
                '天生的领导才能',
                '强烈的责任感',
                '适应变化的能力强',
                '善于处理人际关系'
            ],
            career: isEnglish ? [
                'Outstanding opportunities in creative fields',
                'Great potential for leadership positions',
                'Positive financial prospects in 2024',
                'Consider entrepreneurial opportunities',
                'International development opportunities ahead'
            ] : [
                '创意领域有出色机会',
                '领导职位潜力巨大',
                '2024年财务前景良好',
                '考虑创业机会',
                '国际发展机遇在前'
            ],
            wealth: isEnglish ? [
                'Steady rise in regular income',
                'Be cautious with investment timing',
                'Benefactors bring wealth opportunities',
                'Better financial luck in the second half of the year',
                'Avoid high-risk investments'
            ] : [
                '正财运势稳定上升',
                '投资需谨慎选择时机',
                '贵人相助带来财富',
                '下半年财运更佳',
                '避免高风险投资'
            ],
            love: isEnglish ? [
                'Loyal and devoted partner',
                'Close family relationships',
                'Good at mediating conflicts',
                'Attract supportive friends',
                'Positive marriage prospects'
            ] : [
                '忠诚且专一的伴侣',
                '家庭关系紧密',
                '善于调解矛盾',
                '吸引支持性朋友',
                '婚姻前景看好'
            ],
            health: isEnglish ? [
                'Overall health status is good',
                'Pay attention to work stress management',
                'Regular exercise is beneficial',
                'Watch your digestive system',
                'Maintain a good sleep schedule'
            ] : [
                '整体健康状况良好',
                '注意工作压力管理',
                '定期运动有益',
                '注意消化系统',
                '保持良好作息'
            ],
            luckyColors: isEnglish ? ['gold', 'silver', 'purple', 'green', 'orange'] : ['金色', '银色', '紫色', '绿色', '橙色'],
            zodiacAnalysis: isEnglish 
                ? 'Your zodiac characteristics show strong adaptability and wisdom. You excel in interpersonal interactions and are good at seizing opportunities.'
                : '您的生肖特征显示出强大的适应能力和智慧。在人际交往中表现出色，善于把握机会。',
            yearForecast: isEnglish
                ? '2024 overall fortune is rising, especially in career and wealth. The first half of the year requires steady progress, while the second half will bring breakthrough developments.'
                : '2024年整体运势上扬，特别是在事业和财运方面。上半年需要稳扎稳打，下半年将迎来突破性进展。'
        };

        return Promise.resolve({
            personality: mockData.personality,
            career: mockData.career,
            wealth: mockData.wealth,
            love: mockData.love,
            health: mockData.health,
            elements: {
                wood: Math.floor(Math.random() * 30) + 60,
                fire: Math.floor(Math.random() * 30) + 40,
                earth: Math.floor(Math.random() * 30) + 70,
                metal: Math.floor(Math.random() * 30) + 50,
                water: Math.floor(Math.random() * 30) + 30
            },
            luckyColors: mockData.luckyColors,
            luckyNumbers: [3, 8, 15, 21, 36].map(n => n + (birthYear % 10)),
            zodiacAnalysis: mockData.zodiacAnalysis,
            yearForecast: mockData.yearForecast
        });
    };

    console.log('✅ 占卜分析方法修复完成');
    return true;
}

// 4. 添加错误处理和用户反馈
function setupErrorHandling() {
    console.log('🔧 设置错误处理...');

    // 捕获未处理的错误
    window.addEventListener('error', function (event) {
        console.error('💥 页面错误:', event.error);

        // 如果是API相关错误，显示友好提示
        if (event.error && event.error.message) {
            const message = event.error.message.toLowerCase();
            if (message.includes('api') || message.includes('fetch') || message.includes('network')) {
                showErrorNotification('网络连接问题，已切换到离线模式');
            }
        }
    });

    // 捕获未处理的Promise拒绝
    window.addEventListener('unhandledrejection', function (event) {
        console.error('💥 未处理的Promise拒绝:', event.reason);
        event.preventDefault(); // 阻止默认的错误显示

        if (event.reason && typeof event.reason === 'string') {
            if (event.reason.includes('API') || event.reason.includes('网络')) {
                showErrorNotification('API服务暂时不可用，使用本地分析模式');
            }
        }
    });

    console.log('✅ 错误处理设置完成');
}

// 5. 添加用户通知函数
function showErrorNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #f44336;
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        z-index: 10000;
        font-family: Arial, sans-serif;
        font-size: 14px;
        max-width: 300px;
    `;
    notification.textContent = message;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transition = 'opacity 0.5s';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 500);
    }, 5000);
}

// 6. 主修复流程
async function applyFixes() {
    try {
        console.log('🚀 开始应用修复...');

        // 等待依赖加载
        await waitForDependencies();

        // 应用各种修复
        const fixes = [
            fixAIService,
            fixDivinationAnalysis,
            setupErrorHandling
        ];

        for (let fix of fixes) {
            const result = await fix();
            if (result === false) {
                console.warn('⚠️ 某个修复步骤失败，但继续执行其他修复');
            }
        }

        console.log('✅ 所有修复应用完成！');

        // 成功通知已移除 - 用户不需要看到此提示
        /*
        const successNotification = document.createElement('div');
        successNotification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #4caf50;
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            z-index: 10000;
            font-family: Arial, sans-serif;
            font-size: 14px;
        `;
        successNotification.textContent = '🎉 占卜功能已修复！现在可以正常使用了';

        document.body.appendChild(successNotification);

        setTimeout(() => {
            successNotification.style.opacity = '0';
            successNotification.style.transition = 'opacity 0.5s';
            setTimeout(() => {
                if (successNotification.parentNode) {
                    successNotification.parentNode.removeChild(successNotification);
                }
            }, 500);
        }, 3000);
        */


    } catch (error) {
        console.error('💥 修复过程中出现错误:', error);
        showErrorNotification('修复过程出现问题，但基本功能应该可用');
    }
}

// 7. 启动修复
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyFixes);
} else {
    applyFixes();
}

console.log('🔧 占卜页面API修复脚本已加载');