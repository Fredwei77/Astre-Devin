@echo off
chcp 65001 >nul
echo ========================================
echo Stripe 支付功能测试
echo ========================================
echo.
echo 正在检查环境...
echo.

REM 检查 Node.js
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js 未安装
    echo 请先安装 Node.js: https://nodejs.org/
    pause
    exit /b 1
)
echo ✅ Node.js 已安装

REM 检查依赖
if not exist "node_modules\stripe" (
    echo.
    echo ⚠️  Stripe 依赖未安装
    echo 正在安装依赖...
    call npm install
    if %errorlevel% neq 0 (
        echo ❌ 依赖安装失败
        pause
        exit /b 1
    )
    echo ✅ 依赖安装完成
)

REM 检查 Stripe 配置
if not exist "stripe-config.json" (
    echo.
    echo ⚠️  Stripe 产品未设置
    echo 正在设置 Stripe 产品...
    node setup-stripe-products.js
    if %errorlevel% neq 0 (
        echo ❌ Stripe 产品设置失败
        echo 请检查 .env 中的 STRIPE_SECRET_KEY
        pause
        exit /b 1
    )
    echo ✅ Stripe 产品设置完成
)

echo.
echo ========================================
echo 测试选项
echo ========================================
echo.
echo 1. 启动服务器并打开测试页面
echo 2. 仅启动服务器
echo 3. 仅打开测试页面
echo 4. 重新设置 Stripe 产品
echo 5. 查看文档
echo 6. 退出
echo.
set /p choice="请选择 (1-6): "

if "%choice%"=="1" (
    echo.
    echo 正在启动服务器...
    start "Destiny AI Server" cmd /k "npm start"
    timeout /t 3 >nul
    echo 正在打开测试页面...
    start test-stripe-payment.html
    echo.
    echo ✅ 服务器已启动，测试页面已打开
    echo.
    echo 服务器地址: http://localhost:3000
    echo 测试页面: test-stripe-payment.html
    echo.
    echo 按任意键关闭此窗口...
    pause >nul
) else if "%choice%"=="2" (
    echo.
    echo 正在启动服务器...
    npm start
) else if "%choice%"=="3" (
    echo.
    echo 正在打开测试页面...
    start test-stripe-payment.html
    echo.
    echo ✅ 测试页面已打开
    pause
) else if "%choice%"=="4" (
    echo.
    echo 正在重新设置 Stripe 产品...
    node setup-stripe-products.js
    pause
) else if "%choice%"=="5" (
    echo.
    echo 正在打开文档...
    start STRIPE_集成完成.md
    pause
) else (
    echo.
    echo 退出
)
