@echo off
echo ========================================
echo 风水商店功能测试
echo Feng Shui Shop Testing
echo ========================================
echo.
echo 正在启动本地服务器...
echo.

start http://localhost:8000/fengshui.html

echo.
echo 测试步骤:
echo 1. 浏览商品列表
echo 2. 添加商品到购物车
echo 3. 查看购物车
echo 4. 进行结算
echo 5. 查看订单
echo.
echo 管理后台: http://localhost:8000/admin-shop.html
echo.
pause
