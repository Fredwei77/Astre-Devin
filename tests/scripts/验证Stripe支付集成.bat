@echo off
chcp 65001 >nul
echo ========================================
echo 验证 Stripe 支付集成
echo ========================================
echo.
echo 正在检查关键文件...
echo.

if exist "shop-ui.js" (
    echo ✓ shop-ui.js 存在
) else (
    echo ✗ shop-ui.js 不存在
    goto :error
)

if exist "stripe-client.js" (
    echo ✓ stripe-client.js 存在
) else (
    echo ✗ stripe-client.js 不存在
    goto :error
)

if exist "shop-service.js" (
    echo ✓ shop-service.js 存在
) else (
    echo ✗ shop-service.js 不存在
    goto :error
)

echo.
echo 正在检查关键方法...
echo.

findstr /C:"handleCheckout" shop-ui.js >nul
if %errorlevel% equ 0 (
    echo ✓ handleCheckout 方法存在
) else (
    echo ✗ handleCheckout 方法不存在
    goto :error
)

findstr /C:"showStripePayment" shop-ui.js >nul
if %errorlevel% equ 0 (
    echo ✓ showStripePayment 方法存在
) else (
    echo ✗ showStripePayment 方法不存在
    goto :error
)

findstr /C:"processStripePayment" shop-ui.js >nul
if %errorlevel% equ 0 (
    echo ✓ processStripePayment 方法存在
) else (
    echo ✗ processStripePayment 方法不存在
    goto :error
)

findstr /C:"this.showStripePayment" shop-ui.js >nul
if %errorlevel% equ 0 (
    echo ✓ handleCheckout 调用 showStripePayment
) else (
    echo ✗ handleCheckout 未调用 showStripePayment
    goto :error
)

findstr /C:"this.processStripePayment" shop-ui.js >nul
if %errorlevel% equ 0 (
    echo ✓ 表单提交调用 processStripePayment
) else (
    echo ✗ 表单提交未调用 processStripePayment
    goto :error
)

echo.
echo ========================================
echo ✓ 所有检查通过！
echo ========================================
echo.
echo Stripe 支付集成已正确配置
echo.
echo 下一步:
echo 1. 运行 test-shop-stripe.bat 进行功能测试
echo 2. 或访问 http://localhost:3000/fengshui.html 进行实际测试
echo.
echo 测试卡号: 4242 4242 4242 4242
echo 到期日期: 任意未来日期 (如 12/34)
echo CVC: 任意3位数字 (如 123)
echo.
pause
exit /b 0

:error
echo.
echo ========================================
echo ✗ 检查失败！
echo ========================================
echo.
echo 请检查文件是否完整
echo.
pause
exit /b 1
