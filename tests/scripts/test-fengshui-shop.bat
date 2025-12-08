@echo off
chcp 65001 >nul
echo ========================================
echo 测试风水商店（CSP 已修复）
echo ========================================
echo.
echo CSP 修复内容:
echo ✓ 添加 'unsafe-eval' 支持动态代码
echo ✓ 添加 'unsafe-hashes' 支持内联事件
echo ✓ Supabase 和 Stripe 已配置
echo.
echo 正在打开风水商店页面...
start http://localhost:3000/fengshui.html
echo.
echo 测试步骤:
echo 1. 登录账号（如果未登录）
echo 2. 滚动到页面底部的"风水商品商店"
echo 3. 点击"加入购物车"或"立即购买"
echo 4. 填写收货信息
echo 5. 使用 Stripe 测试卡号完成支付
echo.
echo Stripe 测试卡号:
echo 卡号: 4242 4242 4242 4242
echo 到期: 12/34
echo CVC: 123
echo 邮编: 12345
echo.
pause
