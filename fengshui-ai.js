// Feng Shui AI Integration
// 风水分析AI集成

class FengShuiAI {
    constructor() {
        this.currentDirection = 0;
        this.spaceData = null;
        this.analysisResult = null;
        this.animeAvailable = false;

        // 检查 anime.js 是否可用
        this.checkAnimeAvailability();

        // 监听语言切换事件
        this.setupLanguageListener();
    }

    /**
     * 设置语言切换监听
     */
    setupLanguageListener() {
        window.addEventListener('languageChanged', () => {
            // 如果有分析结果，重新渲染所有动态内容
            if (this.analysisResult) {
                if (this.analysisResult.recommendations) {
                    this.updateRecommendations(this.analysisResult.recommendations);
                }
                if (this.analysisResult.luckyItems) {
                    this.updateLuckyItems(this.analysisResult.luckyItems);
                }
                if (this.analysisResult.taboos) {
                    this.updateTaboos(this.analysisResult.taboos);
                }
            }
        });
    }

    /**
     * 检查 anime.js 是否可用
     */
    checkAnimeAvailability() {
        if (typeof anime !== 'undefined') {
            this.animeAvailable = true;
            console.log('✅ anime.js is available');
        } else {
            console.warn('⚠️ anime.js not available, animations will be disabled');
            this.animeAvailable = false;
        }
    }

    /**
     * 分析风水布局
     */
    async analyzeSpace(direction, imageData = null) {
        try {
            const spaceData = {
                direction: direction,
                spaceType: '居住空间',
                concerns: '整体运势'
            };

            this.spaceData = spaceData;

            // 调用AI服务
            const result = await aiService.analyzeFengShui(spaceData);
            this.analysisResult = result;

            // 更新UI
            this.updateAnalysisDisplay(result);

            return result;

        } catch (error) {
            console.error('风水分析错误:', error);
            throw error;
        }
    }

    /**
     * 更新分析结果显示
     */
    updateAnalysisDisplay(result) {
        // 显示分析结果区域
        const analysisResults = document.getElementById('analysisResults');
        if (analysisResults) {
            analysisResults.classList.remove('hidden');
        }

        // 更新整体评分
        this.updateScore('energyScore', 'energyPercent', result.overallScore || 75);

        // 更新五行平衡
        if (result.elements) {
            this.updateElementsDisplay(result.elements);
        }

        // 更新建议
        if (result.recommendations) {
            this.updateRecommendations(result.recommendations);
        }

        // 更新方位分析文本
        if (result.directionAnalysis) {
            const directionText = document.getElementById('directionAnalysisText');
            if (directionText) {
                directionText.textContent = result.directionAnalysis;
            }
        }

        // 更新幸运物品
        if (result.luckyItems) {
            this.updateLuckyItems(result.luckyItems);
        }

        // 更新禁忌
        if (result.taboos) {
            this.updateTaboos(result.taboos);
        }

        // 初始化追问建议 (Consolidated)
        this.renderSuggestedQuestions(result);
    }

    /**
     * 更新评分显示 - 支持无动画模式
     */
    updateScore(barId, percentId, value) {
        const bar = document.getElementById(barId);
        const percent = document.getElementById(percentId);

        if (!bar || !percent) return;

        if (this.animeAvailable && typeof anime !== 'undefined') {
            // 使用动画
            anime({
                targets: bar,
                width: `${value}%`,
                duration: 1000,
                easing: 'easeOutQuart'
            });

            anime({
                targets: { value: 0 },
                value: value,
                duration: 1000,
                easing: 'easeOutQuart',
                update: function (anim) {
                    percent.textContent = `${Math.round(anim.animatables[0].target.value)}%`;
                }
            });
        } else {
            // 直接设置，无动画
            bar.style.width = `${value}%`;
            percent.textContent = `${value}%`;
        }
    }

    /**
     * 更新五行显示
     */
    updateElementsDisplay(elements) {
        const elementMap = {
            wood: { selector: '.element-wood', color: 'green-500' },
            fire: { selector: '.element-fire', color: 'orange-500' },
            earth: { selector: '.element-earth', color: 'yellow-600' },
            metal: { selector: '.element-metal', color: 'gray-400' },
            water: { selector: '.element-water', color: 'blue-500' }
        };

        Object.entries(elements).forEach(([key, value]) => {
            const config = elementMap[key];
            if (!config) return;

            // 找到对应的进度条
            const bars = document.querySelectorAll(`${config.selector} + div .bg-${config.color}`);
            bars.forEach(bar => {
                if (this.animeAvailable && typeof anime !== 'undefined') {
                    anime({
                        targets: bar,
                        width: `${value}%`,
                        duration: 1000,
                        easing: 'easeOutQuart'
                    });
                } else {
                    bar.style.width = `${value}%`;
                }
            });
        });
    }

