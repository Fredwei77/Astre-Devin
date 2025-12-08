@echo off
chcp 65001 >nul
color 0A
cls

echo ╔══════════════════════════════════════════════════════════════╗
echo ║           登录注册功能测试                                    ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.
echo 🎯 测试内容:
echo    1. 登录功能测试
echo    2. 注册功能测试
echo    3. 邮箱验证测试
echo    4. 密码强度测试
echo    5. 会话管理测试
echo.
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.
echo 正在启动测试页面...
echo.

start test-login-register.html

timeout /t 2 >nul

echo ✅ 测试页面已打开！
echo.
echo 📋 测试说明:
echo.
echo 快速测试:
echo   • 点击"测试演示登录" - 使用演示账号登录
echo   • 点击"测试注册" - 测试新用户注册
echo   • 点击"打开登录页面" - 在新窗口打开实际登录页面
echo.
echo 详细测试:
echo   • 登录测试 - 测试不同的邮箱和密码组合
echo   • 注册测试 - 测试新用户注册流程
echo   • 验证测试 - 测试邮箱格式和密码强度验证
echo   • 会话测试 - 检查和管理用户会话
echo.
echo 演示账号:
echo   邮箱: test@example.com
echo   密码: password123
echo.
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.
pause
