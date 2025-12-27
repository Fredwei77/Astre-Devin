/**
 * I-Ching 深挖真相功能修复
 * Fix for I-Ching Deep Truth Exploration Feature
 */

(function () {
    'use strict';

    // 存储当前易经结果
    let currentIChingResult = null;

    /**
     * 根据易经结果生成建议追问问题 - 支持多语言
     */
    function generateIChingSuggestedQuestions(result) {
        // 获取当前语言
        const lang = localStorage.getItem('preferredLanguage') || 'zh';
        const isEnglish = lang === 'en';

        if (isEnglish) {
            return [
                "How can I better seize this opportunity?",
                "What risks should I be aware of?",
                "What is the best timing for action?",
                "How should I adjust my mindset?",
                "What resources do I need to prepare?",
                "How to handle unexpected situations?"
            ];
        } else {
            return [
                "如何更好地把握这个机会？",
                "需要注意什么风险？",
                "什么时候是行动的最佳时机？",
                "应该如何调整心态？",
                "需要准备什么资源？",
                "如何应对意外情况？"
            ];
        }
    }

    /**
     * 渲染建议追问问题
     */
    function renderIChingSuggestedQuestions(questions) {
        const container = document.getElementById('followupSuggestions');
        if (!container) return;

        container.innerHTML = '';

        questions.forEach(question => {
            const button = document.createElement('button');
            button.className = 'text-xs bg-mystic-gold/20 hover:bg-mystic-gold/30 text-mystic-gold border border-mystic-gold/40 px-3 py-2 rounded-lg transition-all';
            button.textContent = question;
            button.onclick = () => {
                document.getElementById('followupInput').value = question;
            };
            container.appendChild(button);
        });
    }

    /**
     * 处理易经追问请求
     */
    async function handleIChingFollowupQuestion() {
        console.log('🔮 开始处理易经追问请求...');

        const input = document.getElementById('followupInput');
        const button = document.getElementById('askFollowup');
        const loading = document.getElementById('followupLoading');
        const answerSection = document.getElementById('followupAnswer');
        const answerText = document.getElementById('followupAnswerText');

        const question = input.value.trim();
        console.log('📝 用户问题:', question);

        if (!question) {
            console.warn('⚠️ 用户未输入问题');
            const lang = localStorage.getItem('preferredLanguage') || 'zh';
            const message = lang === 'en' ? 'Please enter your question' : '请输入您的问题';
            alert(message);
            return;
        }

        if (!currentIChingResult) {
            console.error('❌ 未找到易经结果');
            const lang = localStorage.getItem('preferredLanguage') || 'zh';
            const message = lang === 'en' ? 'Please perform I-Ching divination first' : '请先进行易经占卜';
            alert(message);
            return;
        }

        console.log('✅ 验证通过，开始AI分析...');

        // 显示加载状态
        button.disabled = true;
        if (loading) loading.classList.remove('hidden');
        if (answerSection) answerSection.classList.add('hidden');

        try {
            // 获取当前语言
            const lang = localStorage.getItem('preferredLanguage') || 'zh';

            // 构建易经追问的系统提示词
            const systemPrompt = buildIChingSystemPrompt(lang);

            // 构建用户提示词
            const userPrompt = buildIChingFollowupContext(currentIChingResult, question, lang);

            // 调用AI服务
            const aiService = window.aiService || (window.AIService ? new window.AIService() : null);
            if (!aiService) {
                throw new Error('AI服务未初始化');
            }
            const response = await aiService.chatWithSystem(systemPrompt, userPrompt);

            // 显示答案
            if (answerText) {
                answerText.innerHTML = formatIChingAnswer(response, lang);
            }
            if (answerSection) {
                answerSection.classList.remove('hidden');
                // 滚动到答案位置
                answerSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }

        } catch (error) {
            console.error('易经追问失败:', error);

            const lang = localStorage.getItem('preferredLanguage') || 'zh';
            let errorMessage = lang === 'en' ? 'AI analysis failed, please try again later' : 'AI解答失败，请稍后重试';

            if (error.message.includes('AI服务未初始化')) {
                errorMessage = lang === 'en' ? 'AI service initialization failed, please refresh the page' : 'AI服务初始化失败，请刷新页面重试';
            }

            alert(errorMessage);
        } finally {
            button.disabled = false;
            if (loading) loading.classList.add('hidden');
        }
    }

    /**
     * 构建易经系统提示词
     */
    function buildIChingSystemPrompt(lang) {
        if (lang === 'en') {
            return `You are a professional I-Ching master with deep understanding of Chinese traditional wisdom. You have extensive experience in interpreting hexagrams and providing insightful guidance based on the Book of Changes (I-Ching).

Your expertise includes:
- Traditional I-Ching interpretation methods
- Understanding of hexagram symbolism and meaning
- Ability to relate ancient wisdom to modern life situations
- Providing practical guidance based on I-Ching principles
- Deep knowledge of Chinese philosophy and Five Elements theory

Please provide thoughtful, wise, and practical guidance based on the I-Ching divination result and the user's follow-up question.`;
        } else {
            return `你是一位专业的易经大师，深谙中华传统智慧。你拥有丰富的卦象解读经验，能够基于《易经》提供深刻的指导。

你的专长包括：
- 传统易经解卦方法
- 卦象象征与含义的理解
- 将古代智慧与现代生活情境相结合的能力
- 基于易经原理提供实用指导
- 中华哲学和五行理论的深厚造诣

请基于易经占卜结果和用户的追问，提供深思熟虑、智慧且实用的指导。`;
        }
    }

    /**
     * 构建易经追问上下文
     */
    function buildIChingFollowupContext(result, question, lang) {
        if (lang === 'en') {
            return `Based on the following I-Ching divination result, please provide deep analysis and guidance for the user's follow-up question.

**I-Ching Divination Result:**
- Main Hexagram: ${result.mainHexagram || 'Unknown'}
- Changing Lines: ${result.changingLines || 'None'}
- Transformed Hexagram: ${result.transformedHexagram || 'None'}
- Question Category: ${result.category || 'General'}
- Divination Summary: ${result.summary || 'No summary available'}

**User's Follow-up Question:**
${question}

**Please provide:**
1. **Deep Analysis**: Detailed interpretation of how the hexagram relates to the user's specific question
2. **Practical Guidance**: Specific actionable advice based on I-Ching wisdom
3. **Timing Considerations**: When to act or wait based on the hexagram guidance
4. **Mindset Adjustments**: How to align thinking with the hexagram's teaching
5. **Potential Outcomes**: What to expect based on different approaches

Please respond in English with wisdom, clarity, and practical insight.`;
        } else {
            return `请基于以下易经占卜结果，为用户的追问提供深度分析和指导。

**易经占卜结果:**
- 主卦: ${result.mainHexagram || '未知'}
- 变爻: ${result.changingLines || '无'}
- 变卦: ${result.transformedHexagram || '无'}
- 问卦类别: ${result.category || '综合'}
- 占卜总结: ${result.summary || '无摘要'}

**用户的追问（寻求深挖真相）:**
${question}

**请提供:**
1. **深度解析**: 详细阐释卦象与用户具体问题的关系
2. **实用指导**: 基于易经智慧的具体可行建议
3. **时机把握**: 根据卦象指导何时行动或等待
4. **心态调整**: 如何让思维与卦象教导保持一致
5. **可能结果**: 基于不同做法的预期outcomes

请用中文回复，体现智慧、清晰和实用的洞察。`;
        }
    }

    /**
     * 格式化易经答案
     */
    function formatIChingAnswer(answer, lang) {
        // 使用 MarkdownFormatter 进行解析
        let formatted = window.MarkdownFormatter ? window.MarkdownFormatter.parse(answer) : answer.replace(/\n/g, '<br>');

        // 高亮关键词（在 HTML 生成后处理）
        const keywords = lang === 'en' ? [
            'Guidance', 'Wisdom', 'Timing', 'Action', 'Wait', 'Caution', 'Opportunity',
            'Hexagram', 'Changing', 'Transform', 'Balance', 'Harmony', 'Flow', 'Energy'
        ] : [
            '指导', '智慧', '时机', '行动', '等待', '谨慎', '机会',
            '卦象', '变化', '转化', '平衡', '和谐', '顺势', '能量'
        ];

        keywords.forEach(keyword => {
            const regex = new RegExp(`\\b(${keyword})\\b`, 'gi');
            formatted = formatted.replace(regex, '<span class="text-mystic-gold font-semibold">$1</span>');
        });

        return formatted;
    }

    /**
     * 初始化易经追问功能
     */
    function initIChingFollowup(ichingResult) {
        console.log('🔮 初始化易经追问功能...');

        if (!ichingResult) {
            console.warn('⚠️ 易经结果为空，无法初始化追问功能');
            return;
        }

        currentIChingResult = ichingResult;
        console.log('✅ 易经结果已保存:', ichingResult);

        // 生成并渲染建议问题
        const questions = generateIChingSuggestedQuestions(ichingResult);
        renderIChingSuggestedQuestions(questions);

        // 绑定追问按钮事件
        const askButton = document.getElementById('askFollowup');
        if (askButton) {
            askButton.onclick = handleIChingFollowupQuestion;
            console.log('✅ 易经追问按钮事件已绑定');
        } else {
            console.warn('⚠️ 未找到易经追问按钮元素');
        }

        // 支持回车键提交
        const input = document.getElementById('followupInput');
        if (input) {
            input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                    handleIChingFollowupQuestion();
                }
            });
            console.log('✅ 易经追问输入框键盘事件已绑定');
        } else {
            console.warn('⚠️ 未找到易经追问输入框元素');
        }

        console.log('🔮 易经追问功能初始化完成');
    }

    /**
     * 重置易经追问功能
     */
    function resetIChingFollowup() {
        currentIChingResult = null;

        const input = document.getElementById('followupInput');
        const answerSection = document.getElementById('followupAnswer');
        const suggestionsContainer = document.getElementById('followupSuggestions');

        if (input) input.value = '';
        if (answerSection) answerSection.classList.add('hidden');
        if (suggestionsContainer) suggestionsContainer.innerHTML = '';
    }

    // 导出到全局
    window.IChingFollowup = {
        init: initIChingFollowup,
        reset: resetIChingFollowup
    };

})();