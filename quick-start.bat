@echo off
cls
echo.
echo ========================================
echo   Destiny AI - 快速启动
echo ========================================
echo.
echo 正在打开调试页面...
echo.

REM 等待一下确保服务器准备好
timeout /t 2 /nobreak >nul

REM 打开调试页面
start http://localhost:3000/debug.html

echo.
echo ========================================
echo 调试页面已打开！
echo ========================================
echo.
echo 页面地址: http://localhost:3000/debug.html
echo.
echo 在调试页面中你可以:
echo - 检查服务器状态
echo - 测试所有API端点
echo - 测试页面访问
echo - 查看实时日志
echo.
echo 测试账户:
echo   邮箱: test@example.com
echo   密码: password123
echo.
echo ========================================
echo.
pause
