@echo off
chcp 65001 >nul
color 0A
cls

echo ╔══════════════════════════════════════════════════════════════╗
echo ║           登录入口优化 - 快速验证                            ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.
echo 正在验证修复...
echo.

set /a total=0
set /a passed=0
set /a failed=0

echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo 1. 检查核心文件
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.

set /a total+=1
if exist "translations.js" (
    echo [✓] translations.js 存在
    set /a passed+=1
) else (
    echo [✗] translations.js 不存在
    set /a failed+=1
)

set /a total+=1
if exist "i18n.js" (
    echo [✓] i18n.js 存在
    set /a passed+=1
) else (
    echo [✗] i18n.js 不存在
    set /a failed+=1
)

set /a total+=1
if exist "header-auth.js" (
    echo [✓] header-auth.js 存在
    set /a passed+=1
) else (
    echo [✗] header-auth.js 不存在
    set /a failed+=1
)

set /a total+=1
if exist "login.html" (
    echo [✓] login.html 存在
    set /a passed+=1
) else (
    echo [✗] login.html 不存在
    set /a failed+=1
)

echo.
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo 2. 检查 HTML 页面
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.

set /a total+=1
if exist "index.html" (
    echo [✓] index.html 存在
    set /a passed+=1
) else (
    echo [✗] index.html 不存在
    set /a failed+=1
)

set /a total+=1
if exist "divination.html" (
    echo [✓] divination.html 存在
    set /a passed+=1
) else (
    echo [✗] divination.html 不存在
    set /a failed+=1
)

set /a total+=1
if exist "fengshui.html" (
    echo [✓] fengshui.html 存在
    set /a passed+=1
) else (
    echo [✗] fengshui.html 不存在
    set /a failed+=1
)

set /a total+=1
if exist "iching.html" (
    echo [✓] iching.html 存在
    set /a passed+=1
) else (
    echo [✗] iching.html 不存在
    set /a failed+=1
)

set /a total+=1
if exist "profile.html" (
    echo [✓] profile.html 存在
    set /a passed+=1
) else (
    echo [✗] profile.html 不存在
    set /a failed+=1
)

set /a total+=1
if exist "payment.html" (
    echo [✓] payment.html 存在
    set /a passed+=1
) else (
    echo [✗] payment.html 不存在
    set /a failed+=1
)

echo.
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo 3. 检查测试文件
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.

set /a total+=1
if exist "test-login-fix.html" (
    echo [✓] test-login-fix.html 存在
    set /a passed+=1
) else (
    echo [✗] test-login-fix.html 不存在
    set /a failed+=1
)

set /a total+=1
if exist "test-login-fix.bat" (
    echo [✓] test-login-fix.bat 存在
    set /a passed+=1
) else (
    echo [✗] test-login-fix.bat 不存在
    set /a failed+=1
)

set /a total+=1
if exist "test-all-login-features.bat" (
    echo [✓] test-all-login-features.bat 存在
    set /a passed+=1
) else (
    echo [✗] test-all-login-features.bat 不存在
    set /a failed+=1
)

echo.
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo 4. 检查文档文件
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.

set /a total+=1
if exist "LOGIN_ENTRY_FIX.md" (
    echo [✓] LOGIN_ENTRY_FIX.md 存在
    set /a passed+=1
) else (
    echo [✗] LOGIN_ENTRY_FIX.md 不存在
    set /a failed+=1
)

set /a total+=1
if exist "LOGIN_FIX_CHECKLIST.md" (
    echo [✓] LOGIN_FIX_CHECKLIST.md 存在
    set /a passed+=1
) else (
    echo [✗] LOGIN_FIX_CHECKLIST.md 不存在
    set /a failed+=1
)

set /a total+=1
if exist "登录入口优化完成.md" (
    echo [✓] 登录入口优化完成.md 存在
    set /a passed+=1
) else (
    echo [✗] 登录入口优化完成.md 不存在
    set /a failed+=1
)

set /a total+=1
if exist "登录优化快速指南.txt" (
    echo [✓] 登录优化快速指南.txt 存在
    set /a passed+=1
) else (
    echo [✗] 登录优化快速指南.txt 不存在
    set /a failed+=1
)

set /a total+=1
if exist "修复摘要.txt" (
    echo [✓] 修复摘要.txt 存在
    set /a passed+=1
) else (
    echo [✗] 修复摘要.txt 不存在
    set /a failed+=1
)

set /a total+=1
if exist "登录入口修复README.md" (
    echo [✓] 登录入口修复README.md 存在
    set /a passed+=1
) else (
    echo [✗] 登录入口修复README.md 不存在
    set /a failed+=1
)

echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║                      验证结果                                ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.
echo 总测试数: %total%
echo 通过: %passed%
echo 失败: %failed%
echo.

if %failed%==0 (
    echo ✅ 所有文件验证通过！
    echo.
    echo 下一步:
    echo   1. 运行 test-all-login-features.bat 进行功能测试
    echo   2. 在浏览器中测试所有页面
    echo   3. 验证语言切换功能
    echo   4. 测试登录流程
) else (
    echo ❌ 有 %failed% 个文件缺失或验证失败
    echo.
    echo 请检查上述失败的项目
)

echo.
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo 验证完成！
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.
pause
