@echo off
cls
echo.
echo ========================================
echo   验证登录页面修复
echo ========================================
echo.

echo 正在打开测试页面...
timeout /t 1 /nobreak >nul
start http://localhost:3000/login-test.html

echo.
timeout /t 2 /nobreak >nul

echo 正在打开登录页面...
start http://localhost:3000/login.html

echo.
echo ========================================
echo 页面已打开！
echo ========================================
echo.
echo 测试步骤:
echo.
echo 1. 在 login-test.html 中:
echo    - 点击"测试 JavaScript"
echo    - 点击"测试登录"
echo    - 确认所有测试通过
echo.
echo 2. 在 login.html 中:
echo    - 输入: test@example.com
echo    - 密码: password123
echo    - 点击"登入账户"
echo    - 应该看到"登入成功！"
echo.
echo 3. 测试注册功能:
echo    - 切换到"注册"标签
echo    - 填写表单
echo    - 点击"创建账户"
echo    - 应该看到"注册成功！"
echo.
echo ========================================
echo.
pause
