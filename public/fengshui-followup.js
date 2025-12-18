/**
 * 风水追问功能
 * Feng Shui Follow-up Questions Feature
 */

(function () {
    'use strict';

    // 存储当前风水分析结果
    let currentFengshuiResult = null;

    /**
     * 根据风水分析结果生成建议追问问题 - 支持多语言
     */
    function generateSuggestedQuestions(result) {
        // 获取当前语言
        const lang = localStorage.getItem('preferredLanguage') || 'zh';
        const isEnglish = lang === 'en';

        const suggestions = isEnglish ? [
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

        // 根据五行平衡情况添加特定建议
        if (result && result.elements) {
            const elements = result.elements;

            // 如果水元素低
            if (elements.water && elements.water < 50) {
                suggestions.unshift(isEnglish
                    ? "How to enhance water element for wealth?"
                    : "如何增强水元素来提升财运？");
            }

            // 如果火元素低
            if (elements.fire && elements.fire < 50) {
                suggestions.unshift(isEnglish
                    ? "How to increase fire element for fame?"
                    : "如何增加火元素来提升名气？");
            }

            // 如果木元素低
            if (elements.wood && elements.wood < 50) {
                suggestions.unshift(isEnglish
                    ? "How to add wood element for health?"
                    : "如何补充木元素来促进健康？");
            }
        }

        return suggestions.slice(0, 6); // 返回最多6个建议
    }

    /**
     * 渲染建议追问问题
     */
    function renderSuggestedQuestions(questions) {
        const container = document.getElementById('fengshuiFollowupSuggestions');
        if (!container) return;

        container.innerHTML = '';

        questions.forEach(question => {
            const button = document.createElement('button');
            button.className = 'text-xs bg-mystic-gold/20 hover:bg-mystic-gold/30 text-mystic-gold border border-mystic-gold/40 px-3 py-2 rounded-lg transition-all';
            button.textContent = question;
            button.onclick = () => {
                document.getElementById('fengshuiFollowupInput').value = question;
            };
            container.appendChild(button);
        });
    }

    /**
     * 处理追问请求
     */
    async function handleFollowupQuestion() {
        const input = document.getElementById('fengshuiFollowupInput');
        const button = document.getElementById('askFengshuiFollowup');
        const loading = document.getElementById('fengshuiFollowupLoading');
        const answerSection = document.getElementById('fengshuiFollowupAnswer');
        const answerText = document.getElementById('fengshuiFollowupAnswerText');

        const question = input.value.trim();

        if (!question) {
            alert(window.i18n?.t('fengshui.followup.emptyError') || '请输入您的问题');
            return;
        }

        if (!currentFengshuiResult) {
            alert(window.i18n?.t('fengshui.followup.noResultError') || '请先进行风水分析');
            return;
        }

        // 显示加载状态
        button.disabled = true;
        loading.classList.remove('hidden');
        answerSection.classList.add('hidden');

        try {
            // 检查 AI 服务是否可用
            if (!window.aiService) {
                throw new Error('AI服务未初始化');
            }

            // 构建提示词
            const systemPrompt = buildSystemPrompt();
            const userPrompt = buildUserPrompt(currentFengshuiResult, question);

            // 调用AI服务 - 使用正确的方法
            // 关键修复：风水追问使用更适合聊天的 deepseek/deepseek-chat 模型，并降低 maxTokens 以免超时
            const response = await window.aiService.sendRequest(systemPrompt, userPrompt, {
                type: 'fengshui-followup',
                model: 'deepseek/deepseek-chat',
                temperature: 0.7,
                maxTokens: 1000
            });

            // 提取答案文本
            let answerContent = '';
            if (typeof response === 'string') {
                answerContent = response;
            } else if (response.answer) {
                answerContent = response.answer;
            } else if (response.content) {
                answerContent = response.content;
            } else {
                answerContent = JSON.stringify(response, null, 2);
            }

            // 显示答案
            answerText.innerHTML = formatAnswer(answerContent);
            answerSection.classList.remove('hidden');

            // 滚动到答案位置
            answerSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

        } catch (error) {
            console.error('追问失败:', error);
            const serverDetails = error.message.includes('details') ? error.message : '';
            const msg = window.i18n?.t('fengshui.followup.error') || 'AI解答失败，请稍后重试';
            alert(msg + '\n\n详情: ' + (error.message || '未知错误'));
        } finally {
            button.disabled = false;
            loading.classList.add('hidden');
        }
    }

    /**
     * 构建系统提示词 - 使用优化的深度分析提示词
     */
    function buildSystemPrompt() {
        // 获取当前语言
        const lang = localStorage.getItem('preferredLanguage') || 'zh';

        // 使用CONFIG中的优化系统提示词
        if (window.CONFIG?.PROMPTS?.FENGSHUI?.FOLLOWUP_SYSTEM) {
            return window.CONFIG.PROMPTS.FENGSHUI.FOLLOWUP_SYSTEM(lang);
        }

        // 降级到简化版本
        const isEnglish = lang === 'en';

        if (isEnglish) {
            return `You are an experienced Feng Shui master, proficient in traditional Feng Shui and modern residential environment design.
Your answers should:
1. Be professional yet easy to understand
2. Combine traditional wisdom with modern practicality
3. Provide specific and actionable advice
4. Focus on practical implementation
5. Avoid overly superstitious statements

Please answer the user's Feng Shui questions in clear and concise language.

**IMPORTANT: Please respond in ENGLISH. All text must be in English.**`;
        }

        return `你是一位经验丰富的风水大师，精通传统风水学和现代居住环境设计。
你的回答应该：
1. 专业且易懂
2. 结合传统智慧和现代实用性
3. 提供具体可行的建议
4. 注重实际操作性
5. 避免过于迷信的说法

请用简洁明了的语言回答用户的风水问题。

**重要：请用中文回复。所有文本必须是中文。**`;
    }

    /**
     * 构建用户提示词 - 支持多语言 - 使用优化的深度分析框架
     */
    function buildUserPrompt(result, question) {
        // 获取当前语言
        const lang = localStorage.getItem('preferredLanguage') || 'zh';
        const isEnglish = lang === 'en';

        const direction = result.direction || (isEnglish ? 'Unknown' : '未知');
        const elements = result.elements || {};

        // 关键修复：从结果中剔除大体积图片数据，防止追问时因请求过大导致400/500错误
        const elementsStr = `Wood: ${elements.wood || 0}%, Fire: ${elements.fire || 0}%, Earth: ${elements.earth || 0}%, Metal: ${elements.metal || 0}%, Water: ${elements.water || 0}%`;
        const elementsStrZh = `木: ${elements.wood || 0}%, 火: ${elements.fire || 0}%, 土: ${elements.earth || 0}%, 金: ${elements.metal || 0}%, 水: ${elements.water || 0}%`;

        if (isEnglish) {
            return `Answer the user's Feng Shui follow-up question based on the analysis below.

Space Context:
- Direction: ${direction}
- Elements Balance: ${elementsStr}
- Previous Analysis Summary: ${result.directionAnalysis || 'None'}

User's Question: ${question}

Requirements:
1. Provide specific, actionable alternative solutions.
2. Be professional and concise (about 300 words).
3. Focus on practicality.
**Response in ENGLISH.**`;
        }

        return `根据下方的风水分析背景回答用户的咨询问题，并提供替代方案。

空间背景：
- 方位：${direction}
- 五行分布：${elementsStrZh}
- 原有分析详情：${result.directionAnalysis || '无'}

用户咨询的问题：${question}

要求：
1. 提供具体、低成本且可落地的替代方案。
2. 语气专业，解答详略得当（300-500字）。
3. 重点回答用户的疑问。
**用中文回复。**`;
    }

    /**
     * 格式化AI答案 - 支持多语言关键词高亮
     */
    function formatAnswer(answer) {
        // 获取当前语言
        const lang = localStorage.getItem('preferredLanguage') || 'zh';
        const isEnglish = lang === 'en';

        // 将换行符转换为HTML
        let formatted = answer.replace(/\n/g, '<br>');

        // 高亮关键词
        const keywords = isEnglish ? [
            'Recommend', 'Suggestion', 'Advice', 'Note', 'Suitable', 'Avoid', 'Enhance', 'Improve',
            'Layout', 'Direction', 'Color', 'Plant', 'Crystal', 'Mirror',
            'Wealth', 'Career', 'Health', 'Romance',
            'East', 'South', 'West', 'North', 'Southeast', 'Southwest', 'Northeast', 'Northwest',
            'Wood', 'Fire', 'Earth', 'Metal', 'Water',
            'Important', 'Key', 'Essential', 'Critical', 'Beneficial'
        ] : [
            '建议', '注意', '适合', '避免', '提升', '改善', '布局', '方位',
            '颜色', '植物', '水晶', '镜子', '财位', '文昌位', '桃花位',
            '东', '南', '西', '北', '东南', '西南', '东北', '西北',
            '木', '火', '土', '金', '水', '重要', '关键', '必须', '有利'
        ];

        keywords.forEach(keyword => {
            const regex = new RegExp(`\\b(${keyword})\\b`, 'gi');
            formatted = formatted.replace(regex, '<span class="text-mystic-gold font-semibold">$1</span>');
        });

        // 处理列表
        formatted = formatted.replace(/(\d+)\.\s/g, '<br><strong class="text-mystic-gold">$1.</strong> ');

        return formatted;
    }

    /**
     * 初始化追问功能
     */
    function initFollowup(fengshuiResult) {
        currentFengshuiResult = fengshuiResult;

        // 生成并渲染建议问题
        const questions = generateSuggestedQuestions(fengshuiResult);
        renderSuggestedQuestions(questions);

        // 绑定追问按钮事件
        const askButton = document.getElementById('askFengshuiFollowup');
        if (askButton) {
            askButton.onclick = handleFollowupQuestion;
        }

        // 支持回车键提交
        const input = document.getElementById('fengshuiFollowupInput');
        if (input) {
            input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                    handleFollowupQuestion();
                }
            });
        }

        // 监听语言切换事件
        window.addEventListener('languageChanged', () => {
            if (currentFengshuiResult) {
                const questions = generateSuggestedQuestions(currentFengshuiResult);
                renderSuggestedQuestions(questions);
            }
        });
    }

    /**
     * 重置追问功能
     */
    function resetFollowup() {
        currentFengshuiResult = null;

        const input = document.getElementById('fengshuiFollowupInput');
        const answerSection = document.getElementById('fengshuiFollowupAnswer');
        const suggestionsContainer = document.getElementById('fengshuiFollowupSuggestions');

        if (input) input.value = '';
        if (answerSection) answerSection.classList.add('hidden');
        if (suggestionsContainer) suggestionsContainer.innerHTML = '';
    }

    // 导出到全局
    window.FengshuiFollowup = {
        init: initFollowup,
        reset: resetFollowup
    };

})();
