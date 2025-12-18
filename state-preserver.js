/**
 * State Preserver - 页面状态保存与恢复工具
 * 用于解决支付跳转后输入数据丢失的问题
 */

class StatePreserver {
    constructor() {
        this.storageKey = 'saved_page_state';
    }

    /**
     * 保存当前页面的所有输入状态
     */
    saveCurrentPage() {
        const path = window.location.pathname.split('/').pop() || 'index.html';
        const state = {
            path: path,
            timestamp: Date.now(),
            data: {}
        };

        // 1. 保存所有标准表单元素
        const inputs = document.querySelectorAll('input:not([type="file"]):not([type="password"]), select, textarea');
        inputs.forEach(input => {
            if (input.id) {
                state.data[input.id] = input.value;
            }
        });

        // 2. 特殊逻辑：保存 Divination 的分类选择
        if (path === 'divination.html') {
            const selectedCategories = [];
            document.querySelectorAll('.category-card.selected').forEach(card => {
                if (card.dataset.category) {
                    selectedCategories.push(card.dataset.category);
                }
            });
            state.data['_selectedCategories'] = selectedCategories;
        }

        // 3. 特殊逻辑：保存 I-Ching 的问题
        if (path === 'iching.html') {
            const questionInput = document.getElementById('questionInput');
            if (questionInput) {
                state.data['questionInput'] = questionInput.value;
            }
        }

        localStorage.setItem(this.storageKey, JSON.stringify(state));
        console.log(`[StatePreserver] 状态已保存: ${path}`);
    }

    /**
     * 恢复当前页面的状态
     */
    restoreCurrentPage() {
        const savedStr = localStorage.getItem(this.storageKey);
        if (!savedStr) return;

        try {
            const state = JSON.parse(savedStr);
            const currentPath = window.location.pathname.split('/').pop() || 'index.html';

            // 检查路径是否匹配且未过期（30分钟内）
            if (state.path !== currentPath || (Date.now() - state.timestamp > 30 * 60 * 1000)) {
                return;
            }

            console.log(`[StatePreserver] 正在恢复状态: ${currentPath}`);

            // 1. 恢复标准表单元素
            Object.keys(state.data).forEach(id => {
                if (id.startsWith('_')) return; // 跳过私有/特殊数据

                const element = document.getElementById(id);
                if (element) {
                    element.value = state.data[id];
                    // 触发 input 事件以确保关联逻辑（如验证）执行
                    element.dispatchEvent(new Event('input', { bubbles: true }));
                    element.dispatchEvent(new Event('change', { bubbles: true }));
                }
            });

            // 2. 特殊逻辑恢复：Divination 分类
            if (currentPath === 'divination.html' && state.data['_selectedCategories']) {
                const selected = state.data['_selectedCategories'];
                // 模拟点击卡片以同步内部变量（如果 main.js 的 DestinyAI 实例已初始化）
                setTimeout(() => {
                    selected.forEach(cat => {
                        const card = document.querySelector(`.category-card[data-category="${cat}"]`);
                        if (card && !card.classList.contains('selected')) {
                            card.click();
                        }
                    });
                }, 100);
            }

            // 清理已恢复的状态
            localStorage.removeItem(this.storageKey);

        } catch (e) {
            console.error('[StatePreserver] 恢复状态失败:', e);
        }
    }
}

// 暴露全局实例
window.statePreserver = new StatePreserver();

// 页面加载时自动还原
window.addEventListener('load', () => {
    window.statePreserver.restoreCurrentPage();
});
