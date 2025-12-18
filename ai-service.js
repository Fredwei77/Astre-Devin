// Destiny AI - AI Service
// 处理所有与OpenRouter API的交互

class AIService {
    constructor() {
        // 延迟初始化配置，确保CONFIG已加载
        this.initializeConfig();

        // 请求队列和限流
        this.requestQueue = [];
        this.isProcessing = false;
        this.lastRequestTime = 0;
        this.minRequestInterval = 1000; // 最小请求间隔1秒
    }

    initializeConfig() {
        // 如果CONFIG还没有加载，使用默认配置
        if (typeof CONFIG !== 'undefined') {
            this.apiKey = CONFIG.OPENROUTER_API_KEY;
            this.apiUrl = CONFIG.OPENROUTER_API_URL;
            this.model = CONFIG.AI_MODEL;
            this.models = CONFIG.MODELS || {};
            this.mockMode = CONFIG.FEATURES.MOCK_MODE;
            console.log('AI Service: CONFIG loaded successfully');
        } else {
            console.warn('CONFIG not loaded, using default values');
            // 使用默认配置 - 通过后端代理，不暴露密钥
            this.apiKey = ''; // ⚠️ 不在前端存储密钥
            this.apiUrl = '/api/ai/chat'; // 使用后端代理
            this.model = 'deepseek/deepseek-chat';
            this.models = {
                DIVINATION: 'deepseek/deepseek-chat',
                FENGSHUI: 'amazon/nova-lite-v1',
                ICHING: 'deepseek/deepseek-chat'
            };
            this.mockMode = false;
        }
    }

    // 重新初始化配置（当CONFIG加载后调用）
    reloadConfig() {
        console.log('AI Service: Reloading configuration...');
        this.initializeConfig();

        // 验证PROMPTS是否可用
        if (typeof CONFIG !== 'undefined' && CONFIG.PROMPTS) {
            console.log('AI Service: PROMPTS now available after reload');
            this.promptsAvailable = true;
        } else {
            console.warn('AI Service: PROMPTS still not available after reload');
            this.promptsAvailable = false;
        }
    }

    // 检查配置是否完全可用
    isConfigurationReady() {
        return typeof CONFIG !== 'undefined' &&
            CONFIG.PROMPTS &&
            CONFIG.PROMPTS.DIVINATION &&
            CONFIG.PROMPTS.FENGSHUI &&
            CONFIG.PROMPTS.ICHING;
    }

