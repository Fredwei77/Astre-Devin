// Destiny AI - Main JavaScript File
// Handles all interactive functionality, animations, and user interactions

class DestinyAI {
    constructor() {
        this.currentLanguage = 'en';
        this.selectedCategories = [];
        this.analysisResults = null;
        this.compassRotation = 0;

        // 确保 AI 服务初始化
        this.ensureAIServiceInitialized();

        this.init();
    }

    ensureAIServiceInitialized() {
        // 检查 AI 服务是否已初始化
        if (!window.aiService && typeof window.AIService !== 'undefined') {
            try {
                window.aiService = new window.AIService();

                // 如果CONFIG已加载，重新加载配置
                if (typeof CONFIG !== 'undefined' && window.aiService.reloadConfig) {
                    window.aiService.reloadConfig();
                }

                console.log('AI Service 初始化成功');
            } catch (error) {
                console.warn('AI Service 初始化失败:', error);
            }
        } else if (!window.AIService) {
            console.warn('AIService 类未加载，可能需要检查脚本加载顺序');
        }

        // 如果aiService存在但CONFIG刚加载，重新加载配置
        if (window.aiService && typeof CONFIG !== 'undefined' && window.aiService.reloadConfig) {
            window.aiService.reloadConfig();
        }
    }

    init() {
        this.setupEventListeners();
        this.initializeAnimations();
        this.initializeParticles();
        this.setupBackgroundMusic();
    }

