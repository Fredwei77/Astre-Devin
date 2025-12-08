@echo off
chcp 65001 >nul
cls
color 0A
echo.
echo ╔═══════════════════════════════════════════════════════════╗
echo ║                                                           ║
echo ║          Stripe 支付测试 - 从这里开始                    ║
echo ║                                                           ║
echo ╚═══════════════════════════════════════════════════════════╝
echo.
echo.

echo [步骤 1/4] 检查环境...
echo.

REM 检查 Node.js
node --version >nul 2>&1
if %errorlevel% neq 0 (
    color 0C
    echo ❌ Node.js 未安装
    echo.
    echo 请先安装 Node.js: https://nodejs.org/
    pause
    exit /b 1
)
echo ✅ Node.js 已安装

REM 检查 Stripe 包
npm list stripe 2>nul | findstr "stripe@" >nul
if %errorlevel% neq 0 (
    echo ⚠️  Stripe SDK 未安装
    echo.
    echo 正在安装 Stripe...
    call npm install stripe --save
    if %errorlevel% neq 0 (
        color 0C
        echo ❌ 安装失败
        pause
        exit /b 1
    )
    echo ✅ Stripe 已安装
) else (
    echo ✅ Stripe SDK 已安装
)

REM 检查配置
findstr /C:"STRIPE_SECRET_KEY" .env >nul 2>&1
if %errorlevel% neq 0 (
    color 0C
    echo ❌ .env 中缺少 STRIPE_SECRET_KEY
    echo.
    echo 请在 .env 文件中添加:
    echo STRIPE_SECRET_KEY=sk_test_...
    pause
    exit /b 1
)
echo ✅ Stripe 密钥已配置

echo.
echo [步骤 2/4] 停止旧服务器...
taskkill /F /IM node.exe >nul 2>&1
timeout /t 1 >nul
echo ✅ 完成

echo.
echo [步骤 3/4] 启动服务器...
echo.
echo 正在启动...
start "Destiny AI Server - 请保持此窗口打开" cmd /k "npm start"

echo ⏳ 等待服务器启动...
timeout /t 3 >nul
echo    3...
timeout /t 1 >nul
echo    2...
timeout /t 1 >nul
echo    1...
timeout /t 1 >nul

echo.
echo [步骤 4/4] 验证服务器...
echo.

REM 等待服务器响应
set /a attempts=0
:check_server
set /a attempts+=1
curl -s http://localhost:3000/api/health >nul 2>&1
if %errorlevel%==0 (
    echo ✅ 服务器启动成功！
    goto server_ready
)

if %attempts% lss 10 (
    timeout /t 1 >nul
    goto check_server
)

color 0E
echo ⚠️  服务器可能未完全启动
echo.
echo 请检查服务器窗口的错误信息
echo.

:server_ready
echo.
echo ╔═══════════════════════════════════════════════════════════╗
echo ║                                                           ║
echo ║          ✅ 准备完成！                                   ║
echo ║                                                           ║
echo ╚═══════════════════════════════════════════════════════════╝
echo.
echo 正在打开测试页面...
timeout /t 2 >nul

start http://localhost:3000/test-stripe-api.html

echo.
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.
echo 📋 测试步骤:
echo.
echo 1. 在浏览器中点击 "测试服务器"
echo    应该显示: ✅ 服务器连接成功
echo.
echo 2. 点击 "测试支付 API"
echo    应该显示: ✅ 支付意图创建成功
echo.
echo 3. 如果成功，可以测试完整支付:
echo    http://localhost:3000/test-stripe-payment.html
echo.
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.
echo ⚠️  重要提示:
echo    - 请保持服务器窗口打开
echo    - 如果测试失败，查看服务器窗口的错误信息
echo    - 测试卡号: 4242 4242 4242 4242
echo.
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.
pause