    /**
     * 发送AI请求
     * @param {string} systemPrompt - 系统提示词
     * @param {string} userPrompt - 用户提示词
     * @param {object} options - 额外选项
     * @returns {Promise<object>} AI响应
     */
    async sendRequest(systemPrompt, userPrompt, options = {}) {
        // 仅作日志记录，不再拦截使用限制
        if (typeof window !== 'undefined' && window.subscriptionManager) {
            console.log('AI Service: 发送请求，绕过使用限制检查');
        }

        // 如果是模拟模式，返回模拟数据
        if (this.mockMode) {
            console.log('使用模拟模式，类型:', options.type);
            const mockData = await this.getMockResponse(options.type);
            console.log('模拟数据:', mockData);
            return mockData;
        }

        // 验证API配置
        // 如果使用后端代理（apiUrl以/api开头），则不需要检查apiKey
        const isUsingProxy = this.apiUrl && (this.apiUrl.startsWith('/api') || this.apiUrl.includes('/api/'));

        if (!isUsingProxy && (!this.apiKey || this.apiKey === 'YOUR_OPENROUTER_API_KEY_HERE' || this.apiKey === '')) {
            throw new Error('请在config.js中配置有效的OPENROUTER_API_KEY或使用后端代理');
        }

        try {
            // 限流控制
            await this.rateLimit();

            // 构建请求头
            const isUsingProxy = this.apiUrl && (this.apiUrl.startsWith('/api') || this.apiUrl.includes('/api/'));
            const headers = {
                'Content-Type': 'application/json'
            };

            // 只有在不使用代理时才添加Authorization头
            if (!isUsingProxy && this.apiKey) {
                headers['Authorization'] = `Bearer ${this.apiKey}`;
                headers['HTTP-Referer'] = window.location.origin;
                headers['X-Title'] = (typeof CONFIG !== 'undefined' ? CONFIG.APP_NAME : 'Destiny AI');
            }

            const response = await fetch(this.apiUrl, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify({
                    model: options.model || this.model, // 使用指定模型或默认模型
                    messages: [
                        {
                            role: 'system',
                            content: systemPrompt
                        },
                        {
                            role: 'user',
                            content: userPrompt
                        }
                    ],
                    temperature: options.temperature || 0.7,
                    max_tokens: options.maxTokens || 4000,
                    top_p: options.topP || 0.9
                })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(`API请求失败: ${response.status} - ${errorData.error?.message || response.statusText}`);
            }

            const data = await response.json();

            // 提取AI响应内容
            const content = data.choices[0]?.message?.content;

            if (!content) {
                throw new Error('AI响应内容为空');
            }

            console.log('AI 原始响应:', content);

            // 使用增强型JSON解析器
            try {
                let parsed;

                // 如果增强解析器可用，优先使用
                if (typeof EnhancedJSONParser !== 'undefined') {
                    console.log('🔧 使用增强型JSON解析器');
                    parsed = EnhancedJSONParser.parseAIResponse(content);
                } else {
                    console.log('📝 使用标准JSON解析');
                    // 降级到原有的解析逻辑
                    let cleanContent = content.trim();
                    cleanContent = cleanContent.replace(/^```(?:json|JSON)?\s*\n?/, '');
                    cleanContent = cleanContent.replace(/\n?\s*```\s*$/, '');
                    cleanContent = cleanContent.trim();

                    console.log('清理前:', content.substring(0, 100) + '...');
                    console.log('清理后:', cleanContent.substring(0, 100) + '...');

                    parsed = JSON.parse(cleanContent);
                }

                console.log('✅ JSON解析成功:', parsed);
                return parsed;

            } catch (e) {
                console.error('❌ JSON解析失败:', e.message);
                console.log('原始内容:', content);

                // 最后尝试：提取JSON结构
                try {
                    console.log('🔄 最后尝试：提取JSON结构...');
                    const firstBrace = content.indexOf('{');
                    const lastBrace = content.lastIndexOf('}');

                    if (firstBrace !== -1 && lastBrace !== -1 && firstBrace < lastBrace) {
                        const jsonContent = content.substring(firstBrace, lastBrace + 1);
                        console.log('提取的JSON:', jsonContent.substring(0, 100) + '...');

                        const parsed = JSON.parse(jsonContent);
                        console.log('✅ JSON结构提取成功:', parsed);
                        return parsed;
                    }
                } catch (finalError) {
                    console.error('❌ 最终解析也失败:', finalError.message);
                }

                // 核心修复：如果不是必须要求 JSON 的场景，解析失败则返回原始文本
                // 占卜、风水主分析通常需要 JSON，但追问（followup）通常是文本
                if (options.type && options.type.includes('followup')) {
                    console.log('ℹ️ 侦测到追问类型，解析 JSON 失败，返回原始文本内容');
                    return content;
                }

                // 检查用户是否已付费
                if (typeof window !== 'undefined' && window.subscriptionManager) {
                    const isPaidUser = window.subscriptionManager.isPremiumUser() || window.subscriptionManager.hasSingleUseCredits();

                    if (isPaidUser) {
                        // 如果内容看起来根本不像 JSON（不含大括号），则直接返回原始文本
                        if (!content.includes('{')) {
                            return content;
                        }
                        // 否则才抛错
                        throw new Error(`AI响应解析失败: ${e.message}。请稍后重试。`);
                    }
                }

                // 默认回退
                return content;
            }

        } catch (error) {
            console.error('AI请求错误:', error);

            // 检查用户是否已付费，如果已付费则不应该回退到模拟模式
            if (typeof window !== 'undefined' && window.subscriptionManager) {
                const canUseAI = window.subscriptionManager.canUseAI();
                const isPaidUser = window.subscriptionManager.isPremiumUser() || window.subscriptionManager.hasSingleUseCredits();

                if (isPaidUser && canUseAI) {
                    // 付费用户，AI请求失败时应该报错而不是降级到模拟数据
                    console.error('付费用户AI请求失败，不应该降级到模拟数据');
                    throw new Error('AI服务暂时不可用，请稍后重试。如果问题持续存在，请联系客服。');
                }
            }

            // 免费用户或未登录用户，可以回退到模拟模式
            console.warn('API请求失败，使用模拟数据');
            return this.getMockResponse(options.type);
        }
    }

