-- ============================================
-- Destiny AI - Supabase 数据库清理脚本（强制版）
-- ============================================
-- 用途：强制删除所有旧表，为重新创建做准备
-- 使用方法：在执行 supabase-init.sql 之前先执行此脚本

-- 警告：此操作将删除所有数据！请谨慎使用

-- 1. 先禁用 RLS（避免权限问题）
ALTER TABLE IF EXISTS products DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS subscriptions DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS order_items DISABLE ROW LEVEL SECURITY;

-- 2. 删除所有策略（忽略错误）
DO $$ 
BEGIN
    DROP POLICY IF EXISTS "Anyone can view active products" ON products;
    DROP POLICY IF EXISTS "Users can view own subscriptions" ON subscriptions;
    DROP POLICY IF EXISTS "Users can insert own subscriptions" ON subscriptions;
    DROP POLICY IF EXISTS "Users can update own subscriptions" ON subscriptions;
    DROP POLICY IF EXISTS "Users can view own orders" ON orders;
    DROP POLICY IF EXISTS "Users can insert own orders" ON orders;
    DROP POLICY IF EXISTS "Users can view order items" ON order_items;
EXCEPTION WHEN OTHERS THEN
    NULL; -- 忽略错误
END $$;

-- 3. 删除所有触发器（忽略错误）
DO $$ 
BEGIN
    DROP TRIGGER IF EXISTS update_products_updated_at ON products;
    DROP TRIGGER IF EXISTS update_subscriptions_updated_at ON subscriptions;
    DROP TRIGGER IF EXISTS update_orders_updated_at ON orders;
    DROP TRIGGER IF EXISTS update_users_updated_at ON users;
EXCEPTION WHEN OTHERS THEN
    NULL; -- 忽略错误
END $$;

-- 4. 强制删除所有表（按依赖顺序，使用 CASCADE）
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS subscriptions CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- 5. 删除函数
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;

-- ============================================
-- 完成！现在可以执行 supabase-init.sql
-- ============================================
-- 验证：运行以下查询确认表已删除
-- SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name IN ('products', 'users', 'orders', 'subscriptions', 'order_items');
