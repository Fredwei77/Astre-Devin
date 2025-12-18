/**
 * 年度运势动态年份增强模块
 * Dynamic Year Enhancement for Annual Fortune Module
 */

(function() {
    'use strict';

    /**
     * 获取当前年份和下一年份
     */
    function getCurrentYearInfo() {
        const currentYear = new Date().getFullYear();
        const nextYear = currentYear + 1;
        
        // 获取下一年的天干地支
        const nextYearGanZhi = getYearGanZhi(nextYear);
        
        return {
            current: currentYear,
            next: nextYear,
            nextYearGanZhi: nextYearGanZhi
        };
    }
    
    /**
     * 计算年份的天干地支
     */
    function getYearGanZhi(year) {
        const gan = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
        const zhi = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
        const zhiAnimals = ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪'];
        
        // 以1984年甲子年为基准计算
        const baseYear = 1984;
        const diff = year - baseYear;
        
        const ganIndex = diff % 10;
        const zhiIndex = diff % 12;
        
        return {
            gan: gan[ganIndex],
            zhi: zhi[zhiIndex],
            animal: zhiAnimals[zhiIndex],
            ganZhi: gan[ganIndex] + zhi[zhiIndex]
        };
    }
    
    /**
     * 增强占卜分析的年度运势提示词
     */
    function enhanceDivinationPrompts() {
        const yearInfo = getCurrentYearInfo();
        
        // 增强CONFIG中的提示词
        if (window.CONFIG && window.CONFIG.PROMPTS && window.CONFIG.PROMPTS.DIVINATION) {
            const originalSystemPrompt = window.CONFIG.PROMPTS.DIVINATION.FOLLOWUP_SYSTEM;
            
            window.CONFIG.PROMPTS.DIVINATION.FOLLOWUP_SYSTEM = function(lang) {
                let basePrompt = '';
                if (typeof originalSystemPrompt === 'function') {
                    basePrompt = originalSystemPrompt(lang);
                } else {
                    basePrompt = originalSystemPrompt || '';
                }
                
                const isEnglish = lang === 'en';
                
                const yearEnhancement = isEnglish ? 
                    `\n\nIMPORTANT: When providing annual fortune analysis, please use ${yearInfo.current} for current year and ${yearInfo.next} (${yearInfo.nextYearGanZhi.ganZhi} Year of the ${yearInfo.nextYearGanZhi.animal}) for next year predictions. Avoid using any fixed year numbers.` :
                    `\n\n重要提醒：在进行年度运势分析时，请使用${yearInfo.current}年作为当前年份，${yearInfo.next}年（${yearInfo.nextYearGanZhi.ganZhi}${yearInfo.nextYearGanZhi.animal}年）作为下一年的预测。避免使用任何固定的年份数字。`;
                
                return basePrompt + yearEnhancement;
            };
        }
        
        console.log(`✅ 年度运势已更新为动态年份: ${yearInfo.current}年 -> ${yearInfo.next}年${yearInfo.nextYearGanZhi.ganZhi}`);
    }
    
    /**
     * 替换静态文本中的年份
     */
    function updateStaticYearReferences() {
        const yearInfo = getCurrentYearInfo();
        
        // 更新页面中的静态文本
        document.addEventListener('DOMContentLoaded', () => {
            // 查找并替换包含年份的文本节点
            const textNodes = getTextNodes(document.body);
            
            textNodes.forEach(node => {
                if (node.textContent.includes('2024年') || node.textContent.includes('2025年') || node.textContent.includes('2026年')) {
                    // 替换为当前年份
                    node.textContent = node.textContent
                        .replace(/202[4-9]年/g, `${yearInfo.current}年`)
                        .replace(/202[4-9] /g, `${yearInfo.current} `);
                }
            });
        });
    }
    
    /**
     * 获取所有文本节点
     */
    function getTextNodes(element) {
        const textNodes = [];
        const walker = document.createTreeWalker(
            element,
            NodeFilter.SHOW_TEXT,
            null,
            false
        );
        
        let node;
        while (node = walker.nextNode()) {
            if (node.textContent.trim()) {
                textNodes.push(node);
            }
        }
        
        return textNodes;
    }
    
    /**
     * 为AI服务添加年份上下文
     */
    function enhanceAIServiceWithYearContext() {
        if (window.aiService && window.aiService.chat) {
            const originalChat = window.aiService.chat.bind(window.aiService);
            const yearInfo = getCurrentYearInfo();
            
            window.aiService.chat = function(prompt) {
                // 在提示词中添加当前年份上下文
                const yearContext = `\n[当前年份: ${yearInfo.current}年，下一年: ${yearInfo.next}年${yearInfo.nextYearGanZhi.ganZhi}]`;
                const enhancedPrompt = prompt + yearContext;
                
                return originalChat(enhancedPrompt);
            };
        }
    }
    
    /**
     * 初始化年份增强功能
     */
    function init() {
        enhanceDivinationPrompts();
        updateStaticYearReferences();
        enhanceAIServiceWithYearContext();
        
        console.log('🗓️ 年度运势动态年份增强模块已初始化');
    }
    
    // 导出到全局
    window.YearEnhancement = {
        init: init,
        getCurrentYearInfo: getCurrentYearInfo,
        getYearGanZhi: getYearGanZhi
    };
    
    // 自动初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
})();