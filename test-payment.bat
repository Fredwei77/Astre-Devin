@echo off
echo ========================================
echo 九筮支付系统测试工具
echo ========================================
echo.

echo [1] 启动测试页面（推荐）
echo [2] 启动后端服务器
echo [3] 同时启动服务器和测试页面
echo [4] 查看支付系统指南
echo.

set /p choice="请选择 (1-4): "

if "%choice%"=="1" (
    echo.
    echo 正在打开测试页面...
    start test-premium-payment.html
    echo.
    echo ✅ 测试页面已打开
    echo 💡 提示：测试模式已自动启用，无需后端服务器
    echo.
) else if "%choice%"=="2" (
    echo.
    echo 正在启动后端服务器...
    echo.
    node server.js
) else if "%choice%"=="3" (
    echo.
    echo 正在启动后端服务器...
    start cmd /k "node server.js"
    timeout /t 3 /nobreak >nul
    echo.
    echo 正在打开测试页面...
    start test-premium-payment.html
    echo.
    echo ✅ 服务器和测试页面已启动
    echo.
) else if "%choice%"=="4" (
    echo.
    echo 正在打开支付系统指南...
    start PAYMENT_SYSTEM_GUIDE.md
    echo.
    echo ✅ 指南已打开
    echo.
) else (
    echo.
    echo ❌ 无效选择
    echo.
)

pause
