@echo off
echo ========================================
echo Supabase 认证问题修复
echo ========================================
echo.
echo 问题: 注册成功但无法登录
echo 错误: Invalid login credentials
echo.
echo 解决方案:
echo 1. 禁用邮箱验证（开发测试）
echo 2. 手动验证用户
echo.
echo 正在打开修复指南...
echo.
start http://localhost:3000/fix-supabase-auth.html
node server.js
