@echo off
echo ========================================
echo Supabase 数据库测试
echo ========================================
echo.
echo 正在启动服务器...
echo.
start http://localhost:3000/test-supabase.html
node server.js
