@echo off
chcp 65001 >nul
echo.
echo ========================================
echo   风水追问对话框翻译测试
echo   Feng Shui Followup Dialog Translation Test
echo ========================================
echo.
echo 📋 测试步骤 / Test Steps:
echo.
echo 1. 打开风水页面 / Open Feng Shui page
echo    http://localhost:3000/fengshui.html
echo.
echo 2. 执行风水分析 / Perform Feng Shui Analysis
echo    - 点击"分析"按钮
echo    - 等待分析结果显示
echo.
echo 3. 测试中文追问 / Test Chinese Followup:
echo    - 确保语言选择器设置为"简体中文"
echo    - 滚动到页面底部的"替代方案咨询"区域
echo    - ✅ 验证：建议问题按钮显示中文
echo    - 点击任意建议问题或输入自己的问题
echo    - 点击"🤖 AI 解答"按钮
echo    - ✅ 验证：AI返回的答案是中文
echo    - ✅ 验证：中文关键词（建议、避免、东、南、木、火等）被高亮为金色
echo.
echo 4. 测试英文追问 / Test English Followup:
echo    - 切换语言选择器到"English"
echo    - ✅ 验证：建议问题按钮自动切换为英文
echo    - 点击任意建议问题或输入英文问题
echo    - 点击"🤖 AI Answer"按钮
echo    - ✅ 验证：AI返回的答案是英文
echo    - ✅ 验证：英文关键词（Recommend, Avoid, East, South, Wood, Fire等）被高亮为金色
echo.
echo 5. 测试语言切换 / Test Language Switching:
echo    - 在中文和英文之间多次切换
echo    - ✅ 验证：建议问题按钮立即更新
echo    - 每次切换后提交新问题
echo    - ✅ 验证：AI答案语言与界面语言一致
echo.
echo 6. 检查控制台日志 / Check Console Logs:
echo    - 打开浏览器开发者工具（F12）
echo    - 查看控制台
echo    - 提交追问时应该看到请求日志
echo.
echo ========================================
echo   预期结果 / Expected Results
echo ========================================
echo.
echo ✅ 中文模式：
echo    建议问题：
echo    - "如何改善我的财位布局？"
echo    - "卧室应该如何摆放才能提升睡眠质量？"
echo    - "办公桌的最佳朝向是什么？"
echo.
echo    AI答案示例：
echo    - "根据您的风水分析结果，建议您..."
echo    - "财位布局需要注意以下几点..."
echo    - "避免在财位堆放杂物..."
echo    - 关键词"建议"、"避免"、"东"、"南"等被高亮
echo.
echo ✅ 英文模式：
echo    Suggested Questions:
echo    - "How can I improve my wealth corner layout?"
echo    - "How should I arrange my bedroom for better sleep?"
echo    - "What's the best direction for my desk?"
echo.
echo    AI Answer Example:
echo    - "Based on your Feng Shui analysis results, I recommend..."
echo    - "For wealth corner layout, consider the following..."
echo    - "Avoid placing clutter in the wealth area..."
echo    - Keywords "Recommend", "Avoid", "East", "South" etc. are highlighted
echo.
echo ========================================
echo   常见问题 / Common Issues
echo ========================================
echo.
echo Q: AI答案还是中文？
echo A: 1. 确认语言选择器已切换到English
echo    2. 清除浏览器缓存（Ctrl+Shift+Delete）
echo    3. 刷新页面（Ctrl+F5）
echo    4. 重新执行分析和追问
echo.
echo Q: 建议问题没有更新？
echo A: 1. 检查是否已执行风水分析
echo    2. 切换语言后等待1-2秒
echo    3. 如果还是没更新，刷新页面重试
echo.
echo Q: 关键词没有高亮？
echo A: 1. 检查AI答案是否包含关键词
echo    2. 确认答案语言与界面语言一致
echo    3. 查看浏览器控制台是否有错误
echo.
echo ========================================
echo.
echo 按任意键启动服务器并打开测试页面...
pause >nul

start http://localhost:3000/fengshui.html
node server.js
