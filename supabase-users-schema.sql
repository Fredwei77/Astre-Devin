-- =====================================================
-- 用户管理系统数据库表结构
-- User Management System Database Schema
-- =====================================================

-- =====================================================
-- 1. 扩展 profiles 表（用户信息）
-- =====================================================
-- 添加额外字段到现有的 profiles 表
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'free';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS subscription_plan TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS subscription_start_date TIMESTAMP WITH TIME ZONE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS subscription_end_date TIMESTAMP WITH TIME ZONE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS total_spent DECIMAL(10, 2) DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS last_payment_date TIMESTAMP WITH TIME ZONE;

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_profiles_subscription_status ON profiles(subscription_status);
CREATE INDEX IF NOT EXISTS idx_profiles_subscription_end_date ON profiles(subscription_end_date);

-- =====================================================
-- 2. 付费记录表 (Payments)
-- =====================================================
CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    payment_id TEXT UNIQUE,
    amount DECIMAL(10, 2) NOT NULL,
    currency TEXT DEFAULT 'USD',
    payment_method TEXT,
    payment_provider TEXT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
    
    -- 订阅信息
    subscription_plan TEXT,
    subscription_period TEXT,
    
    -- 支付详情
    transaction_id TEXT,
    receipt_url TEXT,
    
    -- 备注
    notes TEXT,
    metadata JSONB DEFAULT '{}',
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_created_at ON payments(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_payments_payment_id ON payments(payment_id);

-- =====================================================
-- 3. 占卜记录表 (Readings)
-- =====================================================
CREATE TABLE IF NOT EXISTS readings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    
    -- 占卜类型
    reading_type TEXT NOT NULL CHECK (reading_type IN ('divination', 'iching', 'fengshui')),
    category TEXT,
    
    -- 占卜内容
    question TEXT,
    birth_date DATE,
    birth_time TIME,
    birth_place TEXT,
    gender TEXT,
    
    -- 结果
    result JSONB,
    hexagram TEXT,
    interpretation TEXT,
    
    -- AI模型信息
    ai_model TEXT,
    ai_provider TEXT,
    
    -- 元数据
    metadata JSONB DEFAULT '{}',
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_readings_user_id ON readings(user_id);
CREATE INDEX IF NOT EXISTS idx_readings_type ON readings(reading_type);
CREATE INDEX IF NOT EXISTS idx_readings_created_at ON readings(created_at DESC);

-- =====================================================
-- 4. 用户活动日志表 (User Activity Logs)
-- =====================================================
CREATE TABLE IF NOT EXISTS user_activity_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    
    -- 活动类型
    activity_type TEXT NOT NULL,
    activity_description TEXT,
    
    -- 详情
    ip_address INET,
    user_agent TEXT,
    page_url TEXT,
    
    -- 元数据
    metadata JSONB DEFAULT '{}',
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_activity_logs_user_id ON user_activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_type ON user_activity_logs(activity_type);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON user_activity_logs(created_at DESC);

-- =====================================================
-- 5. 启用行级安全策略 (RLS)
-- =====================================================

-- Payments表 - 用户只能查看自己的付费记录
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own payments" ON payments
    FOR SELECT USING (auth.uid() = user_id);

-- Readings表 - 用户只能查看自己的占卜记录
ALTER TABLE readings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own readings" ON readings
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own readings" ON readings
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Activity Logs表 - 用户只能查看自己的活动日志
ALTER TABLE user_activity_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own activity logs" ON user_activity_logs
    FOR SELECT USING (auth.uid() = user_id);

-- =====================================================
-- 6. 触发器 - 自动更新 updated_at
-- =====================================================

CREATE TRIGGER update_payments_updated_at
    BEFORE UPDATE ON payments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 7. 函数 - 更新用户总消费
-- =====================================================
CREATE OR REPLACE FUNCTION update_user_total_spent()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'completed' THEN
        UPDATE profiles
        SET 
            total_spent = COALESCE(total_spent, 0) + NEW.amount,
            last_payment_date = NEW.created_at
        WHERE id = NEW.user_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_user_total_spent
    AFTER INSERT OR UPDATE ON payments
    FOR EACH ROW
    EXECUTE FUNCTION update_user_total_spent();

-- =====================================================
-- 8. 函数 - 检查订阅状态
-- =====================================================
CREATE OR REPLACE FUNCTION check_subscription_status()
RETURNS void AS $$
BEGIN
    UPDATE profiles
    SET subscription_status = 'expired'
    WHERE subscription_status = 'active'
    AND subscription_end_date < NOW();
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 9. 视图 - 用户统计
-- =====================================================
CREATE OR REPLACE VIEW user_statistics AS
SELECT 
    p.id,
    p.email,
    p.full_name,
    p.subscription_status,
    p.total_spent,
    COUNT(DISTINCT o.id) as order_count,
    COUNT(DISTINCT r.id) as reading_count,
    COUNT(DISTINCT pay.id) as payment_count,
    MAX(o.created_at) as last_order_date,
    MAX(r.created_at) as last_reading_date
FROM profiles p
LEFT JOIN orders o ON p.id = o.user_id
LEFT JOIN readings r ON p.id = r.user_id
LEFT JOIN payments pay ON p.id = pay.user_id
GROUP BY p.id, p.email, p.full_name, p.subscription_status, p.total_spent;

-- =====================================================
-- 10. 插入示例数据（可选）
-- =====================================================

-- 示例付费记录
-- INSERT INTO payments (user_id, payment_id, amount, payment_method, status, subscription_plan) VALUES
-- ('user-uuid-here', 'PAY-001', 29.99, 'credit_card', 'completed', 'monthly')
-- ON CONFLICT DO NOTHING;

-- 示例占卜记录
-- INSERT INTO readings (user_id, reading_type, category, question) VALUES
-- ('user-uuid-here', 'divination', 'career', 'What is my career path?')
-- ON CONFLICT DO NOTHING;

-- =====================================================
-- 完成提示
-- =====================================================
-- 执行此SQL文件后，请在Supabase Dashboard中：
-- 1. 验证所有表已创建
-- 2. 检查RLS策略是否正确
-- 3. 测试视图和函数

