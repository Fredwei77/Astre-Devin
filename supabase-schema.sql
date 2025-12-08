-- =====================================================
-- Destiny AI - Supabase 数据库表结构
-- Database Schema for Supabase
-- =====================================================

-- 启用必要的扩展
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 1. 用户档案表 (Profiles)
-- =====================================================
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    phone TEXT,
    birth_date DATE,
    birth_time TIME,
    birth_place TEXT,
    gender TEXT CHECK (gender IN ('male', 'female', 'other')),
    language TEXT DEFAULT 'zh-CN',
    timezone TEXT DEFAULT 'Asia/Shanghai',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_created_at ON profiles(created_at);

-- 启用行级安全策略 (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 用户只能查看和更新自己的档案
CREATE POLICY "Users can view own profile" ON profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- =====================================================
-- 2. 订阅表 (Subscriptions)
-- =====================================================
CREATE TABLE IF NOT EXISTS subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    plan_type TEXT NOT NULL CHECK (plan_type IN ('free', 'basic', 'premium', 'vip')),
    status TEXT NOT NULL CHECK (status IN ('active', 'cancelled', 'expired', 'trial')),
    stripe_customer_id TEXT,
    stripe_subscription_id TEXT,
    current_period_start TIMESTAMP WITH TIME ZONE,
    current_period_end TIMESTAMP WITH TIME ZONE,
    cancel_at_period_end BOOLEAN DEFAULT FALSE,
    trial_end TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_customer ON subscriptions(stripe_customer_id);

-- 启用RLS
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- 用户只能查看自己的订阅
CREATE POLICY "Users can view own subscription" ON subscriptions
    FOR SELECT USING (auth.uid() = user_id);

-- =====================================================
-- 3. 占卜记录表 (Readings)
-- =====================================================
CREATE TABLE IF NOT EXISTS readings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('divination', 'fengshui', 'iching')),
    input_data JSONB NOT NULL,
    result_data JSONB NOT NULL,
    is_favorite BOOLEAN DEFAULT FALSE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_readings_user_id ON readings(user_id);
