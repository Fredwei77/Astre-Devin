// I-Ching AI Integration
// 易经占卜AI集成

class IChingAI {
    constructor() {
        this.hexagrams = this.initializeHexagrams();
        this.currentReading = null;
    }

    /**
     * 初始化64卦数据
     */
    initializeHexagrams() {
        const lang = (window.i18n && window.i18n.currentLanguage) || 'zh';
        const hexagramsData = {
            1: { name: '乾', english: 'The Creative', chinese: '乾为天', description: '元亨利贞' },
            2: { name: '坤', english: 'The Receptive', chinese: '坤为地', description: '元亨，利牝马之贞' },
            3: { name: '屯', english: 'Difficulty at the Beginning', chinese: '水雷屯', description: '元亨利贞，勿用有攸往' },
            4: { name: '蒙', english: 'Youthful Folly', chinese: '山水蒙', description: '亨，匪我求童蒙' },
            5: { name: '需', english: 'Waiting', chinese: '水天需', description: '有孚，光亨，贞吉' },
            6: { name: '讼', english: 'Conflict', chinese: '天水讼', description: '有孚，窒惕，中吉' },
            7: { name: '师', english: 'The Army', chinese: '地水师', description: '贞，丈人吉，无咎' },
            8: { name: '比', english: 'Holding Together', chinese: '水地比', description: '吉，原筮，元永贞' },
            9: { name: '小畜', english: 'Small Taming', chinese: '风天小畜', description: '亨，密云不雨，自我西郊' },
            10: { name: '履', english: 'Treading', chinese: '天泽履', description: '履虎尾，不咥人，亨' },
            11: { name: '泰', english: 'Peace', chinese: '地天泰', description: '小往大来，吉亨' },
            12: { name: '否', english: 'Standstill', chinese: '天地否', description: '否之匪人，不利君子贞，大往小来' },
            13: { name: '同人', english: 'Fellowship', chinese: '天火同人', description: '同人于野，亨，利涉大川，利君子贞' },
            14: { name: '大有', english: 'Great Possession', chinese: '火天大有', description: '元亨' },
            15: { name: '谦', english: 'Modesty', chinese: '地山谦', description: '亨，君子有终' },
            16: { name: '豫', english: 'Enthusiasm', chinese: '雷地豫', description: '利建侯行师' },
            17: { name: '随', english: 'Following', chinese: '泽雷随', description: '元亨利贞，无咎' },
            18: { name: '蛊', english: 'Work on the Decayed', chinese: '山风蛊', description: '元亨，利涉大川' },
            19: { name: '临', english: 'Approach', chinese: '地泽临', description: '元亨利贞，至于八月有凶' },
            20: { name: '观', english: 'Contemplation', chinese: '风地观', description: '盥而不荐，有孚颙若' },
            21: { name: '噬嗑', english: 'Biting Through', chinese: '火雷噬嗑', description: '亨，利用狱' },
            22: { name: '贲', english: 'Grace', chinese: '山火贲', description: '亨，小利有攸往' },
            23: { name: '剥', english: 'Splitting Apart', chinese: '山地剥', description: '不利有攸往' },
            24: { name: '复', english: 'Return', chinese: '地雷复', description: '亨，出入无疾，朋来无咎' },
            25: { name: '无妄', english: 'Innocence', chinese: '天雷无妄', description: '元亨利贞，其匪正有眚，不利有攸往' },
            26: { name: '大畜', english: 'Great Taming', chinese: '山天大畜', description: '利贞，不家食吉，利涉大川' },
            27: { name: '颐', english: 'The Corners of the Mouth', chinese: '山雷颐', description: '贞吉，观颐，自求口实' },
            28: { name: '大过', english: 'Preponderance of the Great', chinese: '泽风大过', description: '栋桡，利有攸往，亨' },
            29: { name: '坎', english: 'The Abysmal (Water)', chinese: '坎为水', description: '习坎，有孚，维心亨，行有尚' },
            30: { name: '离', english: 'The Clinging (Fire)', chinese: '离为火', description: '利贞，亨，畜牝牛吉' },
            31: { name: '咸', english: 'Influence', chinese: '泽山咸', description: '亨，利贞，取女吉' },
            32: { name: '恒', english: 'Duration', chinese: '雷风恒', description: '亨，无咎，利贞，利有攸往' },
            33: { name: '遯', english: 'Retreat', chinese: '天山遯', description: '亨，小利贞' },
            34: { name: '大壮', english: 'Great Power', chinese: '雷天大壮', description: '利贞' },
            35: { name: '晋', english: 'Progress', chinese: '火地晋', description: '康侯用锡马蕃庶，昼日三接' },
            36: { name: '明夷', english: 'Darkening of the Light', chinese: '地火明夷', description: '利艰贞' },
            37: { name: '家人', english: 'The Family', chinese: '风火家人', description: '利女贞' },
            38: { name: '睽', english: 'Opposition', chinese: '火泽睽', description: '小事吉' },
            39: { name: '蹇', english: 'Obstruction', chinese: '水山蹇', description: '利西南，不利东北；利见大人，贞吉' },
            40: { name: '解', english: 'Deliverance', chinese: '雷水解', description: '利西南，无所往，其来复吉' },
            41: { name: '损', english: 'Decrease', chinese: '山泽损', description: '有孚，元吉，无咎，可贞，利有攸往' },
            42: { name: '益', english: 'Increase', chinese: '风雷益', description: '利有攸往，利涉大川' },
            43: { name: '夬', english: 'Break-through', chinese: '泽天夬', description: '扬于王庭，孚号，有厉，告自邑，不利即戎，利有攸往' },
            44: { name: '姤', english: 'Coming to Meet', chinese: '天风姤', description: '女壮，勿用取女' },
            45: { name: '萃', english: 'Gathering Together', chinese: '泽地萃', description: '亨，王假有庙，利见大人，亨，利贞，用大牲吉，利有攸往' },
            46: { name: '升', english: 'Pushing Upward', chinese: '地风升', description: '元亨，用见大人，勿恤，南征吉' },
            47: { name: '困', english: 'Oppression', chinese: '泽水困', description: '亨，贞，大人吉，无咎，有言不信' },
            48: { name: '井', english: 'The Well', chinese: '水风井', description: '改邑不改井，无丧无得，往来井井' },
            49: { name: '革', english: 'Revolution', chinese: '泽火革', description: '已日乃孚，元亨利贞，悔亡' },
            50: { name: '鼎', english: 'The Cauldron', chinese: '火风鼎', description: '元吉，亨' },
            51: { name: '震', english: 'The Arousing (Thunder)', chinese: '震为雷', description: '亨，震来虩虩，笑言哑哑，震惊百里，不丧匕鬯' },
            52: { name: '艮', english: 'Keeping Still (Mountain)', chinese: '艮为山', description: '艮其背，不获其身，行其庭，不见其人，无咎' },
            53: { name: '渐', english: 'Development', chinese: '风山渐', description: '女归吉，利贞' },
            54: { name: '归妹', english: 'The Marrying Maiden', chinese: '雷泽归妹', description: '征凶，无攸利' },
            55: { name: '丰', english: 'Abundance', chinese: '雷火丰', description: '亨，王假之，勿忧，宜日中' },
            56: { name: '旅', english: 'The Wanderer', chinese: '火山旅', description: '小亨，旅贞吉' },
            57: { name: '巽', english: 'The Gentle (Wind)', chinese: '巽为风', description: '小亨，利有攸往，利见大人' },
            58: { name: '兑', english: 'The Joyous (Lake)', chinese: '兑为泽', description: '亨，利贞' },
            59: { name: '涣', english: 'Dispersion', chinese: '风水涣', description: '亨，王假有庙，利涉大川，利贞' },
            60: { name: '节', english: 'Limitation', chinese: '水泽节', description: '亨，苦节不可贞' },
            61: { english: 'Inner Truth', chinese: '风泽中孚', description: '豚鱼吉，利涉大川，利贞' },
            62: { name: '小过', english: 'Preponderance of the Small', chinese: '雷山小过', description: '亨，利贞，可小事，不可大事' },
            63: { name: '既济', english: 'After Completion', chinese: '水火既济', description: '亨，小利贞，初吉终乱' },
            64: { name: '未济', english: 'Before Completion', chinese: '火水未济', description: '亨，小狐汔济，濡其尾，无攸利' }
        };

        // 如果需要，可以根据语言在此处进行转换逻辑
        return hexagramsData;
    }

