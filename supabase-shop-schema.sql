-- =====================================================
-- 风水商品购物系统数据库表结构
-- Feng Shui Shop Database Schema
-- =====================================================

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

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_is_active ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_products_is_featured ON products(is_featured);
CREATE INDEX IF NOT EXISTS idx_products_sort_order ON products(sort_order);

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

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_cart_items_user_id ON cart_items(user_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_product_id ON cart_items(product_id);

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
    
    -- 收货信息
    recipient_name TEXT NOT NULL,
    recipient_phone TEXT NOT NULL,
    recipient_email TEXT,
    shipping_address TEXT NOT NULL,
    shipping_city TEXT,
    shipping_province TEXT,
    shipping_postal_code TEXT,
    shipping_country TEXT DEFAULT 'China',
    
    -- 备注
    notes TEXT,
    
    -- 支付信息
    payment_method TEXT,
    payment_id TEXT,
    paid_at TIMESTAMP WITH TIME ZONE,
    
    -- 物流信息
    tracking_number TEXT,
    shipped_at TIMESTAMP WITH TIME ZONE,
    delivered_at TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);

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

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON order_items(product_id);

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
    country TEXT DEFAULT 'China',
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_shipping_addresses_user_id ON shipping_addresses(user_id);
CREATE INDEX IF NOT EXISTS idx_shipping_addresses_is_default ON shipping_addresses(is_default);

-- =====================================================
-- 6. 启用行级安全策略 (RLS)
-- =====================================================

-- Products表 - 所有人可查看，只有管理员可修改
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Products are viewable by everyone" ON products
    FOR SELECT USING (is_active = TRUE);

-- Cart表 - 用户只能操作自己的购物车
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own cart" ON cart_items
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own cart items" ON cart_items
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own cart" ON cart_items
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own cart items" ON cart_items
    FOR DELETE USING (auth.uid() = user_id);

-- Orders表 - 用户只能查看自己的订单
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own orders" ON orders
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own orders" ON orders
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Order Items表 - 通过订单关联控制
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own order items" ON order_items
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM orders 
            WHERE orders.id = order_items.order_id 
            AND orders.user_id = auth.uid()
        )
    );

-- Shipping Addresses表 - 用户只能操作自己的地址
ALTER TABLE shipping_addresses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own addresses" ON shipping_addresses
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own addresses" ON shipping_addresses
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own addresses" ON shipping_addresses
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own addresses" ON shipping_addresses
    FOR DELETE USING (auth.uid() = user_id);

-- =====================================================
-- 7. 触发器 - 自动更新 updated_at
-- =====================================================

CREATE TRIGGER update_products_updated_at
    BEFORE UPDATE ON products
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cart_items_updated_at
    BEFORE UPDATE ON cart_items
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
    BEFORE UPDATE ON orders
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_shipping_addresses_updated_at
    BEFORE UPDATE ON shipping_addresses
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 8. 函数 - 生成订单号
-- =====================================================
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TEXT AS $$
DECLARE
    order_num TEXT;
BEGIN
    order_num := 'ORD' || TO_CHAR(NOW(), 'YYYYMMDD') || LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
    RETURN order_num;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 9. 插入示例商品数据
-- =====================================================
INSERT INTO products (name, name_en, description, description_en, category, price, original_price, stock, icon, is_featured, sort_order) VALUES
('龙雕像', 'Dragon Statue', '力量与保护象征', 'Power & protection symbol', 'dragon', 49.99, 59.99, 50, '🐉', TRUE, 1),
('水晶球', 'Crystal Sphere', '清晰与能量放大器', 'Clarity & energy amplifier', 'crystal', 39.99, 49.99, 30, '💎', TRUE, 2),
('祈福手环', 'Prayer Bracelet', '祝福与灵性保护', 'Blessing & spiritual protection', 'bracelet', 29.99, 39.99, 100, '📿', TRUE, 3),
('罗盘', 'Feng Shui Compass', '专业罗盘工具', 'Professional Luopan tool', 'compass', 89.99, 99.99, 20, '🧭', FALSE, 4),
('八卦镜', 'Bagua Mirror', '化解负能量', 'Deflect negative energy', 'mirror', 34.99, 44.99, 40, '🪞', FALSE, 5),
('五帝钱币', 'Five Emperor Coins', '财富与繁荣符咒', 'Wealth & prosperity charm', 'coins', 24.99, 29.99, 60, '🪙', FALSE, 6)
ON CONFLICT DO NOTHING;

-- =====================================================
-- 完成提示
-- =====================================================
-- 执行此SQL文件后，请在Supabase Dashboard中：
-- 1. 验证所有表已创建
-- 2. 检查RLS策略是否正确
-- 3. 查看示例商品数据