CREATE INDEX IF NOT EXISTS idx_readings_type ON readings(type);
CREATE INDEX IF NOT EXISTS idx_readings_created_at ON readings(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_readings_is_favorite ON readings(is_favorite);

-- 启用RLS
ALTER TABLE readings ENABLE ROW LEVEL SECURITY;

-- 用户只能操作自己的占卜记录
CREATE POLICY "Users can view own readings" ON readings
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own readings" ON readings
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own readings" ON readings
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own readings" ON readings
    FOR DELETE USING (auth.uid() = user_id);

-- =====================================================
-- 4. 使用日志表 (Usage Logs)
-- =====================================================
CREATE TABLE IF NOT EXISTS usage_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    usage_type TEXT NOT NULL CHECK (usage_type IN ('divination', 'fengshui', 'iching', 'ai_chat')),
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_usage_logs_user_id ON usage_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_usage_logs_type ON usage_logs(usage_type);
CREATE INDEX IF NOT EXISTS idx_usage_logs_created_at ON usage_logs(created_at DESC);

-- 启用RLS
ALTER TABLE usage_logs ENABLE ROW LEVEL SECURITY;

-- 用户只能查看自己的使用日志
CREATE POLICY "Users can view own usage logs" ON usage_logs
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own usage logs" ON usage_logs
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- =====================================================
-- 5. AI对话历史表 (Chat History)
-- =====================================================
CREATE TABLE IF NOT EXISTS chat_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    session_id UUID NOT NULL,
    message_type TEXT NOT NULL CHECK (message_type IN ('user', 'assistant')),
    content TEXT NOT NULL,
    context_type TEXT CHECK (context_type IN ('divination', 'fengshui', 'iching', 'general')),
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_chat_history_user_id ON chat_history(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_history_session_id ON chat_history(session_id);
CREATE INDEX IF NOT EXISTS idx_chat_history_created_at ON chat_history(created_at DESC);

-- 启用RLS
ALTER TABLE chat_history ENABLE ROW LEVEL SECURITY;

-- 用户只能操作自己的对话历史
CREATE POLICY "Users can view own chat history" ON chat_history
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own chat history" ON chat_history
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own chat history" ON chat_history
    FOR DELETE USING (auth.uid() = user_id);

-- =====================================================
-- 6. 用户偏好设置表 (User Preferences)
-- =====================================================
CREATE TABLE IF NOT EXISTS user_preferences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,
    theme TEXT DEFAULT 'dark' CHECK (theme IN ('light', 'dark', 'auto')),
    notifications_enabled BOOLEAN DEFAULT TRUE,
    email_notifications BOOLEAN DEFAULT TRUE,
    language TEXT DEFAULT 'zh-CN',
    timezone TEXT DEFAULT 'Asia/Shanghai',
    preferences JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_user_preferences_user_id ON user_preferences(user_id);

-- 启用RLS
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

-- 用户只能操作自己的偏好设置
CREATE POLICY "Users can view own preferences" ON user_preferences
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own preferences" ON user_preferences
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own preferences" ON user_preferences
    FOR UPDATE USING (auth.uid() = user_id);

-- =====================================================
-- 7. 触发器函数 - 自动更新 updated_at
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 为需要的表添加触发器
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at
    BEFORE UPDATE ON subscriptions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_readings_updated_at
    BEFORE UPDATE ON readings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_preferences_updated_at
    BEFORE UPDATE ON user_preferences
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 8. 触发器函数 - 自动创建用户档案
-- =====================================================
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO profiles (id, email, created_at)
    VALUES (NEW.id, NEW.email, NOW());
    
    INSERT INTO user_preferences (user_id, created_at)
    VALUES (NEW.id, NOW());
    
    INSERT INTO subscriptions (user_id, plan_type, status, created_at)
    VALUES (NEW.id, 'free', 'active', NOW());
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 创建触发器
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION handle_new_user();

-- =====================================================
-- 9. 视图 - 用户完整信息
-- =====================================================
CREATE OR REPLACE VIEW user_full_info AS
SELECT 
    p.id,
    p.email,
    p.full_name,
    p.avatar_url,
    p.phone,
    p.birth_date,
    p.birth_time,
    p.birth_place,
    p.gender,
    p.language,
    p.timezone,
    s.plan_type,
    s.status AS subscription_status,
    s.current_period_end,
    p.created_at,
    p.updated_at
FROM profiles p
LEFT JOIN subscriptions s ON p.id = s.user_id;

-- =====================================================
-- 10. 函数 - 获取用户使用统计
-- =====================================================
CREATE OR REPLACE FUNCTION get_user_usage_stats(
    p_user_id UUID,
    p_start_date TIMESTAMP WITH TIME ZONE DEFAULT NULL,
    p_end_date TIMESTAMP WITH TIME ZONE DEFAULT NULL
)
RETURNS TABLE (
    usage_type TEXT,
    count BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        ul.usage_type,
        COUNT(*) as count
    FROM usage_logs ul
    WHERE ul.user_id = p_user_id
        AND (p_start_date IS NULL OR ul.created_at >= p_start_date)
        AND (p_end_date IS NULL OR ul.created_at <= p_end_date)
    GROUP BY ul.usage_type
    ORDER BY count DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 11. 函数 - 检查用户使用限制
-- =====================================================
CREATE OR REPLACE FUNCTION check_usage_limit(
    p_user_id UUID,
    p_usage_type TEXT,
    p_limit INTEGER
)
RETURNS BOOLEAN AS $$
DECLARE
    usage_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO usage_count
    FROM usage_logs
    WHERE user_id = p_user_id
        AND usage_type = p_usage_type
        AND created_at >= CURRENT_DATE;
    
    RETURN usage_count < p_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 完成提示
-- =====================================================
-- 执行此SQL文件后，请在Supabase Dashboard中：
-- 1. 验证所有表已创建
-- 2. 检查RLS策略是否正确
-- 3. 测试触发器功能
-- 4. 配置存储桶（如需上传头像）