    /**
     * 执行易经占卜
     */
    async performDivination(question, hexagramLines, changingLines, explicitNumber = null) {
        try {
            // 计算卦象
            const hexagramNumber = explicitNumber || this.calculateHexagram(hexagramLines);
            const hexagram = this.hexagrams[hexagramNumber] || this.hexagrams[1];

            const lang = (window.i18n && window.i18n.currentLanguage) || 'zh';
            const hexagramDisplayName = lang === 'en' ? hexagram.english : hexagram.chinese;

            const questionData = {
                question: question,
                hexagram: hexagramDisplayName,
                hexagramNumber: hexagramNumber,
                changingLines: changingLines
            };

            // 调用AI服务获取解读
            const result = await aiService.analyzeIChing(questionData);

            this.currentReading = {
                ...result,
                hexagramNumber: hexagramNumber,
                hexagramName: hexagram.chinese,
                question: question
            };

            // 更新显示
            this.displayReading(this.currentReading);

            return this.currentReading;

        } catch (error) {
            console.error('易经占卜错误:', error);
            throw error;
        }
    }

    /**
     * 根据爻线计算卦象编号
     */
    calculateHexagram(lines) {
        // 简化版：将6个爻转换为卦象编号
        // 实际应用中需要更复杂的算法
        let value = 0;
        lines.forEach((line, index) => {
            if (line.type === 'solid') {
                value += Math.pow(2, index);
            }
        });

        // 映射到1-64的卦象编号
        return (value % 64) + 1;
    }

