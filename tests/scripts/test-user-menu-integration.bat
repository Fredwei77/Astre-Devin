@echo off
chcp 65001 >nul
echo.
echo ========================================
echo   用户菜单集成测试
echo ========================================
echo.
echo 正在启动验证页面...
echo.

start http://localhost:3000/verify-user-menu-integration.html

echo.
echo ✅ 已打开集成验证页面
echo.
echo 📋 验证页面功能：
echo    - 查看所有页面的集成状态
echo    - 快速打开各个测试页面
echo    - 查看测试清单和文档
echo    - 清除登录状态进行测试
echo.
echo 💡 提示：
echo    - 如果服务器未启动，请先运行 start.bat
echo    - 可以在验证页面中打开所有测试页面
echo    - 测试完成后可以关闭此窗口
echo.
pause
