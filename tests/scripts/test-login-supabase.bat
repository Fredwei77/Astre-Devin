@echo off
echo ========================================
echo 测试 Supabase 登录集成
echo ========================================
echo.
echo 已完成的集成:
echo [x] login.html 已添加 Supabase 脚本
echo [x] login.js 已更新登录逻辑
echo [x] login.js 已更新注册逻辑
echo.
echo 测试步骤:
echo 1. 打开登录页面
echo 2. 尝试注册新用户
echo 3. 尝试登录
echo 4. 验证跳转到主页
echo.
echo 正在启动测试...
echo.
start http://localhost:3000/login.html
node server.js
