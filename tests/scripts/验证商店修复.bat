@echo off
chcp 65001 >nul
echo ========================================
echo 商店加购功能修复验证
echo ========================================
echo.
echo 正在检查修复状态...
echo.

REM 检查 fengshui.html 中的 shop-service.js
findstr /C:"<script src=\"shop-service.js\"></script>" fengshui.html >nul
if %errorlevel%==0 (
    echo ✅ fengshui.html - shop-service.js 已正确加载
) else (
    echo ❌ fengshui.html - shop-service.js 未找到
)

REM 检查文件是否存在
if exist "shop-service.js" (
    echo ✅ shop-service.js 文件存在
) else (
    echo ❌ shop-service.js 文件不存在
)

if exist "shop-ui.js" (
    echo ✅ shop-ui.js 文件存在
) else (
    echo ❌ shop-ui.js 文件不存在
)

if exist "supabase-client.js" (
    echo ✅ supabase-client.js 文件存在
) else (
    echo ❌ supabase-client.js 文件不存在
)

if exist "supabase-init.js" (
    echo ✅ supabase-init.js 文件存在
) else (
    echo ❌ supabase-init.js 文件不存在
)

echo.
echo ========================================
echo 测试选项
echo ========================================
echo.
echo 1. 打开测试页面（推荐）
echo 2. 打开风水页面直接测试
echo 3. 查看修复报告
echo 4. 退出
echo.
set /p choice="请选择 (1-4): "

if "%choice%"=="1" (
    echo.
    echo 正在打开测试页面...
    start test-shop-cart.html
) else if "%choice%"=="2" (
    echo.
    echo 正在打开风水页面...
    start fengshui.html
) else if "%choice%"=="3" (
    echo.
    echo 正在打开修复报告...
    start 商店加购修复报告.md
) else (
    echo.
    echo 退出
)

echo.
pause