    /**
     * 更新建议显示 - 支持多语言 - 增强翻译逻辑
     */
    updateRecommendations(recommendations) {
        const container = document.getElementById('recommendationsContainer');
        if (!container) return;

        // 清空现有建议
        container.innerHTML = '';

        // 获取当前语言
        const lang = localStorage.getItem('preferredLanguage') || 'zh';
        const isEnglish = lang === 'en';

        // 添加新建议
        recommendations.forEach(rec => {
            const priorityEmoji = rec.priority === 'high' ? '🔥' : rec.priority === 'medium' ? '⭐' : '💡';

            // 翻译标题和描述 - 使用智能翻译函数
            const title = this.translateRecommendationTitle(rec.title, isEnglish);
            const description = this.translateRecommendationDescription(rec.title, rec.description, isEnglish);

            const card = document.createElement('div');
            card.className = 'recommendation-card rounded-lg p-4';
            card.innerHTML = `
                <div class="flex items-start space-x-3">
                    <div class="text-2xl">${priorityEmoji}</div>
                    <div>
                        <h4 class="font-semibold mb-1">${title}</h4>
                        <p class="text-sm text-moon-silver">${description}</p>
                    </div>
                </div>
            `;

            container.appendChild(card);
        });
    }

    /**
     * 智能翻译建议标题
     */
    translateRecommendationTitle(title, isEnglish) {
        const titleMap = {
            // 英文到中文
            'Add Water Element': isEnglish ? 'Add Water Element' : '增加水元素',
            'Increase Fire Energy': isEnglish ? 'Increase Fire Energy' : '提升火能量',
            'Optimize Plant Placement': isEnglish ? 'Optimize Plant Placement' : '优化植物摆放',
            'Strategic Mirror Placement': isEnglish ? 'Strategic Mirror Placement' : '镜子战略布局',
            'Bedroom Optimization': isEnglish ? 'Bedroom Optimization' : '卧室优化',
            // 中文到英文
            '增加水元素': isEnglish ? 'Add Water Element' : '增加水元素',
            '提升火能量': isEnglish ? 'Increase Fire Energy' : '提升火能量',
            '优化植物摆放': isEnglish ? 'Optimize Plant Placement' : '优化植物摆放',
            '镜子战略布局': isEnglish ? 'Strategic Mirror Placement' : '镜子战略布局',
            '卧室优化': isEnglish ? 'Bedroom Optimization' : '卧室优化'
        };

        return titleMap[title] || title;
    }

    /**
     * 智能翻译建议描述
     */
    translateRecommendationDescription(title, description, isEnglish) {
        const descMap = {
            // 基于标题的描述映射
            'Add Water Element': {
                en: 'Place a small fountain or aquarium in the North area to enhance career and wealth flow.',
                zh: '在北方位置放置小型喷泉或鱼缸，增强事业运和财运。'
            },
            '增加水元素': {
                en: 'Place a small fountain or aquarium in the North area to enhance career and wealth flow.',
                zh: '在北方位置放置小型喷泉或鱼缸，增强事业运和财运。'
            },
            'Increase Fire Energy': {
                en: 'Add warm lighting, candles, or red/orange decorations in the South area to boost recognition and fame.',
                zh: '在南方区域增加暖色调照明、蜡烛或红橙色装饰，提升名声和认可度。'
            },
            '提升火能量': {
                en: 'Add warm lighting, candles, or red/orange decorations in the South area to boost recognition and fame.',
                zh: '在南方区域增加暖色调照明、蜡烛或红橙色装饰，提升名声和认可度。'
            },
            'Optimize Plant Placement': {
                en: 'Position healthy green plants in the East and Southeast areas to support family harmony and wealth growth.',
                zh: '在东方和东南方放置健康绿植，支持家庭和谐和财富增长。'
            },
            '优化植物摆放': {
                en: 'Position healthy green plants in the East and Southeast areas to support family harmony and wealth growth.',
                zh: '在东方和东南方放置健康绿植，支持家庭和谐和财富增长。'
            },
            'Strategic Mirror Placement': {
                en: 'Place mirrors to reflect beautiful views and expand space, but avoid reflecting clutter or sharp corners.',
                zh: '放置镜子反射美景和扩大空间，但避免反射杂物或尖角。'
            },
            '镜子战略布局': {
                en: 'Place mirrors to reflect beautiful views and expand space, but avoid reflecting clutter or sharp corners.',
                zh: '放置镜子反射美景和扩大空间，但避免反射杂物或尖角。'
            },
            'Bedroom Optimization': {
                en: 'Position your bed in the command position (diagonal from door, not directly in line) for better sleep and relationships.',
                zh: '将床放在指挥位置（与门对角线，不直接对齐），以获得更好的睡眠和关系。'
            },
            '卧室优化': {
                en: 'Position your bed in the command position (diagonal from door, not directly in line) for better sleep and relationships.',
                zh: '将床放在指挥位置（与门对角线，不直接对齐），以获得更好的睡眠和关系。'
            }
        };

        if (descMap[title]) {
            return descMap[title][isEnglish ? 'en' : 'zh'];
        }

        return description;
    }

