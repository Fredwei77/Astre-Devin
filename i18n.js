// Destiny AI - Internationalization (i18n) System
// Complete multi-language support for English, Simplified Chinese, and Traditional Chinese

class I18n {
    constructor() {
        this.currentLanguage = localStorage.getItem('destinyai_language') || 'en';

        // CRITICAL FIX: Sync preferredLanguage with destinyai_language on init
        // This ensures AI services always have the correct language
        const preferredLang = localStorage.getItem('preferredLanguage');
        if (!preferredLang || preferredLang !== this.currentLanguage) {
            localStorage.setItem('preferredLanguage', this.currentLanguage);
            console.log('[I18n] Synced preferredLanguage to:', this.currentLanguage);
        }

        this.translations = this._loadBuiltInTranslations();
        this.init();
    }

    init() {
        // Set initial language
        this.setLanguage(this.currentLanguage);

        // Setup language selector
        this.setupLanguageSelector();

        // Update page on load
        this.updatePage();
    }

    loadTranslations(externalTranslations) {
        if (!externalTranslations) return;

        console.log('[I18n] Loading external translations:', Object.keys(externalTranslations));

        // Merge external translations into the existing translations
        for (const lang of Object.keys(externalTranslations)) {
            if (!this.translations[lang]) {
                this.translations[lang] = {};
            }
            // Deep merge or just mixin keys
            Object.assign(this.translations[lang], externalTranslations[lang]);
        }

        // Trigger page update to reflect new translations immediately
        if (this.currentLanguage && externalTranslations[this.currentLanguage]) {
            this.updatePage();
        }
    }

