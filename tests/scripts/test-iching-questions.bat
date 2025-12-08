@echo off
chcp 65001 >nul
echo.
echo ========================================
echo   易经常见问题功能测试
echo ========================================
echo.
echo 正在打开易经页面...
echo.
echo 新增功能：
echo   ✓ 8个常见问题标签
echo   ✓ 点击快速填入问题
echo   ✓ 可以继续编辑问题
echo   ✓ 支持多语言切换
echo.
echo 常见问题列表：
echo   1. 我应该换工作吗？
echo   2. 这段感情能长久吗？
echo   3. 这个项目能成功吗？
echo   4. 我该如何改善财运？
echo   5. 现在是创业的好时机吗？
echo   6. 我和TA的关系会如何发展？
echo   7. 我该选择哪个方向发展？
echo   8. 如何化解当前的困境？
echo.
echo ========================================
echo.

start http://localhost:3000/iching.html

echo.
echo ✅ 已打开易经页面
echo.
echo 💡 测试步骤：
echo    1. 查看问题输入框下方的常见问题标签
echo    2. 点击任意问题标签
echo    3. 确认问题自动填入输入框
echo    4. 尝试编辑填入的问题
echo    5. 测试语言切换功能
echo.
pause
