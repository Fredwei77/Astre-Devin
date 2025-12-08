/**
 * Supabase 初始化和集成
 * Supabase Initialization and Integration
 */

(function () {
    'use strict';

    // Supabase配置
    // ⚠️ 请从Supabase Dashboard获取正确的anon key
    // 位置: Settings → API → Project API keys → anon public
    const SUPABASE_CONFIG = {
        url: 'https://izkcgqvxecfxqtgxpmaj.supabase.co',
        anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml6a2NncXZ4ZWNmeHF0Z3hwbWFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQwMzMzMzIsImV4cCI6MjA3OTYwOTMzMn0.wQEjV2MKXjSmsWUK14Shcg9QCCjGnbH564BbkrLPYms'
    };

    /**
     * 初始化Supabase
     */
    async function initializeSupabase() {
        try {
            // 检查Supabase库是否已加载
            if (typeof window.supabase === 'undefined') {
                console.error('❌ Supabase库未加载');
                return false;
            }

            // 创建Supabase客户端
            window.supabaseClient = window.supabase.createClient(
                SUPABASE_CONFIG.url,
                SUPABASE_CONFIG.anonKey
            );

            console.log('✅ Supabase客户端初始化成功');

            // 检查当前会话
            const { data: { session }, error } = await window.supabaseClient.auth.getSession();

            if (error) {
                console.error('获取会话失败:', error);
            } else if (session) {
                console.log('✅ 用户已登录:', session.user.email);
                // 触发登录状态更新
                window.dispatchEvent(new CustomEvent('supabase:auth:signin', {
                    detail: { user: session.user, session }
                }));
            } else {
                console.log('ℹ️ 用户未登录');
            }

            // 监听认证状态变化
            window.supabaseClient.auth.onAuthStateChange((event, session) => {
                console.log('认证状态变化:', event);

                switch (event) {
                    case 'SIGNED_IN':
                        window.dispatchEvent(new CustomEvent('supabase:auth:signin', {
                            detail: { user: session.user, session }
                        }));
                        break;
                    case 'SIGNED_OUT':
                        window.dispatchEvent(new CustomEvent('supabase:auth:signout'));
                        break;
                    case 'TOKEN_REFRESHED':
                        console.log('Token已刷新');
                        break;
                    case 'USER_UPDATED':
                        window.dispatchEvent(new CustomEvent('supabase:auth:updated', {
                            detail: { user: session.user }
                        }));
                        break;
                }
            });

            return true;
        } catch (error) {
            console.error('❌ Supabase初始化失败:', error);
            return false;
        }
    }

    /**
     * 增强的认证服务（集成Supabase）
     */
    const EnhancedAuthService = {
        /**
         * 用户注册
         */
        async register(email, password, userData = {}) {
            try {
                const { data, error } = await window.supabaseClient.auth.signUp({
                    email,
                    password,
                    options: {
                        data: {
                            full_name: userData.fullName || '',
                            phone: userData.phone || ''
                        }
                    }
                });

                if (error) throw error;

                console.log('✅ 注册成功:', data.user.email);
                return {
                    success: true,
                    user: data.user,
                    session: data.session
                };
            } catch (error) {
                console.error('❌ 注册失败:', error);
                return {
                    success: false,
                    error: error.message
                };
            }
        },

        /**
         * 用户登录
         */
        async login(email, password) {
            try {
                const { data, error } = await window.supabaseClient.auth.signInWithPassword({
                    email,
                    password
                });

                if (error) throw error;

                console.log('✅ 登录成功:', data.user.email);

                // 保存到localStorage（兼容现有系统）
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('userEmail', data.user.email);
                localStorage.setItem('userId', data.user.id);

                return {
                    success: true,
                    user: data.user,
                    session: data.session
                };
            } catch (error) {
                console.error('❌ 登录失败:', error);
                return {
                    success: false,
                    error: error.message
                };
            }
        },

        /**
         * 用户登出
         */
        async logout() {
            try {
                const { error } = await window.supabaseClient.auth.signOut();
                if (error) throw error;

                // 清除localStorage
                localStorage.removeItem('isLoggedIn');
                localStorage.removeItem('userEmail');
                localStorage.removeItem('userId');
                localStorage.removeItem('userName');

                console.log('✅ 登出成功');
                return { success: true };
            } catch (error) {
                console.error('❌ 登出失败:', error);
                return {
                    success: false,
                    error: error.message
                };
            }
        },

        /**
         * 获取当前用户
         */
        async getCurrentUser() {
            try {
                const { data: { user }, error } = await window.supabaseClient.auth.getUser();
                if (error) throw error;
                return user;
            } catch (error) {
                console.error('获取用户失败:', error);
                return null;
            }
        },

        /**
         * 获取用户档案
         */
        async getUserProfile(userId) {
            try {
                const { data, error } = await window.supabaseClient
                    .from('profiles')
                    .select('*')
                    .eq('id', userId)
                    .single();

                if (error) throw error;
                return data;
            } catch (error) {
                console.error('获取用户档案失败:', error);
                return null;
            }
        },

        /**
         * 更新用户档案
         */
        async updateUserProfile(userId, updates) {
            try {
                const { data, error } = await window.supabaseClient
                    .from('profiles')
                    .update(updates)
                    .eq('id', userId)
                    .select()
                    .single();

                if (error) throw error;
                console.log('✅ 档案更新成功');
                return { success: true, data };
            } catch (error) {
                console.error('❌ 档案更新失败:', error);
                return { success: false, error: error.message };
            }
        },

        /**
         * 重置密码
         */
        async resetPassword(email) {
            try {
                const { error } = await window.supabaseClient.auth.resetPasswordForEmail(email, {
                    redirectTo: `${window.location.origin}/reset-password.html`
                });

                if (error) throw error;
                console.log('✅ 密码重置邮件已发送');
                return { success: true };
            } catch (error) {
                console.error('❌ 密码重置失败:', error);
                return { success: false, error: error.message };
            }
        }
    };

    /**
     * 数据库操作服务
     */
    const DatabaseService = {
        /**
         * 保存占卜记录
         */
        async saveReading(type, inputData, resultData) {
            try {
                const user = await EnhancedAuthService.getCurrentUser();
                if (!user) {
                    throw new Error('用户未登录');
                }

                const { data, error } = await window.supabaseClient
                    .from('readings')
                    .insert({
                        user_id: user.id,
                        type: type,
                        input_data: inputData,
                        result_data: resultData
                    })
                    .select()
                    .single();

                if (error) throw error;
                console.log('✅ 占卜记录已保存');
                return { success: true, data };
            } catch (error) {
                console.error('❌ 保存占卜记录失败:', error);
                return { success: false, error: error.message };
            }
        },

        /**
         * 获取用户的占卜记录
         */
        async getUserReadings(limit = 10, offset = 0) {
            try {
                const user = await EnhancedAuthService.getCurrentUser();
                if (!user) {
                    throw new Error('用户未登录');
                }

                const { data, error } = await window.supabaseClient
                    .from('readings')
                    .select('*')
                    .eq('user_id', user.id)
                    .order('created_at', { ascending: false })
                    .range(offset, offset + limit - 1);

                if (error) throw error;
                return { success: true, data };
            } catch (error) {
                console.error('❌ 获取占卜记录失败:', error);
                return { success: false, error: error.message };
            }
        },

        /**
         * 记录使用次数
         */
        async recordUsage(usageType, metadata = {}) {
            try {
                const user = await EnhancedAuthService.getCurrentUser();
                if (!user) {
                    console.log('用户未登录，跳过使用记录');
                    return { success: true };
                }

                const { data, error } = await window.supabaseClient
                    .from('usage_logs')
                    .insert({
                        user_id: user.id,
                        usage_type: usageType,
                        metadata: metadata
                    })
                    .select()
                    .single();

                if (error) throw error;
                return { success: true, data };
            } catch (error) {
                console.error('❌ 记录使用失败:', error);
                return { success: false, error: error.message };
            }
        },

        /**
         * 获取用户订阅信息
         */
        async getUserSubscription() {
            try {
                const user = await EnhancedAuthService.getCurrentUser();
                if (!user) {
                    return { success: true, data: { plan_type: 'free', status: 'active' } };
                }

                const { data, error } = await window.supabaseClient
                    .from('subscriptions')
                    .select('*')
                    .eq('user_id', user.id)
                    .single();

                if (error && error.code !== 'PGRST116') throw error;
                return { success: true, data: data || { plan_type: 'free', status: 'active' } };
            } catch (error) {
                console.error('❌ 获取订阅信息失败:', error);
                return { success: false, error: error.message };
            }
        }
    };

    // 页面加载时初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeSupabase);
    } else {
        initializeSupabase();
    }

    // 导出到全局
    window.EnhancedAuthService = EnhancedAuthService;
    window.DatabaseService = DatabaseService;
    window.initializeSupabase = initializeSupabase;

})();
