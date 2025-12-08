@echo off
chcp 65001 >nul
echo.
echo ========================================
echo   API接入修复测试
echo ========================================
echo.
echo 正在打开API测试页面...
echo.

start http://localhost:3000/test-api-connection.html

echo.
echo ✅ 已打开API测试页面
echo.
echo 📋 测试步骤：
echo    1. 点击"测试服务器健康"检查服务器状态
echo    2. 点击"测试AI连接"验证AI服务
echo    3. 点击"测试占卜API"测试占卜功能
echo    4. 点击"测试风水API"测试风水功能
echo    5. 点击"测试易经API"测试易经功能
echo.
echo 💡 提示：
echo    - 确保服务器已启动（运行 start.bat）
echo    - 查看测试日志了解详细信息
echo    - 如果测试失败，检查.env中的API密钥
echo.
pause