    /**
     * 显示占卜结果
     */
    displayReading(reading) {
        // 隐藏输入和投币区域
        document.getElementById('methodSection')?.classList.add('hidden');
        document.getElementById('coinSection')?.classList.add('hidden');

        // 显示结果区域
        const resultsSection = document.getElementById('resultsSection');
        if (resultsSection) {
            resultsSection.classList.remove('hidden');
        }

        // 更新卦象信息
        this.updateHexagramDisplay(reading);

        // 更新解读内容
        this.updateInterpretation(reading);

        // 更新行动建议
        this.updateActions(reading);

        // Update Warnings
        this.updateWarnings(reading);

        // 动画效果
        anime({
            targets: '#resultsSection',
            opacity: [0, 1],
            translateY: [30, 0],
            duration: 800,
            easing: 'easeOutQuart'
        });
    }

    /**
     * 更新卦象显示
     */
    updateHexagramDisplay(reading) {
        const hexagramTitle = document.getElementById('hexagramTitle');
        const hexagramDescription = document.getElementById('hexagramDescription');

        const label = window.i18n ? window.i18n.t('iching.hexagram.label') : 'Hexagram';
        if (hexagramTitle) {
            hexagramTitle.textContent = `${label} ${reading.hexagramNumber}: ${reading.hexagramName}`;
        }

        if (hexagramDescription) {
            hexagramDescription.textContent = reading.judgment || '';
        }

        // Limit updates to text content only, do not overwrite the visual container
        // Visual changing lines are handled by iching.html's displayFinalResults

    }