    /**
     * 更新幸运物品 - 支持多语言
     */
    updateLuckyItems(items) {
        const container = document.getElementById('luckyItemsContainer');
        if (!container) return;

        container.innerHTML = '';

        // 获取当前语言
        const lang = localStorage.getItem('preferredLanguage') || 'zh';
        const isEnglish = lang === 'en';

        items.forEach(item => {
            // 如果是中文物品名，尝试翻译
            let displayName = item;
            const itemTranslations = {
                '红灯笼': isEnglish ? 'Red Lantern' : '红灯笼',
                '幸运竹': isEnglish ? 'Lucky Bamboo' : '幸运竹',
                '龙雕像': isEnglish ? 'Dragon Statue' : '龙雕像',
                '水晶球': isEnglish ? 'Crystal Sphere' : '水晶球',
                '祈福手环': isEnglish ? 'Prayer Bracelet' : '祈福手环',
                '罗盘': isEnglish ? 'Feng Shui Compass' : '罗盘',
                '八卦镜': isEnglish ? 'Bagua Mirror' : '八卦镜',
                '五帝钱币': isEnglish ? 'Five Emperor Coins' : '五帝钱币'
            };

            displayName = itemTranslations[item] || item;

            const div = document.createElement('div');
            div.className = 'bg-mystic-gold/10 rounded-lg p-3 text-center border border-mystic-gold/30';
            div.innerHTML = `
                <div class="text-2xl mb-1">✨</div>
                <div class="text-sm text-mystic-gold">${displayName}</div>
            `;
            container.appendChild(div);
        });
    }

    /**
     * 更新禁忌 - 支持多语言
     */
    updateTaboos(taboos) {
        const container = document.getElementById('taboosContainer');
        if (!container) return;

        container.innerHTML = '';

        // 获取当前语言
        const lang = localStorage.getItem('preferredLanguage') || 'zh';
        const isEnglish = lang === 'en';

        taboos.forEach(taboo => {
            // 如果是中文禁忌，尝试翻译
            let displayTaboo = taboo;
            const tabooTranslations = {
                '避免床头对门': isEnglish ? 'Avoid bed facing door' : '避免床头对门',
                '不要在财位堆放杂物': isEnglish ? 'Keep wealth corner clutter-free' : '不要在财位堆放杂物',
                '避免尖角对人': isEnglish ? 'Avoid sharp corners pointing at people' : '避免尖角对人',
                '保持空间整洁': isEnglish ? 'Keep space clean and tidy' : '保持空间整洁'
            };

            displayTaboo = tabooTranslations[taboo] || taboo;

            const div = document.createElement('div');
            div.className = 'flex items-start space-x-2 text-sm';
            div.innerHTML = `
                <span class="text-red-400">⚠️</span>
                <span class="text-moon-silver">${displayTaboo}</span>
            `;
            container.appendChild(div);
        });
    }

