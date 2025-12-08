@echo off
chcp 65001 >nul
echo ========================================
echo   用户菜单系统测试
echo   Destiny AI - User Menu Test
echo ========================================
echo.

echo [1/3] 检查文件...
if not exist "user-menu.js" (
    echo ❌ 错误: user-menu.js 文件不存在
    pause
    exit /b 1
)
echo ✅ user-menu.js 存在

if not exist "user-menu.css" (
    echo ❌ 错误: user-menu.css 文件不存在
    pause
    exit /b 1
)
echo ✅ user-menu.css 存在

if not exist "test-user-menu.html" (
    echo ❌ 错误: test-user-menu.html 文件不存在
    pause
    exit /b 1
)
echo ✅ test-user-menu.html 存在

echo.
echo [2/3] 检查集成状态...
findstr /C:"user-menu.css" "index.html" >nul
if errorlevel 1 (
    echo ⚠️  index.html 未引入 user-menu.css
) else (
    echo ✅ index.html 已引入 user-menu.css
)

findstr /C:"user-menu.js" "index.html" >nul
if errorlevel 1 (
    echo ⚠️  index.html 未引入 user-menu.js
) else (
    echo ✅ index.html 已引入 user-menu.js
)

echo.
echo [3/3] 测试说明
echo.
echo ========================================
echo   测试步骤
echo ========================================
echo.
echo 1️⃣  测试未登录状态
echo    - 点击"清除登录"按钮
echo    - 导航栏应显示"登入"按钮
echo.
echo 2️⃣  测试登录状态
echo    - 点击"模拟登录"按钮
echo    - 导航栏应显示用户信息
echo.
echo 3️⃣  测试下拉菜单
echo    - 点击用户名旁的下拉箭头
echo    - 菜单应平滑展开
echo    - 显示所有菜单项
echo.
echo 4️⃣  测试菜单关闭
echo    - 点击页面其他地方
echo    - 菜单应自动关闭
echo    - 按ESC键也应关闭
echo.
echo 5️⃣  测试退出登录
echo    - 点击"退出登录"菜单项
echo    - 应显示确认对话框
echo    - 确认后应清除登录状态
echo.
echo ========================================
echo   功能检查清单
echo ========================================
echo.
echo [ ] 未登录显示"登入"按钮
echo [ ] 已登录显示用户信息
echo [ ] 下拉菜单正常展开
echo [ ] 菜单项可以点击
echo [ ] 点击外部关闭菜单
echo [ ] ESC键关闭菜单
echo [ ] 退出登录功能正常
echo [ ] 无JavaScript错误
echo.

echo 按任意键打开测试页面...
pause >nul

start test-user-menu.html

echo.
echo ✅ 测试页面已打开
echo.
echo 📝 请按照页面上的说明进行测试
echo.
echo 📚 详细文档：
echo    - 用户菜单集成指南.md
echo    - 用户菜单完成报告.md
echo.

pause
