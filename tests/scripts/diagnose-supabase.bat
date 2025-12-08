@echo off
echo ========================================
echo Supabase 诊断工具
echo ========================================
echo.
echo 这个工具将帮助你：
echo 1. 检查当前配置
echo 2. 测试新的API密钥
echo 3. 生成更新代码
echo.
echo 正在启动...
echo.
start http://localhost:3000/diagnose-supabase.html
node server.js
