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
        const t = (key) => window.i18n?.t(key);

        const suggestions = [
            t('fengshui.followup.suggested1'),
            t('fengshui.followup.suggested2'),
            t('fengshui.followup.suggested3'),
            t('fengshui.followup.suggested4'),
            t('fengshui.followup.suggested5'),
            t('fengshui.followup.suggested6')
        ].filter(Boolean);

        // 根据五行平衡情况添加特定建议
        if (result && result.elements) {
            const elements = result.elements;

            // 如果水元素低
            if (elements.water && elements.water < 50) {
                const waterSug = t('fengshui.followup.suggested_water');
                if (waterSug) suggestions.unshift(waterSug);
            }

            // 如果火元素低
            if (elements.fire && elements.fire < 50) {
                const fireSug = t('fengshui.followup.suggested_fire');
                if (fireSug) suggestions.unshift(fireSug);
            }
        }

        return [...new Set(suggestions)].slice(0, 6); // 返回最多6个唯一建议
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
        const lang = localStorage.getItem('preferredLanguage') || 'en';

        if (window.CONFIG?.PROMPTS?.FENGSHUI?.FOLLOWUP_SYSTEM) {
            return window.CONFIG.PROMPTS.FENGSHUI.FOLLOWUP_SYSTEM(lang);
        }

        const t = (key) => window.i18n?.t(key) || '';
        const isEnglish = lang === 'en';

        // Use i18n for base prompt components if possible, or fall back to structured templates
        return `${t('fengshui.followup.system_base') || 'You are a Feng Shui master.'}
${t('fengshui.followup.system_rules') || '1. Professional 2. Actionable 3. Accurate.'}
${t('fengshui.followup.system_language_rule') || `Important: Please respond in ${isEnglish ? 'ENGLISH' : 'CHINESE'}.`}`;
    }

    /**
     * 构建用户提示词 - 支持多语言 - 使用优化的深度分析框架
     */
    function buildUserPrompt(result, question) {
        const lang = localStorage.getItem('preferredLanguage') || 'en';
        const t = (key) => window.i18n?.t(key) || '';

        const direction = result.direction || t('common.unknown');
        const elements = result.elements || {};
        const elementsStr = `Wood: ${elements.wood || 0}%, Fire: ${elements.fire || 0}%, Earth: ${elements.earth || 0}%, Metal: ${elements.metal || 0}%, Water: ${elements.water || 0}%`;

        return `${t('fengshui.followup.context_header') || 'Analysis Context:'}
- ${t('fengshui.compass.direction')}: ${direction}
- ${t('fengshui.elements.title')}: ${elementsStr}
- ${t('fengshui.analysis.results.title')}: ${result.directionAnalysis || 'N/A'}

${t('fengshui.followup.user_question_label') || 'User Question'}: ${question}

${t('fengshui.followup.response_requirements') || 'Provide actionable advice in the requested language.'}`;
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

        // 高亮关键词 - 使用 translations.js 中的关键词列表
        const keywordsStr = window.i18n?.t('divination.followup.keywords') || '';
        const keywords = keywordsStr.split(',').filter(Boolean);

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