    /**
     * 获取当前方位的建议 - 支持多语言
     */
    getDirectionAdvice(direction) {
        // 获取当前语言
        const lang = localStorage.getItem('preferredLanguage') || 'zh';
        const isEnglish = lang === 'en';

        const directions = {
            0: {
                name: 'North',
                element: 'Water',
                advice: {
                    zh: '北方属水，主事业运。适合放置水景、蓝色装饰。',
                    en: 'North belongs to Water element, governing career luck. Suitable for water features and blue decorations.'
                }
            },
            45: {
                name: 'Northeast',
                element: 'Earth',
                advice: {
                    zh: '东北方属土，主智慧。适合放置书籍、黄色装饰。',
                    en: 'Northeast belongs to Earth element, governing wisdom. Suitable for books and yellow decorations.'
                }
            },
            90: {
                name: 'East',
                element: 'Wood',
                advice: {
                    zh: '东方属木，主健康。适合放置绿植、木制家具。',
                    en: 'East belongs to Wood element, governing health. Suitable for green plants and wooden furniture.'
                }
            },
            135: {
                name: 'Southeast',
                element: 'Wood',
                advice: {
                    zh: '东南方属木，主财运。适合放置绿植、紫色装饰。',
                    en: 'Southeast belongs to Wood element, governing wealth. Suitable for green plants and purple decorations.'
                }
            },
            180: {
                name: 'South',
                element: 'Fire',
                advice: {
                    zh: '南方属火，主名声。适合放置照明、红色装饰。',
                    en: 'South belongs to Fire element, governing fame. Suitable for lighting and red decorations.'
                }
            },
            225: {
                name: 'Southwest',
                element: 'Earth',
                advice: {
                    zh: '西南方属土，主感情。适合放置成对物品、粉色装饰。',
                    en: 'Southwest belongs to Earth element, governing relationships. Suitable for paired items and pink decorations.'
                }
            },
            270: {
                name: 'West',
                element: 'Metal',
                advice: {
                    zh: '西方属金，主子女。适合放置金属物品、白色装饰。',
                    en: 'West belongs to Metal element, governing children. Suitable for metal items and white decorations.'
                }
            },
            315: {
                name: 'Northwest',
                element: 'Metal',
                advice: {
                    zh: '西北方属金，主贵人。适合放置金属物品、银色装饰。',
                    en: 'Northwest belongs to Metal element, governing benefactors. Suitable for metal items and silver decorations.'
                }
            }
        };

        // 找到最接近的方位
        const normalizedDir = ((direction % 360) + 360) % 360;
        const closestDir = Object.keys(directions).reduce((prev, curr) => {
            return Math.abs(curr - normalizedDir) < Math.abs(prev - normalizedDir) ? curr : prev;
        });

        const directionInfo = directions[closestDir];

        // 返回翻译后的建议
        return {
            name: directionInfo.name,
            element: directionInfo.element,
            advice: directionInfo.advice[isEnglish ? 'en' : 'zh']
        };
    }

    /**
     * 处理 AI 替代方案咨询（追问）
     */
    async handleFollowupQuestion() {
        console.log('🤖 开始处理风水追问...');

        // 检查是否有分析结果
        if (!this.analysisResult) {
            alert(window.i18n?.t('fengshui.followup.noResult') || '请先进行风水分析再提问');
            return;
        }

        const followupInput = document.getElementById('followupInput');
        const askButton = document.getElementById('askFollowup');
        const loadingDiv = document.getElementById('followupLoading');
        const answerDiv = document.getElementById('followupAnswer');
        const answerText = document.getElementById('followupAnswerText');

        if (!followupInput) {
            console.error('❌ 未找到追问输入框');
            return;
        }

        const question = followupInput.value.trim();
        console.log('📝 用户追问:', question);

        if (!question) {
            alert(window.i18n?.t('fengshui.followup.empty') || '请输入您的追问');
            return;
        }

        // 检查用户权限
        if (window.subscriptionManager) {
            const access = window.subscriptionManager.canUseService('fengshui');
            const isMockDataOnly = window.subscriptionManager.isMockDataOnly();

            if (!access.allowed || isMockDataOnly) {
                console.log('权限受限，显示升级提示');
                if (!access.allowed) {
                    window.subscriptionManager.showUpgradePrompt('AI风水追问', 'fengshui');
                    return;
                }
            }
        }

        try {
            // 显示加载状态
            if (askButton) askButton.disabled = true;
            if (loadingDiv) loadingDiv.classList.remove('hidden');
            if (answerDiv) answerDiv.classList.add('hidden');

            // 构建系统提示词
            const systemPrompt = `你是一位专业的风水大师。请基于用户的空间分析结果，针对其提出的具体布局困难或问题，提供深度解读和替代方案建议。

空间数据参考：
- 坐向：${this.spaceData.direction}° (${this.getDirectionAdvice(this.spaceData.direction).name})
- 核心评分：${this.analysisResult.overallScore}%
- 五行状态：木${this.analysisResult.elements.wood}%, 火${this.analysisResult.elements.fire}%, 土${this.analysisResult.elements.earth}%, 金${this.analysisResult.elements.metal}%, 水${this.analysisResult.elements.water}%
- 当前方位分析：${this.analysisResult.directionAnalysis}

要求：
1. 结合风水原理直接回答用户的问题。
2. 如果用户提到的布局无法实现，请提供替代方案。
3. 提供 2-3 条具体、可落地的调整建议。
4. 保持专业、激励性的语调。
5. 字s控制在 400 字以内。`;

            const userPrompt = `追问问题：${question}`;

            // 调用AI服务
            const aiService = window.aiService || (window.AIService ? new window.AIService() : null);
            if (!aiService) {
                throw new Error('AI服务未初始化');
            }

            const response = await aiService.chatWithSystem(systemPrompt, userPrompt);

            if (!response || typeof response !== 'string') {
                throw new Error('AI响应格式错误');
            }

            // 显示回答
            if (answerText) {
                answerText.textContent = response;
            }
            if (answerDiv) {
                answerDiv.classList.remove('hidden');
                // 滚动到回答位置
                answerDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }

            // 清空输入框
            followupInput.value = '';

            console.log('✅ 风水追问处理完成');

        } catch (error) {
            console.error('❌ 风水追问失败:', error);
            alert(error.message || 'AI解答失败，请稍后重试');
        } finally {
            // 恢复按钮状态
            if (askButton) askButton.disabled = false;
            if (loadingDiv) loadingDiv.classList.add('hidden');
        }
    }

