@echo off
chcp 65001 >nul
echo ========================================
echo 测试完整结账流程
echo ========================================
echo.
echo 正在打开结账流程测试页面...
start http://localhost:3000/test-checkout-complete.html
echo.
echo ========================================
echo 测试步骤
echo ========================================
echo.
echo 步骤 1: 商品信息
echo - 查看商品详情（Dragon Statue - $49.99）
echo - 点击"继续 - 填写收货信息"
echo.
echo 步骤 2: 收货信息
echo - 表单已预填充测试数据
echo - 可以直接点击"继续 - 支付"
echo - 或修改信息后提交
echo.
echo 步骤 3: 支付
echo - 查看订单摘要（总计 $59.99）
echo - 填写 Stripe 测试卡号:
echo   卡号: 4242 4242 4242 4242
echo   到期: 12/34
echo   CVC: 123
echo   邮编: 12345
echo - 点击"支付 $59.99"
echo.
echo 步骤 4: 完成
echo - 查看支付成功消息
echo - 查看订单详情
echo.
pause