    _loadBuiltInTranslations() {
        return {
            en: {
                // Navigation
                'nav.home': 'Home',
                'nav.divination': 'Divination',
                'nav.fengshui': 'Feng Shui',
                'nav.iching': 'I-Ching',
                'nav.profile': 'Profile',
                'nav.login': 'Login',
                'nav.logout': 'Logout',
                'nav.premium': 'Premium',
                'nav.upgrade': 'Upgrade',
                'nav.getStarted': 'Get Started',

                // Common
                'common.loading': 'Loading...',
                'common.save': 'Save',
                'common.cancel': 'Cancel',
                'common.confirm': 'Confirm',
                'common.close': 'Close',
                'common.back': 'Back',
                'common.next': 'Next',
                'common.submit': 'Submit',
                'common.search': 'Search',

                // Home Page
                'home.hero.title': 'Discover Your Destiny',
                'home.hero.title1': 'Discover Your Destiny',
                'home.hero.title2': 'Unlock Ancient Wisdom',
                'home.hero.title3': 'Navigate Life\'s Journey',
                'home.hero.title4': 'Find Your True Path',
                'home.hero.subtitle': 'Harness the power of ancient Eastern wisdom combined with modern AI technology.',
                'home.hero.description': 'Harness the power of ancient Eastern wisdom combined with modern AI technology. Discover your destiny, optimize your environment, and make better life decisions.',
                'home.hero.cta1': 'Start Free Reading',
                'home.hero.cta2': 'Learn More',
                'home.stats.readings': 'Readings Completed',
                'home.stats.users': 'Happy Users',
                'home.stats.accuracy': 'Accuracy Rate',

                // Home Features
                'home.features.title': 'Ancient Wisdom, Modern Technology',
                'home.features.subtitle': 'Our AI-powered platform combines traditional Eastern divination methods with cutting-edge technology to provide you with accurate, personalized insights.',
                'home.features.divination.title': 'AI Divination',
                'home.features.divination.desc': 'Get personalized readings using advanced AI algorithms trained on thousands of years of Eastern wisdom. Accurate, instant, and tailored to your unique situation.',
                'home.features.divination.cta': 'Try Now →',
                'home.features.fengshui.title': 'Feng Shui Analysis',
                'home.features.fengshui.desc': 'Optimize your living and working spaces with our interactive Feng Shui compass. Get real-time analysis and personalized recommendations for better energy flow.',
                'home.features.fengshui.cta': 'Explore →',
                'home.features.iching.title': 'I-Ching Wisdom',
                'home.features.iching.desc': 'Consult the ancient Book of Changes for guidance on important decisions. Our AI interprets the hexagrams in the context of your modern life challenges.',
                'home.features.iching.cta': 'Consult →',

                // How It Works
                'home.howItWorks.title': 'Your Journey to Self-Discovery',
                'home.howItWorks.subtitle': 'Simple steps to unlock the wisdom of the ages and gain clarity about your path forward.',
                'home.howItWorks.step1.title': 'Share Your Info',
                'home.howItWorks.step1.desc': 'Enter your birth details and current questions or concerns.',
                'home.howItWorks.step2.title': 'AI Analysis',
                'home.howItWorks.step2.desc': 'Our AI processes your information using ancient Eastern wisdom systems.',
                'home.howItWorks.step3.title': 'Get Insights',
                'home.howItWorks.step3.desc': 'Receive personalized readings with actionable guidance and predictions.',
                'home.howItWorks.step4.title': 'Take Action',
                'home.howItWorks.step4.desc': 'Use the wisdom gained to make better decisions and improve your life.',

                // Divination Page
                'divination.title': 'AI Divination & Fortune Reading',
                'divination.subtitle': 'Discover your destiny through advanced AI analysis of your birth chart and life path.',
                'divination.form.title': 'Enter Your Birth Information',
                'divination.form.birthDate': 'Birth Date',
                'divination.form.birthTime': 'Birth Time',
                'divination.form.birthPlace': 'Birth Place',
                'divination.form.gender': 'Gender',
                'divination.form.gender.male': 'Male',
                'divination.form.gender.female': 'Female',
                'divination.form.gender.other': 'Other',
                'divination.form.gender.select': 'Select Gender',
                'divination.form.question': 'What Would You Like to Know?',
                'divination.category.career': 'Career',
                'divination.category.career.desc': 'Professional growth & opportunities',
                'divination.category.wealth': 'Wealth',
                'divination.category.wealth.desc': 'Financial prospects & money luck',
                'divination.category.love': 'Love',
                'divination.category.love.desc': 'Relationships & marriage',
                'divination.category.health': 'Health',
                'divination.category.health.desc': 'Wellness & vitality',
                'divination.button.analyze': 'Analyze My Destiny',
                'divination.dateFormat': 'Format: MM/DD/YYYY (e.g., 12/31/1990)',
                'divination.timeFormat': 'Format: 12-hour (e.g., 2:30 PM)',
                'divination.dateLabel': '📅 English Format',
                'divination.timeLabel': '🕐 12-Hour Format',
                'divination.clickToSelect': 'Click to select',

                // Feng Shui Page
                'fengshui.title': 'Feng Shui Analysis & Compass',
                'fengshui.subtitle': 'Optimize your living and working spaces with our interactive Feng Shui compass. Get real-time analysis and personalized recommendations for better energy flow.',
                'fengshui.compass.title': 'Interactive Feng Shui Compass',
                'fengshui.compass.rotateLeft': '← Rotate Left',
                'fengshui.compass.rotateRight': 'Rotate Right →',
                'fengshui.compass.direction': 'Current Direction',
                'fengshui.compass.degrees': 'Degrees',
                'fengshui.elements.title': 'Five Elements Balance',
                'fengshui.elements.wood': 'Wood',
                'fengshui.elements.fire': 'Fire',
                'fengshui.elements.earth': 'Earth',
                'fengshui.elements.metal': 'Metal',
                'fengshui.elements.water': 'Water',
                'fengshui.button.analyze': 'Analyze Feng Shui',
                'fengshui.analyze.button': 'Analyze Feng Shui',
                'fengshui.image.upload': 'Upload Room Photo',
                'fengshui.image.success': 'Image uploaded successfully',

                // Pricing
                'home.pricing.title': 'Choose Your Path',
                'home.pricing.subtitle': 'Start with our free readings or unlock the full power of ancient wisdom with premium features.',

                // Disclaimer
                'home.disclaimer.title': '⚠️ Important Disclaimer',
                'home.disclaimer.text': 'Astre Devin provides entertainment and self-reflection tools based on energy cycle analysis and personality blueprinting systems. Our readings and analyses are for informational and entertainment purposes only and should not be considered as professional advice for medical, legal, financial, or psychological matters. Results are not guaranteed and should not be the sole basis for important life decisions. Please consult qualified professionals for matters requiring expert guidance.',

                // Footer
                'footer.description': 'Combining ancient Eastern wisdom with modern AI technology to help you discover your destiny and make better life decisions.',
                'footer.privacy': 'Privacy Policy',
                'footer.terms': 'Terms of Service',
                'footer.contact': 'Contact Us',
                'footer.support': 'Support',
                'footer.copyright': '© 2024 Destiny AI. All rights reserved. Empowering lives through ancient wisdom and modern technology.',

                // Tooltips
                'tooltip.divination': 'Divination is the practice of seeking knowledge of the future or unknown through supernatural means. Our AI analyzes your birth chart using ancient Eastern astrological principles.',
                'tooltip.fengshui': 'Feng Shui (literally "wind-water") is an ancient Chinese practice of arranging your environment to promote harmony and positive energy flow.',
                'tooltip.iching': 'The I-Ching (Book of Changes) is a 3,000-year-old Chinese divination text. It uses 64 hexagrams to provide guidance on life decisions.',
                'tooltip.elements': 'The Five Elements (Wood, Fire, Earth, Metal, Water) are fundamental concepts in Chinese philosophy representing different types of energy.',
                'tooltip.wood': 'Wood represents growth, vitality, and expansion. Associated with spring, family, and new beginnings. Enhance with plants, wooden furniture, and green colors.',
                'tooltip.fire': 'Fire represents passion, energy, and transformation. Associated with summer, fame, and recognition. Enhance with candles, lighting, and red/orange colors.',
                'tooltip.earth': 'Earth represents stability, nourishment, and grounding. Associated with center, health, and relationships. Enhance with crystals, ceramics, and yellow/brown colors.',
                'tooltip.metal': 'Metal represents precision, clarity, and efficiency. Associated with autumn, children, and creativity. Enhance with metal objects, white/gray colors, and circular shapes.',
                'tooltip.water': 'Water represents flow, wisdom, and wealth. Associated with winter, career, and life path. Enhance with fountains, aquariums, and blue/black colors.',

                // I-Ching Page
                'iching.title': 'I-Ching Divination',
                'iching.subtitle': 'Consult the ancient Book of Changes for guidance on important life decisions. Our AI interprets the hexagrams in the context of your modern life challenges.',
                'iching.method.title': 'Choose Your Divination Method',
                'iching.method.coins': 'Three Coins',
                'iching.method.coins.desc': 'Traditional method using three coins thrown six times to build your hexagram.',
                'iching.method.numbers': 'Numerical',
                'iching.method.numbers.desc': 'Use meaningful numbers from your life to generate the hexagram.',
                'iching.method.time': 'Time Based',
                'iching.method.time.desc': 'Let the current time determine your hexagram formation.',
                'iching.method.voice': 'Voice Question',
                'iching.method.voice.desc': 'Speak your question and let AI analyze it to create your hexagram.',
                'iching.question.label': 'What is your question?',
                'iching.question.placeholder': 'Focus on a specific question or situation you need guidance on. Be clear and specific about what you want to know.',
                'iching.button.begin': 'Begin Divination',
                'iching.cast.title': 'Cast the Coins',
                'iching.cast.instruction': 'Focus on your question and click the coins to cast them. Repeat this process six times to build your hexagram.',
                'iching.cast.current': 'Casting',
                'iching.cast.of': 'of',
                'iching.cast.button': 'Cast Coins',
                'iching.hexagram.building': 'Building...',
                'iching.hexagram.your': 'Your Hexagram',
                'iching.result.title': 'Your I-Ching Reading',
                'iching.result.subtitle': 'The ancient wisdom of the Book of Changes reveals:',
                'iching.result.primary': 'Primary Hexagram',
                'iching.result.changing': 'Changing Lines',
                'iching.result.judgment': 'Judgment',
                'iching.result.image': 'Image',
                'iching.result.advice': 'Advice for Your Situation',
                'iching.result.actions': 'Recommended Actions',
                'iching.button.save': 'Save Reading',
                'iching.button.share': 'Share Reading',
                'iching.button.new': 'New Divination',

                // Profile Page
                'profile.title': 'Personal Profile',
                'profile.level': 'Level',
                'profile.stats.readings': 'Total Readings',
                'profile.stats.accuracy': 'Accuracy Rate',
                'profile.stats.streak': 'Day Streak',
                'profile.stats.achievements': 'Achievements',
                'profile.progress': 'Level Progress',
                'profile.button.edit': 'Edit Profile',
                'profile.button.settings': 'Settings',
                'profile.tab.dashboard': 'Dashboard',
                'profile.tab.readings': 'Reading History',
                'profile.tab.goals': 'Goals & Progress',
                'profile.tab.achievements': 'Achievements',
                'profile.tab.insights': 'Personal Insights',
                'profile.personality': 'Personality Traits',
                'profile.activity.recent': 'Recent Activity',
                'profile.insights.today': 'Today\'s Insights',
                'profile.insights.lucky': 'Lucky Element',
                'profile.insights.career': 'Career Outlook',
                'profile.insights.relationships': 'Relationships',
                'profile.button.fullReading': 'Get Full Reading',
                'profile.settings.title': 'Account Preferences',
                'profile.settings.lang.title': 'System Language',
                'profile.settings.lang.desc': 'Current: Simplified Chinese',
                'profile.settings.notif.title': 'Push Notifications',
                'profile.settings.notif.desc': 'Daily destiny alerts',
                'profile.settings.privacy.title': 'Privacy Mode',
                'profile.settings.privacy.desc': 'Hide my reading history',
                'profile.settings.danger.title': 'Danger Zone',
                'profile.settings.danger.desc': 'Delete account and data',
                'profile.history.title': 'Reading History',
                'profile.history.allTypes': 'All Types',
                'profile.history.last30': 'Last 30 Days',
                'profile.history.last3months': 'Last 3 Months',
                'profile.history.lastYear': 'Last Year',
                'profile.history.allTime': 'All Time',
                'profile.history.loadMore': 'Load More History',
                'profile.goals.current': 'Current Goals',
                'profile.goals.add': 'Add Goal',
                'profile.goals.overview': 'Progress Overview',

                // Payment Page
                'payment.title': 'Choose Your Path to Wisdom',
                'payment.subtitle': 'Start your journey with free readings or unlock the full power of ancient Eastern wisdom with premium features designed for deeper insights and personal growth.',
                'payment.guarantee': '30-Day Money-Back Guarantee',
                'payment.plan.free': 'Free',
                'payment.plan.premium': 'Premium',
                'payment.plan.professional': 'Professional',
                'payment.plan.forever': 'Forever',
                'payment.plan.perMonth': 'per month',
                'payment.plan.mostPopular': 'Most Popular',
                'payment.button.getStarted': 'Get Started Free',
                'payment.button.choosePremium': 'Choose Premium',
                'payment.button.contactSales': 'Contact Sales',
                'payment.feature.basic': 'Basic fortune readings',
                'payment.feature.daily': 'Daily horoscopes',
                'payment.feature.fengshui': 'Simple feng shui tips',
                'payment.feature.community': 'Community access',
                'payment.feature.iching': 'Basic I-Ching readings',
                'payment.feature.birthChart': 'Detailed birth chart analysis',
                'payment.feature.advancedFengshui': 'Advanced feng shui compass',
                'payment.feature.unlimitedIching': 'Unlimited I-Ching consultations',
                'payment.feature.tracking': 'Personal growth tracking',
                'payment.feature.consultations': 'Expert consultations',
                'payment.feature.support': 'Priority support',
                'payment.feature.business': 'Business consultations',
                'payment.feature.reports': 'Custom reports & analysis',
                'payment.feature.api': 'API access',
                'payment.feature.whiteLabel': 'White-label solutions',
                'payment.comparison.title': 'Compare All Features',
                'payment.comparison.subtitle': 'See exactly what you get with each plan',
                'payment.testimonials.title': 'What Our Users Say',
                'payment.testimonials.subtitle': 'Join thousands of satisfied wisdom seekers',
                'payment.faq.title': 'Frequently Asked Questions',
                'payment.form.title': 'Complete Your Subscription',
                'payment.form.secure': 'Secure payment powered by SSL encryption',
                'payment.form.cardNumber': 'Card Number',
                'payment.form.expiry': 'Expiry Date',
                'payment.form.cvv': 'CVV',
                'payment.form.name': 'Cardholder Name',
                'payment.form.email': 'Email Address',
                'payment.form.security': 'Your payment information is secure and encrypted',
                'payment.button.cancel': 'Cancel',
                'payment.button.subscribe': 'Subscribe Now'
            },

            'zh-CN': {
                // 导航
                'nav.home': '首页',
                'nav.divination': '占卜',
                'nav.fengshui': '风水',
                'nav.iching': '易经',
                'nav.profile': '个人档案',
                'nav.upgrade': '升级',
                'nav.getStarted': '开始使用',
                'nav.login': '登入',
                'nav.logout': '退出登入',
                'nav.premium': '会员服务',

                // 通用
                'common.loading': '加载中...',
                'common.save': '保存',
                'common.cancel': '取消',
                'common.confirm': '确认',
                'common.close': '关闭',
                'common.back': '返回',
                'common.next': '下一步',
                'common.submit': '提交',
                'common.search': '搜索',

                // 首页
                'home.hero.title': '探索你的命运',
                'home.hero.title1': '探索你的命运',
                'home.hero.title2': '解锁古老智慧',
                'home.hero.title3': '导航人生旅程',
                'home.hero.title4': '找到真实道路',
                'home.hero.subtitle': '结合古老东方智慧与现代AI技术的力量。',
                'home.hero.description': '结合古老东方智慧与现代AI技术的力量。探索你的命运，优化你的环境，做出更好的人生决策。',
                'home.hero.cta1': '开始免费测算',
                'home.hero.cta2': '了解更多',
                'home.stats.readings': '完成测算',
                'home.stats.users': '满意用户',
                'home.stats.accuracy': '准确率',

                // 首页特性
                'home.features.title': '古老智慧，现代科技',
                'home.features.subtitle': '我们的AI平台结合传统东方占卜方法与尖端技术，为您提供准确的个性化洞察。',
                'home.features.divination.title': 'AI占卜',
                'home.features.divination.desc': '使用基于数千年东方智慧训练的先进AI算法获得个性化解读。准确、即时，并针对您的独特情况量身定制。',
                'home.features.divination.cta': '立即尝试 →',
                'home.features.fengshui.title': '风水分析',
                'home.features.fengshui.desc': '使用我们的互动风水罗盘优化您的生活和工作空间。获得实时分析和个性化建议，以改善能量流动。',
                'home.features.fengshui.cta': '探索 →',
                'home.features.iching.title': '易经智慧',
                'home.features.iching.desc': '咨询古老的易经以获得重要决策的指导。我们的AI在您现代生活挑战的背景下解释卦象。',
                'home.features.iching.cta': '咨询 →',

                // 使用流程
                'home.howItWorks.title': '您的自我发现之旅',
                'home.howItWorks.subtitle': '简单的步骤解锁古老智慧，清晰了解您的前进道路。',
                'home.howItWorks.step1.title': '分享您的信息',
                'home.howItWorks.step1.desc': '输入您的出生详情和当前的问题或疑虑。',
                'home.howItWorks.step2.title': 'AI分析',
                'home.howItWorks.step2.desc': '我们的AI使用古老东方智慧系统处理您的信息。',
                'home.howItWorks.step3.title': '获得洞察',
                'home.howItWorks.step3.desc': '获得个性化解读，包含可行的指导和预测。',
                'home.howItWorks.step4.title': '采取行动',
                'home.howItWorks.step4.desc': '使用获得的智慧做出更好的决策，改善您的生活。',

                // 占卜页面
                'divination.title': 'AI占卜与命运解读',
                'divination.subtitle': '通过先进的AI分析您的生辰八字和人生轨迹，探索您的命运。',
                'divination.form.title': '输入您的出生信息',
                'divination.form.birthDate': '出生日期',
                'divination.form.birthTime': '出生时间',
                'divination.form.birthPlace': '出生地点',
                'divination.form.gender': '性别',
                'divination.form.gender.male': '男',
                'divination.form.gender.female': '女',
                'divination.form.gender.other': '其他',
                'divination.form.gender.select': '选择性别',
                'divination.form.question': '您想了解什么？',
                'divination.category.career': '事业',
                'divination.category.career.desc': '职业发展与机遇',
                'divination.category.wealth': '财运',
                'divination.category.wealth.desc': '财务前景与财运',
                'divination.category.love': '爱情',
                'divination.category.love.desc': '感情与婚姻',
                'divination.category.health': '健康',
                'divination.category.health.desc': '健康与活力',
                'divination.button.analyze': '分析我的命运',
                'divination.dateFormat': '格式：月/日/年（例如：12/31/1990）',
                'divination.timeFormat': '格式：12小时制（例如：下午2:30）',
                'divination.dateLabel': '📅 英文格式',
                'divination.timeLabel': '🕐 12小时制',
                'divination.clickToSelect': '点击选择',

                // 风水页面
                'fengshui.title': '风水分析与罗盘',
                'fengshui.subtitle': '使用我们的互动风水罗盘优化您的生活和工作空间。获得实时分析和个性化建议，以改善能量流动。',
                'fengshui.compass.title': '互动风水罗盘',
                'fengshui.compass.rotateLeft': '← 向左旋转',
                'fengshui.compass.rotateRight': '向右旋转 →',
                'fengshui.compass.direction': '当前方向',
                'fengshui.compass.degrees': '度数',
                'fengshui.elements.title': '五行平衡',
                'fengshui.elements.wood': '木',
                'fengshui.elements.fire': '火',
                'fengshui.elements.earth': '土',
                'fengshui.elements.metal': '金',
                'fengshui.elements.water': '水',
                'fengshui.button.analyze': '开始AI风水分析',
                'fengshui.analyze.button': '开始AI风水分析',
                'fengshui.image.upload': '上传环境照片',
                'fengshui.image.success': '图片上传成功',

                // 定价
                'home.pricing.title': '选择您的道路',
                'home.pricing.subtitle': '从免费测算开始，或通过高级功能解锁古老智慧的全部力量。',

                // 免责声明
                'home.disclaimer.title': '⚠️ 重要免责声明',
                'home.disclaimer.text': 'Astre Devin 基于能量周期分析和性格蓝图系统提供娱乐和自我反思工具。我们的解读和分析仅用于信息和娱乐目的，不应被视为医疗、法律、财务或心理事务的专业建议。结果不保证，不应作为重要人生决策的唯一依据。需要专家指导的事务请咨询合格的专业人士。',

                // 页脚
                'footer.description': '结合古老东方智慧与现代AI技术，帮助您探索命运并做出更好的人生决策。',
                'footer.privacy': '隐私政策',
                'footer.terms': '服务条款',
                'footer.contact': '联系我们',
                'footer.support': '支持',
                'footer.copyright': '© 2024 命运AI。保留所有权利。通过古老智慧和现代技术赋能生活。',

                // 工具提示
                'tooltip.divination': '占卜是通过超自然手段寻求未来或未知知识的实践。我们的AI使用古老的东方占星原理分析您的生辰八字。',
                'tooltip.fengshui': '风水（字面意思是"风-水"）是一种古老的中国实践，通过安排环境来促进和谐和正能量流动。',
                'tooltip.iching': '易经（变化之书）是一本有3000年历史的中国占卜文本。它使用64个卦象为人生决策提供指导。',
                'tooltip.elements': '五行（木、火、土、金、水）是中国哲学中的基本概念，代表不同类型的能量。',
                'tooltip.wood': '木代表生长、活力和扩张。与春天、家庭和新开始相关。用植物、木制家具和绿色增强。',
                'tooltip.fire': '火代表激情、能量和转化。与夏天、名声和认可相关。用蜡烛、照明和红/橙色增强。',
                'tooltip.earth': '土代表稳定、滋养和接地。与中心、健康和关系相关。用水晶、陶瓷和黄/棕色增强。',
                'tooltip.metal': '金代表精确、清晰和效率。与秋天、孩子和创造力相关。用金属物品、白/灰色和圆形增强。',
                'tooltip.water': '水代表流动、智慧和财富。与冬天、事业和人生道路相关。用喷泉、水族箱和蓝/黑色增强。',

                // 易经页面
                'iching.title': '易经解卦',
                'iching.subtitle': '咨询古老的易经以获得重要人生决策的指导。我们的AI在您现代生活挑战的背景下解释卦象。',
                'iching.method.title': '选择您的占卜方法',
                'iching.method.coins': '三枚硬币',
                'iching.method.coins.desc': '传统方法，使用三枚硬币投掷六次来构建您的卦象。',
                'iching.method.numbers': '数字法',
                'iching.method.numbers.desc': '使用您生活中有意义的数字来生成卦象。',
                'iching.method.time': '时间法',
                'iching.method.time.desc': '让当前时间决定您的卦象形成。',
                'iching.method.voice': '语音提问',
                'iching.method.voice.desc': '说出您的问题，让AI分析并创建您的卦象。',
                'iching.question.label': '您的问题是什么？',
                'iching.question.placeholder': '专注于您需要指导的具体问题或情况。请清晰具体地说明您想了解什么。',
                'iching.button.begin': '开始起卦',
                'iching.cast.title': '投掷硬币',
                'iching.cast.instruction': '专注于您的问题，点击硬币进行投掷。重复此过程六次以构建您的卦象。',
                'iching.cast.current': '投掷',
                'iching.cast.of': '共',
                'iching.cast.button': '投掷硬币',
                'iching.hexagram.building': '构建中...',
                'iching.hexagram.your': '您的卦象',
                'iching.result.title': '您的易经解读',
                'iching.result.subtitle': '易经的古老智慧揭示：',
                'iching.result.primary': '主卦',
                'iching.result.changing': '变爻',
                'iching.result.judgment': '卦辞',
                'iching.result.image': '象辞',
                'iching.result.advice': '针对您情况的建议',
                'iching.result.actions': '推荐行动',
                'iching.button.save': '保存解读',
                'iching.button.share': '分享解读',
                'iching.button.new': '新占卜',

                // 个人档案页面
                'profile.title': '个人档案',
                'profile.level': '等级',
                'profile.stats.readings': '总测算次数',
                'profile.stats.accuracy': '准确率',
                'profile.stats.streak': '连续天数',
                'profile.stats.achievements': '成就',
                'profile.progress': '等级进度',
                'profile.button.edit': '编辑档案',
                'profile.button.settings': '设置',
                'profile.tab.dashboard': '仪表板',
                'profile.tab.readings': '测算历史',
                'profile.tab.goals': '目标与进度',
                'profile.tab.achievements': '成就',
                'profile.tab.insights': '个人洞察',
                'profile.personality': '性格特征',
                'profile.activity.recent': '最近活动',
                'profile.insights.today': '今日洞察',
                'profile.insights.lucky': '幸运元素',
                'profile.insights.career': '事业展望',
                'profile.insights.relationships': '人际关系',
                'profile.button.fullReading': '获取完整解读',
                'profile.settings.title': '账户偏好',
                'profile.settings.lang.title': '系统语言',
                'profile.settings.lang.desc': '当前：简体中文',
                'profile.settings.notif.title': '推送通知',
                'profile.settings.notif.desc': '每日运势提醒',
                'profile.settings.privacy.title': '隐私模式',
                'profile.settings.privacy.desc': '隐藏我的测算记录',
                'profile.settings.danger.title': '危险区域',
                'profile.settings.danger.desc': '注销账号及相关数据',
                'profile.history.title': '测算历史',
                'profile.history.allTypes': '所有类型',
                'profile.history.last30': '最近30天',
                'profile.history.last3months': '最近3个月',
                'profile.history.lastYear': '最近一年',
                'profile.history.allTime': '全部时间',
                'profile.history.loadMore': '加载更多历史',
                'profile.goals.current': '当前目标',
                'profile.goals.add': '添加目标',
                'profile.goals.overview': '进度概览',

                // 支付页面
                'payment.title': '选择您的智慧之路',
                'payment.subtitle': '从免费测算开始您的旅程，或通过高级功能解锁古老东方智慧的全部力量，获得更深入的洞察和个人成长。',
                'payment.guarantee': '30天退款保证',
                'payment.plan.free': '免费',
                'payment.plan.premium': '高级',
                'payment.plan.professional': '专业',
                'payment.plan.forever': '永久',
                'payment.plan.perMonth': '每月',
                'payment.plan.mostPopular': '最受欢迎',
                'payment.button.getStarted': '免费开始',
                'payment.button.choosePremium': '选择高级版',
                'payment.button.contactSales': '联系销售',
                'payment.feature.basic': '基础命运测算',
                'payment.feature.daily': '每日运势',
                'payment.feature.fengshui': '简单风水建议',
                'payment.feature.community': '社区访问',
                'payment.feature.iching': '基础易经解读',
                'payment.feature.birthChart': '详细生辰八字分析',
                'payment.feature.advancedFengshui': '高级风水罗盘',
                'payment.feature.unlimitedIching': '无限易经咨询',
                'payment.feature.tracking': '个人成长追踪',
                'payment.feature.consultations': '专家咨询',
                'payment.feature.support': '优先支持',
                'payment.feature.business': '商业咨询',
                'payment.feature.reports': '定制报告与分析',
                'payment.feature.api': 'API访问',
                'payment.feature.whiteLabel': '白标解决方案',
                'payment.comparison.title': '比较所有功能',
                'payment.comparison.subtitle': '准确了解每个计划包含的内容',
                'payment.testimonials.title': '用户评价',
                'payment.testimonials.subtitle': '加入数千名满意的智慧探索者',
                'payment.faq.title': '常见问题',
                'payment.form.title': '完成您的订阅',
                'payment.form.secure': '由SSL加密保护的安全支付',
                'payment.form.cardNumber': '卡号',
                'payment.form.expiry': '有效期',
                'payment.form.cvv': '安全码',
                'payment.form.name': '持卡人姓名',
                'payment.form.email': '电子邮箱',
                'payment.form.security': '您的支付信息是安全和加密的',
                'payment.button.cancel': '取消',
                'payment.button.subscribe': '立即订阅'
            },

            'zh-TW': {
                // 導航
                'nav.home': '首頁',
                'nav.divination': '占卜',
                'nav.fengshui': '風水',
                'nav.iching': '易經',
                'nav.profile': '個人檔案',
                'nav.upgrade': '升級',
                'nav.getStarted': '開始使用',
                'nav.login': '登入',
                'nav.logout': '退出登入',
                'nav.premium': '會員服務',

                // 通用
                'common.loading': '載入中...',
                'common.save': '儲存',
                'common.cancel': '取消',
                'common.confirm': '確認',
                'common.close': '關閉',
                'common.back': '返回',
                'common.next': '下一步',
                'common.submit': '提交',
                'common.search': '搜尋',

                // 首頁
                'home.hero.title': '探索你的命運',
                'home.hero.title1': '探索你的命運',
                'home.hero.title2': '解鎖古老智慧',
                'home.hero.title3': '導航人生旅程',
                'home.hero.title4': '找到真實道路',
                'home.hero.subtitle': '結合古老東方智慧與現代AI技術的力量。',
                'home.hero.description': '結合古老東方智慧與現代AI技術的力量。探索你的命運，優化你的環境，做出更好的人生決策。',
                'home.hero.cta1': '開始免費測算',
                'home.hero.cta2': '了解更多',
                'home.stats.readings': '完成測算',
                'home.stats.users': '滿意用戶',
                'home.stats.accuracy': '準確率',

                // 首頁特性
                'home.features.title': '古老智慧，現代科技',
                'home.features.subtitle': '我們的AI平台結合傳統東方占卜方法與尖端技術，為您提供準確的個性化洞察。',
                'home.features.divination.title': 'AI占卜',
                'home.features.divination.desc': '使用基於數千年東方智慧訓練的先進AI算法獲得個性化解讀。準確、即時，並針對您的獨特情況量身定制。',
                'home.features.divination.cta': '立即嘗試 →',
                'home.features.fengshui.title': '風水分析',
                'home.features.fengshui.desc': '使用我們的互動風水羅盤優化您的生活和工作空間。獲得即時分析和個性化建議，以改善能量流動。',
                'home.features.fengshui.cta': '探索 →',
                'home.features.iching.title': '易經智慧',
                'home.features.iching.desc': '諮詢古老的易經以獲得重要決策的指導。我們的AI在您現代生活挑戰的背景下解釋卦象。',
                'home.features.iching.cta': '諮詢 →',

                // 使用流程
                'home.howItWorks.title': '您的自我發現之旅',
                'home.howItWorks.subtitle': '簡單的步驟解鎖古老智慧，清晰了解您的前進道路。',
                'home.howItWorks.step1.title': '分享您的資訊',
                'home.howItWorks.step1.desc': '輸入您的出生詳情和當前的問題或疑慮。',
                'home.howItWorks.step2.title': 'AI分析',
                'home.howItWorks.step2.desc': '我們的AI使用古老東方智慧系統處理您的資訊。',
                'home.howItWorks.step3.title': '獲得洞察',
                'home.howItWorks.step3.desc': '獲得個性化解讀，包含可行的指導和預測。',
                'home.howItWorks.step4.title': '採取行動',
                'home.howItWorks.step4.desc': '使用獲得的智慧做出更好的決策，改善您的生活。',

                // 占卜頁面
                'divination.title': 'AI占卜與命運解讀',
                'divination.subtitle': '通過先進的AI分析您的生辰八字和人生軌跡，探索您的命運。',
                'divination.form.title': '輸入您的出生資訊',
                'divination.form.birthDate': '出生日期',
                'divination.form.birthTime': '出生時間',
                'divination.form.birthPlace': '出生地點',
                'divination.form.gender': '性別',
                'divination.form.gender.male': '男',
                'divination.form.gender.female': '女',
                'divination.form.gender.other': '其他',
                'divination.form.gender.select': '選擇性別',
                'divination.form.question': '您想了解什麼？',
                'divination.category.career': '事業',
                'divination.category.career.desc': '職業發展與機遇',
                'divination.category.wealth': '財運',
                'divination.category.wealth.desc': '財務前景與財運',
                'divination.category.love': '愛情',
                'divination.category.love.desc': '感情與婚姻',
                'divination.category.health': '健康',
                'divination.category.health.desc': '健康與活力',
                'divination.button.analyze': '分析我的命運',
                'divination.dateFormat': '格式：月/日/年（例如：12/31/1990）',
                'divination.timeFormat': '格式：12小時制（例如：下午2:30）',
                'divination.dateLabel': '📅 英文格式',
                'divination.timeLabel': '🕐 12小時制',
                'divination.clickToSelect': '點擊選擇',

                // 風水頁面
                'fengshui.title': '風水分析與羅盤',
                'fengshui.subtitle': '使用我們的互動風水羅盤優化您的生活和工作空間。獲得即時分析和個性化建議，以改善能量流動。',
                'fengshui.compass.title': '互動風水羅盤',
                'fengshui.compass.rotateLeft': '← 向左旋轉',
                'fengshui.compass.rotateRight': '向右旋轉 →',
                'fengshui.compass.direction': '當前方向',
                'fengshui.compass.degrees': '度數',
                'fengshui.elements.title': '五行平衡',
                'fengshui.elements.wood': '木',
                'fengshui.elements.fire': '火',
                'fengshui.elements.earth': '土',
                'fengshui.elements.metal': '金',
                'fengshui.elements.water': '水',

                // 定價
                'home.pricing.title': '選擇您的道路',
                'home.pricing.subtitle': '從免費測算開始，或通過高級功能解鎖古老智慧的全部力量。',

                // 免責聲明
                'home.disclaimer.title': '⚠️ 重要免責聲明',
                'home.disclaimer.text': 'Astre Devin 基於能量週期分析和性格藍圖系統提供娛樂和自我反思工具。我們的解讀和分析僅用於資訊和娛樂目的，不應被視為醫療、法律、財務或心理事務的專業建議。結果不保證，不應作為重要人生決策的唯一依據。需要專家指導的事務請諮詢合格的專業人士。',

                // 頁腳
                'footer.description': '結合古老東方智慧與現代AI技術，幫助您探索命運並做出更好的人生決策。',
                'footer.privacy': '隱私政策',
                'footer.terms': '服務條款',
                'footer.contact': '聯絡我們',
                'footer.support': '支援',
                'footer.copyright': '© 2024 九筮 Astre Devin。保留所有權利。通過古老智慧和現代技術賦能生活。',

                // 工具提示
                'tooltip.divination': '占卜是通過超自然手段尋求未來或未知知識的實踐。我們的AI使用古老的東方占星原理分析您的生辰八字。',
                'tooltip.fengshui': '風水（字面意思是「風-水」）是一種古老的中國實踐，通過安排環境來促進和諧和正能量流動。',
                'tooltip.iching': '易經（變化之書）是一本有3000年歷史的中國占卜文本。它使用64個卦象為人生決策提供指導。',
                'tooltip.elements': '五行（木、火、土、金、水）是中國哲學中的基本概念，代表不同類型的能量。',
                'tooltip.wood': '木代表生長、活力和擴張。與春天、家庭和新開始相關。用植物、木製家具和綠色增強。',
                'tooltip.fire': '火代表激情、能量和轉化。與夏天、名聲和認可相關。用蠟燭、照明和紅/橙色增強。',
                'tooltip.earth': '土代表穩定、滋養和接地。與中心、健康和關係相關。用水晶、陶瓷和黃/棕色增強。',
                'tooltip.metal': '金代表精確、清晰和效率。與秋天、孩子和創造力相關。用金屬物品、白/灰色和圓形增強。',
                'tooltip.water': '水代表流動、智慧和財富。與冬天、事業和人生道路相關。用噴泉、水族箱和藍/黑色增強。',

                // 易經頁面
                'iching.title': '易經解卦',
                'iching.subtitle': '諮詢古老的易經以獲得重要人生決策的指導。我們的AI在您現代生活挑戰的背景下解釋卦象。',
                'iching.method.title': '選擇您的占卜方法',
                'iching.method.coins': '三枚硬幣',
                'iching.method.coins.desc': '傳統方法，使用三枚硬幣投擲六次來構建您的卦象。',
                'iching.method.numbers': '數字法',
                'iching.method.numbers.desc': '使用您生活中有意義的數字來生成卦象。',
                'iching.method.time': '時間法',
                'iching.method.time.desc': '讓當前時間決定您的卦象形成。',
                'iching.method.voice': '語音提問',
                'iching.method.voice.desc': '說出您的問題，讓AI分析並創建您的卦象。',
                'iching.question.label': '您的問題是什麼？',
                'iching.question.placeholder': '專注於您需要指導的具體問題或情況。請清晰具體地說明您想了解什麼。',
                'iching.button.begin': '開始占卜',
                'iching.cast.title': '投擲硬幣',
                'iching.cast.instruction': '專注於您的問題，點擊硬幣進行投擲。重複此過程六次以構建您的卦象。',
                'iching.cast.current': '投擲',
                'iching.cast.of': '共',
                'iching.cast.button': '投擲硬幣',
                'iching.hexagram.building': '構建中...',
                'iching.hexagram.your': '您的卦象',
                'iching.result.title': '您的易經解讀',
                'iching.result.subtitle': '易經的古老智慧揭示：',
                'iching.result.primary': '主卦',
                'iching.result.changing': '變爻',
                'iching.result.judgment': '卦辭',
                'iching.result.image': '象辭',
                'iching.result.advice': '針對您情況的建議',
                'iching.result.actions': '推薦行動',
                'iching.button.save': '儲存解讀',
                'iching.button.share': '分享解讀',
                'iching.button.new': '新占卜',

                // 個人檔案頁面
                'profile.title': '個人檔案',
                'profile.level': '等級',
                'profile.stats.readings': '總測算次數',
                'profile.stats.accuracy': '準確率',
                'profile.stats.streak': '連續天數',
                'profile.stats.achievements': '成就',
                'profile.progress': '等級進度',
                'profile.button.edit': '編輯檔案',
                'profile.button.settings': '設定',
                'profile.tab.dashboard': '儀表板',
                'profile.tab.readings': '測算歷史',
                'profile.tab.goals': '目標與進度',
                'profile.tab.achievements': '成就',
                'profile.tab.insights': '個人洞察',
                'profile.personality': '性格特徵',
                'profile.activity.recent': '最近活動',
                'profile.insights.today': '今日洞察',
                'profile.insights.lucky': '幸運元素',
                'profile.insights.career': '事業展望',
                'profile.insights.relationships': '人際關係',
                'profile.button.fullReading': '獲取完整解讀',
                'profile.history.title': '測算歷史',
                'profile.history.allTypes': '所有類型',
                'profile.history.last30': '最近30天',
                'profile.history.last3months': '最近3個月',
                'profile.history.lastYear': '最近一年',
                'profile.history.allTime': '全部時間',
                'profile.history.loadMore': '載入更多歷史',
                'profile.goals.current': '當前目標',
                'profile.goals.add': '新增目標',
                'profile.goals.overview': '進度概覽',

                // 支付頁面
                'payment.title': '選擇您的智慧之路',
                'payment.subtitle': '從免費測算開始您的旅程，或通過高級功能解鎖古老東方智慧的全部力量，獲得更深入的洞察和個人成長。',
                'payment.guarantee': '30天退款保證',
                'payment.plan.free': '免費',
                'payment.plan.premium': '高級',
                'payment.plan.professional': '專業',
                'payment.plan.forever': '永久',
                'payment.plan.perMonth': '每月',
                'payment.plan.mostPopular': '最受歡迎',
                'payment.button.getStarted': '免費開始',
                'payment.button.choosePremium': '選擇高級版',
                'payment.button.contactSales': '聯絡銷售',
                'payment.feature.basic': '基礎命運測算',
                'payment.feature.daily': '每日運勢',
                'payment.feature.fengshui': '簡單風水建議',
                'payment.feature.community': '社群訪問',
                'payment.feature.iching': '基礎易經解讀',
                'payment.feature.birthChart': '詳細生辰八字分析',
                'payment.feature.advancedFengshui': '高級風水羅盤',
                'payment.feature.unlimitedIching': '無限易經諮詢',
                'payment.feature.tracking': '個人成長追蹤',
                'payment.feature.consultations': '專家諮詢',
                'payment.feature.support': '優先支援',
                'payment.feature.business': '商業諮詢',
                'payment.feature.reports': '定製報告與分析',
                'payment.feature.api': 'API訪問',
                'payment.feature.whiteLabel': '白標解決方案',
                'payment.comparison.title': '比較所有功能',
                'payment.comparison.subtitle': '準確了解每個計劃包含的內容',
                'payment.testimonials.title': '用戶評價',
                'payment.testimonials.subtitle': '加入數千名滿意的智慧探索者',
                'payment.faq.title': '常見問題',
                'payment.form.title': '完成您的訂閱',
                'payment.form.secure': '由SSL加密保護的安全支付',
                'payment.form.cardNumber': '卡號',
                'payment.form.expiry': '有效期',
                'payment.form.cvv': '安全碼',
                'payment.form.name': '持卡人姓名',
                'payment.form.email': '電子郵箱',
                'payment.form.security': '您的支付資訊是安全和加密的',
                'payment.button.cancel': '取消',
                'payment.button.subscribe': '立即訂閱'
            }
        };
    }

