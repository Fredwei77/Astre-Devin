@echo off
chcp 65001 >nul
cls
echo.
echo ╔═══════════════════════════════════════════╗
echo ║   Stripe 支付 - 最终测试                 ║
echo ╚═══════════════════════════════════════════╝
echo.

echo [步骤 1/3] 重启服务器...
echo.
taskkill /F /IM node.exe >nul 2>&1
timeout /t 2 >nul
echo ✅ 旧服务器已停止
echo.

echo 启动新服务器...
start "Destiny AI Server" cmd /k "npm start"
echo ⏳ 等待服务器启动 (8秒)...
timeout /t 8 >nul
echo ✅ 服务器已启动
echo.

echo [步骤 2/3] 测试服务器连接...
curl -s http://localhost:3000/api/health >nul 2>&1
if %errorlevel%==0 (
    echo ✅ 服务器响应正常
) else (
    echo ❌ 服务器未响应
    echo.
    echo 请检查服务器终端的错误信息
    pause
    exit /b 1
)
echo.

echo [步骤 3/3] 打开测试页面...
echo.
echo 正在打开浏览器...
start http://localhost:3000/test-stripe-api.html
timeout /t 2 >nul
echo ✅ 测试页面已打开
echo.

echo ╔═══════════════════════════════════════════╗
echo ║   ✅ 准备完成！                          ║
echo ╚═══════════════════════════════════════════╝
echo.
echo 在浏览器中:
echo 1. 点击 "测试服务器" - 应该显示成功
echo 2. 点击 "测试支付 API" - 应该显示成功
echo.
echo 如果测试失败:
echo - 查看服务器终端的错误信息
echo - 确认 .env 中有 STRIPE_SECRET_KEY
echo - 运行: npm install stripe --save
echo.
pause
