@echo off
chcp 65001 >nul
echo.
echo ========================================
echo   易经AI追问功能测试
echo ========================================
echo.
echo 正在打开易经页面...
echo.
echo 新增功能：
echo   ✓ AI追问对话框
echo   ✓ 智能建议问题
echo   ✓ 基于占卜结果生成追问
echo   ✓ 实时AI解答
echo.
echo 功能特点：
echo   • 根据原始问题类型生成建议
echo   • 事业、感情、财运等分类建议
echo   • 点击快速填入追问
echo   • AI实时解答追问
echo.
echo ========================================
echo.

start http://localhost:3000/iching.html

echo.
echo ✅ 已打开易经页面
echo.
echo 💡 测试步骤：
echo    1. 完成一次易经占卜
echo    2. 查看结果页面底部的追问区域
echo    3. 查看根据问题生成的建议追问
echo    4. 点击建议或输入自定义追问
echo    5. 点击"AI解答"获取回答
echo.
pause
