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
     * 同步分析数据（由外部调用）
     * @param {Object} result AI分析结果
     * @param {Object} spaceData 原始空间数据
     */
    setAnalysisData(result, spaceData) {
        console.log('🔄 同步风水分析数据:', { result, spaceData });
        this.analysisResult = result;
        this.spaceData = spaceData;
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
                spaceType: window.i18n?.t('fengshui.analysis.default_space') || 'Living Space',
                concerns: window.i18n?.t('fengshui.analysis.default_concern') || 'General Fortune'
            };

            this.spaceData = spaceData;

            // 调用AI服务
            const aiServiceInstance = window.aiService || (window.destinyAI && window.destinyAI.aiService);
            if (!aiServiceInstance) {
                throw new Error('AI Service not initialized');
            }
            const result = await aiServiceInstance.analyzeFengShui(spaceData);
            this.analysisResult = result;

            // 更新UI
            this.updateAnalysisDisplay(result);

            return result;

        } catch (error) {
            console.error('风水分析错误:', error);

            // 增强重试/回退逻辑
            console.warn('⚠️ AI服务调用失败，尝试使用模拟数据回退');

            try {
                // 尝试获取模拟数据
                const aiServiceInstance = window.aiService || (window.destinyAI && window.destinyAI.aiService);
                if (aiServiceInstance && typeof aiServiceInstance.getMockResponse === 'function') {
                    const mockResult = await aiServiceInstance.getMockResponse('fengshui');

                    if (mockResult) {
                        console.log('✅ 成功获取风水模拟数据');
                        this.analysisResult = mockResult;
                        this.updateAnalysisDisplay(mockResult);
                        return mockResult;
                    }
                }
            } catch (fallbackError) {
                console.error('模拟数据回退失败:', fallbackError);
            }

            // 如果连模拟数据都失败了，才抛出错误
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

            // 移除旧的 Mock 标记
            const oldBadge = document.getElementById('fengshuiMockBadge');
            if (oldBadge) oldBadge.remove();

            // 如果是模拟数据，添加顶部标记
            if (result.isMock) {
                const badge = document.createElement('div');
                badge.id = 'fengshuiMockBadge';
                badge.className = 'mb-6 p-3 bg-mystic-gold/10 border border-mystic-gold/30 rounded-lg flex items-center justify-center text-mystic-gold';
                badge.innerHTML = `
                    <i class="fas fa-flask mr-2"></i>
                    <span class="font-medium text-sm">
                        ${window.i18n?.t('common.trialMode') || 'Trial Mode / 模拟演示'} - 
                        <span class="text-moon-silver text-xs opacity-80 pl-1">
                             ${window.i18n?.t('common.trialMessage') || 'Upgrade for real AI analysis'}
                        </span>
                    </span>
                `;
                analysisResults.insertBefore(badge, analysisResults.firstChild);
            }
        }

        // 更新整体评分
        this.updateScore('energyScore', 'energyPercent', result.overallScore || 75);

        // ... existing updates ...
        if (result.elements) this.updateElementsDisplay(result.elements);
        if (result.recommendations) this.updateRecommendations(result.recommendations);
        if (result.directionAnalysis) {
            const directionText = document.getElementById('directionAnalysisText');
            if (directionText) directionText.textContent = result.directionAnalysis;
        }
        if (result.luckyItems) this.updateLuckyItems(result.luckyItems);
        if (result.taboos) this.updateTaboos(result.taboos);

        // 初始化追问建议
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
     * 更新建议显示 - 支持多语言
     */
    updateRecommendations(recommendations) {
        const container = document.getElementById('recommendationsContainer');
        if (!container) return;

        // 清空现有建议
        container.innerHTML = '';

        // 添加新建议
        recommendations.forEach(rec => {
            const priorityEmoji = rec.priority === 'high' ? '🔥' : rec.priority === 'medium' ? '⭐' : '💡';

            // 翻译标题和描述 - 使用智能翻译函数
            const title = this.translateRecommendationTitle(rec.title);
            const description = this.translateRecommendationDescription(rec.title, rec.description);

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
    translateRecommendationTitle(title) {
        if (!title) return '';

        // Generate key from title (English version preferred as key)
        const normalizedTitle = title.toLowerCase().replace(/\s+/g, '_');

        // Expanded keyMap for more AI response patterns
        const keyMap = {
            'add_water_element': 'fengshui.rec.water.title',
            'increase_fire_energy': 'fengshui.rec.fire.title',
            'optimize_plant_placement': 'fengshui.rec.plant.title',
            'strategic_mirror_placement': 'fengshui.rec.mirror.title',
            'bedroom_optimization': 'fengshui.rec.bedroom.title',
            // 添加更多可能的变体
            'add_water': 'fengshui.rec.water.title',
            'water_element': 'fengshui.rec.water.title',
            'increase_fire': 'fengshui.rec.fire.title',
            'fire_energy': 'fengshui.rec.fire.title',
            'plant_placement': 'fengshui.rec.plant.title',
            'plants': 'fengshui.rec.plant.title',
            'mirror_placement': 'fengshui.rec.mirror.title',
            'mirrors': 'fengshui.rec.mirror.title',
            'bedroom': 'fengshui.rec.bedroom.title'
        };

        // Try map first, then try the normalized title as a key part
        const key = keyMap[normalizedTitle] || `fengshui.rec.${normalizedTitle}.title`;
        const translated = window.i18n?.t(key);

        // 添加调试日志
        if (translated === key) {
            console.log('[Feng Shui] 翻译键未找到:', key, '| 原标题:', title);
        }

        return (translated && translated !== key) ? translated : title;
    }

    /**
     * 智能翻译建议描述
     */
    translateRecommendationDescription(title, description) {
        if (!description) return '';

        const normalizedTitle = title.toLowerCase().replace(/\s+/g, '_');
        const keyMap = {
            'add_water_element': 'fengshui.rec.water.desc',
            'increase_fire_energy': 'fengshui.rec.fire.desc',
            'optimize_plant_placement': 'fengshui.rec.plant.desc',
            'strategic_mirror_placement': 'fengshui.rec.mirror.desc',
            'bedroom_optimization': 'fengshui.rec.bedroom.desc',
            // 添加更多变体
            'add_water': 'fengshui.rec.water.desc',
            'water_element': 'fengshui.rec.water.desc',
            'increase_fire': 'fengshui.rec.fire.desc',
            'fire_energy': 'fengshui.rec.fire.desc',
            'plant_placement': 'fengshui.rec.plant.desc',
            'plants': 'fengshui.rec.plant.desc',
            'mirror_placement': 'fengshui.rec.mirror.desc',
            'mirrors': 'fengshui.rec.mirror.desc',
            'bedroom': 'fengshui.rec.bedroom.desc'
        };

        const key = keyMap[normalizedTitle] || `fengshui.rec.${normalizedTitle}.desc`;
        const translated = window.i18n?.t(key);

        return (translated && translated !== key) ? translated : description;
    }

    /**
     * 更新幸运物品 - 支持多语言
     */
    updateLuckyItems(items) {
        const container = document.getElementById('luckyItemsContainer');
        if (!container) return;

        container.innerHTML = '';

        items.forEach(item => {
            // Standardize item as a key
            const itemKeyPart = item.toLowerCase().replace(/\s+/g, '_');
            const keyMap = {
                '红灯笼': 'lantern', '紅燈籠': 'lantern', 'red_lantern': 'lantern', 'linterna_roja': 'lantern',
                '幸运竹': 'bamboo', '幸運竹': 'bamboo', 'lucky_bamboo': 'bamboo', 'bambú_de_la_suerte': 'bamboo',
                '龙雕像': 'dragon', '龍雕像': 'dragon', 'dragon_statue': 'dragon', 'estatua_de_dragón': 'dragon',
                '水晶球': 'crystal', 'crystal_sphere': 'crystal', 'esfera_de_cristal': 'crystal',
                '祈福手环': 'bracelet', '祈福手環': 'bracelet', 'prayer_bracelet': 'bracelet', 'pulsera_de_oración': 'bracelet',
                '罗盘': 'compass', '羅盤': 'compass', 'feng_shui_compass': 'compass', 'brújula_feng_shui': 'compass',
                '八卦镜': 'mirror', '八卦鏡': 'mirror', 'bagua_mirror': 'mirror', 'espejo_bagua': 'mirror',
                '五帝钱币': 'coins', '五帝錢幣': 'coins', 'five_emperor_coins': 'coins', 'monedas_de_los_cinco_emperadores': 'coins'
            };

            const keySuffix = keyMap[item] || keyMap[itemKeyPart] || itemKeyPart;
            const key = `fengshui.shop.${keySuffix}`;
            const translated = window.i18n?.t(key);
            const displayName = (translated && translated !== key) ? translated : item;

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

        taboos.forEach(taboo => {
            const tabooKeyPart = taboo.toLowerCase().replace(/\s+/g, '_');
            const keyMap = {
                '避免床头对门': 'bed_door', '避免床頭對門': 'bed_door', 'avoid_bed_facing_door': 'bed_door',
                '不要在财位堆放杂物': 'wealth_clutter', '不要在財位堆放雜物': 'wealth_clutter', 'keep_wealth_corner_clutter-free': 'wealth_clutter',
                '避免尖角对人': 'sharp_corners', '避免尖角對人': 'sharp_corners', 'avoid_sharp_corners_pointing_at_people': 'sharp_corners',
                '保持空间整洁': 'clean_space', '保持空間整潔': 'clean_space', 'keep_space_clean_and_tidy': 'clean_space'
            };

            const keySuffix = keyMap[taboo] || keyMap[tabooKeyPart] || tabooKeyPart;
            const key = `fengshui.taboo.${keySuffix}`;
            const translated = window.i18n?.t(key);
            const displayTaboo = (translated && translated !== key) ? translated : taboo;

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
        const directions = {
            0: {
                keyName: 'common.direction.north',
                keyElement: 'fengshui.elements.water',
                keyAdvice: 'fengshui.advice.north'
            },
            45: {
                keyName: 'common.direction.northeast',
                keyElement: 'fengshui.elements.earth',
                keyAdvice: 'fengshui.advice.northeast'
            },
            90: {
                keyName: 'common.direction.east',
                keyElement: 'fengshui.elements.wood',
                keyAdvice: 'fengshui.advice.east'
            },
            135: {
                keyName: 'common.direction.southeast',
                keyElement: 'fengshui.elements.wood',
                keyAdvice: 'fengshui.advice.southeast'
            },
            180: {
                keyName: 'common.direction.south',
                keyElement: 'fengshui.elements.fire',
                keyAdvice: 'fengshui.advice.south'
            },
            225: {
                keyName: 'common.direction.southwest',
                keyElement: 'fengshui.elements.earth',
                keyAdvice: 'fengshui.advice.southwest'
            },
            270: {
                keyName: 'common.direction.west',
                keyElement: 'fengshui.elements.metal',
                keyAdvice: 'fengshui.advice.west'
            },
            315: {
                keyName: 'common.direction.northwest',
                keyElement: 'fengshui.elements.metal',
                keyAdvice: 'fengshui.advice.northwest'
            }
        };

        // 找到最接近的方位
        let normalizedDir = 0;
        if (typeof direction === 'string') {
            // 处理 "45°" 或 "45 (North)" 这种格式
            normalizedDir = parseFloat(direction.replace(/[^\d.]/g, '')) || 0;
        } else {
            normalizedDir = (direction || 0);
        }
        normalizedDir = ((normalizedDir % 360) + 360) % 360;

        const closestDir = Object.keys(directions).reduce((prev, curr) => {
            return Math.abs(curr - normalizedDir) < Math.abs(prev - normalizedDir) ? curr : prev;
        });

        const info = directions[closestDir];

        if (window.i18n) {
            return {
                name: window.i18n.t(info.keyName),
                element: window.i18n.t(info.keyElement),
                advice: window.i18n.t(info.keyAdvice)
            };
        }

        // Fallback
        return {
            name: 'North',
            element: 'Water',
            advice: 'North belongs to Water element.'
        };
    }

    /**
     * 处理 AI 替代方案咨询（追问）
     */
    async handleFollowupQuestion() {
        console.log('🤖 开始处理风水追问...');
        const followupInput = document.getElementById('followupInput');

        if (!followupInput) {
            console.error('❌ 未找到追问输入框');
            return;
        }

        const question = followupInput.value.trim();
        if (!question) {
            alert(window.i18n?.t('fengshui.followup.empty') || '请输入您的追问');
            return;
        }

        const askButton = document.getElementById('askFollowup');
        const loadingDiv = document.getElementById('followupLoading');
        const answerDiv = document.getElementById('followupAnswer');
        const answerText = document.getElementById('followupAnswerText');

        // 立即显示加载状态
        if (askButton) askButton.disabled = true;
        if (loadingDiv) loadingDiv.classList.remove('hidden');
        if (answerDiv) answerDiv.classList.add('hidden');
        if (answerText) answerText.innerHTML = '';

        try {
            // 准备上下文数据 (如果可用)
            const isGenericChat = !this.analysisResult || !this.spaceData;
            console.log('追问模式:', isGenericChat ? '通用问答' : '上下文追问');

            // 检查用户权限 (依然需要检查，防止滥用)
            if (window.subscriptionManager) {
                const access = window.subscriptionManager.canUseService('fengshui');
                const isMockDataOnly = window.subscriptionManager.isMockDataOnly();

                if (!access.allowed || isMockDataOnly) {
                    // 如果只是模拟数据，允许继续允许，但在真实API调用时会受限
                    if (!access.allowed) {
                        window.subscriptionManager.showUpgradePrompt('AI风水追问', 'fengshui');
                        throw new Error('权限受限');
                    }
                }
            }

            const language = localStorage.getItem('preferredLanguage') || 'zh';
            let prompt;

            if (isGenericChat) {
                prompt = `用户问题: "${question}"\n\n请作为一位风水专家，用${language === 'en' ? '英文' : '中文'}回答上述问题。给出专业、客观的建议。`;
            } else {
                const labels = {
                    direction: window.i18n?.t('fengshui.compass.direction') || 'Direction',
                    score: window.i18n?.t('fengshui.analysis.results.energy') || 'Overall Score',
                    elements: window.i18n?.t('fengshui.elements.title') || 'Elements',
                    analysis: window.i18n?.t('fengshui.analysis.results.title') || 'Analysis'
                };

                const contextText = `
${labels.analysis}:
- ${labels.direction}: ${this.spaceData.direction}
- ${labels.score}: ${this.analysisResult.overallScore}%
- ${labels.analysis}: ${this.analysisResult.directionAnalysis || 'N/A'}
`;
                prompt = `基于以下风水分析：\n${contextText}\n\n用户问题: "${question}"\n\n请给出具体建议。`;
            }

            // 调用AI服务
            const aiService = window.aiService || (window.destinyAI && window.destinyAI.aiService);
            if (!aiService) {
                throw new Error('AI服务未初始化 (AI Service Not Initialized)');
            }

            const response = await aiService.chatWithSystem(
                '你是一位专业的风水大师。',
                prompt,
                { type: 'fengshui-followup' }
            );

            if (!response) {
                throw new Error('AI响应为空');
            }

            // 智能处理响应内容
            let cleanResponse = response;
            if (typeof response === 'object' && response !== null) {
                cleanResponse = response.content || response.text || response.answer || JSON.stringify(response);
            } else if (typeof response === 'string' && response.trim().startsWith('{')) {
                try {
                    const parsed = JSON.parse(response);
                    cleanResponse = parsed.content || parsed.text || parsed.answer || response;
                } catch (e) { /* ignore */ }
            }

            if (typeof cleanResponse !== 'string') {
                cleanResponse = JSON.stringify(cleanResponse);
            }

            // 移除 Markdown 代码块标记（如果有）
            cleanResponse = cleanResponse.replace(/^```(?:markdown|json)?/i, '').replace(/```$/, '');

            // 隐藏加载状态并显示回答区域
            if (loadingDiv) loadingDiv.classList.add('hidden');
            if (answerDiv) answerDiv.classList.remove('hidden');

            // 显示回答并应用打字机效果
            if (answerText) {
                // 如果是模拟数据，添加提示徽章
                let isMock = false;
                if (typeof response === 'object' && response !== null && response.isMock) {
                    isMock = true;
                }

                let displayHtml = cleanResponse.replace(/\n/g, '<br>');
                if (window.MarkdownFormatter) {
                    displayHtml = window.MarkdownFormatter.parse(cleanResponse);
                }

                if (isMock) {
                    const badgeHtml = `
                        <div class="mb-4 inline-flex items-center px-3 py-1 rounded-full bg-mystic-gold/10 border border-mystic-gold/30 text-mystic-gold text-xs font-medium">
                            <i class="fas fa-flask mr-2"></i>
                            ${window.i18n?.t('common.trialMode') || 'Trial Mode / 模拟演示'}
                        </div>
                    `;
                    displayHtml = badgeHtml + displayHtml;
                }

                if (window.TypingEffect) {
                    await window.TypingEffect.type(answerText, displayHtml, 30);
                } else {
                    answerText.innerHTML = displayHtml;
                }
                answerDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }

            // 清空输入框 (可选)
            // followupInput.value = ''; 

        } catch (error) {
            console.error('❌ 风水追问失败:', error);
            if (loadingDiv) loadingDiv.classList.add('hidden');

            if (error.message !== '权限受限') {
                alert(window.i18n?.t('common.error') || 'AI解答失败，请稍后重试');
            }
        } finally {
            if (askButton) askButton.disabled = false;
        }
    }

    /**
     * 生成建议追问问题
     */
    generateSuggestedQuestions(result) {
        if (!window.i18n) return [];

        let suggestions = [
            window.i18n.t('fengshui.followup.suggested1'),
            window.i18n.t('fengshui.followup.suggested2'),
            window.i18n.t('fengshui.followup.suggested3'),
            window.i18n.t('fengshui.followup.suggested4'),
            window.i18n.t('fengshui.followup.suggested5'),
            window.i18n.t('fengshui.followup.suggested6')
        ];

        // 结合分析结果动态调整
        if (result && result.elements) {
            const elements = result.elements;
            if (elements.water < 50) suggestions.unshift(window.i18n.t('fengshui.followup.suggested_water'));
            if (elements.fire < 50) suggestions.unshift(window.i18n.t('fengshui.followup.suggested_fire'));
        }

        return suggestions.filter(q => q && q !== 'undefined').slice(0, 6);
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
     * 开始当前风水分析（从 UI 按钮调用）
     */
    async analyzeCurrentSpace() {
        const analyzeBtn = document.getElementById('analyzeBtn');
        const resultsContainer = document.getElementById('analysisResults');

        if (!analyzeBtn) return;

        try {
            // 获取当前方位
            const direction = this.currentDirection || 0;

            // 禁用按钮显示加载状态
            analyzeBtn.disabled = true;
            const originalText = analyzeBtn.innerHTML;
            analyzeBtn.innerHTML = `<i class="fas fa-spinner fa-spin mr-2"></i>${window.i18n ? window.i18n.t('common.loading') : '分析中...'}`;

            if (resultsContainer) {
                // 如果已有图片，保持图片区域，但显示分析中状态
                const uploadStatus = document.getElementById('uploadStatus');
                if (uploadStatus) {
                    uploadStatus.textContent = window.i18n ? window.i18n.t('fengshui.analysis.loading') : '正在进行AI风水分析...';
                    uploadStatus.classList.remove('hidden');
                }
            }

            // 执行分析
            const result = await this.analyzeSpace(direction);

            // 滚动到结果
            const target = document.getElementById('analysisResults');
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }

            // 恢复按钮
            analyzeBtn.disabled = false;
            analyzeBtn.innerHTML = originalText;

        } catch (error) {
            console.error('风水分析失败:', error);
            alert(window.i18n ? window.i18n.t('divination.followup.error') : '分析失败，请稍后重试');

            analyzeBtn.disabled = false;
            analyzeBtn.innerHTML = window.i18n ? window.i18n.t('fengshui.analyze.button') : '开始风水分析';
        }
    }

    /**
     * 绑定追问事件
     */
    bindFollowupEvents() {
        const askButton = document.getElementById('askFollowup');
        const followupInput = document.getElementById('followupInput');

        if (askButton) {
            askButton.onclick = () => this.handleFollowupQuestion();
            console.log('✅ Feng Shui followup button event bound');

            // 支持回车键提交
            if (followupInput) {
                followupInput.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {  // Allow simple Enter
                        e.preventDefault();
                        this.handleFollowupQuestion();
                    }
                });
            }

            // 初始化建议追问
            this.renderSuggestedQuestions(null);
        }

        // 绑定分析按钮事件 (Consolidated from fengshui-analysis.js)
        const analyzeBtn = document.getElementById('analyzeBtn');
        if (analyzeBtn) {
            analyzeBtn.onclick = () => this.analyzeCurrentSpace();
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
