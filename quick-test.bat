@echo off
chcp 65001 >nul
echo ========================================
echo 九筮 - 快速部署测试
echo ========================================
echo.

echo [测试选项]
echo.
echo [1] 打开测试页面（推荐）
echo [2] 打开支付测试
echo [3] 打开状态检查
echo [4] 查看部署报告
echo [5] 运行所有测试
echo.

set /p choice="请选择 (1-5): "

if "%choice%"=="1" (
    echo.
    echo 正在打开测试页面...
    start deployment-test-page.html
    echo ✅ 测试页面已打开
    echo.
) else if "%choice%"=="2" (
    echo.
    echo 正在打开支付测试...
    start test-premium-payment.html
    echo ✅ 支付测试页面已打开
    echo.
) else if "%choice%"=="3" (
    echo.
    echo 正在打开状态检查...
    start payment-status-checker.html
    echo ✅ 状态检查器已打开
    echo.
) else if "%choice%"=="4" (
    echo.
    echo 正在打开部署报告...
    start DEPLOYMENT_READY_REPORT.md
    echo ✅ 部署报告已打开
    echo.
) else if "%choice%"=="5" (
    echo.
    echo 正在打开所有测试页面...
    start deployment-test-page.html
    timeout /t 1 /nobreak >nul
    start test-premium-payment.html
    timeout /t 1 /nobreak >nul
    start payment-status-checker.html
    timeout /t 1 /nobreak >nul
    start DEPLOYMENT_READY_REPORT.md
    echo.
    echo ✅ 所有测试页面已打开
    echo.
) else (
    echo.
    echo ❌ 无效选择
    echo.
)

echo ========================================
echo 测试提示：
echo ========================================
echo.
echo 1. 检查所有页面是否正常加载
echo 2. 测试中英文切换功能
echo 3. 验证用户菜单翻译
echo 4. 测试支付系统（测试模式）
echo 5. 检查小红书链接
echo 6. 验证响应式布局
echo.
echo 如发现问题，请记录并通知开发团队
echo.

pause
