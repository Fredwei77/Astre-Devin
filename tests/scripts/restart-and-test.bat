@echo off
chcp 65001 >nul
echo ========================================
echo 重启服务器并测试 Stripe
echo ========================================
echo.

echo 步骤 1: 停止现有服务器
taskkill /F /IM node.exe >nul 2>&1
timeout /t 2 >nul
echo ✅ 服务器已停止

echo.
echo 步骤 2: 启动服务器
start "Destiny AI Server" cmd /k "npm start"
echo ⏳ 等待服务器启动...
timeout /t 5 >nul

echo.
echo 步骤 3: 测试 API
echo 正在打开测试页面...
start test-stripe-api.html

echo.
echo ========================================
echo ✅ 完成！
echo ========================================
echo.
echo 请查看测试页面的结果
echo 如果测试失败，请查看服务器终端的错误信息
echo.
pause
