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

        const titleKeyMap = {
            'Add Water Element': 'fengshui.rec.water.title',
            '增加水元素': 'fengshui.rec.water.title',
            '增加水元素': 'fengshui.rec.water.title',
            'Agregar Elemento Agua': 'fengshui.rec.water.title',
            'Increase Fire Energy': 'fengshui.rec.fire.title',
            '提升火能量': 'fengshui.rec.fire.title',
            '提升火能量': 'fengshui.rec.fire.title',
            'Aumentar Energía de Fuego': 'fengshui.rec.fire.title',
            'Optimize Plant Placement': 'fengshui.rec.plant.title',
            '优化植物摆放': 'fengshui.rec.plant.title',
            '優化植物擺放': 'fengshui.rec.plant.title',
            'Optimizar Colocación de Plantas': 'fengshui.rec.plant.title',
            'Strategic Mirror Placement': 'fengshui.rec.mirror.title',
            '镜子战略布局': 'fengshui.rec.mirror.title',
            '鏡子戰略布局': 'fengshui.rec.mirror.title',
            'Colocación Estratégica de Espejos': 'fengshui.rec.mirror.title',
            'Bedroom Optimization': 'fengshui.rec.bedroom.title'
        };

        const key = titleKeyMap[title];
        return (key && window.i18n) ? window.i18n.t(key) : title;
    }

    /**
     * 智能翻译建议描述
     */
    translateRecommendationDescription(title, description) {
        if (!description) return '';

        const descKeyMap = {
            'Add Water Element': 'fengshui.rec.water.desc',
            '增加水元素': 'fengshui.rec.water.desc',
            '增加水元素': 'fengshui.rec.water.desc',
            'Agregar Elemento Agua': 'fengshui.rec.water.desc',
            'Increase Fire Energy': 'fengshui.rec.fire.desc',
            '提升火能量': 'fengshui.rec.fire.desc',
            '提升火能量': 'fengshui.rec.fire.desc',
            'Aumentar Energía de Fuego': 'fengshui.rec.fire.desc',
            'Optimize Plant Placement': 'fengshui.rec.plant.desc',
            '优化植物摆放': 'fengshui.rec.plant.desc',
            '優化植物擺放': 'fengshui.rec.plant.desc',
            'Optimizar Colocación de Plantas': 'fengshui.rec.plant.desc',
            'Strategic Mirror Placement': 'fengshui.rec.mirror.desc',
            '镜子战略布局': 'fengshui.rec.mirror.desc',
            '鏡子戰略布局': 'fengshui.rec.mirror.desc',
            'Colocación Estratégica de Espejos': 'fengshui.rec.mirror.desc',
            'Bedroom Optimization': 'fengshui.rec.bedroom.desc'
        };

        const key = descKeyMap[title];
        return (key && window.i18n) ? window.i18n.t(key) : description;
    }

    /**
     * 更新幸运物品 - 支持多语言
     */
    updateLuckyItems(items) {
        const container = document.getElementById('luckyItemsContainer');
        if (!container) return;

        container.innerHTML = '';

        items.forEach(item => {
            const itemKeyMap = {
                '红灯笼': 'fengshui.shop.lantern',
                '紅燈籠': 'fengshui.shop.lantern',
                'Red Lantern': 'fengshui.shop.lantern',
                'Linterna Roja': 'fengshui.shop.lantern',
                '幸运竹': 'fengshui.shop.bamboo',
                '幸運竹': 'fengshui.shop.bamboo',
                'Lucky Bamboo': 'fengshui.shop.bamboo',
                'Bambú de la Suerte': 'fengshui.shop.bamboo',
                '龙雕像': 'fengshui.shop.dragon',
                '龍雕像': 'fengshui.shop.dragon',
                'Dragon Statue': 'fengshui.shop.dragon',
                'Estatua de Dragón': 'fengshui.shop.dragon',
                '水晶球': 'fengshui.shop.crystal',
                'Crystal Sphere': 'fengshui.shop.crystal',
                'Esfera de Cristal': 'fengshui.shop.crystal',
                '祈福手环': 'fengshui.shop.bracelet',
                '祈福手環': 'fengshui.shop.bracelet',
                'Prayer Bracelet': 'fengshui.shop.bracelet',
                'Pulsera de Oración': 'fengshui.shop.bracelet',
                '罗盘': 'fengshui.shop.compass',
                '羅盤': 'fengshui.shop.compass',
                'Feng Shui Compass': 'fengshui.shop.compass',
                'Brújula Feng Shui': 'fengshui.shop.compass',
                '八卦镜': 'fengshui.shop.mirror',
                '八卦鏡': 'fengshui.shop.mirror',
                'Bagua Mirror': 'fengshui.shop.mirror',
                'Espejo Bagua': 'fengshui.shop.mirror',
                '五帝钱币': 'fengshui.shop.coins',
                '五帝錢幣': 'fengshui.shop.coins',
                'Five Emperor Coins': 'fengshui.shop.coins',
                'Monedas de los Cinco Emperadores': 'fengshui.shop.coins'
            };

            const key = itemKeyMap[item];
            const displayName = (key && window.i18n) ? window.i18n.t(key) : item;

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
            const tabooKeyMap = {
                '避免床头对门': 'fengshui.taboo.bed_door',
                '避免床頭對門': 'fengshui.taboo.bed_door',
                'Avoid bed facing door': 'fengshui.taboo.bed_door',
                'Evitar que la cama mire hacia la puerta': 'fengshui.taboo.bed_door',
                '不要在财位堆放杂物': 'fengshui.taboo.wealth_clutter',
                '不要在財位堆放雜物': 'fengshui.taboo.wealth_clutter',
                'Keep wealth corner clutter-free': 'fengshui.taboo.wealth_clutter',
                'Mantener el rincón de la riqueza libre de desorden': 'fengshui.taboo.wealth_clutter',
                '避免尖角对人': 'fengshui.taboo.sharp_corners',
                '避免尖角對人': 'fengshui.taboo.sharp_corners',
                'Avoid sharp corners pointing at people': 'fengshui.taboo.sharp_corners',
                'Evitar esquinas afiladas apuntando a personas': 'fengshui.taboo.sharp_corners',
                '保持空间整洁': 'fengshui.taboo.clean_space',
                '保持空間整潔': 'fengshui.taboo.clean_space',
                'Keep space clean and tidy': 'fengshui.taboo.clean_space',
                'Mantener el espacio limpio y ordenado': 'fengshui.taboo.clean_space'
            };

            const key = tabooKeyMap[taboo];
            const displayTaboo = (key && window.i18n) ? window.i18n.t(key) : taboo;

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
        const normalizedDir = ((direction % 360) + 360) % 360;
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

        const language = localStorage.getItem('preferredLanguage') || 'zh';

        try {
            // 显示加载状态
            if (askButton) askButton.disabled = true;
            if (loadingDiv) loadingDiv.classList.remove('hidden');
            if (answerDiv) answerDiv.classList.add('hidden');

            // 构建系统提示词
            let systemPromptBase = '';
            if (window.CONFIG && window.CONFIG.PROMPTS && window.CONFIG.PROMPTS.FENGSHUI && window.CONFIG.PROMPTS.FENGSHUI.FOLLOWUP_SYSTEM) {
                systemPromptBase = window.CONFIG.PROMPTS.FENGSHUI.FOLLOWUP_SYSTEM(language);
            } else {
                systemPromptBase = `你是一位专业的风水大师。请基于用户的空间分析结果，针对其提出的具体布局困难或问题，提供深度解读和替代方案建议。`;
            }

            const contextText = language === 'en' ? `
Space Analysis Context:
- Direction: ${this.spaceData.direction}° (${this.getDirectionAdvice(this.spaceData.direction).name})
- Overall Score: ${this.analysisResult.overallScore}%
- Elements: Wood ${this.analysisResult.elements.wood}%, Fire ${this.analysisResult.elements.fire}%, Earth ${this.analysisResult.elements.earth}%, Metal ${this.analysisResult.elements.metal}%, Water ${this.analysisResult.elements.water}%
- Analysis: ${this.analysisResult.directionAnalysis}
` : language === 'es' ? `
Contexto de análisis del espacio:
- Dirección: ${this.spaceData.direction}° (${this.getDirectionAdvice(this.spaceData.direction).name})
- Puntuación general: ${this.analysisResult.overallScore}%
- Elementos: Madera ${this.analysisResult.elements.wood}%, Fuego ${this.analysisResult.elements.fire}%, Tierra ${this.analysisResult.elements.earth}%, Metal ${this.analysisResult.elements.metal}%, Agua ${this.analysisResult.elements.water}%
- Análisis: ${this.analysisResult.directionAnalysis}
` : language === 'zh-TW' ? `
空間分析參考：
- 坐向：${this.spaceData.direction}° (${this.getDirectionAdvice(this.spaceData.direction).name})
- 核心評分：${this.analysisResult.overallScore}%
- 五行狀態：木${this.analysisResult.elements.wood}%, 火${this.analysisResult.elements.fire}%, 土${this.analysisResult.elements.earth}%, 金${this.analysisResult.elements.metal}%, 水${this.analysisResult.elements.water}%
- 方位分析：${this.analysisResult.directionAnalysis}
` : `
空间分析参考：
- 坐向：${this.spaceData.direction}° (${this.getDirectionAdvice(this.spaceData.direction).name})
- 核心评分：${this.analysisResult.overallScore}%
- 五行状态：木${this.analysisResult.elements.wood}%, 火${this.analysisResult.elements.fire}%, 土${this.analysisResult.elements.earth}%, 金${this.analysisResult.elements.metal}%, 水${this.analysisResult.elements.water}%
- 当前方位分析：${this.analysisResult.directionAnalysis}
`;

            const systemPrompt = systemPromptBase + "\n\n" + contextText;
            const userPrompt = language === 'en' ? `Follow-up Question: ${question}`
                : language === 'es' ? `Pregunta de seguimiento: ${question}`
                    : language === 'zh-TW' ? `追問問題：${question}`
                        : `追问问题：${question}`;

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
