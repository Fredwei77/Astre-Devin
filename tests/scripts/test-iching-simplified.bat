@echo off
chcp 65001 >nul
echo.
echo ========================================
echo   易经页面简化测试
echo ========================================
echo.
echo 正在打开易经页面...
echo.
echo 优化内容：
echo   ✓ 移除"数字法"占卜方法
echo   ✓ 移除"时间法"占卜方法
echo   ✓ 移除"语音提问"占卜方法
echo   ✓ 只保留"三枚硬币"传统方法
echo   ✓ 自动选择硬币方法
echo.
echo 测试要点：
echo   1. 检查只显示一个占卜方法
echo   2. 方法卡片居中显示
echo   3. 方法已自动选中（金色边框）
echo   4. 输入问题后可直接开始占卜
echo.
echo ========================================
echo.

start http://localhost:3000/iching.html

echo.
echo ✅ 已打开易经页面
echo.
echo 💡 提示：
echo    - 页面应该只显示"三枚硬币"方法
echo    - 方法卡片应该居中且已选中
echo    - 可以直接输入问题并开始占卜
echo.
pause
