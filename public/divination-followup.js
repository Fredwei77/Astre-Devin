/**
 * 占卜追问功能
 * Divination Follow-up Questions Feature
 */

(function () {
    'use strict';

    // 存储当前占卜结果
    let currentDivinationResult = null;

    /**
     * 根据占卜结果生成建议追问问题 - 支持多语言
     */
    function generateSuggestedQuestions(result, category) {
        // 获取当前语言
        const lang = window.i18n?.getCurrentLanguage() || 'en';
        const isEnglish = lang === 'en';

        // Try to get category specific suggestions from translations
        const suggestionKey = category ? `divination.followup.suggestions.${category}` : 'divination.followup.suggestions.general';
        const suggestionsStr = window.i18n?.t(suggestionKey);

        if (suggestionsStr && suggestionsStr !== suggestionKey) {
            return suggestionsStr.split(',').map(q => q.trim());
        }

        // Fallback to general suggestions if category specific one fails
        const generalStr = window.i18n?.t('divination.followup.suggestions.general');
        if (generalStr && generalStr !== 'divination.followup.suggestions.general') {
            return generalStr.split(',').map(q => q.trim());
        }

        // final fallback based on language
        if (lang === 'zh-TW') {
            return ["如何提升我的整體運勢？", "未來一年需要注意什麼？"];
        }
        return isEnglish ?
            ["How can I improve my overall fortune?", "What should I pay attention to in the coming year?"] :
            ["如何提升我的整体运势？", "未来一年需要注意什么？"];
    }

    /**
     * 渲染建议追问问题
     */
    function renderSuggestedQuestions(questions) {
        const container = document.getElementById('divinationFollowupSuggestions');
        if (!container) return;

        container.innerHTML = '';

        questions.forEach(question => {
            const button = document.createElement('button');
            button.className = 'text-xs bg-mystic-gold/20 hover:bg-mystic-gold/30 text-mystic-gold border border-mystic-gold/40 px-3 py-2 rounded-lg transition-all';
            button.textContent = question;
            button.onclick = () => {
                document.getElementById('divinationFollowupInput').value = question;
            };
            container.appendChild(button);
        });
    }

    /**
     * 处理追问请求 - 使用优化的系统提示词
     */
    async function handleFollowupQuestion() {
        console.log('🤖 开始处理追问请求...');

        const input = document.getElementById('divinationFollowupInput');
        const button = document.getElementById('askDivinationFollowup');
        const loading = document.getElementById('divinationFollowupLoading');
        const answerSection = document.getElementById('divinationFollowupAnswer');
        const answerText = document.getElementById('divinationFollowupAnswerText');

        const question = input.value.trim();
        console.log('📝 用户问题:', question);

        if (!question) {
            console.warn('⚠️ 用户未输入问题');
            alert(window.i18n?.t('divination.followup.emptyError') || '请输入您的问题');
            return;
        }

        if (!currentDivinationResult) {
            console.error('❌ 未找到占卜结果');
            alert(window.i18n?.t('divination.followup.noResultError') || '请先进行占卜分析');
            return;
        }

        console.log('✅ 验证通过，开始AI分析...');

        // 显示加载状态
        button.disabled = true;
        loading.classList.remove('hidden');
        answerSection.classList.add('hidden');
        answerText.innerHTML = ''; // 清空之前的内容

        try {
            // 获取当前语言
            const lang = window.i18n?.getCurrentLanguage() || 'en';

            // 获取优化的系统提示词
            const systemPrompt = window.CONFIG?.PROMPTS?.DIVINATION?.FOLLOWUP_SYSTEM?.(lang) ||
                (lang === 'en' ?
                    'You are a professional Eastern numerology master.' :
                    '你是一位专业的东方命理大师。');

            // 构建追问上下文（用户提示词）
            const userPrompt = buildFollowupContext(currentDivinationResult, question);

            // 调用AI服务，传入系统提示词和用户提示词
            // 确保使用正确的AI服务实例
            let aiService = window.aiService;
            if (!aiService && window.AIService) {
                console.log('🔄 尝试创建新的 AIService 实例...');
                aiService = new window.AIService();
            }

            if (!aiService) {
                throw new Error('AI服务未初始化 (AIService missing)');
            }
            const response = await aiService.chatWithSystem(systemPrompt, userPrompt, {
                type: 'divination-followup'
            });

            // 隐藏加载状态并显示回答区域
            loading.classList.add('hidden');
            answerSection.classList.remove('hidden');

            // 解析响应内容和 Mock标记
            let content = response;
            let isMock = false;

            if (response && typeof response === 'object') {
                content = response.content || response.text || response.answer || '';
                if (response.isMock) isMock = true;
            }

            // 格式化解析 Markdown
            let formattedHtml = formatAnswer(content);

            // 如果是模拟数据，添加提示徽章
            if (isMock) {
                const badgeHtml = `
                    <div class="mb-4 inline-flex items-center px-3 py-1 rounded-full bg-mystic-gold/10 border border-mystic-gold/30 text-mystic-gold text-xs font-medium">
                        <i class="fas fa-flask mr-2"></i>
                        ${window.i18n?.t('common.trialMode') || 'Trial Mode / 模拟演示'}
                    </div>
                    <div class="mb-2 text-xs text-moon-silver/60">
                        ${window.i18n?.t('common.trialMessage') || 'Upgrade to Premium for real AI analysis.'}
                    </div>
                `;
                formattedHtml = badgeHtml + formattedHtml;
            }

            // 执行打字机效果
            if (window.TypingEffect) {
                await window.TypingEffect.type(answerText, formattedHtml, 30);
            } else {
                answerText.innerHTML = formattedHtml;
            }

            // 滚动到答案位置
            answerSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

            // 清空输入框
            input.value = '';

        } catch (error) {
            console.error('追问失败:', error);

            // 增强重试/回退逻辑
            console.warn('⚠️ AI服务调用失败，尝试使用模拟数据回退');
            try {
                const aiService = window.aiService || (window.AIService ? new window.AIService() : null);
                if (aiService && typeof aiService.getMockResponse === 'function') {
                    const mockResponse = await aiService.getMockResponse('divination-followup');
                    if (mockResponse) {
                        console.log('✅ 成功获取占卜追问模拟数据');

                        // 隐藏加载状态并显示回答区域
                        loading.classList.add('hidden');
                        answerSection.classList.remove('hidden');

                        // 格式化解析 Markdown
                        const formattedHtml = formatAnswer(mockResponse);

                        // 执行打字机效果
                        if (window.TypingEffect) {
                            await window.TypingEffect.type(answerText, formattedHtml, 30);
                        } else {
                            answerText.innerHTML = `<div class="typewriter-text">${formattedHtml}</div>`;
                        }

                        // 滚动到答案位置
                        answerSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                        return;
                    }
                }
            } catch (fallbackError) {
                console.error('模拟追问回退失败:', fallbackError);
            }

            console.error('错误详情:', {
                message: error.message,
                aiServiceExists: !!window.aiService,
                AIServiceExists: !!window.AIService,
                configExists: typeof CONFIG !== 'undefined'
            });

            // 更详细的错误提示
            let errorMessage = window.i18n?.t('divination.followup.error') || 'AI解答失败，请稍后重试';
            if (error.message.includes('AI服务未初始化')) {
                errorMessage = window.i18n?.t('divination.followup.initError') || 'AI服务初始化失败，请刷新页面重试';
            } else if (error.message.includes('请先进行占卜分析')) {
                errorMessage = window.i18n?.t('divination.followup.noResultError') || '请先进行占卜分析后再提问';
            }

            alert(errorMessage);
        } finally {
            button.disabled = false;
            loading.classList.add('hidden');
        }
    }

    /**
     * 构建追问上下文 - 支持多语言 - 使用优化的深度分析提示词
     */
    function buildFollowupContext(result, question) {
        // 获取当前语言
        const lang = window.i18n?.getCurrentLanguage() || 'en';
        const isEnglish = lang === 'en';

        const birthInfo = result.birthInfo || {};
        const category = result.category || (isEnglish ? 'General' : '综合');

        // 提取五行数据
        const elements = result.elements || {};
        const elementsStr = `Wood: ${elements.wood || 0}, Fire: ${elements.fire || 0}, Earth: ${elements.earth || 0}, Metal: ${elements.metal || 0}, Water: ${elements.water || 0}`;
        const elementsStrZh = `木: ${elements.wood || 0}, 火: ${elements.fire || 0}, 土: ${elements.earth || 0}, 金: ${elements.metal || 0}, 水: ${elements.water || 0}`;

        if (isEnglish) {
            return `Please answer the user's follow-up question based on the following birth information and perform in-depth BaZi analysis.

**Task**: Based on the birth information below, conduct deep BaZi chart analysis and fortune deduction. Follow the "Great Luck" rules (distinguish Yang years and Yin years), and be sure to calculate Fetal Element, Life Palace, and Body Palace.

**Input Data (User Information)**:
- Gender: ${birthInfo.gender || 'Unknown'}
- Birth Place: ${birthInfo.birthPlace || 'Unknown'} (for True Solar Time correction)
- Birth Date: ${birthInfo.birthDate || 'Unknown'}
- Birth Time: ${birthInfo.birthTime || 'Unknown'}
- Four Pillars: Year [${birthInfo.yearPillar || 'Unknown'}] Month [${birthInfo.monthPillar || 'Unknown'}] Day [${birthInfo.dayPillar || 'Unknown'}] Hour [${birthInfo.hourPillar || 'Unknown'}]

**Analysis Category**: ${category}

**Previous Divination Summary**:
${result.summary || 'No previous summary'}

**Five Elements Distribution**: ${elementsStr}

**User's Follow-up Question**:
${question}

**Analysis Framework & Output Requirements**:

Please output the report following these steps, with a language style combining classical Chinese and vernacular, featuring both the solemnity of original text citations and the clarity of modern explanations:

**Part 1: Destiny Overview & Original Chart Analysis**
- BaZi Chart: List Year, Month, Day, Hour pillars, plus Fetal Element, Life Palace, Body Palace
- Strength & Favorable/Unfavorable Elements (Core):
  * Analyze Day Master's timing, positioning, and momentum
  * Determine if Day Master is strong or weak, clearly state the "pattern"
  * Precisely identify favorable and unfavorable elements, explain reasons (e.g., mediation, adjustment, support/suppression)
  * **Requirement**: Must cite original texts from "Di Tian Sui" or "Zi Ping Zhen Quan" to support your judgment
- Four Palaces & Six Relatives Analysis:
  * Detailed interpretation of Parents Palace (Year), Career Palace (Month), Marriage Palace (Day Branch), Children Palace (Hour)
  * Include analysis of auspicious/inauspicious stars (e.g., Tian Yi Noble, Peach Blossom, Yang Blade, Void) on each palace

**Part 2: Annual Fortune (2026 Bing Wu Year)**
- Annual Overview: Combine Great Luck with 2026 Bing Wu year (Horse year), analyze relationships of clash, harm, combination, punishment between Heavenly Stems and Earthly Branches
- Twelve Monthly Details: Analyze fortune fluctuations for each lunar month from January to December 2026 (covering career, wealth, health, relationships)
- Classical Citations: For annual fortune judgments, cite relevant passages from "San Ming Tong Hui" or "Liu Nian Mi Duan"

**Part 3: Survival Guide & Fortune Enhancement**
- Feng Shui Adjustments: Based on favorable elements, provide specific home Feng Shui suggestions (colors, directions, ornaments)
- Daily Life Details: Provide specific actionable "tips" (dietary advice, clothing colors, suitable accessory materials)
- Psychological & Behavioral Advice: Combine MBTI and psychology to analyze blind spots in personality and provide corrective suggestions

**Part 4: Social & Marriage Portrait (Key Section)**
- Benefactors & Adversaries:
  * Favorable Connections: Specific BaZi characteristics (e.g., "favorable to those with Bing Fire in Heavenly Stems"), explain complementarity
  * Avoid Connections: Specific BaZi characteristics (e.g., "avoid cooperation with those having Shen Metal in Earthly Branches")
  * Protectors: Characteristics of destined benefactors
- Marriage Compatibility Portrait:
  * Destined Partner Characteristics: Combine physiognomy to describe future partner's appearance (face shape, height, facial features), approximate age difference
  * Occupation & Personality: Partner's industry attributes, specific personality keywords (described with psychology)
  * Interaction Pattern: Predict interaction dynamics in marriage

**Constraints**:
- For complex terminology, must provide easy-to-understand explanations
- Use Markdown formatting, bold key points
- Maintain objectivity and neutrality; even with inauspicious signs, provide solutions or mitigation methods (attitude of "gentleman asks about disasters, not blessings")

**IMPORTANT: Please respond in ENGLISH. All text must be in English. Use professional yet accessible language.**`;
        }

        return `请根据以下出生信息回答用户的追问，并进行深度八字分析。

**Task（任务）**：根据下方的出生信息，进行深度的八字排盘与运势推演。请遵循"排大运"规则（分阳年、阴年），务必计算胎元、命宫和身宫。

**Input Data（命主信息）**：
- 性别：${birthInfo.gender || '未知'}
- 出生地点：${birthInfo.birthPlace || '未知'}（用于校对真太阳时）
- 出生日期：${birthInfo.birthDate || '未知'}
- 出生时间：${birthInfo.birthTime || '未知'}
- 四柱：年【${birthInfo.yearPillar || '未知'}】月【${birthInfo.monthPillar || '未知'}】日【${birthInfo.dayPillar || '未知'}】时【${birthInfo.hourPillar || '未知'}】

**分析类别**：${category}

**之前的占卜摘要**：
${result.summary || '无之前摘要'}

**五行分布**：${elementsStrZh}

**用户的追问**：
${question}

**Analysis Framework（分析框架&输出要求）**：

请按以下步骤输出报告，语言风格需古文与白话文结合，既有原典引用的庄重，又有现代解说的通透：

**第一部分：命局总评与原局分析**
- 八字排盘：列出年、月、日、时四柱，以及胎元、命宫、身宫
- 强弱喜忌（核心）：
  * 分析日主得令、得地、得势情况
  * 判定身强还是身弱，明确指出"格局"
  * 精准定取喜用神与忌神，并解释原因（如：通关、调候、扶抑）
  * **要求**：在此处必须引用《滴天髓》或《子平真诠》原文来佐证你的判断
- 四宫六亲分析：
  * 父母宫（年柱）、事业宫（月柱）、婚姻宫（日支）、子女宫（时柱）的详细解读
  * 包含神煞分析（如天乙贵人、桃花、羊刃、空亡等）对各宫位的影响

**第二部分：流年运势（${new Date().getFullYear() + 1}年）**
- 流年总纲：结合大运与${new Date().getFullYear() + 1}年流年，分析天干地支产生的刑冲合害关系
- 十二流月详解：请逐月分析${new Date().getFullYear() + 1}年农历正月至十二月的运势起伏（需涵盖事业、财运、健康、感情）
- 引用佐证：针对流年吉凶，请引用《三命通会》或《流年秘断》中的相关断语

**第三部分：生存指南与改运操作**
- 风水调节：根据喜用神，给出具体的家居风水建议（如颜色、方位、摆件）
- 生活细节：给出日常生活中具体可执行的"小妙招"（如饮食建议、穿搭颜色、适合佩戴的饰品材质）
- 心理与行为建议：结合MBTI及心理学，分析命主性格中的盲点，并给出修正建议

**第四部分：社交与婚恋画像（重磅）**
- 贵人与小人：
  * 交好对象：具体的八字特征（如："喜见天干透丙火之人"），并解释为何互补
  * 远离对象：具体的八字特征（如："忌与地支见申金者合作"）
  * 照拂者：命中注定的贵人特征
- 婚配画像：
  * 正缘特征：结合面相学描述未来伴侣的外貌（脸型、身高、五官特征）、大致年龄差
  * 职业与性格：对方从事的行业属性、具体的性格关键词（结合心理学描述）
  * 相处模式：两人在婚姻中的互动模式预判

**Constraints（约束）**：
- 对于复杂的术语，必须提供通俗易懂的解释
- 使用Markdown排版，重点内容请加粗
- 保持客观中立，即使有凶象，也要提供化解或缓解之道（"君子问灾不问福"的态度）

**重要：请用中文回复。所有文本必须是中文。使用专业但易懂的语言。**`;
    }

    /**
     * 格式化AI答案 - 支持多语言关键词高亮
     */
    function formatAnswer(answer) {
        // 优先使用全局统一的 Markdown 渲染器
        if (window.utils && typeof window.utils.renderMarkdown === 'function') {
            return window.utils.renderMarkdown(answer);
        }

        // 使用 MarkdownFormatter 进行解析
        return window.MarkdownFormatter ? window.MarkdownFormatter.parse(answer) : answer.replace(/\n/g, '<br>');

        // 从 i18n 系统获取关键词并进行高亮（在 HTML 生成后处理）
        const keywordsKey = 'divination.followup.keywords';
        const keywordsStr = window.i18n?.t(keywordsKey);

        if (keywordsStr && keywordsStr !== keywordsKey) {
            const keywords = keywordsStr.split(',').map(k => k.trim());
            keywords.forEach(keyword => {
                // Determine if it's CJK to use appropriate regex
                const isCJK = /[\u4e00-\u9fa5]/.test(keyword);
                // For English use word boundaries, for CJK use simple match
                const regex = isCJK ? new RegExp(`(${keyword})`, 'g') : new RegExp(`\\b(${keyword})\\b`, 'gi');
                formatted = formatted.replace(regex, '<span class="text-mystic-gold font-semibold">$1</span>');
            });
        }

        return formatted;
    }

    /**
     * 初始化追问功能
     */
    function initFollowup(divinationResult, selectedCategory) {
        console.log('🔮 初始化占卜追问功能...');

        if (!divinationResult) {
            console.warn('⚠️ 占卜结果为空，无法初始化追问功能');
            return;
        }

        currentDivinationResult = divinationResult;
        console.log('✅ 占卜结果已保存:', divinationResult);

        // 生成并渲染建议问题
        const questions = generateSuggestedQuestions(divinationResult, selectedCategory);
        renderSuggestedQuestions(questions);

        // 绑定追问按钮事件
        const askButton = document.getElementById('askDivinationFollowup');
        if (askButton) {
            askButton.onclick = handleFollowupQuestion;
            console.log('✅ 追问按钮事件已绑定');
        } else {
            console.warn('⚠️ 未找到追问按钮元素');
        }

        // 支持回车键提交
        const input = document.getElementById('divinationFollowupInput');
        if (input) {
            input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                    handleFollowupQuestion();
                }
            });
            console.log('✅ 追问输入框键盘事件已绑定');
        } else {
            console.warn('⚠️ 未找到追问输入框元素');
        }

        // 监听语言切换事件
        window.addEventListener('languageChanged', () => {
            if (currentDivinationResult) {
                const questions = generateSuggestedQuestions(currentDivinationResult, selectedCategory);
                renderSuggestedQuestions(questions);
            }
        });

        console.log('🔮 占卜追问功能初始化完成');
    }

    /**
     * 重置追问功能
     */
    function resetFollowup() {
        currentDivinationResult = null;

        const input = document.getElementById('divinationFollowupInput');
        const answerSection = document.getElementById('divinationFollowupAnswer');
        const suggestionsContainer = document.getElementById('divinationFollowupSuggestions');

        if (input) input.value = '';
        if (answerSection) answerSection.classList.add('hidden');
        if (suggestionsContainer) suggestionsContainer.innerHTML = '';
    }

    // 导出到全局
    window.DivinationFollowup = {
        init: initFollowup,
        reset: resetFollowup
    };

})();
