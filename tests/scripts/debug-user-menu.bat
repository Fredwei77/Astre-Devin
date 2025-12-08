@echo off
chcp 65001 >nul
color 0A
cls

echo ╔══════════════════════════════════════════════════════════════╗
echo ║           用户菜单调试工具                                    ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.
echo 🔍 功能说明:
echo    • 实时预览用户菜单
echo    • 检查元素和 CSS 类
echo    • 诊断显示问题
echo    • 应用修复方案
echo.
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.
echo 正在启动调试工具...
echo.

start debug-user-menu.html

timeout /t 2 >nul

echo ✅ 调试工具已打开！
echo.
echo 📋 使用步骤:
echo.
echo 1. 点击"切换登录状态"
echo    → 模拟登录，查看用户菜单
echo.
echo 2. 点击"检查元素"
echo    → 查看元素属性和 CSS 类
echo.
echo 3. 点击"运行诊断"
echo    → 自动检测问题
echo.
echo 4. 点击"应用修复"
echo    → 应用修复方案
echo.
echo 5. 点击"测试真实页面"
echo    → 在真实页面中测试
echo.
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.
pause