    /**
     * 限流控制
     */
    async rateLimit() {
        const now = Date.now();
        const timeSinceLastRequest = now - this.lastRequestTime;

        if (timeSinceLastRequest < this.minRequestInterval) {
            await new Promise(resolve =>
                setTimeout(resolve, this.minRequestInterval - timeSinceLastRequest)
            );
        }

        this.lastRequestTime = Date.now();
    }

    /**
     * 占卜分析 - 使用 DeepSeek
     */
    async analyzeDivination(userData) {
        // 仅作日志记录，不再拦截请求
        if (typeof window !== 'undefined' && window.subscriptionManager) {
            const access = window.subscriptionManager.canUseService('divination');
            console.log('AI Service: 占卜请求权限状态:', access);
        }

        // 首先尝试等待CONFIG加载完成
        await this.waitForConfig();

        // 检查CONFIG是否可用
        if (typeof CONFIG === 'undefined' || !CONFIG.PROMPTS || !CONFIG.PROMPTS.DIVINATION) {
            console.warn('CONFIG.PROMPTS.DIVINATION not available after waiting, using mock data');
            console.log('CONFIG availability:', {
                configExists: typeof CONFIG !== 'undefined',
                promptsExists: typeof CONFIG !== 'undefined' && !!CONFIG.PROMPTS,
                divinationExists: typeof CONFIG !== 'undefined' && !!CONFIG.PROMPTS && !!CONFIG.PROMPTS.DIVINATION,
                configKeys: typeof CONFIG !== 'undefined' ? Object.keys(CONFIG) : 'N/A',
                promptsKeys: typeof CONFIG !== 'undefined' && CONFIG.PROMPTS ? Object.keys(CONFIG.PROMPTS) : 'N/A'
            });
            return this.getMockResponse('divination');
        }

        // 获取当前语言
        const language = localStorage.getItem('preferredLanguage') || 'zh';
        console.log('🌐 Divination analysis language:', language);

        // 将语言信息添加到 userData
        userData.language = language;

        console.log('✅ Using real AI analysis with CONFIG.PROMPTS.DIVINATION');
        const systemPrompt = CONFIG.PROMPTS.DIVINATION.SYSTEM(language);
        const userPrompt = CONFIG.PROMPTS.DIVINATION.USER(userData);

        return await this.sendRequest(systemPrompt, userPrompt, {
            type: 'divination',
            temperature: 0.8,
            model: this.models.DIVINATION || 'deepseek/deepseek-chat'
        });
    }

    // 等待CONFIG加载完成
    async waitForConfig(maxWaitTime = 2000, checkInterval = 100) {
        const startTime = Date.now();

        while (Date.now() - startTime < maxWaitTime) {
            if (typeof CONFIG !== 'undefined' && CONFIG.PROMPTS && CONFIG.PROMPTS.DIVINATION) {
                console.log('✅ CONFIG found and ready');
                return true;
            }

            // 等待一小段时间后再检查
            await new Promise(resolve => setTimeout(resolve, checkInterval));
        }

        console.warn(`⚠️ CONFIG not ready after ${maxWaitTime}ms wait`);
        return false;
    }

    /**
     * 风水分析 - 使用 Gemini Pro
     */
    async analyzeFengShui(spaceData, imageBase64 = null) {
        // 仅作日志记录
        if (typeof window !== 'undefined' && window.subscriptionManager) {
            const access = window.subscriptionManager.canUseService('fengshui');
            console.log('AI Service: 风水请求权限状态:', access);
        }

        // 检查CONFIG是否可用
        if (typeof CONFIG === 'undefined' || !CONFIG.PROMPTS) {
            console.warn('CONFIG.PROMPTS not available, using mock data');
            return this.getMockResponse('fengshui');
        }

        // 获取当前语言
        const language = localStorage.getItem('preferredLanguage') || 'zh';
        console.log('🌐 Feng Shui analysis language:', language);

        // 将语言信息添加到 spaceData
        spaceData.language = language;

        const systemPrompt = CONFIG.PROMPTS.FENGSHUI.SYSTEM(language);
        let userPrompt = CONFIG.PROMPTS.FENGSHUI.USER(spaceData);

        // 如果提供了图片，构造多模态请求 content
        if (imageBase64) {
            console.log('🖼️ Including image in Feng Shui analysis request');
            userPrompt = [
                {
                    type: "text",
                    text: userPrompt
                },
                {
                    type: "image_url",
                    image_url: {
                        url: imageBase64 // Expecting full data URI
                    }
                }
            ];
        }

        return await this.sendRequest(systemPrompt, userPrompt, {
            type: 'fengshui',
            temperature: 0.7,
            model: this.models.FENGSHUI || 'amazon/nova-lite-v1'
        });
    }

