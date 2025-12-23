// 易经页面修复脚本
console.log('🔧 加载易经页面修复...');

(function () {
    'use strict';

    // 1. 修复开始占卜按钮，添加支付权限检查
    function patchStartDivinationButton() {
        // 等待DOM加载完成
        const checkButton = () => {
            const startBtn = document.getElementById('startDivination');
            if (startBtn) {
                console.log('✅ 找到开始起卦按钮，添加权限检查...');

                // 重写点击事件
                const newClickHandler = function (e) {
                    const question = document.getElementById('questionInput')?.value.trim();
                    if (!question) {
                        alert(window.i18n?.t('iching.question.required') || '请输入您的问题');
                        return;
                    }

                    // 检查用户权限
                    if (window.subscriptionManager) {
                        const access = window.subscriptionManager.canUseService('iching');

                        if (!access.allowed) {
                            console.log('检测到权限受限，显示升级提示');
                            window.subscriptionManager.showUpgradePrompt('AI易经解读', 'iching');
                            return;
                        }

                        if (window.subscriptionManager.isMockDataOnly()) {
                            console.log('检测到当前处于模拟数据模式');
                        }

                        console.log('✅ 用户有权限使用易经功能，权限类型:', access.type);

                        // 扣除使用次数（如果是单次付费）
                        if (access.type === 'singleUse') {
                            window.subscriptionManager.consumeSingleUse('iching');
                        }
                    }

                    // 设置当前问题
                    window.currentQuestion = question;

                    // 显示投币界面
                    const questionSection = document.getElementById('questionSection') || document.getElementById('methodSection');
                    const coinSection = document.getElementById('coinSection');

                    if (questionSection && coinSection) {
                        questionSection.classList.add('hidden');
                        coinSection.classList.remove('hidden');
                    }
                };

                // 清除所有现有事件监听器
                startBtn.onclick = null;
                const newBtn = startBtn.cloneNode(true);
                startBtn.parentNode.replaceChild(newBtn, startBtn);

                // 添加新的事件监听器
                newBtn.addEventListener('click', newClickHandler);

                console.log('✅ 开始起卦按钮权限检查已添加');
            } else {
                // 如果按钮还没加载，继续检查
                setTimeout(checkButton, 100);
            }
        };

        checkButton();
    }

    // 2. 修复深挖真相追问功能
    function patchFollowupFunction() {
        // 重新定义全局追问处理函数
        window.handleFollowupQuestion = async function () {
            console.log('🤖 开始处理易经追问...');

            // 检查是否有占卜结果 - 增强兼容性
            const result = window.currentIChing || window.ichingResult;
            if (!result || !result.hexagramNumber) {
                alert('请先进行易经占卜再提问');
                return;
            }

            // 确保同步
            window.currentIChing = result;

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
                alert('请输入您的追问');
                return;
            }

            // 检查用户权限
            if (window.subscriptionManager) {
                const access = window.subscriptionManager.canUseService('iching');

                if (!access.allowed || window.subscriptionManager.isMockDataOnly()) {
                    console.log('需要升级或按次付费才能使用AI追问功能');
                    if (!access.allowed) {
                        window.subscriptionManager.showUpgradePrompt('AI易经追问', 'iching');
                        return;
                    }
                    // 如果是 isMockDataOnly()，此处可以抛出提示或引导
                }

                // 扣除使用次数（如果是单次付费）
                if (access.type === 'singleUse') {
                    window.subscriptionManager.consumeSingleUse('iching');
                }
            }

            try {
                // 显示加载状态
                if (askButton) askButton.disabled = true;
                if (loadingDiv) loadingDiv.classList.remove('hidden');
                if (answerDiv) answerDiv.classList.add('hidden');

                // 构建系统提示词
                // 构建精简高效的系统提示词
                const systemPrompt = `你是一位严谨且智慧的易经大师。请基于用户的占卜结果提供深度解读和行动建议。
                
占卜结果参考：
- 卦象：第${window.currentIChing.hexagramNumber}卦 ${window.currentIChing.hexagram.name}
- 卦义：${window.currentIChing.hexagram.meaning}
- 整体分析：${window.currentIChing.analysis}

要求：
1. 结合卦象直接回答用户的问题。
2. 提供 2-3 条具体、可落地的行动建议。
3. 保持专业、温和的语调。
4. 字数控制在 300 字以内。`;

                const userPrompt = `追问问题：${question}`;

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
                }

                // 清空输入框
                followupInput.value = '';

                console.log('✅ 易经追问处理完成');

            } catch (error) {
                console.error('❌ 易经追问失败:', error);

                let errorMessage = 'AI解答失败，请稍后重试';
                if (error.message.includes('AI服务未初始化')) {
                    errorMessage = 'AI服务初始化失败，请刷新页面重试';
                } else if (error.message.includes('请先进行易经占卜')) {
                    errorMessage = '请先进行易经占卜后再提问';
                }

                alert(errorMessage);
            } finally {
                // 恢复按钮状态
                if (askButton) askButton.disabled = false;
                if (loadingDiv) loadingDiv.classList.add('hidden');
            }
        };

        // 绑定追问按钮事件
        const bindFollowupButton = () => {
            const askButton = document.getElementById('askFollowup');
            if (askButton) {
                askButton.onclick = window.handleFollowupQuestion;
                console.log('✅ 追问按钮事件已重新绑定');

                // 支持回车键提交
                const followupInput = document.getElementById('followupInput');
                if (followupInput) {
                    followupInput.addEventListener('keydown', (e) => {
                        if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                            window.handleFollowupQuestion();
                        }
                    });
                    console.log('✅ 追问输入框键盘事件已绑定');
                }
            } else {
                // 如果按钮还没加载，继续等待
                setTimeout(bindFollowupButton, 100);
            }
        };

        bindFollowupButton();
    }

    // 初始化修复
    function init() {
        patchStartDivinationButton();
        patchFollowupFunction();
        console.log('✅ 易经页面修复初始化完成！');
    }

    // 等待DOM加载完成
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();