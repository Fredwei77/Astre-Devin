/**
 * Supabase 客户端配置
 * Supabase Client Configuration
 */

// 从环境变量或配置文件加载Supabase配置
// ⚠️ 在 Netlify 中配置环境变量：VITE_SUPABASE_URL 和 VITE_SUPABASE_ANON_KEY
const SUPABASE_URL = import.meta?.env?.VITE_SUPABASE_URL || 'https://izkcgqvxecfxqtgxpmaj.supabase.co';
const SUPABASE_ANON_KEY = import.meta?.env?.VITE_SUPABASE_ANON_KEY || '';

// 初始化Supabase客户端
let supabaseClient = null;

/**
 * 获取Supabase客户端实例
 */
function getSupabaseClient() {
    if (!supabaseClient) {
        // 检查是否在浏览器环境
        if (typeof window !== 'undefined' && window.supabase) {
            supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
            console.log('✅ Supabase客户端初始化成功');
        } else {
            console.error('❌ Supabase库未加载，请确保已引入Supabase CDN');
        }
    }
    return supabaseClient;
}

/**
 * Supabase数据库服务
 */
const SupabaseService = {
    /**
     * 获取客户端实例
     */
    getClient() {
        return getSupabaseClient();
    },

    /**
     * 用户认证相关
     */
    auth: {
        /**
         * 用户注册
         */
        async signUp(email, password, metadata = {}) {
            const client = getSupabaseClient();
            if (!client) throw new Error('Supabase客户端未初始化');

            const { data, error } = await client.auth.signUp({
                email,
                password,
                options: {
                    data: metadata
                }
            });

            if (error) throw error;
            return data;
        },

        /**
         * 用户登录
         */
        async signIn(email, password) {
            const client = getSupabaseClient();
            if (!client) throw new Error('Supabase客户端未初始化');

            const { data, error } = await client.auth.signInWithPassword({
                email,
                password
            });

            if (error) throw error;
            return data;
        },

        /**
         * 用户登出
         */
        async signOut() {
            const client = getSupabaseClient();
            if (!client) throw new Error('Supabase客户端未初始化');

            const { error } = await client.auth.signOut();
            if (error) throw error;
        },

        /**
         * 获取当前用户
         */
        async getCurrentUser() {
            const client = getSupabaseClient();
            if (!client) throw new Error('Supabase客户端未初始化');

            const { data: { user }, error } = await client.auth.getUser();
            if (error) throw error;
            return user;
        },

        /**
         * 获取当前会话
         */
        async getSession() {
            const client = getSupabaseClient();
            if (!client) throw new Error('Supabase客户端未初始化');

            const { data: { session }, error } = await client.auth.getSession();
            if (error) throw error;
            return session;
        },

        /**
         * 重置密码
         */
        async resetPassword(email) {
            const client = getSupabaseClient();
            if (!client) throw new Error('Supabase客户端未初始化');

            const { error } = await client.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/reset-password`
            });

            if (error) throw error;
        },

        /**
         * 更新密码
         */
        async updatePassword(newPassword) {
            const client = getSupabaseClient();
            if (!client) throw new Error('Supabase客户端未初始化');

            const { error } = await client.auth.updateUser({
                password: newPassword
            });

            if (error) throw error;
        },

        /**
         * 监听认证状态变化
         */
        onAuthStateChange(callback) {
            const client = getSupabaseClient();
            if (!client) throw new Error('Supabase客户端未初始化');

            return client.auth.onAuthStateChange((event, session) => {
                callback(event, session);
            });
        }
    },

    /**
     * 用户档案相关
     */
    profiles: {
        /**
         * 获取用户档案
         */
        async getProfile(userId) {
            const client = getSupabaseClient();
            if (!client) throw new Error('Supabase客户端未初始化');

            const { data, error } = await client
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single();

            if (error) throw error;
            return data;
        },

        /**
         * 更新用户档案
         */
        async updateProfile(userId, updates) {
            const client = getSupabaseClient();
            if (!client) throw new Error('Supabase客户端未初始化');

            const { data, error } = await client
                .from('profiles')
                .update(updates)
                .eq('id', userId)
                .select()
                .single();

            if (error) throw error;
            return data;
        },

        /**
         * 创建用户档案
         */
        async createProfile(userId, profileData) {
            const client = getSupabaseClient();
            if (!client) throw new Error('Supabase客户端未初始化');

            const { data, error } = await client
                .from('profiles')
                .insert({
                    id: userId,
                    ...profileData
                })
                .select()
                .single();

            if (error) throw error;
            return data;
        }
    },

    /**
     * 占卜记录相关
     */
    readings: {
        /**
         * 保存占卜记录
         */
        async saveReading(userId, readingData) {
            const client = getSupabaseClient();
            if (!client) throw new Error('Supabase客户端未初始化');

            const { data, error } = await client
                .from('readings')
                .insert({
                    user_id: userId,
                    type: readingData.type,
                    input_data: readingData.inputData,
                    result_data: readingData.resultData,
                    created_at: new Date().toISOString()
                })
                .select()
                .single();

            if (error) throw error;
            return data;
        },

        /**
         * 获取用户的占卜记录
         */
        async getUserReadings(userId, limit = 10, offset = 0) {
            const client = getSupabaseClient();
            if (!client) throw new Error('Supabase客户端未初始化');

            const { data, error } = await client
                .from('readings')
                .select('*')
                .eq('user_id', userId)
                .order('created_at', { ascending: false })
                .range(offset, offset + limit - 1);

            if (error) throw error;
            return data;
        },

        /**
         * 获取单个占卜记录
         */
        async getReading(readingId) {
            const client = getSupabaseClient();
            if (!client) throw new Error('Supabase客户端未初始化');

            const { data, error } = await client
                .from('readings')
                .select('*')
                .eq('id', readingId)
                .single();

            if (error) throw error;
            return data;
        },

        /**
         * 删除占卜记录
         */
        async deleteReading(readingId) {
            const client = getSupabaseClient();
            if (!client) throw new Error('Supabase客户端未初始化');

            const { error } = await client
                .from('readings')
                .delete()
                .eq('id', readingId);

            if (error) throw error;
        }
    },

    /**
     * 订阅相关
     */
    subscriptions: {
        /**
         * 获取用户订阅信息
         */
        async getUserSubscription(userId) {
            const client = getSupabaseClient();
            if (!client) throw new Error('Supabase客户端未初始化');

            const { data, error } = await client
                .from('subscriptions')
                .select('*')
                .eq('user_id', userId)
                .single();

            if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows
            return data;
        },

        /**
         * 创建订阅
         */
        async createSubscription(userId, subscriptionData) {
            const client = getSupabaseClient();
            if (!client) throw new Error('Supabase客户端未初始化');

            const { data, error } = await client
                .from('subscriptions')
                .insert({
                    user_id: userId,
                    ...subscriptionData
                })
                .select()
                .single();

            if (error) throw error;
            return data;
        },

        /**
         * 更新订阅
         */
        async updateSubscription(userId, updates) {
            const client = getSupabaseClient();
            if (!client) throw new Error('Supabase客户端未初始化');

            const { data, error } = await client
                .from('subscriptions')
                .update(updates)
                .eq('user_id', userId)
                .select()
                .single();

            if (error) throw error;
            return data;
        }
    },

    /**
     * 使用统计相关
     */
    usage: {
        /**
         * 记录使用次数
         */
        async recordUsage(userId, usageType) {
            const client = getSupabaseClient();
            if (!client) throw new Error('Supabase客户端未初始化');

            const { data, error } = await client
                .from('usage_logs')
                .insert({
                    user_id: userId,
                    usage_type: usageType,
                    created_at: new Date().toISOString()
                })
                .select()
                .single();

            if (error) throw error;
            return data;
        },

        /**
         * 获取用户使用统计
         */
        async getUserUsage(userId, startDate, endDate) {
            const client = getSupabaseClient();
            if (!client) throw new Error('Supabase客户端未初始化');

            let query = client
                .from('usage_logs')
                .select('*')
                .eq('user_id', userId);

            if (startDate) {
                query = query.gte('created_at', startDate);
            }
            if (endDate) {
                query = query.lte('created_at', endDate);
            }

            const { data, error } = await query.order('created_at', { ascending: false });

            if (error) throw error;
            return data;
        }
    }
};

// 导出到全局
if (typeof window !== 'undefined') {
    window.SupabaseService = SupabaseService;
}

// 如果是Node.js环境
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SupabaseService;
}
