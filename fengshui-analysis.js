// 风水分析功能实现
async function submitFengshuiAnalysis() {
    const analyzeBtn = document.getElementById('analyzeBtn');
    const resultsContainer = document.getElementById('fengshuiResults');
    
    if (!analyzeBtn || !resultsContainer) {
        console.error('Required elements not found');
        return;
    }

    try {
        // 禁用按钮
        analyzeBtn.disabled = true;
        analyzeBtn.innerHTML = '🔄 分析中...';
        
        // 获取风水分析数据
        const spaceData = {
            spaceType: document.getElementById('spaceType')?.value || '居住空间',
            direction: parseInt(document.getElementById('currentDegrees')?.textContent) || 0,
            concerns: '整体运势',
            language: localStorage.getItem('preferredLanguage') || 'zh'
        };

        console.log('Starting feng shui analysis with data:', spaceData);

        // 使用AI服务进行分析 (会自动回退到模拟数据)
        let analysisResult;
        if (window.aiService) {
            analysisResult = await window.aiService.analyzeFengShui(spaceData);
        } else {
            // 直接使用模拟数据
            analysisResult = await getMockFengshuiData();
        }

        console.log('Analysis result:', analysisResult);

        // 显示结果
        displayFengshuiResults(analysisResult);
        
        // 存储分析结果供替代方案咨询使用
        window.currentFengshuiAnalysisResult = analysisResult;
        window.currentFengshuiSpaceData = spaceData;
        
        // 更新追问功能的上下文
        if (window.FengshuiFollowup) {
            window.FengshuiFollowup.init(analysisResult, spaceData);
        }

    } catch (error) {
        console.error('风水分析失败:', error);
        
        // 出错时使用模拟数据
        try {
            const mockData = await getMockFengshuiData();
            displayFengshuiResults(mockData);
            
            // 存储模拟结果
            window.currentFengshuiAnalysisResult = mockData;
            
            // 显示提示
            showErrorMessage('使用模拟数据进行演示分析');
        } catch (fallbackError) {
            console.error('模拟数据也失败:', fallbackError);
            showErrorMessage('分析功能暂时不可用，请稍后重试');
        }
    } finally {
        // 恢复按钮
        analyzeBtn.disabled = false;
        analyzeBtn.innerHTML = '🔮 开始风水分析';
    }
}

// 获取模拟风水数据
async function getMockFengshuiData() {
    const language = localStorage.getItem('preferredLanguage') || 'zh';
    const isEnglish = language === 'en';
    
    // 模拟延迟
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    return {
        overallScore: 78,
        wealthScore: 72,
        healthScore: 85,
        directionAnalysis: isEnglish 
            ? 'The current direction shows good energy flow with strong earth element influence. This orientation supports stability and wealth accumulation. Minor adjustments needed to balance the water element.'
            : '当前方位显示良好的能量流动，土元素影响较强。此方位支持稳定性和财富积累。需要轻微调整以平衡水元素。',
        elements: {
            wood: 65,
            fire: 52,
            earth: 88,
            metal: 71,
            water: 43
        },
        recommendations: isEnglish ? [
            {
                title: 'Enhance Water Element',
                description: 'Add small water features or blue decorations in the north area to boost wealth and career luck.',
                priority: 'high'
            },
            {
                title: 'Adjust Fire Energy',
                description: 'Increase warm lighting or red elements in the south area to enhance reputation and social fortune.',
                priority: 'medium'
            },
            {
                title: 'Optimize Plant Placement',
                description: 'Place healthy green plants in the southeast direction to support wealth growth and family harmony.',
                priority: 'medium'
            },
            {
                title: 'Mirror Layout Optimization',
                description: 'Strategically place mirrors to reflect beautiful views and expand space, avoiding direct confrontation.',
                priority: 'low'
            }
        ] : [
            {
                title: '增强水元素',
                description: '在北方位置添加小型水景或蓝色装饰品，提升财运和事业运。',
                priority: 'high'
            },
            {
                title: '调整火能量',
                description: '在南方区域增加温暖照明或红色元素，提升名声和社交运势。',
                priority: 'medium'
            },
            {
                title: '优化植物摆放',
                description: '在东南方向放置健康绿植，支持财富增长和家庭和谐。',
                priority: 'medium'
            },
            {
                title: '镜子布局优化',
                description: '合理放置镜子以反射美景和扩大空间感，避免对冲。',
                priority: 'low'
            }
        ],
        luckyItems: isEnglish 
            ? ['Water Fountain', 'Lucky Bamboo', 'Crystal Ball', 'Red Lantern']
            : ['水景喷泉', '富贵竹', '水晶球', '红色灯笼'],
        taboos: isEnglish
            ? ['Avoid clutter in wealth corners', 'Don\'t place mirrors facing the bed', 'Keep the main entrance clear', 'Avoid sharp objects pointing at seating areas']
            : ['避免在财位堆放杂物', '不要让镜子对着床', '保持大门畅通', '避免尖锐物品对着座位']
    };
}

