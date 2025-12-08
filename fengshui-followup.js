/**
 * 风水追问功能
 * Feng Shui Follow-up Questions Feature
 */

(function() {
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
            const response = await window.aiService.sendRequest(systemPrompt, userPrompt, {
                type: 'fengshui-followup',
                temperature: 0.7,
                maxTokens: 2000
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
            const msg = window.i18n?.t('fengshui.followup.error') || 'AI解答失败，请稍后重试';
            alert(msg + ': ' + error.message);
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
        const recommendations = result.recommendations || [];
        const luckyItems = result.luckyItems || [];
        const taboos = result.taboos || [];
        
        // 提取五行数据
        const elementsStr = `Wood: ${elements.wood || 0}%, Fire: ${elements.fire || 0}%, Earth: ${elements.earth || 0}%, Metal: ${elements.metal || 0}%, Water: ${elements.water || 0}%`;
        const elementsStrZh = `木: ${elements.wood || 0}%, 火: ${elements.fire || 0}%, 土: ${elements.earth || 0}%, 金: ${elements.metal || 0}%, 水: ${elements.water || 0}%`;
        
        // 提取建议摘要
        const recommendationsSummary = recommendations.slice(0, 3).map(r => r.title).join(', ');
        
        if (isEnglish) {
            return `Please provide alternative Feng Shui solutions based on the following space analysis results and answer the user's question.

**Task**: Based on the space information below, conduct deep Feng Shui analysis and provide practical alternative solutions.

**Input Data (Space Information)**:
- Current Direction: ${direction}
- Overall Energy Flow Score: ${result.overallScore || 0}%
- Wealth Corner Score: ${result.wealthScore || 0}%
- Health Area Score: ${result.healthScore || 0}%

**Five Elements Balance**: ${elementsStr}

**Previous Analysis Summary**:
${result.directionAnalysis || 'No previous analysis'}

**Current Recommendations**: ${recommendationsSummary || 'None'}

**Lucky Items**: ${luckyItems.join(', ') || 'None'}

**Taboos**: ${taboos.join(', ') || 'None'}

**User's Question (Seeking Alternative Solutions)**:
${question}

**Analysis Framework & Output Requirements**:

Please output the report following these steps, combining traditional Feng Shui wisdom with modern practicality:

**Part 1: Space Energy Analysis & Bagua Layout**
- Analyze the Bagua directions (Qian, Kun, Zhen, Xun, Kan, Li, Gen, Dui) of the current space
- Identify key positions: Wealth Position, Career Position, Health Position, Relationship Position
- Assess energy flow quality and identify blockages or imbalances
- **Requirement**: Must cite original texts from "Yang Zhai San Yao" or "Ba Zhai Ming Jing" to support your analysis

**Part 2: Five Elements Balance & Adjustment**
- Detailed analysis of Five Elements (Wood, Fire, Earth, Metal, Water) distribution
- Identify which elements are excessive or deficient
- Provide specific adjustment methods:
  * Color recommendations (with specific color codes and application areas)
  * Material selections (wood, metal, ceramic, fabric, etc.)
  * Ornament suggestions (size, shape, placement position)

**Part 3: Furniture Layout & Space Optimization**
- Specific furniture placement suggestions based on "command position" principles
- Optimize space flow lines for better energy circulation
- Resolve negative energy issues:
  * Sharp corner resolution methods
  * Beam pressure mitigation techniques
  * Door-to-door conflict solutions
- Provide floor plan sketches or detailed descriptions

**Part 4: Color & Material Selection**
- Recommend color schemes based on space orientation and Five Elements
- Combine traditional Feng Shui with modern aesthetics
- Provide specific material selections (flooring, walls, furniture, textiles)
- Explain the Feng Shui principles behind each choice

**Part 5: Feng Shui Items & Symbolic Placement**
- Recommend specific Feng Shui items:
  * Crystals (type, size, placement position)
  * Plants (species, quantity, care tips)
  * Water features (type, size, direction)
  * Mirrors (size, shape, placement taboos)
- Explain the function and energy properties of each item
- Provide budget-friendly alternatives

**Part 6: Negative Energy Resolution & Fortune Enhancement**
- Identify potential negative energy sources in the space
- Provide specific resolution methods for each issue
- Fortune enhancement techniques:
  * Wealth enhancement methods
  * Career advancement techniques
  * Health improvement strategies
  * Relationship harmony tips
- Provide implementation timeline and priority order

**Constraints**:
- For complex Feng Shui terminology, must provide easy-to-understand explanations
- Use Markdown formatting, bold key points
- Provide multiple alternative solutions considering different budgets
- All suggestions must be practical and implementable
- Explain the "why" behind each recommendation

**IMPORTANT: Please respond in ENGLISH. All text must be in English. Use professional yet accessible language.**`;
        }
        
        return `请根据以下空间分析结果提供替代风水方案，并回答用户的问题。

**Task（任务）**：根据下方的空间信息，进行深度风水分析，并提供实用的替代方案。

**Input Data（空间信息）**：
- 当前方位：${direction}
- 整体能量流评分：${result.overallScore || 0}%
- 财位评分：${result.wealthScore || 0}%
- 健康区评分：${result.healthScore || 0}%

**五行平衡**：${elementsStrZh}

**之前的分析摘要**：
${result.directionAnalysis || '无之前分析'}

**当前建议**：${recommendationsSummary || '无'}

**幸运物品**：${luckyItems.join('、') || '无'}

**禁忌事项**：${taboos.join('、') || '无'}

**用户的问题（寻求替代方案）**：
${question}

**Analysis Framework（分析框架&输出要求）**：

请按以下步骤输出报告，结合传统风水智慧与现代实用性：

**第一部分：空间能量分析与八卦布局**
- 分析当前空间的八卦方位（乾、坤、震、巽、坎、离、艮、兑）
- 确定关键位置：财位、事业位、健康位、感情位
- 评估能量流动质量，识别阻塞或失衡之处
- **要求**：必须引用《阳宅三要》或《八宅明镜》原文来佐证你的分析

**第二部分：五行平衡与调整**
- 详细分析五行（木、火、土、金、水）的分布情况
- 识别哪些元素过旺或不足
- 提供具体调整方法：
  * 颜色建议（具体色号和应用区域）
  * 材质选择（木质、金属、陶瓷、布艺等）
  * 摆件建议（尺寸、形状、摆放位置）

**第三部分：家具布局与空间优化**
- 根据"指挥位"原则，提供具体的家具摆放建议
- 优化空间动线，促进能量流通
- 化解煞气问题：
  * 尖角煞的化解方法
  * 横梁压顶的缓解技巧
  * 门对门冲突的解决方案
- 提供平面图草图或详细描述

**第四部分：颜色与材质选择**
- 根据空间方位和五行，推荐色彩搭配方案
- 结合传统风水与现代美学
- 提供具体的材质选择（地板、墙面、家具、纺织品）
- 解释每个选择背后的风水原理

**第五部分：风水物品与象征物摆放**
- 推荐具体的风水物品：
  * 水晶（种类、尺寸、摆放位置）
  * 植物（品种、数量、养护要点）
  * 水景（类型、尺寸、朝向）
  * 镜子（尺寸、形状、摆放禁忌）
- 解释每个物品的作用和能量属性
- 提供经济实惠的替代方案

**第六部分：化煞与增运技巧**
- 识别空间中潜在的煞气来源
- 针对每个问题提供具体的化解方法
- 增运技巧：
  * 财运提升方法
  * 事业晋升技巧
  * 健康改善策略
  * 感情和谐秘诀
- 提供实施时间表和优先级顺序

**Constraints（约束）**：
- 对于复杂的风水术语，必须提供通俗易懂的解释
- 使用Markdown排版，重点内容请加粗
- 提供多种替代方案，考虑不同预算
- 所有建议必须实用可行
- 解释每个建议背后的"为什么"

**重要：请用中文回复。所有文本必须是中文。使用专业但易懂的语言。**`;
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