    /**
     * 易经解读 - 使用 DeepSeek
     */
    async analyzeIChing(questionData) {
        // 仅作日志记录
        if (typeof window !== 'undefined' && window.subscriptionManager) {
            const access = window.subscriptionManager.canUseService('iching');
            console.log('AI Service: 易经请求权限状态:', access);
        }

        // 检查CONFIG是否可用
        if (typeof CONFIG === 'undefined' || !CONFIG.PROMPTS) {
            console.warn('CONFIG.PROMPTS not available, using mock data');
            return this.getMockResponse('iching');
        }

        const systemPrompt = CONFIG.PROMPTS.ICHING.SYSTEM;
        const userPrompt = CONFIG.PROMPTS.ICHING.USER(questionData);

        return await this.sendRequest(systemPrompt, userPrompt, {
            type: 'iching',
            temperature: 0.8,
            model: this.models.ICHING || 'deepseek/deepseek-chat'
        });
    }

    /**
     * 获取模拟响应（用于测试或API失败时的回退）
     */
    getMockResponse(type) {
        // 获取当前语言
        const language = localStorage.getItem('preferredLanguage') || 'zh';
        const isEnglish = language === 'en';

        const mockData = {
            divination: {
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
                    `${new Date().getFullYear()}年财务前景良好`,
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
                elements: {
                    wood: 70,
                    fire: 45,
                    earth: 80,
                    metal: 60,
                    water: 35
                },
                luckyColors: isEnglish ? ['gold', 'silver', 'purple', 'green', 'orange'] : ['金色', '银色', '紫色', '绿色', '橙色'],
                luckyNumbers: [3, 7, 9, 21, 36],
                zodiacAnalysis: isEnglish
                    ? 'Your zodiac characteristics show strong adaptability and wisdom. You excel in interpersonal interactions and are good at seizing opportunities.'
                    : '您的生肖特征显示出强大的适应能力和智慧。在人际交往中表现出色，善于把握机会。',
                yearForecast: isEnglish
                    ? `${new Date().getFullYear()} overall fortune is rising, especially in career and wealth. The first half of the year requires steady progress, while the second half will bring breakthrough developments.`
                    : `${new Date().getFullYear()}年整体运势上扬，特别是在事业和财运方面。上半年需要稳扎稳打，下半年将迎来突破性进展。`
            },

            fengshui: {
                overallScore: 75,
                directionAnalysis: isEnglish
                    ? 'The current direction is auspicious, favorable for career development and wealth enhancement. It is recommended to strengthen the water element to balance energy flow.'
                    : '当前方位属于吉位，有利于事业发展和财运提升。建议加强水元素以平衡能量流动。',
                elements: {
                    wood: 70,
                    fire: 45,
                    earth: 80,
                    metal: 60,
                    water: 35
                },
                recommendations: isEnglish ? [
                    {
                        title: 'Add Water Element',
                        description: 'Place a small fountain or aquarium in the North area to enhance career and wealth flow.',
                        priority: 'high'
                    },
                    {
                        title: 'Increase Fire Energy',
                        description: 'Add warm lighting, candles, or red/orange decorations in the South area to boost recognition and fame.',
                        priority: 'medium'
                    },
                    {
                        title: 'Optimize Plant Placement',
                        description: 'Position healthy green plants in the East and Southeast areas to support family harmony and wealth growth.',
                        priority: 'medium'
                    },
                    {
                        title: 'Strategic Mirror Placement',
                        description: 'Place mirrors to reflect beautiful views and expand space, but avoid reflecting clutter or sharp corners.',
                        priority: 'low'
                    }
                ] : [
                    {
                        title: '增加水元素',
                        description: '在北方位置放置小型喷泉或鱼缸，增强事业运和财运。',
                        priority: 'high'
                    },
                    {
                        title: '提升火能量',
                        description: '在南方区域增加暖色调照明、蜡烛或红橙色装饰，提升名声和认可度。',
                        priority: 'medium'
                    },
                    {
                        title: '优化植物摆放',
                        description: '在东方和东南方放置健康绿植，支持家庭和谐和财富增长。',
                        priority: 'medium'
                    },
                    {
                        title: '镜子战略布局',
                        description: '放置镜子反射美景和扩大空间，但避免反射杂物或尖角。',
                        priority: 'low'
                    }
                ],
                luckyItems: isEnglish
                    ? ['Red Lantern', 'Lucky Bamboo', 'Dragon Statue', 'Crystal Sphere']
                    : ['红灯笼', '幸运竹', '龙雕像', '水晶球'],
                taboos: isEnglish
                    ? ['Avoid bed facing door', 'Keep wealth corner clutter-free', 'Avoid sharp corners pointing at people', 'Keep space clean and tidy']
                    : ['避免床头对门', '不要在财位堆放杂物', '避免尖角对人', '保持空间整洁']
            },

            iching: {
                hexagramName: '乾卦',
                hexagramNumber: 1,
                judgment: '元亨利贞。创造之力强大，万事亨通，坚持正道则吉。',
                image: '天行健，君子以自强不息。如天之运行刚健不息，君子应效法天道，自强不息。',
                advice: '根据您的问题和乾卦的指引，现在是采取主动、发挥领导力的时机。相信自己的创造力和判断力，不要犹豫不决。保持坚定的信念和持续的努力，成功将会到来。',
                actions: [
                    '相信创造本能，果断行动',
                    '在领导机会中发挥主动性',
                    '面对障碍保持坚持',
                    '寻求力量与灵活性的平衡',
                    '以身作则激励他人',
                    '坚守原则和价值观'
                ],
                warnings: [
                    '避免过度自信导致的冒进',
                    '注意倾听他人意见',
                    '保持谦逊，不可骄傲自满',
                    '警惕刚愎自用',
                    '注意劳逸结合'
                ],
                changingLinesInterpretation: '变爻显示当前处于转变期，需要特别注意把握时机和调整策略。',
                futureHexagram: '如有变爻，将转化为新的卦象，带来新的机遇和挑战。'
            }
        };

        return new Promise(resolve => {
            // 模拟网络延迟
            setTimeout(() => {
                resolve(mockData[type] || mockData.divination);
            }, 1500);
        });
    }

