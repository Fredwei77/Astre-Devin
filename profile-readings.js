/**
 * 个人档案 - 历史记录管理
 * Profile Readings History Management
 */

(function () {
    'use strict';

    class ReadingsHistory {
        constructor() {
            this.readings = [];
            this.currentPage = 1;
            this.pageSize = 10;
            this.init();
        }

        async init() {
            console.log('Initializing Readings History Management');
            await this.loadReadings();
            this.setupEventListeners();
        }

        /**
         * 加载历史记录
         */
        async loadReadings() {
            try {
                // 优先从Supabase加载
                if (window.DatabaseService) {
                    const result = await DatabaseService.getUserReadings(this.pageSize, (this.currentPage - 1) * this.pageSize);

                    if (result.success) {
                        this.readings = result.data;
                        console.log(`✅ Loaded ${this.readings.length} records from database`);
                        this.renderReadings();
                        return;
                    }
                }

                // 回退到localStorage
                console.log('⚠️ Loading records from localStorage');
                const savedReadings = JSON.parse(localStorage.getItem('destinyReadings') || '[]');
                this.readings = savedReadings.slice(-this.pageSize); // 最近的记录
                this.renderReadings();

            } catch (error) {
                console.error('Failed to load readings history:', error);
                this.showError(window.i18n ? i18n.t('profile.history.loadFailed') : 'Failed to load reading history');
            }
        }

        /**
         * 渲染历史记录
         */
        renderReadings() {
            const container = document.getElementById('readingsHistoryContainer');
            if (!container) {
                console.warn('History container not found');
                return;
            }

            if (this.readings.length === 0) {
                const emptyTitle = window.i18n ? i18n.t('profile.history.empty') : 'No Reading History';
                const emptyDesc = window.i18n ? i18n.t('profile.history.emptyDesc') : 'Start your first divination now!';
                const startBtnText = window.i18n ? i18n.t('profile.history.startBtn') : 'Start Divination';

                container.innerHTML = `
                    <div class="empty-state">
                        <div class="text-6xl mb-4">🔮</div>
                        <h3 class="text-xl font-semibold mb-2">${emptyTitle}</h3>
                        <p class="text-moon-silver mb-4">${emptyDesc}</p>
                        <a href="divination.html" class="inline-block bg-mystic-gold text-deep-navy px-6 py-3 rounded-lg font-semibold hover:bg-yellow-400 transition-colors">
                            ${startBtnText}
                        </a>
                    </div>
                `;
                return;
            }

            const html = this.readings.map(reading => this.renderReadingCard(reading)).join('');
            container.innerHTML = html;
        }

        /**
         * 渲染单个记录卡片
         */
        renderReadingCard(reading) {
            const date = new Date(reading.created_at || reading.timestamp);
            const typeIcon = this.getTypeIcon(reading.type);
            const typeName = this.getTypeName(reading.type);
            const locale = (window.i18n && i18n.currentLang === 'en') ? 'en-US' : 'zh-CN';

            const viewDetailText = window.i18n ? i18n.t('profile.history.viewDetail') : 'View Details';
            const deleteText = window.i18n ? i18n.t('profile.history.delete') : 'Delete';

            return `
                <div class="reading-card bg-white/10 rounded-xl p-6 hover:bg-white/15 transition-all cursor-pointer" 
                     data-reading-id="${reading.id || ''}">
                    <div class="flex items-start justify-between mb-4">
                        <div class="flex items-center space-x-3">
                            <div class="text-3xl">${typeIcon}</div>
                            <div>
                                <h3 class="text-lg font-semibold text-mystic-gold">${typeName}</h3>
                                <p class="text-sm text-moon-silver">${date.toLocaleString(locale)}</p>
                            </div>
                        </div>
                        <div class="flex space-x-2">
                            <button onclick="readingsHistory.viewReading('${reading.id || ''}')" 
                                    class="text-mystic-gold hover:text-yellow-400 transition-colors"
                                    title="${viewDetailText}">
                                <i class="fas fa-eye"></i>
                            </button>
                            ${reading.id ? `
                                <button onclick="readingsHistory.deleteReading('${reading.id}')" 
                                        class="text-red-400 hover:text-red-300 transition-colors"
                                        title="${deleteText}">
                                    <i class="fas fa-trash"></i>
                                </button>
                            ` : ''}
                        </div>
                    </div>
                    
                    <div class="space-y-2">
                        ${this.renderReadingSummary(reading)}
                    </div>
                </div>
            `;
        }

        /**
         * 渲染记录摘要
         */
        renderReadingSummary(reading) {
            const inputData = reading.input_data || {};
            const resultData = reading.result_data || reading.results || {};

            let summary = '';

            const birthDateText = window.i18n ? i18n.t('profile.history.birthDate') : 'Birth Date';
            const categoryText = window.i18n ? i18n.t('profile.history.category') : 'Category';
            const clickDetailText = window.i18n ? i18n.t('profile.history.clickDetail') : 'Click to view details';

            // 显示输入信息
            if (inputData.birthDate) {
                summary += `<p class="text-sm text-moon-silver">📅 ${birthDateText}: ${inputData.birthDate}</p>`;
            }

            if (inputData.categories && inputData.categories.length > 0) {
                const categories = inputData.categories.map(c => this.getCategoryName(c)).join('、');
                summary += `<p class="text-sm text-moon-silver">🎯 ${categoryText}: ${categories}</p>`;
            }

            // 显示结果摘要
            if (resultData.personality && resultData.personality.length > 0) {
                summary += `<p class="text-sm text-warm-white mt-2">💫 ${resultData.personality[0]}</p>`;
            }

            return summary || `<p class="text-sm text-moon-silver">${clickDetailText}</p>`;
        }

        /**
         * 查看记录详情
         */
        async viewReading(readingId) {
            if (!readingId) {
                const msg = (window.i18n && i18n.currentLang === 'zh-CN') ? '无法查看此记录' : 'Unable to view this record';
                alert(msg);
                return;
            }

            try {
                // 从Supabase获取完整记录
                if (window.DatabaseService) {
                    // 这里可以实现详情页面或模态框
                    console.log('Viewing record:', readingId);
                    const msg = (window.i18n && i18n.currentLang === 'zh-CN') ? '查看记录功能开发中...' : 'View details feature coming soon...';
                    alert(msg);
                }
            } catch (error) {
                console.error('Failed to view record:', error);
                const msg = (window.i18n && i18n.currentLang === 'zh-CN') ? '查看记录失败' : 'Failed to view record';
                alert(msg);
            }
        }

        /**
         * 删除记录
         */
        async deleteReading(readingId) {
            const confirmMsg = window.i18n ? i18n.t('profile.history.deleteConfirm') : 'Are you sure you want to delete this record?';
            if (!confirm(confirmMsg)) {
                return;
            }

            try {
                if (window.DatabaseService && readingId) {
                    // 从Supabase删除
                    const result = await DatabaseService.deleteReading(readingId);

                    if (result.success) {
                        console.log('✅ Record deleted');
                        await this.loadReadings(); // 重新加载
                        this.showSuccess(window.i18n ? i18n.t('profile.history.deleteSuccess') : 'Record deleted successfully');
                    }
                }
            } catch (error) {
                console.error('Failed to delete record:', error);
                const msg = (window.i18n && i18n.currentLang === 'zh-CN') ? '删除记录失败' : 'Failed to delete record';
                this.showError(msg);
            }
        }

        /**
         * 获取类型图标
         */
        getTypeIcon(type) {
            const icons = {
                'divination': '🔮',
                'fengshui': '🏠',
                'iching': '☯️'
            };
            return icons[type] || '📝';
        }

        /**
         * 获取类型名称
         */
        getTypeName(type) {
            if (window.i18n) {
                const key = `profile.type.${type}`;
                const translated = i18n.t(key);
                if (translated !== key) return translated;
            }

            const names = {
                'divination': 'Destiny Divination',
                'fengshui': 'Feng Shui Analysis',
                'iching': 'I-Ching Hexagram'
            };
            return names[type] || 'Unknown Type';
        }

        /**
         * 获取类别名称
         */
        getCategoryName(category) {
            if (window.i18n) {
                const key = `divination.category.${category}`;
                const translated = i18n.t(key);
                if (translated !== key) return translated;
            }

            const names = {
                'career': 'Career',
                'wealth': 'Wealth',
                'love': 'Love',
                'health': 'Health'
            };
            return names[category] || category;
        }

        /**
         * 设置事件监听
         */
        setupEventListeners() {
            // 刷新按钮
            const refreshBtn = document.getElementById('refreshReadings');
            if (refreshBtn) {
                refreshBtn.addEventListener('click', () => this.loadReadings());
            }

            // 分页按钮
            const prevBtn = document.getElementById('prevPage');
            const nextBtn = document.getElementById('nextPage');

            if (prevBtn) {
                prevBtn.addEventListener('click', () => this.previousPage());
            }

            if (nextBtn) {
                nextBtn.addEventListener('click', () => this.nextPage());
            }
        }

        /**
         * 上一页
         */
        async previousPage() {
            if (this.currentPage > 1) {
                this.currentPage--;
                await this.loadReadings();
            }
        }

        /**
         * 下一页
         */
        async nextPage() {
            this.currentPage++;
            await this.loadReadings();
        }

        /**
         * 显示成功消息
         */
        showSuccess(message) {
            // 可以使用现有的通知系统
            if (typeof showNotification === 'function') {
                showNotification(message, 'success');
            } else {
                alert(message);
            }
        }

        /**
         * 显示错误消息
         */
        showError(message) {
            if (typeof showNotification === 'function') {
                showNotification(message, 'error');
            } else {
                alert(message);
            }
        }
    }

    // 页面加载时初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            window.readingsHistory = new ReadingsHistory();
        });
    } else {
        window.readingsHistory = new ReadingsHistory();
    }

})();
