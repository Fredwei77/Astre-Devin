@echo off
chcp 65001 >nul
echo.
echo ========================================
echo   占卜页面AI翻译测试
echo   Divination Page AI Translation Test
echo ========================================
echo.
echo 📋 测试步骤 / Test Steps:
echo.
echo 1. 打开占卜页面 / Open Divination page
echo    http://localhost:3000/divination.html
echo.
echo 2. 测试中文占卜分析 / Test Chinese Divination:
echo    - 确保语言选择器设置为"简体中文"
echo    - 填写出生信息（日期、时间、地点、性别）
echo    - 选择关注领域（事业、财运、爱情、健康）
echo    - 点击"分析我的命运"按钮
echo    - ✅ 验证：所有分析结果都是中文
echo      * 性格特质：富有创造力和直觉思维...
echo      * 事业展望：创意领域有出色机会...
echo      * 财运分析：正财运势稳定上升...
echo      * 感情关系：忠诚且专一的伴侣...
echo      * 健康建议：整体健康状况良好...
echo      * 生肖分析：您的生肖特征显示...
echo      * 年度运势：2024年整体运势上扬...
echo.
echo 3. 测试英文占卜分析 / Test English Divination:
echo    - 切换语言选择器到"English"
echo    - 填写出生信息
echo    - 选择关注领域（Career, Wealth, Love, Health）
echo    - 点击"Analyze My Destiny"按钮
echo    - ✅ 验证：所有分析结果都是英文
echo      * Personality Traits: Creative and intuitive thinker...
echo      * Career Outlook: Outstanding opportunities in creative fields...
echo      * Wealth Analysis: Steady rise in regular income...
echo      * Relationships: Loyal and devoted partner...
echo      * Health Advice: Overall health status is good...
echo      * Zodiac Analysis: Your zodiac characteristics show...
echo      * Year Forecast: 2024 overall fortune is rising...
echo.
echo 4. 测试中文追问 / Test Chinese Followup:
echo    - 在中文模式下完成占卜分析
echo    - 滚动到底部的"深挖真相"区域
echo    - ✅ 验证：建议问题按钮显示中文
echo      * "如何提升我的事业运势？"
echo      * "什么时候是换工作的最佳时机？"
echo    - 点击建议问题或输入自己的问题
echo    - 点击"🤖 AI 解答"按钮
echo    - ✅ 验证：AI返回的答案是中文
echo    - ✅ 验证：中文关键词（建议、注意、避免等）被高亮为金色
echo.
echo 5. 测试英文追问 / Test English Followup:
echo    - 在英文模式下完成占卜分析
echo    - 滚动到底部的"Dig Deeper"区域
echo    - ✅ 验证：建议问题按钮显示英文
echo      * "How can I improve my career fortune?"
echo      * "When is the best time to change jobs?"
echo    - 点击建议问题或输入英文问题
echo    - 点击"🤖 AI Answer"按钮
echo    - ✅ 验证：AI返回的答案是英文
echo    - ✅ 验证：英文关键词（Recommend, Avoid, Enhance等）被高亮为金色
echo.
echo 6. 测试语言切换 / Test Language Switching:
echo    - 用中文完成分析 → 验证中文输出
echo    - 切换到英文
echo    - 重新执行分析 → 验证英文输出
echo    - ✅ 验证：建议问题按钮也更新为英文
echo.
echo 7. 检查控制台日志 / Check Console Logs:
echo    - 打开浏览器开发者工具（F12）
echo    - 查看控制台
echo    - 应该看到：🌐 Divination analysis language: en 或 zh
echo.
echo ========================================
echo   预期结果 / Expected Results
echo ========================================
echo.
echo ✅ 中文模式：
echo    性格特质：
echo    - 富有创造力和直觉思维
echo    - 天生的领导才能
echo    - 强烈的责任感
echo.
echo    事业展望：
echo    - 创意领域有出色机会
echo    - 领导职位潜力巨大
echo    - 2024年财务前景良好
echo.
echo    追问建议：
echo    - 如何提升我的事业运势？
echo    - 什么时候是换工作的最佳时机？
echo.
echo ✅ 英文模式：
echo    Personality Traits:
echo    - Creative and intuitive thinker
echo    - Natural leadership talent
echo    - Strong sense of responsibility
echo.
echo    Career Outlook:
echo    - Outstanding opportunities in creative fields
echo    - Great potential for leadership positions
echo    - Positive financial prospects in 2024
echo.
echo    Followup Suggestions:
echo    - How can I improve my career fortune?
echo    - When is the best time to change jobs?
echo.
echo ========================================
echo   常见问题 / Common Issues
echo ========================================
echo.
echo Q: AI分析结果还是中文？
echo A: 1. 确认语言选择器已切换到English
echo    2. 清除浏览器缓存（Ctrl+Shift+Delete）
echo    3. 刷新页面（Ctrl+F5）
echo    4. 重新填写信息并执行分析
echo.
echo Q: 追问建议没有更新？
echo A: 1. 检查是否已完成占卜分析
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

start http://localhost:3000/divination.html
node server.js
