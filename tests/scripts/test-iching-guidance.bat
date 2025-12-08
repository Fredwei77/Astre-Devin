@echo off
chcp 65001 >nul
echo.
echo ========================================
echo   易经卦前提示测试
echo ========================================
echo.
echo 正在打开易经页面...
echo.
echo 优化内容：
echo   ✓ 移除"选择您的占卜方法"标题
echo   ✓ 添加"卦前提示"标题
echo   ✓ 添加七条占卜注意事项
echo   ✓ 保留三枚硬币方法说明
echo.
echo 卦前提示内容：
echo   1. 无事不占 - 先尽人事，后听天命
echo   2. 体耗不占 - 状态未恢复前不占
echo   3. 心疲不占 - 精神状态不佳不占
echo   4. 天异不占 - 特殊时间不占
echo   5. 疑则不占 - 心诚则灵
echo   6. 避众而占 - 不在众人面前占
echo   7. 静心而占 - 安静环境专注占卜
echo.
echo ========================================
echo.

start http://localhost:3000/iching.html

echo.
echo ✅ 已打开易经页面
echo.
echo 💡 测试要点：
echo    - 检查是否显示"卦前提示"标题
echo    - 验证七条注意事项完整显示
echo    - 确认三枚硬币方法说明在底部
echo    - 测试语言切换功能
echo.
pause
