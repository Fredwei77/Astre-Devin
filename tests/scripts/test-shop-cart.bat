@echo off
echo ========================================
echo 商店购物车功能测试
echo ========================================
echo.
echo 正在打开测试页面...
echo.
start test-shop-cart.html
echo.
echo 测试页面已打开！
echo.
echo 测试步骤：
echo 1. 检查 Supabase 是否初始化成功
echo 2. 检查用户登录状态（如未登录，点击"测试登录"）
echo 3. 查看商品列表是否正确加载
echo 4. 点击"加入购物车"按钮测试
echo 5. 查看购物车内容是否更新
echo.
echo 如果遇到问题，请查看浏览器控制台的详细日志
echo.
pause