    /**
     * 更新解讀內容
     */
    updateInterpretation(reading) {
        const formatter = window.MarkdownFormatter || { parse: (t) => t };
        const judgmentText = document.getElementById('judgmentText');
        const imageText = document.getElementById('imageText');
        const adviceText = document.getElementById('adviceText');

        if (judgmentText) {
            judgmentText.innerHTML = formatter.parse(reading.judgment || '');
        }

        if (imageText) {
            imageText.innerHTML = formatter.parse(reading.image || '');
        }

        if (adviceText) {
            adviceText.innerHTML = formatter.parse(reading.advice || '');
        }

        // Update Changing Lines Interpretation
        const changingLinesText = document.getElementById('changingLinesText');
        const changingLinesCard = document.getElementById('changingLinesCard');

        if (changingLinesText && changingLinesCard) {
            if (reading.changingLinesInterpretation) {
                changingLinesText.innerHTML = formatter.parse(reading.changingLinesInterpretation);
                changingLinesCard.classList.remove('hidden');
            } else {
                changingLinesCard.classList.add('hidden');
            }
        }

        // Update Future Hexagram
        const futureHexagramText = document.getElementById('futureHexagramText');
        const futureHexagramCard = document.getElementById('futureHexagramCard');

        if (futureHexagramText && futureHexagramCard) {
            if (reading.futureHexagram) {
                futureHexagramText.innerHTML = formatter.parse(reading.futureHexagram);
                futureHexagramCard.classList.remove('hidden');
            } else {
                futureHexagramCard.classList.add('hidden');
            }
        }
    }

    /**
     * 更新行动建议
     */
    updateActions(reading) {
        const actionsContainer = document.getElementById('actionsContainer');
        if (!actionsContainer || !reading.actions) return;

        actionsContainer.innerHTML = '';

        // 分成两列
        const half = Math.ceil(reading.actions.length / 2);
        const leftActions = reading.actions.slice(0, half);
        const rightActions = reading.actions.slice(half);

        const createActionsList = (actions, startIndex) => {
            return actions.map((action, index) => `
                <div class="flex items-start space-x-3">
                    <div class="w-6 h-6 bg-mystic-gold rounded-full flex items-center justify-center text-deep-navy font-bold text-sm">
                        ${startIndex + index + 1}
                    </div>
                    <span class="text-moon-silver">${action}</span>
                </div>
            `).join('');
        };

        actionsContainer.innerHTML = `
            <div class="space-y-3">${createActionsList(leftActions, 0)}</div>
            <div class="space-y-3">${createActionsList(rightActions, half)}</div>
        `;
    }

    updateWarnings(reading) {
        const warningsSection = document.getElementById('warningsSection');
        const warningsList = document.getElementById('warningsList');

        if (!warningsSection || !warningsList) return;

        if (reading.warnings && reading.warnings.length > 0) {
            warningsList.innerHTML = reading.warnings.map(warning => `
                <li class="flex items-start space-x-3">
                    <span class="text-red-400 mt-1">⚠️</span>
                    <span>${warning}</span>
                </li>
            `).join('');
            warningsSection.classList.remove('hidden');
        } else {
            warningsSection.classList.add('hidden');
        }
    }

    /**
     * 生成随机卦象（用于快速占卜）
     */
    generateRandomHexagram() {
        const lines = [];
        const changingLines = [];

        for (let i = 0; i < 6; i++) {
            const value = Math.floor(Math.random() * 4) + 6; // 6-9
            const isChanging = value === 6 || value === 9;

            lines.push({
                type: (value === 7 || value === 9) ? 'solid' : 'broken',
                changing: isChanging,
                value: value
            });

            if (isChanging) {
                changingLines.push(i + 1);
            }
        }

        return { lines, changingLines };
    }

    /**
     * 保存占卜记录
     */
    saveReading() {
        if (!this.currentReading) return;

        const readings = JSON.parse(localStorage.getItem('ichingReadings') || '[]');
        readings.push({
            ...this.currentReading,
            timestamp: new Date().toISOString()
        });

        localStorage.setItem('ichingReadings', JSON.stringify(readings));
    }

    /**
     * 获取历史占卜记录
     */
    getReadingHistory() {
        return JSON.parse(localStorage.getItem('ichingReadings') || '[]');
    }
}

// 浏览器环境：暴露为全局变量
if (typeof window !== 'undefined') {
    window.IChingAI = IChingAI;
    // 创建全局实例
    window.ichingAI = new IChingAI();
}

// Node.js 环境：使用 module.exports
if (typeof module !== 'undefined' && module.exports) {
    module.exports = IChingAI;
}