    setupLanguageSelector() {
        const languageSelect = document.getElementById('languageSelect');
        if (languageSelect) {
            // Set current language
            languageSelect.value = this.currentLanguage;

            // Add change event listener
            languageSelect.addEventListener('change', (e) => {
                this.setLanguage(e.target.value);
            });
        }
    }

    setLanguage(lang) {
        this.currentLanguage = lang;
        localStorage.setItem('destinyai_language', lang);

        // CRITICAL FIX: Also update preferredLanguage for AI services
        // AI services (divination, fengshui, iching) use 'preferredLanguage' key
        localStorage.setItem('preferredLanguage', lang);
        console.log('[I18n] Updated preferredLanguage to:', lang);

        this.updatePage();

        // Update HTML lang attribute
        document.documentElement.lang = lang === 'zh-CN' ? 'zh-Hans' :
            lang === 'zh-TW' ? 'zh-Hant' : 'en';

        // Dispatch language change event for other components
        window.dispatchEvent(new CustomEvent('languageChanged', {
            detail: { language: lang }
        }));
    }

    updatePage() {
        // Update all elements with data-i18n attribute
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            const translation = this.t(key);

            if (translation) {
                // Check if it's an input placeholder
                if (element.tagName === 'INPUT' && element.hasAttribute('placeholder')) {
                    element.placeholder = translation;
                } else {
                    element.textContent = translation;
                }
            }
        });

        // Update all elements with data-i18n-placeholder attribute
        document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
            const key = element.getAttribute('data-i18n-placeholder');
            const translation = this.t(key);

            if (translation) {
                element.placeholder = translation;
            }
        });

        // Update all elements with data-i18n-title attribute (tooltips)
        document.querySelectorAll('[data-i18n-title]').forEach(element => {
            const key = element.getAttribute('data-i18n-title');
            const translation = this.t(key);

            if (translation) {
                element.title = translation;
            }
        });

        // Update tooltip content
        document.querySelectorAll('[data-i18n-tooltip]').forEach(element => {
            const key = element.getAttribute('data-i18n-tooltip');
            const translation = this.t(key);

            if (translation) {
                const tooltipContent = element.querySelector('.tooltip-content');
                if (tooltipContent) {
                    tooltipContent.textContent = translation;
                }
            }
        });
    }

    t(key) {
        const keys = key.split('.');
        let value = this.translations[this.currentLanguage];

        for (const k of keys) {
            if (value && typeof value === 'object') {
                value = value[k];
            } else {
                return key; // Return key if translation not found
            }
        }

        return value || key;
    }

    getCurrentLanguage() {
        return this.currentLanguage;
    }
}

// Initialize i18n when DOM is loaded
let i18n;
document.addEventListener('DOMContentLoaded', () => {
    i18n = new I18n();
});

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = I18n;
}
