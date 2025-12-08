@echo off
echo ========================================
echo 商店 Stripe 支付集成测试
echo ========================================
echo.
echo 正在启动测试页面...
echo.
start http://localhost:3000/test-shop-stripe-integration.html
echo.
echo 测试步骤:
echo 1. 点击 "1. 测试 Stripe 初始化" 按钮
echo 2. 点击 "2. 测试 ShopUI 初始化" 按钮
echo 3. 点击 "3. 测试结账流程" 按钮
echo 4. 填写收货信息并提交
echo 5. 在 Stripe 支付页面使用测试卡号: 4242 4242 4242 4242
echo 6. 完成支付测试
echo.
echo 测试卡信息:
echo - 卡号: 4242 4242 4242 4242
echo - 到期日期: 任意未来日期 (如 12/34)
echo - CVC: 任意3位数字 (如 123)
echo - 邮编: 任意5位数字 (如 12345)
echo.
pause
