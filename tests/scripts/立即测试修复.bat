@echo off
chcp 65001 >nul
echo ========================================
echo 立即测试商店修复
echo ========================================
echo.
echo 测试 1: 独立测试页面
echo 正在打开...
start http://localhost:3000/test-shop-standalone.html
timeout /t 2 >nul
echo.
echo 测试 2: 修复版测试页面
echo 正在打开...
start http://localhost:3000/test-fengshui-fixed.html
echo.
echo ========================================
echo 测试说明
echo ========================================
echo.
echo 页面 1: test-shop-standalone.html
echo - 基本按钮点击测试
echo - 验证 CSP 是否禁用
echo - 所有按钮应该可以点击
echo.
echo 页面 2: test-fengshui-fixed.html
echo - 完整商店功能测试
echo - 使用修复版代码
echo - 符合 CSP 安全策略
echo.
echo 如果两个页面的按钮都可以点击，说明修复成功！
echo.
pause
