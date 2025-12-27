-- ============================================
-- Destiny AI - Supabase 数据库清理脚本
-- ============================================
-- 用途：删除所有旧表，为重新创建做准备
-- 使用方法：在执行 supabase-init.sql 之前先执行此脚本

-- 警告：此操作将删除所有数据！请谨慎使用

-- 1. 删除所有触发器
DROP TRIGGER IF EXISTS update_products_updated_at ON products;
DROP TRIGGER IF EXISTS update_subscriptions_updated_at ON subscriptions;
DROP TRIGGER IF EXISTS update_orders_updated_at ON orders;
DROP TRIGGER IF EXISTS update_users_updated_at ON users;

-- 2. 删除所有策略
DROP POLICY IF EXISTS "Anyone can view active products" ON products;
DROP POLICY IF EXISTS "Users can view own subscriptions" ON subscriptions;
DROP POLICY IF EXISTS "Users can insert own subscriptions" ON subscriptions;
DROP POLICY IF EXISTS "Users can update own subscriptions" ON subscriptions;
DROP POLICY IF EXISTS "Users can view own orders" ON orders;
DROP POLICY IF EXISTS "Users can insert own orders" ON orders;
DROP POLICY IF EXISTS "Users can view order items" ON order_items;

-- 3. 删除所有表（按依赖顺序）
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS subscriptions CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- 4. 删除函数
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;

-- ============================================
-- 完成！现在可以执行 supabase-init.sql
-- ============================================
