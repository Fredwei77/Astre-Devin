-- =====================================================
-- Destiny AI 完整数据库设置
-- Complete Database Setup for Destiny AI
-- =====================================================
-- 这个文件包含所有必要的表和函数
-- 可以安全地重复执行
-- =====================================================

-- =====================================================
-- 0. 创建必要的函数
-- =====================================================

-- 创建 update_updated_at_column 函数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 1. 商品表 (Products)
-- =====================================================
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    name_en TEXT,
    description TEXT,
    description_en TEXT,
    category TEXT NOT NULL CHECK (category IN ('dragon', 'crystal', 'bracelet', 'compass', 'mirror', 'coins', 'other')),
    price DECIMAL(10, 2) NOT NULL,
    original_price DECIMAL(10, 2),
    stock INTEGER NOT NULL DEFAULT 0,
    image_url TEXT,
    icon TEXT DEFAULT '🎁',
    is_active BOOLEAN DEFAULT TRUE,
    is_featured BOOLEAN DEFAULT FALSE,
    sort_order INTEGER DEFAULT 0,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_is_active ON products(is_active);

-- =====================================================
-- 2. 购物车表 (Cart)
-- =====================================================
CREATE TABLE IF NOT EXISTS cart_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, product_id)
);

CREATE INDEX IF NOT EXISTS idx_cart_items_user_id ON cart_items(user_id);

-- =====================================================
-- 3. 订单表 (Orders)
-- =====================================================
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    order_number TEXT UNIQUE NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled')),
    total_amount DECIMAL(10, 2) NOT NULL,
    shipping_fee DECIMAL(10, 2) DEFAULT 0,
    
    recipient_name TEXT NOT NULL,
    recipient_phone TEXT NOT NULL,
    recipient_email TEXT,
    shipping_address TEXT NOT NULL,
    shipping_city TEXT,
    shipping_province TEXT,
    shipping_postal_code TEXT,
    
    notes TEXT,
    payment_method TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);

-- =====================================================
-- 4. 订单明细表 (Order Items)
-- =====================================================
CREATE TABLE IF NOT EXISTS order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id),
    product_name TEXT NOT NULL,
    product_price DECIMAL(10, 2) NOT NULL,
    quantity INTEGER NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);

-- =====================================================
-- 5. 收货地址表 (Shipping Addresses)
-- =====================================================
CREATE TABLE IF NOT EXISTS shipping_addresses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    recipient_name TEXT NOT NULL,
    recipient_phone TEXT NOT NULL,
    address TEXT NOT NULL,
    city TEXT,
    province TEXT,
    postal_code TEXT,
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_shipping_addresses_user_id ON shipping_addresses(user_id);

-- =====================================================
-- 6. 扩展 profiles 表
-- =====================================================
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'free';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS subscription_plan TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS subscription_start_date TIMESTAMP WITH TIME ZONE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS subscription_end_date TIMESTAMP WITH TIME ZONE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS total_spent DECIMAL(10, 2) DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS last_payment_date TIMESTAMP WITH TIME ZONE;

CREATE INDEX IF NOT EXISTS idx_profiles_subscription_status ON profiles(subscription_status);

-- =====================================================
-- 7. 付费记录表 (Payments)
-- =====================================================
CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    payment_id TEXT UNIQUE,
    amount DECIMAL(10, 2) NOT NULL,
    currency TEXT DEFAULT 'USD',
    payment_method TEXT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
    subscription_plan TEXT,
    notes TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);

-- =====================================================
-- 8. 占卜记录表 (Readings)
-- =====================================================
CREATE TABLE IF NOT EXISTS readings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    reading_type TEXT NOT NULL CHECK (reading_type IN ('divination', 'iching', 'fengshui')),
    category TEXT,
    question TEXT,
    birth_date DATE,
    birth_time TIME,
    result JSONB,
    hexagram TEXT,
    interpretation TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_readings_user_id ON readings(user_id);
CREATE INDEX IF NOT EXISTS idx_readings_type ON readings(reading_type);

-- =====================================================
-- 9. 用户活动日志表
-- =====================================================
CREATE TABLE IF NOT EXISTS user_activity_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    activity_type TEXT NOT NULL,
    activity_description TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_activity_logs_user_id ON user_activity_logs(user_id);

