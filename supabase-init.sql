-- ============================================
-- Destiny AI - Supabase 数据库初始化脚本
-- ============================================
-- 用途：创建支付和商品管理所需的数据库表
-- 使用方法：在 Supabase SQL Editor 中执行此脚本

-- 1. 创建 users 扩展表（如果使用自定义认证而非 Supabase Auth）
-- 注意：如果使用 Supabase Auth，可以跳过此步骤
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    username TEXT,
    password TEXT,
    stripe_customer_id TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. 创建商品表
CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    name_en TEXT,
    price DECIMAL(10, 2) NOT NULL,
    description TEXT,
    category TEXT,
    is_active BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. 插入初始商品数据（按次付费服务）
INSERT INTO products (id, name, name_en, price, description, category, is_active, sort_order) VALUES
('product_divination', 'AI占卜', 'AI Divination', 0.99, 'Single AI Divination reading with personalized insights', 'service', true, 1),
('product_fengshui', '风水分析', 'Feng Shui Analysis', 1.99, 'Single Feng Shui analysis with detailed recommendations', 'service', true, 2),
('product_iching', '易经智慧', 'I-Ching Wisdom', 2.99, 'Single I-Ching consultation with ancient wisdom', 'service', true, 3)
ON CONFLICT (id) DO NOTHING;

-- 4. 创建订阅表
CREATE TABLE IF NOT EXISTS subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    plan_type TEXT NOT NULL CHECK (plan_type IN ('free', 'premium', 'professional')),
    status TEXT NOT NULL CHECK (status IN ('active', 'canceled', 'past_due', 'trialing')),
    stripe_subscription_id TEXT UNIQUE,
    stripe_customer_id TEXT,
    current_period_start TIMESTAMPTZ,
    current_period_end TIMESTAMPTZ,
    cancel_at_period_end BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. 创建订单表
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    order_number TEXT UNIQUE NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    currency TEXT DEFAULT 'usd',
    status TEXT NOT NULL CHECK (status IN ('pending', 'paid', 'failed', 'refunded')),
    payment_intent_id TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. 创建订单项表
CREATE TABLE IF NOT EXISTS order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id TEXT NOT NULL REFERENCES products(id),
    quantity INTEGER NOT NULL DEFAULT 1,
    unit_price DECIMAL(10, 2) NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. 创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_id ON subscriptions(stripe_subscription_id);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_active ON products(is_active);

-- 8. 启用行级安全 (RLS)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- 9. 创建 RLS 策略

-- 商品：所有人可读
CREATE POLICY "Anyone can view active products"
    ON products FOR SELECT
    USING (is_active = true);

-- 订阅：用户只能查看和管理自己的订阅
CREATE POLICY "Users can view own subscriptions"
    ON subscriptions FOR SELECT
    USING (user_id = current_setting('app.user_id')::UUID);

CREATE POLICY "Users can insert own subscriptions"
    ON subscriptions FOR INSERT
    WITH CHECK (user_id = current_setting('app.user_id')::UUID);

CREATE POLICY "Users can update own subscriptions"
    ON subscriptions FOR UPDATE
    USING (user_id = current_setting('app.user_id')::UUID);

-- 订单：用户只能查看自己的订单
CREATE POLICY "Users can view own orders"
    ON orders FOR SELECT
    USING (user_id = current_setting('app.user_id')::UUID);

CREATE POLICY "Users can insert own orders"
    ON orders FOR INSERT
    WITH CHECK (user_id = current_setting('app.user_id')::UUID);

-- 订单项：暂时允许所有已认证用户访问（后续可优化）
CREATE POLICY "Users can view order items"
    ON order_items FOR SELECT
    USING (true);

-- 10. 创建更新时间戳触发器
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 删除旧触发器（如果存在）并创建新的
DROP TRIGGER IF EXISTS update_products_updated_at ON products;
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_subscriptions_updated_at ON subscriptions;
CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_orders_updated_at ON orders;
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 完成！
-- ============================================
-- 验证：运行以下查询检查表是否创建成功
-- SELECT * FROM products;
-- SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';
