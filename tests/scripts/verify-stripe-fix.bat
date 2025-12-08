@echo off
chcp 65001 >nul
cls
echo.
echo ╔════════════════════════════════════════╗
echo ║   Stripe 支付修复验证                 ║
echo ╚════════════════════════════════════════╝
echo.

REM 检查 Stripe 包
echo [检查 1/3] Stripe SDK...
npm list stripe 2>nul | findstr "stripe@" >nul
if %errorlevel%==0 (
    echo ✅ Stripe SDK 已安装
) else (
    echo ❌ Stripe SDK 未安装
    echo.
    echo 正在安装...
    call npm install stripe --save
    if %errorlevel%==0 (
        echo ✅ 安装成功
    ) else (
        echo ❌ 安装失败
        pause
        exit /b 1
    )
)

echo.
REM 检查配置
echo [检查 2/3] .env 配置...
findstr /C:"STRIPE_SECRET_KEY" .env >nul 2>&1
if %errorlevel%==0 (
    echo ✅ STRIPE_SECRET_KEY 已配置
) else (
    echo ❌ STRIPE_SECRET_KEY 未配置
    echo.
    echo 请在 .env 文件中添加:
    echo STRIPE_SECRET_KEY=sk_test_...
    pause
    exit /b 1
)

echo.
REM 检查 server.js
echo [检查 3/3] server.js 修改...
findstr /C:"stripe.paymentIntents.create" server.js >nul 2>&1
if %errorlevel%==0 (
    echo ✅ Stripe 路由已集成到 server.js
) else (
    echo ❌ Stripe 路由未集成
    echo.
    echo 请确保 server.js 已更新
    pause
    exit /b 1
)

echo.
echo ╔════════════════════════════════════════╗
echo ║   ✅ 所有检查通过！                   ║
echo ╚════════════════════════════════════════╝
echo.
echo 现在可以启动服务器测试了
echo.
echo 选择操作:
echo [1] 启动服务器并测试
echo [2] 仅启动服务器
echo [3] 查看说明文档
echo [4] 退出
echo.
set /p choice="请选择 (1-4): "

if "%choice%"=="1" (
    echo.
    echo 正在启动服务器...
    start "Destiny AI Server" cmd /k "npm start"
    timeout /t 3 >nul
    echo 正在打开测试页面...
    start test-stripe-api.html
    echo.
    echo ✅ 完成！请查看测试结果
) else if "%choice%"=="2" (
    echo.
    echo 正在启动服务器...
    npm start
) else if "%choice%"=="3" (
    start 一步修复Stripe.txt
) else (
    echo.
    echo 退出
)

echo.
pause