    /**
     * 通用聊天接口 - 支持自定义系统提示词
     * @param {string} systemPrompt - 系统提示词
     * @param {string} userPrompt - 用户提示词
     * @param {object} options - 额外选项
     * @returns {Promise<string>} AI响应文本
     */
    async chatWithSystem(systemPrompt, userPrompt, options = {}) {
        try {
            const response = await this.sendRequest(systemPrompt, userPrompt, {
                type: options.type || 'chat',
                temperature: options.temperature || 0.8,
                maxTokens: options.maxTokens || 4000,
                model: options.model || this.models.DIVINATION || 'deepseek/deepseek-chat'
            });

            // 如果响应是对象，尝试提取文本内容
            if (typeof response === 'object') {
                return response.content || response.text || JSON.stringify(response);
            }

            return response;
        } catch (error) {
            console.error('Chat with system error:', error);
            throw error;
        }
    }

    /**
     * 简单聊天接口 - 用于追问等场景
     * @param {string} message - 用户消息
     * @param {object} options - 额外选项
     * @returns {Promise<string>} AI响应文本
     */
    async chat(message, options = {}) {
        const systemPrompt = options.systemPrompt || '你是一位专业的东方命理大师，请用专业、温和的语言回答用户的问题。';
        return await this.chatWithSystem(systemPrompt, message, options);
    }

    /**
     * 测试API连接
     */
    async testConnection() {
        try {
            const response = await this.sendRequest(
                '你是一个测试助手。',
                '请回复JSON格式: {"status": "success", "message": "连接成功"}',
                { type: 'test', maxTokens: 50 }
            );
            return { success: true, response };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
}

// 浏览器环境：暴露为全局变量
if (typeof window !== 'undefined') {
    window.AIService = AIService;
    // 不立即创建实例，等待CONFIG加载完成后由main.js创建
    // window.aiService 将在需要时创建
}

// Node.js 环境：使用 module.exports
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AIService;
}
