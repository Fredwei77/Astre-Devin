@echo off
echo ========================================
echo Destiny AI - 诊断工具
echo ========================================
echo.

echo 检查关键文件...
echo.

if exist login.html (
    echo [OK] login.html 存在
) else (
    echo [ERROR] login.html 不存在
)

if exist login.js (
    echo [OK] login.js 存在
) else (
    echo [ERROR] login.js 不存在
)

if exist login.css (
    echo [OK] login.css 存在
) else (
    echo [ERROR] login.css 不存在
)

if exist test-login.html (
    echo [OK] test-login.html 存在
) else (
    echo [ERROR] test-login.html 不存在
)

if exist test-simple.html (
    echo [OK] test-simple.html 存在
) else (
    echo [ERROR] test-simple.html 不存在
)

if exist server-test.js (
    echo [OK] server-test.js 存在
) else (
    echo [ERROR] server-test.js 不存在
)

if exist mystical-theme.css (
    echo [OK] mystical-theme.css 存在
) else (
    echo [WARNING] mystical-theme.css 不存在
)

echo.
echo 测试服务器连接...
curl http://localhost:3000/api/health 2>nul
if %ERRORLEVEL% EQU 0 (
    echo.
    echo [OK] 服务器正常运行
) else (
    echo.
    echo [ERROR] 服务器未运行或无法连接
)

echo.
echo ========================================
echo 诊断完成
echo ========================================
echo.
echo 建议操作:
echo 1. 如果服务器未运行，执行: node server-test.js
echo 2. 访问简单测试页: http://localhost:3000/test-simple.html
echo 3. 访问登录页面: http://localhost:3000/login.html
echo 4. 访问完整测试页: http://localhost:3000/test-login.html
echo.
pause
