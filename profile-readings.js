/**
 * 个人档案 - 历史记录管理
 * Profile Readings History Management
 */

(function() {
    'use strict';

    class ReadingsHistory {
        constructor() {
            this.readings = [];
            this.currentPage = 1;
            this.pageSize = 10;
            this.init();
        }

        async init() {
            console.log('初始化历史记录管理');
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
                        console.log(`✅ 从数据库加载了 ${this.readings.length} 条记录`);
                        this.renderReadings();
                        return;
                    }
                }

                // 回退到localStorage
                console.log('⚠️ 从localStorage加载记录');
                const savedReadings = JSON.parse(localStorage.getItem('destinyReadings') || '[]');
                this.readings = savedReadings.slice(-this.pageSize); // 最近的记录
                this.renderReadings();

            } catch (error) {
                console.error('加载历史记录失败:', error);
                this.showError('加载历史记录失败');
            }
        }

        /**
         * 渲染历史记录
         */
        renderReadings() {
            const container = document.getElementById('readingsHistoryContainer');
            if (!container) {
                console.warn('找不到历史记录容器');
                return;
            }

            if (this.readings.length === 0) {
                container.innerHTML = `
                    <div class="empty-state">
                        <div class="text-6xl mb-4">🔮</div>
                        <h3 class="text-xl font-semibold mb-2">暂无占卜记录</h3>
                        <p class="text-moon-silver mb-4">开始你的第一次占卜吧！</p>
                        <a href="divination.html" class="inline-block bg-mystic-gold text-deep-navy px-6 py-3 rounded-lg font-semibold hover:bg-yellow-400 transition-colors">
                            开始占卜
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

            return `
                <div class="reading-card bg-white/10 rounded-xl p-6 hover:bg-white/15 transition-all cursor-pointer" 
                     data-reading-id="${reading.id || ''}">
                    <div class="flex items-start justify-between mb-4">
                        <div class="flex items-center space-x-3">
                            <div class="text-3xl">${typeIcon}</div>
                            <div>
                                <h3 class="text-lg font-semibold text-mystic-gold">${typeName}</h3>
                                <p class="text-sm text-moon-silver">${date.toLocaleString('zh-CN')}</p>
                            </div>
                        </div>
                        <div class="flex space-x-2">
                            <button onclick="readingsHistory.viewReading('${reading.id || ''}')" 
                                    class="text-mystic-gold hover:text-yellow-400 transition-colors"
                                    title="查看详情">
                                <i class="fas fa-eye"></i>
                            </button>
                            ${reading.id ? `
                                <button onclick="readingsHistory.deleteReading('${reading.id}')" 
                                        class="text-red-400 hover:text-red-300 transition-colors"
                                        title="删除">
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

            // 显示输入信息
            if (inputData.birthDate) {
                summary += `<p class="text-sm text-moon-silver">📅 出生日期: ${inputData.birthDate}</p>`;
            }

            if (inputData.categories && inputData.categories.length > 0) {
                const categories = inputData.categories.map(c => this.getCategoryName(c)).join('、');
                summary += `<p class="text-sm text-moon-silver">🎯 类别: ${categories}</p>`;
            }

            // 显示结果摘要
            if (resultData.personality && resultData.personality.length > 0) {
                summary += `<p class="text-sm text-warm-white mt-2">💫 ${resultData.personality[0]}</p>`;
            }

            return summary || '<p class="text-sm text-moon-silver">点击查看详情</p>';
        }

        /**
         * 查看记录详情
         */
        async viewReading(readingId) {
            if (!readingId) {
                alert('无法查看此记录');
                return;
            }

            try {
                // 从Supabase获取完整记录
                if (window.DatabaseService) {
                    // 这里可以实现详情页面或模态框
                    console.log('查看记录:', readingId);
                    alert('查看记录功能开发中...');
                }
            } catch (error) {
                console.error('查看记录失败:', error);
                alert('查看记录失败');
            }
        }

        /**
         * 删除记录
         */
        async deleteReading(readingId) {
            if (!confirm('确定要删除这条记录吗？')) {
                return;
            }

            try {
                if (window.DatabaseService && readingId) {
                    // 从Supabase删除
                    const result = await DatabaseService.deleteReading(readingId);
                    
                    if (result.success) {
                        console.log('✅ 记录已删除');
                        await this.loadReadings(); // 重新加载
                        this.showSuccess('记录已删除');
                    }
                }
            } catch (error) {
                console.error('删除记录失败:', error);
                this.showError('删除记录失败');
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
            const names = {
                'divination': '命运占卜',
                'fengshui': '风水分析',
                'iching': '易经卦象'
            };
            return names[type] || '未知类型';
        }

        /**
         * 获取类别名称
         */
        getCategoryName(category) {
            const names = {
                'career': '事业',
                'wealth': '财运',
                'love': '爱情',
                'health': '健康'
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
