@echo off
chcp 65001 >nul
echo ========================================
echo Stripe 支付问题修复
echo ========================================
echo.

echo 步骤 1: 检查 Node.js
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js 未安装
    pause
    exit /b 1
)
echo ✅ Node.js 已安装

echo.
echo 步骤 2: 安装/更新依赖
echo 正在安装 Stripe SDK...
call npm install stripe --save
if %errorlevel% neq 0 (
    echo ❌ 安装失败
    pause
    exit /b 1
)
echo ✅ Stripe SDK 已安装

echo.
echo 步骤 3: 检查 .env 配置
if not exist ".env" (
    echo ❌ .env 文件不存在
    pause
    exit /b 1
)
findstr /C:"STRIPE_SECRET_KEY" .env >nul
if %errorlevel% neq 0 (
    echo ❌ .env 中缺少 STRIPE_SECRET_KEY
    pause
    exit /b 1
)
echo ✅ .env 配置正确

echo.
echo 步骤 4: 重启服务器
echo 正在停止现有服务器...
taskkill /F /IM node.exe >nul 2>&1
timeout /t 2 >nul

echo 正在启动服务器...
start "Destiny AI Server" cmd /k "npm start"
timeout /t 3 >nul

echo.
echo 步骤 5: 运行诊断
echo 正在打开诊断页面...
start diagnose-stripe.html

echo.
echo ========================================
echo ✅ 修复完成！
echo ========================================
echo.
echo 请查看诊断页面的结果
echo 如果仍有问题，请检查浏览器控制台
echo.
pause
