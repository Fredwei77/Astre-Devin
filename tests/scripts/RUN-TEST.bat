@echo off
cls
echo.
echo ========================================
echo   Stripe 支付测试
echo ========================================
echo.
echo 正在打开测试页面...
echo.

start http://localhost:3000/test-now.html?t=%time::=-%

echo.
echo 测试页面已打开！
echo.
echo 如果页面显示错误:
echo 1. 确保服务器正在运行 (npm start)
echo 2. 查看服务器终端的错误信息
echo 3. 点击页面上的"重新测试"按钮
echo.
pause
