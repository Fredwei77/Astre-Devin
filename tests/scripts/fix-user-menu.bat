@echo off
chcp 65001 >nul
echo ========================================
echo   用户菜单一键修复工具
echo   Destiny AI - User Menu Fix
echo ========================================
echo.

echo [1/4] 检查问题...
echo.

set "issues=0"

REM 检查Font Awesome
findstr /C:"font-awesome" "index.html" >nul
if errorlevel 1 (
    echo ❌ 问题1: Font Awesome 未引入
    set /a issues+=1
) else (
    echo ✅ Font Awesome 已引入
)

REM 检查user-menu.css
findstr /C:"user-menu.css" "index.html" >nul
if errorlevel 1 (
    echo ❌ 问题2: user-menu.css 未引入
    set /a issues+=1
) else (
    echo ✅ user-menu.css 已引入
)

REM 检查auth-service.js
findstr /C:"auth-service.js" "index.html" >nul
if errorlevel 1 (
    echo ❌ 问题3: auth-service.js 未引入
    set /a issues+=1
) else (
    echo ✅ auth-service.js 已引入
)

REM 检查user-menu.js
findstr /C:"user-menu.js" "index.html" >nul
if errorlevel 1 (
    echo ❌ 问题4: user-menu.js 未引入
    set /a issues+=1
) else (
    echo ✅ user-menu.js 已引入
)

echo.
echo [2/4] 检查文件...
echo.

if not exist "user-menu.js" (
    echo ❌ user-menu.js 文件不存在
    set /a issues+=1
) else (
    echo ✅ user-menu.js 文件存在
)

if not exist "user-menu.css" (
    echo ❌ user-menu.css 文件不存在
    set /a issues+=1
) else (
    echo ✅ user-menu.css 文件存在
)

if not exist "auth-service.js" (
    echo ❌ auth-service.js 文件不存在
    set /a issues+=1
) else (
    echo ✅ auth-service.js 文件存在
)

echo.
echo [3/4] 诊断结果
echo.

if %issues% equ 0 (
    echo ✅ 所有检查都通过了！
    echo.
    echo 如果用户菜单仍然不显示，请：
    echo 1. 清除浏览器缓存（Ctrl + F5）
    echo 2. 打开 diagnose-user-menu.html 进行详细诊断
    echo 3. 查看浏览器控制台（F12）的错误信息
) else (
    echo ⚠️  发现 %issues% 个问题
    echo.
    echo 请按照以下步骤修复：
    echo.
    echo 1. 确认所有文件都在正确位置
    echo 2. 查看 用户菜单修复指南.md
    echo 3. 运行 diagnose-user-menu.html 进行详细诊断
)

echo.
echo [4/4] 快速测试
echo.
echo 按任意键打开诊断工具...
pause >nul

start diagnose-user-menu.html

echo.
echo ✅ 诊断工具已打开
echo.
echo 📚 相关文档：
echo    - 用户菜单修复指南.md
echo    - 用户菜单集成指南.md
echo    - 用户菜单完成报告.md
echo.
echo 🧪 测试页面：
echo    - diagnose-user-menu.html
echo    - test-user-menu.html
echo.

pause
