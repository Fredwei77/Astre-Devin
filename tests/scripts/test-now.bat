@echo off
chcp 65001 >nul
cls
echo ========================================
echo 立即测试 Stripe 支付
echo ========================================
echo.

echo [1/4] 停止现有服务器...
taskkill /F /IM node.exe >nul 2>&1
timeout /t 1 >nul
echo ✅ 完成

echo.
echo [2/4] 启动新服务器...
start "Destiny AI Server" cmd /k "npm start"
echo ⏳ 等待服务器启动 (5秒)...
timeout /t 5 >nul
echo ✅ 完成

echo.
echo [3/4] 测试 API 连接...
curl -s http://localhost:3000/api/health >nul 2>&1
if %errorlevel%==0 (
    echo ✅ 服务器连接成功
) else (
    echo ❌ 服务器连接失败
    echo.
    echo 请检查服务器终端的错误信息
    pause
    exit /b 1
)

echo.
echo [4/4] 打开测试页面...
start test-stripe-api.html
echo ✅ 完成

echo.
echo ========================================
echo ✅ 测试准备完成！
echo ========================================
echo.
echo 请查看测试页面：
echo 1. 点击"测试服务器" - 应该显示成功
echo 2. 点击"测试支付 API" - 应该显示成功
echo.
echo 如果仍然失败，请查看服务器终端的错误信息
echo.
pause
