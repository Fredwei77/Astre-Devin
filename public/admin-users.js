/**
 * 用户管理后台
 * Admin Users Management
 */

(function() {
    'use strict';

    class AdminUsers {
        constructor() {
            this.users = [];
            this.payments = [];
            this.orders = [];
            this.readings = [];
            this.currentTab = 'users';
            this.init();
        }

        async init() {
            await this.loadStats();
            await this.loadUsers();
            this.setupEventListeners();
        }

        /**
         * 加载统计数据
         */
        async loadStats() {
            try {
                const client = window.supabaseClient;
                if (!client) {
                    console.log('Supabase未初始化');
                    return;
                }

                // 总用户数
                const { count: userCount } = await client
                    .from('profiles')
                    .select('*', { count: 'exact', head: true });

                document.getElementById('totalUsers').textContent = userCount || 0;

                // 付费用户数
                const { count: paidCount } = await client
                    .from('profiles')
                    .select('*', { count: 'exact', head: true })
                    .eq('subscription_status', 'active');

                document.getElementById('paidUsers').textContent = paidCount || 0;

                // 总订单数
                const { count: orderCount } = await client
                    .from('orders')
                    .select('*', { count: 'exact', head: true });

                document.getElementById('totalOrders').textContent = orderCount || 0;

                // 总收入
                const { data: orders } = await client
                    .from('orders')
                    .select('total_amount')
                    .eq('status', 'paid');

                const totalRevenue = orders?.reduce((sum, order) => sum + parseFloat(order.total_amount || 0), 0) || 0;
                document.getElementById('totalRevenue').textContent = `$${totalRevenue.toFixed(2)}`;

            } catch (error) {
                console.error('加载统计数据失败:', error);
            }
        }

        /**
         * 加载用户列表
         */
        async loadUsers() {
            try {
                const client = window.supabaseClient;
                if (!client) {
                    this.renderNoData('usersList', '请配置 Supabase 数据库');
                    return;
                }

                const { data, error } = await client
                    .from('profiles')
                    .select('*')
                    .order('created_at', { ascending: false });

                if (error) throw error;

                this.users = data || [];
                this.renderUsers();

            } catch (error) {
                console.error('加载用户失败:', error);
                this.renderNoData('usersList', '加载失败: ' + error.message);
            }
        }

        /**
         * 渲染用户列表
         */
        renderUsers() {
            const container = document.getElementById('usersList');
            if (!container) return;

            if (this.users.length === 0) {
                this.renderNoData('usersList', '暂无用户数据');
                return;
            }

            container.innerHTML = this.users.map(user => `
                <div class="bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-all">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center gap-4 flex-1">
                            <div class="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-purple-500 flex items-center justify-center">
                                <i class="fas fa-user text-white"></i>
                            </div>
                            <div class="flex-1">
                                <div class="flex items-center gap-2">
                                    <h3 class="font-bold">${user.full_name || user.email || '未命名用户'}</h3>
                                    ${user.subscription_status === 'active' ? `
                                        <span class="px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs rounded-full">
                                            <i class="fas fa-crown mr-1"></i>VIP
                                        </span>
                                    ` : ''}
                                </div>
                                <p class="text-sm text-gray-400">${user.email || '无邮箱'}</p>
                                <div class="flex gap-4 mt-1 text-xs text-gray-500">
                                    <span><i class="fas fa-calendar mr-1"></i>注册: ${new Date(user.created_at).toLocaleDateString('zh-CN')}</span>
                                    ${user.last_sign_in_at ? `
                                        <span><i class="fas fa-clock mr-1"></i>最后登录: ${new Date(user.last_sign_in_at).toLocaleDateString('zh-CN')}</span>
                                    ` : ''}
                                </div>
                            </div>
                        </div>
                        <div class="flex gap-2">
                            <button onclick="adminUsers.viewUserDetail('${user.id}')" 
                                    class="bg-blue-500 px-4 py-2 rounded hover:bg-blue-600">
                                <i class="fas fa-eye"></i> 查看
                            </button>
                            <button onclick="adminUsers.editUser('${user.id}')" 
                                    class="bg-green-500 px-4 py-2 rounded hover:bg-green-600">
                                <i class="fas fa-edit"></i> 编辑
                            </button>
                        </div>
                    </div>
                </div>
            `).join('');
        }

        /**
         * 查看用户详情
         */
        async viewUserDetail(userId) {
            try {
                const client = window.supabaseClient;
                
                // 获取用户信息
                const { data: user } = await client
                    .from('profiles')
                    .select('*')
                    .eq('id', userId)
                    .single();

                // 获取用户订单
                const { data: orders } = await client
                    .from('orders')
                    .select('*')
                    .eq('user_id', userId)
                    .order('created_at', { ascending: false });

                // 获取用户占卜记录
                const { data: readings } = await client
                    .from('readings')
                    .select('*')
                    .eq('user_id', userId)
                    .order('created_at', { ascending: false })
                    .limit(10);

                this.showUserDetailModal(user, orders || [], readings || []);

            } catch (error) {
                console.error('获取用户详情失败:', error);
                alert('获取用户详情失败');
            }
        }

        /**
         * 显示用户详情模态框
         */
        showUserDetailModal(user, orders, readings) {
            const modal = document.getElementById('userDetailModal');
            const content = document.getElementById('userDetailContent');

            const totalSpent = orders.reduce((sum, order) => sum + parseFloat(order.total_amount || 0), 0);

            content.innerHTML = `
                <!-- 用户基本信息 -->
                <div class="bg-white/10 rounded-lg p-6 mb-6">
                    <h3 class="text-lg font-bold mb-4 text-yellow-400">基本信息</h3>
                    <div class="grid md:grid-cols-2 gap-4">
                        <div>
                            <p class="text-sm text-gray-400">用户ID</p>
                            <p class="font-mono text-sm">${user.id}</p>
                        </div>
                        <div>
                            <p class="text-sm text-gray-400">姓名</p>
                            <p>${user.full_name || '未设置'}</p>
                        </div>
                        <div>
                            <p class="text-sm text-gray-400">邮箱</p>
                            <p>${user.email || '未设置'}</p>
                        </div>
                        <div>
                            <p class="text-sm text-gray-400">会员状态</p>
                            <p>${user.subscription_status === 'active' ? 
                                '<span class="text-yellow-400"><i class="fas fa-crown mr-1"></i>VIP会员</span>' : 
                                '<span class="text-gray-400">免费用户</span>'}</p>
                        </div>
                        <div>
                            <p class="text-sm text-gray-400">注册时间</p>
                            <p>${new Date(user.created_at).toLocaleString('zh-CN')}</p>
                        </div>
                        <div>
                            <p class="text-sm text-gray-400">最后登录</p>
                            <p>${user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleString('zh-CN') : '从未登录'}</p>
                        </div>
                    </div>
                </div>

                <!-- 消费统计 -->
                <div class="bg-white/10 rounded-lg p-6 mb-6">
                    <h3 class="text-lg font-bold mb-4 text-yellow-400">消费统计</h3>
                    <div class="grid md:grid-cols-3 gap-4">
                        <div class="bg-white/5 rounded-lg p-4">
                            <p class="text-sm text-gray-400">订单数量</p>
                            <p class="text-2xl font-bold">${orders.length}</p>
                        </div>
                        <div class="bg-white/5 rounded-lg p-4">
                            <p class="text-sm text-gray-400">总消费</p>
                            <p class="text-2xl font-bold text-green-400">$${totalSpent.toFixed(2)}</p>
                        </div>
                        <div class="bg-white/5 rounded-lg p-4">
                            <p class="text-sm text-gray-400">占卜次数</p>
                            <p class="text-2xl font-bold">${readings.length}</p>
                        </div>
                    </div>
                </div>

                <!-- 最近订单 -->
                <div class="bg-white/10 rounded-lg p-6 mb-6">
                    <h3 class="text-lg font-bold mb-4 text-yellow-400">最近订单</h3>
                    ${orders.length > 0 ? `
                        <div class="space-y-3">
                            ${orders.slice(0, 5).map(order => `
                                <div class="bg-white/5 rounded-lg p-3 flex justify-between items-center">
                                    <div>
                                        <p class="font-semibold">${order.order_number}</p>
                                        <p class="text-sm text-gray-400">${new Date(order.created_at).toLocaleString('zh-CN')}</p>
                                    </div>
                                    <div class="text-right">
                                        <p class="font-bold text-green-400">$${order.total_amount}</p>
                                        <p class="text-sm text-gray-400">${this.getOrderStatusText(order.status)}</p>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    ` : '<p class="text-gray-400">暂无订单</p>'}
                </div>

                <!-- 最近占卜 -->
                <div class="bg-white/10 rounded-lg p-6">
                    <h3 class="text-lg font-bold mb-4 text-yellow-400">最近占卜</h3>
                    ${readings.length > 0 ? `
                        <div class="space-y-3">
                            ${readings.map(reading => `
                                <div class="bg-white/5 rounded-lg p-3">
                                    <div class="flex justify-between items-start">
                                        <div>
                                            <p class="font-semibold">${reading.reading_type || '占卜'}</p>
                                            <p class="text-sm text-gray-400">${new Date(reading.created_at).toLocaleString('zh-CN')}</p>
                                        </div>
                                        <span class="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded">
                                            ${reading.category || '未分类'}
                                        </span>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    ` : '<p class="text-gray-400">暂无占卜记录</p>'}
                </div>
            `;

            modal.classList.remove('hidden');
        }

        /**
         * 加载付费记录
         */
        async loadPayments() {
            try {
                const client = window.supabaseClient;
                if (!client) {
                    this.renderNoData('paymentsList', '请配置 Supabase 数据库');
                    return;
                }

                const { data, error } = await client
                    .from('payments')
                    .select(`
                        *,
                        profiles (email, full_name)
                    `)
                    .order('created_at', { ascending: false });

                if (error) throw error;

                this.payments = data || [];
                this.renderPayments();

            } catch (error) {
                console.error('加载付费记录失败:', error);
                this.renderNoData('paymentsList', '暂无付费记录');
            }
        }

        /**
         * 渲染付费记录
         */
        renderPayments() {
            const container = document.getElementById('paymentsList');
            if (!container) return;

            if (this.payments.length === 0) {
                this.renderNoData('paymentsList', '暂无付费记录');
                return;
            }

            container.innerHTML = this.payments.map(payment => `
                <div class="bg-white/5 rounded-lg p-4">
                    <div class="flex justify-between items-center">
                        <div class="flex-1">
                            <div class="flex items-center gap-2 mb-2">
                                <h3 class="font-bold">${payment.profiles?.full_name || payment.profiles?.email || '未知用户'}</h3>
                                <span class="px-2 py-1 rounded text-xs ${this.getPaymentStatusClass(payment.status)}">
                                    ${this.getPaymentStatusText(payment.status)}
                                </span>
                            </div>
                            <div class="grid md:grid-cols-4 gap-4 text-sm">
                                <div>
                                    <p class="text-gray-400">订单号</p>
                                    <p class="font-mono">${payment.payment_id || 'N/A'}</p>
                                </div>
                                <div>
                                    <p class="text-gray-400">金额</p>
                                    <p class="text-green-400 font-bold">$${payment.amount}</p>
                                </div>
                                <div>
                                    <p class="text-gray-400">支付方式</p>
                                    <p>${payment.payment_method || '未知'}</p>
                                </div>
                                <div>
                                    <p class="text-gray-400">时间</p>
                                    <p>${new Date(payment.created_at).toLocaleString('zh-CN')}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `).join('');
        }

        /**
         * 加载订单记录
         */
        async loadOrders() {
            try {
                const client = window.supabaseClient;
                if (!client) {
                    this.renderNoData('ordersList', '请配置 Supabase 数据库');
                    return;
                }

                const { data, error } = await client
                    .from('orders')
                    .select(`
                        *,
                        profiles (email, full_name),
                        order_items (*)
                    `)
                    .order('created_at', { ascending: false });

                if (error) throw error;

                this.orders = data || [];
                this.renderOrders();

            } catch (error) {
                console.error('加载订单失败:', error);
                this.renderNoData('ordersList', '暂无订单记录');
            }
        }

        /**
         * 渲染订单记录
         */
        renderOrders() {
            const container = document.getElementById('ordersList');
            if (!container) return;

            if (this.orders.length === 0) {
                this.renderNoData('ordersList', '暂无订单记录');
                return;
            }

            container.innerHTML = this.orders.map(order => `
                <div class="bg-white/5 rounded-lg p-4">
                    <div class="flex justify-between items-start mb-3">
                        <div>
                            <div class="flex items-center gap-2 mb-1">
                                <h3 class="font-bold">${order.order_number}</h3>
                                <span class="px-2 py-1 rounded text-xs ${this.getOrderStatusClass(order.status)}">
                                    ${this.getOrderStatusText(order.status)}
                                </span>
                            </div>
                            <p class="text-sm text-gray-400">${order.profiles?.full_name || order.profiles?.email || '未知用户'}</p>
                        </div>
                        <div class="text-right">
                            <p class="text-2xl font-bold text-green-400">$${order.total_amount}</p>
                            <p class="text-sm text-gray-400">${new Date(order.created_at).toLocaleString('zh-CN')}</p>
                        </div>
                    </div>
                    
                    <div class="bg-white/5 rounded p-3 mb-3">
                        <p class="text-sm font-semibold mb-2">收货信息</p>
                        <div class="grid md:grid-cols-2 gap-2 text-sm">
                            <p><i class="fas fa-user mr-2 text-gray-400"></i>${order.recipient_name}</p>
                            <p><i class="fas fa-phone mr-2 text-gray-400"></i>${order.recipient_phone}</p>
                            <p class="md:col-span-2"><i class="fas fa-map-marker-alt mr-2 text-gray-400"></i>${order.shipping_address}</p>
                        </div>
                    </div>

                    ${order.order_items && order.order_items.length > 0 ? `
                        <div class="bg-white/5 rounded p-3">
                            <p class="text-sm font-semibold mb-2">订单商品 (${order.order_items.length}件)</p>
                            <div class="space-y-1">
                                ${order.order_items.map(item => `
                                    <p class="text-sm text-gray-300">
                                        ${item.product_name} × ${item.quantity} = $${item.subtotal}
                                    </p>
                                `).join('')}
                            </div>
                        </div>
                    ` : ''}
                </div>
            `).join('');
        }

        /**
         * 加载占卜记录
         */
        async loadReadings() {
            try {
                const client = window.supabaseClient;
                if (!client) {
                    this.renderNoData('readingsList', '请配置 Supabase 数据库');
                    return;
                }

                const { data, error } = await client
                    .from('readings')
                    .select(`
                        *,
                        profiles (email, full_name)
                    `)
                    .order('created_at', { ascending: false })
                    .limit(100);

                if (error) throw error;

                this.readings = data || [];
                this.renderReadings();

            } catch (error) {
                console.error('加载占卜记录失败:', error);
                this.renderNoData('readingsList', '暂无占卜记录');
            }
        }

        /**
         * 渲染占卜记录
         */
        renderReadings() {
            const container = document.getElementById('readingsList');
            if (!container) return;

            if (this.readings.length === 0) {
                this.renderNoData('readingsList', '暂无占卜记录');
                return;
            }

            container.innerHTML = this.readings.map(reading => `
                <div class="bg-white/5 rounded-lg p-4">
                    <div class="flex justify-between items-start">
                        <div class="flex-1">
                            <div class="flex items-center gap-2 mb-2">
                                <h3 class="font-bold">${reading.profiles?.full_name || reading.profiles?.email || '未知用户'}</h3>
                                <span class="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded">
                                    ${reading.reading_type || '占卜'}
                                </span>
                                ${reading.category ? `
                                    <span class="px-2 py-1 bg-purple-500/20 text-purple-400 text-xs rounded">
                                        ${reading.category}
                                    </span>
                                ` : ''}
                            </div>
                            <p class="text-sm text-gray-400 mb-2">${new Date(reading.created_at).toLocaleString('zh-CN')}</p>
                            ${reading.question ? `
                                <p class="text-sm bg-white/5 rounded p-2 mb-2">
                                    <i class="fas fa-question-circle mr-2 text-yellow-400"></i>${reading.question}
                                </p>
                            ` : ''}
                        </div>
                    </div>
                </div>
            `).join('');
        }

        /**
         * 切换标签页
         */
        switchTab(tabName) {
            this.currentTab = tabName;

            // 更新标签按钮样式
            document.querySelectorAll('.tab-btn').forEach(btn => {
                btn.classList.remove('tab-active');
            });
            document.querySelector(`[data-tab="${tabName}"]`).classList.add('tab-active');

            // 显示/隐藏内容
            document.querySelectorAll('.tab-content').forEach(content => {
                content.classList.add('hidden');
            });

            const tabMap = {
                'users': 'usersTab',
                'payments': 'paymentsTab',
                'orders': 'ordersTab',
                'readings': 'readingsTab'
            };

            document.getElementById(tabMap[tabName]).classList.remove('hidden');

            // 加载对应数据
            switch(tabName) {
                case 'payments':
                    if (this.payments.length === 0) this.loadPayments();
                    break;
                case 'orders':
                    if (this.orders.length === 0) this.loadOrders();
                    break;
                case 'readings':
                    if (this.readings.length === 0) this.loadReadings();
                    break;
            }
        }

        /**
         * 渲染无数据提示
         */
        renderNoData(containerId, message) {
            const container = document.getElementById(containerId);
            if (container) {
                container.innerHTML = `
                    <div class="text-center py-12 text-gray-400">
                        <i class="fas fa-inbox text-4xl mb-4"></i>
                        <p>${message}</p>
                    </div>
                `;
            }
        }

        /**
         * 获取订单状态文本
         */
        getOrderStatusText(status) {
            const statusMap = {
                'pending': '待支付',
                'paid': '已支付',
                'processing': '处理中',
                'shipped': '已发货',
                'delivered': '已送达',
                'cancelled': '已取消'
            };
            return statusMap[status] || status;
        }

        /**
         * 获取订单状态样式
         */
        getOrderStatusClass(status) {
            const classMap = {
                'pending': 'bg-yellow-500/20 text-yellow-400',
                'paid': 'bg-green-500/20 text-green-400',
                'processing': 'bg-blue-500/20 text-blue-400',
                'shipped': 'bg-purple-500/20 text-purple-400',
                'delivered': 'bg-green-500/20 text-green-400',
                'cancelled': 'bg-red-500/20 text-red-400'
            };
            return classMap[status] || 'bg-gray-500/20 text-gray-400';
        }

        /**
         * 获取支付状态文本
         */
        getPaymentStatusText(status) {
            const statusMap = {
                'completed': '已完成',
                'pending': '待处理',
                'failed': '失败',
                'refunded': '已退款'
            };
            return statusMap[status] || status;
        }

        /**
         * 获取支付状态样式
         */
        getPaymentStatusClass(status) {
            const classMap = {
                'completed': 'bg-green-500/20 text-green-400',
                'pending': 'bg-yellow-500/20 text-yellow-400',
                'failed': 'bg-red-500/20 text-red-400',
                'refunded': 'bg-gray-500/20 text-gray-400'
            };
            return classMap[status] || 'bg-gray-500/20 text-gray-400';
        }

        /**
         * 关闭模态框
         */
        closeModal() {
            document.getElementById('userDetailModal').classList.add('hidden');
        }

        /**
         * 编辑用户
         */
        editUser(userId) {
            alert('编辑用户功能开发中...');
        }

        /**
         * 导出用户
         */
        exportUsers() {
            alert('导出功能开发中...');
        }

        /**
         * 筛选付费记录
         */
        filterPayments() {
            const filter = document.getElementById('paymentFilter').value;
            // 实现筛选逻辑
            this.loadPayments();
        }

        /**
         * 筛选订单
         */
        filterOrders() {
            const filter = document.getElementById('orderFilter').value;
            // 实现筛选逻辑
            this.loadOrders();
        }

        /**
         * 筛选占卜记录
         */
        filterReadings() {
            const filter = document.getElementById('readingFilter').value;
            // 实现筛选逻辑
            this.loadReadings();
        }

        /**
         * 设置事件监听
         */
        setupEventListeners() {
            // 搜索用户
            const searchInput = document.getElementById('searchUsers');
            if (searchInput) {
                searchInput.addEventListener('input', (e) => {
                    const query = e.target.value.toLowerCase();
                    const filtered = this.users.filter(user => 
                        (user.email && user.email.toLowerCase().includes(query)) ||
                        (user.full_name && user.full_name.toLowerCase().includes(query))
                    );
                    this.users = filtered;
                    this.renderUsers();
                });
            }

            // ESC键关闭模态框
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    this.closeModal();
                }
            });

            // 点击背景关闭模态框
            document.getElementById('userDetailModal')?.addEventListener('click', (e) => {
                if (e.target.id === 'userDetailModal') {
                    this.closeModal();
                }
            });
        }
    }

    // 初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            window.adminUsers = new AdminUsers();
        });
    } else {
        window.adminUsers = new AdminUsers();
    }

})();
