@echo off
chcp 65001 >nul
echo.
echo ========================================
echo   易经页面翻译测试
echo ========================================
echo.
echo 正在打开易经页面进行翻译测试...
echo.
echo 测试内容：
echo   ✓ 页面标题和副标题
echo   ✓ 占卜方法选择
echo   ✓ 投掷硬币界面
echo   ✓ 卦象解读内容
echo   ✓ 卦辞、象辞、建议
echo.
echo 测试步骤：
echo   1. 检查页面是否正确显示中文
echo   2. 切换语言选择器测试
echo   3. 检查默认卦象内容是否翻译
echo   4. 验证所有按钮和标签
echo.
echo ========================================
echo.

start http://localhost:3000/iching.html

echo.
echo ✅ 已打开易经页面
echo.
echo 💡 提示：
echo    - 使用右上角的语言选择器切换语言
echo    - 检查所有文本是否正确翻译
echo    - 如果服务器未启动，请先运行 start.bat
echo.
pause
