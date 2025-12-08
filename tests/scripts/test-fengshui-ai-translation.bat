@echo off
chcp 65001 >nul
echo.
echo ========================================
echo   风水AI翻译测试
echo   Feng Shui AI Translation Test
echo ========================================
echo.
echo 📋 测试步骤 / Test Steps:
echo.
echo 1. 打开风水页面 / Open Feng Shui page
echo    http://localhost:3000/fengshui.html
echo.
echo 2. 测试中文AI输出 / Test Chinese AI Output:
echo    - 确保语言选择器设置为"简体中文"
echo    - 点击"分析"按钮执行风水分析
echo    - ✅ 验证：方位分析、建议、幸运物品、禁忌都是中文
echo.
echo 3. 测试英文AI输出 / Test English AI Output:
echo    - 切换语言选择器到"English"
echo    - 再次点击"分析"按钮
echo    - ✅ 验证：方位分析、建议、幸运物品、禁忌都是英文
echo.
echo 4. 测试语言切换 / Test Language Switching:
echo    - 在中文和英文之间多次切换
echo    - 每次切换后重新执行分析
echo    - ✅ 验证：AI输出语言与界面语言一致
echo.
echo 5. 检查控制台日志 / Check Console Logs:
echo    - 打开浏览器开发者工具（F12）
echo    - 查看控制台
echo    - ✅ 应该看到：🌐 Feng Shui analysis language: en 或 zh
echo.
echo ========================================
echo   预期结果 / Expected Results
echo ========================================
echo.
echo ✅ 中文模式：
echo    - 方位分析：当前方位属于吉位，有利于...
echo    - 建议标题：增加水元素、提升火能量...
echo    - 幸运物品：红灯笼、幸运竹、龙雕像...
echo    - 禁忌：避免床头对门、不要在财位堆放杂物...
echo.
echo ✅ 英文模式：
echo    - Direction Analysis: The current direction is auspicious...
echo    - Recommendation Titles: Add Water Element, Increase Fire Energy...
echo    - Lucky Items: Red Lantern, Lucky Bamboo, Dragon Statue...
echo    - Taboos: Avoid bed facing door, Keep wealth corner clutter-free...
echo.
echo ========================================
echo.
echo 按任意键启动服务器并打开测试页面...
pause >nul

start http://localhost:3000/fengshui.html
node server.js
