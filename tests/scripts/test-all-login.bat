@echo off
cls
echo.
echo ========================================
echo   测试所有登录页面
echo ========================================
echo.

echo 正在打开测试页面...
timeout /t 1 /nobreak >nul
start http://localhost:3000/test-original-login.html

echo.
timeout /t 2 /nobreak >nul

echo 正在打开原始登录页面...
start http://localhost:3000/login.html

echo.
timeout /t 2 /nobreak >nul

echo 正在打开简化登录页面...
start http://localhost:3000/login-simple.html

echo.
echo ========================================
echo 所有页面已打开！
echo ========================================
echo.
echo 测试顺序:
echo.
echo 1. test-original-login.html (测试工具)
echo    - 点击"测试登录API"验证API
echo    - 点击"打开登录页面"测试实际登录
echo.
echo 2. login.html (原始登录页面)
echo    - 输入: test@example.com / password123
echo    - 点击"登入账户"
echo    - 应该看到"登入成功！"
echo.
echo 3. login-simple.html (简化版本 - 对比)
echo    - 直接点击"登入账户"
echo    - 验证简化版本正常工作
echo.
echo ========================================
echo.
echo 重要提示:
echo - 如果原始页面不工作，请清除浏览器缓存
echo - 按 Ctrl+Shift+Delete 清除缓存
echo - 按 Ctrl+F5 硬刷新页面
echo - 或使用无痕模式测试 (Ctrl+Shift+N)
echo.
echo ========================================
echo.
pause