-- =====================================================
-- 10. 启用 RLS
-- =====================================================

ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE shipping_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE readings ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_activity_logs ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 11. RLS 策略
-- =====================================================

-- Products - 所有人可查看
DROP POLICY IF EXISTS "Products are viewable by everyone" ON products;
CREATE POLICY "Products are viewable by everyone" ON products
    FOR SELECT USING (is_active = TRUE);

-- Cart - 用户只能操作自己的购物车
DROP POLICY IF EXISTS "Users can view own cart" ON cart_items;
CREATE POLICY "Users can view own cart" ON cart_items
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own cart items" ON cart_items;
CREATE POLICY "Users can insert own cart items" ON cart_items
    FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own cart" ON cart_items;
CREATE POLICY "Users can update own cart" ON cart_items
    FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own cart items" ON cart_items;
CREATE POLICY "Users can delete own cart items" ON cart_items
    FOR DELETE USING (auth.uid() = user_id);

-- Orders - 用户只能查看自己的订单
DROP POLICY IF EXISTS "Users can view own orders" ON orders;
CREATE POLICY "Users can view own orders" ON orders
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create own orders" ON orders;
CREATE POLICY "Users can create own orders" ON orders
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Order Items
DROP POLICY IF EXISTS "Users can view own order items" ON order_items;
CREATE POLICY "Users can view own order items" ON order_items
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM orders 
            WHERE orders.id = order_items.order_id 
            AND orders.user_id = auth.uid()
        )
    );

-- Shipping Addresses
DROP POLICY IF EXISTS "Users can manage own addresses" ON shipping_addresses;
CREATE POLICY "Users can manage own addresses" ON shipping_addresses
    FOR ALL USING (auth.uid() = user_id);

-- Payments
DROP POLICY IF EXISTS "Users can view own payments" ON payments;
CREATE POLICY "Users can view own payments" ON payments
    FOR SELECT USING (auth.uid() = user_id);

-- Readings
DROP POLICY IF EXISTS "Users can view own readings" ON readings;
CREATE POLICY "Users can view own readings" ON readings
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create own readings" ON readings;
CREATE POLICY "Users can create own readings" ON readings
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Activity Logs
DROP POLICY IF EXISTS "Users can view own activity logs" ON user_activity_logs;
CREATE POLICY "Users can view own activity logs" ON user_activity_logs
    FOR SELECT USING (auth.uid() = user_id);

-- =====================================================
-- 12. 触发器
-- =====================================================

DROP TRIGGER IF EXISTS update_products_updated_at ON products;
CREATE TRIGGER update_products_updated_at
    BEFORE UPDATE ON products
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_payments_updated_at ON payments;
CREATE TRIGGER update_payments_updated_at
    BEFORE UPDATE ON payments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 13. 插入示例商品
-- =====================================================
INSERT INTO products (name, name_en, description, description_en, category, price, stock, icon, is_featured, sort_order) VALUES
('龙雕像', 'Dragon Statue', '力量与保护象征', 'Power & protection symbol', 'dragon', 49.99, 50, '🐉', TRUE, 1),
('水晶球', 'Crystal Sphere', '清晰与能量放大器', 'Clarity & energy amplifier', 'crystal', 39.99, 30, '💎', TRUE, 2),
('祈福手环', 'Prayer Bracelet', '祝福与灵性保护', 'Blessing & spiritual protection', 'bracelet', 29.99, 100, '📿', TRUE, 3),
('罗盘', 'Feng Shui Compass', '专业罗盘工具', 'Professional Luopan tool', 'compass', 89.99, 20, '🧭', FALSE, 4),
('八卦镜', 'Bagua Mirror', '化解负能量', 'Deflect negative energy', 'mirror', 34.99, 40, '🪞', FALSE, 5),
('五帝钱币', 'Five Emperor Coins', '财富与繁荣符咒', 'Wealth & prosperity charm', 'coins', 24.99, 60, '🪙', FALSE, 6)
ON CONFLICT DO NOTHING;

-- =====================================================
-- 完成！
-- =====================================================
SELECT 'All tables created successfully! 所有表创建成功！' as message;
