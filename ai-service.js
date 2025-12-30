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

        // Detect local file environment (CORS restriction)
        const isLocalFile = window.location.protocol === 'file:' || window.location.origin === 'null';

        if (isLocalFile) {
            console.log('Environment: Local file detected (CORS restricted). Using Mock Mode.');
            this.mockMode = true;
        }

        // 如果是模拟模式，返回模拟数据
        if (this.mockMode || isLocalFile) {
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

            // 特殊处理 CORS/网络拦截错误（通常表现为 TypeError: Failed to fetch）
            const isCorsError = error instanceof TypeError && error.message.includes('fetch');
            let friendlyErrorMessage = error.message;

            if (isCorsError && window.location.protocol === 'file:') {
                friendlyErrorMessage = '环境受到限制：由于浏览器安全策略 (CORS)，直接双击打开本地 HTML 文件无法调用 AI 服务。请使用本地服务器运行（例如在 VS Code 中点击 "Go Live"）或者将项目部署到 Web 环境。';
                console.error('检测到跨域拦截，当前处于 file:// 协议');
            }

            // 检查用户是否有权限
            const isLocalFile = window.location.protocol === 'file:' || window.location.origin === 'null';
            if (!isLocalFile && typeof window !== 'undefined' && window.subscriptionManager) {
                const canUseAI = window.subscriptionManager.canUseAI();
                const isPaidUser = window.subscriptionManager.isPremiumUser() || window.subscriptionManager.hasSingleUseCredits();

                if (isPaidUser || canUseAI) {
                    // 仅在线上有权用户请求失败时才报错，不回退
                    console.error('有权用户AI请求失败，不应该降级到模拟数据');
                    throw new Error(friendlyErrorMessage || 'AI服务暂时不可用，请稍后重试。');
                }
            }

            // 本地环境、免费用户或未登录用户，可以回退到模拟模式
            console.warn('API请求失败或处于本地环境，使用模拟数据');
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

        // 获取当前语言
        const lang = (window.i18n && window.i18n.currentLanguage) || 'zh';

        // 获取系统提示词和用户提示词（现在是函数）
        const systemPrompt = typeof CONFIG.PROMPTS.ICHING.SYSTEM === 'function'
            ? CONFIG.PROMPTS.ICHING.SYSTEM(lang)
            : CONFIG.PROMPTS.ICHING.SYSTEM;

        const userPrompt = typeof CONFIG.PROMPTS.ICHING.USER === 'function'
            ? CONFIG.PROMPTS.ICHING.USER(questionData, lang)
            : CONFIG.PROMPTS.ICHING.USER(questionData);

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
        // 优先从 i18n 实例获取当前语言，确保强同步
        const language = (window.i18n && window.i18n.currentLanguage) || localStorage.getItem('preferredLanguage') || 'en';
        const isEnglish = language === 'en';
        const isZhTW = language === 'zh-TW';
        const isSpanish = language === 'es';

        // 添加调试日志
        console.log('[AI Service] getMockResponse - 当前语言:', language, '| 类型:', type);

        // 统一语言标签处理函数
        const text = (en, zh, tw, es) => {
            if (isEnglish) return en;
            if (isSpanish) return es || en;
            if (isZhTW) return tw || zh;
            return zh;
        };

        const mockData = {
            personality: text(
                ['Creative and intuitive thinker', 'Natural leadership talent', 'Strong sense of responsibility', 'Highly adaptable to change', 'Excellent at interpersonal relationships'],
                ['富有创造力和直觉思维', '天生的领导才能', '强烈的责任感', '适应变化的能力强', '善于处理人际关系'],
                ['富有創造力和直覺思維', '天生的領導才能', '強烈的責任感', '適應變化的能力強', '善於處理人際關係'],
                ['Pensador creativo e intuitivo', 'Talento de liderazgo natural', 'Fuerte sentido de la responsabilidad', 'Altamente adaptable al cambio', 'Excelente en las relaciones interpersonales']
            ),
            career: text(
                ['Excellent opportunities in creative fields', 'Great potential for leadership roles', 'Positive career outlook for 2025', 'Entrepreneurial opportunities ahead', 'Global development prospects'],
                ['创意领域有出色机会', '领导职位潜力巨大', '2025年职业前景良好', '考虑创业机会', '国际发展机遇在前'],
                ['創意領域有出色機會', '領導職位潛力巨大', '2025年職業前景良好', '考慮創業機會', '國際發展機遇在前'],
                ['Excelentes oportunidades en campos creativos', 'Gran potencial para roles de liderazgo', 'Perspectiva de carrera positiva para 2025', 'Oportunidades emprendedoras por delante', 'Prospectos de desarrollo global']
            ),
            wealth: text(
                ['Steady rise in financial fortune', 'Consider strategic investments', 'Financial success through mentors', 'Better wealth in second half of year', 'Avoid high-risk investments'],
                ['正财运势稳定上升', '投资需谨慎选择时机', '贵人相助带来财富', '下半年财运更佳', '避免高风险投资'],
                ['正財運勢穩定上升', '投資需謹慎選擇時機', '貴人相助帶來財富', '下半年財運更佳', '避免高風險投資'],
                ['Aumento constante de la fortuna financiera', 'Considere inversiones estratégicas', 'Éxito financiero a través de mentores', 'Mejor riqueza en la segunda mitad del año', 'Evite inversiones de alto riesgo']
            ),
            love: text(
                ['Loyal and devoted partner', 'Harmonious family relationships', 'Good at resolving conflicts', 'New social connections ahead', 'Bright marriage prospects'],
                ['忠诚且专一的伴侣', '家庭关系紧密和谐', '善于化解矛盾冲突', '吸引志同道合的朋友', '婚姻前景看好'],
                ['忠誠且專一的伴侶', '家庭關係緊密和諧', '善於化解矛盾衝突', '吸引志同道合的朋友', '婚姻前景看好'],
                ['Pareja leal y devota', 'Relaciones familiares armoniosas', 'Bueno resolviendo conflictos', 'Nuevas conexiones sociales por delante', 'Perspectivas de matrimonio brillantes']
            ),
            health: text(
                ['Overall good health status', 'Manage work-related stress', 'Regular exercise is beneficial', 'Focus on digestive health', 'Maintain good sleep habits'],
                ['整体健康状况良好', '注意工作压力管理', '定期运动有益', '注意消化系统健康', '保持良好作息习惯'],
                ['整體健康狀況良好', '注意工作壓力管理', '定期運動有益', '注意消化系統健康', '保持良好作息習慣'],
                ['Buen estado de salud general', 'Manejar el estrés laboral', 'El ejercicio regular es beneficioso', 'Enfoque en la salud digestiva', 'Mantener buenos hábitos de sueño']
            ),
            elements: { wood: 70, fire: 45, earth: 80, metal: 60, water: 35 },
            luckyColors: text(
                ['Gold', 'Silver', 'Purple', 'Green', 'Orange'],
                ['金色', '银色', '紫色', '绿色', '橙色'],
                ['金色', '銀色', '紫色', '綠色', '橙色'],
                ['Oro', 'Plata', 'Púrpura', 'Verde', 'Naranja']
            ),
            luckyNumbers: [3, 7, 9, 21, 36],
            zodiacAnalysis: text(
                'Your zodiac characteristics show strong adaptability and intelligence. Excellent in interpersonal communication and good at seizing opportunities.',
                '您的生肖特征显示出强大的适应能力和智慧。在人际交往中表现出色，善于把握机会。',
                '您的生肖特徵顯示出強大的適應能力和智慧。在人際交往中表現出色，善於把握機會。',
                'Tus características del zodíaco muestran una fuerte adaptabilidad e inteligencia. Excelente en la comunicación interpersonal y bueno aprovechando las oportunidades.'
            ),
            yearForecast: text(
                `2025 fortune overall is on the rise, especially in career and wealth. The first half of the year needs steady work, while the second half will bring breakthroughs.`,
                `2025年整体运势上扬，特别是在事业和财运方面。上半年需要稳扎稳打，下半年将迎来突破性进展。`,
                `2025年整體運勢上揚，特別是在事業和財運方面。上半年需要穩紮穩打，下半年將迎來突破性進展。`,
                `La fortuna de 2025 en general está en aumento, especialmente en carrera y riqueza. La primera mitad del año necesita trabajo constante, mientras que la segunda mitad traerá avances.`
            ),
            fengshui: {
                overallScore: 75,
                directionAnalysis: text(
                    'The current direction is auspicious, favorable for career development.',
                    '当前方位属于吉位，有利于事业发展和财运提升。',
                    '當前方位屬於吉位，有利於事業發展和財運提升。',
                    'La dirección actual es auspiciosa, favorable para el desarrollo profesional.'
                ),
                elements: { wood: 70, fire: 45, earth: 80, metal: 60, water: 35 },
                recommendations: [
                    {
                        title: text('Add Water Element', '增加水元素', '增加水元素', 'Añadir elemento agua'),
                        description: text(
                            'Place a small fountain in the North area.',
                            '在北方位置放置小型喷泉或鱼缸，增强事业运和财运。',
                            '在北方位置放置小型噴泉或魚缸，增強事業運和財運。',
                            'Coloque una pequeña fuente en el área norte.'
                        ),
                        priority: 'high'
                    },
                    {
                        title: text('Increase Fire Energy', '提升火能量', '提升火能量', 'Aumentar energía de fuego'),
                        description: text(
                            'Add warm lighting in the South area.',
                            '在南方区域增加暖色调照明，提升名声和认可度。',
                            '在南方區域增加暖色調照明，提升名聲和認可度。',
                            'Añadir iluminación cálida en el área sur.'
                        ),
                        priority: 'medium'
                    }
                ],
                luckyItems: text(
                    ['Red Lantern', 'Lucky Bamboo'],
                    ['红灯笼', '幸运竹'],
                    ['紅燈籠', '幸運竹'],
                    ['Farol rojo', 'Bambú de la suerte']
                ),
                taboos: text(
                    ['Avoid bed facing door', 'Keep tidy'],
                    ['避免床头对门', '保持空间整洁'],
                    ['避免床頭對門', '保持空間整潔'],
                    ['Evitar cama frente a la puerta', 'Mantener ordenado']
                )
            }
        };

        // 4. 易经模拟数据
        if (type === 'iching') {
            return {
                hexagramNumber: 1,
                hexagramName: text('Qian (The Creative)', '乾卦', '乾卦', 'Qian'),
                lines_binary: '111111', // Bottom to top: all solid
                future_lines_binary: '000000', // Example: transformed to Kun
                judgment: text(
                    'Success. The creative works sublime success, furthering through perseverance. This hexagram symbolizes the primal power of heaven, suggesting a time of great potential and initiative. It is a moment to act decisively and with confidence.',
                    '元亨利贞。创建自强。大吉大利，利于固守。此卦象征天之原动力，代表着万物之始，预示着一个充满潜力和主动性的时刻。',
                    '元亨利貞。創建自強。大吉大利，利於固守。此卦象徵天之原動力，代表著萬物之始，預示著一個充滿潛力和主動性的時刻。',
                    'Éxito sublime. El principio creativo se manifiesta a través del hexagrama del cielo.'
                ),
                image: text(
                    'The movement of heaven is powerful. The superior person strengthens themselves constantly. Just as the stars move with enduring strength, you should persist in your goals with unwavering determination and inner vitality.',
                    '天行健，君子以自强不息。君子应该效法天道，不断地追求进步，自我完善，永不停止。',
                    '天行健，君子以自強不息。君子應該效法天道，不斷地追求進步，自我完善，永不停止。',
                    'El movimiento del cielo es poderoso.'
                ),
                advice: text(
                    'Currently, you are in a period of upward momentum. Focus on your long-term vision and don\'t be afraid to take a leadership role. Your creative energy is at its peak; use it to lay the groundwork for future success.',
                    '现在是采取主动的最佳时机。您的创造力正处于顶峰，应勇敢承担领导责任。专注于长期愿景，为未来的成功奠定坚实基础。',
                    '現在是採取主動的最佳時機。您的創造力正處於頂峰，應勇敢承擔領導責任。專注於長期願景，為未來的发展奠定堅實基礎。',
                    'Sea activo y tome la iniciativa.'
                ),
                summary: text(
                    'A time of great initiative and creative power. Success is assured through perseverance.',
                    '大吉之课，此时正是大展宏图、积极进取的黄金时期。只要坚持正道，必获圆满成功。',
                    '大吉之課，此時正是大展宏圖、積極進取的黃金時期。只要堅持正道，必獲圓滿成功。',
                    'Un tiempo de gran iniciativa.'
                ),
                actions: [
                    text('Take decisive action', '采取果断行动', '採取果斷行動', 'Acción'),
                    text('Lead with confidence', '发挥领导才能', '發揮領導能力', 'Liderazgo'),
                    text('Maintain inner focus', '保持内在专注', '保持內在專注', 'Enfoque')
                ],
                warnings: [
                    text('Avoid arrogance', '戒骄戒躁', '戒驕戒躁', 'Precaución'),
                    text('Do not overreach', '避免过激', '避免過激', 'Moderación')
                ],
                changingLinesInterpretation: text(
                    'The lines are in a state of flux. Your current situation is rapidly evolving, leading to a significant transformation in your path. Stay adaptable.',
                    '卦中爻象正在转换，表明您当前面临的局势正在迅速演变。坚持正道，灵活应对这种转变。',
                    '卦中爻象正在轉換，表明您當前面臨的局勢正在迅速演變。堅持正道，靈活應對這種轉變。',
                    'Cambio dinámico.'
                ),
                futureHexagram: text(
                    'The creative potential will soon manifest into a stable foundation (Transformation to Kun).',
                    '乾卦之刚健即将转化为坤卦之柔顺，形成坚实的基础。',
                    '乾卦之剛健即將轉化為坤卦之柔順，形成堅實的基礎。',
                    'Futuro estable.'
                )
            }
        };

        // 5. 追问模拟数据 (占卜/风水/易经)
        if (type === 'fengshui-followup' || type === 'divination-followup' || type === 'iching-followup' || type === 'chat') {
            const isFengShui = type === 'fengshui-followup' || (type === 'chat' && window.location.href.includes('fengshui'));
            const isIChing = type === 'iching-followup' || (type === 'chat' && window.location.href.includes('iching'));

            if (isIChing) {
                return text(
                    "### I-Ching Deep Insights\n\nBased on your hexagram and follow-up question:\n\n1. **Current Trend**: You are in a stage of preparation.\n2. **Guidance**: Stay steady and focus on inner growth.\n3. **Actions**: Observe carefully before taking major steps.",
                    "### 易经深挖真相\n\n结合您的卦象与当前追问，为您进行深度解析：\n\n1. **局势趋势**：目前正处于“蓄势待发”的阶段，不宜操之过急。\n2. **大师建议**：内求定力，外寻契机。保持专注，力量自然会显现。\n3. **具体行动**：在接下来的两周内多观察，少表态，稳扎稳打。",
                    "### 易經深挖真相\n\n結合您的卦象與當前追問，為您进行深度解析：\n\n1. **局勢趨勢**：目前正處於「蓄勢待發」的階段，不宜操之過急。\n2. **大師建議**：內求定力，外尋契機。保持專注，力量自然會顯現。\n3. **具體行動**：在接下來的兩周內多觀察，少表態，穩紮穩打。",
                    "### Análisis Profundo de I-Ching\n\nBasado en su hexagrama y pregunta de seguimiento:\n\n1. **Tendencia**: Está en una etapa de preparación.\n2. **Guía**: Manténgase firme en su crecimiento interno."
                );
            }

            if (isFengShui) {
                return text(
                    "### Alternative Feng Shui Solutions\n\n1. **Plant Selection**: Use small succulents.\n2. **Color**: Use light blue in the North.",
                    "### 风水替代方案建议\n\n1. **植物选择**：可以使用小型多肉植物。\n2. **色彩搭配**：在北方方位使用淡蓝色饰品。",
                    "### 風水替代方案建議\n\n1. **植物選擇**：可以使用小型多肉植物。\n2. **色彩搭配**：在北方方位使用淡藍色飾品。",
                    "### Soluciones alternativas de Feng Shui\n\n1. **Selección de plantas**: Use suculentas pequeñas.\n2. **Color**: Use azul claro en el norte."
                );
            }

            // Default for divination followup
            return text(
                "### Deep Truth Insights\n\n1. **Career**: Strong potential for management.\n2. **Wealth**: Positive stars ahead.\n3. **Advice**: Focus on long-term goals.",
                "### 深挖真相 - 深度解析\n\n1. **事业潜能**：暗示您具有极强的管理才能与领导潜质。\n2. **财运趋势**：流年逢“财星”生旺，意味着未来有不错的偏财机遇。\n3. **大师叮嘱**：凡事需循序渐进，切莫急功近利。",
                "### 深挖真相 - 深度解析\n\n1. **事業潛能**：暗示您具有極強的管理才能與領導潛質。\n2. **財運趨勢**：流年逢“財星”生旺，意味著未來有不錯的偏財機遇。\n3. **大師叮囑**：凡事需循序漸進，切莫急功近利。",
                "### Perspectivas de la Verdad Profunda\n\n1. **Carrera**: Gran potencial de liderazgo.\n2. **Riqueza**: Próximas oportunidades financieras."
            );
        }

        return new Promise(resolve => {
            // 模拟网络延迟
            setTimeout(() => {
                resolve(mockData[type] || mockData.divination);
            }, 1000);
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
            if (response && typeof response === 'object') {
                // 如果是标准 JSON 响应包，尝试寻找 content 字段
                return response.content || response.text || response.answer || JSON.stringify(response);
            }

            return response || '';
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
