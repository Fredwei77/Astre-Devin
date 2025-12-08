@echo off
chcp 65001 >nul
color 0A
cls

echo ╔══════════════════════════════════════════════════════════════╗
echo ║           退出按钮功能测试                                    ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.
echo 🎯 测试内容:
echo    1. 登录后显示用户菜单
echo    2. 用户菜单包含退出按钮
echo    3. 点击退出按钮可以退出登录
echo.
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.
echo 正在启动测试页面...
echo.

start test-logout-button.html

timeout /t 2 >nul

echo ✅ 测试页面已打开！
echo.
echo 📋 测试步骤:
echo.
echo 1. 点击"模拟登录"按钮
echo    → 应该显示用户头像、名称和下拉箭头
echo.
echo 2. 点击下拉箭头
echo    → 应该显示用户菜单
echo.
echo 3. 检查用户菜单内容
echo    → 应该包含"个人资料"、"会员服务"和"退出登入"
echo.
echo 4. 点击"退出登入"按钮
echo    → 应该退出登录并恢复到未登录状态
echo.
echo 5. 点击"测试真实页面"
echo    → 在真实的 index.html 中测试完整流程
echo.
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.
pause