    /**
     * 生成建议追问问题
     */
    generateSuggestedQuestions(result) {
        const lang = localStorage.getItem('preferredLanguage') || 'zh';
        const isEnglish = lang === 'en';

        let suggestions = isEnglish ? [
            "How can I improve my wealth corner layout?",
            "How should I arrange my bedroom for better sleep?",
            "What's the best direction for my desk?",
            "How to resolve negative energy at home?",
            "What colors are best for my living room?",
            "How to use plants to improve feng shui?"
        ] : [
            "如何改善我的财位布局？",
            "卧室应该如何摆放才能提升睡眠质量？",
            "办公桌的最佳朝向是什么？",
            "如何化解家中的煞气？",
            "什么颜色最适合我的客厅？",
            "如何利用植物提升家居风水？"
        ];

        // 结合分析结果动态调整
        if (result && result.elements) {
            const elements = result.elements;
            if (elements.water < 50) suggestions.unshift(isEnglish ? "How to enhance water for wealth?" : "如何增强水元素提升财运？");
            if (elements.fire < 50) suggestions.unshift(isEnglish ? "How to increase fire for fame?" : "如何增加火元素提升名气？");
        }

        return suggestions.slice(0, 6);
    }

    /**
     * 渲染建议追问问题
     */
    renderSuggestedQuestions(result) {
        const container = document.getElementById('followupSuggestions');
        if (!container) return;

        container.innerHTML = '';
        const questions = this.generateSuggestedQuestions(result);

        questions.forEach(question => {
            const button = document.createElement('button');
            button.className = 'text-xs bg-mystic-gold/10 hover:bg-mystic-gold/20 text-mystic-gold border border-mystic-gold/30 px-3 py-1.5 rounded-lg transition-all';
            button.textContent = question;
            button.onclick = () => {
                const input = document.getElementById('followupInput');
                if (input) {
                    input.value = question;
                    input.focus();
                }
            };
            container.appendChild(button);
        });
    }

    /**
     * 绑定追问事件
     */
    bindFollowupEvents() {
        const askButton = document.getElementById('askFollowup');
        if (askButton) {
            askButton.onclick = () => this.handleFollowupQuestion();
            console.log('✅ 风水追问按钮事件已绑定');

            // 支持回车键提交
            const followupInput = document.getElementById('followupInput');
            if (followupInput) {
                followupInput.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                        this.handleFollowupQuestion();
                    }
                });
            }
        }
    }
}

// 浏览器环境：暴露为全局变量
if (typeof window !== 'undefined') {
    window.FengShuiAI = FengShuiAI;
    // 创建全局实例
    window.fengShuiAI = new FengShuiAI();

    // 初始化追问事件
    document.addEventListener('DOMContentLoaded', () => {
        window.fengShuiAI.bindFollowupEvents();
    });
}

// Node.js 环境：使用 module.exports
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FengShuiAI;
}