// 显示风水分析结果
function displayFengshuiResults(data) {
    const resultsContainer = document.getElementById('fengshuiResults');
    if (!resultsContainer) return;

    const language = localStorage.getItem('preferredLanguage') || 'zh';
    const isEnglish = language === 'en';

    const html = `
        <div class="tool-card rounded-xl p-8">
            <h2 class="text-2xl font-serif font-bold mb-6 text-mystic-gold text-center">
                ${isEnglish ? '🔮 Feng Shui Analysis Results' : '🔮 风水分析结果'}
            </h2>
            
            <div class="space-y-6">
                <!-- 总体评分 -->
                <div class="grid md:grid-cols-3 gap-4">
                    <div class="bg-gradient-to-br from-mystic-gold/20 to-yellow-500/10 rounded-lg p-4 text-center">
                        <div class="text-2xl font-bold text-mystic-gold">${data.overallScore}</div>
                        <div class="text-sm text-moon-silver">${isEnglish ? 'Overall Score' : '总体评分'}</div>
                    </div>
                    <div class="bg-gradient-to-br from-green-500/20 to-emerald-500/10 rounded-lg p-4 text-center">
                        <div class="text-2xl font-bold text-green-400">${data.wealthScore || data.overallScore - 5}</div>
                        <div class="text-sm text-moon-silver">${isEnglish ? 'Wealth Score' : '财运评分'}</div>
                    </div>
                    <div class="bg-gradient-to-br from-blue-500/20 to-cyan-500/10 rounded-lg p-4 text-center">
                        <div class="text-2xl font-bold text-blue-400">${data.healthScore || data.overallScore + 5}</div>
                        <div class="text-sm text-moon-silver">${isEnglish ? 'Health Score' : '健康评分'}</div>
                    </div>
                </div>

                <!-- 方位分析 -->
                <div class="bg-white/5 rounded-lg p-6">
                    <h3 class="text-lg font-semibold text-mystic-gold mb-3">
                        ${isEnglish ? '📍 Direction Analysis' : '📍 方位分析'}
                    </h3>
                    <p class="text-moon-silver leading-relaxed">${data.directionAnalysis}</p>
                </div>

                <!-- 五行分析 -->
                <div class="bg-white/5 rounded-lg p-6">
                    <h3 class="text-lg font-semibold text-mystic-gold mb-4">
                        ${isEnglish ? '🔥 Five Elements Analysis' : '🔥 五行分析'}
                    </h3>
                    <div class="space-y-3">
                        ${Object.entries(data.elements).map(([element, value]) => {
                            const elementNames = {
                                wood: isEnglish ? 'Wood' : '木',
                                fire: isEnglish ? 'Fire' : '火', 
                                earth: isEnglish ? 'Earth' : '土',
                                metal: isEnglish ? 'Metal' : '金',
                                water: isEnglish ? 'Water' : '水'
                            };
                            const colors = {
                                wood: 'bg-green-500',
                                fire: 'bg-red-500',
                                earth: 'bg-yellow-600', 
                                metal: 'bg-gray-400',
                                water: 'bg-blue-500'
                            };
                            return `
                                <div class="flex items-center">
                                    <div class="w-16 text-sm text-moon-silver">${elementNames[element]}</div>
                                    <div class="flex-1 bg-gray-700 rounded-full h-2 mx-3">
                                        <div class="${colors[element]} h-2 rounded-full transition-all duration-1000" style="width: ${value}%"></div>
                                    </div>
                                    <div class="w-12 text-right text-sm text-mystic-gold">${value}%</div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>

                <!-- 改善建议 -->
                <div class="bg-white/5 rounded-lg p-6">
                    <h3 class="text-lg font-semibold text-mystic-gold mb-4">
                        ${isEnglish ? '💡 Improvement Recommendations' : '💡 改善建议'}
                    </h3>
                    <div class="space-y-4">
                        ${data.recommendations.map(rec => `
                            <div class="border border-mystic-gold/30 rounded-lg p-4 ${rec.priority === 'high' ? 'bg-red-500/10' : rec.priority === 'medium' ? 'bg-yellow-500/10' : 'bg-blue-500/10'}">
                                <div class="flex items-start">
                                    <div class="text-sm font-semibold text-mystic-gold mb-2">${rec.title}</div>
                                    <div class="ml-auto">
                                        <span class="text-xs px-2 py-1 rounded-full ${
                                            rec.priority === 'high' ? 'bg-red-500/20 text-red-300' : 
                                            rec.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-300' : 
                                            'bg-blue-500/20 text-blue-300'
                                        }">
                                            ${rec.priority === 'high' ? (isEnglish ? 'High' : '高') : 
                                              rec.priority === 'medium' ? (isEnglish ? 'Medium' : '中') : 
                                              (isEnglish ? 'Low' : '低')}
                                        </span>
                                    </div>
                                </div>
                                <p class="text-moon-silver text-sm">${rec.description}</p>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <!-- 推荐物品和禁忌 -->
                <div class="grid md:grid-cols-2 gap-6">
                    <div class="bg-white/5 rounded-lg p-6">
                        <h3 class="text-lg font-semibold text-mystic-gold mb-4">
                            ${isEnglish ? '🎋 Lucky Items' : '🎋 推荐物品'}
                        </h3>
                        <div class="flex flex-wrap gap-2">
                            ${data.luckyItems.map(item => `
                                <span class="bg-mystic-gold/20 text-mystic-gold px-3 py-1 rounded-full text-sm">${item}</span>
                            `).join('')}
                        </div>
                    </div>
                    <div class="bg-white/5 rounded-lg p-6">
                        <h3 class="text-lg font-semibold text-red-400 mb-4">
                            ${isEnglish ? '⚠️ Taboos' : '⚠️ 风水禁忌'}
                        </h3>
                        <ul class="space-y-2 text-sm">
                            ${data.taboos.map(taboo => `
                                <li class="text-moon-silver flex items-start">
                                    <span class="text-red-400 mr-2">•</span>
                                    ${taboo}
                                </li>
                            `).join('')}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    `;

    resultsContainer.innerHTML = html;
    resultsContainer.classList.remove('hidden');

    // 滚动到结果区域
    resultsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// 显示错误消息
function showErrorMessage(message) {
    const resultsContainer = document.getElementById('fengshuiResults');
    if (!resultsContainer) return;

    resultsContainer.innerHTML = `
        <div class="tool-card rounded-xl p-8">
            <div class="bg-red-500/10 border border-red-500/30 rounded-lg p-6 text-center">
                <div class="text-red-400 text-lg mb-2">⚠️</div>
                <p class="text-red-300">${message}</p>
            </div>
        </div>
    `;
    resultsContainer.classList.remove('hidden');
}

// 替代方案咨询功能
async function handleAlternativeConsultation() {
    const input = document.getElementById('fengshuiFollowupInput');
    const button = document.getElementById('askFengshuiFollowup');
    const loading = document.getElementById('fengshuiFollowupLoading');
    const answerSection = document.getElementById('fengshuiFollowupAnswer');
    const answerText = document.getElementById('fengshuiFollowupAnswerText');

    const question = input.value.trim();
    
    if (!question) {
        alert('请输入您的问题');
        return;
    }

    if (!window.currentFengshuiAnalysisResult) {
        alert('请先进行风水分析');
        return;
    }

    try {
        // 显示加载状态
        button.disabled = true;
        button.innerHTML = '<span class="mr-2">⏳</span> AI思考中...';
        loading.classList.remove('hidden');
        answerSection.classList.add('hidden');

        // 使用模拟AI回答
        const mockAnswer = await generateMockAlternativeAnswer(question);
        
        // 显示答案
        answerText.innerHTML = formatAlternativeAnswer(mockAnswer);
        answerSection.classList.remove('hidden');
        
        // 滚动到答案位置
        answerSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    } catch (error) {
        console.error('替代方案咨询失败:', error);
        alert('AI解答失败，请稍后重试');
    } finally {
        // 恢复按钮
        button.disabled = false;
        button.innerHTML = '<span class="mr-2">🤖</span> AI 解答';
        loading.classList.add('hidden');
    }
}

// 生成模拟替代方案回答
async function generateMockAlternativeAnswer(question) {
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const language = localStorage.getItem('preferredLanguage') || 'zh';
    const isEnglish = language === 'en';
    const questionLower = question.toLowerCase();
    
    if (questionLower.includes('财位') || questionLower.includes('wealth') || questionLower.includes('money')) {
        return isEnglish ? `
**Alternative Wealth Enhancement Solutions:**

**Method 1: Natural Water Feature Placement**
- Place a small tabletop fountain in the southeast corner
- Use clean, flowing water to activate wealth energy
- Add 3-6 coins at the bottom for prosperity symbolism

**Method 2: Crystal Wealth Grid**
- Create a triangle of citrine crystals in the wealth corner
- Place one large citrine in center, smaller ones at corners
- Activate monthly under full moon for maximum effect

**Method 3: Plant-Based Wealth Corner**
- Use jade plants or money trees (3-5 plants recommended)
- Place in attractive ceramic pots with gold accents
- Ensure plants are healthy and well-maintained

**Budget-Friendly Alternative:**
- Use green and gold colored items if live plants aren't feasible
- Place a small mirror to reflect and double wealth energy
- Add a red envelope with coins as a wealth symbol
        ` : `
**替代财位增强方案：**

**方案一：天然水景布局**
- 在东南角放置小型桌面喷泉
- 使用清洁流动的水激活财富能量  
- 在底部放置3-6枚硬币象征财运

**方案二：水晶财富阵**
- 在财位用黄水晶组成三角阵型
- 中心放大块黄水晶，角落放小块
- 每月满月时激活以获得最大效果

**方案三：植物财位法**
- 使用玉树或发财树（推荐3-5株）
- 放在有金色装饰的漂亮陶盆中
- 确保植物健康并精心养护

**经济实用替代方案：**
- 如无法养活植物可用绿色金色饰品代替
- 放置小镜子反射并加倍财富能量
- 添加装有硬币的红包作为财富象征
        `;
    } else {
        return isEnglish ? `
**General Alternative Feng Shui Solutions:**

**Quick Enhancement Method:**
- Clear clutter from all areas to improve energy flow
- Add living plants to bring natural vitality
- Use mirrors strategically to expand space and light
- Incorporate the five elements through colors and materials

**Lighting Optimization:**
- Use warm, soft lighting instead of harsh fluorescents
- Add table lamps and floor lamps for ambient lighting
- Open curtains during day for natural light
- Use candles for evening relaxation

**Personalization Approach:**
- Display meaningful art and photographs
- Add items that bring joy and positive memories
- Create dedicated spaces for different activities
- Maintain cleanliness and organization regularly
        ` : `
**通用替代风水方案：**

**快速提升法：**
- 清理所有区域杂物以改善能量流动
- 添加活植物带来自然活力
- 战略性使用镜子扩大空间和光线
- 通过颜色和材质融入五行元素

**照明优化：**
- 使用温暖柔和照明替代刺眼荧光灯
- 添加台灯和落地灯营造氛围照明
- 白天打开窗帘获得自然光
- 晚上使用蜡烛放松身心

**个性化方案：**
- 展示有意义的艺术品和照片
- 添加带来快乐和美好回忆的物品
- 为不同活动创造专门空间
- 定期保持清洁和整理
        `;
    }
}

// 格式化替代方案回答
function formatAlternativeAnswer(answer) {
    let formatted = answer.replace(/\n/g, '<br>');
    formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong class="text-mystic-gold">$1</strong>');
    formatted = formatted.replace(/^- /gm, '<span class="text-mystic-gold">• </span>');
    return formatted;
}

// 页面加载完成后初始化
if (typeof window !== 'undefined') {
    window.submitFengshuiAnalysis = submitFengshuiAnalysis;
    window.getMockFengshuiData = getMockFengshuiData;
    window.displayFengshuiResults = displayFengshuiResults;
    window.handleAlternativeConsultation = handleAlternativeConsultation;
    
    document.addEventListener('DOMContentLoaded', function() {
        const askButton = document.getElementById('askFengshuiFollowup');
        if (askButton) {
            askButton.onclick = handleAlternativeConsultation;
        }
    });
}