    setupEventListeners() {
        // Navigation smooth scrolling
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });

        // Divination page functionality
        this.setupDivinationPage();

        // Feng Shui page functionality
        this.setupFengShuiPage();

        // Scroll animations
        this.setupScrollAnimations();
    }

    setupDivinationPage() {
        const analyzeBtn = document.getElementById('analyzeBtn');
        if (analyzeBtn) {
            analyzeBtn.addEventListener('click', () => this.startAnalysis());
        }

        // Category selection
        document.querySelectorAll('.category-card').forEach(card => {
            card.addEventListener('click', () => {
                const category = card.dataset.category;
                this.toggleCategory(category, card);
            });
        });

        // Result actions
        const saveResult = document.getElementById('saveResult');
        const shareResult = document.getElementById('shareResult');
        const newReading = document.getElementById('newReading');

        if (saveResult) saveResult.addEventListener('click', () => this.saveReading());
        if (shareResult) shareResult.addEventListener('click', () => this.shareReading());
        if (newReading) newReading.addEventListener('click', () => this.newReading());
    }

    setupFengShuiPage() {
        // Compass rotation
        const compassFace = document.getElementById('compassFace');
        const rotateLeft = document.getElementById('rotateLeft');
        const rotateRight = document.getElementById('rotateRight');

        if (compassFace) {
            this.setupCompassInteraction(compassFace);
        }

        if (rotateLeft) {
            rotateLeft.addEventListener('click', () => this.rotateCompass(-22.5));
        }

        if (rotateRight) {
            rotateRight.addEventListener('click', () => this.rotateCompass(22.5));
        }

        // File upload
        const uploadArea = document.getElementById('uploadArea');
        const roomPhoto = document.getElementById('roomPhoto');
        const browseBtn = document.getElementById('browseBtn');

        if (uploadArea && roomPhoto) {
            this.setupFileUpload(uploadArea, roomPhoto, browseBtn);
        }
    }

    initializeAnimations() {
        // Typed.js for hero text
        const typedElement = document.getElementById('typed-text');
        if (typedElement) {
            // Function to get hero strings using i18n
            const getHeroStrings = () => {
                if (window.i18n) {
                    return [
                        window.i18n.t('home.hero.title1'),
                        window.i18n.t('home.hero.title2'),
                        window.i18n.t('home.hero.title3'),
                        window.i18n.t('home.hero.title4')
                    ];
                }
                // Fallback if i18n not ready
                return [
                    'Discover Your Destiny',
                    'Unlock Ancient Wisdom',
                    'Navigate Life\'s Journey',
                    'Find Your True Path'
                ];
            };

            this.typedInstance = new Typed('#typed-text', {
                strings: getHeroStrings(),
                typeSpeed: 80,
                backSpeed: 50,
                backDelay: 2000,
                loop: true,
                showCursor: true,
                cursorChar: '|'
            });

            // Listen for language changes
            window.addEventListener('languageChanged', (e) => {
                if (this.typedInstance) {
                    this.typedInstance.destroy();
                    this.typedInstance = new Typed('#typed-text', {
                        strings: getHeroStrings(),
                        typeSpeed: 80,
                        backSpeed: 50,
                        backDelay: 2000,
                        loop: true,
                        showCursor: true,
                        cursorChar: '|'
                    });
                }
            });
        }

        // Scroll reveal animations
        this.setupScrollAnimations();
    }

    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                }
            });
        }, observerOptions);

        document.querySelectorAll('.scroll-reveal').forEach(el => {
            observer.observe(el);
        });
    }

    initializeParticles() {
        const container = document.getElementById('particle-container');
        if (!container) return;

        // Create particle system using p5.js
        const sketch = (p) => {
            let particles = [];

            p.setup = () => {
                const canvas = p.createCanvas(container.offsetWidth, container.offsetHeight);
                canvas.parent(container);

                // Create particles
                for (let i = 0; i < 50; i++) {
                    particles.push({
                        x: p.random(p.width),
                        y: p.random(p.height),
                        vx: p.random(-0.5, 0.5),
                        vy: p.random(-0.5, 0.5),
                        size: p.random(2, 6),
                        opacity: p.random(0.3, 0.8)
                    });
                }
            };

            p.draw = () => {
                p.clear();

                // Update and draw particles
                particles.forEach(particle => {
                    particle.x += particle.vx;
                    particle.y += particle.vy;

                    // Wrap around edges
                    if (particle.x < 0) particle.x = p.width;
                    if (particle.x > p.width) particle.x = 0;
                    if (particle.y < 0) particle.y = p.height;
                    if (particle.y > p.height) particle.y = 0;

                    // Draw particle
                    p.fill(255, 215, 0, particle.opacity * 255);
                    p.noStroke();
                    p.ellipse(particle.x, particle.y, particle.size);
                });

                // Draw connections
                particles.forEach((particle, i) => {
                    particles.slice(i + 1).forEach(other => {
                        const distance = p.dist(particle.x, particle.y, other.x, other.y);
                        if (distance < 100) {
                            p.stroke(255, 215, 0, (1 - distance / 100) * 50);
                            p.strokeWeight(1);
                            p.line(particle.x, particle.y, other.x, other.y);
                        }
                    });
                });
            };

            p.windowResized = () => {
                p.resizeCanvas(container.offsetWidth, container.offsetHeight);
            };
        };

        new p5(sketch);
    }



    toggleCategory(category, cardElement) {
        const index = this.selectedCategories.indexOf(category);

        if (index > -1) {
            this.selectedCategories.splice(index, 1);
            cardElement.classList.remove('selected');
        } else {
            this.selectedCategories.push(category);
            cardElement.classList.add('selected');
        }
    }

    async startAnalysis() {
        // Validate input
        const birthDate = document.getElementById('birthDate').value;
        const birthTime = document.getElementById('birthTime').value;
        const birthPlace = document.getElementById('birthPlace').value;
        const gender = document.getElementById('gender').value;

        if (!birthDate || !birthTime || !birthPlace || !gender) {
            alert(window.i18n ? window.i18n.t('divination.followup.emptyError') : 'Please fill in all required fields.');
            return;
        }

        if (this.selectedCategories.length === 0) {
            alert(window.i18n ? window.i18n.t('divination.category.title') : 'Please select at least one category for analysis.');
            return;
        }

        // Show progress section
        document.getElementById('inputSection').classList.add('hidden');
        document.getElementById('progressSection').classList.remove('hidden');

        // 权限检查：检查是否允许使用 AI
        const subManager = window.subscriptionManager;
        if (subManager && subManager.isMockDataOnly()) {
            console.log('[Main] Free plan detected, using mock data...');
            // 如果是模拟数据模式，直接调用模拟分析
            await this.simulateAnalysis(true); // 传入 true 表示是因为权限限制触发的模拟
            return;
        }

        // 使用真实AI分析
        await this.performAIAnalysis({
            birthDate,
            birthTime,
            birthPlace,
            gender,
            categories: this.selectedCategories
        });
    }

    async performAIAnalysis(userData) {
        try {
            // 显示进度
            this.updateProgress(0, window.i18n ? window.i18n.t('common.loading') : 'Connecting to AI...');

            // 检查并初始化 aiService
            if (!window.aiService) {
                console.warn('aiService 未初始化，尝试重新初始化...');

                // 检查 AIService 类是否存在
                if (typeof window.AIService !== 'undefined') {
                    window.aiService = new window.AIService();
                    console.log('AI Service 重新初始化成功');
                } else {
                    console.error('AIService 类未找到，可能脚本加载失败');
                    throw new Error('AI 服务类未找到');
                }
            }

            // 确保CONFIG已加载并强制重新加载配置
            if (typeof CONFIG !== 'undefined' && window.aiService.reloadConfig) {
                console.log('强制重新加载AI服务配置...');
                window.aiService.reloadConfig();

                // 验证配置是否完全可用
                if (window.aiService.isConfigurationReady && window.aiService.isConfigurationReady()) {
                    console.log('✅ AI配置验证成功，所有PROMPTS可用');
                } else {
                    console.warn('⚠️ AI配置验证失败，某些PROMPTS可能不可用');
                }
            } else {
                console.warn('CONFIG或reloadConfig方法不可用');
            }

            // 验证 aiService 方法是否存在
            if (!window.aiService.analyzeDivination) {
                console.error('analyzeDivination 方法未找到');
                throw new Error('AI 分析方法未找到');
            }

            // 调用AI服务
            this.updateProgress(25, 'Analyzing birth chart...');
            console.log('调用 AI 分析，数据:', userData);

            // 调试信息：显示CONFIG状态
            console.log('DEBUG: CONFIG状态检查:', {
                configExists: typeof CONFIG !== 'undefined',
                hasPrompts: typeof CONFIG !== 'undefined' && !!CONFIG.PROMPTS,
                hasDivination: typeof CONFIG !== 'undefined' && !!CONFIG.PROMPTS && !!CONFIG.PROMPTS.DIVINATION,
                promptsKeys: typeof CONFIG !== 'undefined' && CONFIG.PROMPTS ? Object.keys(CONFIG.PROMPTS) : 'N/A'
            });

            const result = await window.aiService.analyzeDivination(userData);

            console.log('AI 分析结果:', result);

            this.updateProgress(75, 'Generating insights...');

            // 保存结果
            this.analysisResults = result;

            // 验证结果
            if (!result || !result.personality) {
                console.warn('AI 返回的结果格式不正确:', result);
                throw new Error('结果格式错误');
            }

            this.updateProgress(100, 'Analysis complete!');

            // 显示结果
            setTimeout(() => this.showResults(), 500);

        } catch (error) {
            console.error('AI分析错误:', error);
            this.showNotification('分析失败，使用模拟数据', 'error');

            // 回退到模拟分析
            this.simulateAnalysis();
        }
    }

    updateProgress(percent, text) {
        const progressBar = document.getElementById('progressBar');
        const progressText = document.getElementById('progressText');

        if (progressBar) {
            anime({
                targets: progressBar,
                width: `${percent}%`,
                duration: 500,
                easing: 'easeOutQuart'
            });
        }

        if (progressText) {
            progressText.textContent = text;
        }
    }

    simulateAnalysis() {
        console.log('Using simulated analysis');

        // Helper to get simulated array
        const getSimulatedArray = (category) => {
            return [1, 2, 3, 4, 5].map(i => window.i18n.t(`analysis.simulation.${category}.${i}`));
        };

        // Set simulated data
        this.analysisResults = {
            personality: getSimulatedArray('personality'),
            career: getSimulatedArray('career'),
            wealth: getSimulatedArray('wealth'),
            love: getSimulatedArray('love'),
            health: getSimulatedArray('health'),
            elements: {
                wood: 70,
                fire: 45,
                earth: 80,
                metal: 60,
                water: 35
            },
            luckyColors: ['gold', 'silver', 'purple', 'green', 'orange'],
            luckyNumbers: [3, 7, 9, 21, 36]
        };

        const progressBar = document.getElementById('progressBar');
        const progressText = document.getElementById('progressText');
        const steps = [
            { progress: 25, text: window.i18n.t('analysis.progress.calculating'), step: 'step1' },
            { progress: 50, text: window.i18n.t('analysis.progress.analyzing'), step: 'step2' },
            { progress: 75, text: window.i18n.t('analysis.progress.interpreting'), step: 'step3' },
            { progress: 100, text: window.i18n.t('analysis.progress.generating'), step: 'complete' }
        ];

        let currentStep = 0;

        const updateProgress = () => {
            if (currentStep < steps.length) {
                const step = steps[currentStep];

                // Update progress bar
                if (progressBar) {
                    anime({
                        targets: progressBar,
                        width: `${step.progress}%`,
                        duration: 800,
                        easing: 'easeOutQuart'
                    });
                }

                // Update text
                if (progressText) {
                    progressText.textContent = step.text;
                }

                // Update step indicators
                if (step.step !== 'complete') {
                    const stepElement = document.getElementById(step.step);
                    if (stepElement) {
                        stepElement.style.backgroundColor = '#ffd700';
                    }
                }

                currentStep++;
                setTimeout(updateProgress, 2000);
            } else {
                // Analysis complete
                console.log('模拟分析完成，显示结果');
                setTimeout(() => this.showResults(), 500);
            }
        };

        updateProgress();
    }

    showResults() {
        console.log('显示结果');

        // Hide progress, show results
        const progressSection = document.getElementById('progressSection');
        const resultsSection = document.getElementById('resultsSection');

        if (progressSection) {
            progressSection.classList.add('hidden');
        }

        if (resultsSection) {
            resultsSection.classList.remove('hidden');
        } else {
            console.error('找不到 resultsSection 元素');
            return;
        }

        // Generate and display results
        this.generateAnalysisResults();

        // 延迟创建图表，确保 DOM 已渲染
        setTimeout(() => {
            try {
                this.createCharts();
            } catch (error) {
                console.error('图表创建失败，但不影响文本显示:', error);
            }
        }, 100);

        // 初始化追问功能
        if (window.DivinationFollowup) {
            const divinationResult = {
                birthInfo: this.birthInfo,
                categories: this.selectedCategories,
                summary: this.generateResultSummary(),
                ...this.analysisResults
            };
            // 使用第一个选中的类别作为主类别
            const primaryCategory = this.selectedCategories.length > 0 ? this.selectedCategories[0] : null;
            window.DivinationFollowup.init(divinationResult, primaryCategory);
        }

        // Animate results appearance
        anime({
            targets: '#resultsSection',
            opacity: [0, 1],
            translateY: [30, 0],
            duration: 800,
            easing: 'easeOutQuart'
        });
    }

    generateAnalysisResults() {
        console.log('生成分析结果，数据:', this.analysisResults);

        // 使用AI返回的真实结果
        if (this.analysisResults && this.analysisResults.personality) {
            console.log('使用 AI 返回的真实结果');
            this.populateResultSection('personalityContent', this.analysisResults.personality || []);
            this.populateResultSection('careerContent', this.analysisResults.career || []);
            this.populateResultSection('wealthContent', this.analysisResults.wealth || []);
            this.populateResultSection('relationshipContent', this.analysisResults.love || []);
            this.populateResultSection('healthContent', this.analysisResults.health || []);

            // Populate Zodiac and Forecast (Text Content)
            if (this.analysisResults.zodiacAnalysis) {
                this.populateTextSection('zodiacAnalysisContent', this.analysisResults.zodiacAnalysis);
            }
            if (this.analysisResults.yearForecast) {
                this.populateTextSection('yearForecastContent', this.analysisResults.yearForecast);
            }

            // 更新五行数据
            if (this.analysisResults.elements) {
                this.elementsData = this.analysisResults.elements;
            }

            // 生成幸运元素
            this.generateLuckyElements();
        } else {
            console.log('Using default data');

            // Fallback to default data using simulation keys
            const getSimulatedArray = (category) => {
                return [1, 2, 3, 4, 5].map(i => window.i18n.t(`analysis.simulation.${category}.${i}`));
            };

            this.populateResultSection('personalityContent', getSimulatedArray('personality'));
            this.populateResultSection('careerContent', getSimulatedArray('career'));
            this.populateResultSection('wealthContent', getSimulatedArray('wealth'));
            this.populateResultSection('relationshipContent', getSimulatedArray('love'));
            this.populateResultSection('healthContent', getSimulatedArray('health'));

            // Fallback for text sections
            this.populateTextSection('zodiacAnalysisContent', window.i18n.t('divination.result.subtitle'));
            this.populateTextSection('yearForecastContent', window.i18n.t('divination.result.title'));

            this.generateLuckyElements();
        }
    }

    populateTextSection(elementId, text) {
        const container = document.getElementById(elementId);
        if (container) {
            container.textContent = text;
        }
    }

    populateResultSection(elementId, items) {
        console.log(`填充结果区域: ${elementId}, 项目数: ${items.length}`);

        const container = document.getElementById(elementId);
        if (!container) {
            console.error(`找不到元素: ${elementId}`);
            return;
        }

        const html = items.map(item =>
            `<div class="flex items-start space-x-2">
                <span class="text-mystic-gold mt-1">•</span>
                <span>${item}</span>
            </div>`
        ).join('');

        console.log(`生成的 HTML 长度: ${html.length}`);
        container.innerHTML = html;
        console.log(`已填充 ${elementId}`);
    }

    generateResultSummary() {
        // 生成占卜结果的简要摘要，用于追问功能
        if (!this.analysisResults) return '';

        const parts = [];

        if (this.analysisResults.personality && this.analysisResults.personality.length > 0) {
            parts.push(`性格特点：${this.analysisResults.personality[0]}`);
        }

        if (this.analysisResults.zodiacAnalysis) {
            parts.push(`生肖分析：${this.analysisResults.zodiacAnalysis.substring(0, 100)}...`);
        }

        if (this.analysisResults.yearForecast) {
            parts.push(`年度运势：${this.analysisResults.yearForecast.substring(0, 100)}...`);
        }

        return parts.join('\n');
    }

    generateLuckyElements() {
        // Use AI returned lucky elements or default values
        const colorMap = {
            'gold': '#ffd700', 'silver': '#c0c0c0', 'purple': '#4a148c',
            'green': '#2e7d32', 'orange': '#f57c00', 'red': '#dc143c',
            'blue': '#1565c0', 'yellow': '#fbc02d', 'white': '#ffffff',
            'black': '#000000'
        };

        // Chinese to English color mapping
        const chineseToEnglishColors = {
            '金色': 'gold', '银色': 'silver', '紫色': 'purple',
            '绿色': 'green', '橙色': 'orange', '红色': 'red',
            '蓝色': 'blue', '黄色': 'yellow', '白色': 'white',
            '黑色': 'black'
        };

        let colors = ['gold', 'silver', 'purple', 'green', 'orange'];
        let numbers = [3, 7, 9, 21, 36];

        if (this.analysisResults) {
            if (this.analysisResults.luckyColors) {
                // Convert Chinese color names to English keys if necessary
                colors = this.analysisResults.luckyColors.map(color => {
                    return chineseToEnglishColors[color] || color;
                });
            }
            if (this.analysisResults.luckyNumbers) {
                numbers = this.analysisResults.luckyNumbers;
            }
        }

        const colorsContainer = document.getElementById('luckyColors');
        if (colorsContainer) {
            colorsContainer.innerHTML = colors.map(colorKey => {
                const hex = colorMap[colorKey] || colorKey;
                const name = window.i18n.t(`analysis.simulation.luckyColors.${colorKey}`) || colorKey;
                return `<div class="w-8 h-8 rounded-full border-2 border-white/30" style="background-color: ${hex}" title="${name}"></div>`;
            }).join('');
        }

        const numbersContainer = document.getElementById('luckyNumbers');
        if (numbersContainer) {
            numbersContainer.innerHTML = numbers.map(number =>
                `<div class="bg-mystic-gold text-deep-navy w-10 h-10 rounded-full flex items-center justify-center font-bold">${number}</div>`
            ).join('');
        }
    }

    createCharts() {
        console.log('创建图表');

        // 使用AI返回的五行数据
        const elementsData = this.analysisResults?.elements || {
            wood: 70, fire: 45, earth: 80, metal: 60, water: 35
        };

        console.log('五行数据:', elementsData);

        // Birth Chart
        const birthChartElement = document.getElementById('birthChart');
        if (!birthChartElement) {
            console.error('找不到 birthChart 元素');
            return;
        }

        try {
            console.log('初始化 Birth Chart');
            const birthChart = echarts.init(birthChartElement);

            // 使用简单的柱状图代替复杂的极坐标图
            const birthChartOption = {
                backgroundColor: 'transparent',
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow'
                    }
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: {
                    type: 'category',
                    data: ['rat', 'ox', 'tiger', 'rabbit', 'dragon', 'snake', 'horse', 'goat', 'monkey', 'rooster', 'dog', 'pig'].map(z => window.i18n.t(`chart.zodiac.${z}`)),
                    axisLabel: {
                        color: '#c0c0c0'
                    },
                    axisLine: {
                        lineStyle: {
                            color: 'rgba(255, 255, 255, 0.2)'
                        }
                    }
                },
                yAxis: {
                    type: 'value',
                    axisLabel: {
                        color: '#c0c0c0'
                    },
                    splitLine: {
                        lineStyle: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        }
                    }
                },
                series: [{
                    name: window.i18n.t('chart.series.fortune'),
                    type: 'bar',
                    data: [8, 6, 9, 7, 8, 6, 7, 5, 9, 8, 6, 7],
                    itemStyle: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            { offset: 0, color: '#ffd700' },
                            { offset: 1, color: '#c0c0c0' }
                        ])
                    },
                    emphasis: {
                        itemStyle: {
                            color: '#ffd700'
                        }
                    }
                }]
            };

            birthChart.setOption(birthChartOption);
            console.log('Birth Chart 创建成功');
        } catch (error) {
            console.error('Birth Chart 创建失败:', error);
        }

        // Five Elements Chart - 使用真实数据
        const elementsChartElement = document.getElementById('elementsChart');
        if (!elementsChartElement) {
            console.error('找不到 elementsChart 元素');
            return;
        }

        try {
            console.log('初始化 Elements Chart');
            const elementsChart = echarts.init(elementsChartElement);

            const elementsChartOption = {
                backgroundColor: 'transparent',
                tooltip: {
                    trigger: 'item'
                },
                radar: {
                    indicator: [
                        { name: window.i18n.t('chart.elements.wood'), max: 100 },
                        { name: window.i18n.t('chart.elements.fire'), max: 100 },
                        { name: window.i18n.t('chart.elements.earth'), max: 100 },
                        { name: window.i18n.t('chart.elements.metal'), max: 100 },
                        { name: window.i18n.t('chart.elements.water'), max: 100 }
                    ],
                    axisName: {
                        color: '#c0c0c0'
                    },
                    splitLine: {
                        lineStyle: {
                            color: 'rgba(255, 255, 255, 0.2)'
                        }
                    },
                    splitArea: {
                        areaStyle: {
                            color: ['rgba(255, 255, 255, 0.05)', 'rgba(255, 255, 255, 0.1)']
                        }
                    }
                },
                series: [{
                    type: 'radar',
                    data: [{
                        value: [
                            elementsData.wood,
                            elementsData.fire,
                            elementsData.earth,
                            elementsData.metal,
                            elementsData.water
                        ],
                        name: window.i18n.t('chart.series.elements'),
                        itemStyle: {
                            color: '#ffd700'
                        },
                        lineStyle: {
                            color: '#ffd700',
                            width: 3
                        },
                        areaStyle: {
                            color: 'rgba(255, 215, 0, 0.3)'
                        }
                    }]
                }]
            };

            elementsChart.setOption(elementsChartOption);
            console.log('Elements Chart 创建成功');
        } catch (error) {
            console.error('Elements Chart 创建失败:', error);
        }
    }

    async saveReading() {
        try {
            // 准备保存数据
            const reading = {
                timestamp: new Date().toISOString(),
                categories: this.selectedCategories,
                results: this.analysisResults
            };

            // 优先保存到Supabase
            if (window.DatabaseService) {
                const result = await DatabaseService.saveReading(
                    'divination',
                    {
                        birthDate: this.birthInfo?.birthDate || '',
                        birthTime: this.birthInfo?.birthTime || '',
                        birthPlace: this.birthInfo?.birthPlace || '',
                        gender: this.birthInfo?.gender || '',
                        categories: this.selectedCategories
                    },
                    this.analysisResults
                );

                if (result.success) {
                    console.log('✅ 占卜记录已保存到数据库');
                    this.showNotification('占卜记录已保存！', 'success');

                    // 同时保存到localStorage作为备份
                    const savedReadings = JSON.parse(localStorage.getItem('destinyReadings') || '[]');
                    savedReadings.push(reading);
                    localStorage.setItem('destinyReadings', JSON.stringify(savedReadings));

                    return;
                }
            }

            // 回退到localStorage
            console.log('⚠️ 使用localStorage保存');
            const savedReadings = JSON.parse(localStorage.getItem('destinyReadings') || '[]');
            savedReadings.push(reading);
            localStorage.setItem('destinyReadings', JSON.stringify(savedReadings));
            this.showNotification('占卜记录已保存！', 'success');

        } catch (error) {
            console.error('保存失败:', error);
            this.showNotification('保存失败: ' + error.message, 'error');
        }
    }

    shareReading() {
        if (navigator.share) {
            navigator.share({
                title: 'My Destiny Reading',
                text: 'Check out my personalized destiny analysis from Destiny AI!',
                url: window.location.href
            });
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(window.location.href).then(() => {
                this.showNotification('Link copied to clipboard!', 'success');
            });
        }
    }

    newReading() {
        // Reset form and show input section
        document.getElementById('resultsSection').classList.add('hidden');
        document.getElementById('inputSection').classList.remove('hidden');

        // Clear selections
        this.selectedCategories = [];
        document.querySelectorAll('.category-card').forEach(card => {
            card.classList.remove('selected');
        });

        // Clear form
        document.getElementById('birthDate').value = '';
        document.getElementById('birthTime').value = '';
        document.getElementById('birthPlace').value = '';
        document.getElementById('gender').value = '';

        // 重置追问功能
        if (window.DivinationFollowup) {
            window.DivinationFollowup.reset();
        }
    }

    setupCompassInteraction(compassElement) {
        let isDragging = false;
        let startAngle = 0;
        let currentRotation = 0;

        compassElement.addEventListener('mousedown', (e) => {
            isDragging = true;
            const rect = compassElement.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            startAngle = Math.atan2(e.clientY - centerY, e.clientX - centerX);
            compassElement.style.cursor = 'grabbing';
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;

            const rect = compassElement.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX);
            const rotation = (angle - startAngle) * (180 / Math.PI);

            currentRotation += rotation;
            this.compassRotation = currentRotation;

            compassElement.style.transform = `rotate(${currentRotation}deg)`;
            this.updateCompassDisplay();

            startAngle = angle;
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
            compassElement.style.cursor = 'grab';
        });
    }

    rotateCompass(degrees) {
        this.compassRotation += degrees;
        const compassFace = document.getElementById('compassFace');
        if (compassFace) {
            compassFace.style.transform = `rotate(${this.compassRotation}deg)`;
            this.updateCompassDisplay();
        }
    }

    updateCompassDisplay() {
        const normalizedRotation = ((this.compassRotation % 360) + 360) % 360;
        const directions = ['north', 'northeast', 'east', 'southeast', 'south', 'southwest', 'west', 'northwest'];
        const directionIndex = Math.round(normalizedRotation / 45) % 8;
        const directionKey = `common.direction.${directions[directionIndex]}`;

        const currentDirection = document.getElementById('currentDirection');
        const currentDegrees = document.getElementById('currentDegrees');

        if (currentDirection) {
            currentDirection.textContent = window.i18n ? window.i18n.t(directionKey) : directions[directionIndex].toUpperCase();
        }

        if (currentDegrees) {
            currentDegrees.textContent = `${Math.round(normalizedRotation)}°`;
        }
    }

    setupFileUpload(uploadArea, fileInput, browseBtn) {
        console.log('设置文件上传功能');

        if (!browseBtn || !fileInput || !uploadArea) {
            console.error('文件上传元素未找到');
            return;
        }

        // 点击按钮选择文件
        browseBtn.addEventListener('click', () => {
            console.log('点击选择文件按钮');
            fileInput.click();
        });

        // 文件选择变化
        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                console.log('选择了文件:', file.name, file.type, file.size);

                // 验证文件类型
                if (!file.type.startsWith('image/')) {
                    this.showNotification(window.i18n ? window.i18n.t('fengshui.error.image_type') : 'Please select an image file', 'error');
                    return;
                }

                // 验证文件大小（最大 5MB）
                if (file.size > 5 * 1024 * 1024) {
                    this.showNotification(window.i18n ? window.i18n.t('fengshui.error.image_size') : 'Image size cannot exceed 5MB', 'error');
                    return;
                }

                this.handleFileUpload(file);
            }
        });

        // 拖拽上传
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.classList.add('dragover');
        });

        uploadArea.addEventListener('dragleave', () => {
            uploadArea.classList.remove('dragover');
        });

        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('dragover');

            const file = e.dataTransfer.files[0];
            if (file) {
                console.log('拖拽了文件:', file.name, file.type);

                if (!file.type.startsWith('image/')) {
                    this.showNotification(window.i18n ? window.i18n.t('fengshui.error.image_type') : 'Please select an image file', 'error');
                    return;
                }

                if (file.size > 5 * 1024 * 1024) {
                    this.showNotification(window.i18n ? window.i18n.t('fengshui.error.image_size') : 'Image size cannot exceed 5MB', 'error');
                    return;
                }

                this.handleFileUpload(file);
            }
        });

        console.log('文件上传功能设置完成');
    }

    handleFileUpload(file) {
        console.log('处理文件上传:', file.name);

        // 显示上传提示
        this.showNotification(window.i18n ? window.i18n.t('fengshui.analysis.loading') : 'Analyzing image...', 'info');

        // 读取并显示图片预览
        const reader = new FileReader();
        reader.onload = (e) => {
            console.log('图片读取成功');
            const base64Image = e.target.result;

            // 可以在这里显示图片预览
            const uploadArea = document.getElementById('uploadArea');
            if (uploadArea) {
                const loadingText = window.i18n ? window.i18n.t('fengshui.analysis.uploaded') : 'Image uploaded, analyzing...';
                uploadArea.innerHTML = `
                    <div class="text-center">
                        <img src="${base64Image}" alt="上传的图片" class="max-w-full max-h-64 mx-auto rounded-lg mb-4">
                        <p class="text-mystic-gold">${loadingText}</p>
                    </div>
                `;
            }

            // 准备风水分析数据
            const direction = document.getElementById('currentDirection')?.textContent || 'Unknown';
            const degrees = document.getElementById('currentDegrees')?.textContent || '0';

            const spaceData = {
                spaceType: 'Indoor Space',
                direction: `${degrees} (${direction})`,
                concerns: 'Overall Harmony, Wealth, Health'
            };

            // 调用AI服务
            if (window.aiService) {
                window.aiService.analyzeFengShui(spaceData, base64Image)
                    .then(result => {
                        console.log('Feng Shui Analysis Result:', result);
                        this.showNotification(window.i18n ? window.i18n.t('common.complete') : 'Analysis complete!', 'success');

                        const analysisResults = document.getElementById('analysisResults');
                        if (analysisResults) {
                            analysisResults.classList.remove('hidden');

                            // Update Direction Analysis Text
                            const dirText = document.getElementById('directionAnalysisText');
                            if (dirText && result.directionAnalysis) {
                                dirText.textContent = result.directionAnalysis;
                            }

                            // 更新分数 (支持 overall, wealth, health)
                            const scores = [
                                { id: 'energyScore', percent: 'energyPercent', value: result.overallScore || 75 },
                                { id: 'wealthScore', percent: 'wealthPercent', value: result.wealthScore || 60 },
                                { id: 'healthScore', percent: 'healthPercent', value: result.healthScore || 85 }
                            ];

                            scores.forEach(score => {
                                const bar = document.getElementById(score.id);
                                const percent = document.getElementById(score.percent);

                                if (bar && percent) {
                                    anime({
                                        targets: bar,
                                        width: `${score.value}%`,
                                        duration: 1000,
                                        easing: 'easeOutQuart'
                                    });

                                    anime({
                                        targets: { value: 0 },
                                        value: score.value,
                                        duration: 1000,
                                        easing: 'easeOutQuart',
                                        update: function (anim) {
                                            percent.textContent = `${Math.round(anim.animatables[0].target.value)}%`;
                                        }
                                    });
                                }
                            });

                            // 更新建议
                            const recContainer = document.getElementById('recommendationsContainer');
                            if (recContainer && result.recommendations && result.recommendations.length > 0) {
                                recContainer.innerHTML = result.recommendations.map(rec => `
                                    <div class="recommendation-card rounded-lg p-4">
                                        <div class="flex items-start space-x-3">
                                            <div class="text-2xl">${rec.priority === 'high' ? '🔥' : '💡'}</div>
                                            <div>
                                                <h4 class="font-semibold mb-1">${rec.title}</h4>
                                                <p class="text-sm text-moon-silver">${rec.description}</p>
                                            </div>
                                        </div>
                                    </div>
                                `).join('');
                            }

                            // 更新幸运物品
                            const luckyContainer = document.getElementById('luckyItemsContainer');
                            if (luckyContainer && result.luckyItems) {
                                luckyContainer.innerHTML = result.luckyItems.map(item => `
                                    <div class="bg-white/5 rounded-lg p-3 text-center border border-white/10">
                                        <span class="text-xl">✨</span>
                                        <span class="block text-sm font-medium mt-1">${item}</span>
                                    </div>
                                `).join('');
                            }

                            // 更新禁忌
                            const taboosContainer = document.getElementById('taboosContainer');
                            if (taboosContainer && result.taboos) {
                                taboosContainer.innerHTML = result.taboos.map(taboo => `
                                    <div class="flex items-start space-x-3 bg-red-900/10 p-3 rounded-lg">
                                        <span class="text-red-400 mt-0.5">🚫</span>
                                        <span class="text-sm text-gray-300">${taboo}</span>
                                    </div>
                                `).join('');
                            }

                            // 初始化风水追问功能
                            if (window.FengshuiFollowup) {
                                const fengshuiResult = {
                                    direction: direction,
                                    degrees: degrees,
                                    elements: {
                                        wood: 70,
                                        fire: 45,
                                        earth: 80,
                                        metal: 60,
                                        water: 35
                                    },
                                    energyScore: result.overallScore || 75,
                                    wealthScore: result.wealthScore || 60,
                                    healthScore: result.healthScore || 85,
                                    recommendations: result.recommendations ? result.recommendations.map(r => r.title) : []
                                };
                                window.FengshuiFollowup.init(fengshuiResult);
                            }
                        }
                    })
                    .catch(err => {
                        console.error('AI Analysis Failed:', err);
                        this.showNotification('分析失败: ' + err.message, 'error');
                        // 可以在这里恢复UI状态
                    });
            } else {
                console.error('AI Service not initialized');
                this.showNotification(window.i18n ? window.i18n.t('divination.followup.initError') : 'AI Service not initialized', 'error');
            }
        };
        reader.readAsDataURL(file);
    }

    setupBackgroundMusic() {
        const audio = document.getElementById('backgroundMusic');
        const musicToggle = document.getElementById('musicToggle');
        const musicIcon = document.getElementById('musicIcon');
        const volumeSlider = document.getElementById('volumeSlider');
        const volumeRange = document.getElementById('volumeRange');
        const volumeDisplay = document.getElementById('volumeDisplay');

        if (!audio || !musicToggle || !musicIcon) {
            console.warn('Background music elements not found');
            return;
        }

        // Detect mobile device
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768;

        // Set initial volume
        const savedVolume = localStorage.getItem('musicVolume') || '30';
        audio.volume = parseInt(savedVolume) / 100;
        if (volumeRange) volumeRange.value = savedVolume;
        if (volumeDisplay) volumeDisplay.textContent = `${savedVolume}%`;

        // Check saved preference
        const musicEnabled = localStorage.getItem('backgroundMusicEnabled') !== 'false';

        // Music control functionality
        let isPlaying = false;
        let volumeSliderVisible = false;

        const toggleMusic = async () => {
            try {
                if (isPlaying) {
                    audio.pause();
                    musicIcon.textContent = '🔇';
                    musicToggle.title = 'Play Background Music';
                    isPlaying = false;
                    localStorage.setItem('backgroundMusicEnabled', 'false');
                } else {
                    await audio.play();
                    musicIcon.textContent = '🎵';
                    musicToggle.title = 'Pause Background Music';
                    isPlaying = true;
                    localStorage.setItem('backgroundMusicEnabled', 'true');
                }
            } catch (error) {
                console.warn('Audio play failed:', error);
            }
        };

        // Volume slider control for mobile
        if (volumeRange && volumeDisplay) {
            volumeRange.addEventListener('input', (e) => {
                const volume = parseInt(e.target.value);
                audio.volume = volume / 100;
                volumeDisplay.textContent = `${volume}%`;
                localStorage.setItem('musicVolume', volume.toString());

                // Show feedback (keep volume feedback for user clarity)
                this.showMobileToast(`${window.i18n?.t('common.volume') || 'Volume'}: ${volume}%`);
            });
        }

        // Toggle volume slider visibility (mobile)
        const toggleVolumeSlider = () => {
            if (!volumeSlider) return;

            volumeSliderVisible = !volumeSliderVisible;
            if (volumeSliderVisible) {
                volumeSlider.classList.remove('hidden');
            } else {
                volumeSlider.classList.add('hidden');
            }
        };

        // Click event with mobile enhancements
        musicToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleMusic();
        });

        // Long press for volume control on mobile
        if (isMobile && volumeSlider) {
            let longPressTimer;

            musicToggle.addEventListener('touchstart', (e) => {
                longPressTimer = setTimeout(() => {
                    navigator.vibrate && navigator.vibrate(50); // Haptic feedback
                    toggleVolumeSlider();
                    this.showMobileToast(window.i18n?.t('common.long_press_volume') || 'Long press to adjust volume');
                }, 500);
            });

            musicToggle.addEventListener('touchend', () => {
                clearTimeout(longPressTimer);
            });

            musicToggle.addEventListener('touchmove', () => {
                clearTimeout(longPressTimer);
            });

            // Hide volume slider when clicking outside
            document.addEventListener('click', (e) => {
                if (!e.target.closest('#musicControl') && volumeSliderVisible) {
                    volumeSlider.classList.add('hidden');
                    volumeSliderVisible = false;
                }
            });
        }

        // Auto-start music if enabled (with user interaction requirement)
        const startMusicWhenReady = () => {
            if (musicEnabled && !isPlaying) {
                // Try to play music after first user interaction
                const playOnInteraction = async () => {
                    if (!isPlaying && musicEnabled) {
                        try {
                            await audio.play();
                            musicIcon.textContent = '🎵';
                            isPlaying = true;
                        } catch (error) {
                            console.warn('Auto-play failed:', error);
                        }
                    }
                };

                document.addEventListener('click', playOnInteraction, { once: true });
                document.addEventListener('touchstart', playOnInteraction, { once: true });
            }
        };

        // Handle audio events
        audio.addEventListener('canplaythrough', () => {
            startMusicWhenReady();
        });

        audio.addEventListener('ended', () => {
            isPlaying = false;
            musicIcon.textContent = '🔇';
        });

        audio.addEventListener('pause', () => {
            isPlaying = false;
            musicIcon.textContent = '🔇';
        });

        audio.addEventListener('play', () => {
            isPlaying = true;
            musicIcon.textContent = '🎵';
        });

        // Volume control with mouse wheel (desktop only)
        if (!isMobile) {
            musicToggle.addEventListener('wheel', (e) => {
                e.preventDefault();
                const delta = e.deltaY > 0 ? -10 : 10;
                const newVolume = Math.max(0, Math.min(100, Math.round(audio.volume * 100) + delta));
                audio.volume = newVolume / 100;

                // Update slider if available
                if (volumeRange) volumeRange.value = newVolume;
                if (volumeDisplay) volumeDisplay.textContent = `${newVolume}%`;
                localStorage.setItem('musicVolume', newVolume.toString());

                this.showNotification(`${window.i18n?.t('common.volume') || 'Volume'}: ${newVolume}%`, 'info');
            });
        }

        // Handle page visibility for mobile battery optimization
        document.addEventListener('visibilitychange', () => {
            if (document.hidden && isMobile && isPlaying) {
                // Optionally reduce volume when page is hidden
                audio.volume = audio.volume * 0.5;
            } else if (!document.hidden && isMobile && isPlaying) {
                // Restore volume when page is visible
                const savedVolume = localStorage.getItem('musicVolume') || '30';
                audio.volume = parseInt(savedVolume) / 100;
            }
        });

        console.log('Background music setup complete (Mobile optimized)');
    }

    showMobileToast(message, duration = 2000) {
        // Create mobile-optimized toast
        const toast = document.createElement('div');
        toast.className = 'mobile-music-toast';
        toast.textContent = message;

        document.body.appendChild(toast);

        // Show animation
        setTimeout(() => {
            toast.classList.add('show');
        }, 100);

        // Hide and remove
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                if (document.body.contains(toast)) {
                    document.body.removeChild(toast);
                }
            }, 300);
        }, duration);
    }

    showNotification(message, type = 'info') {
        // Check if mobile device for appropriate notification style
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768;

        if (isMobile) {
            this.showMobileToast(message);
            return;
        }

        // Create notification element for desktop
        const notification = document.createElement('div');
        notification.className = `fixed top-20 right-4 z-50 px-6 py-3 rounded-lg shadow-lg transform translate-x-full transition-transform duration-300 ${type === 'success' ? 'bg-green-600' :
            type === 'error' ? 'bg-red-600' : 'bg-blue-600'
            } text-white`;
        notification.textContent = message;

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Animate out and remove
        setTimeout(() => {
            notification.style.transform = 'translateX(full)';
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // 添加小延迟确保所有脚本都已加载
    setTimeout(() => {
        window.destinyAI = new DestinyAI();
    }, 100);
});

// Handle page visibility changes for performance
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pause animations when page is not visible
        anime.running.forEach(animation => animation.pause());
    } else {
        // Resume animations when page becomes visible
        anime.running.forEach(animation => animation.play());
    }
});