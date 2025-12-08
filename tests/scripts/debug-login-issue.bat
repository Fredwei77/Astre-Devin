@echo off
echo ========================================
echo 登录问题诊断工具
echo ========================================
echo.
echo 这个工具将帮助你诊断登录问题：
echo 1. 检查Supabase连接
echo 2. 测试注册功能
echo 3. 测试登录功能
echo 4. 检查用户状态
echo.
echo 正在启动诊断工具...
echo.
start http://localhost:3000/debug-login-issue.html
node server.js
