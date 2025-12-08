@echo off
chcp 65001 >nul
echo ========================================
echo 测试登录（CSP 已修复）
echo ========================================
echo.
echo CSP 修复内容:
echo ✓ 添加 Supabase 域名支持
echo ✓ 添加 Google Fonts 支持
echo ✓ 添加 WebSocket 支持
echo.
echo 正在打开登录页面...
start http://localhost:3000/login.html
echo.
echo 测试步骤:
echo 1. 打开浏览器开发者工具 (F12)
echo 2. 查看 Console 标签
echo 3. 确认没有 CSP 错误
echo 4. 尝试登录
echo.
echo 测试账号:
echo 邮箱: fredwei@gmail.com
echo 密码: test123456
echo.
pause
